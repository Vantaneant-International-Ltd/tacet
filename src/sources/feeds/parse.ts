// A tolerant parser for the three feed dialects — RSS 2.0, Atom, and JSON Feed — into one
// intermediate shape the adapter then normalizes into the domain. XML is parsed with
// fast-xml-parser (pure JS, Workers-compatible, zero Node built-ins). Nothing here reaches
// the network or the UI; it turns bytes into a `ParsedFeed`.

import { XMLParser } from "fast-xml-parser";

export interface ParsedMedia {
  url: string;
  kind: "image" | "video" | "audio" | "other";
  alt: string;
}

export interface ParsedItem {
  id: string; // guid / atom id / json id (stable per item)
  title?: string;
  url: string; // the item's permalink
  contentHtml: string; // may contain markup; the adapter strips it to plain text
  published?: string; // best available timestamp (RFC-822 / ISO / etc.)
  authorName?: string;
  media: ParsedMedia[];
}

export interface ParsedFeed {
  title?: string; // publication name (the human label)
  siteUrl?: string; // the site this feed belongs to
  iconUrl?: string; // feed-declared icon, if any
  items: ParsedItem[];
}

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  trimValues: true,
  processEntities: true,
  // Keep everything as strings; never coerce ids/dates into numbers.
  parseAttributeValue: false,
  parseTagValue: false,
});

function asArray<T>(x: T | T[] | undefined): T[] {
  if (x === undefined || x === null) return [];
  return Array.isArray(x) ? x : [x];
}

// Pull a usable string out of a node that may be a string, a { "#text" }, or a CDATA wrap.
function text(node: unknown): string {
  if (node == null) return "";
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (typeof node === "object") {
    const o = node as Record<string, unknown>;
    if (typeof o["#text"] === "string") return o["#text"];
    if (typeof o["#text"] === "number") return String(o["#text"]);
  }
  return "";
}

function mediaKindFromMime(mime?: string): ParsedMedia["kind"] {
  if (!mime) return "other";
  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("video/")) return "video";
  if (mime.startsWith("audio/")) return "audio";
  return "other";
}

// ── JSON Feed (https://jsonfeed.org) ─────────────────────────────────────────
function parseJsonFeed(obj: Record<string, unknown>): ParsedFeed {
  const items = asArray(obj.items as unknown[]).map((raw): ParsedItem => {
    const it = raw as Record<string, unknown>;
    const media: ParsedMedia[] = asArray(it.attachments as unknown[]).map((a) => {
      const at = a as Record<string, unknown>;
      return { url: String(at.url ?? ""), kind: mediaKindFromMime(String(at.mime_type ?? "")), alt: String(at.title ?? "") };
    }).filter((m) => m.url);
    if (typeof it.image === "string" && it.image) media.unshift({ url: it.image, kind: "image", alt: "" });
    const authors = asArray(it.authors as unknown[]);
    const authorName = authors.length ? String((authors[0] as Record<string, unknown>).name ?? "") : String((it.author as Record<string, unknown> | undefined)?.name ?? "");
    return {
      id: String(it.id ?? it.url ?? ""),
      title: it.title ? String(it.title) : undefined,
      url: String(it.url ?? it.external_url ?? it.id ?? ""),
      contentHtml: String(it.content_html ?? it.content_text ?? it.summary ?? ""),
      published: it.date_published ? String(it.date_published) : undefined,
      authorName: authorName || undefined,
      media,
    };
  });
  return {
    title: obj.title ? String(obj.title) : undefined,
    siteUrl: obj.home_page_url ? String(obj.home_page_url) : undefined,
    iconUrl: (obj.icon || obj.favicon) ? String(obj.icon ?? obj.favicon) : undefined,
    items,
  };
}

// ── RSS 2.0 ──────────────────────────────────────────────────────────────────
function parseRss(channel: Record<string, unknown>): ParsedFeed {
  const items = asArray(channel.item as unknown[]).map((raw): ParsedItem => {
    const it = raw as Record<string, unknown>;
    const media: ParsedMedia[] = [];
    for (const enc of asArray(it.enclosure as unknown[])) {
      const e = enc as Record<string, unknown>;
      const url = String(e["@_url"] ?? "");
      if (url) media.push({ url, kind: mediaKindFromMime(String(e["@_type"] ?? "")), alt: "" });
    }
    for (const mc of asArray(it["media:content"] as unknown[])) {
      const m = mc as Record<string, unknown>;
      const url = String(m["@_url"] ?? "");
      if (url) media.push({ url, kind: mediaKindFromMime(String(m["@_type"] ?? m["@_medium"] === "image" ? "image/*" : "")), alt: "" });
    }
    const thumb = it["media:thumbnail"] as Record<string, unknown> | undefined;
    if (thumb?.["@_url"]) media.push({ url: String(thumb["@_url"]), kind: "image", alt: "" });
    const guid = it.guid as Record<string, unknown> | string | undefined;
    return {
      id: String(text(guid) || it.link || ""),
      title: it.title ? text(it.title) : undefined,
      url: String(text(it.link) || (typeof guid === "object" && guid && guid["@_isPermaLink"] !== "false" ? text(guid) : "") || ""),
      contentHtml: String(text(it["content:encoded"]) || text(it.description) || ""),
      published: it.pubDate ? String(text(it.pubDate)) : (it["dc:date"] ? String(text(it["dc:date"])) : undefined),
      authorName: it["dc:creator"] ? text(it["dc:creator"]) : (it.author ? text(it.author) : undefined),
      media: media.filter((m) => m.url),
    };
  });
  const image = channel.image as Record<string, unknown> | undefined;
  return {
    title: channel.title ? text(channel.title) : undefined,
    siteUrl: channel.link ? text(channel.link) : undefined,
    iconUrl: image?.url ? text(image.url) : undefined,
    items,
  };
}

// ── Atom (incl. YouTube channel feeds, which are Atom + media:group) ──────────
function atomLink(links: unknown, rel: string): string {
  for (const l of asArray(links as unknown[])) {
    const o = l as Record<string, unknown>;
    if (String(o["@_rel"] ?? "alternate") === rel && o["@_href"]) return String(o["@_href"]);
  }
  // fall back to the first href
  for (const l of asArray(links as unknown[])) {
    const o = l as Record<string, unknown>;
    if (o["@_href"]) return String(o["@_href"]);
  }
  return "";
}

function parseAtom(feed: Record<string, unknown>): ParsedFeed {
  const items = asArray(feed.entry as unknown[]).map((raw): ParsedItem => {
    const e = raw as Record<string, unknown>;
    const media: ParsedMedia[] = [];
    // YouTube: media:group > media:thumbnail (+ the entry link is the watch URL).
    const group = e["media:group"] as Record<string, unknown> | undefined;
    const thumb = (group?.["media:thumbnail"] ?? e["media:thumbnail"]) as Record<string, unknown> | undefined;
    if (thumb?.["@_url"]) media.push({ url: String(thumb["@_url"]), kind: "image", alt: "" });
    const author = e.author as Record<string, unknown> | undefined;
    const content = e.content as Record<string, unknown> | string | undefined;
    const summary = e.summary as Record<string, unknown> | string | undefined;
    const desc = (group?.["media:description"]) as unknown;
    return {
      id: String(text(e.id) || atomLink(e.link, "alternate") || ""),
      title: e.title ? text(e.title) : undefined,
      url: atomLink(e.link, "alternate") || String(text(e.id) || ""),
      contentHtml: String(text(content) || text(summary) || text(desc) || ""),
      published: e.published ? String(text(e.published)) : (e.updated ? String(text(e.updated)) : undefined),
      authorName: author?.name ? text(author.name) : undefined,
      media,
    };
  });
  return {
    title: feed.title ? text(feed.title) : undefined,
    siteUrl: atomLink(feed.link, "alternate"),
    iconUrl: feed.icon ? text(feed.icon) : (feed.logo ? text(feed.logo) : undefined),
    items,
  };
}

// Parse raw feed bytes (XML or JSON) into a ParsedFeed. Throws on genuinely unparseable
// input; returns an empty item list for a well-formed but empty feed.
export function parseFeed(body: string, contentType = ""): ParsedFeed {
  const trimmed = body.trimStart();
  if (contentType.includes("json") || trimmed.startsWith("{")) {
    return parseJsonFeed(JSON.parse(body) as Record<string, unknown>);
  }
  const obj = parser.parse(body) as Record<string, unknown>;
  if (obj.rss && typeof obj.rss === "object") {
    const channel = (obj.rss as Record<string, unknown>).channel as Record<string, unknown> | undefined;
    if (channel) return parseRss(channel);
  }
  if (obj["rdf:RDF"] && typeof obj["rdf:RDF"] === "object") {
    // RSS 1.0 (RDF): channel + item live as siblings under rdf:RDF.
    const rdf = obj["rdf:RDF"] as Record<string, unknown>;
    const channel = (rdf.channel as Record<string, unknown>) ?? {};
    channel.item = rdf.item;
    return parseRss(channel);
  }
  if (obj.feed && typeof obj.feed === "object") {
    return parseAtom(obj.feed as Record<string, unknown>);
  }
  throw new Error("unrecognized feed format");
}
