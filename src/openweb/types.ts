// Tacet domain types for the open social web. Deliberately product-shaped and
// protocol-agnostic: nothing here mentions ActivityPub, instances, actors, or
// timelines. If the underlying protocol were replaced tomorrow, these types would
// not change — only an adapter behind them would. See src/openweb/README.md.

// A "home" on the open social web — where a Person or Moment lives. Product language:
// "source" / "home", never "instance" or "server".
export interface Source {
  id: string; // canonical host, e.g. "mastodon.social"
  name: string; // human label for the home
  url: string; // https://<host>
}

// A person, wherever their home is. One coherent people model — never a "remote account".
export interface Person {
  id: string; // stable id (their public profile URL)
  name: string; // display name
  handle: string; // @user@home
  avatarUrl: string | null;
  bio: string; // plain text, sanitized
  url: string; // public profile URL
  source: Source;
  verified: boolean;
}

// A post/moment from the open web. Not an "ActivityPub object" — a post.
export interface Moment {
  id: string;
  author: Person;
  text: string; // plain text, sanitized (no raw markup rendered)
  createdAt: string; // ISO 8601
  url: string; // permalink
  media: MomentMedia[];
  source: Source;
}

export interface MomentMedia {
  url: string;
  kind: "image" | "video" | "other";
  alt: string;
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
}

// The replaceable seam. A source knows one protocol/API; nothing else does.
export interface OpenWebSource {
  readonly source: Source;
  /** A finite, calm set of current public moments from this home. */
  fetchToday(limit: number): Promise<Moment[]>;
  /** Discoverable public people from this home. */
  discoverPeople(limit: number): Promise<Person[]>;
}
