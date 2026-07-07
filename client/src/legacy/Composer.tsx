import { useState } from "react";
import { api, ApiError, type Post } from "../api";
import { resizeImage } from "../util";
import { ErrorLine } from "../bits";

// A full overlay on --panel, opened by WRITE. Not persistent (DESIGN §5). Placeholder
// text is quiet and literal (the room name), never an exhortation.
export function Composer({
  slug,
  roomName,
  onPosted,
  onClose,
}: {
  slug: string;
  roomName: string;
  onPosted: (post: Post) => void;
  onClose: () => void;
}) {
  const [body, setBody] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit() {
    setError(null);
    setBusy(true);
    try {
      let post: Post;
      if (file) {
        const variant = await resizeImage(file);
        const form = new FormData();
        form.set("original", file);
        form.set("variant", new File([variant], "variant.jpg", { type: "image/jpeg" }));
        form.set("body", body.trim());
        post = (await api.createImage(slug, form)).post;
      } else {
        if (!body.trim()) {
          setError("A post needs some words.");
          setBusy(false);
          return;
        }
        post = (await api.createText(slug, body.trim())).post;
      }
      onPosted(post);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "That did not post. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="overlay" role="dialog" aria-label={`Write in ${roomName}`}>
      <div className="overlay-inner">
        <div className="overlay-head">
          <p className="label">{roomName}</p>
          <button className="label" onClick={onClose}>
            Close
          </button>
        </div>

        <textarea
          className="composer-text voice"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder={roomName}
          rows={8}
          autoFocus
        />

        <div className="overlay-foot">
          <label className="label attach">
            {file ? file.name : "Attach image"}
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </label>
          <ErrorLine>{error}</ErrorLine>
          <button className="label action" onClick={submit} disabled={busy}>
            {busy ? "…" : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
}
