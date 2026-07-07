import type { APActor, APObject, APActivity, APAttachment, APImage } from "./apmodel";
import { asArray, firstString, pickUrl, pickImageUrl, hostOf, isRecord } from "./jsonld";

// The PARSER: raw JSON-LD → canonical AP objects. Defensive against the many shapes AP
// takes in the wild (arrays vs scalars, embedded vs referenced, Link objects). Still
// pure protocol — produces ActivityPub vocabulary, not Tacet domain objects.

function typesOf(raw: Record<string, unknown>): string[] {
  return asArray(raw["type"]).filter((t): t is string => typeof t === "string");
}

export function parseImage(x: unknown): APImage | null {
  const url = pickImageUrl(x);
  if (!url) return null;
  const first = asArray(x as any).find(isRecord) as Record<string, unknown> | undefined;
  return { url, mediaType: first ? firstString(first["mediaType"]) : undefined };
}

export function parseActor(raw: unknown): APActor {
  if (!isRecord(raw)) throw new Error("actor is not an object");
  const id = firstString(raw["id"]) ?? "";
  const url = pickUrl(raw["url"]);
  return {
    id: id || url || "",
    types: typesOf(raw),
    host: hostOf(id) || hostOf(url),
    preferredUsername: firstString(raw["preferredUsername"]),
    name: firstString(raw["name"]),
    summaryHtml: firstString(raw["summary"]),
    icon: parseImage(raw["icon"]),
    url,
    outbox: firstString(raw["outbox"]),
  };
}

function parseAttachments(raw: Record<string, unknown>): APAttachment[] {
  const out: APAttachment[] = [];
  for (const a of asArray(raw["attachment"])) {
    if (!isRecord(a)) continue;
    const url = firstString(a["url"]) ?? pickUrl(a["url"]) ?? firstString(a["href"]);
    if (!url) continue;
    out.push({
      url,
      mediaType: firstString(a["mediaType"]),
      name: firstString(a["name"]),
      type: firstString(a["type"]),
      width: typeof a["width"] === "number" ? (a["width"] as number) : undefined,
      height: typeof a["height"] === "number" ? (a["height"] as number) : undefined,
    });
  }
  // Video/Audio objects (e.g. PeerTube) put playable media in `url` links, not attachment.
  const types = typesOf(raw);
  if (types.includes("Video") || types.includes("Audio")) {
    for (const l of asArray(raw["url"])) {
      if (isRecord(l) && typeof l["href"] === "string") {
        const mt = firstString(l["mediaType"]);
        if (mt && /^(video|audio)\//.test(mt)) out.push({ url: l["href"] as string, mediaType: mt, type: types.includes("Video") ? "Video" : "Audio" });
      }
    }
  }
  // A featured/thumbnail `image` (Lemmy post thumbnails, Article/Video headers) when
  // no explicit image attachment already exists.
  if (!out.some((a) => a.mediaType?.startsWith("image/") || a.type === "Image")) {
    const img = firstString((raw["image"] as any)) ?? (isRecord(raw["image"]) ? firstString((raw["image"] as any)["url"]) : undefined);
    if (img) out.push({ url: img, mediaType: "image/*", type: "Image" });
  }
  return out;
}

export function parseObject(raw: unknown): APObject {
  if (!isRecord(raw)) throw new Error("object is not an object");
  const id = firstString(raw["id"]) ?? "";
  const attributedToRaw = raw["attributedTo"];
  let attributedTo: string | APActor | undefined;
  const embedded = asArray(attributedToRaw).find(isRecord);
  if (embedded) attributedTo = parseActor(embedded);
  else attributedTo = firstString(attributedToRaw);

  return {
    id: id || pickUrl(raw["url"]) || "",
    types: typesOf(raw),
    contentHtml: firstString(raw["content"]),
    name: firstString(raw["name"]),
    summaryHtml: firstString(raw["summary"]),
    published: firstString(raw["published"]),
    url: pickUrl(raw["url"]) ?? id,
    attributedTo,
    attachments: parseAttachments(raw),
    inReplyTo: firstString(raw["inReplyTo"]),
    repliesUrl: typeof raw["replies"] === "string" ? (raw["replies"] as string) : isRecord(raw["replies"]) ? firstString((raw["replies"] as Record<string, unknown>)["id"]) : undefined,
    sensitive: raw["sensitive"] === true,
  };
}

export function parseActivity(raw: unknown): APActivity {
  if (!isRecord(raw)) throw new Error("activity is not an object");
  const types = typesOf(raw);
  const actorRaw = raw["actor"];
  const actorEmbedded = asArray(actorRaw).find(isRecord);
  const objRaw = raw["object"];
  const objEmbedded = asArray(objRaw).find(isRecord);
  return {
    id: firstString(raw["id"]),
    types,
    actor: actorEmbedded ? parseActor(actorEmbedded) : firstString(actorRaw),
    object: objEmbedded ? parseObject(objEmbedded) : firstString(objRaw),
    published: firstString(raw["published"]),
  };
}

// An outbox item may itself be an activity (Create/Announce) or, rarely, a bare object.
const ACTIVITY_TYPES = new Set(["Create", "Announce", "Update", "Add", "Like", "Delete", "Remove"]);
export function parseOutboxItem(raw: unknown): APActivity {
  if (isRecord(raw) && typesOf(raw).some((t) => ACTIVITY_TYPES.has(t))) return parseActivity(raw);
  // Bare object → wrap as an implicit Create so the normalizer has one path.
  return { types: ["Create"], object: isRecord(raw) ? parseObject(raw) : firstString(raw), published: isRecord(raw) ? firstString(raw["published"]) : undefined };
}
