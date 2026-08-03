export type ProjectCategory = "web" | "uiux" | "automation";

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
  },
];

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
  phone: "+92 341 145 0024",
  phoneHref: "tel:+923411450024",
  linkedin: "https://www.linkedin.com/in/laraibmujahid",
} as const;
