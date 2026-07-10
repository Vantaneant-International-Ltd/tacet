# Publishing Philosophy

> **Status: foundational.** This is the reference for every future publishing feature in
> Tacet. It defines *what it means to create something in Tacet* before any publishing
> code exists, so the implementation becomes obvious. It contains no schema, no UI, no
> code — only philosophy and architecture. Where it takes a position, the position is
> meant to be load-bearing; where it defers, it says so and recommends a default.

Read [`FOUNDING_PRINCIPLES.md`](../../FOUNDING_PRINCIPLES.md) and
[`docs/05-federation/`](../05-federation/) first. This document assumes the pillars, the
"complete product / replaceable adapter" law, and home-as-source-of-truth.

For how the publishing features described here are paid for — cross-posting sits in Tacet
Plus, and the free tier stays genuinely usable forever — see the
[business model](../01-product/business-model.md).

---

## The thesis, in one line

> **In Tacet you do not "post." You make something, and it is yours. Publishing is how
> you choose to send a copy out — never how it comes into being.**

Content belongs to you before it belongs to any network. Your home is the source of
truth. The network is a destination, never the origin.

## Why this document exists

Every other social product answers "what does it mean to create?" the same way: you
compose *into a box that belongs to a platform*, and the act of creation and the act of
publishing are the same instant. The content is born as a post. It exists because the
platform hosts it. Delete your account and it's gone.

That is the single assumption Tacet rejects. Everything built so far — Today, People,
Discover, Conversations, Me, Identity, Workspaces, Profiles — has been read-only precisely
so that when we finally let people *create*, we could get this one thing right: **creation
and distribution are different acts, and only distribution touches the network.**

If we get this right, publishing is not a feature bolted onto a reader. It is the natural
outward motion of a home that already holds what you keep and who you are.

---

## What is Home?

Before publishing, there is **Home**.

**Home is the permanent place where a person's digital social life lives.** It holds their
identity, the things they make, the things they keep, and the record of their time on the
open social web — all of it owned by the person, all of it in one place, all of it
outliving any network or protocol. Home is the noun this whole product is built around;
the five pillars are how you move through it, and Me is where it is most obviously *yours*.

Concretely, a Home contains:

- **Identity** — who you are (your workspace(s), profile, handle, avatar).
- **Entries** — the things you create.
- **Saved Moments** — posts from the open web you chose to keep.
- **Collections, notes, reading later, pinned** — the ways you organize and annotate.
- **History** — your record (recently viewed, and in time, more).

**Publishing is one capability of Home — not its purpose.** A Home is complete and
worthwhile for someone who never publishes a single thing: it is where they read, keep,
reflect, and hold their identity. Publishing simply lets Home *reach outward* when its
owner chooses. We build Home first, always; publishing is something Home can do, never the
reason it exists.

### Owned content vs kept content

A Home holds two kinds of things, and the distinction matters:

- **Owned content — what you create.** Your **Entries** (Thoughts, Photos, Articles,
  Videos, Events). You are the author. These are the source of truth for your own work;
  publishing distributes copies of them.
- **Kept content — what you choose to keep.** **Saved Moments** from the open web, and the
  **collections, notes, and reading-later** you wrap around them. Someone else authored the
  Moment; you are its *keeper*, not its author. Your note on it is yours; the post is theirs.

Both belong in your Home — it is a place for your work *and* the world you've gathered
around yourself — but **only one is authored by you.** This is why they behave differently:
you can edit and publish what you *own*; you keep, annotate, and organize what you've
*kept*, and you never publish it as if it were yours. Home is the union of the two; the
line between them is never blurred.

---

## The publishing laws

Six laws. Every publishing decision is judged against them first.

1. **The home is the source of truth.** The authoritative version of anything you make
   lives in your workspace, in a protocol-agnostic form, forever, whether or not it is
   ever published. The network holds *copies*.

2. **Creation ≠ distribution.** Making something and sending it out are two separate,
   deliberate acts. The first is always complete in itself. The second is optional,
   reversible-in-intent, and never required for the work to be real.

3. **Publishing is distribution, not ownership.** Sending a copy to a network never
   transfers ownership. The network cannot own your work; it can only display a copy of
   it, on terms you can walk away from.

4. **The product speaks in human acts; the adapter speaks protocol.** The user shares,
   updates, retracts. They never "post to ActivityPub." Only the adapter layer knows how a
   piece of content maps onto a protocol's objects and activities.

5. **Content is a superset, not an intersection.** The content model expresses what humans
   want to make, not what any one protocol happens to support. Each adapter *represents*
   the content as faithfully as its destination allows. Tacet never shrinks human
   expression to the lowest common denominator of a wire format; the full work always stays
   home, and each network receives the truest representation it can hold.

6. **Your work outlives every protocol.** Identity outlives the protocol; content outlives
   the protocol. If ActivityPub vanished tomorrow, everything you have made would still be
   here, intact and exportable, and only the way it *goes out* would change.

These are the same shape as the read-side adapter law — read normalizes the world *in*;
publishing maps your work *out*; the domain in the middle is protocol-agnostic and
permanent.

---

## What is content?

Content in Tacet is a piece of **your work that you own**, living in your home. Not "a
post." Not "an update." A thing you made.

We give it one name: an **Entry**. An Entry is the atom of creation — the owned,
authoritative object. It has a *kind* (what sort of thing it is), a body appropriate to
that kind, optional media, timestamps, a version, and a distribution state. It belongs to
exactly one workspace. It is complete the moment it exists, published or not.

> **"Entry" is an internal domain abstraction — a word for engineers, never for users.**
> It exists so the model can *unify* the human content types under one shape. In the
> product, people never see or hear "Entry"; they make a **Thought**, a **Photo**, an
> **Article**, a **Video**, an **Event**. The UI always speaks in those human terms. This
> document uses "Entry" precisely because it is the engineering unification of them — and
> for the same reason, the interface never does.

This is a deliberate inversion of the platform "post":

| Platform "post" | Tacet **Entry** |
|---|---|
| Born when published | Exists from the first keystroke |
| Owned by the platform | Owned by you, in your workspace |
| Gone if you leave | Yours forever; exportable |
| Is the thing | Is the *source*; a post is a distributed *copy* |

An Entry, once distributed, appears on networks — and to other people — as a **Moment**
(the read-side domain object we already have). So the full arc is:

```
You make an Entry (owned, authoritative, in your home)
        ↓ you choose to share it
An adapter maps it to a protocol and delivers it
        ↓
It exists on a network as a copy (a Publication record ties them together)
        ↓ others read it
They see a Moment
```

The same object read *in* from the open web is a Moment; the same object authored *out*
from your home is an Entry that becomes Moments. The domain is symmetric.

### What is a Thought, a Photo, an Article, a Video, an Event?

They are **kinds** of Entry — the same object, shaped for a different human intent:

- **Thought** — short-form text. The quick, the fleeting, the aside.
- **Photo** — one or more images, with optional words. The image leads.
- **Article** — long-form with a title. The considered, the essay, the piece.
- **Video** — moving image with a title and description.
- **Event** — a happening: a time, a place, an invitation.

These five are a good, human, expressive core — organized around *what a person wants to
make*, not around a platform's tab structure. But:

### Should those be the only content types? Should they be extensible?

**No, they should not be the only types, and yes, the model must be extensible — but
extensibility is a governed act, not a free-for-all.**

A kind is not a database column; it is a **definition** in a registry. A kind declares:
its human meaning, its structured fields, how it renders, and how each adapter represents
it on a protocol (including the best representation where a protocol has no exact match).
Adding **Audio**, a
**Thread/Series**, a **Poll**, a **Place**, a **Review** (BookWyrm-style), or a **Recipe**
later is *adding a definition* — never re-architecting, never a migration of the core.

The discipline: a new kind earns its place only if it is a genuinely distinct human act of
expression (per the [pillar rule](../../FOUNDING_PRINCIPLES.md)), not a platform feature in
disguise. We resist the endless-content-type sprawl of other products. Five, chosen well,
extensible with care.

> **Design consequence:** the core schema stores an Entry with a `kind` (data, not schema)
> and a typed body. New kinds are configuration + an adapter mapping, not structural
> change. This is the single most important structural decision and it follows directly
> from Law 5.

---

## Writing, publishing, and the death of the "draft"

### When does writing become publishing?

At exactly one moment: a **deliberate act of distribution** — *Share*. Not on save. Not on
autosave. Not implicitly. Writing is always safe, always private, always yours until you
consciously send a copy outward.

### Should the word "draft" even exist?

**No. There are no drafts in Tacet's model — there is only your work and its distribution
state.**

"Draft" is a platform concept. It implies content is *incomplete until posted*, that its
telos is to become a post, that unpublished work is a lesser, provisional thing waiting to
be born. Tacet rejects this. A private note you never share is not a "failed post." It is
a complete piece of your work that you chose to keep to yourself. A journal. A shelf of
finished things nobody else needs to see.

So an Entry is **always a whole, real thing**. What changes is its **distribution state**:

- **Private** — home only. The default. Complete, owned, unshared. (This is what other
  products would miscall a "draft" — but it is simply *your content, private*.)
- **Shared** — distributed to one or more destinations. A copy is out.
- **Scheduled** — distribution deferred to a chosen time. (Future; still just a state.)

There is no separate "draft" entity, no "drafts folder" as a distinct kind of object. The
place your private Entries live is the same place your shared ones do: your home. The UI
may, gently, *label* a private Entry — but even there, "**Private**" is truer than
"Draft," and we should prefer it. Nothing you make is provisional.

> **The reframe:** unpublished ≠ draft ≠ lesser. Unpublished is simply *private content in
> your home*, which is a first-class, permanent, dignified state.

---

## Ownership

### Can something exist forever without ever being published?

**Yes — and this is a first-class, ordinary, encouraged state, not an edge case.** A home
that can only hold things on their way to a network is not a home; it's a staging area.
Tacet must be a good place to keep private writing, private photos, a private archive —
work that is never meant to leave. Content does not need a network to be valid, and a
person who never publishes anything is still fully at home in Tacet.

This is the natural completion of Me: your home already holds what you *keep* (saved
posts) and who you *are* (identity). Publishing adds what you *make*. Some of it you'll
share. Much of it you won't. All of it is yours.

### Should deleting a published copy be different from deleting the original?

**Yes — completely different, and never conflated.** There are two distinct operations,
and the product must always make clear which one you're doing:

- **Retract (unshare)** — remove a *distributed copy* from a destination, keep the
  original. Your work survives; you simply stop sharing it there. In protocol terms this
  is a delete/tombstone *of the copy*, requested of the destination.
- **Delete (the Entry)** — remove the *original* from your home. This is deleting the
  work itself.

Deleting the original should offer to retract every copy first ("this is shared in 3
places — unshare everywhere, then delete?"), because a source-of-truth that vanishes while
its copies live on is incoherent. But the two acts remain separate in the user's mind and
in the model.

And we must be **honest about the limit of retraction**: once a copy has been distributed
to the open web, we can *request* its removal, but we cannot *guarantee erasure* — other
servers may have cached or copied it, and that is the nature of an open network. Tacet
promises to always keep *your* authoritative copy under your control and to always attempt
faithful retraction; it does not pretend to a delete button over the whole internet. Say
this plainly. (Honesty over hype — see [anti-patterns](../00-manifesto/anti-patterns.md).)

### Should editing affect the original or the published representation?

**Editing always changes the source of truth — the Entry in your home — and never
anything else automatically.** Published copies are *representations of a version*. When
you edit, you create a new version at home. Whether that new version propagates outward is
a *separate distribution decision*:

- The Entry carries a version (a monotonic revision + `updatedAt`).
- Each Publication records *which version* it distributed.
- After an edit, destinations that support edits can receive an **update** (a new version
  of the copy); those that don't can keep the old copy, or be retracted-and-reposted — a
  per-destination capability the adapter declares.
- **Divergence is legal and visible**, never hidden. The home is always authoritative; a
  network copy may lag a version, and Tacet can honestly show "your home copy is newer
  than what's shared."

The principle: **you edit your work; you separately decide whether to re-send it.** The
network never silently rewrites your source, and your edits never silently rewrite the
network without your say.

---

## Workspaces and publishing

### Should every piece of content belong to a workspace?

**Yes — unconditionally.** This is already the rule for everything user-owned
([Identity & Workspaces](../../STATE.md)); Entries are no exception. **Every Entry belongs
to exactly one workspace, and the workspace is the author.** A workspace scopes three
things for publishing:

1. **Identity** — the profile the content is published *as* (name, handle, avatar).
2. **Destinations** — the set of connected homes/networks that workspace can send to.
3. **Public presence** — the profile timeline the shared copy attaches to.

### How does publishing as "Renato" differ from publishing as "VNTA"?

They are **different identities entirely** — different name, handle, audience, connected
destinations, and public face. An Entry authored in the *Renato* workspace publishes under
Renato's identity to Renato's destinations and appears on Renato's public profile. The
same words authored in the *VNTA* workspace are a *different Entry*, by a different author,
going to different places.

Consequences that follow directly:

- **No silent cross-identity posting.** You cannot accidentally publish personal content
  under the company's name. The owning workspace *is* the author; there is no ambient
  "current user" that leaks across identities.
- **Moving an Entry between workspaces is deliberate re-attribution**, because it changes
  who made it. The honest model is that "moving" is really "the other identity makes its
  own Entry" — a copy authored by the new workspace — not a silent hand-off. (Recommended
  default; revisit at implementation.)
- **Business vs personal is just a workspace `kind`**, not a separate product. The
  publishing model is identical; only the identity and destinations differ. This is why
  the workspace foundation was built first: publishing attaches to it with zero special
  cases.

---

## Publishing and protocols

### The user never thinks about the protocol.

The user thinks: *"I'm sharing this."* They choose **where** ("the open social web," "my
Mastodon home," later "Bluesky") — a **Destination**, described in human terms. They never
think "I'm posting to ActivityPub," any more than someone sending mail thinks "I'm emitting
SMTP."

The layering mirrors the read side exactly:

```
UI (compose / Share)
   ↓
Domain (Entry · Publication · Destination — protocol-agnostic)
   ↓
Publish Adapter (maps an Entry+kind to a protocol; delivers)
   ↓
Open Social Web
```

- A **Destination** is a human concept bound, underneath, to a *protocol adapter* + a
  *connected identity* on that protocol + audience defaults. The product surface is
  "where does this go and who sees it," not "which wire format."
- The **Publish Adapter** is the only code that knows a protocol. It knows how a Thought
  becomes a Note, an Article an Article, a Video a Video; how a `Create` wraps it, an
  `Update` revises it, a `Delete` retracts it; how audience maps to addressing. It never
  leaks upward.
- The **domain Entry is protocol-agnostic and permanent.** It is the same object no matter
  where — or whether — it is ever sent.

Read and write are two directions across the same seam: the read adapter **normalizes the
world into** the domain; the publish adapter **maps the domain out** to the world. Same
domain, two adapters, opposite directions.

### How should future protocols fit?

**Any future protocol is a new publish adapter and nothing else.** The Tacet content model
must be expressible by any protocol adapter without changing the product, the domain, the
workspace model, or the act of sharing.

Worked example — **AT Protocol / Bluesky**:

1. Add an `AtprotoPublishAdapter`: it maps Entry kinds → AT Protocol lexicon records
   (`app.bsky.feed.post`, etc.), publishes via the AT identity, records a Publication.
2. Add "Bluesky" as an available **Destination** for workspaces that connect one.
3. *Nothing else changes.* Not the Entry, not the kinds, not the workspace, not the
   Compose UI, not the *Share* action. The user shares the same way and sees "shared to
   Bluesky" alongside "shared to the open social web."

**The publishing adapter test** (apply to every publishing decision): *if ActivityPub were
replaced by another open protocol tomorrow, would the user's home, their Entries, their
workspaces, and the act of sharing be unchanged?* The answer must always be **yes**. If a
publishing feature only makes sense as "an ActivityPub thing," it is in the wrong layer.

**Superset, not intersection** (Law 5, made concrete): the content model holds the full
richness of human expression. Each adapter *represents* the content as faithfully as its
destination allows — e.g., an **Article** sent to a protocol without long-form is
represented as a short piece that *links back to the canonical copy in the user's home*.
The rich original never leaves home; the network receives the truest representation the
destination can hold, plus a pointer home. We never delete a paragraph to fit a wire
format — we represent the work, we do not diminish it.

---

## Synchronization and the source of truth

One rule governs all of it:

> **Content flows outward from home. Context flows inward to home. The source of truth
> never moves.**

- **If the local copy changes** → the home Entry gets a new version. The user then
  *chooses* whether to distribute an update. Publishing is always a deliberate act of
  sending a *version* outward; editing at home never silently mutates network copies, and
  never has to.
- **If a published copy changes remotely** → it depends on *what* changed:
  - **Engagement/context** (replies, reactions, shares, boosts) accrues on the distributed
    copy. This is **context, not content.** It flows *inward* — we already read it
    (counts, conversations) — and it enriches the Entry's context, but it **never alters
    the authoritative body.** A reply on Mastodon does not edit your work.
  - **The content itself edited remotely** (e.g., you used another client on the same
    account to edit the copy) → **the home wins.** Tacet treats the home Entry as
    authoritative, *surfaces the divergence* ("this differs from your home copy"), and lets
    *you* reconcile. It never silently overwrites your source with a network version. The
    source of truth does not drift to the edge without your consent.
  - **A copy is removed remotely** (a server disappears, a moderator deletes it) → the
    Entry is untouched at home. The Publication records that the copy is gone. Your work
    survives the loss of any destination.
- **Divergence is a first-class, visible state**, not an error. The honest position is
  that distributed copies *can* drift; Tacet's job is to keep the authoritative one under
  your control and to make any drift legible.

The Publication record is the ledger that makes this coherent: for each (Entry,
Destination) it holds the remote id/URL, the version that was distributed, the state
(pending / live / updating / retracted / failed / gone), and the last time it was
reconciled. Sync is the act of reconciling copies *toward* the home — never the home
*toward* a copy.

---

## Portability

This is where the whole philosophy earns its keep.

- **Identity outlives the protocol.** Your workspace identity is yours, protocol-agnostic,
  portable, exportable. (Already true of the local identity foundation.)
- **Content outlives the protocol.** Every Entry is stored in a stable, self-describing,
  protocol-agnostic form and is fully exportable. Leave a network, your Entries remain.
  Leave *Tacet*, and a documented, complete export lets you take everything you made
  anywhere.
- **Publishing never owns the work.** It only distributes copies. There is no scenario in
  which sending a copy to a network makes that network the owner, or makes leaving cost you
  your work. This is [Open before closed](../../FOUNDING_PRINCIPLES.md) made literal for
  creation: the adapters are pluggable, the *archive is forever*.

If Tacet ever stopped being worth using, you should be able to take every Entry you made
and go — with your identity, your history, and your words intact. A publishing model that
can't promise this has failed the whole point of the product.

---

## The model, conceptually

Not a schema — a *shape*, so the eventual implementation is obvious. (Names are
provisional; the relationships are the point.)

- **Entry** — the owned, authoritative unit of creation. `workspace` (author), `kind`,
  typed `body` + `media`, `createdAt`/`updatedAt`, `version`, `distributionState`
  (private/shared/scheduled), a canonical home permalink. *Kind is data, not schema.*
- **Publication** — the record binding an Entry to a Destination: `remoteId`/`remoteUrl`,
  `publishedVersion`, `state`, timestamps. The distribution ledger. Never authoritative
  over the Entry.
- **Destination** — a human "where," owned by a workspace: `label`, a bound
  `protocolAdapter`, a `connectedIdentity` on that protocol, audience defaults.
- **PublishAdapter** — the protocol seam (mirror of the read adapter): declares which
  kinds it can carry and how each is represented; `map(entry) → protocol payload`; `deliver`,
  `update`, `retract`. The *only* place a protocol is named.
- **Kind registry** — definitions (meaning, fields, render, adapter mappings) for Thought,
  Photo, Article, Video, Event, and future kinds. Extending it is configuration.

Layering (strict, mirroring the read side and the rest of Tacet):

```
UI  →  Domain (Entry · Publication · Destination · Kind)  →  PublishAdapter  →  Open Social Web
```

No UI component knows a protocol. No domain object knows a wire format. The adapter is
replaceable.

---

## Invariants (non-negotiable)

1. The authoritative copy of every Entry lives in the user's home, protocol-agnostic and
   exportable, forever.
2. Creation and distribution are separate acts; only distribution is a deliberate, explicit
   choice.
3. Every Entry belongs to exactly one workspace, which is its author. No ambient identity.
4. The user never sees or chooses a protocol. They share; the adapter maps.
5. Editing changes the source of truth; propagation to copies is a separate, explicit act.
6. Retracting a copy and deleting the original are distinct operations, never conflated.
7. Context flows inward; content flows outward; the source of truth never moves to the edge
   without the user's consent.
8. No feature exists to make a number go up. Publishing creates a record of your work, not
   a scoreboard ([Relationships before engagement](../../FOUNDING_PRINCIPLES.md)).
9. A new protocol is a new adapter and nothing else. A new content kind is a definition and
   nothing else.

---

## Deliberately deferred (decide at the implementation milestone)

These are real decisions the philosophy *bounds* but does not settle. Recommended defaults
in parentheses.

- **Audience / visibility taxonomy** — public / unlisted / followers-only / mentioned-only.
  The model must accommodate audience as part of the distribution decision (mapped by the
  adapter to protocol addressing). *(Default: ship public-to-the-open-web first; design the
  audience field now, expose more later.)*
- **Edit propagation default** — update-in-place vs retract-and-repost per destination.
  *(Default: update where the protocol supports it; otherwise leave the copy and show
  divergence; never auto-retract without asking.)*
- **Delete-the-Entry behavior** — auto-offer to retract all copies first. *(Default: yes,
  offer; never silently orphan copies, never silently leave them.)*
- **Cross-workspace "move"** — re-attribution semantics. *(Default: treat as a new Entry
  authored by the new workspace; no silent identity hand-off.)*
- **Scheduling** — deferred distribution as a state. *(Default: not in the first cut;
  reserve the state.)*
- **Threads / series** — as a future *kind* or an ordered relation between Entries.
  *(Default: not first; the kind registry makes it additive.)*
- **Canonical-URL / provenance links** — every distributed copy points back to the home
  copy where the protocol allows (`rel=canonical` or a link). *(Default: yes — it makes
  home-as-source-of-truth visible and reinforces portability.)* This is the principled
  form of the old "canonical record, network as window" idea, now abstracted into the
  model rather than tied to one workstream.

---

## What this means for the eventual implementation

Because the philosophy is settled, the build is now mostly obvious:

1. **Entries are the first write-side domain object** — created in the home, workspace-
   owned, protocol-agnostic, versioned, with a distribution state. They sit beside saved
   posts and identity in Me.
2. **Compose creates a private Entry.** Saving is not sharing. The home holds it whether or
   not it's ever sent.
3. **Share is a distinct, explicit action** that runs the Entry through a **PublishAdapter**
   for a chosen **Destination**, records a **Publication**, and reflects it on the public
   profile — the same profile UI already built.
4. **The first PublishAdapter is ActivityPub**, mapping the five kinds to AS2 objects and
   `Create`/`Update`/`Delete`; it is the *only* new place a protocol appears. A future
   `AtprotoPublishAdapter` slots in beside it with no product change.
5. **Read and write share one domain.** An Entry, once shared, is the same thing the read
   side already renders as a Moment — so publishing reuses `LiveMoment`, profiles,
   conversations, and counts with no parallel universe.

The read side taught us to normalize the world *into* a protocol-agnostic domain. Publishing
is the mirror: keep the user's work in that same protocol-agnostic domain, and map it *out*
only at the very edge, only when they choose, only ever as a copy.

> You make something. It's yours. If you want, you send a copy into the world — and it's
> still yours. That is publishing in Tacet.

---

*See also: [FOUNDING_PRINCIPLES.md](../../FOUNDING_PRINCIPLES.md) (the pillars + adapter
law), [docs/05-federation/](../05-federation/) (the read-side adapter this mirrors),
[docs/06-engineering/domain-model.md](../06-engineering/domain-model.md) (the domain this
extends), and [docs/08-roadmap/](../08-roadmap/).*
