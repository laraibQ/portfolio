"use client";

import { Reveal, Stagger } from "@/components/ui/Motion";
import {
  Smartphone,
  Code2,
  ShoppingBag,
  Workflow,
  type LucideIcon,
} from "lucide-react";

type Service = {
  title: string;
  description: string;
  points: string[];
  icon: LucideIcon;
};

const services: Service[] = [
  {
    title: "UI/UX & Mobile Design",
    description:
      "Figma-led product interfaces, wireframes, prototypes, and design systems with an editorial eye.",
    points: [
      "Figma-to-code",
      "Pixel-perfect layouts",
      "Cross-browser polish",
      "Mobile-first app flows",
    ],
    icon: Smartphone,
  },
  {
    title: "Web Design to Code",
    description:
      "Convert Figma and design mockups into pixel-accurate, responsive WordPress and Webflow builds ready for production.",
    points: ["Figma-to-code", "Pixel-perfect layouts", "Cross-browser polish"],
    icon: Code2,
  },
  {
    title: "Shopify Development",
    description:
      "Theme customization, store setup, and product optimization for e-commerce sites that look sharp and sell smoothly.",
    points: [
      "Theme customization",
      "Store operations",
      "Product listing",
      "Product optimization",
    ],
    icon: ShoppingBag,
  },
  {
    title: "n8n & Automation Workflows",
    description:
      "n8n workflows, WhatsApp/Gmail bots, and AI-assisted systems that cut repetitive work and keep clients moving faster.",
    points: [
      "n8n workflows",
      "WhatsApp, Gmail & PA bots",
      "API integrations",
    ],
    icon: Workflow,
  },
];

export default function Services() {
  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="relative border-t border-hairline"
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <Reveal className="mb-14 max-w-2xl">
          <p className="mb-4 text-[11px] font-medium tracking-[0.22em] text-accent-text uppercase">
            Services
          </p>
          <h2
            id="services-heading"
            className="font-display text-4xl font-bold tracking-[-0.04em] text-foreground sm:text-5xl md:text-6xl"
          >
            What I deliver
            <br />
            for clients.
          </h2>
          <p className="mt-5 text-base text-muted sm:text-lg">
            UI/UX and mobile design, design-to-code builds, Shopify development,
            and n8n automation—shipped for production.
          </p>
        </Reveal>

        <Stagger className="grid gap-4 sm:grid-cols-2 lg:gap-5" stagger={0.1}>
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <article
                key={service.title}
                className="group glass-panel relative overflow-hidden rounded-3xl p-6 transition-transform duration-300 hover:-translate-y-1 sm:p-8"
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(500px circle at 20% 0%, color-mix(in srgb, var(--accent) 14%, transparent), transparent 45%)",
                  }}
                />
                <div className="relative z-10">
                  <div className="mb-6 inline-flex size-11 items-center justify-center rounded-2xl border border-line bg-panel text-accent-text transition-all group-hover:border-accent/40 group-hover:shadow-[0_0_24px_color-mix(in_srgb,var(--accent)_30%,transparent)]">
                    <Icon className="size-5" strokeWidth={1.75} />
                  </div>
                  <h3 className="font-display text-xl font-bold tracking-[-0.03em] text-foreground sm:text-2xl">
                    {service.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
                    {service.description}
                  </p>
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {service.points.map((point) => (
                      <li
                        key={point}
                        className="rounded-full border border-line bg-panel px-3 py-1 text-[11px] tracking-wide text-muted transition-all group-hover:border-accent/30 group-hover:text-accent-text"
                      >
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
