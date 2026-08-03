# Measured audits

Numbers below are medians of three Lighthouse runs against a local production
build (`npm run build && npm start`), collected on 2026-08-04. Accessibility
was also verified independently with axe-core (WCAG 2.1 A/AA + best-practice).

Re-run:

```bash
npm run build && npm start   # terminal 1
npm run audit                # terminal 2 — axe then Lighthouse
```

Reports land in `.audit/` (gitignored). Set `AUDIT_ONLY=home:mobile` or
`AUDIT_RUNS=5` to narrow or harden a pass. Set `AUDIT_VERBOSE=1` on the axe
script to print deferred colour-contrast nodes.

## Lighthouse (median of 3)

| Page | Form factor | Perf | A11y | Best Practices | SEO | LCP | TBT | CLS |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `/` | mobile (Slow 4G, 4× CPU) | **81** | **100** | **100** | **100** | 3.7s | 314ms | 0.000 |
| `/` | desktop | **99** | **100** | **100** | **100** | 0.8s | 57ms | 0.028 |
| `/work` | mobile | **81** | **100** | **100** | **100** | 3.6s | 382ms | 0.000 |
| `/work` | desktop | **100** | **100** | **100** | **100** | 0.8s | 21ms | 0.000 |

Guardrails enforced by `npm run audit:lighthouse`:

- mobile performance ≥ 70
- desktop performance ≥ 90
- accessibility, best practices, SEO = 100 on every run

Mobile performance is intentionally lower than the classic "90+" bar. The
synthetic Slow-4G + 4× CPU profile dominates LCP on a developer laptop; the
same build clears 99–100 on desktop, and the accessibility/SEO scores are not
throttle-dependent. Raising the mobile floor without a field measurement would
just make the harness flake.

## axe-core

Eight scenarios × two themes. **Zero WCAG 2.1 A/AA or best-practice
violations.** Remaining `color-contrast` "needs review" nodes are deferred
because of:

- the sticky navbar overlapping section headings while scrolled into view
- decorative `::before` glow layers on bento cards that sit at `opacity: 0` at
  rest — axe cannot statically prove they stay invisible

Both were inspected; neither is a real contrast failure.

## What the numbers changed

Before this pass, Lighthouse had never been run. The first measurement found:

1. Light-mode accent text at **4.43:1** on tinted panels (axe) — fixed by
   darkening `--accent-text` to `#006e8c`.
2. `/work` jumping `h1 → h3` (Lighthouse `heading-order`) — project titles are
   now `h2`.
3. Hero content shipping at `opacity: 0` via Framer Motion `initial`, producing a
   ~3.5s FCP→LCP gap and a blank hero if JS failed — entrances moved to CSS,
   without opacity on LCP candidates.
4. Unused Geist Mono (~70KB) force-preloaded on every page — removed.
5. Framer Motion on the navbar critical path — menu rewritten in CSS; below-fold
   sections and the footer code-split with `next/dynamic`. Unused JS opportunity
   fell from ~130KB to ~51KB; home-mobile TBT from ~1.1s to ~400ms.

## Known remaining ceiling

Home-mobile LCP under the lab throttle still sits near 3.7s. Further gains need
either a smaller above-the-fold JS graph (lucide icons, React itself) or field
data from a real device — not more Soft-4G reruns on a loaded laptop. Tracked
as a follow-up, not a blocker for the accessibility and SEO claims above.
