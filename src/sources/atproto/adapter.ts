// The AT Protocol (Bluesky) adapter. Read-only against the public appview
// (public.api.bsky.app) — no login, no auth, no firehose. Polls a small seed set of public
// accounts on the same cron as the other collectors and normalizes their posts into the
// domain. Human label: "on Bluesky" — never "AT Protocol", "AT-URI", or "PDS". See ADR-017.

import type { SourceAdapter, NormalizedPost, HealthReport, CollectContext, Person, Source } from "../contract";
import { canonicalUrl, nowIso } from "../contract";
import seedData from "./seeds.json";

const SEEDS = seedData as string[];
const APPVIEW = "https://public.api.bsky.app/xrpc";
const UA = "Tacet/0.1 (+https://tacet.social; open-web reader)";
const TIMEOUT_MS = 10_000;

const SOURCE_BASE: Source = { id: "bsky.app", name: "Bluesky", url: "https://bsky.app", software: "Bluesky", adapter: "atproto", iconUrl: "https://bsky.app/favicon.ico" };

// The raw shape we keep from a getAuthorFeed item — just the fields we map. Everything else
// (facets, langs, cids) stays inside this module.
export interface AtFeedItem {
  post: {
    uri: string;
    author: { did: string; handle: string; displayName?: string; avatar?: string; description?: string };
    record?: { text?: string; createdAt?: string };
    embed?: Record<string, unknown>;
    indexedAt?: string;
    replyCount?: number;
    repostCount?: number;
    likeCount?: number;
  };
  reason?: { $type?: string; by?: { did: string; handle: string; displayName?: string; avatar?: string } };
}

async function xrpc(method: string, params: Record<string, string>, signal?: AbortSignal): Promise<Record<string, unknown>> {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${APPVIEW}/${method}?${qs}`, {
    headers: { accept: "application/json", "user-agent": UA },
    signal: signal ?? AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`${method} → ${res.status}`);
  return (await res.json()) as Record<string, unknown>;
}

// resolve a handle to its DID (part of the AT Protocol contract; used for AT-URI mapping).
export async function resolveHandle(handle: string, signal?: AbortSignal): Promise<string | null> {
  try {
    const data = await xrpc("com.atproto.identity.resolveHandle", { handle }, signal);
    return typeof data.did === "string" ? data.did : null;
  } catch {
    return null;
  }
}

// at://did/app.bsky.feed.post/<rkey> → https://bsky.app/profile/<handle-or-did>/post/<rkey>
export function atUriToWebUrl(uri: string, handleOrDid: string): string {
  const m = /\/app\.bsky\.feed\.post\/([^/]+)$/.exec(uri);
  const rkey = m ? m[1] : uri.split("/").pop() || "";
  return `https://bsky.app/profile/${handleOrDid}/post/${rkey}`;
}

function bskyPerson(actor: { did: string; handle: string; displayName?: string; avatar?: string; description?: string }): Person {
  const url = `https://bsky.app/profile/${actor.handle || actor.did}`;
  return {
    id: url,
    name: actor.displayName || actor.handle,
    handle: `@${actor.handle}`,
    avatarUrl: actor.avatar ?? null,
    bio: actor.description ?? "",
    url,
    source: { ...SOURCE_BASE },
    verified: false,
  };
}

// Bluesky embeds → domain media. Images become images; a video becomes its thumbnail (an
// image), since HLS can't play in a plain <video> without a dependency — the card links out
// to watch. External link-cards and quote-posts contribute no media (the text carries them).
function mapEmbed(embed: Record<string, unknown> | undefined): NormalizedPost["media"] {
  if (!embed) return [];
  const type = String(embed["$type"] ?? "");
  const out: NormalizedPost["media"] = [];
  if (type.startsWith("app.bsky.embed.images")) {
    for (const img of (embed.images as Array<Record<string, unknown>>) ?? []) {
      const url = String(img.fullsize ?? img.thumb ?? "");
      if (url) out.push({ url, kind: "image", alt: String(img.alt ?? "") });
    }
  } else if (type.startsWith("app.bsky.embed.video")) {
    const thumb = String(embed.thumbnail ?? "");
    if (thumb) out.push({ url: thumb, kind: "image", alt: "video" });
  } else if (type.startsWith("app.bsky.embed.recordWithMedia")) {
    return mapEmbed(embed.media as Record<string, unknown> | undefined);
  }
  return out;
}

export class AtprotoAdapter implements SourceAdapter<AtFeedItem> {
  readonly id = "atproto";
  readonly transport = "pull" as const;
  readonly label = "Bluesky";

  async fetchLatest(ctx: CollectContext): Promise<AtFeedItem[]> {
    const per = Math.max(3, Math.min(10, ctx.limitPerSource));
    const settled = await Promise.allSettled(
      SEEDS.map(async (actor) => {
        const data = await xrpc("app.bsky.feed.getAuthorFeed", { actor, limit: String(per + 3), filter: "posts_no_replies" }, ctx.signal);
        return ((data.feed as AtFeedItem[]) ?? []).slice(0, per);
      }),
    );
    return settled.flatMap((r) => (r.status === "fulfilled" ? r.value : []));
  }

  normalize(raw: AtFeedItem): NormalizedPost | null {
    const post = raw.post;
    if (!post?.uri || !post.author) return null;
    const author = bskyPerson(post.author);
    const text = (post.record?.text ?? "").trim();
    const media = mapEmbed(post.embed);
    if (!text && media.length === 0) return null;
    const url = atUriToWebUrl(post.uri, post.author.handle || post.author.did);
    const m: NormalizedPost = {
      id: canonicalUrl(url) || post.uri,
      author,
      text,
      createdAt: post.record?.createdAt || post.indexedAt || "",
      url,
      media,
      source: { ...SOURCE_BASE },
      counts: countsOf(post),
    };
    // A repost reaches us via someone else's boost — attribute it like an Announce.
    if (raw.reason && String(raw.reason.$type).includes("reasonRepost") && raw.reason.by) {
      m.sharedBy = bskyPerson(raw.reason.by);
    }
    return m;
  }

  async healthcheck(): Promise<HealthReport> {
    const at = nowIso(Date.now());
    try {
      const data = await xrpc("app.bsky.actor.getProfile", { actor: SEEDS[0] });
      return { ok: !!data.did, detail: `getProfile ${SEEDS[0]} → ${data.did ? "ok" : "no did"}`, checkedAt: at };
    } catch (e) {
      return { ok: false, detail: `Bluesky appview unreachable: ${e instanceof Error ? e.message : String(e)}`, checkedAt: at };
    }
  }
}

function countsOf(post: AtFeedItem["post"]): NormalizedPost["counts"] {
  const c: NonNullable<NormalizedPost["counts"]> = {};
  if (typeof post.likeCount === "number") c.reactions = post.likeCount;
  if (typeof post.replyCount === "number") c.replies = post.replyCount;
  if (typeof post.repostCount === "number") c.shares = post.repostCount;
  return Object.keys(c).length ? c : undefined;
}
