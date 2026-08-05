"use client";

import { useLayoutEffect, useRef } from "react";
import { ensureGsap, gsap, shouldAnimate } from "@/lib/gsap";

/**
 * Thin accent bar that tracks document scroll. Sits above the sticky navbar
 * so it never competes with content for attention — a quiet orientation cue.
 */
export default function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !shouldAnimate()) return;

    ensureGsap();
    const ctx = gsap.context(() => {
      gsap.set(el, { scaleX: 0, transformOrigin: "left center" });
      gsap.to(el, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.35,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-0.5 bg-transparent"
    >
      <div
        ref={ref}
        className="h-full w-full bg-accent shadow-[0_0_12px_color-mix(in_srgb,var(--accent)_55%,transparent)]"
      />
    </div>
  );
}
