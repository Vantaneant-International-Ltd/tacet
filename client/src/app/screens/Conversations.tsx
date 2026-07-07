import { Avatar, SectionHeading, EmptyState, Button, Loading } from "../../design/primitives";
import { navigate } from "../../router";
import { conversationPath, relativeTime } from "../openweb";
import { api, useResource } from "../me";

// Conversations — the reader's home for threads. There is no messaging here: a
// conversation is opened by reading a post, and the ones you've read gather here so you
// can return to them. Correspondence to understand, not an inbox to clear.
export function Conversations() {
  const recent = useResource(() => api.listRecent(), []);

  return (
    <div className="t-screen t-screen--reading">
      <SectionHeading
        title="Conversations"
        subtitle="Threads you've opened. Read a post anywhere to follow its conversation."
        action={
          recent.status === "ready" && recent.data.length > 0 ? (
            <Button variant="ghost" size="sm" onClick={async () => { await api.clearRecent(); recent.reload(); }}>Clear</Button>
          ) : undefined
        }
      />

      {recent.status === "loading" && <Loading label="Gathering conversations" />}

      {recent.status === "ready" && recent.data.length === 0 && (
        <EmptyState icon="conversations" title="No conversations yet">
          Open any post — from Today, a profile, or Discover — to read the conversation around
          it. The ones you read will wait for you here.
        </EmptyState>
      )}

      {recent.status === "ready" && recent.data.length > 0 && (
        <div className="t-list t-list--flush">
          {recent.data.map((r) => (
            <button key={r.id} className="t-convorow" onClick={() => navigate(conversationPath(r.remoteId))}>
              <Avatar name={r.authorName || r.authorHandle || "?"} size={46} />
              <span className="t-convorow__body">
                <span className="t-convorow__top">
                  <span className="t-convorow__name">{r.authorName || r.authorHandle}</span>
                  <span className="t-convorow__time t-mono">{relativeTime(r.viewedAt)}</span>
                </span>
                <span className="t-convorow__preview">{r.text || r.url}</span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
