# Laraib Mujahid — Portfolio

Personal portfolio for a WordPress Developer & Automation Builder. Dark-first,
motion-rich, statically prerendered, with a working light theme and a real
contact pipeline.

**Stack:** Next.js 16 (App Router, Turbopack) · React 19 · Tailwind CSS v4 ·
Framer Motion · TypeScript · Vitest

---

## Quick start

```bash
npm install
cp .env.example .env.local   # optional; the site runs without it
npm run dev
```

Open <http://localhost:3000>.

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint (`eslint-config-next`) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run test` | Vitest suite (single run) |
| `npm run test:watch` | Vitest in watch mode |
| `npm run audit:a11y` | axe-core against a running production server |
| `npm run audit:lighthouse` | Lighthouse medians (writes HTML reports to `.audit/`) |
| `npm run audit` | axe then Lighthouse |
| `npm run verify` | lint → typecheck → test → build, i.e. the CI gate |

Run `npm run verify` before pushing; CI runs the same four gates plus
`npm audit --audit-level=high`. For measured scores see
[`docs/AUDIT.md`](docs/AUDIT.md).

## Environment variables

All are optional. See `.env.example` for the full list.

| Variable | Effect when absent |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical URLs, Open Graph and sitemap fall back to `VERCEL_PROJECT_PRODUCTION_URL`, then `http://localhost:3000`. Must be present **at build time** — it is inlined by `next build` |
| `RESEND_API_KEY` | Contact API returns `503`; the form falls back to a `mailto:` link |
| `CONTACT_TO_EMAIL` | Same as above |
| `CONTACT_FROM_EMAIL` | Same as above |

No secret is ever read on the client. `.env*` is gitignored.

## Project structure

```
app/
  api/contact/route.ts   POST endpoint: validation, rate limiting, delivery
  work/                  /work route + client filtering UI
  layout.tsx             Metadata, fonts, pre-paint theme script, skip link
  globals.css            Semantic design tokens for both themes
  robots.ts, sitemap.ts  Generated from lib/site.ts
assets/avatar/           2MB image masters (never served; optimised at build)
components/              Section components + ui/Motion.tsx primitives
data/portfolioData.ts    Projects, experience and contact details
lib/
  contact.ts             Validation shared by client and server
  rate-limit.ts          In-memory fixed-window limiter
  site.ts                Single source of truth for site metadata
  theme.ts               Theme store + pre-paint init script
tests/                   Vitest unit and component tests
docs/                    Architecture, ADRs, security, test plan, release
```

## Theming

`app/globals.css` defines semantic tokens (`--muted`, `--line`, `--panel`,
`--accent-text`, …) once per theme. Components consume `text-muted`,
`border-line`, `bg-panel` and never hardcode white-alpha utilities, which is
what keeps the light theme usable. All text tokens clear WCAG AA (4.5:1) in
both themes — note `--accent-text` darkens to `#00789A` in light mode because
the brand cyan only reaches 2.1:1 on white.

The active theme lives in the `dark` class on `<html>`, applied before first
paint by an inline script. React holds no theme state, so there is no flash and
no hydration mismatch.

## Documentation

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — system shape and data flow
- [`docs/adr/`](docs/adr) — architecture decision records
- [`docs/SECURITY.md`](docs/SECURITY.md) — headers, CSP posture, accepted risks
- [`docs/AUDIT.md`](docs/AUDIT.md) — measured Lighthouse and axe numbers
- [`docs/TEST-PLAN.md`](docs/TEST-PLAN.md) — what is automated vs. manual
- [`docs/KNOWN-ISSUES.md`](docs/KNOWN-ISSUES.md) — open issues and workarounds
- [`docs/RELEASE-CHECKLIST.md`](docs/RELEASE-CHECKLIST.md) — go/no-go and rollback
- [`portfolio-context.md`](portfolio-context.md) — content and design contract
