import { describe, it, expect } from "vitest";
import { req, cookieOf } from "./helpers";

// A fresh local profile (device cookie) — GET /profile establishes it.
async function newMe(): Promise<string> {
  const res = await req("/api/me/profile");
  const cookie = cookieOf(res);
  if (!cookie) throw new Error("no me cookie");
  return cookie;
}

const post = {
  remoteId: "https://mastodon.social/@anna/1",
  authorName: "Anna Reyes",
  authorHandle: "@anna@mastodon.social",
  text: "the harbour at dusk",
  url: "https://mastodon.social/@anna/1",
  media: [{ url: "https://cdn/x.jpg", kind: "image", alt: "harbour" }],
  sourceId: "mastodon.social",
  sourceSoftware: "Mastodon",
  counts: { reactions: 9, replies: 2 },
};

describe("Me — profile", () => {
  it("creates a local profile and updates it", async () => {
    const cookie = await newMe();
    const p1 = (await (await req("/api/me/profile", { cookie })).json()) as any;
    expect(p1.profile.id).toBeTruthy();
    expect(p1.profile.displayName).toBe("");

    const upd = await req("/api/me/profile", { method: "PATCH", cookie, body: { displayName: "Ren", handle: "ren", bio: "hi" } });
    const p2 = (await upd.json()) as any;
    expect(p2.profile).toMatchObject({ displayName: "Ren", handle: "ren", bio: "hi" });
  });

  it("belongs to a default workspace and round-trips the full identity", async () => {
    const cookie = await newMe();
    const me = (await (await req("/api/me/profile", { cookie })).json()) as any;
    // Every profile belongs to a workspace (id == profile id, 1:1).
    expect(me.workspace).toBeTruthy();
    expect(me.workspace.isDefault).toBe(true);
    expect(me.workspace.kind).toBe("personal");
    expect(me.profile.workspaceId).toBe(me.profile.id);
    expect(me.workspace.id).toBe(me.profile.id);

    const upd = await req("/api/me/profile", {
      method: "PATCH",
      cookie,
      body: {
        displayName: "Renato",
        handle: "@renato",
        website: "https://vnta.xyz",
        location: "Dublin",
        avatarUrl: "https://cdn/a.png",
        bannerUrl: "https://cdn/b.png",
        fields: [{ name: "GitHub", value: "https://github.com/x" }, { name: "  ", value: "  " }],
      },
    });
    const p = ((await upd.json()) as any).profile;
    expect(p).toMatchObject({ displayName: "Renato", handle: "renato", website: "https://vnta.xyz", location: "Dublin", avatarUrl: "https://cdn/a.png", bannerUrl: "https://cdn/b.png" });
    expect(p.fields).toEqual([{ name: "GitHub", value: "https://github.com/x" }]); // blank field dropped

    // Rename the workspace.
    const w = ((await (await req("/api/me/workspace", { method: "PATCH", cookie, body: { name: "VNTA" } })).json()) as any).workspace;
    expect(w.name).toBe("VNTA");
  });

  it("sanitizes a local handle so it cannot impersonate a federated address (CRIT-2)", async () => {
    const cookie = await newMe();
    // A user cannot claim "@anna@mastodon.social" as a local handle — the domain is stripped
    // so the local profile can't masquerade as a real open-web account.
    const upd = await req("/api/me/profile", { method: "PATCH", cookie, body: { handle: "@anna@mastodon.social" } });
    const p = ((await upd.json()) as any).profile;
    expect(p.handle).toBe("anna");
    expect(p.handle).not.toContain("@");
  });

  it("keeps profile and saved data isolated per device (workspace scope)", async () => {
    const a = await newMe();
    const b = await newMe();
    await req("/api/me/profile", { method: "PATCH", cookie: a, body: { displayName: "A" } });
    await req("/api/me/saved", { method: "POST", cookie: a, body: post });
    const bProfile = (await (await req("/api/me/profile", { cookie: b })).json()) as any;
    const bSaved = (await (await req("/api/me/saved", { cookie: b })).json()) as any;
    expect(bProfile.profile.displayName).toBe(""); // b is a separate workspace
    expect(bSaved.saved.length).toBe(0);
  });
});

describe("Me — saved", () => {
  it("saves a snapshot, is idempotent, and unsaves", async () => {
    const cookie = await newMe();
    const s1 = (await (await req("/api/me/saved", { method: "POST", cookie, body: post })).json()) as any;
    expect(s1.saved.remoteId).toBe(post.remoteId);
    expect(s1.saved.media.length).toBe(1);

    // Idempotent: saving again returns the same row, list has one.
    await req("/api/me/saved", { method: "POST", cookie, body: post });
    const list = (await (await req("/api/me/saved", { cookie })).json()) as any;
    expect(list.saved.length).toBe(1);

    // The snapshot survives (independent local copy), with contextual counts as saved.
    expect(list.saved[0].text).toBe("the harbour at dusk");
    expect(list.saved[0].counts).toEqual({ reactions: 9, replies: 2 });

    const del = await req(`/api/me/saved/${s1.saved.id}`, { method: "DELETE", cookie });
    expect(((await del.json()) as any).ok).toBe(true);
    const empty = (await (await req("/api/me/saved", { cookie })).json()) as any;
    expect(empty.saved.length).toBe(0);
  });

  it("pins, notes, and filters", async () => {
    const cookie = await newMe();
    const s = (await (await req("/api/me/saved", { method: "POST", cookie, body: post })).json()) as any;
    await req(`/api/me/saved/${s.saved.id}`, { method: "PATCH", cookie, body: { pinned: true, note: "remember this" } });

    const pinned = (await (await req("/api/me/saved?filter=pinned", { cookie })).json()) as any;
    expect(pinned.saved.length).toBe(1);
    const notes = (await (await req("/api/me/saved?filter=notes", { cookie })).json()) as any;
    expect(notes.saved[0].note).toBe("remember this");
    const later = (await (await req("/api/me/saved?filter=read_later", { cookie })).json()) as any;
    expect(later.saved.length).toBe(0);
  });

  it("keeps profiles isolated", async () => {
    const a = await newMe();
    const b = await newMe();
    await req("/api/me/saved", { method: "POST", cookie: a, body: post });
    const bList = (await (await req("/api/me/saved", { cookie: b })).json()) as any;
    expect(bList.saved.length).toBe(0);
  });
});

describe("Me — collections", () => {
  it("creates a collection and adds/removes a saved post", async () => {
    const cookie = await newMe();
    const saved = (await (await req("/api/me/saved", { method: "POST", cookie, body: post })).json()) as any;
    const col = (await (await req("/api/me/collections", { method: "POST", cookie, body: { name: "Photography" } })).json()) as any;
    expect(col.collection.name).toBe("Photography");

    const add = await req(`/api/me/collections/${col.collection.id}/items`, { method: "POST", cookie, body: { savedId: saved.saved.id } });
    expect(((await add.json()) as any).ok).toBe(true);

    const inCol = (await (await req(`/api/me/saved?collection=${col.collection.id}`, { cookie })).json()) as any;
    expect(inCol.saved.length).toBe(1);
    expect(inCol.saved[0].collectionIds).toContain(col.collection.id);

    const cols = (await (await req("/api/me/collections", { cookie })).json()) as any;
    expect(cols.collections[0].count).toBe(1);

    await req(`/api/me/collections/${col.collection.id}/items/${saved.saved.id}`, { method: "DELETE", cookie });
    const after = (await (await req(`/api/me/saved?collection=${col.collection.id}`, { cookie })).json()) as any;
    expect(after.saved.length).toBe(0);
  });
});

describe("Me — recently viewed", () => {
  it("records, lists, dedupes, and clears", async () => {
    const cookie = await newMe();
    await req("/api/me/recent", { method: "POST", cookie, body: post });
    await req("/api/me/recent", { method: "POST", cookie, body: post }); // same → dedupe by remote id
    const list = (await (await req("/api/me/recent", { cookie })).json()) as any;
    expect(list.recent.length).toBe(1);
    expect(list.recent[0].remoteId).toBe(post.remoteId);

    await req("/api/me/recent", { method: "DELETE", cookie });
    const cleared = (await (await req("/api/me/recent", { cookie })).json()) as any;
    expect(cleared.recent.length).toBe(0);
  });
});
