# Test plan

Last run: 2026-08-03 — **73 tests across 7 files, all passing.**

The distinction between automated and manual below is deliberate: anything
listed under "manual" is *not* covered by the suite and must not be reported as
tested unless it has actually been walked through.

## Running

```bash
npm run test        # single run, what CI executes
npm run test:watch  # watch mode
npm run verify      # lint → typecheck → test → build
```

Environment: Vitest 4 + jsdom + React Testing Library. `tests/setup.ts` stubs
`matchMedia` and `IntersectionObserver`, which jsdom lacks and which
Framer Motion requires.

## Automated coverage

### `tests/contact-validation.test.ts` — validation rules
Happy path; whitespace trimming; all-fields-empty reported together; five
malformed email shapes; below-minimum name; values exactly on the length
boundaries; values one character past them; below-minimum message; five
non-object inputs; non-string field types rejected rather than coerced; mailto
URL encoding of `&`, newlines and `?`; neutral subject when no name.

### `tests/rate-limit.test.ts` — abuse control
Allowance up to the limit with correct remaining budget; the request that
exceeds it is blocked; keys counted independently; reset after the window
elapses; **still blocked 1ms before the window closes**; retry-after rounds up
to whole seconds and never to zero. Uses an injected clock, so no `setTimeout`
and no flake.

### `tests/contact-route.test.ts` — endpoint behaviour
Malformed JSON → `400`; invalid payload → `400` with per-field errors; honeypot
submission → `200` with no delivery attempted; unconfigured environment →
`503`; configured environment delivers once with correct `reply_to` and body;
provider non-2xx → `502`; provider timeout/throw → `502`; sixth request from one
IP → `429` with `Retry-After`; limits scoped per IP; **logs contain no submitted
name, email or message**. Each test re-imports the module so the in-memory
limiter cannot leak between tests.

### `tests/contact-form.test.tsx` — form UX
Empty submit shows three specific inline errors and makes no network call;
invalid fields carry `aria-invalid`; an error clears as soon as that field is
edited; malformed email is caught client-side before any request; a valid submit
posts exactly once to `/api/contact` and confirms; fields reset after success;
`503` and network rejection each surface a prefilled mailto fallback;
server-returned field errors are displayed; the button disables in flight and a
second click cannot double-submit; the honeypot input exists and is removed from
the tab order.

### `tests/theme.test.ts` — theming
Active theme read from the document, not storage; `dark` class and
`color-scheme` both toggled; choice persisted; **theme still switches when
`localStorage` throws**; toggle round-trips; stored choice outranks the system
preference; system preference used when nothing is stored; dark is the default;
corrupted stored value ignored; cross-tab storage event applied; unrelated
storage keys ignored; cleanup detaches listeners; the init script references the
same storage key and falls back to dark.

### `tests/hero.test.tsx` — heading semantics
Exactly one real `<h1>` containing both headline halves; both calls to action
point at real destinations.

### `tests/work-filter.test.tsx` — filtering and the tabs pattern
One tab per configured filter with `All` selected initially; every project shown
under `All`; count narrows on selection; singular noun for a single result;
panel's `aria-labelledby` follows the active tab; `ArrowRight` advances and
moves focus; `ArrowLeft` wraps to the last tab; `Home`/`End` jump to the ends;
roving `tabindex` keeps only the selected tab in the tab order; live links
announce that they open a new tab.

Assertions read the `aria-live` count rather than counting cards, because
`AnimatePresence` keeps outgoing cards mounted through their exit animation —
counting DOM nodes immediately after a click is a race.

## Not automated — must be checked manually

Recorded honestly so nothing here is ever reported as "passed" on the strength
of the suite.

| # | Check | Why it is manual |
| --- | --- | --- |
| 1 | Light theme visual sweep across all eight sections | Contrast tokens are unit-tested by value, but layout and mood are judgement calls |
| 2 | Real email arrives via Resend with a working `Reply-To` | Requires live credentials; the suite mocks `fetch` |
| 3 | Motion feel — reveals, magnetic buttons, avatar float and smile-on-hover | jsdom does not run animations |
| 4 | `prefers-reduced-motion` honoured with animation genuinely stopped | Requires a real engine and OS setting |
| 5 | Safari and iOS Safari rendering of `backdrop-filter`, `color-mix()` and `min-h-svh` | jsdom is not a browser |
| 6 | Keyboard-only pass: skip link, nav, tabs, form, footer | Focus visibility is a visual property |
| 7 | Screen reader pass (NVDA or VoiceOver) over the heading outline | Automation cannot judge announcement quality |
| 8 | Lighthouse on the deployed build, mobile and desktop | Needs a real network and production host |
| 9 | Response headers present on the deployed host | `next.config.ts` headers do not apply in the dev server |
| 10 | Layout at 320px, 768px, 1440px and 2560px | Breakpoint behaviour is visual |

## Known gaps

- **No end-to-end tests.** Playwright would cover items 1, 6 and 9 above; it is
  not installed. Deliberate scope decision, tracked in
  [KNOWN-ISSUES.md](KNOWN-ISSUES.md).
- **No coverage reporting.** Test value here is in the failure paths, not in a
  percentage, so no threshold is enforced.
- **No visual regression testing.** For a design-led site this is the most
  valuable thing missing after E2E.
