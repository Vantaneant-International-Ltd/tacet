import type { Person, Moment, Source } from "./types";

// Sample fallback shown ONLY when the open web can't be reached. It is deliberately
// generic and clearly labelled as sample in the UI (mode: "mock") — never presented
// as real live data.
const SAMPLE_HOME: Source = { id: "tacet.social", name: "tacet.social", url: "https://tacet.social" };

export const mockPeople: Person[] = [
  { id: "s-anna", name: "Anna Reyes", handle: "@anna@mastodon.social", avatarUrl: null, bio: "Writer. Slow mornings, long walks, longer sentences.", url: "https://mastodon.social/@anna", source: { id: "mastodon.social", name: "mastodon.social", url: "https://mastodon.social" }, verified: false },
  { id: "s-cassie", name: "Cassie Lin", handle: "@cassie@pixelfed.social", avatarUrl: null, bio: "Photographer. Film only. Chasing soft light.", url: "https://pixelfed.social/cassie", source: { id: "pixelfed.social", name: "pixelfed.social", url: "https://pixelfed.social" }, verified: false },
  { id: "s-tobi", name: "Tobi Vos", handle: "@tobi@peertube.social", avatarUrl: null, bio: "Makes quiet films about ordinary places.", url: "https://peertube.social/tobi", source: { id: "peertube.social", name: "peertube.social", url: "https://peertube.social" }, verified: false },
  { id: "s-mara", name: "Mara Okonkwo", handle: "@mara@tacet.social", avatarUrl: null, bio: "Gardener, mostly. Occasionally a poet about it.", url: "https://tacet.social/@mara", source: SAMPLE_HOME, verified: false },
];

export const mockMoments: Moment[] = [
  { id: "s-m1", author: mockPeople[3], text: "The first tomatoes came in this morning. I stood in the garden longer than I needed to. That's the whole post.", createdAt: "2026-07-07T07:12:00Z", url: "https://tacet.social/@mara/1", media: [], source: SAMPLE_HOME },
  { id: "s-m2", author: mockPeople[0], text: "I deleted four apps this week and somehow I still talk to everyone I want to. Turns out I didn't need the walls. I needed one door.", createdAt: "2026-07-07T06:40:00Z", url: "https://mastodon.social/@anna/1", media: [], source: mockPeople[0].source },
  { id: "s-m3", author: mockPeople[1], text: "Portra 400, late afternoon, the harbour. Nothing staged.", createdAt: "2026-07-07T05:20:00Z", url: "https://pixelfed.social/cassie/1", media: [], source: mockPeople[1].source },
  { id: "s-m4", author: mockPeople[2], text: "New short is up. Six minutes, one street, one afternoon. Made for a small screen and a quiet room.", createdAt: "2026-07-07T03:00:00Z", url: "https://peertube.social/tobi/1", media: [], source: mockPeople[2].source },
];
