import { useState } from "react";
import { Avatar, Button } from "../design/primitives";
import { Icon } from "../design/icons";
import { SourceBadge, PostCounts, PostMedia } from "./live";
import { api, forgetSaved } from "./me";
import type { SavedPost, CollectionSummary } from "./me";
import { relativeTime } from "./openweb";

// One saved post — a local snapshot the user owns. Actions are all local: pin, read
// later, private note, add to collections, remove. No writes ever reach the open web.
export function SavedCard({
  saved,
  collections,
  onChanged,
}: {
  saved: SavedPost;
  collections: CollectionSummary[];
  onChanged: () => void;
}) {
  const [editingNote, setEditingNote] = useState(false);
  const [noteDraft, setNoteDraft] = useState(saved.note ?? "");
  const [showCollections, setShowCollections] = useState(false);
  const source = { id: saved.sourceId, name: saved.sourceId, url: "", software: saved.sourceSoftware };

  async function patch(edit: { pinned?: boolean; readLater?: boolean; note?: string | null }) {
    await api.updateSaved(saved.id, edit);
    onChanged();
  }
  async function remove() {
    await api.unsave(saved.id);
    forgetSaved(saved.remoteId);
    onChanged();
  }
  async function saveNote() {
    await patch({ note: noteDraft.trim() || null });
    setEditingNote(false);
  }
  async function toggleCollection(c: CollectionSummary) {
    if (saved.collectionIds.includes(c.id)) await api.removeFromCollection(c.id, saved.id);
    else await api.addToCollection(c.id, saved.id);
    onChanged();
  }

  return (
    <article className="t-post t-card">
      <div className="t-post__head">
        <Avatar name={saved.authorName || "?"} src={saved.authorAvatarUrl} size={40} />
        <div className="t-identity">
          <span className="t-identity__name">{saved.authorName}</span>
          <span className="t-identity__meta t-mono">
            {saved.authorHandle}
            <span aria-hidden="true"> · saved {relativeTime(saved.savedAt)}</span>
          </span>
          <SourceBadge source={source} />
        </div>
        {saved.pinned && (
          <span className="t-saved__pin" title="Pinned" aria-label="Pinned">
            <Icon name="spark" size={15} />
          </span>
        )}
      </div>

      {saved.text && <p className="t-post__body">{saved.text}</p>}
      <PostMedia media={saved.media} />
      <PostCounts counts={saved.counts} />

      {saved.note && !editingNote && (
        <div className="t-savednote" onClick={() => { setNoteDraft(saved.note ?? ""); setEditingNote(true); }}>
          <span className="t-savednote__label">Private note</span>
          <p>{saved.note}</p>
        </div>
      )}

      {editingNote && (
        <div className="t-savednote t-savednote--edit">
          <textarea
            className="t-savednote__area"
            value={noteDraft}
            onChange={(e) => setNoteDraft(e.target.value)}
            placeholder="A private note, just for you…"
            rows={2}
            autoFocus
          />
          <div className="t-savednote__actions">
            <Button size="sm" variant="ghost" onClick={() => setEditingNote(false)}>Cancel</Button>
            <Button size="sm" variant="primary" onClick={saveNote}>Save note</Button>
          </div>
        </div>
      )}

      {showCollections && (
        <div className="t-collpick">
          {collections.length === 0 && <span className="t-collpick__empty">No collections yet — create one below.</span>}
          {collections.map((c) => (
            <button
              key={c.id}
              className={"t-chip t-collpick__chip" + (saved.collectionIds.includes(c.id) ? " is-on" : "")}
              onClick={() => toggleCollection(c)}
            >
              {saved.collectionIds.includes(c.id) && <Icon name="check" size={12} />} {c.name}
            </button>
          ))}
        </div>
      )}

      <div className="t-post__actions t-saved__actions">
        <button className={"t-action" + (saved.pinned ? " is-on" : "")} onClick={() => patch({ pinned: !saved.pinned })} aria-pressed={saved.pinned}>
          <Icon name="spark" size={18} /> <span>Pin</span>
        </button>
        <button className={"t-action" + (saved.readLater ? " is-on" : "")} onClick={() => patch({ readLater: !saved.readLater })} aria-pressed={saved.readLater}>
          <Icon name="today" size={18} /> <span>Later</span>
        </button>
        <button className={"t-action" + (saved.note || editingNote ? " is-on" : "")} onClick={() => { setNoteDraft(saved.note ?? ""); setEditingNote((v) => !v); }}>
          <Icon name="compose" size={18} /> <span>Note</span>
        </button>
        <button className={"t-action" + (showCollections ? " is-on" : "")} onClick={() => setShowCollections((v) => !v)}>
          <Icon name="discover" size={18} /> <span>Collect</span>
        </button>
        <a className="t-action" href={saved.url} target="_blank" rel="noreferrer noopener" aria-label="Open at source">
          <Icon name="share" size={18} />
        </a>
        <button className="t-action t-action--end" onClick={remove} aria-label="Remove from saved">
          <Icon name="close" size={18} /> <span>Remove</span>
        </button>
      </div>
    </article>
  );
}
