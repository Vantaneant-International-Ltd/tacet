# ADR-002: Home is the source of truth

## Status
Accepted (2026-07).

## Context
Every other social product answers "what does it mean to create?" the same way: you compose *into a box that belongs to a platform*, and creation and publishing are the same instant. The content is born as a post, exists because the platform hosts it, and is gone if you leave. Ownership is a slogan the platform can revoke.

If a person's identity is portable (ADR-001), their content and identity need a permanent place to *be* — one that survives leaving any network, and survives Tacet itself. We must decide where the authoritative copy of a person's digital social life lives, and which way truth flows when a home copy and a network copy disagree.

## Decision
A person's content and identity live at their **Home** as the single authoritative copy. Networks hold copies only.

Home is the permanent place where a person's digital social life lives — their identity, the things they make, the things they keep, and the record of their time on the open social web — all owned by the person, all in one place, outliving any network or protocol. From this, one rule governs everything: **content flows outward from home; context flows inward to home; the source of truth never moves.** Publishing is one capability of Home, never its purpose — a Home is complete and worthwhile for someone who never publishes a single thing. Sending a copy to a network never transfers ownership; the network can only display a copy on terms you can walk away from.

## Consequences

**Divergence is legal and visible, never hidden.** A network copy may lag a version. When content is edited remotely or a copy is removed, the home wins and Tacet surfaces the drift for the person to reconcile — it never silently overwrites the source with a network version.

**Context enriches but never rewrites.** Replies, reactions, and boosts accrue on the distributed copy and flow inward as context; they never alter the authoritative body. A reply on Mastodon does not edit your work.

**We must be honest about retraction's limit.** Once a copy is on the open web we can *request* removal but cannot *guarantee* erasure. We promise to keep your authoritative copy under your control and to attempt faithful retraction — not a delete button over the whole internet.

**Home must be a good place to keep private things.** If Home only held content on its way out, it would be a staging area, not a home. Private, never-published work is a first-class, permanent, dignified state.

## References
- Product (publishing): [publishing-philosophy.md](../09-product/publishing-philosophy.md) — "What is Home?", the six publishing laws, and "the source of truth never moves"
- Product: [identity.md](../01-product/identity.md) — identity as the owned core of Home
- Related: ADR-001 (Identity before platform), ADR-003 (Entry is the canonical content model), ADR-004
