# Person Cards

**People before posts.** In Tacet a person is not a byline attached to content — a
person is a first-class object with its own card. The person card is one of the two most
important components in the system (the other being the [content card](content-cards.md)).

It answers, calmly: *Who is this, where do they live on the open web, and what is my
relationship with them?* It never reduces a person to a scoreboard.

## Anatomy

```
┌───────────────────────────────────────────────┐  ← --radius-lg
│  (avatar)   Ada Lovelace              [Follow] │
│   round     @ada@tacet.social                  │
│             on tacet.social · following you    │
│                                                 │
│  Mathematician. Notes on machines and music.    │
└───────────────────────────────────────────────┘
```

- **Avatar** — circular (`--radius-full`), warm. People are round. Size `lg 64` on the
  card, `md 44` in dense lists.
- **Display name** — `--text-subheading` (17px / 500), `--color-text-primary`. The name
  is the loudest thing; it is the person.
- **Handle** — `--text-meta` mono, `--color-text-tertiary`: `@ada@tacet.social`. Shown
  in full so the open-web address is legible and honest, but quiet — it sits beneath the
  name, never competing.
- **Home line** — where they live: `on tacet.social`, or the federated server for a
  remote person. Federation reads like email — you see the address, the protocol stays
  invisible. If they follow you, a quiet `following you` sits here too.
- **Relationship control** — a Follow / Following button (see below).
- **Bio** — one to three lines, `--text-body-sm`, optional. Truncates gracefully.

## Relationship state

The one interactive commitment on the card. A pill button (`--radius-full`):

| State | Treatment | Meaning |
|---|---|---|
| Not following | **Follow** — primary, `--color-accent` | You can follow. |
| Following | **Following** — secondary (hairline), check icon | You follow; hover reveals "Unfollow". |
| Follows you | quiet `following you` label in the home line | Mutual context, stated calmly. |
| Requested | **Requested** — tertiary, disabled-look | Awaiting approval. |

Relationship is about connection, not scores — see the no-vanity rule below.

## No vanity counts

The person card **never** shows follower counts, following counts, post counts, or any
public tally. Identity and relationship before engagement. A person is worth knowing
because of who they are and how you're connected — not a number that invites comparison
or performance. (Relationships before engagement; calm before addiction.)

## Variants

| Variant | Use |
|---|---|
| **Full** | Profile header and the People destination. Avatar `lg`, bio shown. |
| **Row** | Lists (search results, following, mentions). Avatar `md`, name + handle + Follow, no bio. |
| **Inline** | Attribution on a [content card](content-cards.md): small avatar + name + handle. |
| **Federated** | Remote person: same anatomy, home-server line makes origin honest; an optional quiet source chip. |

## Rules

- The name is primary, the handle is quiet, the number is absent.
- Relationship state is always clear and calm; changing it is a soft, immediate action
  (see [buttons](buttons.md), [motion HIG](../02-human-interface-guidelines/motion.md)).
- Whole-card tap opens the profile; the Follow control is a separate target within it.
- Real semantic markup, accessible names on avatar and controls
  ([accessibility HIG](../02-human-interface-guidelines/accessibility.md)).
- Built on the base [card](cards.md) with foundation
  [color](color-tokens.md)/[type](typography-scale.md)/[spacing](spacing-scale.md) tokens.
