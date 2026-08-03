"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/ui/Motion";

/** Every claim here maps to something verifiable in the experience timeline. */
const reasons = [
  {
    title: "Designs land exactly as drawn",
    detail:
      "Figma mockups converted into pixel-accurate, responsive pages — checked across browsers and mobile before handoff, not after.",
  },
  {
    title: "A delivery cadence you can plan around",
    detail:
      "Shipped 3+ new site features per month at Clona alongside design and product teams, under real deadlines.",
  },
  {
    title: "Automation that removes actual work",
    detail:
      "n8n workflows running 200+ personalized outreach emails a week, plus WhatsApp client response bots that cut manual handoffs.",
  },
  {
    title: "End-to-end ownership",
    detail:
      "Hosting, cPanel, DNS, plugin conflicts, on-page SEO — the unglamorous parts that decide whether a launch actually holds up.",
  },
];

export default function WhyMe() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="why-me"
      aria-labelledby="why-me-heading"
      className="relative border-t border-hairline"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="glow-orb top-1/4 left-[8%] h-72 w-72 bg-[color-mix(in_srgb,var(--accent)_10%,transparent)]" />
      </div>

      <div className="mx-auto grid w-full max-w-6xl gap-12 px-4 py-24 sm:px-6 sm:py-32 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:px-8">
        <Reveal>
          <p className="mb-4 text-[11px] font-medium tracking-[0.22em] text-accent-text uppercase">
            Why Me
          </p>
          <h2
            id="why-me-heading"
            className="font-display text-4xl font-bold tracking-[-0.04em] text-foreground sm:text-5xl"
          >
            Hire the person who
            <br />
            stays until it ships.
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-muted sm:text-lg">
            Plenty of people can build a page. Fewer will own the launch, the
            edge cases, and the follow-up work that keeps it running.
          </p>
        </Reveal>

        <ol className="grid gap-3">
          {reasons.map((reason, index) => (
            <motion.li
              key={reason.title}
              initial={reduceMotion ? false : { opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
                delay: index * 0.08,
              }}
              className="glass-panel group flex gap-5 rounded-3xl p-6 transition-colors hover:border-accent/40 sm:p-7"
            >
              <span
                aria-hidden
                className="font-display text-sm font-bold text-accent-text tabular-nums"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-display text-lg font-bold tracking-[-0.02em] text-foreground sm:text-xl">
                  {reason.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted sm:text-base">
                  {reason.detail}
                </p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
