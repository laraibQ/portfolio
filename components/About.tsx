"use client";

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
      className="relative border-t border-hairline"
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="glow-orb top-1/3 right-0 h-72 w-72 bg-[color-mix(in_srgb,var(--accent)_12%,transparent)]" />
      </div>

      <div className="mx-auto grid w-full max-w-6xl gap-12 px-4 py-24 sm:px-6 sm:py-32 lg:grid-cols-[1fr_1.15fr] lg:gap-20 lg:px-8">
        <Reveal>
          <p className="mb-4 text-[11px] font-medium tracking-[0.22em] text-accent-text uppercase">
            About
          </p>
          <h2
            id="about-heading"
            className="font-display text-4xl font-bold tracking-[-0.04em] text-foreground sm:text-5xl"
          >
            Built for clarity,
            <br />
            shipped for production.
          </h2>

          <div className="mt-10 grid gap-3">
            {highlights.map((item, index) => (
              <Reveal key={item.label} delay={0.08 * (index + 1)}>
                <div className="glass-panel flex items-center justify-between rounded-2xl px-4 py-3">
                  <span className="font-display text-lg font-semibold tracking-tight text-foreground">
                    {item.label}
                  </span>
                  <span className="text-sm text-muted">{item.detail}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.12} className="space-y-6 text-base leading-relaxed text-muted sm:text-lg">
          <p>
            I&apos;m a results-driven WordPress Developer with 2+ years of
            hands-on experience building, customizing, and maintaining
            production-grade sites for international clients. From Elementor and
            custom themes to plugin integration and Figma-to-code delivery, I
            care about pixel accuracy, responsive performance, and clean design
            that holds up in the browser—not just the mockup.
          </p>
          <p>
            Beyond the CMS layer, I build practical{" "}
            <span className="text-foreground">n8n automation</span> workflows—
            from client communication bots to outreach systems that cut manual
            work—so websites and operations move together.
          </p>
          <p>
            Currently pursuing a{" "}
            <span className="text-foreground">
              BSc in Computer Science at the University of Education, Lahore
            </span>
            , while shipping remotely with global teams under tight deadlines.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
