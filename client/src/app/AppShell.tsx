import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { usePath, navigate, Link } from "../router";
import { Icon } from "../design/icons";
import type { IconName } from "../design/icons";
import { Button, Avatar } from "../design/primitives";
import { useResolvedTheme, setTheme } from "../design/theme";
import { me } from "./mock";
import { ComposeSheet } from "./ComposeSheet";
import { TacetMark } from "../views/landing/TacetMark";

type NavItem = { to: string; label: string; icon: IconName };

const NAV: NavItem[] = [
  { to: "/today", label: "Today", icon: "today" },
  { to: "/people", label: "People", icon: "people" },
  { to: "/discover", label: "Discover", icon: "discover" },
  { to: "/conversations", label: "Conversations", icon: "conversations" },
  { to: "/me", label: "Me", icon: "me" },
];

function isActive(path: string, to: string) {
  return path === to || path.startsWith(to + "/");
}

// The theme toggle — a pill with a sliding knob whose icon swaps with the theme (per the
// operator's approved reference control). Instant under reduced-motion (global rule).
function ThemeToggle() {
  const resolved = useResolvedTheme();
  const dark = resolved === "dark";
  const next = dark ? "light" : "dark";
  return (
    <button
      type="button"
      className={"t-themesw" + (dark ? " is-dark" : "")}
      role="switch"
      aria-checked={dark}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
      onClick={() => setTheme(next)}
    >
      <span className="t-themesw__knob" aria-hidden="true">
        <Icon name={dark ? "moon" : "sun"} size={13} />
      </span>
    </button>
  );
}

function TabLink({ to, label, icon, path, dot }: { to: string; label: string; icon: IconName; path: string; dot?: boolean }) {
  const active = isActive(path, to);
  return (
    <Link to={to} className={"t-tab" + (active ? " is-active" : "")} aria-label={label} aria-current={active ? "page" : undefined}>
      <span className="t-tab__icon">
        <Icon name={icon} size={22} />
        {dot && <span className="t-tab__dot" aria-hidden="true" title="New correspondence" />}
      </span>
      <span>{label}</span>
    </Link>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const path = usePath();
  const [composing, setComposing] = useState(false);

  // Close the composer on route change.
  useEffect(() => setComposing(false), [path]);

  // Any surface can open the compose preview by dispatching a "tacet:compose" event (the
  // inline composer row on Today uses this) — no publish plumbing, just the existing overlay.
  useEffect(() => {
    const open = () => setComposing(true);
    window.addEventListener("tacet:compose", open);
    return () => window.removeEventListener("tacet:compose", open);
  }, []);

  return (
    <div className="t-app">
      {/* Desktop side rail */}
      <aside className="t-rail" aria-label="Primary">
        <Link to="/today" className="t-rail__brand" aria-label="Tacet home">
          <TacetMark className="t-mark" />
          <span className="t-rail__mark">tacet</span>
        </Link>

        {/* Search isn't built yet — present but honestly disabled (no fake modal). */}
        <div className="t-rail__search" role="button" aria-disabled="true" title="Search — coming soon">
          <Icon name="search" size={18} />
          <span className="t-rail__search-label">Search</span>
          <span className="t-rail__kbd t-mono" aria-hidden="true">⌘K</span>
        </div>

        <nav className="t-rail__nav">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={"t-navitem" + (isActive(path, item.to) ? " is-active" : "")}
              aria-current={isActive(path, item.to) ? "page" : undefined}
            >
              <Icon name={item.icon} size={22} />
              <span>{item.label}</span>
              {item.to === "/conversations" && <span className="t-navitem__dot" aria-hidden="true" />}
            </Link>
          ))}
        </nav>

        <Button variant="primary" icon="compose" full className="t-rail__compose" onClick={() => setComposing(true)}>
          New
        </Button>

        <div className="t-rail__foot">
          <Link to="/me" className="t-rail__me">
            <Avatar name={me.name} size={34} />
            <span className="t-rail__me-id">
              <span className="t-rail__me-name">{me.name}</span>
              <span className="t-rail__me-handle t-mono">@{me.user}</span>
            </span>
          </Link>
          <ThemeToggle />
        </div>
      </aside>

      {/* Mobile top bar — solid surface + hairline (no glass); Search + Me avatar trailing */}
      <header className="t-topbar">
        <Link to="/today" className="t-topbar__brand" aria-label="Tacet home">
          <TacetMark className="t-mark t-mark--sm" />
          <span>tacet</span>
        </Link>
        <div className="t-topbar__actions">
          {/* Search isn't built yet — present but honestly disabled. */}
          <button className="t-iconbtn t-topbar__search" aria-disabled="true" title="Search — coming soon" aria-label="Search">
            <Icon name="search" size={20} />
          </button>
          <ThemeToggle />
          <Link to="/me" className="t-topbar__me" aria-label="Me">
            <Avatar name={me.name} size={32} />
          </Link>
        </div>
      </header>

      <main className="t-main">{children}</main>

      {/* Mobile tab bar — 5 slots, centre is the raised New FAB; Me lives in the top bar */}
      <nav className="t-tabbar" aria-label="Primary">
        <TabLink to="/today" label="Today" icon="today" path={path} />
        <TabLink to="/people" label="People" icon="people" path={path} />
        <button className="t-tabfab" aria-label="New" onClick={() => setComposing(true)}>
          <Icon name="compose" size={24} />
        </button>
        <TabLink to="/discover" label="Discover" icon="discover" path={path} />
        <TabLink to="/conversations" label="Chats" icon="conversations" path={path} dot />
      </nav>

      {composing && <ComposeSheet onClose={() => setComposing(false)} onPost={() => navigate("/today")} />}
    </div>
  );
}
