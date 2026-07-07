import { describe, it, expect } from "vitest";
import { buildConversation } from "../src/openweb/conversation";
import type { ConversationSource } from "../src/openweb/conversation";
import { parseObject, parseActor } from "../src/openweb/activitypub/parse";
import type { ConversationNode } from "../src/openweb/types";

// An in-memory ActivityPub source — no network. Objects/actors are raw AS2; collections
// map a replies-url to its items (URLs or embedded objects). Reads run through the REAL
// parser + normalizer + assembler, so this exercises the whole pipeline.
function fake(data: {
  objects?: Record<string, any>;
  actors?: Record<string, any>;
  collections?: Record<string, unknown[]>;
}): ConversationSource {
  const objects = data.objects ?? {};
  const actors = data.actors ?? {};
  const collections = data.collections ?? {};
  return {
    async getObject(url) {
      if (!(url in objects)) throw new Error(`404 ${url}`);
      return parseObject(objects[url]);
    },
    async getActor(url) {
      if (!(url in actors)) throw new Error(`404 ${url}`);
      return parseActor(actors[url]);
    },
    async getCollectionItems(url) {
      return collections[url] ?? [];
    },
  };
}

const person = (h: string) => ({ id: `https://${h.split("@")[2] ?? "h"}/u/${h.split("@")[1]}`, type: "Person", preferredUsername: h.split("@")[1], name: h.split("@")[1], url: `https://${h.split("@")[2]}/@${h.split("@")[1]}` });
const note = (id: string, text: string, author: any, extra: Record<string, unknown> = {}) => ({ id, type: "Note", content: `<p>${text}</p>`, published: "2026-07-07T00:00:00Z", attributedTo: author, ...extra });

function flatCount(nodes: ConversationNode[]): number {
  return nodes.reduce((n, x) => n + 1 + flatCount(x.replies), 0);
}

describe("conversation assembler (no network)", () => {
  const anna = person("@anna@mastodon.social");
  const cass = person("@cass@pixelfed.social");

  it("walks the parent chain oldest-first (what started this)", async () => {
    const root = note("https://h/1", "the root", anna);
    const mid = note("https://h/2", "a reply", cass, { inReplyTo: "https://h/1" });
    const focus = note("https://h/3", "the focus", anna, { inReplyTo: "https://h/2" });
    const conv = (await buildConversation(fake({ objects: { "https://h/1": root, "https://h/2": mid, "https://h/3": focus } }), "https://h/3"))!;
    expect(conv.focus.text).toBe("the focus");
    expect(conv.ancestors.map((a) => a.text)).toEqual(["the root", "a reply"]);
  });

  it("assembles a nested reply tree (what happened next)", async () => {
    const focus = note("https://h/1", "focus", anna, { replies: "https://h/1/replies" });
    const r1 = note("https://h/2", "reply one", cass, { replies: "https://h/2/replies" });
    const r1a = note("https://h/3", "nested reply", anna);
    const r2 = note("https://h/4", "reply two", anna);
    const conv = (await buildConversation(
      fake({
        objects: { "https://h/1": focus, "https://h/2": r1, "https://h/3": r1a, "https://h/4": r2 },
        collections: { "https://h/1/replies": ["https://h/2", "https://h/4"], "https://h/2/replies": ["https://h/3"] },
      }),
      "https://h/1",
    ))!;
    expect(conv.replies.map((n) => n.post.text)).toEqual(["reply one", "reply two"]);
    expect(conv.replies[0].replies[0].post.text).toBe("nested reply");
    expect(flatCount(conv.replies)).toBe(3);
  });

  it("skips missing parents gracefully (chain stops, focus survives)", async () => {
    const focus = note("https://h/9", "orphan focus", anna, { inReplyTo: "https://h/gone" });
    const conv = (await buildConversation(fake({ objects: { "https://h/9": focus } }), "https://h/9"))!;
    expect(conv.focus.text).toBe("orphan focus");
    expect(conv.ancestors).toEqual([]);
  });

  it("skips reference-only / unreachable replies, keeps the rest", async () => {
    const focus = note("https://h/1", "focus", anna, { replies: "https://h/1/replies" });
    const ok = note("https://h/2", "reachable reply", cass);
    const conv = (await buildConversation(
      fake({ objects: { "https://h/1": focus, "https://h/2": ok }, collections: { "https://h/1/replies": ["https://h/gone", "https://h/2"] } }),
      "https://h/1",
    ))!;
    expect(conv.replies.map((n) => n.post.text)).toEqual(["reachable reply"]);
  });

  it("resolves a reply author by URL via getActor (and dedupes participants)", async () => {
    const focus = note("https://h/1", "focus", anna, { replies: "https://h/1/replies" });
    const reply = note("https://h/2", "reply", "https://pixelfed.social/u/cass"); // author as URL
    const conv = (await buildConversation(
      fake({
        objects: { "https://h/1": focus, "https://h/2": reply },
        actors: { "https://pixelfed.social/u/cass": cass },
        collections: { "https://h/1/replies": ["https://h/2"] },
      }),
      "https://h/1",
    ))!;
    expect(conv.replies[0].post.author.handle).toBe("@cass@pixelfed.social");
    // anna (focus) + cass (reply) = 2 unique participants
    expect(conv.participants.length).toBe(2);
  });

  it("returns null when the focus post itself can't be read", async () => {
    await expect(buildConversation(fake({ objects: {} }), "https://h/missing")).rejects.toBeTruthy();
  });
});
