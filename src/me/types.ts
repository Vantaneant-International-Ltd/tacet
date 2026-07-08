// Me domain types — the user's local-first home. These are product-shaped and know
// nothing about SQL, D1, columns, or the open-web adapter. The persistence layer maps
// rows to these; routes return these; the UI renders these.

// A workspace — an owned identity space (personal now; business/project later). One
// default per device for this milestone. Its identity is the Profile below.
export interface Workspace {
  id: string;
  name: string;
  kind: "personal" | "business";
  isDefault: boolean;
  createdAt: string;
}

// A profile field / link on the local identity (mirrors a remote profile's metadata row).
export interface ProfileField {
  name: string;
  value: string;
}

// The user's local identity inside Tacet. Local only — a local handle is NOT a federation
// handle, and no @user@tacet.social is claimed. Public-facing fields mirror what a remote
// profile exposes so the same UI can preview it.
export interface Profile {
  id: string;
  workspaceId: string;
  displayName: string;
  handle: string; // preferred local handle (not a federation identity)
  bio: string;
  avatarUrl: string | null;
  bannerUrl: string | null;
  website: string;
  location: string;
  fields: ProfileField[];
  createdAt: string;
}

export interface SavedMedia {
  url: string;
  kind: "image" | "video" | "other";
  alt: string;
}

// Contextual counts as captured at save time (see src/openweb MomentCounts).
export interface SavedCounts {
  reactions?: number;
  replies?: number;
  shares?: number;
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
  counts?: SavedCounts;
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
  counts?: SavedCounts;
}

export type ProfileEdit = Partial<Pick<Profile, "displayName" | "handle" | "bio" | "avatarUrl" | "bannerUrl" | "website" | "location" | "fields">>;
export type SavedEdit = Partial<{ note: string | null; pinned: boolean; readLater: boolean }>;
export type SavedFilter = "all" | "pinned" | "read_later" | "notes";
