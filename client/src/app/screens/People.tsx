import { useMemo, useState } from "react";
import { people, handle } from "../mock";
import { PersonRow } from "../components";
import { SectionHeading, EmptyState } from "../../design/primitives";
import { Icon } from "../../design/icons";

// Your relationships, first-class. The people you follow, wherever on the open web
// they live — searchable, calm, no follower counts.
export function People() {
  const [q, setQ] = useState("");
  const following = people.filter((p) => p.following);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return following;
    return following.filter(
      (p) => p.name.toLowerCase().includes(s) || handle(p).toLowerCase().includes(s),
    );
  }, [q, following]);

  const local = filtered.filter((p) => p.server === "tacet.social");
  const openweb = filtered.filter((p) => p.server !== "tacet.social");

  return (
    <div className="t-screen">
      <SectionHeading title="People" subtitle="The people you keep close — here and across the open web." />

      <div className="t-search">
        <Icon name="search" size={19} />
        <input
          className="t-search__input"
          type="search"
          placeholder="Search your people"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Search your people"
        />
      </div>

      {filtered.length === 0 && (
        <EmptyState icon="people" title="No one by that name">
          Try a different search, or find new people in Discover.
        </EmptyState>
      )}

      {local.length > 0 && (
        <section className="t-group">
          <h3 className="t-group__label">On Tacet</h3>
          <div className="t-list">
            {local.map((p) => (
              <PersonRow key={p.id} person={p} />
            ))}
          </div>
        </section>
      )}

      {openweb.length > 0 && (
        <section className="t-group">
          <h3 className="t-group__label">Across the open web</h3>
          <div className="t-list">
            {openweb.map((p) => (
              <PersonRow key={p.id} person={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
