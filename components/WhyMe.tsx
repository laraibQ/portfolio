"use client";

import { useLayoutEffect, useRef } from "react";
import { ensureGsap, gsap, shouldAnimate } from "@/lib/gsap";

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

/**
 * Stack lives only inside Why Me. The section itself is NOT pinned — a tall
 * track on the right drives the scrub, while left copy + card viewport use
 * CSS sticky. That way About / Services / Tech Stack scroll normally afterward
 * instead of sliding over a pinned section.
 */
export default function WhyMe() {
  const trackRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLOListElement>(null);

  useLayoutEffect(() => {
    const track = trackRef.current;
    const stack = stackRef.current;
    if (!track || !stack || !shouldAnimate()) return;

    ensureGsap();
    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      const cards = gsap.utils.toArray<HTMLElement>(
        stack.querySelectorAll("[data-stack-card]"),
      );
      if (cards.length < 2) return;

      const tallest = Math.max(...cards.map((card) => card.offsetHeight));
      // Keep CSS `position: sticky` — overriding it with `relative` was letting
      // the stack scroll off-screen while only the left column stayed put.
      gsap.set(stack, {
        height: tallest,
        overflow: "hidden",
      });
      gsap.set(cards, {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        marginBottom: 0,
      });

      gsap.set(cards[0], { yPercent: 0, zIndex: 100 });
      cards.slice(1).forEach((card, i) => {
        gsap.set(card, { yPercent: 110, zIndex: 140 + i * 40 });
      });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: track,
          start: "top top+=112",
          end: "bottom bottom",
          scrub: 0.7,
          invalidateOnRefresh: true,
        },
      });

      cards.slice(1).forEach((card) => {
        tl.to(card, { yPercent: 0, duration: 1 });
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      id="why-me"
      aria-labelledby="why-me-heading"
      className="relative z-0 border-t border-hairline"
    >
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-4 py-24 sm:px-6 sm:py-32 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-20 lg:px-8">
        <aside className="lg:sticky lg:top-28 lg:self-start">
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
        </aside>

        {/* Tall track = scroll distance for the stack. Not a page pin. */}
        <div
          ref={trackRef}
          className="relative lg:h-[min(320vh,2200px)]"
        >
          <ol
            ref={stackRef}
            className="relative flex flex-col gap-4 lg:sticky lg:top-28"
          >
            {reasons.map((reason, index) => (
              <li
                key={reason.title}
                data-stack-card
                className="relative"
                style={{ zIndex: 100 + index * 40 }}
              >
                <article className="rounded-3xl border border-line bg-background p-6 shadow-[0_24px_70px_rgb(0_0_0/0.28)] sm:p-7">
                  <div className="flex gap-5">
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
                  </div>
                </article>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
