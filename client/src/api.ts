// Typed wrapper over the Worker's /api/*. Every call sends cookies (session) and throws
// an ApiError carrying the server's one-sentence message on failure.

export type Lens = "timeline" | "grid";

// The fixed acknowledgment vocabulary (lockfile §10). No opposite word exists.
export type AckWord = "seen" | "with_you" | "more";
export const ACK_ORDER: AckWord[] = ["seen", "with_you", "more"];
export const ACK_LABEL: Record<AckWord, string> = {
  seen: "Seen",
  with_you: "With you",
  more: "More",
};
export interface Ack {
  handle: string;
  word: AckWord;
}

export interface User {
  id: string;
  handle: string;
  is_admin: boolean;
}

export interface Room {
  slug: string;
  name: string;
  description: string | null;
}

export interface Post {
  id: string;
  kind: "text" | "image";
  body: string;
  image: string | null;
  author_handle: string;
  created_at: string;
  is_mine: boolean;
  kept_by_me: boolean;
  kept: boolean; // author-only: THAT it was kept. Never a count, never who.
  my_ack: AckWord | null; // the viewer's own acknowledgment word, if any
  acks: Ack[]; // who acknowledged, and with which word. Never a count.
}

export interface KeptPost extends Post {
  room: { slug: string; name: string };
}

export interface Reply {
  id: string;
  body: string;
  created_at: string;
  author_handle: string;
  is_mine: boolean;
}

export interface PublicEntry {
  id: string;
  kind: "text" | "image";
  body: string;
  image: string | null;
  created_at: string;
}

export interface PublicBrand {
  slug: string;
  name: string;
  description: string | null;
}

export interface Invite {
  code: string;
  created_at: string;
  used: boolean;
  used_by: string | null;
  used_at: string | null;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api${path}`, {
    ...init,
    headers: { ...(init?.body && !(init.body instanceof FormData) ? { "content-type": "application/json" } : {}), ...init?.headers },
    credentials: "same-origin",
  });
  const data = res.status === 204 ? null : await res.json().catch(() => null);
  if (!res.ok) throw new ApiError(res.status, (data as { error?: string })?.error ?? "something went wrong");
  return data as T;
}

export const api = {
  config: () => request<{ turnstile_site_key: string | null }>("/config"),
  me: () => request<{ user: User | null }>("/auth/me"),
  register: (handle: string, passphrase: string, invite?: string, turnstile_token?: string) =>
    request<{ user: User }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ handle, passphrase, invite, turnstile_token }),
    }),
  login: (handle: string, passphrase: string) =>
    request<{ user: User }>("/auth/login", { method: "POST", body: JSON.stringify({ handle, passphrase }) }),
  logout: () => request<{ ok: true }>("/auth/logout", { method: "POST" }),

  rooms: () => request<{ rooms: Room[] }>("/rooms"),
  room: (slug: string) => request<{ room: Room; lens: Lens; following: boolean }>(`/rooms/${slug}`),
  follow: (slug: string) => request<{ following: boolean }>(`/rooms/${slug}/follow`, { method: "POST" }),
  unfollow: (slug: string) => request<{ following: boolean }>(`/rooms/${slug}/follow`, { method: "DELETE" }),
  feed: () => request<{ posts: KeptPost[] }>("/feed"),
  createRoom: (slug: string, name: string, description: string, default_lens: Lens) =>
    request<{ room: Room }>("/rooms", {
      method: "POST",
      body: JSON.stringify({ slug, name, description, default_lens }),
    }),
  setLens: (slug: string, lens: Lens) =>
    request<{ lens: Lens }>(`/rooms/${slug}/lens`, { method: "PUT", body: JSON.stringify({ lens }) }),

  posts: (slug: string) => request<{ posts: Post[] }>(`/rooms/${slug}/posts`),
  post: (id: string) => request<{ post: Post; replies: Reply[] }>(`/posts/${id}`),
  createText: (slug: string, body: string) =>
    request<{ post: Post }>(`/rooms/${slug}/posts`, { method: "POST", body: JSON.stringify({ body }) }),
  createImage: (slug: string, form: FormData) =>
    request<{ post: Post }>(`/rooms/${slug}/posts`, { method: "POST", body: form }),
  deletePost: (id: string) => request<{ ok: true }>(`/posts/${id}`, { method: "DELETE" }),

  reply: (id: string, body: string) =>
    request<{ reply: Reply }>(`/posts/${id}/replies`, { method: "POST", body: JSON.stringify({ body }) }),
  keep: (id: string) => request<{ kept_by_me: boolean }>(`/posts/${id}/keep`, { method: "POST" }),
  unkeep: (id: string) => request<{ kept_by_me: boolean }>(`/posts/${id}/keep`, { method: "DELETE" }),
  keeps: () => request<{ posts: KeptPost[] }>("/keeps"),

  ack: (id: string, word: AckWord) =>
    request<{ my_ack: AckWord }>(`/posts/${id}/ack`, { method: "PUT", body: JSON.stringify({ word }) }),
  unack: (id: string) => request<{ my_ack: null }>(`/posts/${id}/ack`, { method: "DELETE" }),

  invites: () => request<{ invites: Invite[] }>("/invites"),
  mintInvite: () => request<{ invite: Invite }>("/invites", { method: "POST" }),

  // Public (no account needed): brand archives and single entries.
  publicBrand: (slug: string) =>
    request<{ brand: PublicBrand; posts: PublicEntry[] }>(`/public/brands/${slug}`),
  publicEntry: (id: string) =>
    request<{ post: PublicEntry & { brand: { slug: string; name: string } } }>(`/public/posts/${id}`),
};
