import { describe, it, expect } from "vitest";
import { req, registerAdmin, registerInvited } from "./helpers";

async function makeRoom(cookie: string, extra: Record<string, unknown> = {}) {
  return req("/api/rooms", {
    method: "POST",
    cookie,
    body: { slug: "parlour", name: "The Parlour", description: "quiet", ...extra },
  });
}

async function makePost(cookie: string, body = "a post") {
  const res = await req("/api/rooms/parlour/posts", { method: "POST", cookie, body: { body } });
  return ((await res.json()) as { post: { id: string } }).post.id;
}

describe("acknowledgments", () => {
  it("records an acknowledgment, attributed and room-visible", async () => {
    const admin = await registerAdmin();
    await makeRoom(admin);
    const ada = await registerInvited(admin, "ada");
    const id = await makePost(admin);

    await req(`/api/posts/${id}/ack`, { method: "PUT", cookie: ada, body: { word: "with_you" } });

    const res = await req("/api/rooms/parlour/posts", { cookie: admin });
    const { posts } = (await res.json()) as {
      posts: { id: string; acks: { handle: string; word: string }[] }[];
    };
    const post = posts.find((p) => p.id === id)!;
    expect(post.acks).toEqual([{ handle: "ada", word: "with_you" }]);
  });

  it("shows the viewer their own word and never a count", async () => {
    const admin = await registerAdmin();
    await makeRoom(admin);
    const ada = await registerInvited(admin, "ada");
    const id = await makePost(admin);

    await req(`/api/posts/${id}/ack`, { method: "PUT", cookie: admin, body: { word: "more" } });
    await req(`/api/posts/${id}/ack`, { method: "PUT", cookie: ada, body: { word: "seen" } });

    const res = await req(`/api/posts/${id}`, { cookie: admin });
    const raw = await res.text();
    const { post } = JSON.parse(raw) as { post: { my_ack: string; acks: unknown[] } };
    expect(post.my_ack).toBe("more");
    expect(post.acks).toHaveLength(2);
    // No numeric count of acknowledgments is ever serialised.
    expect(raw).not.toMatch(/"ack_count"|"acks_count"|"count"/);
  });

  it("replaces a prior word rather than stacking, and can be withdrawn", async () => {
    const admin = await registerAdmin();
    await makeRoom(admin);
    const id = await makePost(admin);

    await req(`/api/posts/${id}/ack`, { method: "PUT", cookie: admin, body: { word: "seen" } });
    await req(`/api/posts/${id}/ack`, { method: "PUT", cookie: admin, body: { word: "more" } });
    let res = await req(`/api/posts/${id}`, { cookie: admin });
    let view = (await res.json()) as { post: { my_ack: string | null; acks: unknown[] } };
    expect(view.post.my_ack).toBe("more");
    expect(view.post.acks).toHaveLength(1);

    await req(`/api/posts/${id}/ack`, { method: "DELETE", cookie: admin });
    res = await req(`/api/posts/${id}`, { cookie: admin });
    view = (await res.json()) as { post: { my_ack: string | null; acks: unknown[] } };
    expect(view.post.my_ack).toBeNull();
    expect(view.post.acks).toHaveLength(0);
  });

  it("rejects any word outside the fixed set (no downward form)", async () => {
    const admin = await registerAdmin();
    await makeRoom(admin);
    const id = await makePost(admin);
    for (const word of ["downvote", "like", "dislike", ""]) {
      const res = await req(`/api/posts/${id}/ack`, { method: "PUT", cookie: admin, body: { word } });
      expect(res.status).toBe(400);
    }
  });
});

describe("keeps view + default lens", () => {
  it("lists the viewer's kept posts with their room", async () => {
    const admin = await registerAdmin();
    await makeRoom(admin);
    const id = await makePost(admin, "keep me");
    await req(`/api/posts/${id}/keep`, { method: "POST", cookie: admin });

    const res = await req("/api/keeps", { cookie: admin });
    const { posts } = (await res.json()) as { posts: { id: string; room: { slug: string } }[] };
    expect(posts).toHaveLength(1);
    expect(posts[0].id).toBe(id);
    expect(posts[0].room.slug).toBe("parlour");
  });

  it("keeps are private — another member does not see them", async () => {
    const admin = await registerAdmin();
    await makeRoom(admin);
    const ada = await registerInvited(admin, "ada");
    const id = await makePost(admin, "mine to keep");
    await req(`/api/posts/${id}/keep`, { method: "POST", cookie: admin });

    const res = await req("/api/keeps", { cookie: ada });
    const { posts } = (await res.json()) as { posts: unknown[] };
    expect(posts).toHaveLength(0);
  });

  it("a room opens in its default lens until the user overrides it", async () => {
    const admin = await registerAdmin();
    await makeRoom(admin, { default_lens: "grid" });

    let res = await req("/api/rooms/parlour", { cookie: admin });
    expect(((await res.json()) as { lens: string }).lens).toBe("grid");

    await req("/api/rooms/parlour/lens", { method: "PUT", cookie: admin, body: { lens: "timeline" } });
    res = await req("/api/rooms/parlour", { cookie: admin });
    expect(((await res.json()) as { lens: string }).lens).toBe("timeline");
  });
});
