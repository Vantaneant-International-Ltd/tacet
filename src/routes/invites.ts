import { Hono } from "hono";
import type { Env, Variables } from "../types";
import { requireUser } from "../lib/session";

// Human-readable invite code: three groups of four Crockford base32 characters.
const ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
function mintCode(): string {
  const bytes = new Uint8Array(12);
  crypto.getRandomValues(bytes);
  const chars = [...bytes].map((b) => ALPHABET[b % 32]);
  return `${chars.slice(0, 4).join("")}-${chars.slice(4, 8).join("")}-${chars.slice(8, 12).join("")}`;
}

export const inviteRoutes = new Hono<{ Bindings: Env; Variables: Variables }>();

// Mint a fresh invite code. Any member may invite (Amendment 2) — the house fills through
// its people, and every code is tied to whoever minted it.
inviteRoutes.post("/", async (c) => {
  const user = requireUser(c);
  const code = mintCode();
  const now = new Date().toISOString();
  await c.env.DB.prepare("INSERT INTO invites (code, created_by, created_at) VALUES (?, ?, ?)")
    .bind(code, user.id, now)
    .run();
  return c.json({ invite: { code, created_at: now, used: false, used_by: null } }, 201);
});

// List invite codes, newest first, showing which were used and by whom. A member sees the
// invites they minted; an admin sees every invite in the house.
inviteRoutes.get("/", async (c) => {
  const user = requireUser(c);
  const base = `SELECT i.code, i.created_at, i.used_at, u.handle AS used_by
     FROM invites i LEFT JOIN users u ON u.id = i.used_by`;
  const stmt = user.is_admin
    ? c.env.DB.prepare(`${base} ORDER BY i.created_at DESC, i.code DESC`)
    : c.env.DB.prepare(`${base} WHERE i.created_by = ? ORDER BY i.created_at DESC, i.code DESC`).bind(user.id);
  const rows = await stmt.all<{ code: string; created_at: string; used_at: string | null; used_by: string | null }>();
  return c.json({
    invites: rows.results.map((r) => ({
      code: r.code,
      created_at: r.created_at,
      used: r.used_by !== null,
      used_by: r.used_by,
      used_at: r.used_at,
    })),
  });
});
