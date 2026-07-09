import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { usePath, navigate, Link } from "../router";
import { Icon } from "../design/icons";
import type { IconName } from "../design/icons";
import { IconButton, Button, Avatar } from "../design/primitives";
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

function ThemeToggle() {
  const resolved = useResolvedTheme();
  const next = resolved === "dark" ? "light" : "dark";
  return (
    <IconButton
      name={resolved === "dark" ? "sun" : "moon"}
      label={`Switch to ${next} theme`}
      onClick={() => setTheme(next)}
    />
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const path = usePath();
  const [composing, setComposing] = useState(false);

  // Close the composer on route change.
  useEffect(() => setComposing(false), [path]);

  return (
    <div className="t-app">
      {/* Desktop side rail */}
      <aside className="t-rail" aria-label="Primary">
        <Link to="/today" className="t-rail__brand" aria-label="Tacet home">
          <TacetMark className="t-mark" />
          <span className="t-rail__mark">tacet</span>
        </Link>

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
            <span className="t-rail__me-name">{me.name}</span>
          </Link>
          <ThemeToggle />
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="t-topbar">
        <Link to="/today" className="t-topbar__brand" aria-label="Tacet home">
          <TacetMark className="t-mark t-mark--sm" />
          <span>tacet</span>
        </Link>
        <div className="t-topbar__actions">
          <ThemeToggle />
        </div>
      </header>

      <main className="t-main">{children}</main>

      {/* Mobile bottom tab bar */}
      <nav className="t-tabbar" aria-label="Primary">
        {NAV.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={"t-tab" + (isActive(path, item.to) ? " is-active" : "")}
            aria-label={item.label}
            aria-current={isActive(path, item.to) ? "page" : undefined}
          >
            <Icon name={item.icon} size={24} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Floating compose on mobile */}
      <button className="t-fab" aria-label="Compose" onClick={() => setComposing(true)}>
        <Icon name="compose" size={24} />
      </button>

      {composing && <ComposeSheet onClose={() => setComposing(false)} onPost={() => navigate("/today")} />}
    </div>
  );
}
