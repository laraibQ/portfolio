"use client";

import { motion, useReducedMotion } from "framer-motion";
import { experience } from "@/data/portfolioData";
import { Reveal } from "@/components/ui/Motion";

export default function Experience() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="experience"
      aria-labelledby="experience-heading"
      className="relative border-t border-hairline"
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <Reveal className="mb-14 max-w-2xl">
          <p className="mb-4 text-[11px] font-medium tracking-[0.22em] text-accent-text uppercase">
            Experience
          </p>
          <h2
            id="experience-heading"
            className="font-display text-4xl font-bold tracking-[-0.04em] text-foreground sm:text-5xl md:text-6xl"
          >
            Roles, launches,
            <br />
            and learning in motion.
          </h2>
        </Reveal>

        <div className="relative space-y-4">
          {experience.map((item, index) => (
            <motion.article
              key={item.id}
              initial={reduceMotion ? false : { opacity: 0, y: 36, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.65,
                ease: [0.22, 1, 0.36, 1],
                delay: index * 0.07,
              }}
              whileHover={{
                borderColor: "color-mix(in srgb, var(--accent) 45%, transparent)",
              }}
              className="glass-panel group relative overflow-hidden rounded-3xl p-6 sm:p-8"
            >
              <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-accent via-accent/30 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-accent/25 bg-accent/10 px-2.5 py-1 text-[10px] font-semibold tracking-[0.14em] text-accent-text uppercase">
                  {item.period}
                </span>
                <span className="text-xs text-subtle">
                  {item.type === "education" ? "Education" : "Work"}
                  {item.location ? ` · ${item.location}` : ""}
                </span>
              </div>

              <h3 className="mt-4 font-display text-2xl font-bold tracking-[-0.03em] text-foreground sm:text-3xl">
                {item.role}
              </h3>
              <p className="mt-2 text-sm text-muted sm:text-base">
                {item.url ? (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-accent-text"
                  >
                    {item.organization}
                  </a>
                ) : (
                  item.organization
                )}
              </p>

              <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                {item.highlights.map((highlight) => (
                  <li
                    key={highlight}
                    className="text-sm leading-relaxed text-muted"
                  >
                    <span className="mr-2 text-accent-text">/</span>
                    {highlight}
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
