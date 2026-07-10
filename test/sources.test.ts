import { describe, it, expect } from "vitest";
import { canonicalUrl, dedupeKey, dedupePosts, calmInterleave, type NormalizedPost } from "../src/sources/contract";
import { ActivityPubAdapter } from "../src/sources/activitypub/adapter";
import { mergeTodayResult } from "../src/sources/today";
import { mockMoments, mockPeople } from "../src/openweb/mock";
import type { AdapterResult, Moment, Person } from "../src/openweb/types";

// Pure contract tests — no network. The adapters' live fetches are exercised against real
// homes at deploy time (Stage 5), not in unit tests.

const person = (host: string): Person => ({
  id: `https://${host}/u`,
  name: "A",
  handle: `@a@${host}`,
  avatarUrl: null,
  bio: "",
  url: `https://${host}/u`,
  source: { id: host, name: host, url: `https://${host}` },
  verified: false,
});

const post = (url: string, host = "mastodon.social"): NormalizedPost => ({
  id: url,
  author: person(host),
  text: "hello",
  createdAt: "2026-07-07T00:00:00Z",
  url,
  media: [],
  source: { id: host, name: host, url: `https://${host}` },
});

describe("contract — canonical URL + dedup", () => {
  it("canonicalizes host case, trailing slash, and tracking params", () => {
    expect(canonicalUrl("https://Example.com/post/1/")).toBe("https://example.com/post/1");
    expect(canonicalUrl("https://example.com/p?utm_source=x&id=9")).toBe("https://example.com/p?id=9");
    expect(canonicalUrl("not a url")).toBe("not a url");
  });

  it("dedups by canonical URL across differing casing/params", () => {
    const a = post("https://example.com/p/1");
    const b = post("https://example.com/p/1?utm_source=news");
    const c = post("https://example.com/p/2");
    const out = dedupePosts([a, b, c]);
    expect(out.length).toBe(2);
    expect(out.map((p) => p.url)).toEqual(["https://example.com/p/1", "https://example.com/p/2"]);
  });

  it("dedupeKey falls back to id when url is not a URL", () => {
    const p = post("");
    p.id = "nostr:abc123";
    expect(dedupeKey(p)).toBe("nostr:abc123");
  });
});

describe("ActivityPub adapter — contract conformance", () => {
  const ap = new ActivityPubAdapter();

  it("declares a pull transport and a stable id", () => {
    expect(ap.id).toBe("activitypub");
    expect(ap.transport).toBe("pull");
  });

  it("normalize stamps adapter provenance without disturbing home/software", () => {
    const p = post("https://mastodon.social/@a/1");
    p.source.software = "Mastodon";
    const out = ap.normalize(p)!;
    expect(out.source.adapter).toBe("activitypub");
    expect(out.source.software).toBe("Mastodon"); // reader's attribution preserved
    expect(out.author.source.adapter).toBe("activitypub");
  });

  it("normalize drops an empty post (no text, no media)", () => {
    const p = post("https://mastodon.social/@a/2");
    p.text = "";
    expect(ap.normalize(p)).toBeNull();
  });
});

// ── Today merge: recency + source variety, calm degradation ──────────────────
describe("Today merge + calm interleave", () => {
  const at = (iso: string, adapter: string, n: number): NormalizedPost => {
    const p = post(`https://${adapter}.example/${n}`, `${adapter}.example`);
    p.createdAt = iso;
    p.source.adapter = adapter;
    return p;
  };

  it("interleaves by source variety while staying recency-forward", () => {
    // Three feeds items are the most recent, then one bluesky — variety must break the run.
    const posts = [
      at("2026-07-09T10:00:00Z", "feeds", 1),
      at("2026-07-09T09:59:00Z", "feeds", 2),
      at("2026-07-09T09:58:00Z", "feeds", 3),
      at("2026-07-09T09:50:00Z", "atproto", 1),
      at("2026-07-09T09:40:00Z", "nostr", 1),
    ];
    const out = calmInterleave(posts, 5);
    // most recent first, but no three feeds in a row up top
    expect(out[0].source.adapter).toBe("feeds");
    expect(out[1].source.adapter).not.toBe("feeds"); // variety kicked in
    expect(out).toHaveLength(5);
  });

  it("ENDS at the limit — never returns more than asked", () => {
    const posts = Array.from({ length: 40 }, (_, i) => at("2026-07-09T10:00:00Z", "feeds", i));
    expect(calmInterleave(posts, 20)).toHaveLength(20);
  });

  const apResult = (mode: AdapterResult<Moment[]>["mode"], data: Moment[]): AdapterResult<Moment[]> => ({
    data,
    mode,
    source: null,
    fetchedAt: "2026-07-09T10:00:00Z",
  });

  it("blends live ActivityPub with collected items and stamps AP provenance", () => {
    const apMoment = post("https://mastodon.social/@a/1");
    apMoment.createdAt = "2026-07-09T10:01:00Z";
    const collected = [at("2026-07-09T10:00:30Z", "atproto", 1)];
    const merged = mergeTodayResult(apResult("live", [apMoment]), collected, 20);
    expect(merged.mode).toBe("live");
    expect(merged.data).toHaveLength(2);
    const ap = merged.data.find((m) => m.url.includes("mastodon.social"))!;
    expect(ap.source.adapter).toBe("activitypub"); // stamped by the merge
  });

  it("promotes collected items to live even when ActivityPub is only mock", () => {
    const collected = [at("2026-07-09T10:00:00Z", "nostr", 1)];
    const merged = mergeTodayResult(apResult("mock", [post("https://sample/x")]), collected, 20);
    expect(merged.mode).toBe("live");
    expect(merged.data.every((m) => m.source.adapter === "nostr")).toBe(true); // the mock sample was dropped
  });

  it("keeps the honest mock result when AP is mock and nothing was collected", () => {
    const mock = apResult("mock", [post("https://sample/x")]);
    const merged = mergeTodayResult(mock, [], 20);
    expect(merged).toBe(mock); // untouched
  });

  // A8-5a — the honesty invariant, applied to the ACTUAL merged Today payload and to the
  // sample content, not just per-adapter. UI-facing label fields must never carry protocol
  // words (product names like Mastodon/Bluesky/Nostr are fine).
  it("never leaks protocol words into merged Today label fields, nor into the mock fallback", () => {
    const PROTOCOL = /ActivityPub|ActivityStreams|AT-URI|AT Protocol|\brelay\b|federat|fediverse|\binstance\b|\bRSS\b|Atom feed|JSON Feed|schnorr|secp256k1/i;
    const labelBlob = (m: Moment) => `${m.source.name} ${m.source.software ?? ""} ${m.author.name} ${m.author.handle} ${m.author.source.name} ${m.author.source.software ?? ""}`;

    const feeds = at("2026-07-09T10:00:00Z", "feeds", 1);
    feeds.source.software = "Blog";
    const bsky = at("2026-07-09T09:59:00Z", "atproto", 1);
    bsky.source.software = "Bluesky";
    const nostr = at("2026-07-09T09:58:00Z", "nostr", 1);
    nostr.source.software = "Nostr";
    const ap = post("https://mastodon.social/@a/1");
    ap.source.software = "Mastodon";
    const merged = mergeTodayResult(apResult("live", [ap]), [feeds, bsky, nostr], 20);
    for (const m of merged.data) expect(labelBlob(m), labelBlob(m)).not.toMatch(PROTOCOL);

    for (const m of mockMoments) expect(labelBlob(m), labelBlob(m)).not.toMatch(PROTOCOL);
    for (const p of mockPeople) expect(`${p.source.name} ${p.source.software ?? ""} ${p.name} ${p.handle}`).not.toMatch(PROTOCOL);
  });
});
