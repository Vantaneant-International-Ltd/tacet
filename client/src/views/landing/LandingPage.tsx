import { useMemo, useState } from "react";
import { navigate } from "../../router";
import { PLATFORMS } from "./types";
import type { Platform } from "./types";
import { LandingNav } from "./LandingNav";
import { HeroSection } from "./HeroSection";
import { PlatformSelector } from "./PlatformSelector";
import { FragmentationSection } from "./FragmentationSection";
import { ConvergenceSection } from "./ConvergenceSection";
import { FederationSection } from "./FederationSection";
import { ManifestoSection } from "./ManifestoSection";
import { FinalCTA } from "./FinalCTA";
import { DevWarningOverlay } from "./DevWarningOverlay";
import "./landing.css";

// When nothing is chosen yet, the fragmentation/convergence visuals still need
// something to say. A representative spread of walls + open web.
const DEFAULT_SHOWN = ["instagram", "x", "reddit", "mastodon", "pixelfed"];

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
}

// The public front door. Signed-out visitors land here at `/`; every call to action
// leads into the existing Enter view. Selections are kept client-side only and shape
// the visuals downstream — they are never sent anywhere or treated as integrations.
export function LandingPage() {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const shown: Platform[] = useMemo(() => {
    const ids = selected.size > 0 ? [...selected] : DEFAULT_SHOWN;
    // Preserve the canonical PLATFORMS order for a calm, stable layout.
    return PLATFORMS.filter((p) => ids.includes(p.id));
  }, [selected]);

  const goEnter = () => navigate("/enter");
  const goApp = () => navigate("/today");

  return (
    <div className="lp">
      <DevWarningOverlay />
      <LandingNav onSignIn={goEnter} onJoin={goApp} />
      <HeroSection
        onContinue={() => scrollToId("lp-selector")}
        onSignIn={goEnter}
      />
      <PlatformSelector
        selected={selected}
        onToggle={toggle}
        onContinue={() => scrollToId("lp-fragmentation")}
      />
      <FragmentationSection platforms={shown} />
      <ConvergenceSection platforms={shown} />
      <FederationSection />
      <ManifestoSection />
      <FinalCTA
        onJoin={goApp}
        onSignIn={goEnter}
        onReadManifesto={() => scrollToId("lp-manifesto")}
        onHowItWorks={() => scrollToId("lp-federation")}
      />
    </div>
  );
}
