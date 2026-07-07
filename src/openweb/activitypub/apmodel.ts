// Canonical ActivityPub object model. This is the PARSER's output: cleaned, typed, but
// still pure ActivityPub vocabulary (Actor, Note, Article, Create, Announce, …). It
// carries NO product semantics — the normalize/ layer turns these into Tacet domain
// objects. Keeping this boundary means a second protocol, or write support, only needs
// its own parser producing a comparable model, without touching product code.

export interface APImage {
  url: string;
  mediaType?: string;
}

export interface APAttachment {
  url: string;
  mediaType?: string;
  name?: string; // alt text / caption
  type?: string; // Document | Image | Video | Audio | Link | …
  width?: number;
  height?: number;
}

// An account-like actor (Person, Service, Group, Application, Organization).
export interface APActor {
  id: string;
  types: string[];
  host: string;
  preferredUsername?: string;
  name?: string;
  summaryHtml?: string; // still HTML — normalizer sanitizes to plain text
  icon: APImage | null;
  url?: string;
  outbox?: string;
}

// A content object (Note, Article, Image, Video, Audio, Page, Question, …).
export interface APObject {
  id: string;
  types: string[];
  contentHtml?: string;
  name?: string; // title, for Article/Video/Page
  summaryHtml?: string; // content warning / abstract
  published?: string; // ISO 8601
  url?: string;
  attributedTo?: string | APActor; // actor URL or embedded actor
  attachments: APAttachment[];
  inReplyTo?: string;
  sensitive?: boolean;
}

// An activity wrapping an object (Create, Announce, Update, …), as found in an outbox.
export interface APActivity {
  id?: string;
  types: string[];
  actor?: string | APActor; // who performed it
  object?: APObject | string; // embedded object or its URL
  published?: string;
}

export function hasType(types: string[], t: string): boolean {
  return types.includes(t);
}
export function hasAnyType(types: string[], set: ReadonlySet<string>): boolean {
  return types.some((t) => set.has(t));
}
