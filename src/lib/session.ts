import type { Context, MiddlewareHandler } from "hono";
import { getCookie, setCookie, deleteCookie } from "hono/cookie";
import type { Env, SessionUser, Variables } from "../types";

// Sessions are stateless signed cookies: `<userId>.<hmac>`. This keeps the database
// exactly at the §7 data model (no sessions table). Logout clears the cookie.
const COOKIE = "tacet_session";

// Local-dev fallback secret. Phase 2 MUST set a real SESSION_SECRET binding before deploy
// (recorded in STATE.md under "awaiting Ren").
const DEV_SECRET = "tacet-dev-only-secret-not-for-deploy";

function secretOf(env: Env): string {
  return env.SESSION_SECRET && env.SESSION_SECRET.length > 0 ? env.SESSION_SECRET : DEV_SECRET;
}

function toHex(buf: ArrayBuffer): string {
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function sign(userId: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(userId));
  return toHex(sig);
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function issueSession(c: Context<{ Bindings: Env; Variables: Variables }>, userId: string) {
  const token = `${userId}.${await sign(userId, secretOf(c.env))}`;
  const secure = new URL(c.req.url).protocol === "https:";
  setCookie(c, COOKIE, token, {
    httpOnly: true,
    secure,
    sameSite: "Lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}

export function clearSession(c: Context<{ Bindings: Env; Variables: Variables }>) {
  deleteCookie(c, COOKIE, { path: "/" });
}

async function readUserId(c: Context<{ Bindings: Env; Variables: Variables }>): Promise<string | null> {
  const raw = getCookie(c, COOKIE);
  if (!raw) return null;
  const dot = raw.lastIndexOf(".");
  if (dot <= 0) return null;
  const userId = raw.slice(0, dot);
  const sig = raw.slice(dot + 1);
  const expected = await sign(userId, secretOf(c.env));
  return timingSafeEqual(sig, expected) ? userId : null;
}

// Populates c.var.user (or null) on every request. Never throws on a bad/absent cookie.
export const sessionMiddleware: MiddlewareHandler<{ Bindings: Env; Variables: Variables }> = async (c, next) => {
  c.set("user", null);
  const userId = await readUserId(c);
  if (userId) {
    const row = await c.env.DB.prepare("SELECT id, handle, is_admin FROM users WHERE id = ?")
      .bind(userId)
      .first<{ id: string; handle: string; is_admin: number }>();
    if (row) {
      const user: SessionUser = { id: row.id, handle: row.handle, is_admin: row.is_admin === 1 };
      c.set("user", user);
    }
  }
  await next();
};

// Guards for routes that require a signed-in user / an admin.
export function requireUser(c: Context<{ Bindings: Env; Variables: Variables }>): SessionUser {
  const user = c.get("user");
  if (!user) throw new HttpError(401, "sign in required");
  return user;
}

export function requireAdmin(c: Context<{ Bindings: Env; Variables: Variables }>): SessionUser {
  const user = requireUser(c);
  if (!user.is_admin) throw new HttpError(403, "admins only");
  return user;
}

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}
