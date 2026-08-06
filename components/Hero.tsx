import { MagneticLink } from "@/components/ui/Motion";
import { HeroAvatarSlot } from "@/components/AvatarSlots";
import { openTo } from "@/data/portfolioData";

/*
 * Mobile (stacked): sized so AUTOMATION fits.
 * Desktop (inline with avatar): fluid vw clamp so W…N stay inside the row.
 */
const wordClass =
  "whitespace-nowrap font-display font-extrabold leading-none tracking-[-0.05em] text-foreground text-[clamp(1.65rem,7.5vw,2.15rem)] sm:text-4xl md:text-[clamp(1.25rem,2.4vw,2.15rem)] lg:text-[clamp(1.4rem,2.6vw,2.4rem)]";

/**
 * Server-rendered LCP region. Entrance motion is CSS-only (no opacity fade on
 * the paint-critical nodes). MagneticLink adds hover magnetism without hiding
 * content before hydration. The avatar slot keeps a static image for LCP; the
 * scroll-flip card overlays it after hydrate.
 */
export default function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative isolate flex min-h-svh items-center overflow-x-clip pt-16"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-background" />
        <div className="site-grid absolute inset-0" />
        <div className="glow-orb top-[-8%] left-1/2 h-[420px] w-[420px] -translate-x-1/2 bg-[color-mix(in_srgb,var(--accent)_16%,transparent)]" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="mx-auto flex w-full max-w-6xl flex-col items-center px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <p className="enter-up mb-8 inline-flex items-center gap-2 rounded-full border border-line bg-panel px-4 py-1.5 backdrop-blur-md">
          <span className="size-1.5 rounded-full bg-accent shadow-[0_0_10px_var(--accent)]" />
          <span className="text-[11px] font-medium tracking-[0.16em] text-muted uppercase">
            Hi, I&apos;m Laraib
          </span>
        </p>

        <h1
          id="hero-heading"
          className="flex w-full max-w-full flex-col items-center justify-center gap-4 px-1 sm:gap-3 md:flex-row md:flex-nowrap md:items-center md:justify-center md:gap-2 lg:gap-3"
        >
          <span
            className={`${wordClass} enter-left order-2 [animation-delay:80ms] md:order-1`}
          >
            WEB DESIGN
          </span>

          <span className="order-1 flex shrink-0 items-center justify-center md:order-2">
            <HeroAvatarSlot />
          </span>

          <span
            className={`${wordClass} enter-right order-3 [animation-delay:120ms] md:order-3`}
          >
            AUTOMATION
          </span>
        </h1>

        <p className="enter-up mt-8 max-w-xl text-center text-base leading-relaxed text-muted [animation-delay:200ms] sm:mt-10 sm:text-lg">
          Results-driven Website Designer &amp; Automation Builder, crafting
          high-performance websites and n8n workflows.
        </p>

        <p className="enter-up mt-4 text-center text-[11px] font-medium tracking-[0.18em] text-subtle uppercase [animation-delay:240ms]">
          Open to · {openTo.short}
        </p>

        <div className="enter-up mt-8 flex flex-wrap items-center justify-center gap-3 [animation-delay:280ms] sm:mt-10 sm:gap-4">
          <MagneticLink
            href="/work"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-accent px-7 text-sm font-semibold tracking-tight text-dark shadow-[0_0_28px_color-mix(in_srgb,var(--accent)_40%,transparent)]"
          >
            Explore Work
          </MagneticLink>
          <MagneticLink
            href="/#contact"
            strength={14}
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-line bg-panel px-7 text-sm font-semibold tracking-tight text-foreground backdrop-blur-md hover:border-accent/50"
          >
            Get in Touch
          </MagneticLink>
        </div>
      </div>
    </section>
  );
}
