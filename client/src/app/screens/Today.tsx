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
import { TodayContext } from "../TodayContext";

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

// The mobile lens row. Only "For You" is backed by data today, so the other three are
// honestly inert ("coming soon") — never a filter that silently shows the same feed (W1).
const LENSES = ["For You", "Following", "Local", "Trending"];
function TodayLens() {
  return (
    <div className="t-lens" role="radiogroup" aria-label="View of Today">
      {LENSES.map((l, i) => (
        <button
          key={l}
          type="button"
          role="radio"
          aria-checked={i === 0}
          disabled={i !== 0}
          title={i !== 0 ? "Coming soon" : undefined}
          className={"t-lens__opt" + (i === 0 ? " is-active" : "")}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

// The calm inline composer entry. Opens the existing compose overlay (an honest
// not-yet-publishing preview) via the shell's compose event — no new publish plumbing.
function ComposerRow() {
  const open = () => window.dispatchEvent(new CustomEvent("tacet:compose"));
  return (
    <div className="t-composer-row">
      <Avatar name={me.name} size={36} />
      <button className="t-composer-row__pill" type="button" onClick={open}>What&rsquo;s on your mind?</button>
      <button className="t-iconbtn t-composer-row__cam" type="button" aria-label="Share a photo" onClick={open}>
        <Icon name="plus" size={20} />
      </button>
    </div>
  );
}

// A labelled hairline divider between editorial groups.
function FeedDivider({ label }: { label: string }) {
  return (
    <div className="t-divider" role="separator" aria-label={label}>
      <span className="t-divider__label t-mono">{label}</span>
      <span className="t-divider__rule" aria-hidden="true" />
    </div>
  );
}

// The feed, grouped by real recency into "This <part of day>" (today) and "Earlier". The very
// first moment is the lead (hero). Dividers only appear for non-empty groups. Real data only.
function TodayFeed({ moments }: { moments: Moment[] }) {
  const now = new Date();
  const isToday = (iso: string) => {
    const d = new Date(iso);
    return !Number.isNaN(d.getTime()) && d.toDateString() === now.toDateString();
  };
  const recent = moments.filter((m) => isToday(m.createdAt));
  const earlier = moments.filter((m) => !isToday(m.createdAt));
  const leadId = moments[0]?.id;
  // Up to two visually rich REAL posts (media present), not the lead — media-first by recency,
  // never by engagement. Given the honest "From your world" highlight treatment.
  const highlightIds = new Set(
    moments.filter((m) => m.id !== leadId && m.media.some((x) => x.kind === "image" || x.kind === "video")).slice(0, 2).map((m) => m.id),
  );
  const card = (m: Moment) => (
    <LiveMoment key={m.id} moment={m} feed lead={m.id === leadId} highlight={highlightIds.has(m.id)} />
  );
  return (
    <div className="t-feed">
      <ComposerRow />
      {recent.length > 0 && <FeedDivider label={`This ${partOfDay(now.getHours())}`} />}
      {recent.map(card)}
      {earlier.length > 0 && <FeedDivider label="Earlier" />}
      {earlier.map(card)}
    </div>
  );
}

// The calm entry point, now reading real public content from the open social web
// through the adapter. Finite, curated-feeling, and honest about its source. If the
// open web can't be reached, it degrades to sample content (clearly labelled) rather
// than showing an error.
export function Today() {
  const state = useToday();
  const moments = state.status === "ready" ? state.result.data : [];

  return (
    <Surface context={<TodayContext moments={moments} />}>
    <div className="t-screen t-screen--reading">
      <TodayMasthead moments={moments} />
      <TodayLens />

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
              <TodayFeed moments={state.result.data} />
              <div className="t-caughtup">
                <span className="t-caughtup__rule" aria-hidden="true" />
                <Icon name="check" size={28} />
                <p className="t-caughtup__title">That’s today. You’re all caught up.</p>
                <p className="t-caughtup__body">Nothing more is waiting. The rest of the evening is yours.</p>
                <button className="t-caughtup__cta" type="button" onClick={() => navigate("/discover")}>
                  Look around Discover <span aria-hidden="true">→</span>
                </button>
              </div>
            </>
          )}
        </>
      )}
    </div>
    </Surface>
  );
}
