import { useToday } from "../openweb";
import { LiveMoment, SourceNote } from "../live";
import { Loading, EmptyState } from "../../design/primitives";
import { Icon } from "../../design/icons";
import { today } from "../mock";
import { useSavedCount } from "../me";
import { useHint } from "../onboarding/hints";
import { Hint } from "../onboarding/Hint";
import { navigate } from "../../router";

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

  return (
    <div className="t-screen t-screen--reading">
      <header className="t-today__head">
        <h1 className="t-today__greeting">{today.greeting}</h1>
        <p className="t-today__line">{today.line}</p>
      </header>

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
                {state.result.data.map((m) => (
                  <LiveMoment key={m.id} moment={m} />
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
  );
}
