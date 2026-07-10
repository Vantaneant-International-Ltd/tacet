// Tacet domain types for the open social web. Deliberately product-shaped and
// protocol-agnostic: nothing here mentions ActivityPub, instances, actors, or
// timelines. If the underlying protocol were replaced tomorrow, these types would
// not change — only an adapter behind them would. See src/openweb/README.md.

// A "home" on the open social web — where a Person or Moment lives. Product language:
// "source" / "home", never "instance" or "server".
export interface Source {
  id: string; // canonical host, e.g. "mastodon.social"
  name: string; // human label for the home (or publication name, for a feed)
  url: string; // https://<host>
  // The software or network this home runs on, as a friendly product label ("Mastodon",
  // "Pixelfed", "PeerTube", "Bluesky", "Nostr", "Podcast"…), when known. Powers subtle
  // source attribution in the UI. Never a protocol name — it says where content lives,
  // not how it travels. ("Bluesky", not "AT Protocol"; "Mastodon", not "ActivityPub".)
  software?: string;
  // Which internal adapter produced this source (e.g. "activitypub", "feeds", "atproto",
  // "nostr"). Provenance for dedup/diagnostics only — NEVER shown in the UI.
  adapter?: string;
  // A favicon / site icon for the home or publication, when discoverable. A small visual
  // cue on each card; purely decorative, always optional.
  iconUrl?: string | null;
}

// A labelled profile field (Mastodon-style metadata: "Website", "Pronouns", …). `href`
// is present when the value is a link. Verification isn't asserted (see README).
export interface ProfileField {
  name: string;
  value: string; // plain text
  href?: string; // when the value is a link
}

// Public, contextual profile counts — surfaced calmly, never as a scoreboard. Present
// only when the home exposes them (absence ≠ zero).
export interface ProfileCounts {
  followers?: number;
  following?: number;
  posts?: number;
}

// A person, wherever their home is. One coherent people model — never a "remote account".
// The core fields are always present; the richer public-profile fields are populated when
// the full profile is fetched and the home exposes them.
export interface Person {
  id: string; // stable id (their public profile URL)
  name: string; // display name
  handle: string; // @user@home
  avatarUrl: string | null;
  bio: string; // plain text, sanitized
  url: string; // public profile URL
  source: Source;
  verified: boolean;
  // Rich public profile (optional; populated by a full profile fetch when available):
  bannerUrl?: string | null; // header image
  joinedAt?: string; // ISO — when the account was created
  website?: string; // primary website, when discoverable
  location?: string; // when the home exposes it
  fields?: ProfileField[]; // profile metadata rows
  counts?: ProfileCounts; // followers / following / posts
}

// A post/moment from the open web. Not an "ActivityPub object" — a post. (The product
// vocabulary calls this a Post; the type name stays `Moment` for UI compatibility.)
export interface Moment {
  id: string;
  author: Person;
  text: string; // plain text, sanitized (no raw markup rendered)
  createdAt: string; // ISO 8601
  url: string; // permalink
  media: MomentMedia[];
  source: Source;
  title?: string; // long-form / video title (Article, Video, Page), optional
  sharedBy?: Person; // when this reached us because someone shared it (a "boost")
  counts?: MomentCounts; // lightweight conversation context, when the home exposes it
}

// Contextual counts around a post — NOT engagement mechanics. Each is present only when
// the source home exposes it (so absence ≠ zero). The UI shows them calmly and hides
// zeros; there is no ranking, no vanity emphasis, no competition.
export interface MomentCounts {
  reactions?: number; // likes / favourites
  replies?: number;
  shares?: number; // boosts / announces
}

// A read conversation, as a first-class domain object. The UI receives this threaded
// shape and never touches ActivityPub reply collections. A node is one post plus its
// nested replies; the conversation carries the context above the focus (ancestors), the
// focus itself, the reply tree below it, and the people taking part.
export interface ConversationNode {
  post: Moment;
  replies: ConversationNode[];
}
export interface Conversation {
  focusId: string; // the post the reader opened
  ancestors: Moment[]; // root → … → parent (what started this), oldest first
  focus: Moment; // the opened post
  replies: ConversationNode[]; // nested replies below the focus (what happened next)
  participants: Person[]; // everyone whose post appears, deduped
  truncated: boolean; // true when depth/size caps stopped us going further
}

// A one-directional relationship to a person (read-only view; no writes this milestone).
export interface Relationship {
  person: Person;
  following: boolean;
}

// A named set of domain items (e.g. a person's posts, a saved collection).
export interface Collection<T> {
  id: string;
  name: string;
  items: T[];
  nextCursor?: string;
}

export interface MomentMedia {
  url: string;
  kind: "image" | "video" | "audio" | "other";
  alt: string;
  poster?: string; // a still image for video/audio (e.g. a podcast cover, a video thumbnail)
}

// Honest provenance of what the UI is showing.
export type DataMode = "live" | "cached" | "mock";

export interface AdapterError {
  code: "network" | "timeout" | "parse" | "unavailable";
  message: string;
}

// Every adapter call returns this. The UI renders `data` and can honestly label
// `mode`; it never inspects protocol details.
export interface AdapterResult<T> {
  data: T;
  mode: DataMode;
  source: Source | null;
  fetchedAt: string; // ISO 8601
  error?: AdapterError; // present when we degraded (live → cached → mock)
}

// ── Adapter-internal raw shapes ──────────────────────────────────────────────
// The intermediate, source-shaped data an adapter normalizes FROM before mapping
// into the domain types above. Kept internal to the adapter so protocol/vendor
// quirks never leak outward.
export interface OpenWebProfile {
  id: string;
  displayName: string;
  acct: string; // user or user@home as the source reports it
  avatar: string | null;
  note: string; // may contain markup
  url: string;
  bot: boolean;
}

export interface OpenWebContent {
  id: string;
  contentHtml: string;
  createdAt: string;
  url: string;
  account: OpenWebProfile;
  attachments: { url: string; type: string; description: string | null }[];
  counts?: MomentCounts;
}

// The replaceable seam. ActivityPub has no discovery of its own, so discovery is a
// pluggable layer: a provider yields DOMAIN objects (never protocol shapes). A provider
// may reach the open web through the generic ActivityPub core (SeedProvider) or through
// a vendor's REST API (MastodonProvider) — the difference never escapes this folder.
export interface DiscoverySource {
  readonly id: string;
  /** A finite, calm set of current public posts. */
  today(limit: number): Promise<Moment[]>;
  /** Discoverable public people. */
  people(limit: number): Promise<Person[]>;
}
