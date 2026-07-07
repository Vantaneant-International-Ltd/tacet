// Defensive accessors for ActivityStreams / JSON-LD. Every property in AP can arrive as
// a scalar, an object, or an array of either, with values sometimes wrapped as language
// maps or Link objects. These helpers normalize that mess so the rest of the core reads
// cleanly. Nothing here is vendor-specific — it's the shape of the protocol itself.

export function asArray<T>(x: T | T[] | undefined | null): T[] {
  if (x == null) return [];
  return Array.isArray(x) ? x : [x];
}

// A string from a value that may be a plain string, a {"@value"|value|content|name}
// object, or an array of those. Returns the first usable string.
export function firstString(x: unknown): string | undefined {
  for (const v of asArray(x as any)) {
    if (typeof v === "string") return v;
    if (v && typeof v === "object") {
      const o = v as Record<string, unknown>;
      const cand = o["@value"] ?? o["value"] ?? o["content"] ?? o["name"] ?? o["href"];
      if (typeof cand === "string") return cand;
    }
  }
  return undefined;
}

// An href from an AP `url` (string | Link | array of Links). Prefers an HTML page link.
export function pickUrl(url: unknown): string | undefined {
  const links = asArray(url as any);
  // Prefer an explicit text/html link (Mastodon/PeerTube expose several).
  for (const l of links) {
    if (l && typeof l === "object") {
      const o = l as Record<string, unknown>;
      if ((o["mediaType"] === "text/html" || o["type"] === "Link") && typeof o["href"] === "string") {
        return o["href"] as string;
      }
    }
  }
  return firstString(url);
}

// The best image URL from an AP `icon`/`image` (Image object | array | string).
export function pickImageUrl(icon: unknown): string | null {
  for (const i of asArray(icon as any)) {
    if (typeof i === "string") return i;
    if (i && typeof i === "object") {
      const u = firstString((i as Record<string, unknown>)["url"]);
      if (u) return u;
    }
  }
  return null;
}

// The host of an id/url, used to build @user@host handles without vendor knowledge.
export function hostOf(idOrUrl: string | undefined): string {
  if (!idOrUrl) return "";
  try {
    return new URL(idOrUrl).host;
  } catch {
    return "";
  }
}

export function isRecord(x: unknown): x is Record<string, unknown> {
  return !!x && typeof x === "object" && !Array.isArray(x);
}
