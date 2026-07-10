import { useEffect, useState } from "react";
import type { Moment, Person } from "./openweb";
import { relativeTime, profilePath, conversationPath } from "./openweb";
import { Avatar } from "../design/primitives";
import { Link, navigate } from "../router";
import { ConnectivityPanel } from "./ConnectivityPanel";
import { api } from "./me";
import type { RecentView } from "./me";

// The right context column for Today — "your world, never your score" (ADR-012). Every module
// renders REAL data derived from today's merged feed (or your own local history), or renders
// NOTHING when its data is empty. No presence claims, no fabricated curators, no scoreboards.

// Honest presence from real recency: within ~an hour → "around now" (dot); today → "earlier";
// the previous day → "yesterday"; older → relative time. Never a fabricated "is here".
function presence(iso: string): { label: string; dot: boolean } {
  const t = Date.parse(iso);
  if (!Number.isFinite(t)) return { label: "", dot: false };
  const mins = (Date.now() - t) / 60000;
  if (mins < 60) return { label: "around now", dot: true };
  const d = new Date(t);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) return { label: "earlier", dot: false };
  const y = new Date(now);
  y.setDate(now.getDate() - 1);
  if (d.toDateString() === y.toDateString()) return { label: "yesterday", dot: false };
  return { label: relativeTime(iso), dot: false };
}

// People whose posts you're seeing most in today's feed — closeness by presence in your world,
// shown with honest recency (never "is here").
function peopleClose(moments: Moment[]): { person: Person; latest: string }[] {
  const byId = new Map<string, { person: Person; count: number; latest: string }>();
  for (const m of moments) {
    const a = m.author;
    if (!a?.id) continue;
    const e = byId.get(a.id);
    if (e) { e.count++; if (m.createdAt > e.latest) e.latest = m.createdAt; }
    else byId.set(a.id, { person: a, count: 1, latest: m.createdAt });
  }
  return [...byId.values()]
    .sort((a, b) => b.count - a.count || b.latest.localeCompare(a.latest))
    .slice(0, 4)
    .map(({ person, latest }) => ({ person, latest }));
}

// Real notable pieces from today — titled work (articles, videos, long-form) surfacing in the
// merged feed. Real titles only; no invented "work titles". Empty → the module hides.
function notableToday(moments: Moment[]): Moment[] {
  return moments.filter((m) => m.title && m.title.trim().length > 0).slice(0, 3);
}

// The homes carrying the most today, by post count — world-directed, never a leaderboard of people.
function homesToday(moments: Moment[]): { name: string; count: number }[] {
  const by = new Map<string, { name: string; count: number }>();
  for (const m of moments) {
    const id = m.source.id;
    if (!id) continue;
    const e = by.get(id);
    if (e) e.count++;
    else by.set(id, { name: m.source.name || id, count: 1 });
  }
  return [...by.values()].filter((h) => h.count > 1).sort((a, b) => b.count - a.count).slice(0, 3);
}

export function TodayContext({ moments }: { moments: Moment[] }) {
  const [recent, setRecent] = useState<RecentView[] | null>(null);
  useEffect(() => {
    let alive = true;
    api.listRecent().then((r) => { if (alive) setRecent(r); }).catch(() => { if (alive) setRecent([]); });
    return () => { alive = false; };
  }, []);

  const people = peopleClose(moments);
  const notable = notableToday(moments);
  const homes = homesToday(moments);
  const cont = (recent ?? []).slice(0, 3);

  return (
    <>
      {people.length > 0 && (
        <section className="t-ctx">
          <h2 className="t-ctx__title">People close to you</h2>
          <ul className="t-ctx__list">
            {people.map(({ person, latest }) => {
              const p = presence(latest);
              return (
                <li key={person.id} className="t-ctx__person">
                  <Link to={profilePath(person.id)} className="t-ctx__personlink">
                    <Avatar name={person.name} src={person.avatarUrl} size={36} />
                    <span className="t-ctx__pbody">
                      <span className="t-ctx__pname">{person.name}</span>
                      <span className="t-ctx__pmeta t-mono">{person.handle}</span>
                    </span>
                  </Link>
                  <span className="t-ctx__prec t-mono">
                    {p.dot && <span className="t-ctx__dot" aria-hidden="true" />}{p.label}
                  </span>
                </li>
              );
            })}
          </ul>
          <Link to="/people" className="t-ctx__more">See your people <span aria-hidden="true">→</span></Link>
        </section>
      )}

      {cont.length > 0 && (
        <section className="t-ctx">
          <h2 className="t-ctx__title">Continue</h2>
          <ul className="t-ctx__list">
            {cont.map((r) => (
              <li key={r.id} className="t-ctx__continue" role="button" tabIndex={0}
                onClick={() => navigate(conversationPath(r.remoteId))}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); navigate(conversationPath(r.remoteId)); } }}>
                <span className="t-ctx__ctext">{r.text || r.authorName}</span>
                {r.sourceId && <span className="t-ctx__cmeta t-mono">{r.sourceId}</span>}
                <span className="t-ctx__cresume">Continue reading <span aria-hidden="true">→</span></span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {notable.length > 0 && (
        <section className="t-ctx">
          <h2 className="t-ctx__title">Across your world</h2>
          <ul className="t-ctx__list">
            {notable.map((m) => (
              <li key={m.id} className="t-ctx__item" role="button" tabIndex={0}
                onClick={() => navigate(conversationPath(m.id))}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); navigate(conversationPath(m.id)); } }}>
                <span className="t-ctx__iname"><em>{m.title}</em></span>
                <span className="t-ctx__imeta t-mono">{m.source.id} · {relativeTime(m.createdAt)}</span>
              </li>
            ))}
          </ul>
          <Link to="/discover" className="t-ctx__more">Look around Discover <span aria-hidden="true">→</span></Link>
        </section>
      )}

      {homes.length > 0 && (
        <section className="t-ctx">
          <h2 className="t-ctx__title">Busy on the open web today</h2>
          <ul className="t-ctx__list">
            {homes.map((h) => (
              <li key={h.name} className="t-ctx__home">
                <span className="t-ctx__hname">{h.name}</span>
                <span className="t-ctx__hn t-mono">{h.count} posts today</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <ConnectivityPanel />
    </>
  );
}
