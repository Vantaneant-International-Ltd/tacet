import type { Moment } from "../openweb";
import { useToday } from "../openweb";
import { LiveMoment, SourceNote } from "../live";
import { Loading, EmptyState, Avatar } from "../../design/primitives";
import { Icon } from "../../design/icons";
import { today, me } from "../mock";
import { useSavedCount } from "../me";
import { useHint } from "../onboarding/hints";
import { Hint } from "../onboarding/Hint";
import { navigate } from "../../router";
import { Surface } from "../Surface";
import { ConnectivityPanel } from "../ConnectivityPanel";

// A real, human day-line + time-of-day greeting (never a hardcoded time, never a nag).
function partOfDay(h: number): string {
  if (h < 5) return "evening";
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}
function uniqueBy<T>(items: T[], key: (t: T) => string): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const it of items) {
    const k = key(it);
    if (k && !seen.has(k)) { seen.add(k); out.push(it); }
  }
  return out;
}

// The editorial masthead: overline date-line, greeting, calm sub-line, and a source cluster
// built from the REAL authors + homes in today's data (avatars + a mono provenance caption).
function TodayMasthead({ moments }: { moments: Moment[] }) {
  const now = new Date();
  const dateLine = `Today · ${now.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}`;
  const greeting = `Good ${partOfDay(now.getHours())}${me.name ? `, ${me.name}` : ""}.`;
  const authors = uniqueBy(moments.map((m) => m.author), (a) => a.id).slice(0, 5);
  const homes = uniqueBy(moments.map((m) => m.source), (s) => s.id).map((s) => s.name || s.id).slice(0, 5);
  return (
    <header className="t-today__head">
      <p className="t-today__overline t-mono">{dateLine}</p>
      <h1 className="t-today__greeting">{greeting}</h1>
      <p className="t-today__line">{today.line}</p>
      {authors.length > 0 && (
        <div className="t-today__sources">
          <div className="t-avstack" aria-hidden="true">
            {authors.map((a) => (
              <span key={a.id} className="t-avstack__item"><Avatar name={a.name} src={a.avatarUrl} size={28} /></span>
            ))}
          </div>
          {homes.length > 0 && <span className="t-today__srccap t-mono">{homes.join(" · ")}</span>}
        </div>
      )}
    </header>
  );
}

// One gentle line that teaches Save through use, then the quiet reveal that a saved post
// is now yours. Each shows once and never returns.
function TodayNudges() {
  const saved = useSavedCount();
  const saveFirst = useHint("save-first");
  const itsYours = useHint("saved-yours");
  if (saved === 0 && saveFirst.show) {
    return <Hint onDismiss={saveFirst.dismiss}>Save anything you love — it becomes part of your home.</Hint>;
  }
  if (saved > 0 && itsYours.show) {
    return (
      <Hint onDismiss={itsYours.dismiss} action={{ label: "Open Me", onClick: () => navigate("/me") }}>
        That&rsquo;s yours now — it&rsquo;s waiting for you in Me.
      </Hint>
    );
  }
  return null;
}

// The calm entry point, now reading real public content from the open social web
// through the adapter. Finite, curated-feeling, and honest about its source. If the
// open web can't be reached, it degrades to sample content (clearly labelled) rather
// than showing an error.
export function Today() {
  const state = useToday();
  const moments = state.status === "ready" ? state.result.data : [];

  return (
    <Surface context={<ConnectivityPanel />}>
    <div className="t-screen t-screen--reading">
      <TodayMasthead moments={moments} />

      {state.status === "loading" && <Loading label="Gathering today" />}

      {state.status === "error" && (
        <EmptyState icon="today" title="We couldn’t load Today">
          Something interrupted the connection. Give it a moment and try again.
        </EmptyState>
      )}

      {state.status === "ready" && (
        <>
          <TodayNudges />
          <SourceNote mode={state.result.mode} sourceName={state.result.source?.name} />

          {state.result.data.length === 0 ? (
            <EmptyState icon="today" title="A quiet morning">
              Nothing new right now. That’s allowed — the rest of the day is yours.
            </EmptyState>
          ) : (
            <>
              <div className="t-feed">
                {state.result.data.map((m, i) => (
                  <LiveMoment key={m.id} moment={m} feed lead={i === 0} />
                ))}
              </div>
              <div className="t-caughtup">
                <Icon name="check" size={22} />
                <p className="t-caughtup__title">You’re all caught up</p>
                <p className="t-caughtup__body">That’s everything for now. The rest of the day is yours.</p>
              </div>
            </>
          )}
        </>
      )}
    </div>
    </Surface>
  );
}
