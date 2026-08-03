# Industrial Dev Panel — 10 Specialist Agents

10 persona files, each a senior/principal-level specialist with 20+ years of simulated industry experience. Built to be used as system-prompt personas in Cursor — either individually (switch persona per task) or as a simulated review panel (paste multiple in sequence for a "panel review" of one deliverable).

## The Panel

| # | File | Role | Use When |
|---|------|------|----------|
| 1 | `01-frontend-developer.md` | Principal Frontend Engineer | Building/reviewing UI components, React/Vue code, client-side performance |
| 2 | `02-backend-developer.md` | Principal Backend Engineer | API design, database interaction, server logic, auth |
| 3 | `03-ui-ux-designer.md` | Principal UI/UX Designer | Design decisions, usability review, design system consistency |
| 4 | `04-project-manager.md` | Senior Technical PM | Planning, scope, timeline, risk, documentation-vs-reality checks |
| 5 | `05-qa-engineer.md` | Principal QA Engineer | Test planning, bug reporting, verifying "done" claims |
| 6 | `06-code-reviewer.md` | Principal Code Reviewer | Pull request / diff review before merge |
| 7 | `07-project-delivery-agent.md` | Delivery & Release Manager | Go/no-go before shipping, launch/defense readiness |
| 8 | `08-solutions-architect.md` | Principal Solutions Architect | System design, tech stack decisions, architecture docs |
| 9 | `09-devops-security-engineer.md` | DevOps & Security Engineer | Deployment, secrets, security/compliance claims, monitoring |
| 10 | `10-database-engineer.md` | Database Engineer / Data Architect | Schema, ERD, migrations, query performance |

## How to Use in Cursor

**Option A — Single persona per task**
Open the relevant `.md` file and tell Cursor: *"Act as the persona defined in `06-code-reviewer.md` and review this diff."* Or paste the file contents directly into a Cursor rule / custom instructions for that session.

**Option B — Cursor Rules (recommended for repeated use)**
Copy the relevant file(s) into `.cursor/rules/` in your project (Cursor supports project-level rule files). Cursor will apply the persona automatically when working in that project.

**Option C — Full panel review**
For a big decision (e.g., "is this feature ready to ship?"), run the same question through multiple personas in sequence — Architect → Backend → Frontend → QA → Reviewer → Delivery Agent — and compile their checklists into one go/no-go call. This mirrors a real cross-functional review meeting.

## Suggested Flow for a Feature Build
1. **Solutions Architect** — confirm the approach fits the system before writing code
2. **Backend + Frontend Engineers** — implement
3. **Database Engineer** — review schema/query impact if data model touched
4. **Code Reviewer** — review the diff before merge
5. **QA Engineer** — test against the checklist, file structured bug reports
6. **DevOps/Security Engineer** — verify no secrets, security claims are accurate, monitoring exists
7. **UI/UX Designer** — sign off on states/accessibility if UI-facing
8. **Project Manager** — confirm scope/docs are in sync with reality
9. **Delivery Agent** — final go/no-go before shipping

## Notes
- Every persona is written to **push back and flag issues honestly** rather than rubber-stamp — that's intentional, it's what makes a panel useful instead of just agreeable.
- Each file includes a review checklist you can literally paste back to Cursor as a task list.
- These are general web-dev personas — reusable across any project, including a WordPress/Shopify build or a full-stack platform like Voiceify.
