import { useState } from "react";
import { Avatar, IconButton, Button } from "../design/primitives";
import { Icon } from "../design/icons";
import type { Person, Post } from "./mock";
import { personById, handle } from "./mock";

// A person's name and address. Everyone is simply "a person" — where their home
// happens to be lives quietly in the address, the way an email address does. No
// "remote" badge, no protocol; one coherent people model.
export function PersonIdentity({ person, time }: { person: Person; time?: string }) {
  return (
    <div className="t-identity">
      <span className="t-identity__name">
        {person.name}
        {person.verified && (
          <span className="t-identity__verified" title="Identity confirmed">
            <Icon name="verified" size={15} />
          </span>
        )}
      </span>
      <span className="t-identity__meta t-mono">
        {handle(person)}
        {time && <span aria-hidden="true"> · {time}</span>}
      </span>
    </div>
  );
}

// A calm gradient stands in for real media in the alpha — never a broken image,
// never a gray box. Labeled for screen readers.
function MediaPlaceholder({ hue, label }: { hue: number; label: string }) {
  return (
    <div
      className="t-media"
      role="img"
      aria-label={label}
      style={{
        background: `linear-gradient(135deg, hsl(${hue} 45% 62%), hsl(${(hue + 40) % 360} 38% 46%))`,
      }}
    >
      <span className="t-media__label">{label}</span>
    </div>
  );
}

// The content card. Chronological, calm, honest about its origin. Actions carry no
// public numbers: Reply (conversation), Save (private bookmark), the private positive
// Spark, Share. See docs/03-design-system/content-cards.md.
export function PostCard({ post }: { post: Post }) {
  const author = personById(post.authorId);
  const [saved, setSaved] = useState(!!post.savedByMe);
  const [sparked, setSparked] = useState(!!post.sparkedByMe);

  return (
    <article className="t-post t-card">
      <div className="t-post__head">
        <Avatar name={author.name} size={44} />
        <PersonIdentity person={author} time={post.time} />
        <IconButton name="more" label="More" size={20} className="t-post__more" />
      </div>

      {post.kind === "long" && post.title && (
        <h3 className="t-post__title">{post.title}</h3>
      )}

      <p className="t-post__body">{post.body}</p>

      {post.image && <MediaPlaceholder hue={post.image.hue} label={post.image.label} />}

      {post.kind === "long" && (
        <Button variant="secondary" size="sm" className="t-post__read">Read the essay</Button>
      )}

      <div className="t-post__actions">
        <button className="t-action" type="button">
          <Icon name="reply" size={19} /> <span>Reply</span>
        </button>
        <button
          className={"t-action" + (sparked ? " is-on" : "")}
          type="button"
          aria-pressed={sparked}
          onClick={() => setSparked((s) => !s)}
        >
          <Icon name="spark" size={18} /> <span>{sparked ? "Sparked" : "Spark"}</span>
        </button>
        <button
          className={"t-action" + (saved ? " is-on" : "")}
          type="button"
          aria-pressed={saved}
          onClick={() => setSaved((s) => !s)}
        >
          <Icon name={saved ? "saved" : "save"} size={19} /> <span>{saved ? "Saved" : "Save"}</span>
        </button>
        <button className="t-action t-action--end" type="button" aria-label="Share">
          <Icon name="share" size={19} />
        </button>
      </div>

      {post.replyPreview && (
        <div className="t-post__reply">
          <Avatar name={personById(post.replyPreview.authorId).name} size={28} />
          <p>
            <span className="t-post__reply-name">{personById(post.replyPreview.authorId).name}</span>{" "}
            {post.replyPreview.body}
          </p>
        </div>
      )}
    </article>
  );
}

// A person, with a Follow/Following control. Following toggles locally (alpha).
export function PersonRow({ person }: { person: Person }) {
  const [following, setFollowing] = useState(person.following);
  return (
    <div className="t-personrow t-card t-card--interactive">
      <Avatar name={person.name} size={52} />
      <div className="t-personrow__body">
        <PersonIdentity person={person} />
        <p className="t-personrow__bio">{person.bio}</p>
        {person.followsYou && <span className="t-personrow__badge">Follows you</span>}
      </div>
      <Button
        variant={following ? "secondary" : "primary"}
        size="sm"
        onClick={() => setFollowing((f) => !f)}
      >
        {following ? "Following" : "Follow"}
      </Button>
    </div>
  );
}
