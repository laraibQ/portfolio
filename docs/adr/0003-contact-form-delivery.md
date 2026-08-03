# ADR 0003 — Contact delivery via provider API, with a mailto fallback

- **Status:** Accepted
- **Date:** 2026-08-03
- **Supersedes:** direct `mailto:` navigation on submit

## Context

The form originally set `window.location.href` to a `mailto:` URL. That looks
like it works and silently fails for a large share of visitors: anyone without
a configured desktop mail client gets nothing, and the sender never learns the
message was not sent. There was also no validation feedback, no submitting
state and no server-side guard of any kind.

## Decision

`POST /api/contact` is the primary path. It performs, in order:

1. Fixed-window rate limit, 5 requests per IP per 10 minutes.
2. JSON parse with an explicit `400` on malformed bodies.
3. Honeypot check on a `company` field — non-empty responds `200` and drops the
   message, so bots learn nothing.
4. Validation via `lib/contact.ts`, the same module the client uses, returning
   per-field messages.
5. Delivery through the Resend HTTP API with an 8-second timeout.

The client falls back to a prefilled `mailto:` link whenever the API answers
`503` (not configured) or `502` (delivery failed), or when the fetch itself
throws.

## Rationale

- Sharing `lib/contact.ts` gives inline client errors without the server
  trusting client input — the rules cannot drift apart.
- Resend is called over `fetch` with no SDK, so this adds zero dependencies.
- Email bodies are sent as plain text only, so nothing a visitor types is ever
  interpreted as markup in the recipient's inbox.
- The fallback means an unconfigured or broken environment degrades to the old
  behaviour rather than to a dead form.

## Accepted risks

- **Rate-limit state is per process.** On a multi-instance or serverless host
  the effective limit is `5 x instances`. Acceptable for dampening abuse of a
  contact form; a shared store (Redis/Upstash) is the upgrade path if abuse
  actually occurs.
- **IP is read from `x-forwarded-for`,** which a client can spoof if the host
  does not overwrite it. Deploy behind a proxy that sets it authoritatively.
- **No CAPTCHA.** The honeypot plus rate limit handles unsophisticated bots;
  anything targeted would need a challenge, at a real UX cost.

## Consequences

- `/api/contact` is the only dynamic route, so it is the only part of the site
  that cannot be served from a CDN edge cache.
- Delivery failures are logged as structured JSON with a request ID, outcome and
  duration — and never with the visitor's name, email or message.
