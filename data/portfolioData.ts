export type ProjectCategory = "web" | "uiux" | "automation";

export type ProjectOwnership =
  | "Solo build"
  | "Feature owner"
  | "Maintainer"
  | "Design-to-code lead";

export type CaseStudy = {
  problem: string;
  role: string;
  solution: string;
  result: string;
};

export type Project = {
  id: string;
  title: string;
  description: string;
  url: string | null;
  tags: string[];
  featured?: boolean;
  category: ProjectCategory;
  /** Tailwind col-span classes for bento layout */
  span: string;
  /** What you personally owned on the engagement */
  ownership: ProjectOwnership;
  /** One concrete metric recruiters can scan */
  metric: string;
  /** Full case narrative for featured work */
  caseStudy?: CaseStudy;
  /** Step labels for automation systems (proof without a live demo) */
  workflow?: string[];
};

export const projectFilters = [
  { id: "all", label: "All" },
  { id: "web", label: "Web Designs" },
  { id: "uiux", label: "UI/UX Designs" },
  { id: "automation", label: "Automation Workflows" },
] as const;

export type ProjectFilterId = (typeof projectFilters)[number]["id"];

export type ExperienceItem = {
  id: string;
  role: string;
  organization: string;
  location?: string;
  period: string;
  type: "work" | "education";
  url?: string;
  highlights: string[];
};

/** Canonical role line — keep hero, meta, footer, and contact in sync. */
export const roleTitle = "Website Designer · Automation Builder" as const;

export const openTo = {
  short: "Freelance · Remote · Agency contract",
  detail:
    "Open to freelance builds, remote full-time roles, and agency contracts in WordPress, Shopify, and n8n automation.",
} as const;

export const projects: Project[] = [
  {
    id: "solvix",
    title: "Solvix Consultancy",
    description:
      "Full Elementor WordPress build with custom layouts, branded page structures, and on-page SEO configuration from brief to launch.",
    url: "https://solvixconsultancy.com",
    tags: ["WordPress", "Elementor", "SEO"],
    featured: true,
    category: "web",
    span: "md:col-span-8 md:row-span-2 min-h-[280px] md:min-h-[420px]",
    ownership: "Solo build",
    metric: "Brief → live launch",
    caseStudy: {
      problem:
        "A consultancy needed a production WordPress presence with clear branded page structure and on-page SEO—not a theme demo.",
      role: "Solo Elementor builder from brief through launch and SEO setup.",
      solution:
        "Custom layouts, branded page structures, and on-page SEO configuration wired for real search and handoff.",
      result:
        "Live client site at solvixconsultancy.com with production-ready structure and SEO foundations in place.",
    },
  },
  {
    id: "bolo",
    title: "Bolo · MetaPresence",
    description:
      "Responsive WordPress site developed end-to-end from Figma design to production launch, with mobile-first cross-browser polish.",
    url: "https://bolo.metapresence.my",
    tags: ["WordPress", "Figma", "Responsive"],
    featured: true,
    category: "uiux",
    span: "md:col-span-4 md:row-span-2 min-h-[280px] md:min-h-[420px]",
    ownership: "Design-to-code lead",
    metric: "Figma → production",
    caseStudy: {
      problem:
        "A finished Figma design had to become a responsive WordPress site that held up on real devices—not a near-match mockup.",
      role: "End-to-end design-to-code owner from Figma through production launch.",
      solution:
        "Pixel-accurate WordPress build with mobile-first layouts and cross-browser polish before handoff.",
      result:
        "Live responsive site at bolo.metapresence.my, shipped as a production launch rather than a staging approximation.",
    },
  },
  {
    id: "clona",
    title: "Clona",
    description:
      "Primary company website with Elementor customization, WooCommerce integration, and ongoing production maintenance.",
    url: "https://clona.my",
    tags: ["WordPress", "WooCommerce", "Elementor"],
    category: "web",
    span: "md:col-span-4 min-h-[240px]",
    ownership: "Feature owner",
    metric: "3+ features / month",
    caseStudy: {
      problem:
        "A technology startup needed a primary WordPress site that could take new features every month without breaking production.",
      role: "WordPress feature owner working with design and product under real deadlines.",
      solution:
        "Elementor customization, WooCommerce integration, Figma-to-page delivery, and third-party API extensions.",
      result:
        "Shipped 3+ new site features per month while maintaining the live company site at clona.my.",
    },
  },
  {
    id: "makeup4u",
    title: "Makeup4U",
    description:
      "Shopify e-commerce store with theme layout customization, mobile responsiveness improvements, and product listing optimization.",
    url: "https://makeup4uonline.com",
    tags: ["Shopify", "E-commerce", "Theme"],
    category: "web",
    span: "md:col-span-4 min-h-[240px]",
    ownership: "Maintainer",
    metric: "Store ops + theme polish",
    caseStudy: {
      problem:
        "An active Shopify store needed theme layout fixes, stronger mobile behaviour, and cleaner product listings.",
      role: "Remote Shopify store developer owning theme and listing improvements.",
      solution:
        "Theme layout customization, mobile responsiveness work, and product listing optimization on the live store.",
      result:
        "Ongoing production improvements on makeup4uonline.com across storefront presentation and product ops.",
    },
  },
  {
    id: "n8n-whatsapp",
    title: "WhatsApp Client Chatbot",
    description:
      "n8n-powered WhatsApp chatbot for automated client communication workflows—faster response loops without manual handoffs.",
    url: null,
    tags: ["n8n", "WhatsApp", "Automation"],
    category: "automation",
    span: "md:col-span-4 min-h-[240px]",
    ownership: "Solo build",
    metric: "Faster response loops",
    caseStudy: {
      problem:
        "Client questions piled up in WhatsApp and required manual triage before anyone could reply.",
      role: "Solo n8n automation builder for the client communication loop.",
      solution:
        "WhatsApp chatbot workflow in n8n that routes and answers routine client messages without a human handoff for every ping.",
      result:
        "Faster first-response loops and fewer manual relays for day-to-day client communication.",
    },
    workflow: [
      "Inbound WhatsApp",
      "Intent / routing",
      "Auto reply",
      "Human handoff",
      "Logged follow-up",
    ],
  },
  {
    id: "n8n-gmail",
    title: "Gmail Outreach System",
    description:
      "Gmail automation managing 200+ personalized outreach emails weekly, significantly reducing manual workload.",
    url: null,
    tags: ["n8n", "Gmail", "Outreach"],
    category: "automation",
    span: "md:col-span-12 min-h-[200px]",
    ownership: "Solo build",
    metric: "200+ emails / week",
    caseStudy: {
      problem:
        "Personalized outreach was eating hours every week when done one message at a time in Gmail.",
      role: "Solo builder of the outreach automation system.",
      solution:
        "n8n + Gmail workflow that personalizes and sends outreach at volume while keeping messages individual.",
      result:
        "200+ personalized outreach emails managed weekly with a major cut in manual send-and-track work.",
    },
    workflow: [
      "Lead list in",
      "Personalize copy",
      "Gmail send",
      "Track replies",
      "Queue next batch",
    ],
  },
];

/** Featured case studies on the home page (order matters). */
export const featuredCaseStudyIds = ["solvix", "clona", "n8n-gmail"] as const;

export const featuredCaseStudies = featuredCaseStudyIds
  .map((id) => projects.find((project) => project.id === id))
  .filter((project): project is Project & { caseStudy: CaseStudy } =>
    Boolean(project?.caseStudy),
  );

/**
 * Outcome statements tied to real shipped work—not invented personal quotes.
 * Replace with named client testimonials when you have written permission.
 */
export type OutcomeProof = {
  id: string;
  statement: string;
  project: string;
  metric: string;
  url?: string | null;
};

export const outcomeProofs: OutcomeProof[] = [
  {
    id: "outcome-clona",
    statement:
      "Primary company WordPress site kept moving under deadlines—new features landed every month without stalling production.",
    project: "Clona",
    metric: "3+ features / month",
    url: "https://clona.my",
  },
  {
    id: "outcome-gmail",
    statement:
      "Personalized Gmail outreach stopped being a manual grind—volume stayed high while the send-and-track work dropped.",
    project: "Gmail Outreach System",
    metric: "200+ emails / week",
  },
  {
    id: "outcome-bolo",
    statement:
      "A Figma file became a live responsive WordPress site with mobile-first polish checked before handoff, not after.",
    project: "Bolo · MetaPresence",
    metric: "Figma → production",
    url: "https://bolo.metapresence.my",
  },
];

export const referencesNote =
  "Named client references and LinkedIn recommendations available on request." as const;

export const experience: ExperienceItem[] = [
  {
    id: "makeup4u-role",
    role: "Shopify Store Developer",
    organization: "Makeup4U",
    location: "Remote",
    period: "Jul 2025 – Present",
    type: "work",
    url: "https://makeup4uonline.com",
    highlights: [
      "Managed Shopify store operations including theme layout customization and mobile responsiveness improvements.",
      "Optimized product listings and gained practical e-commerce front-end and backend experience.",
    ],
  },
  {
    id: "clona-role",
    role: "WordPress Developer",
    organization: "Clona (Technology Startup)",
    period: "Aug 2025 – Feb 2026",
    type: "work",
    url: "https://clona.my",
    highlights: [
      "Built and maintained the primary WordPress site with Elementor—theme customization, custom layouts, and plugin integrations from brief to launch.",
      "Converted Figma mockups into pixel-accurate, responsive pages with cross-browser and mobile-first performance.",
      "Delivered 3+ new site features per month with design and product teams under tight deadlines.",
      "Integrated third-party APIs and external tools to extend site functionality.",
    ],
  },
  {
    id: "solution-givers",
    role: "Web Designer Intern",
    organization: "Solution Givers (Startup)",
    location: "Remote",
    period: "Aug 2024 – Dec 2024",
    type: "work",
    highlights: [
      "Designed and developed 10+ websites using WordPress/Elementor, Webflow, and Blogger.",
      "Performed on-page SEO audits: XML sitemaps, meta tags, heading hierarchy, and internal linking.",
      "Handled end-to-end hosting setup—cPanel, domain pointing, DNS, and WordPress installation.",
      "Resolved plugin conflicts, debugged front-end issues, and ensured cross-browser compatibility.",
    ],
  },
  {
    id: "bsc-cs",
    role: "BSc Computer Science",
    organization: "University of Education, Lahore",
    period: "2022 – Present",
    type: "education",
    highlights: [
      "Building foundational computer science knowledge alongside production client work.",
      "Applying coursework insights to cleaner architecture, automation, and problem-solving on live projects.",
    ],
  },
];

export const contactInfo = {
  name: "Laraib Mujahid",
  email: "laraibmujahid25@gmail.com",
  /** Opens Gmail compose in the browser (falls back gracefully if blocked). */
  emailHref:
    "https://mail.google.com/mail/?view=cm&fs=1&to=laraibmujahid25@gmail.com",
  phone: "+92 341 145 0024",
  phoneHref: "tel:+923411450024",
  linkedin: "https://www.linkedin.com/in/laraib-mujahid",
} as const;
