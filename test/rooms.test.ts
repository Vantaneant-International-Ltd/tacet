import { describe, it, expect } from "vitest";
import { req, registerAdmin, registerInvited } from "./helpers";

async function makeRoom(cookie: string, slug = "parlour", name = "The Parlour") {
  return req("/api/rooms", { method: "POST", cookie, body: { slug, name, description: "a quiet room" } });
}

describe("rooms + posting", () => {
  it("lets an admin create a room and lists it", async () => {
    const cookie = await registerAdmin();
    expect((await makeRoom(cookie)).status).toBe(201);
    const list = await req("/api/rooms", { cookie });
    const { rooms } = (await list.json()) as { rooms: { slug: string }[] };
    expect(rooms.map((r) => r.slug)).toContain("parlour");
  });

  it("lets any member create a room/community (creator owns + auto-follows)", async () => {
    const admin = await registerAdmin();
    const ada = await registerInvited(admin, "ada");
    const res = await makeRoom(ada, "ada-room", "Ada's Room");
    expect(res.status).toBe(201);
    const detail = await req("/api/rooms/ada-room", { cookie: ada });
    expect(((await detail.json()) as { following: boolean }).following).toBe(true);
  });

  it("requires a signed-in user to list rooms", async () => {
    const res = await req("/api/rooms");
    expect(res.status).toBe(401);
  });

  it("follow builds a personal feed; unfollow empties it; no follower count exists", async () => {
    const admin = await registerAdmin();
    await makeRoom(admin); // parlour — creator auto-follows
    await req("/api/rooms/parlour/posts", { method: "POST", cookie: admin, body: { body: "hello" } });

    // creator sees their own room's post in the feed (auto-followed)
    const mine = await req("/api/feed", { cookie: admin });
    expect(((await mine.json()) as { posts: { body: string }[] }).posts.map((p) => p.body)).toContain("hello");

    // a fresh member's feed is empty until they follow
    const ada = await registerInvited(admin, "ada");
    let feed = ((await (await req("/api/feed", { cookie: ada })).json()) as { posts: unknown[] }).posts;
    expect(feed).toHaveLength(0);

    await req("/api/rooms/parlour/follow", { method: "POST", cookie: ada });
    feed = ((await (await req("/api/feed", { cookie: ada })).json()) as { posts: { body: string }[] }).posts;
    expect((feed as { body: string }[]).map((p) => p.body)).toContain("hello");

    await req("/api/rooms/parlour/follow", { method: "DELETE", cookie: ada });
    feed = ((await (await req("/api/feed", { cookie: ada })).json()) as { posts: unknown[] }).posts;
    expect(feed).toHaveLength(0);

    // room detail reports following state and never a follower count
    const detail = await req("/api/rooms/parlour", { cookie: admin });
    const raw = await detail.text();
    expect((JSON.parse(raw) as { following: boolean }).following).toBe(true);
    expect(raw).not.toMatch(/count|followers/i);
  });

  it("posts text and returns it newest-first", async () => {
    const cookie = await registerAdmin();
    await makeRoom(cookie);
    await req("/api/rooms/parlour/posts", { method: "POST", cookie, body: { body: "first" } });
    await req("/api/rooms/parlour/posts", { method: "POST", cookie, body: { body: "second" } });
    const res = await req("/api/rooms/parlour/posts", { cookie });
    const { posts } = (await res.json()) as { posts: { body: string }[] };
    expect(posts.map((p) => p.body)).toEqual(["second", "first"]);
  });

  it("rejects an empty post", async () => {
    const cookie = await registerAdmin();
    await makeRoom(cookie);
    const res = await req("/api/rooms/parlour/posts", { method: "POST", cookie, body: { body: "   " } });
    expect(res.status).toBe(400);
  });

  it("only lets the author delete their own post", async () => {
    const admin = await registerAdmin();
    await makeRoom(admin);
    const ada = await registerInvited(admin, "ada");
    const created = await req("/api/rooms/parlour/posts", { method: "POST", cookie: admin, body: { body: "mine" } });
    const { post } = (await created.json()) as { post: { id: string } };

    const forbidden = await req(`/api/posts/${post.id}`, { method: "DELETE", cookie: ada });
    expect(forbidden.status).toBe(403);

    const ok = await req(`/api/posts/${post.id}`, { method: "DELETE", cookie: admin });
    expect(ok.status).toBe(200);
  });
});

describe("replies + keeps", () => {
  it("adds a flat reply and reads it back", async () => {
    const cookie = await registerAdmin();
    await makeRoom(cookie);
    const created = await req("/api/rooms/parlour/posts", { method: "POST", cookie, body: { body: "talk" } });
    const { post } = (await created.json()) as { post: { id: string } };
    await req(`/api/posts/${post.id}/replies`, { method: "POST", cookie, body: { body: "a reply" } });
    const res = await req(`/api/posts/${post.id}`, { cookie });
    const { replies } = (await res.json()) as { replies: { body: string }[] };
    expect(replies.map((r) => r.body)).toEqual(["a reply"]);
  });

  it("tells the author a post was kept, without who or a number", async () => {
    const admin = await registerAdmin();
    await makeRoom(admin);
    const ada = await registerInvited(admin, "ada");
    const created = await req("/api/rooms/parlour/posts", { method: "POST", cookie: admin, body: { body: "keep me" } });
    const { post } = (await created.json()) as { post: { id: string } };

    await req(`/api/posts/${post.id}/keep`, { method: "POST", cookie: ada });

    // The author sees THAT it was kept.
    const asAuthor = await req(`/api/posts/${post.id}`, { cookie: admin });
    const authorView = (await asAuthor.json()) as { post: { kept: boolean; kept_by_me: boolean } };
    expect(authorView.post.kept).toBe(true);
    // No count and no keeper identity anywhere in the payload.
    const raw = JSON.stringify(authorView);
    expect(raw).not.toContain("ada");
    expect(raw).not.toMatch(/"(keep_count|keeps|count)"/);

    // A non-author never sees the author-only word.
    const asOther = await req(`/api/posts/${post.id}`, { cookie: ada });
    const otherView = (await asOther.json()) as { post: { kept: boolean; kept_by_me: boolean } };
    expect(otherView.post.kept).toBe(false);
    expect(otherView.post.kept_by_me).toBe(true);
  });

  it("keeps are idempotent and can be undone", async () => {
    const admin = await registerAdmin();
    await makeRoom(admin);
    const ada = await registerInvited(admin, "ada");
    const created = await req("/api/rooms/parlour/posts", { method: "POST", cookie: admin, body: { body: "x" } });
    const { post } = (await created.json()) as { post: { id: string } };

    await req(`/api/posts/${post.id}/keep`, { method: "POST", cookie: ada });
    await req(`/api/posts/${post.id}/keep`, { method: "POST", cookie: ada }); // again, no error
    await req(`/api/posts/${post.id}/keep`, { method: "DELETE", cookie: ada });

    const res = await req(`/api/posts/${post.id}`, { cookie: ada });
    const view = (await res.json()) as { post: { kept_by_me: boolean } };
    expect(view.post.kept_by_me).toBe(false);
  });
});

describe("reactions (Amendment 4)", () => {
  it("likes/dislikes with public counts, one per person, toggling", async () => {
    const admin = await registerAdmin();
    await makeRoom(admin);
    const ada = await registerInvited(admin, "ada");
    const created = await req("/api/rooms/parlour/posts", { method: "POST", cookie: admin, body: { body: "react to me" } });
    const { post } = (await created.json()) as { post: { id: string } };

    const react = async (cookie: string, kind: string) =>
      (await (await req(`/api/posts/${post.id}/react`, { method: "PUT", cookie, body: { kind } })).json()) as {
        like_count: number;
        dislike_count: number;
        my_reaction: string | null;
      };

    let s = await react(admin, "like");
    expect(s.like_count).toBe(1);
    expect(s.my_reaction).toBe("like");

    s = await react(ada, "dislike");
    expect(s).toMatchObject({ like_count: 1, dislike_count: 1 });

    // one reaction per person: admin switches like -> dislike
    s = await react(admin, "dislike");
    expect(s).toMatchObject({ like_count: 0, dislike_count: 2 });

    // remove
    s = (await (await req(`/api/posts/${post.id}/react`, { method: "DELETE", cookie: admin })).json()) as typeof s;
    expect(s.dislike_count).toBe(1);
    expect(s.my_reaction).toBeNull();

    // invalid kind rejected
    const bad = await req(`/api/posts/${post.id}/react`, { method: "PUT", cookie: admin, body: { kind: "love" } });
    expect(bad.status).toBe(400);

    // counts ride along on the post list
    const list = await req("/api/rooms/parlour/posts", { cookie: admin });
    const p = ((await list.json()) as { posts: { id: string; dislike_count: number }[] }).posts.find((x) => x.id === post.id)!;
    expect(p.dislike_count).toBe(1);
  });
});

describe("lenses + invites", () => {
  it("persists a lens choice per user per room", async () => {
    const cookie = await registerAdmin();
    await makeRoom(cookie);
    await req("/api/rooms/parlour/lens", { method: "PUT", cookie, body: { lens: "grid" } });
    const res = await req("/api/rooms/parlour", { cookie });
    const { lens } = (await res.json()) as { lens: string };
    expect(lens).toBe("grid");
  });

  it("rejects an invalid lens value", async () => {
    const cookie = await registerAdmin();
    await makeRoom(cookie);
    const res = await req("/api/rooms/parlour/lens", { method: "PUT", cookie, body: { lens: "spiral" } });
    expect(res.status).toBe(400);
  });

  it("mints an invite and shows it as used after registration", async () => {
    const admin = await registerAdmin();
    await registerInvited(admin, "ada");
    const list = await req("/api/invites", { cookie: admin });
    const { invites } = (await list.json()) as { invites: { used: boolean; used_by: string | null }[] };
    expect(invites.length).toBe(1);
    expect(invites[0].used).toBe(true);
    expect(invites[0].used_by).toBe("ada");
  });

  it("lets any member mint an invite and bring someone in", async () => {
    const admin = await registerAdmin();
    const ada = await registerInvited(admin, "ada");
    // ada (a non-admin member) invites boris.
    const boris = await registerInvited(ada, "boris");
    const me = await req("/api/auth/me", { cookie: boris });
    expect(((await me.json()) as { user: { handle: string } }).user.handle).toBe("boris");
  });

  it("shows a member only their own invites, but the admin sees all", async () => {
    const admin = await registerAdmin();
    const ada = await registerInvited(admin, "ada");
    await req("/api/invites", { method: "POST", cookie: ada }); // ada mints one, still open

    const adaList = await req("/api/invites", { cookie: ada });
    const adaInvites = ((await adaList.json()) as { invites: unknown[] }).invites;
    expect(adaInvites).toHaveLength(1); // only ada's own

    const adminList = await req("/api/invites", { cookie: admin });
    const adminInvites = ((await adminList.json()) as { invites: unknown[] }).invites;
    // admin sees the invite it minted for ada plus the one ada minted.
    expect(adminInvites.length).toBeGreaterThanOrEqual(2);
  });
});
