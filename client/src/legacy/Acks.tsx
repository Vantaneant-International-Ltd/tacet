import { api, ACK_ORDER, ACK_LABEL, type AckWord, type Post } from "../api";
import { useUser } from "../session";

// The acknowledgment control (lockfile §10). Three words, no opposite. Placing a word is a
// gesture, not a composition. Acknowledgments are attributed and room-visible, and shown as
// names grouped by word — never a number.
export function Acks({ post, onChange }: { post: Post; onChange: (p: Post) => void }) {
  const me = useUser();

  async function toggle(word: AckWord) {
    let my_ack: AckWord | null;
    if (post.my_ack === word) {
      await api.unack(post.id);
      my_ack = null;
    } else {
      await api.ack(post.id, word);
      my_ack = word;
    }
    const handle = me?.handle;
    let acks = post.acks.filter((a) => a.handle !== handle);
    if (my_ack && handle) acks = [...acks, { handle, word: my_ack }];
    onChange({ ...post, my_ack, acks });
  }

  const grouped = ACK_ORDER.map((w) => ({
    word: w,
    who: post.acks.filter((a) => a.word === w).map((a) => a.handle),
  })).filter((g) => g.who.length > 0);

  return (
    <div className="acks">
      <div className="ack-set">
        {ACK_ORDER.map((w) => (
          <button
            key={w}
            className={"label ack" + (post.my_ack === w ? " active" : "")}
            aria-pressed={post.my_ack === w}
            onClick={() => toggle(w)}
          >
            {ACK_LABEL[w]}
          </button>
        ))}
      </div>
      {grouped.length > 0 && (
        <div className="ack-who">
          {grouped.map((g) => (
            <span key={g.word} className="label ack-line">
              <span className="ack-word">{ACK_LABEL[g.word]}</span> {g.who.join(", ")}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
