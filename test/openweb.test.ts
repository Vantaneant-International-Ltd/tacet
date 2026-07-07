import { describe, it, expect, beforeEach } from "vitest";
import { toPlainText } from "../src/openweb/text";
import { parseActor, parseObject, parseActivity, parseOutboxItem } from "../src/openweb/activitypub/parse";
import { normalizePerson, normalizeObject, normalizeActivity } from "../src/openweb/normalize";
import { getToday, getPeople, __resetOpenWebCache } from "../src/openweb";
import { buildSigningString, makeRsaSigner } from "../src/openweb/activitypub/signing";
import { labelForSoftware } from "../src/openweb/activitypub/nodeinfo";
import type { DiscoverySource, Moment, Person } from "../src/openweb/types";

// ── PARSER: raw JSON-LD → canonical AP objects (pure, no network) ─────────────
describe("activitypub parser", () => {
  it("parses an actor from any implementation into a canonical APActor", () => {
    const raw = {
      id: "https://pixelfed.social/users/cassie",
      type: "Person",
      preferredUsername: "cassie",
      name: "Cassie Lin",
      summary: "<p>Film only.</p>",
      icon: { type: "Image", url: "https://cdn/av.png", mediaType: "image/png" },
      url: "https://pixelfed.social/cassie",
      outbox: "https://pixelfed.social/users/cassie/outbox",
    };
    const a = parseActor(raw);
    expect(a).toMatchObject({
      id: "https://pixelfed.social/users/cassie",
      types: ["Person"],
      host: "pixelfed.social",
      preferredUsername: "cassie",
      name: "Cassie Lin",
      outbox: "https://pixelfed.social/users/cassie/outbox",
    });
    expect(a.icon?.url).toBe("https://cdn/av.png");
  });

  it("parses a Note with attachments, tolerating array/scalar url shapes", () => {
    const raw = {
      id: "https://mastodon.social/@anna/1",
      type: "Note",
      content: "<p>the harbour</p>",
      published: "2026-07-07T00:00:00Z",
      url: [{ type: "Link", mediaType: "text/html", href: "https://mastodon.social/@anna/1" }],
      attributedTo: "https://mastodon.social/users/anna",
      attachment: [{ type: "Document", mediaType: "image/jpeg", url: "https://cdn/img.jpg", name: "harbour" }],
    };
    const o = parseObject(raw);
    expect(o.types).toEqual(["Note"]);
    expect(o.contentHtml).toBe("<p>the harbour</p>");
    expect(o.url).toBe("https://mastodon.social/@anna/1");
    expect(o.attributedTo).toBe("https://mastodon.social/users/anna");
    expect(o.attachments).toEqual([{ url: "https://cdn/img.jpg", mediaType: "image/jpeg", name: "harbour", type: "Document", width: undefined, height: undefined }]);
  });

  it("pulls playable media from a PeerTube Video's url links", () => {
    const raw = {
      id: "https://peertube.social/videos/watch/9",
      type: "Video",
      name: "A quiet street",
      content: "<p>six minutes</p>",
      published: "2026-07-07T00:00:00Z",
      url: [
        { type: "Link", mediaType: "text/html", href: "https://peertube.social/w/9" },
        { type: "Link", mediaType: "video/mp4", href: "https://peertube.social/static/9.mp4" },
      ],
    };
    const o = parseObject(raw);
    expect(o.name).toBe("A quiet street");
    expect(o.attachments.some((a) => a.mediaType === "video/mp4")).toBe(true);
  });

  it("wraps a bare outbox object as an implicit Create", () => {
    const act = parseOutboxItem({ id: "x", type: "Note", content: "<p>hi</p>", attributedTo: "https://h/u" });
    expect(act.types).toEqual(["Create"]);
    expect(typeof act.object).toBe("object");
  });

  it("parses a Create activity with an embedded object", () => {
    const act = parseActivity({
      type: "Create",
      actor: "https://h/users/a",
      object: { id: "https://h/1", type: "Note", content: "<p>hi</p>", attributedTo: "https://h/users/a" },
    });
    expect(act.types).toEqual(["Create"]);
    expect(act.object).not.toBe(null);
    expect(typeof act.object === "object").toBe(true);
  });
});

// ── NORMALIZER: canonical AP objects → Tacet domain (pure, no network) ────────
describe("normalizer", () => {
  const actor = parseActor({
    id: "https://misskey.io/users/syuilo",
    type: "Person",
    preferredUsername: "syuilo",
    name: "しゅいろ",
    summary: "<p>hi</p>",
    icon: { url: "https://cdn/s.png" },
    url: "https://misskey.io/@syuilo",
    outbox: "https://misskey.io/users/syuilo/outbox",
  });

  it("normalizes an actor into a Person (protocol words gone)", () => {
    const p = normalizePerson(actor);
    expect(p).toMatchObject({ name: "しゅいろ", handle: "@syuilo@misskey.io", avatarUrl: "https://cdn/s.png", bio: "hi" });
    expect(p.source.id).toBe("misskey.io");
    // no ActivityPub vocabulary on a domain object
    expect(JSON.stringify(p)).not.toMatch(/preferredUsername|attributedTo|outbox|Note/);
  });

  it("normalizes a Note into a Moment using a fallback author", () => {
    const obj = parseObject({ id: "https://misskey.io/notes/1", type: "Note", content: "<p>hello</p>", published: "2026-07-07T00:00:00Z" });
    const m = normalizeObject(obj, normalizePerson(actor))!;
    expect(m.text).toBe("hello");
    expect(m.author.handle).toBe("@syuilo@misskey.io");
    expect(m.title).toBeUndefined();
  });

  it("normalizes an Article: title folds into text and is exposed as title", () => {
    const obj = parseObject({ id: "https://writefreely.host/a/1", type: "Article", name: "On attention", content: "<p>essay body</p>", published: "2026-07-07T00:00:00Z", attributedTo: { id: "https://writefreely.host/u/devon", type: "Person", preferredUsername: "devon", url: "https://writefreely.host/devon" } });
    const m = normalizeObject(obj)!;
    expect(m.title).toBe("On attention");
    expect(m.text).toBe("On attention\n\nessay body");
    expect(m.author.handle).toBe("@devon@writefreely.host");
  });

  it("unwraps Create and marks Announce as shared", () => {
    const create = parseActivity({ type: "Create", object: { id: "https://h/1", type: "Note", content: "<p>a</p>", published: "2026-07-07T00:00:00Z" } });
    const m1 = normalizeActivity(create, actor)!;
    expect(m1.text).toBe("a");
    expect(m1.sharedBy).toBeUndefined();

    const announce = parseActivity({ type: "Announce", actor: { id: "https://misskey.io/users/syuilo", type: "Person", preferredUsername: "syuilo" }, object: { id: "https://other/2", type: "Note", content: "<p>b</p>", attributedTo: { id: "https://other/u", type: "Person", preferredUsername: "friend" }, published: "2026-07-07T00:00:00Z" } });
    const m2 = normalizeActivity(announce, actor)!;
    expect(m2.text).toBe("b");
    expect(m2.author.handle).toBe("@friend@other");
    expect(m2.sharedBy?.handle).toBe("@syuilo@misskey.io");
  });

  it("skips non-renderable or reference-only activities", () => {
    expect(normalizeActivity(parseActivity({ type: "Like", object: "https://h/1" }), actor)).toBeNull();
    expect(normalizeActivity(parseActivity({ type: "Create", object: "https://h/only-a-url" }), actor)).toBeNull();
  });

  it("strips markup to calm plain text", () => {
    expect(toPlainText("<p>Hello <b>world</b></p><p>second</p>")).toBe("Hello world\nsecond");
    expect(toPlainText("a &amp; b &lt;3")).toBe("a & b <3");
  });
});

// ── BROADENED COMPATIBILITY: more implementations through one parser ──────────
describe("cross-implementation normalization", () => {
  const author = { id: "https://h/u", type: "Person", preferredUsername: "u", url: "https://h/u" };

  it("Lemmy Page: title + body + thumbnail image", () => {
    const o = parseObject({ id: "https://lemmy.world/post/1", type: "Page", name: "A link", content: "<p>discuss</p>", published: "2026-07-07T00:00:00Z", attributedTo: author, image: { type: "Image", url: "https://cdn/thumb.jpg" } });
    const m = normalizeObject(o)!;
    expect(m.title).toBe("A link");
    expect(m.text).toBe("A link\n\ndiscuss");
    expect(m.media.some((x) => x.kind === "image")).toBe(true);
  });

  it("Mobilizon Event renders as a titled post", () => {
    const o = parseObject({ id: "https://mobilizon.fr/e/1", type: "Event", name: "Meetup", content: "<p>join us</p>", published: "2026-07-07T00:00:00Z", attributedTo: author });
    const m = normalizeObject(o)!;
    expect(m.title).toBe("Meetup");
    expect(m.text).toContain("join us");
  });

  it("BookWyrm Review is renderable and titled", () => {
    const o = parseObject({ id: "https://bookwyrm.social/r/1", type: "Review", name: "Loved it", content: "<p>a book</p>", published: "2026-07-07T00:00:00Z", attributedTo: author });
    const m = normalizeObject(o)!;
    expect(m.title).toBe("Loved it");
  });
});

// ── AUTHORIZED FETCH: HTTP signature (generate key, sign, verify; no network) ──
describe("authorized fetch signing", () => {
  it("builds the canonical signing string", () => {
    const s = buildSigningString("GET", new URL("https://example.social/users/x/outbox?page=1"), "Mon, 07 Jul 2026 00:00:00 GMT");
    expect(s).toBe("(request-target): get /users/x/outbox?page=1\nhost: example.social\ndate: Mon, 07 Jul 2026 00:00:00 GMT");
  });

  it("produces a verifiable RSA signature over the request", async () => {
    const kp = (await crypto.subtle.generateKey(
      { name: "RSASSA-PKCS1-v1_5", modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-256" },
      true,
      ["sign", "verify"],
    )) as CryptoKeyPair;
    const pkcs8 = (await crypto.subtle.exportKey("pkcs8", kp.privateKey)) as ArrayBuffer;
    const b64 = btoa(String.fromCharCode(...new Uint8Array(pkcs8)));
    const pem = `-----BEGIN PRIVATE KEY-----\n${b64.replace(/(.{64})/g, "$1\n")}\n-----END PRIVATE KEY-----`;

    const signer = makeRsaSigner("https://tacet.social/actor#main-key", pem);
    const url = "https://example.social/users/anna";
    const headers = await signer.sign("GET", url);

    expect(headers.signature).toContain('keyId="https://tacet.social/actor#main-key"');
    expect(headers.signature).toContain('headers="(request-target) host date"');

    const sigB64 = /signature="([^"]+)"/.exec(headers.signature)![1];
    const sigBytes = Uint8Array.from(atob(sigB64), (c) => c.charCodeAt(0));
    const signingString = buildSigningString("GET", new URL(url), headers.date);
    const ok = await crypto.subtle.verify("RSASSA-PKCS1-v1_5", kp.publicKey, sigBytes, new TextEncoder().encode(signingString));
    expect(ok).toBe(true);
  });
});

// ── SOURCE ATTRIBUTION: software labels (pure) ────────────────────────────────
describe("source attribution labels", () => {
  it("maps known software to friendly labels, never protocol jargon", () => {
    expect(labelForSoftware("mastodon")).toBe("Mastodon");
    expect(labelForSoftware("peertube")).toBe("PeerTube");
    expect(labelForSoftware("bookwyrm")).toBe("BookWyrm");
    expect(labelForSoftware("gotosocial")).toBe("GoToSocial");
    expect(labelForSoftware("somethingnew")).toBe("Somethingnew");
    expect(labelForSoftware(undefined)).toBeUndefined();
  });
});

// ── FACADE: graceful degradation across sources (pure, no network) ────────────
describe("adapter facade — graceful degradation", () => {
  beforeEach(() => __resetOpenWebCache());
  const okPerson: Person = { id: "p1", name: "A", handle: "@a@h", avatarUrl: null, bio: "", url: "u", source: { id: "h", name: "h", url: "https://h" }, verified: false };
  const okMoment: Moment = { id: "m1", author: okPerson, text: "hi", createdAt: "2026-07-07T00:00:00Z", url: "u", media: [], source: okPerson.source };

  const working: DiscoverySource = { id: "ok", today: async () => [okMoment], people: async () => [okPerson] };
  const failing: DiscoverySource = { id: "bad", today: async () => { throw new Error("network down"); }, people: async () => { throw new Error("network down"); } };

  it("returns live data when at least one source succeeds", async () => {
    const r = await getToday([failing, working], 5, 1_000_000);
    expect(r.mode).toBe("live");
    expect(r.data.length).toBe(1);
    expect(r.error).toBeUndefined();
  });

  it("dedupes merged results across sources", async () => {
    const r = await getPeople([working, working], 5, 1_500_000);
    expect(r.mode).toBe("live");
    expect(r.data.length).toBe(1);
  });

  it("falls back to sample content (mode: mock) when all sources fail", async () => {
    const r = await getPeople([failing], 5, 2_000_000);
    expect(r.mode).toBe("mock");
    expect(r.data.length).toBeGreaterThan(0);
    expect(r.error?.code).toBe("unavailable");
  });

  it("never throws to the caller — always returns a result", async () => {
    await expect(getToday([failing], 5, 3_000_000)).resolves.toBeTruthy();
  });
});
