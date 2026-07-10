import { describe, it, expect } from "vitest";
import { env } from "cloudflare:test";
import { parseFeed } from "../src/sources/feeds/parse";
import { FeedsAdapter, type FeedRaw } from "../src/sources/feeds/adapter";
import { writeItems, readRecent } from "../src/sources/store";
import type { NormalizedPost } from "../src/sources/contract";

const adapter = new FeedsAdapter();

const feedCtx = (over: Partial<FeedRaw["feed"]> = {}): FeedRaw["feed"] => ({
  id: "f_test",
  title: "Test Pub",
  siteUrl: "https://example.com",
  iconUrl: "https://example.com/favicon.ico",
  kind: "blog",
  url: "https://example.com/feed",
  ...over,
});

// ── PARSER: the three dialects + the four required feed kinds ─────────────────
describe("feed parser", () => {
  it("parses a BLOG (RSS 2.0) item with CDATA content", () => {
    const xml = `<?xml version="1.0"?><rss version="2.0"><channel>
      <title>Craig Mod</title><link>https://craigmod.com</link>
      <item><title>On Walking</title><link>https://craigmod.com/essays/on-walking</link>
      <guid>https://craigmod.com/essays/on-walking</guid>
      <pubDate>Mon, 07 Jul 2026 08:00:00 GMT</pubDate>
      <description><![CDATA[<p>A quiet essay about <b>walking</b>.</p>]]></description>
      </item></channel></rss>`;
    const feed = parseFeed(xml);
    expect(feed.title).toBe("Craig Mod");
    expect(feed.items).toHaveLength(1);
    expect(feed.items[0].title).toBe("On Walking");
    expect(feed.items[0].url).toBe("https://craigmod.com/essays/on-walking");
    expect(feed.items[0].contentHtml).toContain("walking");
    expect(feed.items[0].published).toContain("2026");
  });

  it("parses a PODCAST (RSS + enclosure) into audio media", () => {
    const xml = `<?xml version="1.0"?><rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd"><channel>
      <title>99% Invisible</title><link>https://99percentinvisible.org</link>
      <item><title>The Blue Sky</title><link>https://99pi.org/ep/blue-sky</link>
      <guid isPermaLink="false">99pi-blue-sky</guid>
      <pubDate>Tue, 08 Jul 2026 00:00:00 GMT</pubDate>
      <description>An episode about the color of the sky.</description>
      <enclosure url="https://cdn.99pi.org/blue-sky.mp3" type="audio/mpeg" length="12345"/>
      </item></channel></rss>`;
    const feed = parseFeed(xml);
    expect(feed.title).toBe("99% Invisible");
    const item = feed.items[0];
    expect(item.media).toHaveLength(1);
    expect(item.media[0]).toMatchObject({ url: "https://cdn.99pi.org/blue-sky.mp3", kind: "audio" });
  });

  it("parses a YOUTUBE channel (Atom + media:group) into a video-thumbnail item", () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
      <feed xmlns:yt="http://www.youtube.com/xml/schemas/2015" xmlns:media="http://search.yahoo.com/mrss/" xmlns="http://www.w3.org/2005/Atom">
      <title>Kurzgesagt</title><link rel="alternate" href="https://www.youtube.com/channel/UCsX"/>
      <entry><id>yt:video:abc123</id><title>How Big Is Space</title>
      <link rel="alternate" href="https://www.youtube.com/watch?v=abc123"/>
      <author><name>Kurzgesagt</name></author>
      <published>2026-07-06T12:00:00+00:00</published>
      <media:group>
        <media:thumbnail url="https://i.ytimg.com/vi/abc123/hqdefault.jpg" width="480" height="360"/>
        <media:description>A calm video about space.</media:description>
      </media:group>
      </entry></feed>`;
    const feed = parseFeed(xml);
    expect(feed.title).toBe("Kurzgesagt");
    const item = feed.items[0];
    expect(item.title).toBe("How Big Is Space");
    expect(item.url).toBe("https://www.youtube.com/watch?v=abc123");
    expect(item.media[0]).toMatchObject({ url: "https://i.ytimg.com/vi/abc123/hqdefault.jpg", kind: "image" });
    expect(item.contentHtml).toContain("calm video");
  });

  it("parses a REDDIT feed (Atom with escaped HTML content)", () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
      <feed xmlns="http://www.w3.org/2005/Atom">
      <title>Philosophy</title><link rel="alternate" href="https://www.reddit.com/r/philosophy"/>
      <entry><id>t3_abc</id><title>On the nature of time</title>
      <link rel="alternate" href="https://www.reddit.com/r/philosophy/comments/abc/on_time/"/>
      <updated>2026-07-05T00:00:00+00:00</updated>
      <author><name>/u/thinker</name></author>
      <content type="html">&lt;p&gt;A discussion about time.&lt;/p&gt;</content>
      </entry></feed>`;
    const feed = parseFeed(xml);
    expect(feed.title).toBe("Philosophy");
    const item = feed.items[0];
    expect(item.title).toBe("On the nature of time");
    expect(item.url).toBe("https://www.reddit.com/r/philosophy/comments/abc/on_time/");
    expect(item.contentHtml).toContain("<p>A discussion about time.</p>");
    expect(item.authorName).toBe("/u/thinker");
  });

  it("parses JSON Feed", () => {
    const json = JSON.stringify({
      version: "https://jsonfeed.org/version/1.1",
      title: "Example JSON",
      home_page_url: "https://example.com",
      items: [{ id: "1", url: "https://example.com/1", title: "Hello JSON", content_html: "<p>Body</p>", date_published: "2026-07-04T00:00:00Z" }],
    });
    const feed = parseFeed(json, "application/feed+json");
    expect(feed.title).toBe("Example JSON");
    expect(feed.items[0]).toMatchObject({ title: "Hello JSON", url: "https://example.com/1" });
  });

  it("throws on genuinely unrecognized input", () => {
    expect(() => parseFeed("<html><body>not a feed</body></html>")).toThrow();
  });
});

// ── NORMALIZE: parsed item → domain Moment (human labels, no protocol words) ──
describe("feeds adapter — normalize", () => {
  it("maps a blog item to a Moment with a publication source + medium label", () => {
    const raw: FeedRaw = {
      item: { id: "https://example.com/1", title: "Hello", url: "https://example.com/1", contentHtml: "<p>Body text</p>", published: "2026-07-04T00:00:00Z", media: [] },
      feed: feedCtx(),
    };
    const m = adapter.normalize(raw)!;
    expect(m.title).toBe("Hello");
    expect(m.text).toBe("Hello\n\nBody text");
    expect(m.url).toBe("https://example.com/1");
    expect(m.source).toMatchObject({ name: "Test Pub", software: "Blog", adapter: "feeds" });
    expect(m.author.handle).toBe("example.com");
    // no protocol vocabulary leaked onto the domain object
    expect(JSON.stringify(m)).not.toMatch(/RSS|Atom|JSON Feed|enclosure/i);
  });

  it("labels a podcast as Podcast and keeps audio media", () => {
    const raw: FeedRaw = {
      item: { id: "ep1", title: "Ep 1", url: "https://pod.example/ep1", contentHtml: "notes", published: "2026-07-04T00:00:00Z", media: [{ url: "https://pod.example/ep1.mp3", kind: "audio", alt: "" }] },
      feed: feedCtx({ kind: "podcast", title: "A Podcast" }),
    };
    const m = adapter.normalize(raw)!;
    expect(m.source.software).toBe("Podcast");
    expect(m.media[0].kind).toBe("audio");
  });

  it("truncates long article bodies to a calm excerpt", () => {
    const raw: FeedRaw = {
      item: { id: "x", url: "https://example.com/long", contentHtml: "<p>" + "word ".repeat(400) + "</p>", published: "2026-07-04T00:00:00Z", media: [] },
      feed: feedCtx(),
    };
    const m = adapter.normalize(raw)!;
    expect(m.text.length).toBeLessThan(650);
    expect(m.text.endsWith("…")).toBe(true);
  });
});

// ── STORE: D1 round-trip + dedup (real local D1 via the workers pool) ─────────
describe("source item store", () => {
  const post = (url: string): NormalizedPost => ({
    id: url,
    author: { id: url, name: "Pub", handle: "example.com", avatarUrl: null, bio: "", url, source: { id: "example.com", name: "Pub", url: "https://example.com" }, verified: false },
    text: "hello",
    createdAt: "2026-07-07T00:00:00Z",
    url,
    media: [],
    source: { id: "example.com", name: "Pub", url: "https://example.com", adapter: "feeds" },
  });

  it("writes normalized posts and reads them back newest-first, deduping by canonical URL", async () => {
    const now = Date.parse("2026-07-09T00:00:00Z");
    await writeItems(env.DB, "feeds", [post("https://example.com/a"), post("https://example.com/b")], now);
    // same canonical URL (tracking param + trailing slash) must not create a second row
    await writeItems(env.DB, "feeds", [post("https://example.com/a/?utm_source=x")], now + 1000);
    const items = await readRecent(env.DB, { limit: 50, adapters: ["feeds"] });
    const urls = items.map((i) => i.url);
    expect(urls).toContain("https://example.com/a");
    expect(urls).toContain("https://example.com/b");
    // exactly one "a" row despite two writes
    expect(items.filter((i) => i.url.startsWith("https://example.com/a")).length).toBe(1);
  });
});
