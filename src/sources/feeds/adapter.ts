// The RSS 2.0 / Atom / JSON Feed adapter. Polls a registry of feeds (seeded from
// seeds.json) with conditional fetching + per-feed backoff, parses each dialect through
// parse.ts, and normalizes items into the domain. Blogs, news, podcasts (enclosures →
// audio media), and YouTube channels (Atom + media:thumbnail → video cards) all land as
// the same NormalizedPost. See ADR-017.

import type { SourceAdapter, NormalizedPost, HealthReport, CollectContext, Person, Source } from "../contract";
import { canonicalUrl, nowIso } from "../contract";
import { toPlainText } from "../../openweb/text";
import { hostOf } from "../../openweb/activitypub/jsonld";
import { parseFeed, type ParsedItem, type ParsedMedia } from "./parse";
import { ensureSeeded, listDueFeeds, recordSuccess, recordNotModified, recordFailure, feedId, type FeedSeed } from "./registry";
import seedData from "./seeds.json";

const SEEDS = seedData as FeedSeed[];
const UA = "Tacet/0.1 (+https://tacet.social; open-web reader)";
const FETCH_TIMEOUT_MS = 10_000;
const MAX_TEXT = 600; // Today shows calm excerpts, never full articles
const PER_FEED = 4; // newest N items per feed per refresh
const MAX_FEEDS_PER_RUN = 40;
const OG_BUDGET = 6; // bounded per-run OpenGraph image lookups for media-less items

interface FeedContext {
  id: string;
  title: string | null;
  siteUrl: string | null;
  iconUrl: string | null;
  kind: string;
  url: string;
}
export interface FeedRaw {
  item: ParsedItem;
  feed: FeedContext;
}

function mediumLabel(kind: string): string {
  switch (kind) {
    case "podcast": return "Podcast";
    case "video": return "Video";
    case "news": return "News";
    case "forum": return "Forum";
    default: return "Blog";
  }
}

function faviconFor(siteUrl: string | null, feedUrl: string, declared?: string): string | null {
  if (declared) return declared;
  const host = hostOf(siteUrl || feedUrl);
  return host ? `https://${host}/favicon.ico` : null;
}

async function mapConcurrent<T>(items: T[], limit: number, fn: (t: T) => Promise<void>): Promise<void> {
  const queue = [...items];
  const workers = Array.from({ length: Math.min(limit, queue.length) }, async () => {
    for (;;) {
      const next = queue.shift();
      if (next === undefined) return;
      await fn(next);
    }
  });
  await Promise.all(workers);
}

// Best-effort OpenGraph image for a media-less item. Small, tight, and skipped on any error.
async function ogImage(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { headers: { "user-agent": UA, accept: "text/html" }, signal: AbortSignal.timeout(6000), redirect: "follow" });
    if (!res.ok) return null;
    const html = (await res.text()).slice(0, 100_000);
    const m = /<meta[^>]+(?:property|name)=["']og:image["'][^>]+content=["']([^"']+)["']/i.exec(html)
      || /<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']og:image["']/i.exec(html);
    return m ? m[1] : null;
  } catch {
    return null;
  }
}

export class FeedsAdapter implements SourceAdapter<FeedRaw> {
  readonly id = "feeds";
  readonly transport = "pull" as const;
  readonly label = "the web";

  async fetchLatest(ctx: CollectContext): Promise<FeedRaw[]> {
    if (!ctx.db) return [];
    await ensureSeeded(ctx.db, SEEDS, ctx.now);
    const due = await listDueFeeds(ctx.db, ctx.now, MAX_FEEDS_PER_RUN);
    const perFeed = Math.max(2, Math.min(PER_FEED, ctx.limitPerSource));
    const raws: FeedRaw[] = [];
    let ogBudget = OG_BUDGET;

    await mapConcurrent(due, 6, async (feed) => {
      try {
        const headers: Record<string, string> = { "user-agent": UA, accept: "application/rss+xml, application/atom+xml, application/feed+json, application/xml;q=0.9, text/xml;q=0.9, */*;q=0.5" };
        if (feed.etag) headers["if-none-match"] = feed.etag;
        if (feed.last_modified) headers["if-modified-since"] = feed.last_modified;
        const res = await fetch(feed.url, { headers, signal: AbortSignal.timeout(FETCH_TIMEOUT_MS), redirect: "follow" });
        if (res.status === 304) { await recordNotModified(ctx.db!, feed.id, ctx.now); return; }
        if (!res.ok) { await recordFailure(ctx.db!, feed.id, res.status, 0, ctx.now); return; }
        const contentType = res.headers.get("content-type") || "";
        const body = await res.text();
        const parsed = parseFeed(body, contentType);
        const iconUrl = faviconFor(parsed.siteUrl ?? feed.site_url, feed.url, parsed.iconUrl);
        await recordSuccess(ctx.db!, feed.id, {
          etag: res.headers.get("etag"),
          lastModified: res.headers.get("last-modified"),
          title: parsed.title ?? feed.title,
          iconUrl,
          siteUrl: parsed.siteUrl ?? feed.site_url,
          status: res.status,
        }, ctx.now);
        const feedCtx: FeedContext = { id: feed.id, title: parsed.title ?? feed.title, siteUrl: parsed.siteUrl ?? feed.site_url, iconUrl, kind: feed.kind, url: feed.url };
        for (const item of parsed.items.slice(0, perFeed)) {
          if (!item.url) continue;
          if (item.media.length === 0 && ogBudget > 0 && (feed.kind === "blog" || feed.kind === "news")) {
            ogBudget--;
            const og = await ogImage(item.url);
            if (og) item.media.push({ url: og, kind: "image", alt: "" });
          }
          raws.push({ item, feed: feedCtx });
        }
      } catch (e) {
        try { await recordFailure(ctx.db!, feed.id, /timeout|abort/i.test(String(e)) ? 408 : 0, 0, ctx.now); } catch { /* ignore */ }
      }
    });
    return raws;
  }

  normalize(raw: FeedRaw): NormalizedPost | null {
    const { item, feed } = raw;
    if (!item.url) return null;
    const host = hostOf(feed.siteUrl || feed.url);
    const source: Source = {
      id: host,
      name: feed.title || host,
      url: feed.siteUrl || (host ? `https://${host}` : feed.url),
      software: mediumLabel(feed.kind),
      iconUrl: feed.iconUrl,
      adapter: this.id,
    };
    const author: Person = {
      id: source.url,
      name: item.authorName || feed.title || host,
      handle: host,
      avatarUrl: feed.iconUrl ?? null,
      bio: "",
      url: source.url,
      source,
      verified: false,
    };
    const title = item.title?.trim() || undefined;
    let body = toPlainText(item.contentHtml || "");
    if (body.length > MAX_TEXT) body = body.slice(0, MAX_TEXT).replace(/\s+\S*$/, "") + "…";
    const text = [title, body].filter(Boolean).join("\n\n").trim();
    const media = item.media.map(mapMedia).filter((m) => m.url);
    if (!text && media.length === 0) return null;
    return {
      id: canonicalUrl(item.url) || item.id || item.url,
      author,
      text,
      createdAt: item.published || "",
      url: item.url,
      media,
      source,
      title,
    };
  }

  async healthcheck(): Promise<HealthReport> {
    const at = nowIso(Date.now());
    const probe = SEEDS[0]?.url;
    if (!probe) return { ok: false, detail: "no seed feeds configured", checkedAt: at };
    try {
      const res = await fetch(probe, { method: "GET", headers: { "user-agent": UA }, signal: AbortSignal.timeout(6000), redirect: "follow" });
      return { ok: res.ok, detail: `${probe} → ${res.status}`, checkedAt: at };
    } catch (e) {
      return { ok: false, detail: `${probe} unreachable: ${e instanceof Error ? e.message : String(e)}`, checkedAt: at };
    }
  }
}

function mapMedia(m: ParsedMedia): NormalizedPost["media"][number] {
  return { url: m.url, kind: m.kind, alt: m.alt };
}

export { feedId };
