import { useState } from "react";
import { Avatar, Button, Chip, Card, SectionHeading, EmptyState, IconButton } from "../../design/primitives";
import { Icon } from "../../design/icons";
import type { IconName } from "../../design/icons";
import { useTheme, setTheme } from "../../design/theme";
import type { Theme } from "../../design/theme";
import { api, useResource, useMeVersion } from "../me";
import type { Profile, CollectionSummary } from "../me";
import { SavedCard } from "../SavedCard";
import { relativeTime } from "../openweb";

// Me — your local-first home. Everything here lives in Tacet's own database and belongs
// to you: what you save, collect, note, pin, and read later. Read-only toward the open
// web; nothing here follows, posts, or federates.
type Section = "saved" | "collections" | "later" | "pinned" | "notes" | "recent";
const SECTIONS: { id: Section; label: string; icon: IconName }[] = [
  { id: "saved", label: "Saved", icon: "saved" },
  { id: "collections", label: "Collections", icon: "discover" },
  { id: "later", label: "Reading later", icon: "today" },
  { id: "pinned", label: "Pinned", icon: "spark" },
  { id: "notes", label: "Notes", icon: "compose" },
  { id: "recent", label: "Recently viewed", icon: "back" },
];

export function Me() {
  const [section, setSection] = useState<Section>("saved");

  return (
    <div className="t-screen t-screen--reading">
      <ProfileCard />
      <AppearanceControl />

      <div className="t-tabs t-tabs--scroll" role="tablist" aria-label="Your home">
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            role="tab"
            aria-selected={section === s.id}
            className={"t-tab-pill" + (section === s.id ? " is-active" : "")}
            onClick={() => setSection(s.id)}
          >
            {s.label}
          </button>
        ))}
      </div>

      {section === "saved" && <SavedList filter="all" empty="Nothing saved yet" hint="Save a post from Today and it lives here — yours, even if the original disappears." />}
      {section === "later" && <SavedList filter="read_later" empty="Nothing to read later" hint="Mark a saved post “Later” and it waits for you here." />}
      {section === "pinned" && <SavedList filter="pinned" empty="Nothing pinned" hint="Pin the saved posts you want to keep close." />}
      {section === "notes" && <SavedList filter="notes" empty="No private notes yet" hint="Add a private note to a saved post — it never leaves Tacet." />}
      {section === "collections" && <Collections />}
      {section === "recent" && <Recent />}
    </div>
  );
}

// ── Profile ────────────────────────────────────────────────────────────────────
function ProfileCard() {
  const res = useResource<Profile>(() => api.getProfile(), []);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<{ displayName: string; handle: string; bio: string }>({ displayName: "", handle: "", bio: "" });

  if (res.status !== "ready") {
    return <Card raised className="t-profile"><p className="t-profile__handle">Your home</p></Card>;
  }
  const p = res.data;
  const name = p.displayName || "Your name";

  function begin() {
    setDraft({ displayName: p.displayName, handle: p.handle, bio: p.bio });
    setEditing(true);
  }
  async function save() {
    await api.updateProfile(draft);
    setEditing(false);
    res.reload();
  }

  return (
    <Card raised className="t-profile">
      <div className="t-profile__top">
        <Avatar name={name} size={76} />
        {!editing && <Button variant="secondary" size="sm" icon="settings" onClick={begin}>Edit profile</Button>}
      </div>

      {!editing ? (
        <>
          <h1 className="t-profile__name">{name}</h1>
          <p className="t-profile__handle t-mono">{p.handle ? `@${p.handle}` : "set a handle"}</p>
          <p className="t-profile__bio">{p.bio || "A calm home on the open social web."}</p>
          <div className="t-profile__chips">
            <Chip icon="check">Local & private — lives only in Tacet</Chip>
          </div>
        </>
      ) : (
        <div className="t-profile__edit">
          <label className="t-field">
            <span className="t-field__label">Display name</span>
            <input className="t-input t-input--block" value={draft.displayName} onChange={(e) => setDraft({ ...draft, displayName: e.target.value })} placeholder="Your name" />
          </label>
          <label className="t-field">
            <span className="t-field__label">Preferred handle</span>
            <input className="t-input t-input--block" value={draft.handle} onChange={(e) => setDraft({ ...draft, handle: e.target.value })} placeholder="you" autoCapitalize="none" />
          </label>
          <label className="t-field">
            <span className="t-field__label">Bio</span>
            <textarea className="t-input t-input--block" value={draft.bio} onChange={(e) => setDraft({ ...draft, bio: e.target.value })} rows={2} placeholder="A line about you" />
          </label>
          <div className="t-profile__editactions">
            <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>Cancel</Button>
            <Button variant="primary" size="sm" onClick={save}>Save</Button>
          </div>
        </div>
      )}
    </Card>
  );
}

// ── Saved lists (Saved / Later / Pinned / Notes) ────────────────────────────────
function SavedList({ filter, empty, hint }: { filter: string; empty: string; hint: string }) {
  useMeVersion();
  const saved = useResource(() => api.listSaved({ filter }), [filter]);
  const collections = useResource<CollectionSummary[]>(() => api.listCollections(), []);
  const reload = () => { saved.reload(); collections.reload(); };

  if (saved.status === "loading") return <EmptyState title="…" />;
  if (saved.status === "error") return <EmptyState icon="saved" title="Couldn’t load">Try again in a moment.</EmptyState>;
  if (saved.data.length === 0) return <EmptyState icon="saved" title={empty}>{hint}</EmptyState>;

  return (
    <div className="t-feed">
      {saved.data.map((s) => (
        <SavedCard key={s.id} saved={s} collections={collections.status === "ready" ? collections.data : []} onChanged={reload} />
      ))}
    </div>
  );
}

// ── Collections ─────────────────────────────────────────────────────────────────
function Collections() {
  useMeVersion();
  const cols = useResource<CollectionSummary[]>(() => api.listCollections(), []);
  const [open, setOpen] = useState<CollectionSummary | null>(null);
  const [newName, setNewName] = useState("");

  async function create() {
    const name = newName.trim();
    if (!name) return;
    await api.createCollection(name);
    setNewName("");
    cols.reload();
  }

  if (open) {
    return (
      <div>
        <div className="t-collhead">
          <IconButton name="back" label="Back to collections" onClick={() => { setOpen(null); cols.reload(); }} />
          <h2 className="t-sectionhead__title">{open.name}</h2>
          <IconButton name="close" label="Delete collection" className="t-collhead__del" onClick={async () => { await api.deleteCollection(open.id); setOpen(null); cols.reload(); }} />
        </div>
        <CollectionItems collectionId={open.id} />
      </div>
    );
  }

  return (
    <div>
      <SectionHeading title="Collections" subtitle="Group what you save. Entirely local." />
      <div className="t-newcoll">
        <input className="t-input" placeholder="New collection (e.g. Photography)" value={newName} onChange={(e) => setNewName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && create()} />
        <Button variant="primary" size="sm" onClick={create} disabled={!newName.trim()}>Create</Button>
      </div>
      {cols.status === "ready" && cols.data.length === 0 && (
        <EmptyState icon="discover" title="No collections yet">Make one above, then add saved posts to it.</EmptyState>
      )}
      {cols.status === "ready" && cols.data.length > 0 && (
        <div className="t-cards">
          {cols.data.map((c) => (
            <Card key={c.id} interactive className="t-collcard" onClick={() => setOpen(c)}>
              <span className="t-collcard__name">{c.name}</span>
              <span className="t-collcard__count">{c.count} {c.count === 1 ? "post" : "posts"}</span>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function CollectionItems({ collectionId }: { collectionId: string }) {
  const items = useResource(() => api.listSaved({ collection: collectionId }), [collectionId]);
  const collections = useResource<CollectionSummary[]>(() => api.listCollections(), []);
  if (items.status !== "ready") return <EmptyState title="…" />;
  if (items.data.length === 0) return <EmptyState icon="saved" title="Empty collection">Open a saved post and “Collect” it into here.</EmptyState>;
  return (
    <div className="t-feed">
      {items.data.map((s) => (
        <SavedCard key={s.id} saved={s} collections={collections.status === "ready" ? collections.data : []} onChanged={() => { items.reload(); collections.reload(); }} />
      ))}
    </div>
  );
}

// ── Recently viewed ─────────────────────────────────────────────────────────────
function Recent() {
  const recent = useResource(() => api.listRecent(), []);
  return (
    <div>
      <SectionHeading
        title="Recently viewed"
        subtitle="A private, local history. Yours to clear."
        action={recent.status === "ready" && recent.data.length > 0 ? <Button variant="ghost" size="sm" onClick={async () => { await api.clearRecent(); recent.reload(); }}>Clear</Button> : undefined}
      />
      {recent.status === "ready" && recent.data.length === 0 && <EmptyState icon="back" title="Nothing here yet">Posts you open will show up here.</EmptyState>}
      {recent.status === "ready" && recent.data.length > 0 && (
        <div className="t-list t-list--flush">
          {recent.data.map((r) => (
            <a key={r.id} className="t-recentrow" href={r.url} target="_blank" rel="noreferrer noopener">
              <div className="t-recentrow__body">
                <span className="t-recentrow__who">
                  <span className="t-recentrow__name">{r.authorName || r.authorHandle}</span>
                  <span className="t-recentrow__time t-mono">{relativeTime(r.viewedAt)}</span>
                </span>
                <span className="t-recentrow__text">{r.text || r.url}</span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Appearance (kept) ────────────────────────────────────────────────────────────
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
          <button key={t.value} className={"t-segmented__opt" + (theme === t.value ? " is-active" : "")} aria-pressed={theme === t.value} onClick={() => setTheme(t.value)}>
            <Icon name={t.icon} size={17} />
            <span>{t.label}</span>
          </button>
        ))}
      </div>
    </Card>
  );
}
