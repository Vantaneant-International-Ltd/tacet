import type { Moment, MomentMedia, Person } from "../types";
import type { APObject, APActivity, APActor, APAttachment } from "../activitypub/apmodel";
import { normalizePerson } from "./person";
import { toPlainText } from "../text";
import { hostOf } from "../activitypub/jsonld";

// Object types that render as a post. Others (e.g. actors, tombstones) are skipped.
const RENDERABLE = new Set(["Note", "Article", "Image", "Video", "Audio", "Page", "Question", "Event"]);
const TITLED = new Set(["Article", "Video", "Page", "Event"]);

function mediaKind(mt?: string, type?: string): MomentMedia["kind"] {
  if (mt?.startsWith("image/") || type === "Image") return "image";
  if (mt?.startsWith("video/") || type === "Video") return "video";
  return "other";
}

function mapMedia(a: APAttachment): MomentMedia {
  return { url: a.url, kind: mediaKind(a.mediaType, a.type), alt: a.name ?? "" };
}

function sourceOf(host: string) {
  return { id: host, name: host, url: host ? `https://${host}` : "" };
}

// Canonical AP content object → Tacet Moment (a post). Needs an author: prefers the
// object's embedded attributedTo actor, else a provided fallback (e.g. the outbox owner).
export function normalizeObject(obj: APObject, fallbackAuthor?: Person): Moment | null {
  if (!obj.types.some((t) => RENDERABLE.has(t))) return null;

  const author =
    obj.attributedTo && typeof obj.attributedTo !== "string"
      ? normalizePerson(obj.attributedTo)
      : fallbackAuthor;
  if (!author) return null;

  const body = toPlainText(obj.contentHtml ?? "");
  const title = obj.types.some((t) => TITLED.has(t)) ? obj.name : undefined;
  const text = [title, body].filter(Boolean).join("\n\n").trim();
  const media = obj.attachments.map(mapMedia).filter((m) => m.url);

  if (!text && media.length === 0) return null;

  const host = hostOf(obj.id) || author.source.id;
  return {
    id: obj.id || obj.url || "",
    author,
    text,
    createdAt: obj.published ?? new Date(0).toISOString(),
    url: obj.url ?? obj.id,
    media,
    source: sourceOf(host),
    title,
  };
}

// Canonical outbox activity → Moment. Unwraps Create/Update (owner authored) and
// Announce (a share; the underlying object must be embedded to normalize without a
// second fetch — read-only, so referenced-only objects are skipped).
export function normalizeActivity(act: APActivity, owner: APActor): Moment | null {
  const ownerPerson = normalizePerson(owner);

  if (act.types.includes("Announce")) {
    if (act.object && typeof act.object !== "string") {
      const m = normalizeObject(act.object, undefined);
      if (m) {
        m.sharedBy =
          act.actor && typeof act.actor !== "string" ? normalizePerson(act.actor) : ownerPerson;
        return m;
      }
    }
    return null;
  }

  if (act.types.includes("Create") || act.types.includes("Update")) {
    if (act.object && typeof act.object !== "string") {
      return normalizeObject(act.object, ownerPerson);
    }
  }
  return null;
}
