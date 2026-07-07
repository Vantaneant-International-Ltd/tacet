import { useToday } from "../openweb";
import { LiveMoment, SourceNote } from "../live";
import { Loading, EmptyState } from "../../design/primitives";
import { Icon } from "../../design/icons";
import { today } from "../mock";

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
