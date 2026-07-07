import { useEffect, useState } from "react";
import { api, ApiError, type Room } from "../api";
import { navigate } from "../router";
import { resizeImage } from "../util";
import { ErrorLine } from "../bits";

// The compose FAB opens this: pick a community, write, post. Not persistent (DESIGN §5).
export function GlobalCompose({ presetSlug, onClose }: { presetSlug?: string; onClose: () => void }) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [slug, setSlug] = useState(presetSlug ?? "");
  const [body, setBody] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.rooms().then((r) => {
      setRooms(r.rooms);
      if (!presetSlug && r.rooms[0]) setSlug(r.rooms[0].slug);
    });
  }, [presetSlug]);

  async function post() {
    if (!slug) {
      setError("Choose a community to post in.");
      return;
    }
    setError(null);
    setBusy(true);
    try {
      if (file) {
        const variant = await resizeImage(file);
        const form = new FormData();
        form.set("original", file);
        form.set("variant", new File([variant], "variant.jpg", { type: "image/jpeg" }));
        form.set("body", body.trim());
        await api.createImage(slug, form);
      } else {
        if (!body.trim()) {
          setError("A post needs some words.");
          setBusy(false);
          return;
        }
        await api.createText(slug, body.trim());
      }
      onClose();
      navigate(`/rooms/${slug}`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "That did not post.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="overlay" role="dialog" aria-label="Write a post">
      <div className="overlay-inner">
        <div className="overlay-head">
          <p className="label">New post</p>
          <button className="label" onClick={onClose}>
            Close
          </button>
        </div>

        <label className="label compose-in">In</label>
        <select className="compose-select" value={slug} onChange={(e) => setSlug(e.target.value)}>
          {rooms.length === 0 && <option value="">No communities yet</option>}
          {rooms.map((r) => (
            <option key={r.slug} value={r.slug}>
              {r.name}
            </option>
          ))}
        </select>

        <textarea
          className="composer-text voice"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Say something"
          rows={7}
          autoFocus
        />

        <div className="overlay-foot">
          <label className="label attach">
            {file ? file.name : "Attach image"}
            <input type="file" accept="image/*" hidden onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          </label>
          <ErrorLine>{error}</ErrorLine>
          <button className="label action" onClick={post} disabled={busy}>
            {busy ? "…" : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
}
