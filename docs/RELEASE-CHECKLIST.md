# Release checklist

Nothing ships on "I think it's fine." Work top to bottom; a single unchecked
blocking item is a no-go.

## 1. Code gates (blocking)

- [ ] `npm run verify` passes locally — lint, typecheck, 73 tests, production build
- [ ] `npm audit --audit-level=high` reports no high or critical advisories
- [ ] CI green on the commit being deployed, not on an earlier one
- [ ] `git status` clean; the deployed commit is pushed

## 2. Manual verification (blocking)

Run through all ten items in [TEST-PLAN.md](TEST-PLAN.md#not-automated--must-be-checked-manually).
The suite does not cover any of them. At minimum, do not ship without:

- [ ] Light **and** dark theme walked through on every section
- [ ] Keyboard-only pass: skip link → nav → work tabs → contact form → footer
- [ ] Mobile layout checked at 320px and 768px
- [ ] A real test message received in the inbox, with a working `Reply-To`

## 3. Environment (blocking)

- [ ] `NEXT_PUBLIC_SITE_URL` set to the production origin **in the build
      environment**, not just at run time — the value is inlined during
      `next build`, so setting it for `npm start` alone leaves canonical URLs,
      Open Graph tags and the sitemap pointing at localhost
      ([KI-07](KNOWN-ISSUES.md#ki-07--next_public_site_url-must-be-set-at-build-time-not-run-time)).
      On Vercel, `VERCEL_PROJECT_PRODUCTION_URL` covers this automatically.
- [ ] `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` set, or the
      mailto fallback consciously accepted for this release
- [ ] Sending domain verified with the email provider
- [ ] No secret committed: `rg -i "api[_-]?key|secret|bearer " --glob '!package-lock.json'`

## 4. Content accuracy (blocking)

- [ ] Every project link opens the intended live site
- [ ] LinkedIn URL confirmed against the real profile
      ([KI-05](KNOWN-ISSUES.md#ki-05--linkedin-url-is-unverified))
- [ ] Email and phone number correct
- [ ] No claim in the copy overstates what is deliverable — every "Why Me" point
      maps to something in the experience timeline

## 5. Post-deploy smoke test (blocking, within 10 minutes)

- [ ] `/` and `/work` load over HTTPS
- [ ] `/sitemap.xml` and `/robots.txt` return the production domain, not localhost
- [ ] Theme toggle persists across a hard reload
- [ ] Submit one real message; confirm it arrives
- [ ] Security headers present:
      `curl -sI https://your-domain.com | rg -i "content-security|strict-transport|x-frame"`
- [ ] Lighthouse mobile run recorded as the new baseline

## 6. Rollback plan

**Trigger:** any of the smoke tests failing, or the contact form erroring for
more than 10 minutes.

- **Host-level (preferred, under a minute).** Promote the previous deployment
  in the host dashboard. All routes are static and the build is immutable, so
  this is a complete and safe revert.
- **Git-level.** `git revert <sha>` and push; CI rebuilds. Use when the bad
  change must not stay on `main`.
- **Contact form only.** Unset `RESEND_API_KEY`. The endpoint then returns
  `503` and the form degrades to its mailto fallback — visitors can still reach
  out while the provider issue is investigated. This is a deliberate,
  pre-planned lever, not a workaround.

There are no migrations and no persisted state, so no rollback can lose data.

## 7. Ownership

- [ ] Named owner watching logs and the inbox for the first 24–48 hours
- [ ] [KNOWN-ISSUES.md](KNOWN-ISSUES.md) reviewed and current — it is shared
      proactively, not produced after someone finds a bug
- [ ] `docs/ARCHITECTURE.md` "last reconciled" date matches this release

## Sign-off

| Gate | Verified by | Date |
| --- | --- | --- |
| Code gates | | |
| Manual verification | | |
| Environment | | |
| Content accuracy | | |
| Post-deploy smoke | | |
