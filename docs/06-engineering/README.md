# Engineering

**The code follows the philosophy, not the reverse.**

Tacet is *your home on the open social web*. Everything in this section exists to keep that sentence true in the codebase. When a design decision and a principle disagree, the principle wins and the code changes. We do not ship an architecture that quietly makes people the product again.

## Engineering ethos

- **Domain-first.** The core of the system is people and relationships — `Person`, `Connection`, `Moment`, `Post`, `Conversation`, `Community`. Everything else (HTTP, D1, R2, ActivityPub) is an adapter around that core. The domain does not import the protocol; the protocol imports the domain.
- **ActivityPub is an adapter, not the model.** Federation maps *onto* our domain; it never dictates it. `Activity`, `RemoteAccount`, `RemoteObject`, `FederationInbox`, `FederationOutbox` live at the edge and translate. See [domain model](domain-model.md) and [activitypub adapter](activitypub-adapter.md).
- **Calm, honest engineering.** Simple over clever. No stored counts that become scoreboards. Responses tell the truth about what a person can and can't do. Federation should feel like email — see [ActivityPub as infrastructure](../05-federation/activitypub-as-infrastructure.md).
- **Portable and open by default.** A person can leave with their identity and their people. That is an architectural requirement, not a feature request.

## Current state, honestly

Today the repo is a single Cloudflare Worker (Hono, TypeScript) in `src/` serving a Vite + React SPA from `client/`, backed by D1 (SQLite) migrations in `migrations/` and R2 for images. Auth is invite-code registration plus an httpOnly session cookie. **No federation code exists yet.** These docs describe the *direction* we are steering toward; where they describe the present, they are accurate to what is in the repo.

## In this section

- **[Architecture principles](architecture-principles.md)** — domain at the core, adapters at the edges; how the five product principles constrain the build.
- **[Domain model](domain-model.md)** — the first-pass concepts and their relationships. The most important file here.
- **[Folder structure](folder-structure.md)** — the target `apps/` + `packages/` layout, compared honestly to today's `src/` + `client/`.
- **[API design](api-design.md)** — resources shaped around the domain; how current Hono routes evolve.
- **[Database model](database-model.md)** — D1 reality today, and how the domain maps to storage.
- **[ActivityPub adapter](activitypub-adapter.md)** — inbox/outbox, Activity translation, protocol at the edge.
- **[Events and jobs](events-and-jobs.md)** — the async boundary that keeps the domain calm.

## The five principles, as constraints

People before posts · Relationships before engagement · Identity before platforms · Calm before addiction · Open before closed. Each is a constraint on what the code is allowed to do. They are spelled out in [architecture principles](architecture-principles.md).
