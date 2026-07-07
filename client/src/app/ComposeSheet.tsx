import { useEffect, useRef, useState } from "react";
import { Avatar, Button, IconButton, Chip } from "../design/primitives";
import { me } from "./mock";

// A calm, non-persistent composer overlay. Opens on demand, focuses the text, closes
// on Escape or backdrop. Honest about reach: what you write here goes to the open web.
export function ComposeSheet({ onClose, onPost }: { onClose: () => void; onPost: () => void }) {
  const [text, setText] = useState("");
  const areaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    areaRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="t-sheet-backdrop" onClick={onClose}>
      <div
        className="t-sheet"
        role="dialog"
        aria-modal="true"
        aria-label="Compose"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="t-sheet__head">
          <IconButton name="close" label="Close composer" onClick={onClose} />
          <span className="t-sheet__title">New post</span>
          <Button variant="primary" size="sm" disabled={!text.trim()} onClick={onPost}>
            Post
          </Button>
        </header>

        <div className="t-sheet__body">
          <Avatar name={me.name} size={44} />
          <textarea
            ref={areaRef}
            className="t-compose__area"
            placeholder="Say something to your people…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={5}
          />
        </div>

        <footer className="t-sheet__foot">
          <div className="t-compose__tools">
            <IconButton name="plus" label="Add photo" />
            <IconButton name="globe" label="Audience" />
          </div>
          <Chip icon="globe" tone="open">Shares to the open web</Chip>
        </footer>
      </div>
    </div>
  );
}
