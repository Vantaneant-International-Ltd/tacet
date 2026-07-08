# Publishing UI — Visual System V2

> **Milestone:** Visual System V2 · **Stage:** 2 · References [tokens.md](./tokens.md) and [publishing-philosophy](../09-product/publishing-philosophy.md).

**Purpose:** define the visual and interaction language of *making* and *sharing* in Tacet, so
the composer, the distribution controls, and the Home surface all express one truth: you make
something, it is yours, and sharing is a separate, deliberate act. This doc translates the
[Publishing Philosophy](../09-product/publishing-philosophy.md) into surfaces; it invents no new
tokens and no new doctrine. Where the philosophy takes a position, the UI obeys it visibly.

---

## Why this exists (read first)

Every other product makes creation and publishing the same instant: you type into a box that
belongs to a platform, hit Post, and the thing is born already owned by someone else. Tacet
rejects that. **Creation is complete in itself; sharing is optional and reversible-in-intent.**
The interface must *feel* that separation at every step — never collapse "make" and "publish"
into one button, never call private work a draft, never make the network the origin.

So the composer does not begin by asking *where*. It begins by asking *what you want to make*.
**Everything begins with intent. Not destination.** You do not pick "a Mastodon post"; you make
a **Thought**, a **Photo**, an **Article**, a **Video**, an **Event**. Destination comes later,
calmly, and only if you choose to share at all.

---

## 1. The Compose entry point

**One calm affordance. Never a spectacle.** Compose is reachable from anywhere with a single
gesture, and it is *quiet* — no glowing orb, no pulsing badge, no urgency halo (design principle
L6; [motion.md §1](./motion.md)).

- **Mobile (< `--bp-lg`):** a single compose **FAB** at `--fab-size` (56px), sitting at `--z-fab`
  above the tab bar. Lavender `--color-accent` fill, `--color-on-accent` glyph — this is the one
  primary action of the shell (L3). A `plus` glyph, not a label; its meaning is learned once and
  universal.
- **Desktop (≥ `--bp-lg`):** a **rail button** inside the navigation rail (`--rail-width`, 250px),
  labelled **New** with a `plus` glyph. Words carry meaning (L3, L9). It is not a floating object;
  it belongs to the rail like every other destination.

Activating it opens **the compose surface**:

- **Mobile:** a **sheet** rising from the bottom edge, `--radius-xl` (28px) top corners,
  `--elevation-3`, over a scrim at `--alpha-scrim`. Spring-in on `--dur-3` / `--ease-out`
  (motion.md — *Sheet spring-in*); dismiss on `--dur-3` / `--ease-in-out`.
- **Desktop:** a centred **modal panel** capped at `--measure-reading` (42rem), `--radius-xl`,
  `--elevation-3`, scrim behind. Open on `--dur-3` / `--ease-out`; the dialog fades and rises ~4px.

### Choosing intent — a legible choice, not a wall

The first thing the surface shows is **what are you making?** — five clear choices, each a real
word with a supporting glyph, laid out as calm tappable rows or a small tile row (never a dense
grid of a dozen options):

> **Thought · Photo · Article · Video · Event**

This is **progressive disclosure**: pick the kind first, and the surface becomes *that kind's*
composer. Choosing is legible (L3) — a person always knows what they are about to make. There is
no "advanced" drawer of hidden types; five, chosen well. If a person opens Compose with obvious
intent (e.g. they tapped from a photo), the surface may open pre-set to that kind — but the kind
is always visible and always changeable before they commit a single keystroke.

The composer is **non-persistent** ([compose.md](../01-product/compose.md)): you enter to make a
thing and then leave. It never loiters, nags, or bait-holds you open.

---

## 2. The five kinds — one system, five shapes

All five kinds share **one composer chassis**: the same header, the same author row, the same
distribution footer, the same tokens. Only the *body region* changes to emphasise the kind's
intent. This is the philosophy's "same object, shaped for a different human intent" made visual.

**Shared chassis (every kind):**
- **Header:** a close `IconButton` (`aria-label` "Close composer"), the kind name as the title at
  `--text-heading`, and the primary action at the trailing edge (see §3 — it is **Keep** or
  **Share**, never "Post").
- **Author row:** the [workspace](../09-product/publishing-philosophy.md) avatar + name — *who is
  making this* (see §3). Always present, because the workspace *is* the author.
- **Body region:** kind-specific, below.
- **Distribution footer:** the calm visibility control (see §3).

### Thought — text-first
A single generous text area is the whole surface. Body at `--text-body` / `--leading-relaxed` —
the sacred reading voice. Placeholder in `--color-text-tertiary`: *"Say something to your
people…"*. No title field, no ceremony. Media may be attached but is secondary; the words lead.

### Photo — media-first
The media well leads, occupying the top of the body at `--radius-md` with a `--ratio-photo` (3/2)
default; a single tall image may use `--ratio-portrait` (4/5), a set tiles at `--ratio-square`.
Blur-up on load (`--dur-4`; L5 — media is editorial). Below the image, an optional caption field
at `--text-body-sm`. The image is the subject; words support it.

### Article — long-form reading composer
A **title** field at `--text-title`, then a long-form body constrained to `--measure-reading`
(42rem, ~66–72 chars) at `--text-body` / `--leading-relaxed`. This is a *reading* composer: the
same measure the piece will be read at, so writing and reading feel like one continuous surface.
Room to breathe; the modal/sheet may grow to a comfortable height.

### Video — moving image, titled
A media well at `--ratio-video` (16/9), a **title** field at `--text-subheading`, and a
description at `--text-body-sm`. Video **never autoplays** in the composer (motion.md); a static
poster with a `play` affordance stands in until asked.

### Event — when & where
Structured but calm: a **title**, a **when** (date/time), a **where** (place or link), and an
optional description at `--text-body-sm`. The when/where are the emphasis — an Event is a
happening, so time and place lead over prose. Fields are real semantic inputs, spaced at
`--space-5`, never a cramped form (L1 — hierarchy from type and whitespace, not boxes).

---

## 3. Distribution controls — visibility, author, audience

There is no "Publish" toggle and no "Draft" switch here, because **there are no drafts.** There
is only **distribution state**, shown as a calm visibility control in the footer:

> **Private · Shared · Scheduled**

- **Private** is the default and the resting state. A private Thought is *complete work*, marked
  with the quiet positive signal `--color-positive` — the same colour that means *kept* elsewhere.
  It is never labelled "draft," never styled as provisional, never greyed-out or half-finished.
- **Shared** means a copy is out on the open web. Selecting it reveals audience + destination.
- **Scheduled** defers distribution to a chosen time. (Reserved state; the control shows it as a
  first-class option, not a hidden setting.)

The visibility control is a segmented, legible control — plain words, not icons alone (L9). Moving
from Private toward Shared is the moment creation becomes distribution, and the UI treats it as a
**deliberate act**: the primary button *changes verb* accordingly (see below).

### Who authors it — the workspace switch
The author row carries a quiet **workspace switcher** (avatar + name, a small chevron). Publishing
as **Renato** vs as **VNTA** is *this* choice — a calm switch of identity, **never a re-login and
never an ambient "current user."** Switching workspace changes the author, the destinations
available, and the public face the copy will attach to. There is no silent cross-identity posting:
you always see, right there, *who is making this*.

### Which destinations & audience — framed humanely
Only shown once **Shared** is chosen (progressive disclosure — a private note never sees this):

- **Audience** — a clear choice, in human words: *the open web*, or narrower. Never a growth lever,
  never nudged wider ([compose.md](../01-product/compose.md)). Presented as a plain selector, not a
  buried setting.
- **Destinations** — human "wheres": *the open social web*, *your Mastodon home*, later *Bluesky*.
  The user **never sees a protocol** (L9; philosophy Law 4). A `Chip` (tone `open`) states the
  truth: **"Shares to the open web."**

**Faithful representation, never "degrade."** Where a destination can't hold the full richness of a
kind (e.g. an Article on a short-form network), the UI says so honestly and *positively*: the copy
is **represented** as faithfully as the destination allows, with a link back to the canonical piece
at Home. Copy: *"Long pieces are shown in full at your home; open networks get a faithful preview
that links back."* Never the word "degrade," never "lost."

---

## 4. Home (Me) — where owned content lives forever

Owned content lives at **Home**, in Me — private and shared side by side, because they live in the
same place. This is the philosophy's "your home holds what you make" made into a surface.

- **Private Entries are shown as complete work**, never as a drafts folder, never labelled "draft."
  A private Thought reads as a finished, dignified thing you chose to keep to yourself. Its only
  quiet marker is a **Private** affordance (`--color-text-secondary`, a small `lock` glyph) — a
  statement of state, not a warning.
- **Distribution state is legible at a glance:** Private / Shared / Scheduled shown as a calm
  status line at `--text-meta` (mono), never as a badge that pulses or a count that competes.
- **Owned vs kept is always visible and never blurred.** *Owned* (things you made — Thoughts,
  Photos, Articles, Videos, Events) can be edited and shared. *Kept* (Saved Moments from the open
  web, and your notes on them) can be organised and annotated but **never published as if yours.**
  The two are visually distinct sections in Me; a kept Moment carries its original author's identity,
  an owned Entry carries yours. The `--color-positive` "kept" signal marks saved content; owned
  content is simply *home*.

Home is worthwhile for someone who never shares a thing. The UI must make an unshared archive feel
complete, not like a staging area waiting for a Post button.

---

## 5. Retract vs Delete — two honest, distinct actions

These are **never the same button and never the same word.** Both live on a shared Entry's
overflow menu, visually separated, each with plain-language consequence copy — calm, no
confirm-shaming, but truthful (design principle 5; L9).

### Retract (unshare a copy)
Removes a *distributed copy* from a destination; the original stays at Home, untouched.

> **Retract from the open web?**
> Your Thought stays here at your home — you're only unsharing the copy that went out.
> Once something has been on the open web, we *request* its removal, but other servers may have
> cached it. We can't guarantee it's gone everywhere. *[Retract]* *[Keep sharing]*

The honesty line is not fine print — it is body copy at `--text-body-sm`. **Retraction is
requested, not guaranteed**, and the UI says so plainly. The action button reads **Retract**
(neutral), not a red danger action — unsharing is ordinary, not destructive.

### Delete (the original)
Removes the *work itself* from Home. This uses `--color-danger` because it is genuinely
destructive. If the Entry is shared, Delete **offers to retract every copy first**:

> **Delete this Article?**
> This removes the original from your home for good — this is your only copy. It's currently
> shared in 2 places; we'll ask those to remove their copies too, though cached copies elsewhere
> may remain. *[Delete everywhere]* *[Cancel]*

Never conflate the two. Never let Delete silently orphan copies, and never let Retract imply the
original is gone.

---

## 6. Editing — Home is the source of truth; re-sharing is separate

**Editing always changes the version at Home, and nothing else automatically.** When you edit a
shared Entry, you create a new version in your home — the network copies do not silently change.

- After an edit to a shared Entry, the UI surfaces **divergence honestly**, never as an error:
  a quiet line at `--text-meta`, *"Your home copy is newer than what's shared."*
- Re-sharing the new version is a **separate, deliberate choice** — a calm **Update the copy?**
  action, never automatic. Where a destination can't take an update, the UI says what it can do
  (leave the old copy, or retract-and-reshare) in plain words.
- Divergence is a **first-class, visible state**, styled as information (`--color-text-secondary`),
  not a warning.

The rule, made visible: *you edit your work; you separately decide whether to re-send it.*

---

## 7. Keep / Save acknowledgement — the micro-interaction

When work is saved to Home, or a Moment is kept, the acknowledgement is the **quiet positive
signal** defined in [motion.md](./motion.md) (*Save / pin acknowledgement*, `--dur-2` / `--ease-out`):

- The glyph fills toward **`--color-positive`**, and the **spark** glyph settles in with a single,
  small scale-and-fade. **Confirmation, not celebration** — it happens once and is done. No burst,
  no particles, no repeat, no toast demanding a tap.
- Under `prefers-reduced-motion`, the state still lands: the glyph turns `--color-positive` and the
  spark appears **instantly**, without the scale. Meaning is never carried by the motion that was
  removed (motion.md §3).

Because saving is not sharing, this signal means *"kept, safe, yours"* — never *"published."*

---

## 8. Accessibility of the composer (the floor, not a tier — L10)

- **Real dialog semantics:** `role="dialog"`, `aria-modal="true"`, `aria-label` naming the kind
  ("Compose Article"). Focus moves into the surface on open and is **trapped** within it; on close,
  focus returns to the compose FAB / rail button that opened it.
- **Every control is labelled.** The kind chooser, the workspace switcher, the visibility control,
  audience, and destinations are real semantic controls with visible text labels — never icon-only
  for anything load-bearing (L9). Media/attach buttons carry `aria-label`s.
- **Keyboard paths are complete:** `Escape` closes (with an unsaved-work guard only if there is
  genuinely unsaved text — Tacet keeps your work, so this is rare); `Tab` order follows reading
  order; the primary action is reachable and operable by keyboard.
- **Visible focus everywhere:** `--color-focus-ring` at `--border-strong`, fading in on `--dur-1`
  (motion.md — *Focus ring*), tracking keyboard movement.
- **Meaning never by colour alone:** distribution state, Private/Shared, and the danger of Delete
  are always carried by **word + glyph**, not hue (tokens.md §6 usage law).
- **The reading composer respects the reader:** Article body at `--measure-reading` with
  `--leading-relaxed`, honouring line-length and comfort for people writing at length.

---

## 9. Copy — Tacet's voice

Buttons are **verbs**; state is **honest**; empties are **calm and dignified**.

- **Primary actions:** **Keep** (to Home, private) · **Share** (to the open web) · **Update**
  (re-send an edited copy) · **Retract** (unshare a copy) · **Delete** (remove the original).
  Never "Post," never "Publish," never "Submit."
- **Placeholders:** Thought — *"Say something to your people…"* · Article title — *"Give it a
  title"* · Event where — *"Add a place or a link."*
- **Distribution honesty:** *"Shares to the open web."* · *"This stays at your home until you
  choose to share it."*
- **Empty Home (owned):** *"Nothing here yet — this is where the things you make will live,
  shared or not. All of it yours."* (Never *"Create your first post!"*.)
- **Divergence:** *"Your home copy is newer than what's shared."*
- **Retract honesty:** *"We'll request its removal, but cached copies elsewhere may remain."*

Voice: calm, plain, human. No performance pressure, no predicted reach, no "post more to stay
relevant," no vanity scaffolding ([compose.md](../01-product/compose.md)).

---

## 10. Content notes & sensitive media (authoring)

Some pieces need a gentle threshold before them — a spoiler for a plot, a heads-up before a hard
subject, a warning ahead of an intense image. Tacet gives the maker that care without borrowing
platform jargon: **human words only, never "CW" or "spoiler."**

- **Add a content note** — a quiet toggle in the composer body (off by default). Switching it on
  reveals a short summary field at `--text-body-sm`, placeholder *"What should people know first?"*.
  The note is what a reader sees *before* the piece opens — a courtesy, not a lock. Use it for
  spoilers, heavy topics, or anything a person might want to choose into. Keep it one calm line;
  it is a threshold, not an essay.
- **Mark sensitive** — a per-image toggle sitting on each attachment in the media well
  (`aria-label` "Mark this image sensitive"). When on, that image opens softened behind a calm
  reveal, so a reader taps to see it rather than meeting it unprepared. This is per-image, not
  per-piece: one photo in a set can be marked while the rest stay open.

Both are the maker's care made visible, never a punishment and never a compliance checkbox. Copy
stays warm: *"A content note lets people choose when they're ready."* Neither is required; both are
offered plainly. (L9 — human acts, not protocol nouns.)

---

## 11. Alt text (authoring)

Every image in the composer carries an **alt-text field** directly beneath it (`--text-body-sm`,
placeholder *"Describe this image for people who can't see it."*). Alt text is how a photo reaches
someone using a screen reader — without it, the image is simply absent for them (L10; the floor,
not a tier).

- **Encouraged always, required on Share.** Going public (**Share**) means reaching people you'll
  never meet, so alt is **required** before a copy goes to the open web. Keeping something private
  (**Keep**) is for you and yours, so alt stays **optional** there — offered, never forced.
- **Prefill when re-sharing.** When you re-share someone else's moment, we carry their alt text in
  so the description isn't lost. You can refine it; you never start from blank.
- **Nudge, don't shame.** Missing alt on **Share** raises a calm, specific prompt —
  *"Add a short description so everyone can see this?"* — with a clear way to add it and an honest
  way to continue. It is a courtesy reminder at `--color-text-secondary`, never a red error, never
  a scold. On **Keep**, silence: an optional thing left undone is not a problem.

The rule, made visible: *describe your images for everyone; we insist only when you go public,
and even then we ask kindly.*

---

## 12. Scheduled publishing

The distribution control's **Scheduled** state (see §3) opens a calm **when-picker** — a date and a
time, nothing more. It is the same deliberate act as **Share**, only aimed at a later moment.

- The picker is plain and unhurried: a date, a time, your timezone stated in words. No urgency,
  no "posts perform best at…" nudging (L2 — no engagement scaffolding).
- A scheduled piece appears in **Home (Me)** with a quiet **"Scheduled for <date>"** line at
  `--text-meta` (mono) — a statement of state, not a **countdown-urgency widget**. It sits calmly
  beside your other work, never ticking, never pressuring.
- It is **editable and cancellable before it sends.** You can move the time, change the piece, or
  cancel the sending entirely; cancelling returns it to Private (kept at home), because the work was
  always complete on its own.

Scheduling changes *nothing* about creation. The piece was finished the moment you made it
([ADR-004](../06-decisions/ADR-004-publishing-is-distribution.md)); scheduling only queues the
**distribution** for later. Creation is still complete-in-itself; the calendar touches only where
and when a copy goes out.

---

## 13. Export — taking your world with you

The honest door out lives in **Settings**, reached calmly and never buried: **Export — take your
world with you.** Because your identity, your content, and your connections are *yours*, leaving is
a right, not a negotiation ([ADR-001](../06-decisions/ADR-001-identity-before-platform.md),
[ADR-002](../06-decisions/ADR-002-home-is-the-source-of-truth.md)).

- **What it packages, said plainly:** *"Your identity, everything you've made, and everyone you're
  connected to — packaged so you can take it anywhere."* Identity + owned content (every Thought,
  Photo, Article, Video, Event) + your connections, in a portable form.
- **No friction, no confirm-shaming.** There is no "are you sure you want to leave us?", no guilt
  step, no reach-loss warning, no cooling-off delay. One calm **Export** verb. Leaving well is part
  of the product working (design principle 5; L2).
- **A warm success state, not a farewell.** When the package is ready:
  *"Your world is yours — packaged and ready."* `--color-positive`, the same quiet signal that means
  *kept, safe, yours* elsewhere (§7). The tone is generous: this is your world leaving whole, not a
  door slammed.

Export is the proof, made real, that Tacet holds your world *for* you and never *over* you. If the
way out is honest and easy, the way in was never a trap.

---

## 14. One-handed publishing (mobile)

On a phone, the two controls that *complete* the core task — **the visibility control** and **the
primary verb** — must both fall inside the thumb's arc and must never hide beneath the keyboard.

- The composer docks a **keyboard-riding action bar**: a slim bar pinned directly *above* the
  on-screen keyboard, rising and falling with it so it is always visible while you type. It holds the
  **Visibility control** (Private · Shared · Scheduled) and the **primary verb** — **Keep** when the
  piece is private, **Share** when it is shared (see §3 and §15). These are the resting-thumb
  controls.
- The **header button becomes a secondary echo** — still present at the trailing edge for people who
  reach up or navigate by keyboard, but no longer the only way to finish. The action bar is the
  primary path on phone.
- This means completing the task — choosing where it goes and sending it — is a one-handed act, and
  the moment of choosing to Share is never obscured by the very keyboard you used to write it.

The chassis is unchanged; only the *reach* is optimised for the phone. See
[responsive.md](./responsive.md) for tier behaviour and the mobile compose sheet.

---

## 15. Keep vs Share — the private/public verb (compose)

The compose primary action names exactly what it does, and it *changes with the piece's state*:

- When the piece is **Private**, the primary verb is **Keep** — *"Keep to your home."* Keeping is
  finishing something and holding it safe with you; it is complete work, not a draft, not a
  staging step ([ADR-004](../06-decisions/ADR-004-publishing-is-distribution.md)).
- When the piece is **Shared**, the primary verb is **Share** — sharing *your own* content
  publishes it to the open web. (Re-sharing *someone else's* moment is a different act, handled
  elsewhere; it never appears here as the compose verb.)

**"Save" is not used in compose.** Save belongs only to keeping *others'* moments elsewhere (the
spark/keep signal, §7). In your own composer the words are **Keep** (private) and **Share**
(public) — and never *draft*, never *post*.

### The read-only honesty gate

Interactive publish — a live **Share** that sends a copy to the open web — is the target state.
Until write-federation ships, **Share tells the truth instead of failing silently.** It is never a
dead button that pretends to work and quietly drops the piece.

- The **Keep** path is fully live now: private work is made and held at Home today, no gate.
- The **Share** path, while write-federation is pending, presents a calm **"not yet — coming"**
  state: the piece is kept safely at Home, and the UI says plainly *"Sharing to the open web is
  coming soon — this is kept safe at your home until then."* at `--text-body-sm`,
  `--color-text-secondary`. No spinner that never resolves, no success animation for a thing that
  didn't happen, no lost work.

The gate is honesty, not friction: we would rather say *"not yet"* warmly than let a **Share** look
done when it isn't. (Design principle 5; L9.)

---

## 16. Do / Don't

**Do**
- Begin with **intent** (Thought/Photo/Article/Video/Event), never destination.
- Keep creation and distribution visibly separate — **Keep** (private) ≠ **Share** (public).
- Require alt on **Share**, keep it optional on **Keep**, and prefill it when re-sharing.
- Say **"not yet — coming"** honestly for Share until write-federation ships; never a dead button.
- Keep the visibility control and primary verb in the **thumb arc** on phone (keyboard-riding bar).
- Make **Export** a warm, frictionless door out — *"Your world is yours."*
- Show private work as **complete and dignified**, marked *Private*, never *draft*.
- Make **who authors it** always visible; switch workspace, never re-login.
- Word Retract and Delete as **two distinct, honest actions** with plain consequences.
- Tell the truth about the open web: retraction **requested, not guaranteed**; representation is
  **faithful**, never lossy-framed.
- Spend existing tokens by name; let one accent mark the one primary action (L3).

**Don't**
- Don't collapse making and sharing into one button.
- Don't nudge audience wider, predict reach, or surface counts — no vanity scaffolding (L2, L6).
- Don't use a glowing orb / pulsing badge for Compose — one calm affordance only.
- Don't confirm-shame, and don't hide destructive truth in fine print — including at Export.
- Don't let owned and kept blur, or let kept content be publishable as if yours.
- Don't shame missing alt; nudge kindly, and only on Share.
- Don't turn **Scheduled** into a ticking countdown or an urgency widget.
- Don't say **"Save"** or **"draft"** in compose — the verbs are **Keep** and **Share**.

### Never surface these words
**Entry · post · server · instance · federation · protocol · ActivityPub · draft · degrade.**
The UI speaks only human acts and human kinds (L9): *Thought, Photo, Article, Video, Event* and
*Save, Share, Update, Retract, Delete, Follow, Reply.* Protocol stays invisible; the adapter
speaks it, the person never does.

---

*See also: [publishing-philosophy](../09-product/publishing-philosophy.md) (the constitution),
[tokens.md](./tokens.md) (canonical), [motion.md](./motion.md), [design-principles.md](./design-principles.md),
[accessibility.md](./accessibility.md), and [compose.md](../01-product/compose.md).*
