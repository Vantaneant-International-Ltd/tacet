// Me domain types — the user's local-first home. These are product-shaped and know
// nothing about SQL, D1, columns, or the open-web adapter. The persistence layer maps
// rows to these; routes return these; the UI renders these.

export interface Profile {
  id: string;
  displayName: string;
  handle: string; // preferred local handle (not a federation identity)
  bio: string;
  avatarUrl: string | null;
  createdAt: string;
}

export interface SavedMedia {
  url: string;
  kind: "image" | "video" | "other";
  alt: string;
}

// A saved post — a self-contained local snapshot that survives remote deletion.
export interface SavedPost {
  id: string;
  remoteId: string;
  authorName: string;
  authorHandle: string;
  authorAvatarUrl: string | null;
  title?: string;
  text: string;
  url: string;
  media: SavedMedia[];
  sourceId: string;
  sourceSoftware?: string;
  remoteCreatedAt?: string;
  note?: string;
  pinned: boolean;
  readLater: boolean;
  savedAt: string;
  collectionIds: string[];
}

export interface CollectionSummary {
  id: string;
  name: string;
  count: number;
  createdAt: string;
}

export interface RecentView {
  id: string;
  remoteId: string;
  authorName: string;
  authorHandle: string;
  text: string;
  url: string;
  sourceId: string;
  sourceSoftware?: string;
  viewedAt: string;
}

// The snapshot a client sends when saving or recording a view. Mirrors the open-web
// domain object the UI already holds (a Moment), flattened for storage.
export interface PostSnapshot {
  remoteId: string;
  authorName: string;
  authorHandle: string;
  authorAvatarUrl?: string | null;
  title?: string;
  text: string;
  url: string;
  media?: SavedMedia[];
  sourceId?: string;
  sourceSoftware?: string;
  remoteCreatedAt?: string;
}

export type ProfileEdit = Partial<Pick<Profile, "displayName" | "handle" | "bio">>;
export type SavedEdit = Partial<{ note: string | null; pinned: boolean; readLater: boolean }>;
export type SavedFilter = "all" | "pinned" | "read_later" | "notes";
