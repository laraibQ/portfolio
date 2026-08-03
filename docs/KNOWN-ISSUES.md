# Known issues

Open items as of 2026-08-04, stated before anyone else finds them. Severity is
by user impact, not by effort.

---

### KI-01 — No uptime or error monitoring
**Severity:** Medium · **Status:** Open

The contact route emits structured JSON logs, but nothing consumes them. If
delivery starts failing, the first signal would be a visitor mentioning it.

*Workaround:* check host logs for `"event":"contact.submit"` lines with an
outcome other than `sent`.
*Fix:* wire an error tracker (Sentry) plus an uptime check on `/`.

---

### KI-02 — No end-to-end or visual regression tests
**Severity:** Medium · **Status:** Open, partially mitigated

79 unit and component tests cover logic and semantics. `npm run audit` now
runs axe-core and Lighthouse against a production build in a real Chromium,
so accessibility and category regressions fail loudly — but there is still no
Playwright flow covering a keyboard pass through the live UI, and no
screenshot diff for the design-led sections.

*Fix:* Playwright for the keyboard and header checks; a screenshot diff for the
design-led sections.

---

### KI-03 — `Content-Security-Policy` permits inline scripts
**Severity:** Low · **Status:** Accepted, documented

`script-src` includes `'unsafe-inline'` because the App Router streams hydration
payloads inline. Full reasoning and the nonce-based upgrade path are in
[SECURITY.md](SECURITY.md#csp-what-it-does-and-does-not-do).

---

### KI-08 — Lab mobile LCP sits near 3.7s under Slow 4G
**Severity:** Low · **Status:** Open, measured

Lighthouse mobile (Slow 4G + 4× CPU) reports home LCP around 3.7s and a
performance score in the high 70s. Desktop clears 99–100. The gap is the
synthetic throttle plus remaining above-the-fold JS (React, lucide), not a
missing image optimisation — the avatar already ships as a ~7KB resized AVIF/
WebP. See [AUDIT.md](AUDIT.md).

*Fix:* field measurement on a real device; further above-the-fold JS cuts if
field LCP is still poor.
### KI-04 — Rate-limit counters are per process
**Severity:** Low · **Status:** Accepted, documented

On a multi-instance host the effective contact-form limit is `5 x instances`
per 10 minutes. See [ADR 0003](adr/0003-contact-form-delivery.md).

*Fix:* move counters to Redis/Upstash if abuse is observed.

---

### KI-05 — LinkedIn URL is unverified
**Severity:** Low · **Status:** Needs owner confirmation

`contactInfo.linkedin` in `data/portfolioData.ts` is
`https://www.linkedin.com/in/laraibmujahid`. This was inferred, not confirmed.
If the vanity URL differs, the footer and contact links 404 — a bad first
impression for exactly the audience most likely to click it.

*Fix:* confirm the real profile URL and update the one constant.

---

### KI-06 — No Open Graph image
**Severity:** Low · **Status:** Open

Open Graph and Twitter metadata are set, but there is no image, so link previews
on LinkedIn, Slack and X render as text only.

*Fix:* add `app/opengraph-image.tsx` using `ImageResponse`.

---

### KI-07 — `NEXT_PUBLIC_SITE_URL` must be set at **build** time, not run time
**Severity:** Medium · **Status:** By design, easy to get wrong

Unset, it falls back to `http://localhost:3000`, publishing canonical URLs,
Open Graph URLs and a sitemap that all point at localhost.

The trap: `NEXT_PUBLIC_*` values are inlined during `next build`. Setting the
variable only for `npm start` has **no effect** — the sitemap and robots.txt are
prerendered and will still say localhost. This was observed during smoke
testing, not theorised.

*Mitigation:* on Vercel, `VERCEL_PROJECT_PRODUCTION_URL` is used automatically
when the explicit variable is absent, so production is correct without config.
Trailing slashes are stripped, so `https://x.com/` cannot produce `//work`.
*Guard:* steps 3 and 5 of the [release checklist](RELEASE-CHECKLIST.md) — step 5
checks the deployed `sitemap.xml`, which is the only reliable proof.

---

### KI-08 — Avatar masters are committed at ~4 MB
**Severity:** Informational · **Status:** Accepted

`assets/avatar/` holds two ~2 MB PNGs. They are never served — Next resizes them
to the ~192px render box and emits AVIF/WebP — but they do sit in git history as
the regeneration source.

---

## Resolved in this release

| Was | Resolution |
| --- | --- |
| Light theme unusable: invisible borders, 2.3:1 body text | Semantic tokens, all text at AA in both themes ([ADR 0002](adr/0002-css-variable-theming.md)) |
| Home page had no real `<h1>` | Hero uses a genuine `<h1>`; asserted by test |
| Contact form silently failed without a desktop mail client | Real API with validation, rate limiting and a mailto fallback ([ADR 0003](adr/0003-contact-form-delivery.md)) |
| `ThemeToggle` tripped `react-hooks/set-state-in-effect` | Theme state moved to the document; component holds none |
| 3 high-severity dependency advisories | Cleared via `overrides`; enforced by a CI audit job |
| 4 MB of PNGs served on first paint | Moved out of `public/`, optimised through the image pipeline |
| Documented "Why Me" section never built | Built as `components/WhyMe.tsx` |
| `portfolio-context.md` reported finished work as "Pending" | Reconciled against the codebase |
| No tests, no CI | 73 tests and a four-gate pipeline plus a dependency audit |
| Unused `clsx`, `tailwind-merge`, dead `StaggerWords`, CNA placeholder SVGs | Removed |
