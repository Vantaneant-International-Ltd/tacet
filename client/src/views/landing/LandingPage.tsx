import { navigate } from "../../router";
import { LandingNav } from "./LandingNav";
import { HeroSection } from "./HeroSection";
import { FragmentationSection } from "./FragmentationSection";
import { ConvergenceSection } from "./ConvergenceSection";
import { EmailSection } from "./EmailSection";
import { DividedSection } from "./DividedSection";
import { ManifestoSection } from "./ManifestoSection";
import { FinalCTA } from "./FinalCTA";
import { DevBanner } from "./DevBanner";
import "./landing.css";

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
}

// The public front door. Signed-out visitors land here at `/`; every call to action
// leads into the existing Enter view. The canonical bands top-to-bottom: hero →
// fragmentation → convergence → divided → quote → CTA → footer. The platform picker
// lives in onboarding, not here.
export function LandingPage() {
  const goEnter = () => navigate("/enter");
  const goApp = () => navigate("/today");

  return (
    <div className="lp">
      <DevBanner />
      <LandingNav onSignIn={goEnter} onJoin={goApp} />
      <HeroSection
        onContinue={() => scrollToId("lp-fragmentation")}
        onSignIn={goEnter}
      />
      <FragmentationSection />
      <ConvergenceSection />
      <EmailSection />
      <DividedSection />
      <ManifestoSection />
      <FinalCTA
        onJoin={goApp}
        onSignIn={goEnter}
        onReadManifesto={() => scrollToId("lp-manifesto")}
        onHowItWorks={() => scrollToId("lp-divided")}
      />
    </div>
  );
}
