import { describe, it, expect } from "vitest";
import { canonicalUrl, dedupeKey, dedupePosts, type NormalizedPost } from "../src/sources/contract";
import { ActivityPubAdapter } from "../src/sources/activitypub/adapter";
import type { Person } from "../src/openweb/types";

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
