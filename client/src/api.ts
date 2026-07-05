// Typed wrapper over the Worker's /api/*. Every call sends cookies (session) and throws
// an ApiError carrying the server's one-sentence message on failure.

export type Lens = "timeline" | "grid";

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
}

export interface Reply {
  id: string;
  body: string;
  created_at: string;
  author_handle: string;
  is_mine: boolean;
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
  me: () => request<{ user: User | null }>("/auth/me"),
  register: (handle: string, passphrase: string, invite?: string) =>
    request<{ user: User }>("/auth/register", { method: "POST", body: JSON.stringify({ handle, passphrase, invite }) }),
  login: (handle: string, passphrase: string) =>
    request<{ user: User }>("/auth/login", { method: "POST", body: JSON.stringify({ handle, passphrase }) }),
  logout: () => request<{ ok: true }>("/auth/logout", { method: "POST" }),

  rooms: () => request<{ rooms: Room[] }>("/rooms"),
  room: (slug: string) => request<{ room: Room; lens: Lens }>(`/rooms/${slug}`),
  createRoom: (slug: string, name: string, description: string) =>
    request<{ room: Room }>("/rooms", { method: "POST", body: JSON.stringify({ slug, name, description }) }),
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

  invites: () => request<{ invites: Invite[] }>("/invites"),
  mintInvite: () => request<{ invite: Invite }>("/invites", { method: "POST" }),
};
