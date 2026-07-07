import { describe, it, expect } from "vitest";
import { toPlainText, normalizeHandle, mapProfile, mapContent } from "../src/openweb/mastodon";
import { getToday, getPeople } from "../src/openweb";
import type { OpenWebSource, Source, OpenWebProfile, OpenWebContent } from "../src/openweb/types";

const source: Source = { id: "example.social", name: "example.social", url: "https://example.social" };

describe("openweb adapter — normalization (pure, no network)", () => {
  it("strips markup to calm plain text", () => {
    expect(toPlainText("<p>Hello <b>world</b></p><p>second</p>")).toBe("Hello world\nsecond");
    expect(toPlainText("a &amp; b &lt;3")).toBe("a & b <3");
  });

  it("normalizes handles for local and remote people", () => {
    expect(normalizeHandle("anna", "example.social")).toBe("@anna@example.social");
    expect(normalizeHandle("@cassie@pixelfed.social", "example.social")).toBe("@cassie@pixelfed.social");
  });

  it("maps a raw profile into a Tacet Person (no protocol terms leak)", () => {
    const raw: OpenWebProfile = {
      id: "1", displayName: "Anna Reyes", acct: "anna", avatar: "https://x/a.png",
      note: "<p>Writer.</p>", url: "https://example.social/@anna", bot: false,
    };
    const p = mapProfile(raw, source, "example.social");
    expect(p).toMatchObject({
      name: "Anna Reyes", handle: "@anna@example.social", bio: "Writer.",
      url: "https://example.social/@anna", avatarUrl: "https://x/a.png",
    });
    expect(p.source).toEqual(source);
  });

  it("maps raw content into a Tacet Moment with media", () => {
    const raw: OpenWebContent = {
      id: "9", contentHtml: "<p>the harbour</p>", createdAt: "2026-07-07T00:00:00Z",
      url: "https://example.social/@cassie/9",
      account: { id: "2", displayName: "Cassie", acct: "cassie", avatar: null, note: "", url: "https://example.social/@cassie", bot: false },
      attachments: [{ url: "https://x/img.jpg", type: "image", description: "harbour" }],
    };
    const m = mapContent(raw, source, "example.social");
    expect(m.text).toBe("the harbour");
    expect(m.author.name).toBe("Cassie");
    expect(m.media).toEqual([{ url: "https://x/img.jpg", kind: "image", alt: "harbour" }]);
  });
});

describe("openweb adapter — graceful degradation", () => {
  const failing: OpenWebSource = {
    source,
    fetchToday: async () => { throw new Error("network down"); },
    discoverPeople: async () => { throw new Error("network down"); },
  };
  const working: OpenWebSource = {
    source,
    fetchToday: async () => [mapContent({ id: "1", contentHtml: "<p>hi</p>", createdAt: "2026-07-07T00:00:00Z", url: "u", account: { id: "1", displayName: "A", acct: "a", avatar: null, note: "", url: "u", bot: false }, attachments: [] }, source, source.id)],
    discoverPeople: async () => [mapProfile({ id: "1", displayName: "A", acct: "a", avatar: null, note: "", url: "u", bot: false }, source, source.id)],
  };

  it("returns live data when the source succeeds", async () => {
    const r = await getToday(working, 5, 1_000_000);
    expect(r.mode).toBe("live");
    expect(r.data.length).toBe(1);
    expect(r.error).toBeUndefined();
  });

  it("falls back to sample content (mode: mock) when the source fails", async () => {
    const r = await getPeople(failing, 5, 2_000_000);
    expect(r.mode).toBe("mock");
    expect(r.data.length).toBeGreaterThan(0);
    expect(r.error?.code).toBe("network");
  });

  it("never throws to the caller — always returns a result", async () => {
    await expect(getToday(failing, 5, 3_000_000)).resolves.toBeTruthy();
  });
});
