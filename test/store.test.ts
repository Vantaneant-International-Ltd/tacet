import { describe, it, expect } from "vitest";
import { env } from "cloudflare:test";
import { writeItems, readRecent, pruneOld, tryAcquireRefreshLock, getState, setState } from "../src/sources/store";
import { refreshAllSources } from "../src/sources/refresh";
import { nowIso, type NormalizedPost } from "../src/sources/contract";

// Deterministic, offline coverage for the source store's storage-growth + anti-stampede
// invariants (A8-2, A8-3). All against real local D1 with an injected clock; no network.

function post(url: string, createdAt: string): NormalizedPost {
  return {
    id: url,
    author: { id: url, name: "Pub", handle: "example.com", avatarUrl: null, bio: "", url, source: { id: "example.com", name: "Pub", url: "https://example.com" }, verified: false },
    text: "hello",
    createdAt,
    url,
    media: [],
    source: { id: "example.com", name: "Pub", url: "https://example.com", adapter: "feeds" },
  };
}

describe("source store — retention (pruneOld)", () => {
  it("drops items older than the 30-day window and keeps fresh ones", async () => {
    const now = Date.parse("2026-07-10T00:00:00Z");
    const old = nowIso(now - 31 * 86_400_000); // 31 days ago
    const fresh = nowIso(now - 1 * 86_400_000); // yesterday
    await writeItems(env.DB, "feeds", [post("https://example.com/old", old), post("https://example.com/fresh", fresh)], now);
    await pruneOld(env.DB, now);
    const urls = (await readRecent(env.DB, { limit: 50, adapters: ["feeds"] })).map((m) => m.url);
    expect(urls).toContain("https://example.com/fresh");
    expect(urls).not.toContain("https://example.com/old");
  });
});

describe("source store — refresh lock (tryAcquireRefreshLock)", () => {
  it("grants the lock once, refuses within the window, and grants again after it elapses", async () => {
    const now = Date.parse("2026-07-10T12:00:00Z");
    expect(await tryAcquireRefreshLock(env.DB, now, 60_000)).toBe(true); // first caller wins
    expect(await tryAcquireRefreshLock(env.DB, now + 5_000, 60_000)).toBe(false); // still inside window
    expect(await tryAcquireRefreshLock(env.DB, now + 61_000, 60_000)).toBe(true); // window elapsed
  });

  it("setState/getState round-trips and overwrites on conflict", async () => {
    const now = Date.parse("2026-07-10T12:00:00Z");
    await setState(env.DB, "k", "one", now);
    expect(await getState(env.DB, "k")).toBe("one");
    await setState(env.DB, "k", "two", now + 1000);
    expect(await getState(env.DB, "k")).toBe("two");
    expect(await getState(env.DB, "missing")).toBeNull();
  });
});

describe("refreshAllSources — single-flight guard (no network)", () => {
  it("does nothing without a database", async () => {
    const r = await refreshAllSources({}, Date.parse("2026-07-10T00:00:00Z"));
    expect(r.ran).toBe(false);
  });

  it("skips when a refresh ran within the lock window (does not run collectors)", async () => {
    const now = Date.parse("2026-07-11T00:00:00Z");
    // Simulate a very recent refresh, then a non-forced call inside the 60s window.
    await setState(env.DB, "last_refresh_at", nowIso(now), now);
    const r = await refreshAllSources({ db: env.DB }, now + 5_000);
    expect(r.ran).toBe(false); // the lock short-circuits before any collector/network runs
    expect(r.perAdapter).toEqual({});
  });
});
