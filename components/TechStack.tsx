"use client";

import type { IconType } from "react-icons";
import {
  FaCss3Alt,
  FaElementor,
  FaFigma,
  FaGithub,
  FaHtml5,
  FaJs,
  FaShopify,
  FaWordpress,
} from "react-icons/fa";
import { RiClaudeFill, RiCursorAiFill } from "react-icons/ri";
import {
  SiGooglesearchconsole,
  SiN8N,
  SiShopify,
  SiWebflow,
} from "react-icons/si";
import { Reveal, Stagger } from "@/components/ui/Motion";

type TechKey =
  | "WordPress"
  | "Elementor"
  | "Shopify"
  | "Webflow"
  | "Figma"
  | "HTML5"
  | "CSS3"
  | "JavaScript"
  | "Liquid"
  | "n8n"
  | "Cursor"
  | "Claude AI"
  | "Google Search Console"
  | "GitHub";

type TechMeta = {
  label: TechKey;
  Icon: IconType;
  color: string;
};

const techMeta: Record<TechKey, TechMeta> = {
  WordPress: { label: "WordPress", Icon: FaWordpress, color: "#21759B" },
  Elementor: { label: "Elementor", Icon: FaElementor, color: "#92003B" },
  Shopify: { label: "Shopify", Icon: FaShopify, color: "#95BF47" },
  Webflow: { label: "Webflow", Icon: SiWebflow, color: "#4353FF" },
  Figma: { label: "Figma", Icon: FaFigma, color: "#F24E1E" },
  HTML5: { label: "HTML5", Icon: FaHtml5, color: "#E34F26" },
  CSS3: { label: "CSS3", Icon: FaCss3Alt, color: "#1572B6" },
  JavaScript: { label: "JavaScript", Icon: FaJs, color: "#F7DF1E" },
  Liquid: { label: "Liquid", Icon: SiShopify, color: "#95BF47" },
  n8n: { label: "n8n", Icon: SiN8N, color: "#EA4B71" },
  Cursor: { label: "Cursor", Icon: RiCursorAiFill, color: "#00BDF1" },
  "Claude AI": { label: "Claude AI", Icon: RiClaudeFill, color: "#D97757" },
  "Google Search Console": {
    label: "Google Search Console",
    Icon: SiGooglesearchconsole,
    color: "#4285F4",
  },
  GitHub: { label: "GitHub", Icon: FaGithub, color: "currentColor" },
};

const categories = [
  {
    title: "CMS & Builders",
    items: [
      "WordPress",
      "Elementor",
      "Shopify",
      "Webflow",
      "Figma",
    ] as const satisfies readonly TechKey[],
  },
  {
    title: "Languages & Core",
    items: [
      "HTML5",
      "CSS3",
      "JavaScript",
      "Liquid",
    ] as const satisfies readonly TechKey[],
  },
  {
    title: "Automation & Tools",
    items: [
      "n8n",
      "Cursor",
      "Claude AI",
      "Google Search Console",
      "GitHub",
    ] as const satisfies readonly TechKey[],
  },
] as const;

function TechPill({
  tech,
  className,
}: {
  tech: TechKey;
  className?: string;
}) {
  const { label, Icon, color } = techMeta[tech];

  return (
    <span className={className}>
      <Icon className="size-3.5 shrink-0" style={{ color }} aria-hidden />
      <span>{label}</span>
    </span>
  );
}

export default function TechStack() {
  return (
    <section
      id="tech-stack"
      aria-labelledby="tech-stack-heading"
      className="relative border-t border-hairline"
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <Reveal className="mb-14 max-w-2xl">
          <p className="mb-4 text-[11px] font-medium tracking-[0.22em] text-accent-text uppercase">
            Tech Stack
          </p>
          <h2
            id="tech-stack-heading"
            className="font-display text-4xl font-bold tracking-[-0.04em] text-foreground sm:text-5xl md:text-6xl"
          >
            Tools I ship with.
          </h2>
          <p className="mt-5 text-base text-muted sm:text-lg">
            A focused arsenal for CMS builds, front-end craft, and automation—
            not an endless badge wall.
          </p>
        </Reveal>

        <Stagger className="grid gap-4 md:grid-cols-3" stagger={0.1}>
          {categories.map((category) => (
            <div
              key={category.title}
              className="glass-panel rounded-3xl p-6 sm:p-7"
            >
              <h3 className="mb-5 text-[11px] font-medium tracking-[0.18em] text-accent-text uppercase">
                {category.title}
              </h3>
              <ul className="flex flex-wrap gap-2">
                {category.items.map((item) => (
                  <li key={item}>
                    <TechPill
                      tech={item}
                      className="inline-flex cursor-default items-center gap-2 rounded-full border border-line bg-panel px-3.5 py-1.5 text-sm text-muted transition-all hover:scale-105 hover:border-accent/55 hover:text-accent-text hover:shadow-[0_0_20px_color-mix(in_srgb,var(--accent)_18%,transparent)]"
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
