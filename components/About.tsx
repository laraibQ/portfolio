"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { AboutAvatarSlot } from "@/components/AvatarSlots";
import { Reveal } from "@/components/ui/Motion";

const highlights = [
  { label: "2+ yrs", detail: "Production delivery" },
  { label: "Figma → WP", detail: "Pixel-accurate builds" },
  { label: "n8n", detail: "Automation systems" },
];

export default function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="relative border-t border-hairline bg-background dark:bg-[#0a0a0a]"
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="glow-orb top-1/4 left-0 h-64 w-64 bg-[color-mix(in_srgb,var(--accent)_10%,transparent)]" />
        <div className="glow-orb right-0 bottom-1/4 h-72 w-72 bg-[color-mix(in_srgb,var(--accent)_8%,transparent)]" />
      </div>

      <div className="mx-auto grid w-full max-w-6xl items-center gap-8 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[minmax(0,1fr)_240px_minmax(0,1fr)] lg:gap-8 lg:px-8 xl:gap-10">
        <Reveal className="flex flex-col gap-5 sm:gap-6">
          <h2
            id="about-heading"
            className="font-display text-5xl font-bold tracking-[-0.05em] text-foreground sm:text-6xl md:text-7xl"
          >
            Hey!
          </h2>

          <div className="max-w-md space-y-3 text-base leading-relaxed text-muted sm:text-lg">
            <p>
              I&apos;m{" "}
              <span className="font-medium text-foreground">Laraib</span>.
            </p>
            <p>
              Web designer &amp; automation builder shipping clean WordPress
              sites and n8n workflows that actually reduce work.
            </p>
            <p>
              I turn Figma into production-ready builds—pixel-accurate,
              responsive, and ready for real browsers, not just mockups.
            </p>
          </div>
        </Reveal>

        <div className="flex justify-center">
          <AboutAvatarSlot />
        </div>

        <Reveal delay={0.12} className="flex flex-col gap-5 sm:gap-6">
          <div className="grid gap-2.5">
            {highlights.map((item) => (
              <div
                key={item.label}
                className="glass-panel flex items-center justify-between gap-4 rounded-2xl px-4 py-2.5"
              >
                <span className="font-display text-base font-semibold tracking-tight text-foreground sm:text-lg">
                  {item.label}
                </span>
                <span className="text-right text-sm text-muted">
                  {item.detail}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-4 text-base leading-relaxed text-muted sm:text-lg">
            <p>
              Results-driven WordPress Developer with 2+ years building,
              customizing, and maintaining production sites for international
              clients—Elementor, custom themes, plugin integration, and clean
              handoff.
            </p>
            <p>
              Beyond the CMS layer, I build practical{" "}
              <span className="text-foreground">n8n automation</span> workflows—
              from client chatbots to outreach systems—so websites and
              operations move together.
            </p>
          </div>

          <Link
            href="/#contact"
            className="group inline-flex w-fit items-center gap-3 text-base font-medium text-foreground transition-colors hover:text-accent-text"
          >
            Get Started
            <span className="inline-flex size-9 items-center justify-center rounded-md border border-line bg-panel transition-all group-hover:border-accent/50 group-hover:shadow-[0_0_18px_color-mix(in_srgb,var(--accent)_28%,transparent)]">
              <ArrowUpRight className="size-4" strokeWidth={1.75} />
            </span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
