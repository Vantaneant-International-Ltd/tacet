# Pre-Figma Resolutions — closing the gate

> **Milestone:** Visual System V2 · **Purpose:** the decision record that closes the before-Figma
> punch-list from the [pre-Figma design review](./pre-figma-design-review.md). Every **Critical** and
> **High** item is resolved here or in the canonical doc named. This is the last document before the
> corpus is frozen for Stage 6. Documentation-only; no behaviour changed.

Legend: ✅ resolved · 📄 where the detail now lives.

---

## Critical

- ✅ **Light-theme WCAG AA contrast** — token values corrected. 📄 [tokens.md §6](./tokens.md)
  (tertiary/positive/warning/accent-as-text; scrim raised; `--dot-presence` added).
- ✅ **Content notes (content warnings)** — read (collapsed summary + "Show"; sensitive-media blur)
  and author ("Add a content note" / "Mark sensitive"). Human word **"content note"**, never
  "CW"/"spoiler". 📄 [media-system.md](./media-system.md), [conversation-system.md](./conversation-system.md),
  [publishing-ui.md](./publishing-ui.md), [components.md](./components.md) (ContentNote).
- ✅ **Alt text** — read (quiet "ALT" marker → description; alt is the image's AT name) and author
  (encouraged always, **required on Share**, optional on Keep, prefilled when re-sharing). 📄
  [media-system.md](./media-system.md), [publishing-ui.md](./publishing-ui.md),
  [accessibility.md](./accessibility.md), [components.md](./components.md) (AltMarker).
- ✅ **Identity trust / verification** — **verified links (`rel="me"`)**: a confirmed domain/link
  renders a quiet "confirmed" check (factual, *not* a blue-check status tier), plus a non-vanity
  **workspace-kind cue** distinguishing a business from a person. 📄
  [profile-system.md](./profile-system.md), [components.md](./components.md) (VerifiedLink,
  WorkspaceCue).

## High

- ✅ **Export / leave flow** — a calm Settings door out ("Take your world with you" → package identity
  + content + connections → warm success), no confirm-shaming. 📄 [publishing-ui.md](./publishing-ui.md).
  Embodies [ADR-001](../06-decisions/ADR-001-identity-before-platform.md),
  [ADR-002](../06-decisions/ADR-002-home-is-the-source-of-truth.md).
- ✅ **Scheduled publishing** — a calm when-picker; a quiet "Scheduled for <date>" state in Home,
  editable/cancellable, never a countdown-urgency widget. 📄 [publishing-ui.md](./publishing-ui.md).
- ✅ **Save vs Keep terminology** — **Keep** = commit your *own* work to Home (private, complete, never
  a "draft"); **Share** = publish to the open web; **Save** (spark) is used *only* for keeping
  *others'* moments. "Save" and "draft" are banned from compose. 📄
  [publishing-ui.md](./publishing-ui.md), [components.md](./components.md); reconciled across
  wireframes.
- ✅ **Share semantics & Boost compatibility** — Sharing your own content publishes it (`Create`);
  Sharing someone else's moment re-broadcasts it (`Announce` = **Boost**, in human words). **No public
  Like/fav is sent or displayed.** Tacet gives back to the network through **Boost + Reply**, never a
  tally. Recorded as [ADR-015](../06-decisions/ADR-015-federation-citizenship.md).
- ✅ **Read-only vs interactive honesty gate** — Follow/Reply/Share are the target state; until
  write-federation ships they render in a truthful "coming" state, never dead buttons that fail
  silently. 📄 [publishing-ui.md](./publishing-ui.md); [ADR-015](../06-decisions/ADR-015-federation-citizenship.md).
  *(Backend write-federation scope is an engineering-roadmap item flagged to the product owner.)*
- ✅ **Engagement-mechanic removals** — onboarding "Bringing N so far" → *faces of who's coming*
  ("Ada and Jae are coming with you"), no count; Today context "N unread" → a quiet dot + qualitative
  phrase, and exactly **one** continuation (no second widget). 📄 wireframes 01, 02.
- ✅ **One-handed mobile publishing** — a **keyboard-riding action bar** docks the Visibility control +
  primary verb (Keep/Share) above the keyboard in the thumb arc; phone **Search is bottom-anchored**.
  📄 [publishing-ui.md](./publishing-ui.md), [responsive.md](./responsive.md).
- ✅ **Tab-bar & FAB geometry** — five pillars only, even ≥44px targets; FAB floats **offset** off the
  rightmost pillar; tab labels ≥ `--text-micro`; bar height flexes under font-scaling. 📄
  [navigation.md](./navigation.md).
- ✅ **Attribution consistency** — feed attribution names a human **place** (host), never software
  ("Pixelfed"/"PeerTube"). 📄 wireframe 02, aligned with [profile-system.md](./profile-system.md).
- ✅ **Discover/People ordering rationale** — ranked by **mutual-connection density + recency**, never
  by engagement/popularity/activity. Recorded here as the canonical sort key; surfaces reference it.
- ✅ **Presence-dot & Save-signal AT contract** — dot exposes a visually-hidden name and one polite
  live announcement; Save is shape+label, never colour-alone. 📄 [accessibility.md](./accessibility.md).
- ✅ **Stage-5 propagation** — `--ratio-4-3`/`--ratio-16-9` → `--ratio-photo`/`--ratio-video`; People
  filter "AI" → "Creators"; "Msgs" → "Messages". 📄 wireframes 03, 05, 06.

## The reuse inventory (locked before the Figma library is drawn)

Draw each **once** with variants; do not re-invent per screen (from the engineer's review):

- **Person Card** (contexts: list / grid / quick / federated).
- **Content Card** (kind: thought/photo/article/video/event; may wrap a **ContentNote**; per-image
  **AltMarker**; action row **Reply · Share · Save**, no counts).
- **One Overlay/Dialog primitive** consumed by ⌘K search, media viewer, compose sheet, Modal
  (focus-trap + Esc + scrim + focus-return) — also the accessibility win.
- **SegmentedControl** (radiogroup, filter) vs **Tabs** (tablist, view-switch) — the two survivors;
  the V1 `.t-segmented`/`.t-tab-pill` overlap is retired.
- **AvatarCluster** (`--overlap-avatar`) for "people you both know" everywhere.
- **ContextColumn** as a per-screen *slot* (each screen provides `renderContext()` + an inline fold
  for < `--bp-xl`), never a shared widget host.
- **ComposerChassis** (header + workspace/author row + distribution footer) with five pluggable kind
  bodies; distribution state drives the primary verb (Keep/Share).
- New atoms: **ContentNote · AltMarker · VerifiedLink · WorkspaceCue · presence dot (`--dot-presence`)**.

## Scoping confirmations

- **Grayscale is a Figma wireframe build-mode only.** The app ships **two** themes (Light/Dark). The
  wireframes→hi-fi transition is a variable-mode swap on the *same* components, not a rebuild, and no
  third "grayscale" theme is ever shipped.
- **Deferred to implementation** (not Figma blockers): deleting the live V1 doctrine violations in
  code (`SourceBadge · Mastodon`, `PostCounts`, chat-bubble reader); the shared focus-trap primitive
  build; 200%-zoom chrome reflow; scoped reduced-motion; the desktop keyboard map; per-surface
  error/loading application; Pinned; the `--leading-*` sweep. These are tracked in the
  [review](./pre-figma-design-review.md) yellow list.

---

## Gate status

**All Critical and High before-Figma items are resolved.** The remaining open work is either
implementation-time (yellow list) or the final timelessness pass ([timelessness-audit.md](./timelessness-audit.md)).
Once the timelessness pass completes and the corpus passes a final consistency check, the design
corpus is **frozen and ready for Stage 6 (Figma)**.
