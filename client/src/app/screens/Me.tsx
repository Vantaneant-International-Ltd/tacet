import { useState } from "react";
import { me, posts, handle } from "../mock";
import { PostCard } from "../components";
import { Avatar, Button, Chip, Card } from "../../design/primitives";
import { Icon } from "../../design/icons";
import { useTheme, setTheme } from "../../design/theme";
import type { Theme } from "../../design/theme";

// Your identity and your own place. Owned, portable, yours. Not a stats page — a home.
export function Me() {
  const [tab, setTab] = useState<"posts" | "saved">("posts");
  const mine = posts.filter((p) => p.authorId === "cassie" || p.authorId === "anna").slice(0, 0); // me has no demo posts
  const saved = posts.filter((p) => p.savedByMe);

  return (
    <div className="t-screen t-screen--reading">
      <Card raised className="t-profile">
        <div className="t-profile__top">
          <Avatar name={me.name} size={76} />
          <Button variant="secondary" size="sm" icon="settings">Edit profile</Button>
        </div>
        <h1 className="t-profile__name">
          {me.name}
          {me.verified && <span className="t-identity__verified" title="Identity confirmed"><Icon name="verified" size={18} /></span>}
        </h1>
        <p className="t-profile__handle t-mono">{handle(me)}</p>
        <p className="t-profile__bio">{me.bio}</p>
        <div className="t-profile__chips">
          <Chip icon="globe" tone="accent">Your identity, on the open web</Chip>
          <Chip icon="check">Portable — leave any time with your people</Chip>
        </div>
      </Card>

      <AppearanceControl />

      <div className="t-tabs" role="tablist" aria-label="Your activity">
        <button role="tab" aria-selected={tab === "posts"} className={"t-tab-pill" + (tab === "posts" ? " is-active" : "")} onClick={() => setTab("posts")}>Posts</button>
        <button role="tab" aria-selected={tab === "saved"} className={"t-tab-pill" + (tab === "saved" ? " is-active" : "")} onClick={() => setTab("saved")}>Saved</button>
      </div>

      {tab === "posts" ? (
        mine.length ? (
          <div className="t-feed">{mine.map((p) => <PostCard key={p.id} post={p} />)}</div>
        ) : (
          <div className="t-caughtup">
            <Icon name="compose" size={22} />
            <p className="t-caughtup__title">Nothing here yet</p>
            <p className="t-caughtup__body">When you post, it lives here — and travels to your people across the open web.</p>
          </div>
        )
      ) : (
        <div className="t-feed">
          {saved.map((p) => <PostCard key={p.id} post={p} />)}
        </div>
      )}
    </div>
  );
}

const THEMES: { value: Theme; label: string; icon: "settings" | "sun" | "moon" }[] = [
  { value: "system", label: "System", icon: "settings" },
  { value: "light", label: "Light", icon: "sun" },
  { value: "dark", label: "Dark", icon: "moon" },
];

function AppearanceControl() {
  const theme = useTheme();
  return (
    <Card className="t-appearance">
      <div className="t-appearance__label">
        <span className="t-appearance__title">Appearance</span>
        <span className="t-appearance__sub">Light and dark are both first-class. Follow your system, or choose.</span>
      </div>
      <div className="t-segmented" role="group" aria-label="Theme">
        {THEMES.map((t) => (
          <button
            key={t.value}
            className={"t-segmented__opt" + (theme === t.value ? " is-active" : "")}
            aria-pressed={theme === t.value}
            onClick={() => setTheme(t.value)}
          >
            <Icon name={t.icon} size={17} />
            <span>{t.label}</span>
          </button>
        ))}
      </div>
    </Card>
  );
}
