import { fetchAp } from "./fetch";
import { asArray, firstString, isRecord } from "./jsonld";
import type { RequestSigner } from "./signing";

// Read an ActivityPub Collection / OrderedCollection up to `limit` items. Handles the
// standard indirection: a collection may inline its items, or point at a `first` page
// which then chains via `next`. Read-only; returns RAW items for the parser to interpret.

function itemsOf(node: Record<string, unknown>): unknown[] {
  const ordered = node["orderedItems"];
  const items = node["items"];
  if (ordered != null) return asArray(ordered);
  if (items != null) return asArray(items);
  return [];
}

export async function fetchCollectionItems(
  collectionUrl: string,
  limit: number,
  maxPages = 3,
  signer?: RequestSigner,
): Promise<unknown[]> {
  const out: unknown[] = [];
  let node: unknown = await fetchAp(collectionUrl, { signer });
  if (!isRecord(node)) return out;

  // If the collection points at a first page, follow it.
  const first = node["first"];
  if (out.length === 0 && itemsOf(node).length === 0 && first != null) {
    const firstUrl = typeof first === "string" ? first : firstString((first as any));
    if (firstUrl) {
      node = await fetchAp(firstUrl, { signer });
      if (!isRecord(node)) return out;
    } else if (isRecord(first)) {
      node = first; // page embedded inline
    }
  }

  let pages = 0;
  while (isRecord(node) && out.length < limit && pages < maxPages) {
    for (const it of itemsOf(node)) {
      out.push(it);
      if (out.length >= limit) break;
    }
    if (out.length >= limit) break;
    const next = node["next"];
    const nextUrl = typeof next === "string" ? next : isRecord(next) ? firstString(next["id"] ?? next["href"]) : undefined;
    if (!nextUrl) break;
    node = await fetchAp(nextUrl, { signer });
    pages++;
  }
  return out.slice(0, limit);
}
