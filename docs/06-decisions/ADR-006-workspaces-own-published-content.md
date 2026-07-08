# ADR-006: Workspaces own published content

## Status

Accepted (2026-07).

## Context

Publishing raises an unavoidable question: *who is the author?* Most products answer with an
ambient "current user" — a single logged-in account that everything you post is silently
attributed to. When a person also acts on behalf of an organisation, that model forces a
clumsy workaround: separate accounts, a full log-out and log-in to switch, or a fragile
"post as" dropdown layered over one identity. It also invites the most embarrassing mistake
in social software — posting personal content under a company's name by accident.

Tacet already built its workspace foundation first, deliberately. Before the first Entry is
published we must decide what a workspace *is* to publishing, so authorship is unambiguous and
switching between identities stays calm.

## Decision

**The workspace is the author of published content.** Every Entry belongs to exactly one
workspace, and that workspace *is* who the content is by — its identity (name, handle,
avatar), its connected destinations, and the public profile the copy attaches to. There is no
ambient current user beneath it that can leak across identities.

A personal workspace (e.g. *Renato*) and a business workspace (e.g. *VNTA*) are **different
authors entirely**: the same words written in each are *different Entries*, going to different
places, appearing on different public faces. Business vs personal is merely a workspace
`kind`; the publishing model is identical, only the identity and destinations differ.

**Switching workspace is a calm choice, never a re-login** — the same shape as switching a
Notion workspace, not signing out of one account and into another. Content is *owned by the
workspace that authored it*; "moving" an Entry between workspaces is deliberate
re-attribution (honestly modelled as the other identity making its own copy), never a silent
hand-off.

The *why*: authorship is identity, and identity must be explicit and un-leakable. Binding
content to a workspace makes cross-identity posting impossible by construction and makes
running multiple identities a first-class, ordinary act rather than a hack.

## Consequences

**Benefits.** No silent cross-identity posting — you cannot accidentally publish as the wrong
self. Multiple identities (person, company, project) are supported with zero special cases,
because publishing simply attaches to the workspace that was built first. Switching is
frictionless and safe.

**Costs.** Users must be conscious of *which* workspace they are in when they create — a
small, deliberate cognitive act, which is the point. Re-attribution across workspaces is a
copy, not a move, which some may find surprising until the reasoning (a different author makes
a different thing) is clear.

**Future implications.** Every publishing surface (compose, Share, profile) reads the active
workspace as author with no ambient-user fallback. New workspace kinds are configuration, not
new publishing machinery.

## References

- [09-product/publishing-philosophy.md](../09-product/publishing-philosophy.md) — workspaces &
  publishing; the workspace is the author; publishing as "Renato" vs "VNTA."
- [ADR-001: Identity before platform](./ADR-001-identity-before-platform.md) — the portable,
  workspace-scoped identity content is authored as.
- [ADR-004: Publishing is distribution, not creation](./ADR-004-publishing-is-distribution.md)
  — the act a workspace-owned Entry undergoes when a copy goes out.
