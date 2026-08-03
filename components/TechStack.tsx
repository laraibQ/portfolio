"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/ui/Motion";

const categories = [
  {
    title: "CMS & Builders",
    items: ["WordPress", "Elementor", "Shopify", "Webflow", "Figma"],
  },
  {
    title: "Languages & Core",
    items: ["HTML5", "CSS3", "JavaScript", "Liquid"],
  },
  {
    title: "Automation & Tools",
    items: ["n8n", "Cursor", "Claude AI", "Google Search Console", "GitHub"],
  },
] as const;

const marqueeItems = [
  "WordPress",
  "Elementor",
  "Shopify",
  "Webflow",
  "Figma",
  "Liquid",
  "JavaScript",
  "n8n",
  "Cursor",
  "Claude AI",
  "SEO",
  "GitHub",
];

export default function TechStack() {
  const reduceMotion = useReducedMotion();

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

        <div className="grid gap-4 md:grid-cols-3">
          {categories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={reduceMotion ? false : { opacity: 0, y: 32, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
                delay: index * 0.08,
              }}
              className="glass-panel rounded-3xl p-6 sm:p-7"
            >
              <h3 className="mb-5 text-[11px] font-medium tracking-[0.18em] text-accent-text uppercase">
                {category.title}
              </h3>
              <ul className="flex flex-wrap gap-2">
                {category.items.map((item) => (
                  <motion.li
                    key={item}
                    whileHover={
                      reduceMotion
                        ? undefined
                        : {
                            scale: 1.05,
                            borderColor:
                              "color-mix(in srgb, var(--accent) 55%, transparent)",
                            color: "var(--accent)",
                            boxShadow:
                              "0 0 20px color-mix(in srgb, var(--accent) 18%, transparent)",
                          }
                    }
                    className="cursor-default rounded-full border border-line bg-panel px-3.5 py-1.5 text-sm text-muted transition-colors"
                  >
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Infinite marquee strip */}
      <div className="relative overflow-hidden border-y border-hairline py-5">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent sm:w-28" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent sm:w-28" />

        <motion.div
          className="flex w-max gap-3"
          animate={reduceMotion ? undefined : { x: ["0%", "-50%"] }}
          transition={
            reduceMotion
              ? undefined
              : { duration: 28, ease: "linear", repeat: Infinity }
          }
        >
          {[...marqueeItems, ...marqueeItems].map((item, index) => (
            <span
              key={`${item}-${index}`}
              className="inline-flex items-center gap-2 rounded-full border border-line bg-panel px-4 py-2 text-xs tracking-[0.14em] text-muted uppercase"
            >
              <span className="size-1 rounded-full bg-accent/80" />
              {item}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
