# ADR 0001 — Static Next.js App Router over a CMS-backed build

- **Status:** Accepted
- **Date:** 2026-08-03

## Context

The site presents a fixed set of six projects, four services and four
experience entries for one author, who is also the only editor and is
comfortable editing TypeScript. Options considered:

1. Static App Router site with content as typed modules.
2. Headless CMS (Sanity/Contentful) with fetching and revalidation.
3. WordPress as a headless backend, matching the author's day-to-day stack.

## Decision

Option 1. Content lives in `data/portfolioData.ts` and is compiled into
statically prerendered routes.

## Rationale

- Every route prerenders, so there is no server render cost and no cold start
  on the pages that matter to a visitor or a recruiter.
- Typed content means a malformed project object fails `npm run typecheck` in
  CI rather than rendering an empty card in production.
- A CMS would add an external dependency, an API key to rotate and a failure
  mode, in exchange for an editing workflow the only editor does not need.
- Ironically, headless WordPress would be the weakest choice here: it adds
  hosting and an availability dependency to a site whose entire content set
  fits in one file.

## Consequences

- Content edits require a commit and a deploy. Acceptable at this cadence.
- No preview environment for content changes; the dev server serves that role.
- If a non-technical editor or a project count beyond ~20 arrives, revisit in
  favour of option 2.
