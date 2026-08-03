"use client";

import { motion, useReducedMotion } from "framer-motion";
import { MagneticButton } from "@/components/ui/Motion";
import Avatar from "@/components/Avatar";

const wordClass =
  "shrink-0 whitespace-nowrap font-display font-extrabold leading-none tracking-tight text-foreground text-2xl sm:text-4xl md:text-5xl lg:text-6xl";

export default function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative isolate flex min-h-svh items-center overflow-x-clip pt-16"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-background" />
        <div className="site-grid absolute inset-0" />
        <div className="glow-orb top-[-8%] left-1/2 h-[420px] w-[420px] -translate-x-1/2 bg-[color-mix(in_srgb,var(--accent)_16%,transparent)]" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="mx-auto flex w-full max-w-6xl flex-col items-center px-3 py-14 sm:px-5 sm:py-20 lg:px-6">
        <motion.p
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-line bg-panel px-4 py-1.5 backdrop-blur-md"
        >
          <span className="size-1.5 rounded-full bg-accent shadow-[0_0_10px_var(--accent)]" />
          <span className="text-[11px] font-medium tracking-[0.16em] text-muted uppercase">
            Hi, I&apos;m Laraib
          </span>
        </motion.p>

        {/* Single-row desktop: WEB DESIGN | Avatar | AUTOMATION */}
        <h1
          id="hero-heading"
          className="flex w-full max-w-full flex-col items-center justify-center gap-4 sm:gap-3 md:flex-row md:flex-nowrap md:items-center md:gap-3 lg:gap-4"
        >
          <motion.span
            initial={reduceMotion ? false : { opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className={`${wordClass} order-2 md:order-1`}
          >
            WEB DESIGN
          </motion.span>

          {/* Decorative inside the heading so the accessible name stays "WEB DESIGN AUTOMATION". */}
          <span
            aria-hidden
            className="order-1 flex shrink-0 items-center justify-center md:order-2"
          >
            <Avatar />
          </span>

          <motion.span
            initial={reduceMotion ? false : { opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.12 }}
            className={`${wordClass} order-3`}
          >
            AUTOMATION
          </motion.span>
        </h1>

        <motion.p
          initial={reduceMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mt-8 max-w-xl text-center text-base leading-relaxed text-muted sm:mt-10 sm:text-lg"
        >
          Results-driven WordPress Developer &amp; Automation Builder, crafting
          high-performance websites and n8n workflows.
        </motion.p>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:mt-10 sm:gap-4"
        >
          <MagneticButton
            href="/work"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-accent px-7 text-sm font-semibold tracking-tight text-dark shadow-[0_0_28px_color-mix(in_srgb,var(--accent)_40%,transparent)]"
          >
            Explore Work
          </MagneticButton>
          <MagneticButton
            href="/#contact"
            strength={14}
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-line bg-panel px-7 text-sm font-semibold tracking-tight text-foreground backdrop-blur-md hover:border-accent/50"
          >
            Get in Touch
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  );
}
