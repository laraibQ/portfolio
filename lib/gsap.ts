import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

/** Idempotent — safe to call from every client module that touches GSAP. */
export function ensureGsap() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

export function prefersReducedMotion() {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Gate for scroll/hover choreography. Content must paint without this —
 * animations only enhance after mount. Disabled in Vitest so queries see
 * visible nodes, and when the user asks for reduced motion.
 */
export function shouldAnimate() {
  if (typeof window === "undefined") return false;
  if (process.env.NODE_ENV === "test" || process.env.VITEST) return false;
  return !prefersReducedMotion();
}

/** Shared easing used across scroll reveals and micro-interactions. */
export const EASE = "power3.out";

export { gsap, ScrollTrigger };
