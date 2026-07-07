import type { Person, Source, ProfileField } from "../types";
import type { APActor } from "../activitypub/apmodel";
import { toPlainText } from "../text";

// Canonical AP actor → Tacet Person. The ONLY place actor semantics become a product
// "person". Protocol vocabulary stops here. Counts (followers/following/posts) are filled
// in by the facade from separate collection fetches; everything else comes off the actor.

function hrefIn(html: string): string | undefined {
  const m = /<a[^>]+href="([^"]+)"/i.exec(html);
  if (m) return m[1];
  const plain = html.trim();
  return /^https?:\/\//i.test(plain) ? plain : undefined;
}

const WEB_NAME = /\b(web|site|website|url|blog|home ?page|homepage|link)\b/i;
const LOC_NAME = /\b(location|based|city|where|country|home)\b/i;

function toFields(a: APActor): ProfileField[] {
  return a.fields.map((f) => ({ name: f.name.trim(), value: toPlainText(f.valueHtml), href: hrefIn(f.valueHtml) }));
}

export function normalizePerson(a: APActor): Person {
  const source: Source = { id: a.host, name: a.host, url: a.host ? `https://${a.host}` : "" };
  const handle =
    a.preferredUsername && a.host
      ? `@${a.preferredUsername}@${a.host}`
      : a.preferredUsername
        ? `@${a.preferredUsername}`
        : "";

  const fields = toFields(a);
  const website =
    fields.find((f) => f.href && WEB_NAME.test(f.name))?.href ?? fields.find((f) => f.href)?.href;
  const location = fields.find((f) => !f.href && LOC_NAME.test(f.name))?.value || undefined;

  return {
    id: a.id || a.url || "",
    name: (a.name && a.name.trim()) || a.preferredUsername || a.host,
    handle,
    avatarUrl: a.icon?.url ?? null,
    bio: toPlainText(a.summaryHtml ?? ""),
    url: a.url ?? a.id,
    source,
    verified: false,
    bannerUrl: a.image?.url ?? null,
    joinedAt: a.published || undefined,
    website,
    location,
    fields: fields.length ? fields : undefined,
  };
}
