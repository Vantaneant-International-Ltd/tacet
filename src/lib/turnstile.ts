import type { Env } from "../types";

// Cloudflare Turnstile (Amendment 2). Registration is challenge-gated only when a secret is
// configured, so local dev and tests run without keys. When configured, an absent or invalid
// token is rejected.
export function turnstileEnabled(env: Env): boolean {
  return Boolean(env.TURNSTILE_SECRET);
}

export async function verifyTurnstile(env: Env, token: unknown, ip: string | null): Promise<boolean> {
  if (!turnstileEnabled(env)) return true; // no keys → not enforced
  if (typeof token !== "string" || token.length === 0) return false;
  const body = new FormData();
  body.set("secret", env.TURNSTILE_SECRET!);
  body.set("response", token);
  if (ip) body.set("remoteip", ip);
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body,
  });
  const data = (await res.json().catch(() => null)) as { success?: boolean } | null;
  return Boolean(data?.success);
}
