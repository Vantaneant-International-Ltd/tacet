import { useState } from "react";
import { conversations, personById, handle } from "../mock";
import { Avatar, IconButton, SectionHeading, EmptyState } from "../../design/primitives";

// Correspondence, not notifications. Presence without the red-dot pull. A calm
// two-pane on desktop; a focused thread on mobile.
export function Conversations() {
  const [selected, setSelected] = useState<string | null>(conversations[0]?.id ?? null);
  const active = conversations.find((c) => c.id === selected) ?? null;

  return (
    <div className="t-screen t-convo">
      <div className={"t-convo__list" + (selected ? " is-hidden-mobile" : "")}>
        <SectionHeading title="Conversations" subtitle="Where your people reach you. Quietly." />
        <div className="t-list t-list--flush">
          {conversations.map((c) => {
            const person = personById(c.personId);
            return (
              <button
                key={c.id}
                className={"t-convorow" + (c.id === selected ? " is-active" : "")}
                onClick={() => setSelected(c.id)}
              >
                <Avatar name={person.name} size={46} />
                <span className="t-convorow__body">
                  <span className="t-convorow__top">
                    <span className="t-convorow__name">{person.name}</span>
                    <span className="t-convorow__time t-mono">{c.time}</span>
                  </span>
                  <span className={"t-convorow__preview" + (c.unread ? " is-unread" : "")}>{c.preview}</span>
                </span>
                {c.unread && <span className="t-convorow__dot" aria-label="Unread" />}
              </button>
            );
          })}
        </div>
      </div>

      <div className={"t-convo__thread" + (selected ? "" : " is-hidden-mobile")}>
        {active ? (
          <Thread key={active.id} conversationId={active.id} onBack={() => setSelected(null)} />
        ) : (
          <EmptyState icon="conversations" title="Nothing needs you right now">
            Pick a conversation, or enjoy the quiet.
          </EmptyState>
        )}
      </div>
    </div>
  );
}

function Thread({ conversationId, onBack }: { conversationId: string; onBack: () => void }) {
  const convo = conversations.find((c) => c.id === conversationId)!;
  const person = personById(convo.personId);
  const [draft, setDraft] = useState("");

  return (
    <div className="t-thread">
      <header className="t-thread__head">
        <IconButton name="back" label="Back to conversations" className="t-thread__back" onClick={onBack} />
        <Avatar name={person.name} size={38} />
        <div className="t-thread__who">
          <span className="t-thread__name">{person.name}</span>
          <span className="t-thread__handle t-mono">{handle(person)}</span>
        </div>
      </header>

      <div className="t-thread__stream">
        {convo.messages.map((m, i) => (
          <div key={i} className={"t-bubble" + (m.fromMe ? " t-bubble--me" : "")}>
            <p>{m.text}</p>
            <span className="t-bubble__time t-mono">{m.time}</span>
          </div>
        ))}
      </div>

      <form className="t-thread__compose" onSubmit={(e) => { e.preventDefault(); setDraft(""); }}>
        <input
          className="t-input"
          placeholder={`Message ${person.name.split(" ")[0]}…`}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          aria-label="Message"
        />
        <IconButton name="share" label="Send" disabled={!draft.trim()} />
      </form>
    </div>
  );
}
