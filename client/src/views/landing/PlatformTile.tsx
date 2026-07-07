import type { Platform } from "./types";
import { GLYPH } from "./types";

const TAG: Record<Platform["category"], string> = {
  closed: "Walled",
  open: "Open web",
  other: "Elsewhere",
};

// A selectable place-you-live-online. Tactile: lifts on hover, settles on press,
// shows a lavender check when chosen. Selection is a claim about the visitor's life,
// never a promise of integration.
export function PlatformTile({
  platform,
  selected,
  onToggle,
}: {
  platform: Platform;
  selected: boolean;
  onToggle: (id: string) => void;
}) {
  return (
    <button
      type="button"
      className={"lp-tile" + (selected ? " is-sel" : "")}
      aria-pressed={selected}
      onClick={() => onToggle(platform.id)}
    >
      <span className="lp-tile-check" aria-hidden="true">✓</span>
      <span className="lp-tile-glyph" aria-hidden="true">{GLYPH[platform.id]}</span>
      <span className="lp-tile-name">{platform.name}</span>
      <span className="lp-tag">{TAG[platform.category]}</span>
    </button>
  );
}
