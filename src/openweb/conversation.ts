import type { Conversation, ConversationNode, Moment, Person } from "./types";
import type { APObject, APActor } from "./activitypub/apmodel";
import { parseObject } from "./activitypub/parse";
import { normalizeObject, normalizePerson } from "./normalize";

// The slice of the ActivityPub client the assembler needs. Typing to this (not the
// concrete ApClient) keeps the builder testable with an in-memory fake — no network.
export interface ConversationSource {
  getObject(url: string): Promise<APObject>;
  getActor(handleOrUrl: string): Promise<APActor>;
  getCollectionItems(url: string, limit: number): Promise<unknown[]>;
}

// Assemble a read CONVERSATION from the open web using only the generic ActivityPub core:
// walk `inReplyTo` upward for the context that started it, and the `replies` collections
// downward for the reply tree. Everything becomes Tacet domain objects (Moment/Person)
// here — nothing above sees a reply collection. Read-only, bounded, and graceful:
// unreachable parents/replies are simply skipped. One assembler serves every
// implementation (Mastodon, Pixelfed, PeerTube, Lemmy, Misskey, Friendica, …).

const MAX_ANCESTORS = 6; // how far up the "what started this" chain we walk
const MAX_DEPTH = 3; // how deep the reply tree nests
const MAX_REPLIES = 40; // total replies across the whole tree
const PER_LEVEL = 10; // replies fetched per node

type Budget = { remaining: number; truncated: boolean };

async function resolveMoment(client: ConversationSource, obj: APObject, actorCache: Map<string, Person>): Promise<Moment | null> {
  // Prefer the object's embedded author; otherwise resolve the actor URL (cached).
  let fallback: Person | undefined;
  if (typeof obj.attributedTo === "string" && obj.attributedTo) {
    fallback = actorCache.get(obj.attributedTo);
    if (!fallback) {
      try {
        fallback = normalizePerson(await client.getActor(obj.attributedTo));
        actorCache.set(obj.attributedTo, fallback);
      } catch {
        /* author unresolved — normalizeObject may still succeed if embedded */
      }
    }
  }
  return normalizeObject(obj, fallback);
}

async function fetchReplyTree(
  client: ConversationSource,
  obj: APObject,
  depth: number,
  budget: Budget,
  actorCache: Map<string, Person>,
): Promise<ConversationNode[]> {
  if (!obj.repliesUrl || depth > MAX_DEPTH || budget.remaining <= 0) {
    if (obj.repliesUrl && depth > MAX_DEPTH) budget.truncated = true;
    return [];
  }
  let items: unknown[];
  try {
    items = await client.getCollectionItems(obj.repliesUrl, Math.min(PER_LEVEL, budget.remaining));
  } catch {
    return [];
  }
  const nodes: ConversationNode[] = [];
  for (const item of items) {
    if (budget.remaining <= 0) {
      budget.truncated = true;
      break;
    }
    let replyObj: APObject;
    try {
      replyObj = typeof item === "string" ? await client.getObject(item) : parseObject(item);
    } catch {
      continue; // reference-only or unreachable reply — skip gracefully
    }
    const post = await resolveMoment(client, replyObj, actorCache);
    if (!post) continue;
    budget.remaining--;
    const replies = await fetchReplyTree(client, replyObj, depth + 1, budget, actorCache);
    nodes.push({ post, replies });
  }
  return nodes;
}

function collectParticipants(conv: { ancestors: Moment[]; focus: Moment; replies: ConversationNode[] }): Person[] {
  const seen = new Map<string, Person>();
  const add = (p: Person) => {
    const key = p.id || p.handle;
    if (key && !seen.has(key)) seen.set(key, p);
  };
  const walk = (nodes: ConversationNode[]) => {
    for (const n of nodes) {
      add(n.post.author);
      walk(n.replies);
    }
  };
  conv.ancestors.forEach((m) => add(m.author));
  add(conv.focus.author);
  walk(conv.replies);
  return [...seen.values()];
}

export async function buildConversation(client: ConversationSource, focusRef: string): Promise<Conversation | null> {
  const actorCache = new Map<string, Person>();

  const focusObj = await client.getObject(focusRef);
  const focus = await resolveMoment(client, focusObj, actorCache);
  if (!focus) return null;

  // Ancestors: walk `inReplyTo` up, then present oldest-first.
  const ancestors: Moment[] = [];
  let cursor: APObject | null = focusObj;
  for (let i = 0; i < MAX_ANCESTORS && cursor?.inReplyTo; i++) {
    try {
      const parentObj: APObject = await client.getObject(cursor.inReplyTo);
      const parent = await resolveMoment(client, parentObj, actorCache);
      if (!parent) break;
      ancestors.push(parent);
      cursor = parentObj;
    } catch {
      break; // missing/unreachable parent — stop the chain calmly
    }
  }
  ancestors.reverse();

  const budget: Budget = { remaining: MAX_REPLIES, truncated: false };
  const replies = await fetchReplyTree(client, focusObj, 1, budget, actorCache);

  const conversation: Conversation = {
    focusId: focus.id,
    ancestors,
    focus,
    replies,
    participants: [],
    truncated: budget.truncated || (!!cursor?.inReplyTo && ancestors.length >= MAX_ANCESTORS),
  };
  conversation.participants = collectParticipants(conversation);
  return conversation;
}
