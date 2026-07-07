import { asArray, isRecord } from "./jsonld";

// WebFinger resolves a human handle (@user@home) to a machine actor document URL. This
// is how the open social web turns an email-shaped address into something fetchable —
// the same across every ActivityPub implementation.

const TIMEOUT = 6000;

export function parseHandle(handle: string): { user: string; host: string } {
  const h = handle.trim().replace(/^@/, "");
  const at = h.lastIndexOf("@");
  if (at <= 0) throw new Error(`not a handle: ${handle}`);
  return { user: h.slice(0, at), host: h.slice(at + 1) };
}

// Given "@user@host", return the actor document URL (rel=self, activity+json).
export async function resolveActorUrl(handle: string): Promise<string> {
  const { user, host } = parseHandle(handle);
  const url = `https://${host}/.well-known/webfinger?resource=${encodeURIComponent(`acct:${user}@${host}`)}`;
  const res = await fetch(url, {
    headers: { accept: "application/jrd+json, application/json" },
    signal: AbortSignal.timeout(TIMEOUT),
    cf: { cacheTtl: 300, cacheEverything: true },
  } as RequestInit);
  if (!res.ok) throw new Error(`webfinger ${res.status}`);
  const jrd = (await res.json()) as unknown;
  const links = isRecord(jrd) ? asArray(jrd["links"]) : [];
  for (const link of links) {
    if (
      isRecord(link) &&
      link["rel"] === "self" &&
      typeof link["type"] === "string" &&
      /activity\+json|ld\+json/.test(link["type"]) &&
      typeof link["href"] === "string"
    ) {
      return link["href"] as string;
    }
  }
  throw new Error("no actor link in webfinger response");
}

// Handles may be given as "@user@host" or already as an actor URL. Detect which.
export function looksLikeUrl(s: string): boolean {
  return /^https?:\/\//i.test(s);
}
