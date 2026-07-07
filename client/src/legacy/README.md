# Legacy — the old "rooms" product (quarantined)

This folder holds the pre-2026-07 Tacet: the invite-only "clubhouse" built on
**rooms, lenses, keeps, acknowledgments, grids, and public archives**. It predates
the re-founding around the five pillars (Today · People · Discover · Conversations ·
Me) and the [pillar freeze](../../../FOUNDING_PRINCIPLES.md).

**Status: dormant.** Nothing in the live app imports these files, so they are
tree-shaken out of the production bundle. They are kept — not deleted — so the old
experience can be re-enabled or mined for parts. `LegacyApp.tsx` preserves the entire
old router; to re-enable temporarily, render it for the legacy paths in
`client/src/App.tsx`.

These files still type-check under the project config, and still import shared
modules that remain at `client/src/` (`api.ts`, `session.ts`, `router.tsx`,
`bits.tsx`, `util.ts`, `styles.css`). `styles.css` is imported **only** by
`LegacyApp.tsx` now, so the old dark-only design system loads only if legacy is
re-mounted.

## Concept migration map

How each legacy concept maps into the five-pillar product:

| Legacy concept (file) | Fate | Maps to |
|---|---|---|
| Feed, Timeline, Grid | **Deprecate** | **Today** — a calm, bounded feed; the feed is a component, not the product. |
| RoomList, Room | **Deprecate → reframe** | **Communities** (a supporting surface under Discover), not the product spine. |
| You | **Deprecate → merge** | **Me** — identity and your own place. |
| Keeps | **Merge** | Private **Save** on a post (in `app/components.tsx`). No separate screen. |
| Acks (acknowledge), Reactions | **Deprecate** | Private **Spark** (the quiet positive signal). No public counts. |
| Discover (old) | **Deprecate → superseded** | **Discover** (new pillar). |
| Composer, GlobalCompose | **Deprecate → superseded** | **ComposeSheet** (`app/ComposeSheet.tsx`). |
| Shell | **Deprecate → superseded** | **AppShell** (`app/AppShell.tsx`). |
| Onboarding | **Deprecate** | New onboarding TBD; the old rooms tour is retired. |
| PostCard, PostDetail | **Deprecate → superseded** | New **PostCard** (`app/components.tsx`). |
| PublicArchive, PublicPost, Collection | **Park** | The canonical-record / syndication workstream — scoped **out** of the consumer product (PRODUCT_DIRECTION §9). Reserved, not deleted. |
| Admin, InvitePanel | **Park** | Operational surfaces; revisit when the new app needs them. |
| About, Info (Contact/Privacy) | **Park** | Static pages; re-home as real footer pages later. |

## Do not

- Do not import these from the live app (`app/`, `design/`, `views/landing/`,
  `App.tsx`). That would pull the old design system and dead concepts back into the
  bundle and break the single navigation model.
- Do not extend these files. If a concept here deserves to live, rebuild it inside a
  pillar in `client/src/app/`, on the design system in `client/src/design/`.
