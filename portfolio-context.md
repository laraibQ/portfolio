# Portfolio Context — Laraib Mujahid

> Single source of truth for design, content, and build decisions.
> Do not implement the full site until scaffolding is explicitly requested.

---

## 1. Identity & Positioning

| Field | Value |
| --- | --- |
| **Name** | Laraib Mujahid |
| **Role title** | Website Designer · Automation Builder |
| **Tagline direction** | Production-grade WordPress & Shopify builds, Figma-to-code accuracy, and n8n automation — delivered remotely for international clients |
| **Location / timezone context** | Lahore, Pakistan · Remote-friendly with global teams |
| **Phone** | +92 341 145 0024 |
| **Email** | laraibmujahid25@gmail.com |
| **Links to surface** | LinkedIn · Live portfolio / project URLs (see Projects) |
| **Education (in progress)** | BSc Computer Science — University of Education, Lahore (2022 – Present) |
| **Prior education** | ICS (Statistics) — Lahore College for Women University (2020 – 2022) |

### Professional summary (canonical copy)

Results-driven Website Designer & Automation Builder with 2+ years of hands-on experience building, customizing, and maintaining production-grade websites for international clients. Proficient in Elementor, custom theme development, and plugin integration. Strong at converting Figma designs into pixel-accurate, fully responsive, cross-browser-compatible WordPress sites. Experienced in website speed optimization and on-page SEO. Additional expertise in Shopify store management, Webflow, and n8n automation workflows. Currently pursuing a BSc in Computer Science. Comfortable working remotely with global teams under tight deadlines.

### Brand personality for the site

- Premium, modern, clean — not a generic AI/dev template
- Personality-driven: confident craftsman who ships real client work
- Animation-rich but purposeful (scroll-triggered presence, not noise)
- Professional enough for clients and agencies; distinctive enough to feel authored

---

## 2. Color Palette & Theme

### Tokens

| Token | Hex | Usage |
| --- | --- | --- |
| **Dark base** | `#0F0F0F` | Primary dark-mode background / canvas |
| **Light base** | `#FFFFFF` | Primary light-mode background / canvas |
| **Accent / brand** | `#00BDF1` | CTAs, active states, highlights, focus rings, key underline/marker accents |

### Theme system requirements

- Fully functional **light / dark** theme toggle
- Persist preference in **`localStorage`**
- Seamless switch (no flash of wrong theme on load preferred — respect stored preference + sensible default)
- Accent `#00BDF1` must remain readable and intentional on both bases
- Derive supporting neutrals (muted text, borders, elevated surfaces) from the two bases rather than inventing a second brand color unless needed for contrast

### Visual / UX constraints (from product brief + design rules)

- One clear composition per first viewport (not a dashboard)
- Brand/name as a hero-level signal — not only nav text
- Expressive typography (avoid default Inter/Roboto/Arial/system stacks)
- Atmosphere via gradient, texture, or subtle pattern — not flat single-color only
- Hero: full-bleed / edge-to-edge visual plane preferred; avoid inset hero cards and overlay badges/chips
- Hero budget: brand/name, one headline, one short supporting line, one CTA group, one dominant visual idea
- Cards only when they support interaction or clear project browsing; default to open layouts
- One job per section: one purpose, one headline, one short support line
- Motion: at least 2–3 intentional Framer Motion treatments (entrance, scroll, hover/interaction)
- Avoid cliché AI looks: purple-indigo gradients, warm cream + terracotta serif, dense broadsheet columns, excessive glow, rounded-full pill clusters, emoji decoration

---

## 3. Tech Stack (target)

| Layer | Choice |
| --- | --- |
| Framework | **Next.js (App Router)** |
| Styling | **Tailwind CSS** |
| Motion | **Framer Motion** |
| Theme | Class- or data-attribute-based light/dark + `localStorage` |
| Content | Static content derived from this file (no CMS required for v1) |

> Note: This repo may use a Next.js version with breaking changes vs. training data. Before scaffolding or coding, consult `node_modules/next/dist/docs/` and `AGENTS.md`.

---

## 4. Technical Skills (for Skills / Expertise section)

### CMS & Builders
WordPress · Elementor · Shopify · Webflow · Figma 

### Languages
HTML5 · CSS3 · JavaScript . Liquid

### Theme & Plugin Development
Custom theme development · Plugin customization & integration · Child themes

### Performance & SEO
 On-page SEO · Yoast SEO · XML sitemaps · Meta structure · Image optimization

### Security & Hosting
WordPress security best practices · cPanel · Domain & DNS management · WordPress maintenance

### Design & Tools
Figma (design-to-code) · GitHub · Google Search Console · Canva · UI/UX design

### Automation & AI
n8n workflow automation · Cursor · Google Antigravity · Loveable · Claude AI (AI-powered dev tools)

### Other
Third-party API integration · Responsive & mobile-first design · Cross-browser testing · Bug troubleshooting

**UI guidance:** Group skills into clear clusters (CMS, Languages, Performance, Automation). Prefer curated highlights over an exhaustive wall of tags.

---

## 5. Work Experience

### WordPress Developer — Clona (Technology Startup)
- **Company site:** [clona.my](https://clona.my)
- **Dates:** Aug 2025 – Feb 2026
- **Highlights**
  - Built and maintained the primary WordPress site with Elementor: theme customization, custom layouts, plugin integrations from brief to production
  - Converted Figma mockups into pixel-accurate, responsive pages with cross-browser and mobile-first performance
  - Delivered 3+ new site features per month with design/product teams under deadlines
  - Integrated third-party APIs and external tools for product roadmap needs

### Shopify Store Developer — Makeup4U
- **Store:** [makeup4uonline.com](https://makeup4uonline.com)
- **Dates:** Jul 2025 – Present · Remote
- **Highlights**
  - Theme layout customization, mobile responsiveness, product listing optimization
  - Practical e-commerce front-end/back-end experience on Shopify

### Web Designer Intern — Solution Givers (Startup)
- **Dates:** Aug 2024 – Dec 2024 · Remote
- **Highlights**
  - Designed and developed 10+ sites (WordPress/Elementor, Webflow, Blogger): custom layouts, branded structures, responsive delivery
  - On-page SEO audits: XML sitemaps, meta tags, heading hierarchy, internal linking
  - End-to-end hosting: cPanel, domain pointing, DNS, WordPress install
  - Plugin conflict resolution, front-end debugging, cross-browser compatibility

---

## 6. Projects

### Live WordPress / Web portfolio

| Project | URL | Notes |
| --- | --- | --- |
| Solvix Consultancy | [solvixconsultancy.com](https://solvixconsultancy.com) | Full Elementor build · custom layouts · SEO configuration |
| Bolo / MetaPresence | [bolo.metapresence.my](https://bolo.metapresence.my) | Responsive WordPress from Figma design to launch |
| Clona | [clona.my](https://clona.my) | Primary company site · WooCommerce · ongoing maintenance |
| Makeup4U | [makeup4uonline.com](https://makeup4uonline.com) | Shopify store · theme customization · product optimization |

### Automation (n8n)

- WhatsApp chatbot for automated client communication workflows
- Gmail automation managing 200+ personalized outreach emails weekly (major manual workload reduction)

**UI guidance:** Featured projects as primary visual anchors; automation work as secondary case studies or a dedicated “Systems” strip — not buried as bullet-only text.

---

## 7. Site Section Outline — as built

This reflects the shipped structure, not the original proposal. Two deliberate
deviations from the v1 sketch are noted inline.

**Home (`app/page.tsx`)**

1. **Nav** — `components/Navbar.tsx`
   - Name / mark, section anchors, `/work` link, theme toggle, "Available" badge

2. **Hero** — `components/Hero.tsx`
   - Split headline (`WEB DESIGN` · avatar · `AUTOMATION`) as a real `<h1>`
   - Supporting sentence, CTA group (Explore Work · Get in Touch)
   - Atmospheric grid and glow plane behind, no overlay badges

3. **Why Me** — `components/WhyMe.tsx`
   - Four numbered proof points, each traceable to the experience timeline

4. **About** — `components/About.tsx`
   - Condensed story, education, remote/international delivery

5. **Services** — `components/Services.tsx`
   - *Added after v1:* UI/UX & mobile design, web design to code, Shopify
     development, n8n automation

6. **Tech Stack** — `components/TechStack.tsx`
   - Fulfils the "Expertise / Skills" slot: clustered categories plus a marquee

7. **Selected Work** — `components/Projects.tsx`
   - Bento grid of live builds and automation systems, linking to `/work`
   - Ownership labels + metrics on every card; workflow steps on automation

8. **Case Studies** — `components/CaseStudies.tsx`
   - Problem / role / solution / result for Solvix, Clona, Gmail outreach

9. **Outcomes** — `components/Outcomes.tsx`
   - Measurable proof from shipped work; references available on request

10. **Experience** — `components/Experience.tsx`
   - *Deviation:* placed after Projects rather than before, so proof of work
     lands before the CV detail

11. **Contact** — `components/Contact.tsx`
   - Email, phone, LinkedIn, plus a working form (see §9)
   - Open-to strip + references note

12. **Footer** — `components/Footer.tsx`
    - Name, role line, social links, back to top, year

**Work (`app/work/page.tsx`)**

- *Added after v1:* dedicated route listing every project with accessible
  category tabs (All · Web Designs · UI/UX Designs · Automation Workflows)

### Cross-cutting behaviors

- Smooth scroll to sections
- Scroll-triggered Framer Motion (staggered reveals, section entrances, subtle parallax or line/mark motion)
- Persistent light/dark toggle everywhere (nav-primary)
- Responsive: first-class mobile composition, not a shrunk desktop layout
- Accessible focus states using accent color; respect `prefers-reduced-motion` where practical

---

## 8. Content Tone & Copy Notes

- Voice: clear, confident, outcome-oriented (“pixel-accurate,” “production launch,” “international clients”)
- Prefer concrete proof (site URLs, feature cadence, automation volume) over buzzwords
- Avoid emoji and template filler (“Passionate developer who loves clean code…”)
- CTAs should invite collaboration: hire / discuss a build / view live work

---

## 9. Build Status

Reconciled against the codebase on 2026-08-03. Anything marked Done is verified
present; see [`docs/KNOWN-ISSUES.md`](docs/KNOWN-ISSUES.md) for what is open.

| Status | Item |
| --- | --- |
| Done | This context document (`portfolio-context.md`) |
| Done | Next.js 16 App Router + Tailwind v4 + Framer Motion scaffold |
| Done | Theme system — pre-paint init script, `localStorage`, cross-tab and OS sync |
| Done | Light theme rebuilt on semantic tokens, all text at WCAG AA |
| Done | All ten sections above, plus the `/work` route |
| Done | Motion system with `prefers-reduced-motion` honoured globally |
| Done | Contact form → `POST /api/contact` with validation, rate limiting, honeypot, mailto fallback |
| Done | Accessibility pass — real `<h1>`, skip link, focus rings, 44px targets, ARIA tabs |
| Done | Performance — image masters out of `public/`, served as optimised AVIF/WebP |
| Done | Security headers, CSP, `robots.txt`, `sitemap.xml`, Open Graph metadata |
| Done | 73 automated tests + CI (lint · typecheck · test · build · audit) |
| Done | Docs — architecture, 4 ADRs, security, test plan, known issues, release checklist |
| Open | Uptime/error monitoring — [KI-01](docs/KNOWN-ISSUES.md) |
| Open | End-to-end and visual regression tests — [KI-02](docs/KNOWN-ISSUES.md) |
| Open | Open Graph share image — [KI-06](docs/KNOWN-ISSUES.md) |
| Open | Confirm the real LinkedIn URL — [KI-05](docs/KNOWN-ISSUES.md) |

**Instruction for agents:** this file is the content and design contract. Keep
it in sync when scope changes — a status table that disagrees with the codebase
is a defect, not a documentation detail.
