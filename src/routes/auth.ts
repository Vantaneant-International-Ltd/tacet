import { Hono } from "hono";
import type { Env, Variables } from "../types";
import { ulid } from "../lib/ulid";
import { hashPassphrase, verifyPassphrase } from "../lib/passphrase";
import { issueSession, clearSession, requireUser, HttpError } from "../lib/session";
import { verifyTurnstile } from "../lib/turnstile";

const HANDLE_RE = /^[a-z0-9][a-z0-9_-]{1,29}$/;

function validateHandle(raw: unknown): string {
  if (typeof raw !== "string") throw new HttpError(400, "handle is required");
  const handle = raw.trim().toLowerCase();
  if (!HANDLE_RE.test(handle)) {
    throw new HttpError(400, "handle must be 2–30 characters: lowercase letters, numbers, - or _");
  }
  return handle;
}

function validatePassphrase(raw: unknown): string {
  if (typeof raw !== "string") throw new HttpError(400, "passphrase is required");
  if (raw.length < 8) throw new HttpError(400, "passphrase must be at least 8 characters");
  if (raw.length > 200) throw new HttpError(400, "passphrase is too long");
  return raw;
}

export const authRoutes = new Hono<{ Bindings: Env; Variables: Variables }>();

// The current user, or null. Used by the SPA to decide what to render.
authRoutes.get("/me", (c) => {
  return c.json({ user: c.get("user") });
});

// Register with an invite code. Bootstrap rule: if there are no users yet, the first
// registration needs no invite and becomes the admin (this is how Ren's account is made).
authRoutes.post("/register", async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const handle = validateHandle(body.handle);
  const passphrase = validatePassphrase(body.passphrase);

  // Turnstile (enforced only when configured). Rejects bots at the door in production.
  const ip = c.req.header("cf-connecting-ip") ?? null;
  if (!(await verifyTurnstile(c.env, body.turnstile_token, ip))) {
    throw new HttpError(400, "the challenge did not pass; please try again");
  }

  const existing = await c.env.DB.prepare("SELECT id FROM users WHERE handle = ?").bind(handle).first();
  if (existing) throw new HttpError(409, "that handle is taken");

  const { count } = (await c.env.DB.prepare("SELECT COUNT(*) AS count FROM users").first<{ count: number }>())!;
  const isBootstrap = count === 0;

  let inviteCode: string | null = null;
  if (!isBootstrap) {
    const code = typeof body.invite === "string" ? body.invite.trim() : "";
    if (!code) throw new HttpError(400, "an invite code is required");
    const invite = await c.env.DB.prepare("SELECT code, used_by FROM invites WHERE code = ?")
      .bind(code)
      .first<{ code: string; used_by: string | null }>();
    if (!invite || invite.used_by) throw new HttpError(400, "that invite code is not valid");
    inviteCode = invite.code;
  }

  const now = new Date().toISOString();
  const userId = ulid();
  const passphrase_hash = hashPassphrase(passphrase);

  const rooms = await c.env.DB.prepare("SELECT id FROM rooms").all<{ id: string }>();

  const stmts = [
    c.env.DB.prepare(
      "INSERT INTO users (id, handle, passphrase_hash, created_at, is_admin) VALUES (?, ?, ?, ?, ?)",
    ).bind(userId, handle, passphrase_hash, now, isBootstrap ? 1 : 0),
  ];
  if (inviteCode) {
    stmts.push(
      c.env.DB.prepare("UPDATE invites SET used_by = ?, used_at = ? WHERE code = ? AND used_by IS NULL").bind(
        userId,
        now,
        inviteCode,
      ),
    );
  }
  for (const r of rooms.results) {
    stmts.push(
      c.env.DB.prepare("INSERT INTO memberships (user_id, room_id, joined_at) VALUES (?, ?, ?)").bind(
        userId,
        r.id,
        now,
      ),
    );
  }
  await c.env.DB.batch(stmts);

  await issueSession(c, userId);
  return c.json({ user: { id: userId, handle, is_admin: isBootstrap, is_private: false } }, 201);
});

// Update account settings (currently: private account toggle).
authRoutes.put("/settings", async (c) => {
  const user = requireUser(c);
  const body = await c.req.json().catch(() => ({}));
  const isPrivate = body.is_private === true ? 1 : 0;
  await c.env.DB.prepare("UPDATE users SET is_private = ? WHERE id = ?").bind(isPrivate, user.id).run();
  return c.json({ user: { ...user, is_private: isPrivate === 1 } });
});

authRoutes.post("/login", async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const handle = typeof body.handle === "string" ? body.handle.trim().toLowerCase() : "";
  const passphrase = typeof body.passphrase === "string" ? body.passphrase : "";
  if (!handle || !passphrase) throw new HttpError(400, "handle and passphrase are required");

  const row = await c.env.DB.prepare(
    "SELECT id, handle, passphrase_hash, is_admin, is_private FROM users WHERE handle = ?",
  )
    .bind(handle)
    .first<{ id: string; handle: string; passphrase_hash: string; is_admin: number; is_private: number }>();

  // Same response whether the handle is unknown or the passphrase is wrong.
  if (!row || !verifyPassphrase(passphrase, row.passphrase_hash)) {
    throw new HttpError(401, "wrong handle or passphrase");
  }

  await issueSession(c, row.id);
  return c.json({
    user: { id: row.id, handle: row.handle, is_admin: row.is_admin === 1, is_private: row.is_private === 1 },
  });
});

authRoutes.post("/logout", (c) => {
  requireUser(c);
  clearSession(c);
  return c.json({ ok: true });
});

// Read / edit your own profile (display name + bio).
authRoutes.get("/profile", async (c) => {
  const user = requireUser(c);
  const row = await c.env.DB.prepare("SELECT display_name, bio FROM users WHERE id = ?")
    .bind(user.id)
    .first<{ display_name: string | null; bio: string | null }>();
  return c.json({ handle: user.handle, display_name: row?.display_name ?? null, bio: row?.bio ?? null });
});

authRoutes.put("/profile", async (c) => {
  const user = requireUser(c);
  const body = await c.req.json().catch(() => ({}));
  const display_name = typeof body.display_name === "string" ? body.display_name.trim().slice(0, 60) : "";
  const bio = typeof body.bio === "string" ? body.bio.trim().slice(0, 280) : "";
  await c.env.DB.prepare("UPDATE users SET display_name = ?, bio = ? WHERE id = ?")
    .bind(display_name || null, bio || null, user.id)
    .run();
  return c.json({ handle: user.handle, display_name: display_name || null, bio: bio || null });
});
