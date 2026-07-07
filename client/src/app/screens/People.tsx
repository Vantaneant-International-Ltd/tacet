import { useMemo, useState } from "react";
import { usePeople } from "../openweb";
import { LivePerson, SourceNote } from "../live";
import { SectionHeading, EmptyState, Loading } from "../../design/primitives";
import { Icon } from "../../design/icons";

// People, now reading real discoverable people from the open social web through the
// adapter. Everyone is simply "a person"; their home lives quietly in the address.
// Searchable, calm, no follower counts. Degrades to sample content if the open web
// can't be reached.
export function People() {
  const state = usePeople();
  const [q, setQ] = useState("");

  const people = state.status === "ready" ? state.result.data : [];
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return people;
    return people.filter((p) => p.name.toLowerCase().includes(s) || p.handle.toLowerCase().includes(s));
  }, [q, people]);

  return (
    <div className="t-screen">
      <SectionHeading title="People" subtitle="People from across the open web — discover them, keep them close." />

      <div className="t-search">
        <Icon name="search" size={19} />
        <input
          className="t-search__input"
          type="search"
          placeholder="Search people by name or @handle"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Search people"
        />
      </div>

      {state.status === "loading" && <Loading label="Finding people" />}

      {state.status === "error" && (
        <EmptyState icon="people" title="We couldn’t load People">
          Something interrupted the connection. Give it a moment and try again.
        </EmptyState>
      )}

      {state.status === "ready" && (
        <>
          <SourceNote mode={state.result.mode} sourceName={state.result.source?.name} />
          {filtered.length === 0 ? (
            <EmptyState icon="people" title={q ? "No one by that name" : "No one to show yet"}>
              {q ? "Try a different search." : "The open web is quiet right now — check back soon."}
            </EmptyState>
          ) : (
            <div className="t-list">
              {filtered.map((p) => (
                <LivePerson key={p.id} person={p} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
