// ⚠️ TEMPORARY DEV-ONLY WARNING OVERLAY ⚠️
// Loud "everything is broken / breaking changes in progress / developers only"
// banners + a massive diagonal watermark across the landing page.
//
// This is deliberately NOT calm and NOT on-brand — it is a construction sign.
// TO REMOVE when the site is stable: delete this file and its single import +
// <DevWarningOverlay /> usage in LandingPage.tsx. Nothing else depends on it.

const WATERMARK_TEXT = "BROKEN · DEV ONLY · WIP · BREAKING CHANGES";
const ROWS = 16;

export function DevWarningOverlay() {
  return (
    <>
      <style>{css}</style>

      {/* massive diagonal watermark — sits above content, ignores pointer events */}
      <div className="devwarn-watermark" aria-hidden="true">
        <div className="devwarn-watermark-rot">
          {Array.from({ length: ROWS }).map((_, i) => (
            <div className="devwarn-wm-row" key={i}>
              {`${WATERMARK_TEXT} · `.repeat(6)}
            </div>
          ))}
        </div>
      </div>

      {/* top + bottom hazard banners */}
      <div className="devwarn-banner devwarn-banner-top" role="alert">
        <span className="devwarn-scroll">
          {bannerText}{bannerText}{bannerText}
        </span>
      </div>
      <div className="devwarn-banner devwarn-banner-bottom" role="alert">
        <span className="devwarn-scroll">
          {bannerText}{bannerText}{bannerText}
        </span>
      </div>
    </>
  );
}

const bannerText =
  " 🚧 SITE UNDER ACTIVE CONSTRUCTION — EVERYTHING IS BROKEN — BREAKING CHANGES IN PROGRESS — FOR DEVELOPERS ONLY — DO NOT RELY ON ANYTHING HERE 🚧   ";

const css = `
.devwarn-watermark {
  position: fixed;
  inset: 0;
  z-index: 2147483000;
  pointer-events: none;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
.devwarn-watermark-rot {
  transform: rotate(-30deg);
  width: 200vmax;
  height: 200vmax;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2.2vmax;
  opacity: 0.08;
}
.devwarn-wm-row {
  white-space: nowrap;
  text-align: center;
  font-family: "Space Mono", ui-monospace, monospace;
  font-weight: 700;
  font-size: 4.4vmax;
  letter-spacing: 0.12em;
  color: #F5C518;
  text-transform: uppercase;
  user-select: none;
}

.devwarn-banner {
  position: fixed;
  left: 0;
  right: 0;
  z-index: 2147483001;
  height: 40px;
  overflow: hidden;
  display: flex;
  align-items: center;
  background: repeating-linear-gradient(
    45deg,
    #111 0, #111 18px,
    #F5C518 18px, #F5C518 36px
  );
  border-block: 2px solid #F5C518;
  box-shadow: 0 0 0 100vmax rgba(0,0,0,0); /* no-op, keeps stacking clean */
}
.devwarn-banner-top { top: 0; }
.devwarn-banner-bottom { bottom: 0; }

.devwarn-scroll {
  display: inline-block;
  white-space: nowrap;
  padding-left: 100%;
  font-family: "Space Mono", ui-monospace, monospace;
  font-weight: 700;
  font-size: 13px;
  letter-spacing: 0.04em;
  color: #FFFDF0;
  text-shadow: 0 0 6px #000, 0 1px 2px #000, 1px 0 2px #000, -1px 0 2px #000;
  animation: devwarn-marquee 22s linear infinite;
}
@keyframes devwarn-marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-33.333%); }
}

@media (prefers-reduced-motion: reduce) {
  .devwarn-scroll { animation: none; padding-left: 1rem; }
}
`;
