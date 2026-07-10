import { describe, it, expect } from "vitest";
import { schnorr } from "@noble/curves/secp256k1";
import { sha256 } from "@noble/hashes/sha256";
import { bytesToHex, utf8ToBytes } from "@noble/hashes/utils";
import { NostrAdapter, verifyEvent, type NostrRaw } from "../src/sources/nostr/adapter";
import { npubToHex, hexToBech32, bech32ToHex, noteId } from "../src/sources/nostr/bech32";

const adapter = new NostrAdapter();
const HEX32 = "3bf0c63fcb93463407af97a5e5ee64fa883d107ef9e558472c4eb9aaaefa459d";

describe("nostr bech32", () => {
  it("round-trips a 32-byte hex through npub and note", () => {
    const npub = hexToBech32("npub", HEX32);
    expect(npub.startsWith("npub1")).toBe(true);
    expect(npubToHex(npub)).toBe(HEX32);

    const note = noteId(HEX32);
    expect(note.startsWith("note1")).toBe(true);
    expect(bech32ToHex(note)).toEqual({ prefix: "note", hex: HEX32 });
  });

  it("rejects malformed bech32", () => {
    expect(npubToHex("npub1notvalid")).toBeNull();
    expect(bech32ToHex("garbage")).toBeNull();
  });

  it("decodes the committed seed npubs to 64-char hex pubkeys", async () => {
    const seeds = (await import("../src/sources/nostr/seeds.json")).default as string[];
    for (const npub of seeds) {
      const hex = npubToHex(npub);
      expect(hex, npub).toMatch(/^[0-9a-f]{64}$/);
    }
  });
});

describe("nostr event signature verification", () => {
  it("accepts a correctly signed event and rejects tampering", () => {
    const priv = schnorr.utils.randomPrivateKey();
    const pubkey = bytesToHex(schnorr.getPublicKey(priv));
    const base = { pubkey, created_at: 1_780_000_000, kind: 1, tags: [] as string[][], content: "a quiet note" };
    const serialized = JSON.stringify([0, base.pubkey, base.created_at, base.kind, base.tags, base.content]);
    const id = bytesToHex(sha256(utf8ToBytes(serialized)));
    const sig = bytesToHex(schnorr.sign(id, priv));
    const event = { ...base, id, sig };

    expect(verifyEvent(event)).toBe(true);
    expect(verifyEvent({ ...event, content: "tampered" })).toBe(false); // id no longer matches
    expect(verifyEvent({ ...event, sig: "00".repeat(64) })).toBe(false); // bad signature
  });
});

describe("nostr adapter — normalize", () => {
  it("maps a note to a Moment with a Nostr source and njump permalink, extracting media", () => {
    const raw: NostrRaw = {
      event: { id: HEX32, pubkey: HEX32, created_at: 1_780_000_000, kind: 1, tags: [], content: "look https://cdn.example/pic.jpg calm", sig: "x" },
      profile: { name: "Fiatjaf", picture: "https://cdn/av.png", about: "nostr", nip05: "_@fiatjaf.com", at: 1 },
    };
    const m = adapter.normalize(raw)!;
    expect(m.text).toContain("calm");
    expect(m.source).toMatchObject({ name: "Nostr", software: "Nostr", adapter: "nostr" });
    expect(m.url.startsWith("https://njump.me/note1")).toBe(true);
    expect(m.author.name).toBe("Fiatjaf");
    expect(m.author.handle).toBe("@fiatjaf.com"); // NIP-05 "_@domain" displays as "@domain"
    expect(m.media).toEqual([{ url: "https://cdn.example/pic.jpg", kind: "image", alt: "" }]);
    expect(m.createdAt).toBe(new Date(1_780_000_000 * 1000).toISOString());
    // no protocol words leaked
    expect(JSON.stringify(m)).not.toMatch(/relay|kind-1|schnorr|secp256k1/i);
  });

  it("drops an empty note", () => {
    const raw: NostrRaw = { event: { id: HEX32, pubkey: HEX32, created_at: 1, kind: 1, tags: [], content: "   ", sig: "x" } };
    expect(adapter.normalize(raw)).toBeNull();
  });

  it("strips nostr: URIs and bare bech32 tokens from rendered text (v2.2 3a)", () => {
    const raw: NostrRaw = {
      event: { id: HEX32, pubkey: HEX32, created_at: 1_780_000_000, kind: 1, tags: [], content: "replying to nostr:nevent1qqsw0aajphl9h9qelqhqcqu2tmp5c0dl4z543f0u8z4c3lhvhq8ke0spz3mhxue69uhhyetvv9uj this npub1sg6plzptd64u62a878hep2kev88swjh3tw00gjsfl8f237lmu63q0uf63m is right", sig: "x" },
    };
    const m = adapter.normalize(raw)!;
    expect(m.text).toBe("replying to this is right");
    expect(m.text).not.toMatch(/nostr:|npub1|nevent1/);
  });

  it("drops a note that is ONLY protocol tokens (nothing renderable)", () => {
    const raw: NostrRaw = { event: { id: HEX32, pubkey: HEX32, created_at: 1, kind: 1, tags: [], content: "nostr:note1qfl4dvuhucff5adhalw4z65m6ss56sm9hmx9x0qqqqqqqqqqqqqqqq", sig: "x" } };
    expect(adapter.normalize(raw)).toBeNull();
  });

  it("declares a push transport", () => {
    expect(adapter.transport).toBe("push");
    expect(adapter.id).toBe("nostr");
  });
});
