// nodeinfo discovery: identify the SOFTWARE a home runs, so the product can attribute
// where a person or post lives ("Mastodon", "Pixelfed", "PeerTube"…). nodeinfo is a
// small, public, cross-implementation standard — the reliable way to know a home's
// software without guessing from object shapes. Public, unauthenticated, read-only,
// cached per host. This says WHERE content lives, never HOW it travels (no protocol).

const cache = new Map<string, string | null>();

// Friendly product labels. Anything unknown is title-cased as a sensible fallback.
const LABELS: Record<string, string> = {
  mastodon: "Mastodon",
  pixelfed: "Pixelfed",
  peertube: "PeerTube",
  lemmy: "Lemmy",
  friendica: "Friendica",
  gotosocial: "GoToSocial",
  akkoma: "Akkoma",
  pleroma: "Pleroma",
  bookwyrm: "BookWyrm",
  writefreely: "WriteFreely",
  mobilizon: "Mobilizon",
  wordpress: "WordPress",
  "activitypub-plugin": "WordPress",
  ghost: "Ghost",
  owncast: "Owncast",
  misskey: "Misskey",
  firefish: "Firefish",
  sharkey: "Sharkey",
  iceshrimp: "Iceshrimp",
  hometown: "Mastodon",
  hubzilla: "Hubzilla",
  funkwhale: "Funkwhale",
};

export function labelForSoftware(name?: string): string | undefined {
  if (!name) return undefined;
  const key = name.toLowerCase();
  return LABELS[key] ?? key.charAt(0).toUpperCase() + key.slice(1);
}

async function fetchJson(url: string, timeoutMs = 5000): Promise<any> {
  const res = await fetch(url, {
    headers: { accept: "application/json" },
    signal: AbortSignal.timeout(timeoutMs),
    cf: { cacheTtl: 3600, cacheEverything: true },
  } as RequestInit);
  if (!res.ok) throw new Error(String(res.status));
  return res.json();
}

// Best-effort software label for a home. Never throws; caches misses too.
export async function softwareOf(host: string): Promise<string | undefined> {
  if (!host) return undefined;
  if (cache.has(host)) return cache.get(host) ?? undefined;
  try {
    const disc = await fetchJson(`https://${host}/.well-known/nodeinfo`);
    const links: any[] = Array.isArray(disc?.links) ? disc.links : [];
    const link = links.find((l) => typeof l?.href === "string" && /nodeinfo/i.test(String(l?.rel ?? ""))) ?? links[0];
    if (!link?.href) {
      cache.set(host, null);
      return undefined;
    }
    const info = await fetchJson(String(link.href));
    const label = labelForSoftware(typeof info?.software?.name === "string" ? info.software.name : undefined);
    cache.set(host, label ?? null);
    return label;
  } catch {
    cache.set(host, null);
    return undefined;
  }
}

// Test-only cache reset.
export function __resetNodeinfoCache() {
  cache.clear();
}
