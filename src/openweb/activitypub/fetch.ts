// The one network primitive for ActivityPub reads. GET with the AP content type, a
// timeout, and a response-size guard. Read-only by construction — this module can only
// GET; it never POSTs, delivers, or authenticates a user.
//
// Note on "authorized fetch": some homes (e.g. Mastodon in secure mode) require an
// HTTP-signed GET even for public objects and answer 401/403 otherwise. When a server
// signer is configured (see signing.ts) the GET is signed and those homes open up;
// otherwise we fall back to an unsigned GET and degrade gracefully upstream.

import type { RequestSigner } from "./signing";

const AP_ACCEPT =
  'application/activity+json, application/ld+json; profile="https://www.w3.org/ns/activitystreams", application/json';
const MAX_BYTES = 2_000_000; // guard against absurd payloads
const DEFAULT_TIMEOUT = 8000;

export class ApFetchError extends Error {
  constructor(message: string, readonly status?: number) {
    super(message);
  }
}

export async function fetchAp(
  url: string,
  opts: { signer?: RequestSigner; timeoutMs?: number } = {},
): Promise<unknown> {
  const timeoutMs = opts.timeoutMs ?? DEFAULT_TIMEOUT;
  const headers: Record<string, string> = {
    accept: AP_ACCEPT,
    "user-agent": "Tacet (+https://tacet.social)",
  };
  // Authorized fetch: sign the GET when a server signer is configured. Failure to sign
  // never blocks the request — we fall back to an unsigned GET.
  if (opts.signer) {
    try {
      Object.assign(headers, await opts.signer.sign("GET", url));
    } catch {
      /* proceed unsigned */
    }
  }
  let res: Response;
  try {
    res = await fetch(url, {
      headers,
      redirect: "follow",
      signal: AbortSignal.timeout(timeoutMs),
      cf: { cacheTtl: 120, cacheEverything: true },
    } as RequestInit);
  } catch (e) {
    throw new ApFetchError(e instanceof Error && /abort|timeout/i.test(e.message) ? "timeout" : "network");
  }
  if (!res.ok) throw new ApFetchError(`status ${res.status}`, res.status);

  const type = res.headers.get("content-type") || "";
  if (!/json/i.test(type)) throw new ApFetchError(`non-json content-type: ${type}`);

  const text = await res.text();
  if (text.length > MAX_BYTES) throw new ApFetchError("response too large");
  try {
    return JSON.parse(text);
  } catch {
    throw new ApFetchError("parse");
  }
}
