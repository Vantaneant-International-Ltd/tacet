import { Loading, EmptyState, Button } from "../../design/primitives";
import { Icon } from "../../design/icons";
import { navigate } from "../../router";
import { api, useResource } from "../me";
import type { Profile as MeProfile } from "../me";
import type { Person } from "../openweb";
import { ProfileHeader, About } from "../ProfileView";

// How your profile would look to others — rendered with the SAME view used for remote
// people, so "you" and "them" are one product. PUBLIC-facing fields only: no saved posts,
// no private notes, no reading history. Local only; nothing here is published yet.
function toPerson(p: MeProfile): Person {
  return {
    id: "",
    name: p.displayName,
    handle: p.handle ? `@${p.handle}` : "",
    avatarUrl: p.avatarUrl,
    bio: p.bio,
    url: "",
    source: { id: "", name: "", url: "" },
    verified: false,
    bannerUrl: p.bannerUrl,
    joinedAt: p.createdAt,
    website: p.website || undefined,
    location: p.location || undefined,
    fields: p.fields.map((f) => ({ name: f.name, value: f.value })),
    counts: undefined,
  };
}

export function PublicPreview() {
  const res = useResource<MeProfile>(() => api.getProfile(), []);

  return (
    <div className="t-screen t-screen--reading">
      <button className="t-profileback" onClick={() => navigate("/me")}>
        <Icon name="back" size={18} /> <span>Back to Me</span>
      </button>

      <div className="t-hint">
        <span className="t-hint__dot" aria-hidden="true" />
        <span className="t-hint__text">This is your public face. It’s local only — nothing here is published to the open social web yet.</span>
        <button className="t-hint__action" onClick={() => navigate("/me")}>Edit</button>
      </div>

      {res.status === "loading" && <Loading label="Preparing preview" />}

      {res.status === "ready" && (
        <>
          <ProfileHeader person={toPerson(res.data)} local />
          <About person={toPerson(res.data)} />
          <div className="t-caughtup">
            <Icon name="compose" size={22} />
            <p className="t-caughtup__title">Your posts will appear here</p>
            <p className="t-caughtup__body">When publishing arrives, what you share will show on your public profile. For now, this is just your identity.</p>
          </div>
          <div className="t-preview-cta">
            <Button variant="secondary" size="sm" icon="settings" onClick={() => navigate("/me")}>Edit your identity</Button>
          </div>
        </>
      )}

      {res.status === "error" && <EmptyState icon="me" title="Couldn’t load your profile">Try again in a moment.</EmptyState>}
    </div>
  );
}
