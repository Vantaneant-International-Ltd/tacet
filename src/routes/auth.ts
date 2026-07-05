import { Hono } from "hono";
import type { Env, Variables } from "../types";
import { ulid } from "../lib/ulid";
import { hashPassphrase, verifyPassphrase } from "../lib/passphrase";
import { issueSession, clearSession, requireUser, HttpError } from "../lib/session";

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
  return c.json({ user: { id: userId, handle, is_admin: isBootstrap } }, 201);
});

authRoutes.post("/login", async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const handle = typeof body.handle === "string" ? body.handle.trim().toLowerCase() : "";
  const passphrase = typeof body.passphrase === "string" ? body.passphrase : "";
  if (!handle || !passphrase) throw new HttpError(400, "handle and passphrase are required");

  const row = await c.env.DB.prepare("SELECT id, handle, passphrase_hash, is_admin FROM users WHERE handle = ?")
    .bind(handle)
    .first<{ id: string; handle: string; passphrase_hash: string; is_admin: number }>();

  // Same response whether the handle is unknown or the passphrase is wrong.
  if (!row || !verifyPassphrase(passphrase, row.passphrase_hash)) {
    throw new HttpError(401, "wrong handle or passphrase");
  }

  await issueSession(c, row.id);
  return c.json({ user: { id: row.id, handle: row.handle, is_admin: row.is_admin === 1 } });
});

authRoutes.post("/logout", (c) => {
  requireUser(c);
  clearSession(c);
  return c.json({ ok: true });
});
