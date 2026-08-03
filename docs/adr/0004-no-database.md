# ADR 0004 — No database

- **Status:** Accepted
- **Date:** 2026-08-03

## Context

A data layer was reviewed for this project and found to have nothing to own.
The full inventory of state in the application:

| State | Where it lives | Lifetime |
| --- | --- | --- |
| Projects, experience, services, contact details | `data/portfolioData.ts` | Compile time |
| Site metadata | `lib/site.ts` | Compile time |
| Theme preference | `localStorage` + the `dark` class on `<html>` | Per browser |
| Active work filter | React state | Per page view |
| Contact submissions | Forwarded to email, never stored | Per request |
| Rate-limit counters | Process memory, 10-minute window | Ephemeral |

None of it is relational, queried, or shared between users.

## Decision

No database, no ORM, no migrations. This is recorded explicitly so the absence
reads as a decision rather than an omission.

## Rationale

- A schema with no queries against it is pure operational cost: a connection to
  pool, credentials to rotate, backups to verify and migrations to roll back.
- Contact submissions are forwarded, not owned. Storing them would create a
  PII retention obligation with no product benefit — the author reads and
  replies from an inbox.
- The compile-time content set is *better* protected than a database would be:
  `tsc --noEmit` in CI enforces its shape, which no schema constraint can do
  for a `data/` module.

## Consequences

- No analytics on contact volume beyond the structured route logs.
- Submissions lost during a provider outage are not recoverable server-side;
  the mailto fallback puts recovery in the visitor's hands instead.

## When to revisit

Introduce Postgres (with proper constraints, indexes on any filtered column,
and reversible migrations) if any of these become true:

1. Submissions need to be stored, searched, or given a status workflow.
2. Content needs multi-user editing or draft/publish states.
3. Anything per-visitor needs to persist server-side.

Until then, the correct schema is no schema.
