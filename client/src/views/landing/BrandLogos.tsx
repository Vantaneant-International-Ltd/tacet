// Recognisable brand marks for the landing's platform tiles. Operator decision
// (2026-07-09) overrides the handoff's neutral-monogram rule: real logos are allowed.
// These are simplified, brand-coloured marks — not copied trademark vector art — used
// only to *name the places a visitor already lives*, never to imply integration.
import type { ReactElement } from "react";

export function BrandLogo({ id }: { id: string }): ReactElement {
  const p = { className: "lp-logo", viewBox: "0 0 24 24", "aria-hidden": true } as const;
  switch (id) {
    case "instagram":
      return (
        <svg {...p}>
          <defs>
            <linearGradient id="lg-ig" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0" stopColor="#FED576" />
              <stop offset=".26" stopColor="#F47133" />
              <stop offset=".61" stopColor="#BC3081" />
              <stop offset="1" stopColor="#4C63D2" />
            </linearGradient>
          </defs>
          <rect x="2" y="2" width="20" height="20" rx="6" fill="url(#lg-ig)" />
          <circle cx="12" cy="12" r="5" fill="none" stroke="#fff" strokeWidth="2" />
          <circle cx="17.4" cy="6.6" r="1.3" fill="#fff" />
        </svg>
      );
    case "tiktok":
      return (
        <svg {...p}>
          <path d="M15 3c.3 2.2 1.8 3.8 4 4v2.6c-1.4 0-2.8-.4-4-1.1v5.9c0 3.3-2.7 5.6-5.8 5.1-2.3-.4-4.1-2.4-4.1-4.9 0-3.2 3-5.5 6.1-4.6v2.8c-.4-.2-.9-.3-1.4-.3-1.3 0-2.4 1-2.4 2.3 0 1.3 1.1 2.3 2.4 2.3s2.3-1 2.3-2.3V3H15z" fill="#25F4EE" transform="translate(-.7 .5)" />
          <path d="M15 3c.3 2.2 1.8 3.8 4 4v2.6c-1.4 0-2.8-.4-4-1.1v5.9c0 3.3-2.7 5.6-5.8 5.1-2.3-.4-4.1-2.4-4.1-4.9 0-3.2 3-5.5 6.1-4.6v2.8c-.4-.2-.9-.3-1.4-.3-1.3 0-2.4 1-2.4 2.3 0 1.3 1.1 2.3 2.4 2.3s2.3-1 2.3-2.3V3H15z" fill="#FE2C55" transform="translate(.7 -.3)" />
          <path d="M15 3c.3 2.2 1.8 3.8 4 4v2.6c-1.4 0-2.8-.4-4-1.1v5.9c0 3.3-2.7 5.6-5.8 5.1-2.3-.4-4.1-2.4-4.1-4.9 0-3.2 3-5.5 6.1-4.6v2.8c-.4-.2-.9-.3-1.4-.3-1.3 0-2.4 1-2.4 2.3 0 1.3 1.1 2.3 2.4 2.3s2.3-1 2.3-2.3V3H15z" fill="#111" />
        </svg>
      );
    case "reddit":
      return (
        <svg {...p}>
          <circle cx="12" cy="13.5" r="8.5" fill="#FF4500" />
          <circle cx="9" cy="13.2" r="1.3" fill="#fff" />
          <circle cx="15" cy="13.2" r="1.3" fill="#fff" />
          <path d="M9 16.4c1.7 1.3 4.3 1.3 6 0" stroke="#fff" strokeWidth="1.2" fill="none" strokeLinecap="round" />
          <circle cx="18.4" cy="5.6" r="1.7" fill="#FF4500" />
          <path d="M15.2 12.6 18.2 6" stroke="#FF4500" strokeWidth="1.3" />
          <circle cx="15.2" cy="12.6" r="1" fill="#FF4500" />
        </svg>
      );
    case "x":
      return (
        <svg {...p}>
          <path d="M3 3l7.4 9.4L3.3 21H6l5.9-6.9L16.9 21H21l-7.8-10L20.3 3H17.7l-5 5.9L8.5 3z" fill="#111" />
        </svg>
      );
    case "linkedin":
      return (
        <svg {...p}>
          <rect x="2" y="2" width="20" height="20" rx="4" fill="#0A66C2" />
          <rect x="5" y="9.5" width="2.6" height="9" fill="#fff" />
          <circle cx="6.3" cy="6.4" r="1.5" fill="#fff" />
          <path d="M10 9.5h2.5v1.3c.5-.9 1.6-1.5 2.8-1.5 2.2 0 3.2 1.4 3.2 3.8v5.4h-2.6v-4.9c0-1.2-.4-1.9-1.4-1.9-1 0-1.5.7-1.5 1.9v4.9H10z" fill="#fff" />
        </svg>
      );
    case "mastodon":
      return (
        <svg {...p}>
          <path d="M20.7 8.4c0-3-2-3.9-2-3.9-1.3-.6-3.6-.8-6.6-.8h-.1c-3 0-5.3.2-6.6.8 0 0-2 .9-2 3.9 0 .7 0 1.5.1 2.4.2 3 .5 5.9 3.3 6.6 1.3.4 2.4.4 3.3.5 1.5.1 2.8 0 2.8 0v-2s-1.7.1-3.5 0c-1.9-.1-2-.9-2.1-1.5 1.8.4 3.4.5 4.7.4 2.4-.1 4-1.5 4.3-3.4.3-3 .1-4-.1-4zM17 14h-1.9V9.6c0-1-.4-1.4-1.3-1.4-.9 0-1.4.6-1.4 1.7v2.4h-1.9V9.9c0-1.1-.4-1.7-1.4-1.7-.9 0-1.3.4-1.3 1.4V14H5.9V9.4c0-1 .3-1.8.8-2.3.5-.6 1.2-.8 2.1-.8 1 0 1.7.4 2.2 1.1l.5.8.5-.8c.5-.7 1.2-1.1 2.2-1.1.9 0 1.6.2 2.1.8.5.5.8 1.3.8 2.3z" fill="#6364FF" />
        </svg>
      );
    case "pixelfed":
      return (
        <svg {...p}>
          <defs>
            <linearGradient id="lg-pf" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#7CE3FF" />
              <stop offset=".5" stopColor="#8A4FFF" />
              <stop offset="1" stopColor="#E44BC6" />
            </linearGradient>
          </defs>
          <rect x="2" y="2" width="20" height="20" rx="6" fill="url(#lg-pf)" />
          <circle cx="12" cy="12" r="4.3" fill="none" stroke="#fff" strokeWidth="2" />
          <circle cx="12" cy="12" r="1.7" fill="#fff" />
        </svg>
      );
    case "peertube":
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="9.3" fill="#F1680D" />
          <path d="M10 7.8 16.5 12 10 16.2z" fill="#fff" />
        </svg>
      );
    default:
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2.4" />
          <circle cx="8" cy="12" r="1.1" fill="currentColor" />
          <circle cx="12" cy="12" r="1.1" fill="currentColor" />
          <circle cx="16" cy="12" r="1.1" fill="currentColor" />
        </svg>
      );
  }
}
