// Mock data for Frontend Alpha. No backend is called — this is the experience layer.
// People live on several servers (tacet.social + the open web) so federation reads as
// ordinary. No public counts anywhere (People before posts; no scoreboard).

export type Server = "tacet.social" | "mastodon.social" | "pixelfed.social" | "peertube.social" | "writefreely.host";

export type Person = {
  id: string;
  name: string;
  user: string; // local part of the handle, e.g. "anna"
  server: Server;
  bio: string;
  following: boolean;
  followsYou?: boolean;
  verified?: boolean;
};

export type Post = {
  id: string;
  authorId: string;
  time: string; // human relative time
  kind: "text" | "photo" | "long";
  body: string;
  title?: string; // long-form
  image?: { hue: number; label: string }; // rendered as a calm gradient placeholder
  savedByMe?: boolean;
  sparkedByMe?: boolean; // the private positive signal
  replyPreview?: { authorId: string; body: string };
};

export type Message = { fromMe: boolean; text: string; time: string };
export type Conversation = {
  id: string;
  personId: string;
  time: string;
  unread?: boolean;
  preview: string;
  messages: Message[];
};

export const me: Person = {
  id: "me",
  name: "Renato",
  user: "renato",
  server: "tacet.social",
  bio: "Building a calmer home for the open social web. Founder at VNTA.",
  following: false,
  verified: true,
};

export const people: Person[] = [
  { id: "anna", name: "Anna Reyes", user: "anna", server: "mastodon.social", bio: "Writer. Slow mornings, long walks, longer sentences.", following: true, followsYou: true },
  { id: "cassie", name: "Cassie Lin", user: "cassie", server: "pixelfed.social", bio: "Photographer. Film only. Chasing soft light.", following: true, followsYou: true, verified: true },
  { id: "tobi", name: "Tobi Vos", user: "tobi", server: "peertube.social", bio: "Makes quiet films about ordinary places.", following: true },
  { id: "mara", name: "Mara Okonkwo", user: "mara", server: "tacet.social", bio: "Gardener, mostly. Occasionally a poet about it.", following: true, followsYou: true },
  { id: "devon", name: "Devon Park", user: "devon", server: "writefreely.host", bio: "Essays on attention, cities, and staying human online.", following: true, verified: true },
  { id: "june", name: "June Alvarez", user: "june", server: "tacet.social", bio: "Bakes bread. Reads letters. Believes in the small web.", following: true, followsYou: true },
  { id: "sol", name: "Sol Berg", user: "sol", server: "mastodon.social", bio: "Cartographer of quiet places.", following: false, followsYou: true },
  { id: "ida", name: "Ida Fenn", user: "ida", server: "pixelfed.social", bio: "Ceramics. Warm glazes, honest cracks.", following: false },
];

export function personById(id: string): Person {
  if (id === "me") return me;
  return people.find((p) => p.id === id) ?? people[0];
}

export function handle(p: Person): string {
  return `@${p.user}@${p.server}`;
}

export const posts: Post[] = [
  {
    id: "p1",
    authorId: "mara",
    time: "22m",
    kind: "text",
    body: "The first tomatoes came in this morning. I stood in the garden longer than I needed to. That's the whole post.",
    sparkedByMe: true,
    replyPreview: { authorId: "june", body: "This is the exact feeling I open Tacet for." },
  },
  {
    id: "p2",
    authorId: "cassie",
    time: "1h",
    kind: "photo",
    body: "Portra 400, late afternoon, the harbour. Nothing staged.",
    image: { hue: 28, label: "Warm harbour light on film" },
    savedByMe: true,
  },
  {
    id: "p3",
    authorId: "anna",
    time: "2h",
    kind: "text",
    body: "I deleted four apps this week and somehow I still talk to everyone I want to. Turns out I didn't need the walls. I needed one door.",
  },
  {
    id: "p4",
    authorId: "devon",
    time: "3h",
    kind: "long",
    title: "The internet you actually miss",
    body: "It wasn't the features. It was the feeling that a place was yours — that the people were real, the order was honest, and nobody was measuring you. A short essay on building for that again.",
  },
  {
    id: "p5",
    authorId: "tobi",
    time: "5h",
    kind: "photo",
    body: "New short is up. Six minutes, one street, one afternoon. Made for a small screen and a quiet room.",
    image: { hue: 210, label: "Still from a quiet short film" },
  },
  {
    id: "p6",
    authorId: "june",
    time: "6h",
    kind: "text",
    body: "Baked too much bread again. If you're nearby and on Tacet, the door's open and so is the oven.",
    replyPreview: { authorId: "mara", body: "On my way. Bringing tomatoes." },
  },
  {
    id: "p7",
    authorId: "anna",
    time: "8h",
    kind: "text",
    body: "A friend on Mastodon, a friend on Pixelfed, a friend down the street. Same feed, no translating between apps. This is what it was supposed to be.",
    sparkedByMe: true,
  },
];

export const conversations: Conversation[] = [
  {
    id: "c1",
    personId: "june",
    time: "18m",
    unread: true,
    preview: "the door's open and so is the oven",
    messages: [
      { fromMe: false, text: "Baked too much bread again.", time: "20m" },
      { fromMe: false, text: "the door's open and so is the oven", time: "18m" },
    ],
  },
  {
    id: "c2",
    personId: "anna",
    time: "2h",
    preview: "You: exactly. one door, not seven.",
    messages: [
      { fromMe: false, text: "I deleted four apps this week.", time: "2h" },
      { fromMe: true, text: "exactly. one door, not seven.", time: "2h" },
    ],
  },
  {
    id: "c3",
    personId: "cassie",
    time: "yesterday",
    preview: "sending the full roll over",
    messages: [
      { fromMe: true, text: "The harbour shot is stunning.", time: "yesterday" },
      { fromMe: false, text: "sending the full roll over", time: "yesterday" },
    ],
  },
  {
    id: "c4",
    personId: "tobi",
    time: "2d",
    preview: "You: watched it twice.",
    messages: [
      { fromMe: false, text: "New short's up whenever you have six minutes.", time: "2d" },
      { fromMe: true, text: "watched it twice.", time: "2d" },
    ],
  },
];

// Discover: suggested people across the open web, and a couple of communities.
export const suggested: Person[] = people.filter((p) => !p.following).concat([
  { id: "leo", name: "Leo Marsh", user: "leo", server: "mastodon.social", bio: "Field recordings and slow radio.", following: false },
  { id: "nour", name: "Nour Haddad", user: "nour", server: "pixelfed.social", bio: "Architecture, shadows, patience.", following: false, verified: true },
]);

export type Community = { id: string; name: string; blurb: string; server: Server; members: string };
export const communities: Community[] = [
  { id: "smallweb", name: "The Small Web", blurb: "For people rebuilding the internet at human scale.", server: "tacet.social", members: "a few hundred" },
  { id: "filmphoto", name: "Film Photography", blurb: "Grain, light, and no hurry. Federated with Pixelfed.", server: "pixelfed.social", members: "thousands" },
  { id: "slowmakers", name: "Slow Makers", blurb: "Bread, ceramics, gardens, and the people who tend them.", server: "tacet.social", members: "a warm handful" },
];

export const today = {
  greeting: "Good morning, Renato.",
  line: "A quiet handful from your people. When you reach the end, you're done.",
};
