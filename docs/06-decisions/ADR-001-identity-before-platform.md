# ADR-001: Identity before platform

## Status
Accepted (2026-07).

## Context
On closed platforms, "you" belong to the platform. Your handle, your history, and your audience are held behind a wall you cannot take them through. Leaving means leaving everyone and everything behind — and that cost is the whole point of the walled garden. It is what keeps people somewhere they no longer want to be. Social networking was supposed to work like email: one address, friends anywhere, no walls. Instead it gave everyone a new, unowned identity per app, and turned staying close to a handful of people into a part-time job across seven logins.

Tacet has to decide what a person *is* on the open social web before it decides anything else about the product. That decision determines whether we are building another wall or a home someone can freely leave.

## Decision
A person owns a single, portable identity — `@you@tacet.social` — and the person comes before any platform, including Tacet's own.

The identity is the thing that is real and permanent. Platforms are places the identity visits, not what the identity *is*. One name works everywhere on the open network the way one email address works across every provider. Because the identity is owned and portable, you can leave and take your people and your history with you. That taking-your-people-with-you promise is the most important one, because it means we have to earn your staying every day rather than trap you into it. An owned identity you can walk away from is the ultimate accountability; it is what keeps Tacet honest.

## Consequences

**We accept a harder business.** We forgo lock-in as a retention mechanism. Retention must come from being a good home, not from making the exit painful. This is a deliberate cost.

**Leaving must be first-class.** A real door out — export, handle redirect, follower migration — is a supported path, not a dark pattern. If we ever make leaving hard, we have become the thing we are replacing.

**Identity must outlive the company and the protocol.** If Tacet vanished, the identity on the open web should not vanish with it. This constrains how identity is stored and represented downstream.

**Federation stays invisible.** You never manage protocols or servers to be yourself. One address, many possible homes over time, plumbing out of sight.

## References
- Manifesto: [why-tacet-exists.md](../00-manifesto/why-tacet-exists.md) — "Identity before platforms"
- Product: [identity.md](../01-product/identity.md) — "Me": one identity, you own it, you can leave with it
- Federation: [portability.md](../05-federation/portability.md) — "You own your home. If we stop being a good one, you can leave and keep everything that mattered."
- Related: ADR-002 (Home is the source of truth), ADR-006, ADR-007
