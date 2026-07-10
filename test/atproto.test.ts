import { describe, it, expect } from "vitest";
import { AtprotoAdapter, atUriToWebUrl, type AtFeedItem } from "../src/sources/atproto/adapter";

const adapter = new AtprotoAdapter();

const author = { did: "did:plc:abc", handle: "alice.bsky.social", displayName: "Alice", avatar: "https://cdn/av.jpg" };

describe("atproto adapter", () => {
  it("declares a pull transport and the Bluesky label", () => {
    expect(adapter.id).toBe("atproto");
    expect(adapter.transport).toBe("pull");
    expect(adapter.label).toBe("Bluesky");
  });

  it("maps an AT-URI to a bsky.app web permalink", () => {
    expect(atUriToWebUrl("at://did:plc:abc/app.bsky.feed.post/3kxyz", "alice.bsky.social")).toBe(
      "https://bsky.app/profile/alice.bsky.social/post/3kxyz",
    );
  });

  it("normalizes a text post with a Bluesky source (human label, no protocol words)", () => {
    const raw: AtFeedItem = {
      post: {
        uri: "at://did:plc:abc/app.bsky.feed.post/3kxyz",
        author,
        record: { text: "a quiet morning", createdAt: "2026-07-08T09:00:00Z" },
        replyCount: 2,
        repostCount: 1,
        likeCount: 9,
      },
    };
    const m = adapter.normalize(raw)!;
    expect(m.text).toBe("a quiet morning");
    expect(m.url).toBe("https://bsky.app/profile/alice.bsky.social/post/3kxyz");
    expect(m.author.handle).toBe("@alice.bsky.social");
    expect(m.source).toMatchObject({ name: "Bluesky", software: "Bluesky", adapter: "atproto" });
    expect(m.counts).toEqual({ reactions: 9, replies: 2, shares: 1 });
    expect(JSON.stringify(m)).not.toMatch(/AT Protocol|at:\/\/|PDS|firehose/i);
  });

  it("maps an image embed to image media", () => {
    const raw: AtFeedItem = {
      post: {
        uri: "at://did:plc:abc/app.bsky.feed.post/img1",
        author,
        record: { text: "photo", createdAt: "2026-07-08T09:00:00Z" },
        embed: { $type: "app.bsky.embed.images#view", images: [{ fullsize: "https://cdn/full.jpg", thumb: "https://cdn/t.jpg", alt: "a tree" }] },
      },
    };
    const m = adapter.normalize(raw)!;
    expect(m.media).toEqual([{ url: "https://cdn/full.jpg", kind: "image", alt: "a tree" }]);
  });

  it("attributes a repost via sharedBy", () => {
    const raw: AtFeedItem = {
      post: { uri: "at://did:plc:orig/app.bsky.feed.post/orig1", author: { did: "did:plc:orig", handle: "bob.bsky.social", displayName: "Bob" }, record: { text: "shared thought", createdAt: "2026-07-08T09:00:00Z" } },
      reason: { $type: "app.bsky.feed.defs#reasonRepost", by: author },
    };
    const m = adapter.normalize(raw)!;
    expect(m.author.handle).toBe("@bob.bsky.social");
    expect(m.sharedBy?.handle).toBe("@alice.bsky.social");
  });

  it("drops an empty post (no text, no media)", () => {
    const raw: AtFeedItem = { post: { uri: "at://did:plc:abc/app.bsky.feed.post/empty", author, record: { text: "" } } };
    expect(adapter.normalize(raw)).toBeNull();
  });
});
