# Information Architecture — Visual System V2, Stage 3

> **Milestone:** Visual System V2 · **Stage:** 3 · **Status:** Complete — gates the wireframes.
> The canonical IA is [`../01-product/information-architecture.md`](../01-product/information-architecture.md)
> and it is **frozen** (five pillars). This doc does not re-architect it. It *confirms* the spine,
> maps **every** surface to where it lives, defines the [three-column canvas](./responsive.md) per
> pillar, and pressure-tests the placements that aren't obvious — challenging assumptions where the
> brief asked me to. Where this doc and the canonical IA ever disagree, the canonical IA wins.

---

## 1. The spine (frozen)

```
Today          — the calm entry point
People         — the relationship layer
Discover       — the gateway to the wider open social web
Conversations  — correspondence, not notifications
Me             — your identity and your own place
```

Five surfaces. Everything else *supports* these; nothing else joins the spine. The feed is a
*component inside* surfaces, never the organizing idea. Compose is global, not a pillar.

---

## 2. Complete surface map

Every screen Tacet has, and where it hangs. Nothing floats; nothing duplicates.

| Surface | Lives under | Reached by | Notes |
|---|---|---|---|
| **Today** | pillar | rail/tab | Bounded digest; ends |
| **People** | pillar | rail/tab | Relationships as objects |
| **Discover** | pillar | rail/tab | Human recommendation |
| **Conversations** | pillar | rail/tab | Correspondence |
| **Me (Home)** | pillar | rail/tab | Your owned place |
| Remote Profile | People / any avatar | tap a person anywhere | Someone who lives elsewhere |
| Public Profile (yours) | Me → "View as public" | deliberate | What others see of you |
| Conversation (thread reader) | Conversations / a moment | tap a thread or "reply" | The exchange |
| **Compose** (+ 5 kinds) | global | FAB / rail button | Intent-first; sheet/modal, not a page |
| Saved | Me | Me tab / context | Kept moments (owned vs kept) |
| Collections | Me | Me tab / context | Grouped keeps |
| Reading Later | Me | Me tab / context | Kept articles/long-form |
| Recently Viewed | Me + context column | Me tab / "continue" | Mostly a *context* aid, see §5 |
| Pinned | Me / a profile | inline | A profile's pinned moment |
| Search | global | top bar / rail (⌘K) | Overlay, not a pillar, see §4 |
| Settings | Me | Me → Settings | Account, privacy, portability, appearance |
| Identity editing | Me → Settings / Me header | deliberate | Name, handle, avatar, bio, banner |
| Workspace switcher | rail bottom / Me | deliberate | Personal vs business; see §6 |
| Onboarding / First run | pre-app | first visit | Create identity, bring your world |
| Media viewer | any media | tap media | Full-bleed overlay |
| Communities | supports People/Today | Discover / People | Demoted successor to "rooms"; never a pillar |
| Empty / Loading / Error / 404 | every surface | state | Systematic, not per-screen |

---

## 3. The three-column canvas per pillar

The [Context Column Law](./responsive.md#3-the-context-column-is-a-law-your-world-never-your-score):
the right column is a **living contextual space** that helps you **understand and move through your
world** — governed by the **informing vs. manipulating** test, not by emptiness
([ADR-012](../11-decisions/ADR-012-the-context-column-law.md)). Here is what each pillar may put in
each column at the wide tier (≥1200px). Below that tier, the content folds into the main flow or
disappears — nothing *lives* only there.

| Pillar | Rail | Feed (centre, fixed reading measure) | Context column (world-directed; informing, never a score) |
|---|---|---|---|
| **Today** | nav | The bounded digest of moments | *Continue where you left off*; *people close to you* who are around; a calm *worth exploring* door; represented momentum from your world (a conversation/piece, framed — never a tally). Rests quietly if genuinely nothing applies. |
| **People** | nav | Your people (list, faces-first) | The person under focus: quick card + *people you both know*; who's recently around. |
| **Discover** | nav | Human recommendations, communities | *About the place you're exploring* — a community's purpose in one sentence, a few people there, communities active today. |
| **Conversations** | nav | Thread list, or the open thread | *The thread's participants + the moment it hangs off* — so context stays in view while reading. |
| **Me** | nav | Your home: owned + kept content | *Your private self-context* — drafts/saved counts (for you, never a public score), identity/workspace switch. |
| **Remote Profile** | nav | Their posts/media | *About this person* — bio, where they live (a human place), people you both follow. |

This is the discipline that stops the wide canvas from becoming the reference mockups' *manipulative*
sidebar — vanity tallies about you, a ranked leaderboard, a live "federation status" ticker — while
still letting it **make the open social web feel alive.** The enemy is the score, not the world. When
a screen genuinely has nothing to add, the column rests quietly rather than inventing filler.

---

## 4. Assumption challenged: **Search is an overlay, not a pillar**

The brief lists "Search" as a screen and product-ux-pass wants it to search people, posts,
collections, saved, notes. But Search is a *verb you invoke*, not a *place you dwell*. Making it a
sixth destination would violate "calm, not feature-rich" and unbalance the five-pillar spine.

**Decision:** Search is a **global overlay** (⌘K on desktop, the magnifier in the top bar on mobile)
that opens over any surface, returns grouped results (People · Moments · Collections · Saved ·
Notes), and closes cleanly. It is scoped and calm — you can search *within* Discover (find people on
the open web) or *within* Me (find your keeps) — but it never becomes a screen you doomscroll.

---

## 5. Assumption challenged: **"Notifications" is not a thing Tacet has**

The brief's Stage-4 list includes "Notifications." Tacet's doctrine is explicit: **there is no
notification center** — that model is the anxiety machine V2 exists to refuse. The reference mockups'
"Activity" tab with counts is exactly what we reject.

**Decision:** "What's new for you" resolves into **Conversations** (things genuinely *for* you —
replies, mentions, messages — arrive as correspondence) plus a **quiet presence signal** (a dot or
weight change beside the Conversations pillar; never a red number). There is **no Notifications
screen** to wireframe. Instead we wireframe the *presence signal* and the *Conversations list* that
absorb its job. This is a deliberate, doctrine-driven deletion, and it is the calmer product.

---

## 6. Assumption challenged: **Recently Viewed is mostly context, not a screen**

Recently Viewed could be a full Me sub-screen, but its real job is *continuity* — "take me back to
what I was doing." That is precisely the [context column's](./responsive.md) purpose on Today.

**Decision:** Recently Viewed exists as (a) the "continue where you left off" content in the Today
context column, and (b) a modest list in Me for when you want the full history. It is not a
top-level destination and does not get nav weight. We wireframe both expressions.

---

## 7. Depth & disclosure rules (keep the hub shallow)

The IA is a **calm hub, not a scrolling column**. To keep it shallow:

1. **Sheets/overlays over pages** for transient tasks (Compose, Search, Media viewer, quick actions).
   A task you finish and dismiss should not be a place you navigate to and back from.
2. **Two-tap reach** to anything important: pillar → surface, or avatar → profile. Nothing critical
   is buried three levels deep.
3. **Compose is always one gesture away, never in your face** — FAB (mobile) / rail button (desktop),
   a calm affordance, never the glowing orb.
4. **Me holds the "your stuff" cluster** (Saved, Collections, Reading Later, Recently Viewed, Pinned,
   Settings, Identity, Workspaces) so the other four pillars stay about *the world and your people*,
   not about managing your account.
5. **Communities stay demoted** — reachable through Discover/People, never a pillar, never competing
   with the relationship layer.

---

## 8. Canonical flows (for the wireframes)

Text flows the Stage-4 wireframes must satisfy. Each is calm, shallow, and reversible.

- **First run:** Landing → "Welcome home" → create identity (`@you@tacet.social`) → *bring your
  world* (search a name / paste an address) → land on Today. *(≤ 4 steps to a populated Today.)*
- **Compose & share:** Compose affordance → choose intent (Thought/Photo/Article/Video/Event) →
  make it → choose distribution (private ↔ shared ↔ scheduled) + workspace author → done. *Creation
  is complete even if never shared.*
- **Follow someone on the open web:** tap a person anywhere → Remote Profile → Follow → they appear
  in People. *Protocol never named.*
- **Read correspondence:** presence dot → Conversations → open thread → reply inline. *No red count.*
- **Keep something:** Save on a moment (positive/spark acknowledgement) → optionally add to a
  Collection or Reading Later → find it later in Me or via Search.
- **Switch workspace:** rail/Me switcher → pick Personal or a business (e.g. VNTA) → same app, new
  author. *Like switching Notion workspaces, not logging out.*
- **Leave:** Me → Settings → Export/Portability → your identity and people come with you. *Easy door.*

---

## 9. IA verdict

The five-pillar spine is correct and needs no re-architecture — Stage 3 confirms it. The V2 work was
placement discipline: **Search and Compose are overlays, "Notifications" is deliberately absent,
Recently Viewed is mostly context, the Me pillar absorbs the "your stuff" cluster, and the context
column is bound by law to the current task.** With this map fixed, the wireframes have exactly one
home for every screen and no orphan surfaces.

**Stage gate:** proceed to Stage 4 — low-fidelity grey wireframes for every surface in §2, at the
responsive tiers in [responsive.md](./responsive.md), satisfying the flows in §8.
