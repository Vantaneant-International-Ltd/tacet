import { SELF } from "cloudflare:test";

const ORIGIN = "https://tacet.test";

interface Opts {
  method?: string;
  body?: unknown;
  form?: FormData;
  cookie?: string | null;
}

// One request against the real worker. JSON in, Response out.
export async function req(path: string, opts: Opts = {}): Promise<Response> {
  const headers: Record<string, string> = {};
  if (opts.cookie) headers.cookie = opts.cookie;
  let body: BodyInit | undefined;
  if (opts.form) {
    body = opts.form;
  } else if (opts.body !== undefined) {
    headers["content-type"] = "application/json";
    body = JSON.stringify(opts.body);
  }
  return SELF.fetch(`${ORIGIN}${path}`, { method: opts.method ?? "GET", headers, body });
}

// The session cookie (name=value) from a Set-Cookie header, or null.
export function cookieOf(res: Response): string | null {
  const sc = res.headers.get("set-cookie");
  return sc ? sc.split(";")[0] : null;
}

// Register the first account (bootstrap admin) and return its session cookie.
export async function registerAdmin(handle = "ren", passphrase = "a-quiet-passphrase"): Promise<string> {
  const res = await req("/api/auth/register", { method: "POST", body: { handle, passphrase } });
  const cookie = cookieOf(res);
  if (!cookie) throw new Error("no admin session cookie");
  return cookie;
}

// Mint an invite as admin, register a second account with it, return its cookie.
export async function registerInvited(
  adminCookie: string,
  handle: string,
  passphrase = "another-secret-pass",
): Promise<string> {
  const mint = await req("/api/invites", { method: "POST", cookie: adminCookie });
  const { invite } = (await mint.json()) as { invite: { code: string } };
  const res = await req("/api/auth/register", {
    method: "POST",
    body: { handle, passphrase, invite: invite.code },
  });
  const cookie = cookieOf(res);
  if (!cookie) throw new Error("no invited session cookie");
  return cookie;
}
