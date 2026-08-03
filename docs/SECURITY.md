# Security posture

Last reviewed: 2026-08-03. This document states what is actually true, not what
would be nice to claim.

## What this site is

A static marketing site with one write endpoint. There is no authentication, no
authorisation, no user accounts, no database and no user-generated content that
is ever rendered back to another visitor. That eliminates most of the OWASP Top
10 by construction rather than by control.

## Compliance claims

**None.** This project holds no certification of any kind — not SOC 2, not
ISO 27001, not GDPR "compliance" as a badge. Nothing in the site copy or these
docs should be read as claiming otherwise.

## Secrets

- No credentials, API keys or tokens exist anywhere in the repository. Verify
  with `rg -i "api[_-]?key|secret|password|bearer " --glob '!package-lock.json'`.
- `.env*` is gitignored; `.env.example` contains names only, never values.
- `RESEND_API_KEY` is read server-side in `app/api/contact/route.ts` only. No
  secret is exposed through a `NEXT_PUBLIC_` variable.

## Response headers

Set for every route in `next.config.ts`:

| Header | Value |
| --- | --- |
| `Content-Security-Policy` | see below |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` |
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `DENY` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Cross-Origin-Opener-Policy` | `same-origin` |
| `Permissions-Policy` | camera, microphone, geolocation, browsing-topics all denied |

`poweredByHeader` is disabled so the framework version is not advertised.

### CSP: what it does and does not do

```
default-src 'self'; base-uri 'self'; form-action 'self';
frame-ancestors 'none'; object-src 'none';
img-src 'self' data: blob:; font-src 'self' data:;
style-src 'self' 'unsafe-inline';
script-src 'self' 'unsafe-inline';
connect-src 'self'; upgrade-insecure-requests
```

**It does** restrict every script, style, font, image and network connection to
this origin, and forbids framing and plugin content outright.

**It does not** prevent inline script execution. `'unsafe-inline'` is required
because the App Router streams hydration payloads as inline `<script>` tags and
the pre-paint theme script is inline by design. Hash-based allowlisting cannot
cover the framework's generated payloads, and a nonce requires a proxy on every
request, which would opt all routes out of static prerendering.

This is a deliberate trade-off, not an oversight. The residual risk is low here
because there is no injection surface: no user input is rendered into any page,
and the only write endpoint returns JSON and never reflects submitted content.

**Upgrade path:** if the site ever renders user-supplied content, add a proxy
that issues a per-request nonce, switch `script-src` to `'self' 'nonce-…'
'strict-dynamic'`, and accept the loss of static prerendering.

## Input handling

`POST /api/contact` is the only endpoint accepting input.

- Every field is validated at the boundary by `lib/contact.ts` before use; the
  server never trusts the client's own validation pass.
- Length caps are enforced server-side (name 80, email 254, message 2000).
- Non-string field types are rejected, not coerced.
- The outbound email is plain text only, so nothing submitted can be
  interpreted as markup in the recipient's inbox.
- Malformed JSON returns `400` rather than throwing.

## Abuse controls

- Fixed-window rate limit: 5 requests per IP per 10 minutes, returning `429`
  with a `Retry-After` header.
- Honeypot field; bot submissions receive `200` and are dropped silently.
- Known limitation: limiter state is per process, and `x-forwarded-for` is
  trusted. See [ADR 0003](adr/0003-contact-form-delivery.md).

## Logging and PII

The contact route logs one structured JSON line per request containing a request
ID, outcome and duration. It never logs the submitted name, email or message —
this is asserted by a test in `tests/contact-route.test.ts`. Nothing is
persisted server-side.

## Dependencies

`npm audit --audit-level=high` runs as a separate CI job and fails the build on
high or critical advisories. As of this review the tree reports **0
vulnerabilities**; `postcss` and `sharp` are pinned forward through `overrides`
in `package.json` to clear known advisories in transitive copies.

## Monitoring

Honestly stated: there is **no uptime or error monitoring configured**. The
route emits structured logs, so a host-level log drain or an error tracker can
consume them, but neither is wired up. This is the largest remaining gap and is
tracked in [KNOWN-ISSUES.md](KNOWN-ISSUES.md).
