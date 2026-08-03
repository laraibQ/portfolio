# ADR 0002 — CSS-variable design tokens over per-utility `dark:` variants

- **Status:** Accepted
- **Date:** 2026-08-03
- **Supersedes:** the original hardcoded white-alpha approach

## Context

The first implementation styled everything for the dark theme with literal
utilities: `border-white/10`, `bg-white/5`, `text-neutral-400`. There were
roughly seventy such usages and exactly one `dark:` variant in the whole
component tree.

The theme toggle worked, but light mode was effectively broken:

- White-alpha borders and panels are invisible on a white background, so every
  card, chip and divider disappeared.
- `text-neutral-400` (`#a3a3a3`) on white measures 2.3:1, failing WCAG AA for
  body text (4.5:1 required).
- The brand cyan `#00BDF1` measures 2.1:1 on white, so every eyebrow label and
  accent link also failed.

Options considered:

1. Add a `dark:` variant beside every colour utility.
2. Define semantic tokens as CSS variables that flip with the theme.

## Decision

Option 2. `app/globals.css` declares semantic tokens once per theme —
`--muted`, `--subtle`, `--line`, `--line-strong`, `--hairline`, `--panel`,
`--panel-strong`, `--accent-text` — exposed to Tailwind via `@theme inline`.
Components use `text-muted`, `border-line`, `bg-panel` and never name a raw
colour.

`--accent-text` is deliberately separate from `--accent`: fills and glows keep
the vivid `#00BDF1`, while accent *text* darkens to `#00789A` in light mode to
reach 5.1:1.

## Rationale

- One place to audit contrast, instead of ~140 utilities to keep in sync.
- Halves the class-string length at every call site and removes the entire
  category of "forgot the `dark:` variant" bugs.
- Tokens are self-documenting: `border-line` states intent, `border-white/10`
  states an implementation detail that is wrong in half of all cases.

## Consequences

- Contributors must add a token rather than reach for a Tailwind palette
  colour. The grep guard for this is
  `rg "white/\d|text-neutral-\d" -g "*.tsx"`, which should return nothing.
- Token values are the single point of failure for contrast; they are annotated
  in `globals.css` with their measured ratios.
