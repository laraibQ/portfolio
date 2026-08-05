"use client";

import {
  useLayoutEffect,
  useRef,
  type ReactNode,
  type MouseEvent as ReactMouseEvent,
} from "react";
import Link from "next/link";
import { ensureGsap, gsap, shouldAnimate, EASE } from "@/lib/gsap";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Vertical travel in px before settling. */
  y?: number;
};

/**
 * Scroll-triggered fade/slide. Content stays visible if JS never runs —
 * the "from" state is applied only inside useLayoutEffect after mount.
 */
export function Reveal({
  children,
  className = "",
  delay = 0,
  y = 40,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !shouldAnimate()) return;

    ensureGsap();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { autoAlpha: 0, y, scale: 0.98 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.85,
          delay,
          ease: EASE,
          clearProps: "transform",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            once: true,
          },
        },
      );
    }, el);

    return () => ctx.revert();
  }, [delay, y]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

type StaggerProps = {
  children: ReactNode;
  className?: string;
  itemSelector?: string;
  stagger?: number;
  y?: number;
  as?: "div" | "ol" | "ul";
};

export function Stagger({
  children,
  className = "",
  itemSelector,
  stagger = 0.08,
  y = 36,
  as: Tag = "div",
}: StaggerProps) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !shouldAnimate()) return;

    ensureGsap();
    const items = itemSelector
      ? el.querySelectorAll(itemSelector)
      : el.children;
    if (!items.length) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        items,
        { autoAlpha: 0, y, scale: 0.98 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.75,
          ease: EASE,
          stagger,
          clearProps: "transform",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            once: true,
          },
        },
      );
    }, el);

    return () => ctx.revert();
  }, [itemSelector, stagger, y]);

  return (
    <Tag ref={ref as never} className={className}>
      {children}
    </Tag>
  );
}

type MagneticLinkProps = {
  children: ReactNode;
  href: string;
  className?: string;
  strength?: number;
};

/** Hover magnetism via gsap.quickTo — never touches opacity. */
export function MagneticLink({
  children,
  href,
  className = "",
  strength = 18,
}: MagneticLinkProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const xTo = useRef<ReturnType<typeof gsap.quickTo> | null>(null);
  const yTo = useRef<ReturnType<typeof gsap.quickTo> | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !shouldAnimate()) return;
    ensureGsap();
    xTo.current = gsap.quickTo(el, "x", { duration: 0.35, ease: EASE });
    yTo.current = gsap.quickTo(el, "y", { duration: 0.35, ease: EASE });
  }, []);

  function onMove(event: ReactMouseEvent<HTMLAnchorElement>) {
    if (!ref.current || !xTo.current || !yTo.current) return;
    const rect = ref.current.getBoundingClientRect();
    xTo.current(((event.clientX - rect.left) / rect.width - 0.5) * strength);
    yTo.current(((event.clientY - rect.top) / rect.height - 0.5) * strength);
  }

  function onLeave() {
    xTo.current?.(0);
    yTo.current?.(0);
  }

  return (
    <Link
      ref={ref}
      href={href}
      className={className}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
    </Link>
  );
}
