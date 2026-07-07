// The landing page's only data model. Platforms are used to represent the visitor's
// *current* fragmented online life — never as a promise of official integration.
export type Platform = {
  id: string;
  name: string;
  category: "closed" | "open" | "other";
  description: string;
};

// Order matters: closed gardens first (the fragmentation the visitor feels), then the
// open social web Tacet actually federates with, then a catch-all.
export const PLATFORMS: Platform[] = [
  { id: "instagram", name: "Instagram", category: "closed", description: "Photos, behind a wall." },
  { id: "tiktok", name: "TikTok", category: "closed", description: "Video, behind a wall." },
  { id: "reddit", name: "Reddit", category: "closed", description: "Communities, behind a wall." },
  { id: "x", name: "X", category: "closed", description: "Posts, behind a wall." },
  { id: "linkedin", name: "LinkedIn", category: "closed", description: "Work, behind a wall." },
  { id: "mastodon", name: "Mastodon", category: "open", description: "Open. On the social web." },
  { id: "pixelfed", name: "Pixelfed", category: "open", description: "Open photos. On the social web." },
  { id: "peertube", name: "PeerTube", category: "open", description: "Open video. On the social web." },
  { id: "other", name: "Other", category: "other", description: "Somewhere else entirely." },
];

// A short, human glyph per platform. We deliberately do not reproduce any brand's
// real logo — these are neutral marks that stand in for "a place you live online".
export const GLYPH: Record<string, string> = {
  instagram: "◎",
  tiktok: "♪",
  reddit: "◍",
  x: "✕",
  linkedin: "▧",
  mastodon: "⬗",
  pixelfed: "◈",
  peertube: "▷",
  other: "…",
};
