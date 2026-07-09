// The Hearth — Tacet's real brand mark (docs/10-design/tacet-brand/assets/logo).
// Twelve strokes gathered around an open centre; one stroke arrived as a dot (the
// person). Strokes take currentColor; the dot is iris by default so the arrival reads.
// Brand only — never a UI glyph.
export function TacetMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="4.5" strokeLinecap="round">
        <line x1="32" y1="20" x2="32" y2="6" />
        <line x1="39.25" y1="19.44" x2="42.75" y2="13.38" />
        <line x1="46.5" y1="32" x2="53.5" y2="32" />
        <line x1="42.39" y1="38" x2="54.52" y2="45" />
        <line x1="39.25" y1="44.56" x2="42.75" y2="50.62" />
        <line x1="32" y1="44" x2="32" y2="58" />
        <line x1="24.75" y1="44.56" x2="21.25" y2="50.62" />
        <line x1="21.61" y1="38" x2="9.48" y2="45" />
        <line x1="17.5" y1="32" x2="10.5" y2="32" />
        <line x1="21.61" y1="26" x2="9.48" y2="19" />
        <line x1="24.75" y1="19.44" x2="21.25" y2="13.38" />
      </g>
      <circle className="lp-hearth-dot" cx="52.35" cy="20.25" r="3.4" fill="currentColor" />
    </svg>
  );
}
