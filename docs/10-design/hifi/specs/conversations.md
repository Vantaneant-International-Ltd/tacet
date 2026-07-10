# Conversations — fidelity spec

Conformance target for the **Conversations** surface. Source of truth: `docs/10-design/hifi/handoff/Conversations Desktop.html` + `Conversations Mobile.html`. Current impl: `client/src/app/screens/Conversations.tsx` (the list), `client/src/app/screens/Conversation.tsx` (the reader), `client/src/app/openweb.ts` (`useConversation`, `conversationPath`, `relativeTime`), `client/src/app/me.ts` (`api.listRecent / clearRecent`), rendered inside `client/src/app/AppShell.tsx`. CSS: `client/src/app/app.css` (`.t-convorow`, `.t-convo-*`, `.t-participants`, `.t-thread`, `.t-caughtup`, `.t-screen--reading`).

Type system is LOCKED: **Hanken Grotesk + Spline Sans Mono** (the templates ship Jost/Space Mono — ignore; our vendored kit is the one type system per `theme.css`). All tokens below are semantic (W3). Reduced-motion + AA contrast honoured (W4). No protocol words in UI copy (W5 — Mastodon/Pixelfed/Lemmy are product names, allowed; the raw handles `@x@server` shown in the template are fine as displayed identity). **Honesty carve-outs (W1) are the dominant concern on this surface** and are called out inline and in §0.

---

## 0. Where Conversations lives — and the honesty problem (read first)

There are **two divergent product models** on this surface:

**(A) The template's model.** "Conversations" is a **correspondence / direct-message reader**. It shows *one selected conversation thread* (message bubbles with a live **reply composer + Send button**), a context column ("In this conversation" participants, "It hangs off" the source moment), a **"Waiting quietly"** notifications list (replies/mentions/DMs addressed to you), and on mobile a **list** of correspondences (a summary card + notification rows). The framing is "things genuinely for you" — replies, mentions, letters — i.e. a **personal inbox of messages you can answer**.

**(B) The current impl's model.** `Conversations.tsx` is a **read-only list of threads you have opened** ("Threads you've opened. Read a post anywhere to follow its conversation."), and `Conversation.tsx` is a **read-only conversation reader** ("Read-only: you understand what happened; there is nothing to reply to"). There is **no messaging, no composer, no Send, no notifications inbox**. The product deliberately cannot send replies or receive DMs.

**W1 governs the reconciliation.** The template (A) *lies* about product capability in three ways the honesty whitelist forbids us to ship:
1. A **reply composer + Send button** that implies you can send a message to Chris and Mara. The product cannot send. → **Must be honestly disabled / reframed** (see §4, G-lie-1).
2. A **"Waiting quietly" inbox** of replies/mentions/DMs "for you" (Maya replied to *your* photo, Cassie sent *you* an article, Tobi's DM). The product has no such per-user notification stream. → **Must not fabricate a personal inbox** (§4, G-lie-2).
3. The masthead "**Replies, mentions and letters — things genuinely for you. No counts, no queue to clear**" claims a personal-correspondence feature that does not exist. → **Reword to honest correspondence-reader framing** (§3 W1 rows).

**Decision for this build:** Adopt the template's **visual system and layout** (3-column canvas, editorial masthead, message-thread bubble form, context column, atmosphere tokens), but keep the product **read-only and honest** (model B's truth). Concretely:
- The `/conversations` list keeps its honest purpose (threads you've opened / are following) but is **restyled** to the template's editorial masthead + conversation-summary rows + context column.
- The `/c/:id` reader keeps its read-only thread but adopts the template's **message-bubble visual form** and context column ("In this conversation" = our `Participants`; "It hangs off" = our `ancestors`/source moment).
- The **composer is rendered as a not-yet-publishing preview / honestly disabled** — never a live Send (W1). If not built at all, omit it rather than ship a dead Send.
- The **"Waiting quietly"** module is either **omitted** or reframed to a **non-personal, non-fabricated** module (e.g. an honest empty/absent state) — we do NOT ship the fabricated "Maya replied to your photo" rows as if they were a real inbox.

Routes: `/conversations` → `Conversations.tsx` (list), `/c/:postRef` → `Conversation.tsx` (reader). Both already wired via `conversationPath()`. The rail/tab-bar pillar is **Conversations** with `aria-current="page"` and the accent presence dot (already in `AppShell.tsx`, `t-navitem__dot`).

---

## 1. Desktop layout — the 3-column canvas

Overall page: `--color-canvas` + `--glow-ambient` background (two accent radial glows, no-repeat), text `--color-text-primary`, `--font-sans`, weight 400, `--text-body`, `--leading-relaxed`. Centred canvas, `max-width: var(--canvas-max)` (1440px).

The template's outer shell is `nav (rail) + main`. `main` is:
```
display:grid; grid-template-columns: minmax(0, var(--measure-reading)) var(--context-width);
gap: var(--gutter); justify-content:center; padding: 0 var(--space-6);
```
i.e. **centre feed (`42rem`) + context column (`320px`)** side by side, with the **250px rail** to their left. The full three-column canvas is `rail 250px | feed 42rem | context 320px`.

### 1.1 Left rail — 250px (`--rail-width`)
Shared app chrome (already built in `AppShell.tsx`; matches the template's rail). Verify against template:
- Wordmark **tacet** with the accent lamp glow behind it.
- **Search** trigger row (`role="button"`, aria-label "Search people, communities, conversations", visible text "Search", trailing mono **⌘K** chip). *Current shell rail has no search row (`AppShell.tsx`). See G8 — if search isn't built, omit the row; do NOT ship a dead ⌘K trigger.*
- Five pillars **Today · People · Discover · Conversations · Me**. **Conversations is the active pillar here** (`aria-current="page"`, accent-subtle pill) and carries the accent **presence dot** (`--dot-presence`, positive/accent glow) — never a count. (`AppShell.tsx` already sets `aria-current` on the active item and renders `t-navitem__dot` on the Conversations item — keep; ensure the dot reads as presence, glow, not a badge count.)
- **New** compose button — accent gradient (`accent-hover → accent`, `linear-gradient(180deg,...)`), `--color-on-accent`, `--glow-accent`, label "New".
- Foot: avatar (radial gradient placeholder) + display name **"Renato Gusani"** (`--text-label`/500) + mono **"@renato"** (`--text-micro`, `--color-text-tertiary`), theme toggle (icon button, sun/moon, aria "Switch theme").

### 1.2 Centre feed — `minmax(0, 42rem)` (`--measure-reading`)
`<section aria-label="Conversations">`, `padding: var(--space-8) 0 var(--space-9); min-width:0`. Order:

1. **Editorial masthead** (`<header>`, `margin-bottom: var(--space-7)`)
   - **Eyebrow**: `<div>` text **"Conversations"** — `--text-micro`, weight 500, `--tracking-wide`, `--color-text-tertiary`.
   - **h1** **"Correspondence."** — `--text-display`, weight **400**, `--tracking-tight`, `--leading-tight`, `margin: var(--space-3) 0 0`.
   - **Subhead** `<p>` — `--color-text-secondary`, `--text-body-sm`, `--leading-relaxed`, `margin: var(--space-3) 0 0`. Template copy: "Replies, mentions and letters — things genuinely for you. No counts, no queue to clear." → **W1 reword** (§3): "Threads you've opened, and the conversations you're following. No counts, no queue to clear."

2. **"All conversations" back link** (`<a>`, `display:inline-flex; align-items:center; gap:var(--space-2)`, `--color-text-secondary`, `--text-label`/500, `margin-bottom: var(--space-5)`), arrow-left glyph (`--icon-sm`) + span "All conversations". This is the **reader view's** back affordance (the desktop template shows a single conversation open). In `Conversation.tsx` this maps to the existing back button (`t-profileback`, "Back" + arrow) — **rename/retreatt to match template affordance style** (arrow-left + label, secondary color). On the `/conversations` **list** this link is not shown.

3. **Conversation-summary card** (the header of the opened thread) — `<article>`:
   - Avatar cluster: overlapping round gradient avatars (`36px`, `--radius-full`, `margin-left: var(--overlap-avatar)` = -8px, `box-shadow: 0 0 0 2px var(--color-surface)`).
   - Title `<div>` **"Building for the open web"** — `--text-subheading`, weight 500, `--leading-snug`.
   - Sub `<div>` mono provenance **"with Chris Hall & Mara Ito · began this morning"** — `--font-mono`, `--text-micro`, `--color-text-tertiary`.
   - Trailing source chip **"Mastodon"** (`<span>`, product name, allowed W5).
   - In our impl this maps to the reader's participant/source header (`Participants` + source). Populate from real conversation data (`conversation.participants`, `focus.source`, `focus.title`) — never the fabricated "Building for the open web" sample.

4. **Message thread** — a vertical stack of message rows (`display:flex; flex-direction:column; gap:var(--space-4)` region). Each row:
   - **Other-person row** (Chris, Mara): `display:flex; gap:var(--space-3)`. 36px round gradient avatar (`aria-hidden`) + body (`min-width:0; flex:1`):
     - Head `<div>` (`display:flex; align-items:baseline; gap:var(--space-2); flex-wrap:wrap`): name `<span>` (`--text-label`/500) + mono timestamp `<span>` (`--font-mono`, `--text-micro`, `--color-text-tertiary`).
     - Body `<p>` (`margin: var(--space-1) 0 0; --text-body; --leading-relaxed`).
   - **Own ("You") row** — highlighted card treatment: wrapper `background: linear-gradient(180deg, color-mix(surface-raised 75%, surface) 0%, surface 100%)`, `border: var(--border-hairline) solid color-mix(accent 16%, hairline)`, `--radius-lg`, `padding: var(--space-4)`, `box-shadow: var(--elevation-1), var(--edge-highlight)`. Head + body same type as above. (No avatar on the You row in the template.)
   - **W1**: This bubble form is exactly our read-only `Conversation.tsx` thread rendered as messages. Reuse it to present the **real** conversation (`ancestors` → `focus` → `replies`), styled as bubbles. The "You" highlighted card = a post authored by the signed-in reader within the thread (if any). Do **not** fabricate the Chris/Mara sample dialogue.

5. **Reply composer** (`<div>` row, `display:flex; gap:var(--space-3); align-items:center`):
   - 36px round gradient avatar (`aria-hidden`).
   - **Input**: `role="textbox"` `aria-label="Reply"` `tabindex="0"` — `flex:1`, `padding: var(--space-3) var(--space-4)`, `background: var(--color-surface-sunken)`, `border: var(--border-hairline) solid var(--color-hairline)`, `border-radius: var(--radius-full)`, `color: var(--color-text-tertiary)`, `--text-body-sm`, `cursor:text`; hover → `border-color: var(--color-text-tertiary)`; focus → focus ring. Placeholder text "Reply to Chris and Mara…".
   - **Send button**: `padding: var(--space-2) var(--space-5)`, `background: linear-gradient(180deg, accent-hover, accent)`, `--color-on-accent`, `border-radius: var(--radius-full)`, `--text-label`/500, `box-shadow: var(--glow-accent)`. **Label "Send".**
   - **W1 — this is the lie.** The product cannot send. Ship this composer as a **not-yet-publishing preview / honestly disabled** control (see §4, G-lie-1): render Send `disabled` with title "Coming soon", or reframe the whole row as an honest note ("Replies aren't available here yet — open the moment to reply where it lives"). Do NOT wire a live Send.

### 1.3 Context column — 320px (`--context-width`)
`<aside aria-label="This conversation">`. It is the "your world, never your score" column (ADR-012). Modules in order:

1. **"In this conversation"** (`margin-bottom: var(--space-7)`)
   - h2 **"In this conversation"** — `--text-heading`/500/`--leading-snug`, `margin: 0 0 var(--space-4)`.
   - Participant rows (`display:flex; align-items:center; gap`): 36px round gradient avatar + body (name `<div>` `--text-label`/500 + mono handle `<div>` `--font-mono`/`--text-micro`/tertiary) + trailing presence indicator (dot `--dot-presence` + mono "around now").
     - Row 1: **"Chris Hall"** / **"@chrish@mastodon.social"** / "around now".
     - Row 2: **"Mara Ito"** / **"@mara · on tacet.social"** / "around now".
     - Row 3: **"You"** / **"@renato"** (no presence text).
   - **W1**: The handle `@renato` is **local, not federated** (per Me spec) — display as-is (it is the reader's local handle). Populate from real `conversation.participants` (`Participants` already renders this cluster; the context column is the expanded, named version). Do not fabricate.

2. **"It hangs off"** (the source moment) — h2 **"It hangs off"** (same h2 style):
   - Card: title `<div>` **"What we mean by "building for the open web""** (`--text-body`/500ish, `--leading-snug`), mono sub `<div>` **"Chris Hall · this morning"**, and a link `<a>` **"Read the moment"** + arrow-right glyph — `--color-accent-hover`, `--text-label`/500.
   - **W1**: maps to our `ancestors[0]` / conversation root (`focus`'s source moment). **"Read the moment"** must route to the real source (`focus.url` open-at-source, or the `conversationPath` root) — must WORK or be honestly disabled (G-lie-3). No dead `href="#"`.

3. **"Waiting quietly"** (`margin-bottom: var(--space-7)`) — h2 **"Waiting quietly"**:
   - Two notification rows (`display:flex; align-items:center; gap`): 36px avatar + body (name `<div>` `--text-label`/500 + description `<div>` secondary) + trailing mono time.
     - Row 1: **"Maya Okonkwo"** / **"replied to your photo"** / "2h".
     - Row 2: **"Cassie Lin"** / **"sent you an article"** / "yesterday".
   - **W1 — the second lie.** This is a fabricated **personal inbox** ("replied to *your* photo", "sent *you* an article"). The product has no per-user notification stream. **Do NOT ship these fabricated rows.** Options (§4, G-lie-2): (a) **omit** the module entirely; or (b) reframe as an honest, non-personal module only if real backing exists (it does not today) — otherwise omit. If kept structurally, render an honest empty state, never the fictional Maya/Cassie rows.

4. **Reassurance panel** (bottom of aside): `padding` card, `background: accent-subtle → surface` gradient, border `color-mix(accent, hairline)`, `--radius-lg`, `box-shadow: var(--elevation-1), var(--edge-highlight)`.
   - Positive presence dot (`--dot-presence`, `background: var(--color-positive)`, `box-shadow: 0 0 10px color-mix(positive 70%, transparent)`, `margin-right: var(--space-2)`) + text **"You're connected across the open social web."** (`--text-body-sm`/`--leading-relaxed`/secondary).
   - Link `<a>` **"Learn how it works"** + arrow glyph — `--color-accent-hover`, `--text-label`/500. Must route somewhere real or be honestly disabled (G-lie-4). No dead `href="#"`. Reuse `ConnectivityPanel` content (keep its honest, count-free, no-map framing per ADR-011/012).

---

## 2. Mobile layout

`max-width: 430px` centred column, `--color-canvas` + `--glow-ambient`, hairline left/right borders, `flex column`. The mobile template shows the **list** view (not a single open thread) — a summary card + notification rows + caught-up line.

### 2.1 Top bar (app chrome)
`<header>` sticky top, `height: var(--topbar-height)` (56px), `display:flex; align-items:center; gap:var(--space-3); padding: 0 var(--space-4)`, `background: color-mix(in srgb, var(--color-surface) 92%, var(--color-canvas))` (solid, **no glass/blur**), hairline bottom.
- **tacet** wordmark (`--text-heading`/500/`--tracking-tight`).
- **Search** icon button (`aria-label="Search"`, magnifier glyph `--icon-md`) — pushed right (`margin-left:auto`). *Current shell top bar (`AppShell.tsx`) has only the theme toggle. See G8 — add search or omit; no dead control.*
- **Me** icon button (`aria-label="Me"`, person glyph `--icon-md`) + 32px round gradient avatar. Maps to the shell's route to `/me`.
- NOTE: current `t-topbar` shows `tacet` brand + ThemeToggle. The template's mobile top bar has Search + Me instead of a theme toggle. This is a **shell decision** (top bar is shared chrome across surfaces) — flag as G8; do not restyle the shared top bar per-surface unless the shell build adopts it globally. Keep the theme toggle reachable somewhere (Me/Appearance).

### 2.2 Editorial masthead
`<div>` block (below top bar):
- **Eyebrow** `<div>` **"Conversations"** — `--text-micro`/500/`--tracking-wide`/tertiary.
- **h1** **"Correspondence."** — smaller than desktop (template uses a title-scale h1; use `--text-title`, weight 500, `--tracking-tight`).
- **Subhead** `<p>` **"Things genuinely for you. No counts, no queue to clear."** → **W1 reword** (§3): "Threads you're following. No counts, no queue to clear."

### 2.3 Conversation list
Stack (`gap` ~`--space-3`):
1. **Active-conversation summary card** (first, emphasised):
   - Avatar cluster (overlapping gradient avatars) with a small **accent presence dot** (`--dot-presence`, `background: var(--color-accent)`, `flex:none`) on the row.
   - Title `<span>` **"Building for the open web"** — `--text-subheading`/500/`--leading-snug`, ellipsised (`white-space:nowrap; overflow:hidden; text-overflow:ellipsis`).
   - Mono sub `<div>` **"with Chris & Mara"** — `--font-mono`/`--text-micro`/tertiary/`margin-top:2px`.
   - Last-line `<div>` **"Chris: Write it. I'll bring the footnotes."** (the latest message preview).
   - Trailing mono time `<span>` **"now"**.
2. **Notification rows** (`display:flex; align-items:center; gap`), each: 36px gradient avatar + body (name `<span>` `--text-label`/500 ellipsised + mono handle `<div>` tertiary `margin-top:2px` + description `<div>` `--text-body-sm`/secondary/ellipsised `margin-top:2px`) + trailing mono time (`flex:none`):
   - **"Maya Okonkwo"** / **"@maya@mastodon.social"** / **"Replied to your photo: "the light in this…""** / "2h".
   - **"Cassie Lin"** / **"@cassie@pixelfed.social"** / **"Sent you an article to read later."** / "yesterday".
   - **"Tobi Wren"** / **"@tobi@lemmy.ml"** / **"You: agreed — slow mornings win."** / "Tuesday".
   - **W1 — same inbox lie as desktop.** These "replied to your photo / sent you an article / DM" rows are a fabricated personal inbox. Do NOT ship them as real. On mobile, render the **real** followed/opened conversations as summary rows (author, source handle, latest-post preview, `relativeTime`) — which is honest — or an honest empty state; never the Maya/Cassie/Tobi fiction.
3. **Caught-up footer** (`text-align:center; padding: var(--space-6) 0 0`): `<div>` **"That's everything for you. Nothing is waiting to be cleared."** — `--text-body-sm`/`--color-text-tertiary`. (Honest; keep. Our impl has an analogous `t-caughtup` "That's the whole conversation" — reuse pattern.)

### 2.4 Tab bar (app chrome)
`<nav aria-label="Primary">` sticky bottom, `height: var(--tabbar-height)` (72px). Template order: **Today · People · [FAB New] · Discover · Chats**.
- Centre **FAB "New"** (`aria-label="New"`, `--fab-size` 56px, raised, accent gradient, `--glow-accent`, pencil glyph).
- **Chats** pillar (rightmost) is `aria-current="page"` here and carries the accent presence dot.
- NOTE: template mobile tab bar labels the pillar **"Chats"** and uses a **centre FAB** with **no "Me" tab** (Me is reached from the top bar). Our shell tab bar (`AppShell.tsx`) is Today/People/Discover/**Conversations**/Me with a separate corner FAB. This is a **shell decision** — keep our 5-pillar tab bar and the honest label **"Conversations"** (not "Chats", which implies messaging we don't do — W1/W5-adjacent). Do NOT restyle the shared tab bar per-surface. Flag as G8.

---

## 3. Exact human copy (verbatim, with W1 rewords marked)

| Slot | Desktop template | Mobile template | Ship (honest) |
|---|---|---|---|
| Eyebrow | `Conversations` | `Conversations` | keep |
| Title | `Correspondence.` | `Correspondence.` | keep |
| Subhead | `Replies, mentions and letters — things genuinely for you. No counts, no queue to clear.` | `Things genuinely for you. No counts, no queue to clear.` | **W1 reword** → desktop: `Threads you've opened, and the conversations you're following. No counts, no queue to clear.` / mobile: `Threads you're following. No counts, no queue to clear.` (do not claim a personal replies/mentions/letters inbox) |
| Back link | `All conversations` | — | keep (reader view) |
| Summary card title | `Building for the open web` | `Building for the open web` | sample → real `focus.title`/thread subject |
| Summary provenance | `with Chris Hall & Mara Ito · began this morning` | `with Chris & Mara` | sample → real participant names + `relativeTime` |
| Source chip | `Mastodon` | — | real `focus.source.name` (product name OK) |
| Msg 1 | `Chris Hall` · `9:41 am` · `The boring parts are the whole thing…` | — | sample → real post |
| Msg 2 | `Mara Ito` · `10:02 am` · `Which is exactly why it survives…` | — | sample → real post |
| Msg 3 (You) | `You` · `10:15 am` · `There's a whole essay in that…` | — | sample → real own post if present |
| Msg 4 | `Chris Hall` · `just now` · `Write it. I'll bring the footnotes.` | — | sample → real post |
| Composer placeholder | `Reply to Chris and Mara…` | — | **W1**: disabled/preview — see §4 |
| Composer button | `Send` | — | **W1**: honestly disabled ("Coming soon") or reframed; no live send |
| Ctx h2 | `In this conversation` | — | keep |
| Ctx participant 1 | `Chris Hall` / `@chrish@mastodon.social` / `around now` | — | real participants |
| Ctx participant 2 | `Mara Ito` / `@mara · on tacet.social` / `around now` | — | real participants |
| Ctx participant 3 | `You` / `@renato` | — | real (local handle, W1) |
| Ctx h2 | `It hangs off` | — | keep |
| Ctx source | `What we mean by "building for the open web"` / `Chris Hall · this morning` | — | real source moment |
| Ctx source link | `Read the moment` | — | keep — must route real (G-lie-3) |
| Ctx h2 | `Waiting quietly` | — | **W1**: omit or honest empty state (no fabricated inbox) |
| Ctx notif 1 | `Maya Okonkwo` / `replied to your photo` / `2h` | (mobile) `Maya Okonkwo` / `@maya@mastodon.social` / `Replied to your photo: "the light in this…"` / `2h` | **W1**: do not ship as real |
| Ctx notif 2 | `Cassie Lin` / `sent you an article` / `yesterday` | `Cassie Lin` / `@cassie@pixelfed.social` / `Sent you an article to read later.` / `yesterday` | **W1**: do not ship as real |
| Mobile notif 3 | — | `Tobi Wren` / `@tobi@lemmy.ml` / `You: agreed — slow mornings win.` / `Tuesday` | **W1**: do not ship as real |
| Mobile summary last-line | — | `Chris: Write it. I'll bring the footnotes.` / `now` | sample → real latest-post preview |
| Caught-up footer | — | `That's everything for you. Nothing is waiting to be cleared.` | keep (honest); or reuse our `That's the whole conversation` |
| Reassurance line | `You're connected across the open social web.` | — | keep (from `ConnectivityPanel`) |
| Reassurance link | `Learn how it works` | — | keep — must route real (G-lie-4) |

**W1 summary:** the template's fabricated named people (Chris Hall, Mara Ito, Maya Okonkwo, Cassie Lin, Tobi Wren) and their messages are **design placeholders**. Ship **real** conversation/participant data from `useConversation` / the openweb API, and **honest empty states** when there is nothing — never the fictional names. The **composer/Send** and the **"Waiting quietly" personal inbox** are capability lies and must be disabled/omitted per §4.

---

## 4. Interaction behaviors & honestly-disabled controls

Every interactive control must WORK or be honestly disabled ("coming soon"). Template controls are static (all `href="#"`, `role="textbox"` divs, un-wired buttons).

Working (keep functional):
- **Conversation-summary rows / list rows** (`/conversations`) — open the conversation (`navigate(conversationPath(remoteId))`). Already wired in `Conversations.tsx` (`t-convorow` → `conversationPath`). Restyle to summary-card form (G3) but keep the click behavior.
- **"Clear"** action on the list (`api.clearRecent`) — functional; keep (it clears *your* opened-threads list, which is honest and private).
- **Thread expansion** ("Show N more replies", "Continue this thread →") in `Conversation.tsx` — functional; keep.
- **Participant avatars** → `navigate(profilePath(p.id))` — functional; keep (context column "In this conversation" rows should link the same way).
- **Back / "All conversations"** — real `history.back()` / `navigate("/conversations")`; keep (retreat to template affordance style).
- **New / FAB** → opens `ComposeSheet` (composer stays a **not-yet-publishing preview**, W1); keep.
- **Theme toggle** — functional; keep.

Dead in the template → must be real or honestly disabled/omitted in our build:
- **G-lie-1 · Reply composer + "Send"** (desktop). The product cannot send messages. **Do NOT wire a live Send.** Ship one of: (a) render the composer visually but with the input non-editable and Send `disabled` + title "Coming soon" (honest "not-yet-publishing preview"); or (b) replace the composer row with an honest note: "Replies aren't available here yet — open the moment to reply where it lives" + a real "Read the moment" link. Preferred: (b), because it doesn't dangle a Send.
- **G-lie-2 · "Waiting quietly" notifications** (desktop + mobile). Fabricated personal inbox ("replied to *your* photo", "sent *you* an article", a DM). No per-user notification backing exists. **Omit the module**, or render an honest empty/absent state. Never ship the Maya/Cassie/Tobi rows as real. (If a real, non-personal signal exists later, it can fill this slot — not today.)
- **G-lie-3 · "Read the moment"** (context "It hangs off"): must route to the real source moment (open-at-source `focus.url`, or the conversation root) — or be honestly disabled. No dead `href="#"`.
- **G-lie-4 · "Learn how it works"** (reassurance panel): must point at a real explainer route/anchor, or be omitted. No dead `href="#"`. (Same control as other surfaces — keep consistent.)
- **Rail "Search / ⌘K"** and **mobile top-bar Search** (G8): shell-scope; if search isn't built, omit rather than ship a dead trigger.
- **Mobile tab label "Chats"** — do NOT adopt; "Chats" implies messaging the product doesn't do. Keep the honest **"Conversations"** label (W1).

---

## 5. GAP LIST — edits to conform current impl to template

Ordered most-important first. (G-lie-* items are the honesty-critical ones and take precedence.)

**G1 · No context column exists (biggest structural gap).** The shell (`AppShell.tsx`, grid `250px 1fr` in `app.css` line 87) has no right context column, so the template's `<aside>` ("In this conversation", "It hangs off", reassurance panel) has nowhere to live. Introduce a context-column region. Two options:
  - (a) **Shell-level:** change the desktop grid so `main` is `minmax(0,42rem) 320px` with each screen slotting an `aside` via a shared layout region — matches all sibling specs (saved/me/remote-profile). *Preferred but shell-scope.*
  - (b) **Screen-local:** give `Conversation.tsx` (reader) its own 2-col grid (`minmax(0,42rem) 320px`) rendering the `aside` itself.
  Add tokens `--context-width: 320px`, `--rail-width: 250px`, `--gutter: var(--space-6)`, `--canvas-max: 1440px`. Note: the reader's current `.t-convo` grid (`app.css` line 607) is `340px 1fr` (participants-left, thread-right) — the template puts the **thread in the centre feed and context on the right (320px)**, the inverse. Reorient: thread → centre feed; `Participants`/source/reassurance → context column.

**G-lie-1 · Composer/Send is a capability lie.** The template's `role="textbox"` "Reply to Chris and Mara…" + accent **Send** button implies live messaging. The product is read-only (`Conversation.tsx` comment: "there is nothing to reply to"). Ship the composer **honestly disabled / as an honest note** (§4). Do NOT add a live Send. This is the single most important honesty edit on this surface.

**G-lie-2 · "Waiting quietly" is a fabricated personal inbox.** Omit or render honest empty state; never ship the Maya/Cassie/Tobi rows as real notifications (§4). No per-user notification stream exists.

**G2 · Missing atmosphere/layout tokens.** The template references tokens absent from `theme.css`/`app.css`. Add to the design system (W3 — semantic names, values from the template's Stage-6 style layer, §6 below). Provide light + dark values (template gives both):
  - `--surface-gradient`, `--edge-highlight`, `--media-vignette`, `--media-shadow`, `--glow-ambient`, `--glow-accent`.
  - `--ratio-square: 1/1`, `--ratio-video: 16/9`, `--ratio-photo: 3/2`, `--ratio-portrait: 4/5`, `--ratio-banner: 3/1`.
  - `--dot-presence: 8px`, `--overlap-avatar: -8px`.
  - Type/leading/tracking helpers used by the template: `--leading-tight/snug/normal/relaxed`, `--tracking-tight/wide/normal`, `--border-hairline`, `--border-strong`.
  - Layout: `--context-width: 320px`, `--rail-width: 250px`, `--gutter`, `--canvas-max: 1440px`, `--topbar-height: 56px`, `--tabbar-height: 72px`, `--fab-size: 56px`.
  - Icon sizes: `--icon-sm: 18px`, `--icon-md: 22px`, `--icon-lg: 28px`, `--icon-inline: 1em`.

**G3 · Editorial masthead absent on the list.** `Conversations.tsx` uses a generic `SectionHeading` (title "Conversations", subtitle "Threads you've opened…"). Replace with the template masthead block: eyebrow "Conversations" (`--text-micro`/500/`--tracking-wide`/tertiary) + h1 **"Correspondence."** (`--text-display` desktop / `--text-title` mobile, weight 400/500) + honest subhead (W1 reword, §3). Keep the "Clear" action but move it into the masthead area or keep it as a subtle secondary control.

**G4 · List-row visual form.** Current `t-convorow` is a plain avatar + name/time + preview button. The template's list is a **summary card** (overlapping avatar cluster + subheading title + mono provenance + latest-message preview + presence dot on the active one) plus notification rows. Conform the list rows to the summary-card form (real data: participants, source handle, latest post preview, `relativeTime`). Keep the honest empty state ("No conversations yet" — already good in `Conversations.tsx`, lines 26–31).

**G5 · Reader thread → message-bubble form.** `Conversation.tsx` renders `LiveMoment` cards. The template renders the thread as **message bubbles**: other-person = avatar + head (name + mono time) + body `<p>`; own ("You") = highlighted card (accent-16% border, surface gradient, `--elevation-1 + --edge-highlight`, no avatar). Keep the read-only content (`ancestors → focus → replies`) but present focus+replies as this bubble stack. The existing `t-convo-context` "How it started" / "The post" labels can remain as calm section labels, or fold into the bubble timeline; do not lose the read-only clarity.

**G6 · Context column modules.** Move `Participants` (currently at the top of the thread, `t-participants` stack) into the context-column **"In this conversation"** module (named rows: avatar + name + mono handle + presence). Add the **"It hangs off"** source-moment card (from `ancestors`/`focus` source) with a real **"Read the moment"** link (G-lie-3). Add the **reassurance panel** at the bottom (reuse `ConnectivityPanel` copy: "You're connected across the open social web." + "Learn how it works" — G-lie-4). Add **"Waiting quietly"** only as omitted/empty (G-lie-2).

**G7 · Caught-up / empty copy.** The reader already has an honest `t-caughtup` "That's the whole conversation" (`Conversation.tsx` lines 68–72) — keep. On the list/mobile, the template's caught-up line "That's everything for you. Nothing is waiting to be cleared." is honest — reuse the pattern for the list's end state.

**G-lie-3 · "Read the moment"** — wire to real source or disable (§4). No dead anchor.

**G-lie-4 · "Learn how it works"** — wire to real explainer or omit (§4). No dead anchor.

**G8 · Shell chrome (rail search / mobile top-bar Search+Me / tab label).** Shell-scope; flag, don't rebuild per-surface. Rail lacks the "Search … ⌘K" trigger; mobile top bar lacks Search+Me (has ThemeToggle instead); template mobile tab labels the pillar "Chats" with a centre FAB. Keep our honest 5-pillar shell and the label **"Conversations"** (never "Chats"). If search isn't built, omit the trigger — no dead control.

**G9 · Presence dot semantics.** `AppShell.tsx` already renders `t-navitem__dot` on the Conversations item. Ensure it reads as a **presence glow** (`--dot-presence`, positive/accent, soft glow), **never a count** — matches template. Same for the mobile summary-card accent dot and the reassurance-panel positive dot.

**G10 · Sample vs real data honesty (W1).** All template names/messages/notifications are placeholders. Render real conversation data via `useConversation` / the openweb API and honest empty states; never the fabricated Chris/Mara/Maya/Cassie/Tobi content.

---

## 6. Semantic tokens used (reference)

Type: `--text-display`, `--text-title`, `--text-heading`, `--text-subheading`, `--text-body`, `--text-body-sm`, `--text-label`, `--text-meta`, `--text-micro`; `--leading-tight/snug/normal/relaxed`; `--tracking-tight/wide/normal`; `--font-sans`, `--font-mono`; `--measure-reading` (42rem), `--measure-wide`.
Space: `--space-1`…`--space-9`, `--gutter`.
Radius: `--radius-xs/sm/md/lg/xl/full`. Border: `--border-hairline`, `--border-strong`.
Color: `--color-canvas`, `--color-surface`, `--color-surface-raised`, `--color-surface-sunken`, `--color-hairline`, `--color-text-primary/secondary/tertiary`, `--color-accent`, `--color-accent-hover`, `--color-accent-subtle`, `--color-on-accent`, `--color-positive`, `--color-focus-ring`.
Elevation/motion: `--elevation-0/1/2/3`, `--dur-1/2/3/4`, `--ease-out`, `--ease-in-out`.
**New (G2), values from the template's Stage-6 style layer:**
`--surface-gradient: linear-gradient(180deg, color-mix(in srgb, var(--color-surface-raised) 70%, var(--color-surface)) 0%, var(--color-surface) 100%)`;
`--edge-highlight: inset 0 1px 0 color-mix(in srgb, #FFFFFF 5%, transparent)`;
`--glow-ambient: radial-gradient(90rem 56rem at 16% -12%, color-mix(in srgb, var(--color-accent) 8%, transparent), transparent 62%), radial-gradient(64rem 44rem at 88% -16%, color-mix(in srgb, var(--color-accent) 5%, transparent), transparent 65%)`;
`--glow-accent: 0 8px 28px color-mix(in srgb, var(--color-accent) 32%, transparent)`;
`--media-vignette`, `--media-shadow`, `--ratio-square: 1/1`, `--ratio-video: 16/9`, `--ratio-photo: 3/2`, `--ratio-portrait: 4/5`, `--ratio-banner: 3/1`;
`--dot-presence: 8px`, `--overlap-avatar: -8px`;
`--context-width: 320px`, `--rail-width: 250px`, `--gutter: var(--space-6)`, `--canvas-max: 1440px`, `--topbar-height: 56px`, `--tabbar-height: 72px`, `--fab-size: 56px`;
`--icon-sm: 18px`, `--icon-md: 22px`, `--icon-lg: 28px`, `--icon-inline: 1em`.

---

## 7. Out of scope (do not touch)
`client/src/views/landing/*`, `client/src/views/welcome/*`. Rail / tab-bar / top-bar shell restyle beyond noting gaps (G8) is shell-scope, not per-surface — flag, don't rebuild. The composer stays a not-yet-publishing preview and Send stays honestly disabled (W1). The "Chats" tab label and the "Waiting quietly" personal inbox are NOT adopted (W1 capability honesty).
