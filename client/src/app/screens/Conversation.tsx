import { useState } from "react";
import { Avatar, Loading, EmptyState } from "../../design/primitives";
import { Icon } from "../../design/icons";
import { navigate } from "../../router";
import { useConversation, profilePath } from "../openweb";
import type { Conversation as ConversationT, ConversationNode, Person } from "../openweb";
import { LiveMoment } from "../live";

// The conversation reader. Opening a post means reading its conversation — the context
// that started it, the post itself, and the replies beneath — as one calm, editorial
// thread. Read-only: you understand what happened; there is nothing to reply to. Feels
// closer to a thoughtful discussion than a comments section.
export function Conversation({ postRef }: { postRef: string }) {
  const state = useConversation(postRef);

  return (
    <div className="t-screen t-screen--reading">
      <button className="t-profileback" onClick={() => (history.length > 1 ? history.back() : navigate("/today"))}>
        <Icon name="back" size={18} /> <span>Back</span>
      </button>

      {state.status === "loading" && <Loading label="Reading the conversation" />}

      {(state.status === "error" || (state.status === "ready" && !state.data.conversation)) && (
        <EmptyState icon="conversations" title="Couldn’t read this conversation">
          The thread couldn’t be reached right now. You can still open the original post.
        </EmptyState>
      )}

      {state.status === "ready" && state.data.conversation && (
        <ConversationBody conversation={state.data.conversation} />
      )}
    </div>
  );
}

function ConversationBody({ conversation }: { conversation: ConversationT }) {
  const { ancestors, focus, replies, participants } = conversation;
  const replyCount = countReplies(replies);

  return (
    <>
      <Participants people={participants} />

      {ancestors.length > 0 && (
        <section className="t-convo-context" aria-label="Earlier in this conversation">
          <p className="t-convo-context__label">How it started</p>
          <div className="t-convo-context__posts">
            {ancestors.map((m) => (
              <LiveMoment key={m.id} moment={m} />
            ))}
          </div>
          <p className="t-convo-context__label t-convo-context__label--then">The post</p>
        </section>
      )}

      <LiveMoment moment={focus} focus />

      {replies.length > 0 ? (
        <section className="t-convo-replies" aria-label="Replies">
          <p className="t-convo-context__label">
            {replyCount} {replyCount === 1 ? "reply" : "replies"}
          </p>
          <Thread nodes={replies} depth={0} />
          {conversation.truncated && <p className="t-convo-more">Some deeper replies aren’t shown — open the original to read them all.</p>}
        </section>
      ) : (
        <div className="t-caughtup">
          <Icon name="check" size={22} />
          <p className="t-caughtup__title">That’s the whole conversation</p>
          <p className="t-caughtup__body">No replies yet. You’ve read all there is.</p>
        </div>
      )}
    </>
  );
}

// A branch of the reply tree. Long branches reveal progressively so nothing overwhelms.
function Thread({ nodes, depth }: { nodes: ConversationNode[]; depth: number }) {
  const [expanded, setExpanded] = useState(false);
  const INITIAL = depth === 0 ? 6 : 3;
  const shown = expanded ? nodes : nodes.slice(0, INITIAL);
  const hidden = nodes.length - shown.length;

  return (
    <div className={"t-thread" + (depth > 0 ? " t-thread--nested" : "")}>
      {shown.map((n) => (
        <div className="t-thread__node" key={n.post.id}>
          <LiveMoment moment={n.post} />
          {n.replies.length > 0 && depth < 3 && <Thread nodes={n.replies} depth={depth + 1} />}
          {n.replies.length > 0 && depth >= 3 && (
            <button className="t-thread__continue" onClick={() => navigate("/c/" + encodeURIComponent(n.post.id))}>
              Continue this thread →
            </button>
          )}
        </div>
      ))}
      {hidden > 0 && (
        <button className="t-thread__more" onClick={() => setExpanded(true)}>
          Show {hidden} more {hidden === 1 ? "reply" : "replies"}
        </button>
      )}
    </div>
  );
}

function Participants({ people }: { people: Person[] }) {
  if (people.length === 0) return null;
  const shown = people.slice(0, 8);
  return (
    <div className="t-participants">
      <div className="t-participants__stack">
        {shown.map((p) => (
          <button key={p.id || p.handle} className="t-participants__av" title={p.name} aria-label={p.name} onClick={() => navigate(profilePath(p.id))}>
            <Avatar name={p.name} src={p.avatarUrl} size={30} />
          </button>
        ))}
      </div>
      <span className="t-participants__count">
        {people.length} {people.length === 1 ? "person" : "people"} in this conversation
      </span>
    </div>
  );
}

function countReplies(nodes: ConversationNode[]): number {
  return nodes.reduce((n, node) => n + 1 + countReplies(node.replies), 0);
}
