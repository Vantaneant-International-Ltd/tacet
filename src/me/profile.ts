import type { Context } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import type { Env, Variables } from "../types";
import { ulid } from "../lib/ulid";
import { getProfileRow, createProfile } from "./repo";
import type { Profile } from "./types";

// The local, passwordless identity for Me. A signed cookie `<profileId>.<hmac>` binds a
// device to one local profile. This is NOT remote authentication and NOT a federation
// identity — it is simply "whose home is this" inside Tacet. Future multi-account auth
// can build on the me_profiles table without changing callers.
const COOKIE = "tacet_me";
const DEV_SECRET = "tacet-dev-only-secret-not-for-deploy";

function secretOf(env: Env): string {
  return env.SESSION_SECRET && env.SESSION_SECRET.length > 0 ? env.SESSION_SECRET : DEV_SECRET;
}

async function sign(id: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(id));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

type Ctx = Context<{ Bindings: Env; Variables: Variables }>;

async function readProfileId(c: Ctx): Promise<string | null> {
  const raw = getCookie(c, COOKIE);
  if (!raw) return null;
  const dot = raw.lastIndexOf(".");
  if (dot <= 0) return null;
  const id = raw.slice(0, dot);
  const expected = await sign(id, secretOf(c.env));
  return timingSafeEqual(raw.slice(dot + 1), expected) ? id : null;
}

async function setProfileCookie(c: Ctx, id: string) {
  const token = `${id}.${await sign(id, secretOf(c.env))}`;
  setCookie(c, COOKIE, token, {
    httpOnly: true,
    secure: new URL(c.req.url).protocol === "https:",
    sameSite: "Lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // a year — this is a home, not a session
  });
}

// The current device's local profile, creating one on first visit. Every Me route calls
// this; the cookie makes it stable across visits.
export async function currentProfile(c: Ctx): Promise<Profile> {
  const id = await readProfileId(c);
  if (id) {
    const existing = await getProfileRow(c.env.DB, id);
    if (existing) return existing;
  }
  const now = new Date().toISOString();
  const profile = await createProfile(c.env.DB, ulid(), now);
  await setProfileCookie(c, profile.id);
  return profile;
}
