import type { SVGProps } from "react";

// Tacet's own icon language: 24px grid, 1.75 stroke, round caps/joins, currentColor.
// Calm and geometric — deliberately not any incumbent's icon set. Icons support words,
// never replace meaning (docs/02-human-interface-guidelines/iconography.md).

export type IconName =
  | "today"
  | "people"
  | "discover"
  | "conversations"
  | "me"
  | "compose"
  | "search"
  | "settings"
  | "sun"
  | "moon"
  | "image"
  | "check"
  | "save"
  | "saved"
  | "reply"
  | "share"
  | "more"
  | "globe"
  | "spark"
  | "back"
  | "close"
  | "plus"
  | "verified";

const PATHS: Record<IconName, JSX.Element> = {
  // A calm horizon / new day — Today.
  today: (
    <>
      <circle cx="12" cy="13" r="4" />
      <path d="M12 3v2M4.5 6.5l1.4 1.4M19.5 6.5l-1.4 1.4M3 13h1M20 13h1M12 21H4M20 21h-3" />
    </>
  ),
  people: (
    <>
      <circle cx="8.5" cy="9" r="3" />
      <path d="M3 19c0-2.8 2.4-5 5.5-5S14 16.2 14 19" />
      <path d="M16 6.2a3 3 0 0 1 0 5.6M18 19c0-2.2-1-3.8-2.6-4.6" />
    </>
  ),
  discover: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M15.5 8.5l-2 5-5 2 2-5 5-2z" />
    </>
  ),
  conversations: (
    <>
      <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h8A2.5 2.5 0 0 1 17 6.5v4A2.5 2.5 0 0 1 14.5 13H9l-4 3.5V13H6.5" />
      <path d="M20 10v5.5A2.5 2.5 0 0 1 17.5 18H12" opacity="0.55" />
    </>
  ),
  me: (
    <>
      <circle cx="12" cy="9" r="3.2" />
      <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
    </>
  ),
  compose: (
    <>
      <path d="M4 20h4l10-10a2.1 2.1 0 0 0-3-3L5 17v3z" />
      <path d="M13.5 6.5l3 3" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M20 20l-4.4-4.4" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M18.4 5.6l-1.8 1.8M7.4 16.6l-1.8 1.8" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8" />
    </>
  ),
  moon: <path d="M20 13.5A8 8 0 0 1 10.5 4a7 7 0 1 0 9.5 9.5z" />,
  image: (
    <>
      <rect x="3.5" y="5" width="17" height="14" rx="2.5" />
      <circle cx="9" cy="10" r="1.6" />
      <path d="M4.5 17.5l4.5-4.5 3 3 3.5-3.5 4 4" />
    </>
  ),
  check: <path d="M4.5 12.5l5 5 10-11" />,
  save: <path d="M6 4.5h12v15l-6-4-6 4v-15z" />,
  saved: <path d="M6 4.5h12v15l-6-4-6 4v-15z M9 10l2 2 4-4" />,
  reply: <path d="M9 7L4 12l5 5M4 12h9a6 6 0 0 1 6 6v1" />,
  share: (
    <>
      <path d="M12 15V4M8 7l4-3 4 3" />
      <path d="M6 11H4.5v8.5h15V11H18" />
    </>
  ),
  more: (
    <>
      <circle cx="5" cy="12" r="1.4" />
      <circle cx="12" cy="12" r="1.4" />
      <circle cx="19" cy="12" r="1.4" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.4 3.8 5.6 3.8 9S14.5 18.6 12 21c-2.5-2.4-3.8-5.6-3.8-9S9.5 5.4 12 3z" />
    </>
  ),
  // The private positive signal — a quiet spark, never a public heart-count.
  spark: <path d="M12 3.5l2 5.5 5.5 2-5.5 2-2 5.5-2-5.5L4.5 11l5.5-2 2-5.5z" />,
  back: <path d="M14 6l-6 6 6 6" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  plus: <path d="M12 5v14M5 12h14" />,
  verified: (
    <>
      <path d="M12 3l2.2 1.6 2.7-.2 1 2.5 2.3 1.4-.7 2.6.7 2.6-2.3 1.4-1 2.5-2.7-.2L12 21l-2.2-1.6-2.7.2-1-2.5-2.3-1.4.7-2.6-.7-2.6 2.3-1.4 1-2.5 2.7.2L12 3z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
};

const FILLED = new Set<IconName>(["spark"]);

export function Icon({
  name,
  size = 22,
  ...rest
}: { name: IconName; size?: number } & Omit<SVGProps<SVGSVGElement>, "name">) {
  const filled = FILLED.has(name);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke={filled ? "none" : "currentColor"}
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {PATHS[name]}
    </svg>
  );
}
