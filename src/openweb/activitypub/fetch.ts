// The one network primitive for ActivityPub reads. Unauthenticated GET with the AP
// content type, a timeout, and a response-size guard. Read-only by construction — this
// module has no way to POST, sign, or authenticate.
//
// Note on "authorized fetch": some homes (e.g. Mastodon in secure mode) require an
// HTTP-signed GET even for public objects and will answer 401/403 here. That is expected
// and handled by degradation upstream (skip that actor/object, fall back) — we never
// hold a user identity, so we simply can't read those. Documented in README.

const AP_ACCEPT =
  'application/activity+json, application/ld+json; profile="https://www.w3.org/ns/activitystreams", application/json';
const MAX_BYTES = 2_000_000; // guard against absurd payloads
const DEFAULT_TIMEOUT = 8000;

export class ApFetchError extends Error {
  constructor(message: string, readonly status?: number) {
    super(message);
  }
}

export async function fetchAp(url: string, timeoutMs = DEFAULT_TIMEOUT): Promise<unknown> {
  let res: Response;
  try {
    res = await fetch(url, {
      headers: { accept: AP_ACCEPT, "user-agent": "Tacet (+https://tacet.social)" },
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
