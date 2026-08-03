"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  Smartphone,
  Code2,
  ShoppingBag,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { Reveal } from "@/components/ui/Motion";

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
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="relative border-t border-hairline"
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="glow-orb top-0 left-1/4 h-72 w-72 bg-[color-mix(in_srgb,var(--accent)_10%,transparent)]" />
      </div>

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

        <div className="grid gap-4 sm:grid-cols-2 lg:gap-5">
          {services.map((service, index) => {
            const Icon = service.icon;

            return (
              <motion.article
                key={service.title}
                initial={reduceMotion ? false : { opacity: 0, y: 36, scale: 0.98 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.65,
                  ease: [0.22, 1, 0.36, 1],
                  delay: index * 0.08,
                }}
                whileHover={
                  reduceMotion
                    ? undefined
                    : {
                        y: -4,
                        borderColor:
                          "color-mix(in srgb, var(--accent) 50%, transparent)",
                        boxShadow:
                          "0 0 0 1px color-mix(in srgb, var(--accent) 18%, transparent), 0 24px 50px color-mix(in srgb, var(--accent) 10%, transparent)",
                      }
                }
                className="group glass-panel relative overflow-hidden rounded-3xl p-6 sm:p-8"
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
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
