import type { Person, Source } from "../types";
import type { APActor } from "../activitypub/apmodel";
import { toPlainText } from "../text";

// Canonical AP actor → Tacet Person. This is the ONLY place actor semantics become a
// product "person". Protocol vocabulary stops here.
export function normalizePerson(a: APActor): Person {
  const source: Source = { id: a.host, name: a.host, url: a.host ? `https://${a.host}` : "" };
  const handle =
    a.preferredUsername && a.host
      ? `@${a.preferredUsername}@${a.host}`
      : a.preferredUsername
        ? `@${a.preferredUsername}`
        : "";
  return {
    id: a.id || a.url || "",
    name: (a.name && a.name.trim()) || a.preferredUsername || a.host,
    handle,
    avatarUrl: a.icon?.url ?? null,
    bio: toPlainText(a.summaryHtml ?? ""),
    url: a.url ?? a.id,
    source,
    verified: false,
  };
}
