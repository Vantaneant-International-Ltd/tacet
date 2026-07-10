# ActivityPub adapter

Federation is wiring. This file describes that wiring; the *meaning* lives in [the federation section](../05-federation/README.md), and the load-bearing idea is [ActivityPub as infrastructure](../05-federation/activitypub-as-infrastructure.md): **the protocol is like email — the person never sees it.**

> **Status (2026-07).** The **read** side is built and live. The generic ActivityPub reader
> ships in `src/openweb/` and is mapped onto the shared source-adapter contract in
> `src/sources/activitypub/` — one of four read adapters (ActivityPub, RSS/Atom/JSON Feed,
> AT Protocol, Nostr) behind [ADR-017](../11-decisions/ADR-017-source-adapters.md). This page
> describes the **write** side (publishing: actor documents, inbox/outbox, Activity
> translation), which is still the design we build toward — no write-federation code exists in
> the repo yet. Read below as the write-adapter target, isolated in `packages/federation` (see
> [folder structure](folder-structure.md)).

## The one rule

**ActivityPub lives at the edge and translates. It never reaches into the domain.** The [domain model](domain-model.md) knows `Person`, `Post`, `Connection`, `Community`. The adapter knows `Activity`, `RemoteAccount`, `RemoteObject`, `FederationInbox`, `FederationOutbox`. Translation happens *only* at this boundary. If an `Activity` type ever appears in a domain function signature, the boundary has leaked and must be fixed.

## Surface: the actor and its endpoints

Each local `Person` is published as an ActivityPub actor, separate from the product API ([api design](api-design.md)):

```
GET  /.well-known/webfinger?resource=acct:you@tacet.social   → actor discovery
GET  /users/:handle                                          → actor document (+ public key)
POST /users/:handle/inbox                                    → FederationInbox
GET  /users/:handle/outbox                                   → FederationOutbox
```

All server-to-server traffic is authenticated with **HTTP signatures**; each `Person` has a keypair (private key stored server-side, public key on the actor document — see [database model](database-model.md)).

## Inbound: FederationInbox

1. **Receive** a signed `Activity` POSTed to a local inbox.
2. **Verify** the HTTP signature against the sender's published key; **dedupe** by activity id.
3. **Persist** the raw activity to the `federation_inbox` queue — accept fast, process async ([events and jobs](events-and-jobs.md)).
4. **Translate** off the request path:
   - `Follow` → a `Connection` request targeting a local `Person`; reply with `Accept`.
   - `Create` (Note/Image) → a `RemoteObject`, projected into a `Post`-shaped view, source server shown.
   - `Like` / `Announce` → a reaction / boost against a local `Post`.
   - `Undo` / `Delete` → reverse the mapped effect.
   - `Update` → refresh the cached `RemoteAccount` or `RemoteObject`.

The domain receives ordinary domain operations (`openConnection`, `recordReaction`), never an `Activity`.

## Outbound: FederationOutbox

1. A **domain event** occurs — a `Post` authored, a `Connection` opened, a reaction recorded ([events and jobs](events-and-jobs.md)).
2. The adapter **translates** it into an `Activity` (`Create`, `Follow`, `Like`).
3. The activity is **staged** in `federation_outbox` and **delivered** to the inboxes of relevant remote followers, **asynchronously**, signed, with retry and backoff.

Delivery failing to one server never blocks a person's post from appearing at home. Federation is best-effort at the edge; the local experience is immediate.

## Mapping RemoteAccount / RemoteObject → Person / Post

- **`RemoteAccount`** mirrors just enough of a remote actor to show them honestly (handle, display, avatar, **source server always visible**). A local `Connection` may point at one; the address book is one book across homes ([remote accounts](../05-federation/remote-accounts.md)).
- **`RemoteObject`** is a faithful cache of a remote post. It is **projected** into a `Post`-shaped view for rendering — rendered faithfully, source shown, limits stated plainly — but never written into the native `posts` table. The projection is one-directional and honestly lossy ([remote content](../05-federation/remote-content.md)).

This asymmetry is deliberate: **local objects are the model; remote objects are guests, always labelled as such.**

## What the domain never learns

The domain never learns JSON-LD, `@context`, actor URIs, HTTP signatures, or the word "instance." It knows people and posts. Everything ActivityPub is contained in `packages/federation` so that, done right, federation disappears — and what's left is people. That containment is the deliverable.
