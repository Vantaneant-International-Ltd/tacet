# Pre-Figma Design Review — Visual System V2

> **Milestone:** Visual System V2 · **Gate:** before Stage 6 (high-fidelity) · **Method:** structured
> multi-perspective review — ten independent lenses run adversarially against the full corpus (16
> design docs + ~54 wireframe specs + Stage-5 decisions + the live V1 code), then synthesized.
> **No Figma was opened.** Every issue carries: severity · why it matters · recommended solution ·
> before Figma? · can wait until implementation? The final section is the honest readiness verdict.

Severity scale: **Critical** (safety/doctrine/legal-grade, or blocks a core use-case) · **High**
(materially wrong, would bake a defect into hi-fi) · **Medium** (real, fixable in or near Figma) ·
**Low** (polish/verify-at-build).

---

## Part 1 — The ten perspectives (condensed to material findings)

### 1 · Head of Design
Verdict: a genuinely coherent system with a real spine — not a pile of screens — but **not finished**,
and its own reduction pass wasn't written back into the build-facing artifacts.
- **[High]** Stage-5 decisions never propagated into the wireframes they govern — `--ratio-4-3`/`-16-9`
  still in `06-me-home` (B1 said replace), People filter still shows "AI" (F3 renamed→Creators),
  "Msgs" still shown (A3 said "Messages"). *Why:* whoever translates the wireframes reproduces the
  superseded state. *Fix:* propagate the fixes (or ensure the Figma build uses the corrected values).
  *Before Figma? yes · Wait? no.*
- **[Medium]** The canonical "frozen frame" ASCII in `00-overview` is malformed/overlapping and still
  reads `⊕` inside the tab row it exists to disprove. *Fix:* the frame is being rebuilt in Figma
  anyway; ensure the Figma master frame is unambiguous (5 pillars, floating FAB). *Before Figma? yes.*
- **[Medium]** The Save affordance is drawn ≥3 ways (`save`/`spark`/`spark saved`). *Fix:* lock one
  notation: rest=`save` glyph, kept=filled `saved` in `--color-positive`. *Before Figma? yes.*
- **[Medium]** The context column carries 6 bespoke behaviours for a minority-of-sessions surface.
  *Fix:* ship the 2 highest-value variants (Conversation, Me/Today) first; let the rest be empty (the
  Law already blesses it). *Before Figma? no · Wait? yes.*
- **[High]** Five named "must-add" surfaces (Stage-5 §E) have zero coverage; two are load-bearing —
  Export/leave (E1) and Scheduled (E2). *Fix:* design E1/E2 in the Figma build scope. *Before Figma?
  yes (E1,E2).*

### 10 · Product Philosopher
Verdict: the rare product that lives its manifesto — five pillars intact, no notifications tab, no
infinite scroll, human words, an honest door out — **but two engagement mechanics survived the
reduction pass through the "private context" loophole.**
- **[High]** "Bringing 2 so far" — a running follower-tally at onboarding's emotional peak. *Why:*
  make-the-number-go-up applied to your friend list; violates "metrics are not rewards." *Fix:* show
  the faces you're bringing ("Ada and Jae are coming with you"), never a count. *Before Figma? yes.*
- **[High]** "2 unread" as a text label in the Today context column. *Why:* a quantified backlog on
  your home screen is the anxiety mechanic the doctrine forbids; grey instead of red doesn't rescue
  it. *Fix:* dot or qualitative phrase ("new replies from Mara"); reserve numeric counts strictly for
  self-authored inventory (drafts/saved). *Before Figma? yes.*
- **[Medium]** "Continue where you left off" is a re-engagement hook by another name — keep it, but
  make *empty* the common resting case so Today can still feel finished. *Wait? yes.*
- **[Medium]** Discover/People are ordered, and ordering is where algorithms hide — the sort key is
  unspecified. *Fix:* state the rationale (mutual-connection density + recency, never
  engagement/popularity). *Wait? yes.*
- Otherwise: overwhelmingly faithful — human words, honest attribution, real Export door, the one
  blessed "Posts" tab-label exception is narrowly scoped.

### 2 · First-time User
Verdict: the *guided* first run is excellent (lands on a populated Today); but Tacet's two most
distinctive ideas are imposed before they're taught, and its most principled deletion reads as a gap.
- **[High]** Intent-first composer asks "what would you like to make?" before you've typed a word.
  *Fix:* open into **Thought** by default (cursor in the field), other kinds a quiet switch; one
  first-run sub-line. *Before Figma? yes.*
- **[High]** "Where do my posts go?" is never answered — Save (not Post) + "Private" reads like a
  privacy toggle or a draft (the forbidden mental model). *Fix:* one-time inline reassurance after
  first Save naming the destination ("Kept to your home — share it whenever you like → Me"). *Before
  Figma? yes.*
- **[Medium]** The absent Notifications tab reads as missing, not refused. *Fix:* explain the dot once
  on first correspondence. *Wait? yes.*
- **[Medium]** Skip → aggregate empty product with no momentum. *Fix:* defer "Skip" until after the
  one-follow step so "≤4 steps to a populated Today" holds for everyone. *Before Figma? yes.*
- **[Medium]** "Save" means two opposite things (author-keep vs collect-others). *Fix:* rename one
  (compose→**Keep**, or moment→**Save**). *Before Figma? yes.*

### 6 · Mobile User
Verdict: mobile-first in its bones, but **the core create-and-share loop is not comfortably
one-handed.**
- **[High]** Composer primary (Save/Share) sits top-right while the Visibility control hides under the
  keyboard — the two controls that complete the core task straddle the keyboard. *Fix:* a
  keyboard-riding action+distribution bar in the thumb arc. *Before Figma? yes.*
- **[High]** Search stranded top-right, and its overlay is top-anchored so the keyboard covers results.
  *Fix:* bottom-anchored phone search (sheet growing upward). *Before Figma? yes.*
- **[Medium]** Context-column content vanishes on phone with no rehome for some surfaces (Conversation
  participants, Me counts). *Fix:* specify each block's phone home. *Before Figma? yes.*
- **[Medium]** Tab-bar-vs-FAB geometry is ambiguous/overlapping. *Fix:* floating FAB offset off the
  rightmost pillar; 5 even targets. *Before Figma? yes.*

### 3 · Migrating from Instagram
Verdict: a credible home for a visual person **iff the Media tab and imported-photo rendering hit the
"magazine plate" bar** — currently a promise, not a proven screen.
- **[High]** The grid-first instinct is under-served — Media is a secondary tab. *Fix:* make the Media
  tab genuinely win (edge-to-edge editorial mosaic); default to Media for media-dominant profiles.
  *Before Figma? yes.*
- **[High]** Stories/Reels correctly rejected but by *silence* — reads as "not built." *Fix:* let
  confident empty-state/onboarding voice carry the "why," like the Today end-state does. *Wait? yes.*
- **[High]** Mandatory per-image alt text gates a migrant's *first* photo. *Fix:* keep alt mandatory
  but effortless (prefill, suggest), and enforce on **Share** not **Save**. *Before Figma? yes.*
- **[Medium]** Imported photo rendering is a launch-blocking quality bar, not a nicety.
- **[Medium]** DMs exist but buried under a "Messages" filter. *Fix:* a "Message" affordance on
  profiles. *Wait? yes.*

### 5 · Migrating from LinkedIn
Verdict: a professional can publish *more* thoughtfully than on LinkedIn (Article composer, long-form,
workspaces) — **but there is a critical hole: no identity-trust design at all.**
- **[Critical]** No verification / trust surface anywhere. *Why:* a professional can't tell a real
  company/person from an impersonator — the whole use-case depends on trust. *Fix:* the doctrine-safe
  open-web pattern — **verified links (rel="me" domain verification)** — factual, not a vanity check;
  add to profile/About and business workspaces. *Before Figma? yes.*
- **[High]** No "who am I talking to" cue distinguishing a business workspace from a person in the
  feed. *Fix:* a quiet non-vanity workspace-kind cue paired with verification. *Before Figma? yes.*
- **[Medium]** Professional role isn't foregrounded (bio-only). *Fix:* allow one pinned/prominent
  labelled field (Role). *Wait? yes.*
- **[Medium]** The published-Article → Conversation discussion link is never shown. *Wait? yes.*
- Reach metrics correctly rejected — keep; lean on distribution honesty as the "who sees this" answer.

### 4 · Migrating from Mastodon
Verdict: the *feeling* of "hidden protocol, honestly open" is right — **but it fails the migrant on the
concrete tools they came with, and two gaps are safety/accessibility regressions.**
- **[Critical]** Content Warnings have no home — inbound CWs (per `compatibility.md`) would render
  raw. *Fix:* a CW summary+reveal state on Content Card & thread turn; "Add a content note" in
  compose. *Before Figma? yes.*
- **[Critical]** Alt text asserted "required" but undesigned for reading *or* authoring. *Fix:* a quiet
  "described" marker that reveals alt; an alt field in compose. *Before Figma? yes.*
- **[High]** Boost/Fav silently gone; "Share" undefined — risks Tacet being a network *taker* (reads &
  replies, returns no signal). *Fix:* define what Share federates as (Announce/boost?), and whether
  any public positive signal is sent; state it honestly. *Before Figma? yes.*
- **[High]** Read-only backend vs interactive Follow/Reply/Share — `compatibility.md` says read-only,
  the wireframes design live Follow/Reply/publish → dead buttons, the "fails silently" the docs
  forbid. *Fix:* reconcile — gate forward-looking flows truthfully, or update the federation scope.
  *Before Figma? yes (the honesty gate must be designed).*
- **[Low]** Feed attribution "shared from Pixelfed/PeerTube" leaks software names that profile/Discover
  ban. *Fix:* use the human place. *Before Figma? yes (spec rule).*
- Recognition of the open web is *just* sufficient — add one warm first-run sentence ("your people can
  live anywhere on the open web — like email between services"). *Wait? yes.*

### 7 · Desktop User
Verdict: the Context Column Law is well-conceived and mostly self-policing, but **"three-column canvas"
is oversold** and desktop's distinctive powers are named-but-unbuilt.
- **[High]** Today context risks a two-widget dashboard (Resume-article *and* live-thread). *Fix:*
  exactly ONE continuation, per IA §3. *Before Figma? yes.*
- **[High]** ⌘K is the marquee desktop win but there's no full keyboard model (j/k feed, r/s on focus,
  shortcuts). *Fix:* a keyboard-map spec. *Wait? yes (wire ⌘K focus states in Figma now).*
- **[Medium]** In their resting state, Today/People/Discover show an *empty* third column — it's really
  two-column-with-optional-panel. *Fix:* relabel honestly in `responsive.md`; don't force-fill.
  *Wait? yes.*
- **[Medium]** Me context stacks 4 blocks incl. 3 private counts — closest thing to a permitted
  dashboard. *Fix:* cap block count; demote counts to one quiet line; lead with workspace switch.
  *Before Figma? yes.*
- **[Medium]** "Multi-column reading" is promised (`responsive.md §2`) but never designed. *Fix:*
  build it or strike the claim (likely strike). *Wait? yes.*

### 8 · Accessibility (contrast computed on the real token hex)
Verdict: doctrine is excellent and **dark theme lives up to it, but the actual light-theme token
values violate the AA floor the docs promise.**
- **[Critical]** `text-tertiary` fails AA in both themes (2.4–3.2) — and handles/timestamps (must-read)
  are routed through it. *Fix:* darken light tertiary (~`#7A736A`), lighten dark tertiary (~`#7C7C75`)
  to ≥4.5; route handles through `text-secondary`. *Before Figma? yes.*
- **[High]** `--color-positive` (the Save signal) fails AA as icon/text in light (2.94). *Fix:* darken
  (~`#3F8A6B`) and/or guarantee shape-change + "Saved" label, never colour-only. *Before Figma? yes.*
- **[High]** `--color-warning` fails AA in light (2.94); its Badge tint pairings are untested. *Fix:*
  darken (~`#946A1F`) or render as text-primary on a warning tint. *Before Figma? yes.*
- **[High]** `on-media` #FFF over a 55% scrim is only 4.74 on a bright photo, and 12px counts sit on
  it. *Fix:* raise `--alpha-scrim` for text-bearing scrims to ~0.6–0.65, or give count chips an opaque
  backing. *Before Figma? yes.*
- **[High]** `accent`-as-text fails AA in light (4.48). *Fix:* links use `accent-hover` (#6B4BC4) +
  underline; reserve light accent for fills/rings. *Before Figma? yes.*
- **[High]** Missing skip-link, landmarks, live-region primitive, and a defined AT name/contract for
  the `·dot·` presence. *Fix:* add to shell + spec the dot's visually-hidden name + `aria-live`.
  *Before Figma? partially (contract yes; primitive build later).*
- **[Medium]** 200% zoom clips fixed 56/72px chrome. *Fix:* min-height + reflow. *Wait? yes.*
- **[Medium]** Four independent overlays (⌘K, media viewer, compose sheet, Modal) need ONE
  focus-trapped dialog primitive. *Wait? yes (mandate the shared primitive now).*
- **[Low]** The blanket `*{…0.001ms!important}` reduced-motion reset also kills the *functional* fade
  motion.md wants to keep. *Fix:* scope it (keep opacity, kill travel). *Wait? yes.*

### 9 · Frontend Engineer
Verdict: buildable and unusually coherent, but **three live V1 realities actively contradict V2
doctrine and must be removed, not refined.**
- **[High]** V1 `SourceBadge` renders `social.coop · Mastodon` (`live.tsx`, `ProfileView`, `SavedCard`)
  — a shipped L9 violation. *Fix:* delete the software suffix + its tooltip. *Wait? no — fix now.*
- **[High]** V1 `PostCounts` renders "104 reactions · 12 replies · 5 shared" — engagement furniture the
  Content Card rejects. *Fix:* delete component + CSS + call sites. *Wait? no — fix now.*
- **[High]** V1 conversation reader uses chat bubbles (`.t-bubble`), which V2 explicitly rejects; also
  a duplicate `.t-thread` selector. *Fix:* rebuild as reading blocks. *Wait? no for doctrine.*
- **[High]** The per-screen adaptive context column (6 content modes + sub-`bp-xl` fold) is the hardest
  build. *Fix:* model as a `<ContextColumn slot>` each screen *provides* (render-prop), with a
  per-screen empty + inline-fold contract drawn in Figma. *Before Figma? yes.*
- **[Medium]** The intent-first composer is a small state machine (kind × visibility × workspace ×
  validity). *Fix:* a `ComposerChassis` + 5 pluggable bodies; distribution state drives the verb.
  *Before Figma? partially (the chassis split).*
- **[Medium]** The Grayscale/Light/Dark variable-mode: a 3rd shipping theme via `filter` would break
  media + collapse status/accent luminance (worsening the contrast fails). *Resolution:* **Grayscale
  is a Figma WIREFRAME-only build mode, NOT a shipping app theme** — the app ships two themes
  (Light/Dark). This keeps the "wireframes→hi-fi = mode swap" mechanism while removing the engineer's
  concern. *Before Figma? yes (scoping — now decided).*
- **[Medium]** Reuse inventory to lock before drawing the library: **Person Card, Content Card, one
  overlay/dialog primitive, SegmentedControl (radiogroup) vs Tabs (tablist) as the two survivors,
  AvatarCluster, ContextColumn slot, ComposerChassis.** *Before Figma? yes — drives the library.*
- **[Low]** Token gaps: add `--dot-presence` size, a convo-turn avatar step, tokenise Badge status-tint
  alphas; the `--leading-*` sweep is an implementation to-do. *Mostly wait.*
- **[Low]** Simplify: adopt the V2 Me Made/Kept model (drop V1's 6-pill scroller); keep galleries to
  the 4 canonical counts. *Before Figma? partially (Me structure).*

---

## Part 2 — Synthesis (de-duplicated, sorted by gate)

### 🔴 Must clear BEFORE the Figma build (decisions, token changes, and scope additions)

**Token / accessibility (settle before anything is drawn — every screen inherits these):**
1. **Fix light-theme contrast** — tertiary, positive, warning, accent-as-text, and the media scrim, to
   the AA floor the doctrine already promises. Re-route handles off tertiary. *(Critical, a11y §8.)*
2. **Presence-dot & Save-signal contracts** — never colour-only; fixed shapes + labels + AT names.

**New surfaces that must be in the Figma build scope (currently undesigned):**
3. **Content Warnings** — read (summary+reveal) and author. *(Critical — safety.)*
4. **Alt text** — read marker + author field. *(Critical — accessibility & Mastodon norm.)*
5. **Identity verification / verified links** — profile + business workspace. *(Critical — LinkedIn.)*
6. **Export / leave flow** (E1) and **Scheduled distribution** picker (E2). *(High.)*

**Product-truth & doctrine decisions (must be settled so the build reflects them):**
7. **Reconcile read-only backend vs interactive Follow/Reply/Share** — design the honesty gate, or
   confirm the write-federation scope. No dead buttons. *(High.)*
8. **Define what "Share" federates as** (boost/Announce? any public positive signal?) — decide Tacet's
   federation citizenship and state it honestly. *(High.)*
9. **Cut the two surviving engagement mechanics** — onboarding "Bringing N so far" → faces; Today
   context "N unread" → dot/qualitative; Today context = exactly one continuation. *(High.)*
10. **Attribution consistency** — feed "shared from Pixelfed/PeerTube" → human place, matching
    profile/Discover. *(High.)*

**Naming & teaching (shape components and first-run):**
11. **Resolve the "Save" collision** — author-keep vs collect-others get different verbs. *(High.)*
12. **Composer opens into Thought by default**; add the "where your posts go" + "the dot is your
    what's-new" teaching beats. *(High.)*

**Structure / library (must be fixed once, before drawing components):**
13. **Tab-bar = 5 pillars + non-overlapping floating FAB**; tab labels ≥ `--text-micro`. *(High.)*
14. **Lock the reuse inventory + hard component contracts** (ContextColumn slot, ComposerChassis, one
    dialog primitive, SegmentedControl vs Tabs, Person/Content Card, AvatarCluster). *(High.)*
15. **Confirm Grayscale = Figma wireframe mode only** (ship two themes). *(Decided above.)*
16. **Mobile core loop** — keyboard-riding compose action/visibility bar; bottom-anchored phone
    search; specify each context block's phone rehome. *(High.)*
17. **Media tab wins** for visual profiles; **alt gating on Share not Save**. *(High.)*
18. **Propagate Stage-5 fixes** (ratios, Creators, Messages) so the build source is correct. *(High.)*
19. **Specify Discover/People ordering rationale** (non-engagement). *(Medium.)*

### 🟡 Can wait until implementation (code fixes & post-hi-fi refinements)
- **Delete live V1 doctrine violations in code:** `SourceBadge · Mastodon`, `PostCounts`, chat-bubble
  reader + duplicate `.t-thread`. *(High severity but they're code, not Figma blockers — fix during
  build.)*
- Skip-link/landmarks/live-region primitive; the shared focus-trap dialog; scoped reduced-motion;
  200% zoom chrome reflow.
- Context-column variant reduction (ship 2 first); Me context cap; "three-column" honest relabel;
  desktop keyboard map + multi-column-reading decision.
- DM-from-profile affordance; professional Role prominence; Article→Conversation linkage.
- Per-surface error/loading (E3), Pinned (E4), media-viewer states (E5); Reading-Later dedupe; Landing
  boundary note; onboarding progress-dots weighting; tablet FAB decision; toast placement; token
  gaps (`--dot-presence`, convo avatar step, Badge tint alphas, `--leading-*` sweep).

---

# Design Readiness Report

**Is Tacet ready for high-fidelity design? — Not yet. But it is close, and the gap is a defined,
finite punch-list, not a rethink.**

### Why not yet
Three kinds of before-Figma blocker exist, and none should be papered over in hi-fi:

1. **The token layer fails its own accessibility floor in light mode.** This is computed, not
   opinion — `text-tertiary`, `positive`, `warning`, and `accent`-as-text fall below WCAG AA on the
   real hex values, and must-read elements (handles) run through the failing role. Because every
   screen inherits these tokens, building hi-fi first would bake the failure into all ~40 screens.

2. **Three whole capability surfaces are undesigned** — Content Warnings, Alt text, and identity
   Verification. The first two are *safety and accessibility regressions* for the Mastodon audience
   Tacet is built for; the third is the load-bearing trust surface for professionals. These aren't
   polish — they're missing rooms in the house, and hi-fi can't render rooms that don't exist.

3. **Two product-truth contradictions** — the read-only backend vs interactive Follow/Reply/Share
   (dead buttons = the "fails silently" the manifesto forbids), and "Share" left undefined against
   Mastodon's boost/fav expectations (risking Tacet being a network *taker*). And two engagement
   mechanics survived the reduction pass through the "private context" loophole (the onboarding
   follower-tally and the Today "N unread"). Left unresolved, hi-fi would make these *more*
   convincing, not less.

### Why the foundation is nonetheless stable enough to become the canonical reference
The *system* is sound; the blockers are at the edges, not the core:

- **The token architecture is right** — semantic, complete, warm, dual-theme. The contrast fixes are
  value changes to existing tokens, not a re-architecture. Dark theme already passes cleanly.
- **The IA is confirmed and holds under adversarial pressure** — five pillars, Search/Compose as
  overlays, no notifications tab, the Context Column Law. The Philosopher and Desktop lenses stress-
  tested it and it bent only at two named spots, both fixable.
- **The component model is coherent and reuse is high** — the engineer's review turned up *consolidation*
  opportunities, not chaos; the library is drawable once with variants.
- **Doctrine discipline is genuinely strong** — human words, no infinite scroll, no vanity counts, an
  honest door out. The review's job was to find the *exceptions*, and it found a countable few.

In short: the design system is stable enough to be the canonical implementation reference **once the
19-item before-Figma list in Part 2 is cleared** — most of which is (a) settle a decision, (b) change
a token value, or (c) add a missing surface to the build scope. None requires reopening the
architecture. **Clear the red list, then Stage 6 proceeds with confidence** — and because Grayscale is
a Figma-only wireframe mode, the grayscale build and the hi-fi build remain the same components, so
this readiness work is spent once and inherited by both.

**Recommendation:** do not begin Stage 6 until items 1–14 (Critical/High) of Part 2 are resolved.
Items 15–19 can be resolved *within* the early Figma foundation/wireframe work. Everything in the
yellow list is legitimately implementation-time.
