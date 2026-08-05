"use client";

import { useLayoutEffect, useRef } from "react";
import { ensureGsap, gsap, shouldAnimate } from "@/lib/gsap";

/**
 * Soft parallax on decorative glow orbs. Scrubbed to scroll so the atmosphere
 * moves with the reader without competing for the primary action.
 */
export default function ParallaxOrbs() {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el || !shouldAnimate()) return;

    ensureGsap();
    const orbs = el.querySelectorAll<HTMLElement>("[data-parallax]");
    if (!orbs.length) return;

    const ctx = gsap.context(() => {
      orbs.forEach((orb) => {
        const speed = Number(orb.dataset.parallax) || 40;
        gsap.to(orb, {
          y: speed,
          ease: "none",
          scrollTrigger: {
            trigger: document.documentElement,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
          },
        });
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={root}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div
        data-parallax="-80"
        className="glow-orb absolute top-[12%] left-[6%] h-[340px] w-[340px] bg-[color-mix(in_srgb,var(--accent)_14%,transparent)]"
      />
      <div
        data-parallax="120"
        className="glow-orb absolute top-[48%] right-[-4%] h-[420px] w-[420px] bg-[color-mix(in_srgb,var(--accent)_10%,transparent)]"
      />
      <div
        data-parallax="-60"
        className="glow-orb absolute bottom-[8%] left-[35%] h-[280px] w-[280px] bg-[color-mix(in_srgb,var(--accent)_8%,transparent)]"
      />
    </div>
  );
}
