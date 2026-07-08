# Conversation System — Visual System V2

> **Milestone:** Visual System V2 · **Stage:** 2 · References [tokens.md](./tokens.md).

**Purpose.** Define how Tacet renders *correspondence* — direct messages, replies, and mentions —
as a calm surface you attend to on your terms. This doc covers the Conversations **list**, the
Conversation **reader** (thread), inline **compose**, the **context column**, and every empty and
loading state. It answers *why* before *how*: Conversations is a well-kept inbox of human contact,
never a notifications centre. See the product doctrine in
[conversations.md](../01-product/conversations.md).

---

## 1. Philosophy — correspondence, not notifications

Conversations holds the things that are genuinely *for you*: someone wrote to you, replied to you,
or mentioned you. It is directed contact between people — closer to letters than to alerts. It
attends to you when you choose to attend to it; it never chases.

**Doctrine — presence is a quiet dot, never a red count.** The one signal we allow for "there is new
correspondence" is a **quiet dot** — small, warm, `--color-accent` (or `--color-positive` for the
subtlest treatment). It is *never* a number, *never* red, *never* pulsing (L6). A red badge with a
count is the most manipulative object in modern social software; it does not exist in Tacet.

Everything here is **grouped, intentional, and never addictive.** We reject the reference apps'
"Activity" tab with its running tallies of likes and follows — vanity pings are retired legacy
(L9). If a design only works because it manufactured an itch, it does not ship (Principle 5).

---

## 2. The Conversations list

A single reading column (`--feed-measure`, 42rem) of **correspondence rows** — one per person or
thread, most-recent first. No card borders per row (L1); rows are separated by `--color-hairline`
hairlines and generous rhythm.

**Row anatomy** (touch target ≥ 44px, achieved with padding — §7 responsive):

- **Face** — `Avatar` at ~46px, `--radius-full`. People over content chrome (Principle 2).
- **Name + handle** — name in `--text-subheading` (weight 500, `--color-text-primary`); handle in
  `--text-meta` mono, `--color-text-secondary`. Name leads; handle supports.
- **Latest line** — a one-line preview of the most recent turn in `--text-body-sm`,
  `--color-text-secondary`, truncated with ellipsis. It is the voice, quietly.
- **Timestamp** — a calm relative time ("2h", "yesterday") in `--text-meta`, **mono**,
  `--color-text-tertiary`. Right-aligned, unhurried. Never a live-ticking counter.
- **Unread indicator** — a **quiet dot** (`--space-2`, `--color-accent`) *or* a weight shift (name to
  weight 500 + `--color-text-primary` on the preview line). **Never a red number.** One treatment,
  applied consistently — not both dot and weight shouting at once.

Read rows relax: preview returns to `--color-text-secondary`, dot disappears. The list quietly
settles rather than rewarding you for clearing it.

**Filter row — a `SegmentedControl`** (see components.md) sits below the screen title:

```
[  All  ·  Mentions  ·  Replies  ·  Messages  ]
```

Four calm segments, `--text-label`, active segment on `--color-surface-raised` with
`--color-text-primary`; inactive `--color-text-secondary`. Switching is a `--dur-2` cross-fade
(motion.md), never a slide that implies "more urgent stuff over there." The filter narrows *what
you read*, it does not surface counts per tab.

---

## 3. The Conversation reader (thread)

Opening a conversation reads a threaded exchange from the open web — the moment it hangs off,
the turns, and who said what. It must feel like a **thoughtful discussion**, not a chat log. We err
hard toward reading comfort.

**Turn style — reading blocks, not chat bubbles.** Each turn is a calm block, not a tight
right/left messaging bubble. Bubbles imply density and speed; blocks imply correspondence.

- Turn body in `--text-body` with `--leading-relaxed` (1.60) — the sacred reading line-height.
- **`--space-5` (24px) between turns** so the thread breathes and never stacks like a chat log.
- Each turn opens with a small **attribution line**: face (~30px), name (`--text-subheading`),
  handle (`--text-meta` mono, secondary), and a relative timestamp (`--text-meta` mono, tertiary).
  This answers *who said what, when* without chrome.
- Nested replies indent modestly (one step, hairline guide in `--color-hairline`), not the deep
  chat-thread staircase. Long branches reveal progressively ("Show N more replies") so nothing
  overwhelms — carry the V1 pattern forward.

**The source moment.** The thread's opening context — the post or message it hangs off — sits at the
top, gently distinguished ("How it started" → the moment → the turns beneath). It uses the same
editorial media treatment as everywhere (L5): consistent radius, one scrim, blur-up loading. No
autoplay.

Reading comfort is the whole job. If a turn reads like a text message, it is styled wrong.

---

## 4. Replies to people elsewhere on the open web

Because Tacet lives on the open web, replying to a friend on another home works exactly like
replying to a friend here — and the UI never leaks protocol (L9).

- The compose affordance always reads **"Reply"** — never "reply via ActivityPub," never a server
  handle, never "federated reply."
- A person from another home is shown as a **person**: face, name, and their handle presented as a
  human address (their place shown as a *place*, not a server string).
- Human framing, verbatim doctrine: *"Reply to a friend on Mastodon the same way you'd reply to a
  friend here."* Same gesture, same calm, same words. The protocol is plumbing; the person never
  sees the pipes.

We speak Reply / Message / Mention (L9). We never say instance, server, federation, or *Entry*.

---

## 5. The context column (wide canvas, ≥ `--bp-xl`)

Per the [Context Column Law](./responsive.md#3-the-context-column-is-a-law-not-a-slot), on a
Conversation the right column shows **the participants and the moment the thread is about** — and
nothing else. Its only job is to help you keep the thread's context in view while you read.

- **Participants** — a quiet cluster of the people in this exchange (avatars, `--overlap-avatar`
  stacking for the overflow), each a link to that person. "N people in this conversation" in
  `--text-meta`, as private context, not a scoreboard.
- **The source moment** — a compact reference to the post the thread hangs off, so you never lose
  what it's all about while scrolling deep replies.

It is **never a dashboard** (L7): no reply counts as trophies, no "activity," no trending, no
federation status. Below `--bp-xl` the participants fold into the top of the thread (as in V1) and
the column simply isn't shown. Nothing *lives* only here.

---

## 6. Composing a reply

Calm, inline, honest.

- **Inline compose** appears at the foot of the thread (or in a `--radius-xl` composer sheet on
  phone) — `--text-body`, `--leading-relaxed`, a single calm **Reply** action in `--color-accent`
  (one accent, one action — L3). No formatting circus, no urgency.
- **Distribution honesty.** A reply goes out to the open web, so we say so — faithfully and once, in
  `--text-meta`, `--color-text-secondary`: e.g. *"This reply is public — it goes out to the open
  web."* Represented truthfully, never buried, never alarmist (Principle 5). Where a reply is a
  private message instead, that too is stated plainly.
- No autoplay of any attached media. No countdown, no "send now" pressure, no send-and-earn
  animation. Sending is acknowledged with the same quiet `--color-positive` confirmation used for
  save — a warm nod, not a reward.

---

## 7. Empty & loading states

Reference [motion.md](./motion.md) and the `EmptyState` component (components.md).

**Empty — a welcome, not a trophy.** When there is nothing new, the screen states it as a calm,
welcoming fact:

> **No new correspondence**
> When someone writes to you, replies, or mentions you, it'll wait for you here — quietly.

`EmptyState` with the conversations icon, `--text-heading` title, `--text-body-sm`
`--color-text-secondary` body. We **never** say "You're all caught up!" or show a zero-badge — that
is gamified relief engineered to make emptiness feel like an achievement. Emptiness here is simply
the resting, healthy state (Principle 5).

**Loading.** A calm **skeleton** of a few row/turn placeholders with the slow, non-looping shimmer
(`--dur-4`, `--ease-in-out`) — it reads as *breathing*, not *spinning*, and is removed the instant
real content arrives. Avatars and media **blur-up** (`--dur-4`, `--ease-out`, opacity only). No
spinner theatre, no parallax. Motion is `prefers-reduced-motion`-complete (L4).

---

## 8. Metrics as context, never rewards

Any number in Conversations is **private context for you**, never a public tally (L7,
[responsive.md §3](./responsive.md)).

- "3 unread" may inform *you* about *your own* attention — quietly, in `--text-meta` — and never as a
  red badge or a growth-tracking streak.
- Participant counts ("N people in this conversation") describe the thread, not your performance.
- There are **no** like counts, reply-race tallies, or "N people are talking about this" here.
  Engagement furniture does not exist (Principle 2).

If a count would make you feel watched or behind, it does not ship.

---

## 9. Do's and don'ts

**Do**
- Present the person first: face, name, then handle (Principle 2).
- Use a **quiet dot** or weight shift for unread — one treatment, `--color-accent`/`--color-positive`.
- Give thread turns `--leading-relaxed` and `--space-5` between them; read like correspondence.
- Speak human words: Reply, Message, Mention (L9).
- State distribution honestly and once; let empties simply *be* empty.
- Keep the context column to participants + the source moment, or empty.

**Don't**
- No red badges, no count numbers as urgency, no pulsing presence (L6).
- No chat-app bubble density; no right/left message tails; no live-ticking timestamps.
- No "You're all caught up!", no streaks, no zero-inbox trophy.
- No protocol words: instance, server, federation, *Entry* (L9).
- No autoplay, no send-to-earn animation, no urgency copy.
- No context-column dashboard: no trending, no tallies, no activity board (L7).

---

*The test (from [conversations.md](../01-product/conversations.md)): if opening this surface lowers
your shoulders instead of raising them, it's doing its job.*
