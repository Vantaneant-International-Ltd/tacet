import { useEffect, useState } from "react";
import { api, ApiError, type Invite } from "../api";
import { bylineDate } from "../util";
import { ErrorLine } from "../bits";

// Any member can bring someone in (Amendment 2). Mints a code and shows a one-use link.
export function InvitePanel() {
  const [invites, setInvites] = useState<Invite[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    api.invites().then((r) => setInvites(r.invites)).catch(() => setInvites([]));
  }, []);

  function link(code: string): string {
    return `${window.location.origin}/join/${code}`;
  }

  async function mint() {
    setError(null);
    try {
      const { invite } = await api.mintInvite();
      setInvites((prev) => [invite, ...(prev ?? [])]);
      copy(invite.code);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "That did not mint.");
    }
  }

  async function copy(code: string) {
    try {
      await navigator.clipboard.writeText(link(code));
      setCopied(code);
    } catch {
      setCopied(null);
    }
  }

  const open = (invites ?? []).filter((i) => !i.used);

  return (
    <div className="you-house">
      <div className="invite-head">
        <p className="label heading">Invite someone</p>
        <button className="label action" onClick={mint}>
          New invite
        </button>
      </div>
      <p className="you-house-line">A one-use link. Whoever opens it joins the house, vouched for by you.</p>
      <ErrorLine>{error}</ErrorLine>

      {open.length > 0 && (
        <ul className="invite-list">
          {open.map((i) => (
            <li key={i.code} className="invite-row">
              <button className="voice invite-code" onClick={() => copy(i.code)} title="Copy invite link">
                {i.code}
              </button>
              <span className="label invite-meta">
                {copied === i.code ? "link copied" : "open"} · {bylineDate(i.created_at)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
