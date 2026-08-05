"use client";

import { useLayoutEffect, useState, type RefObject } from "react";
import Image from "next/image";
import {
  cubicBezier,
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import avatarFront from "@/assets/avatar/laraib-avatar.png";
import avatarBack from "@/assets/avatar/laraib-avatar-smile.png";

type AvatarScrollFlipProps = {
  heroRef: RefObject<HTMLElement | null>;
  aboutRef: RefObject<HTMLElement | null>;
};

const FACE_CLASS =
  "absolute inset-0 overflow-hidden rounded-3xl border border-[#00BDF1]/40 bg-[#F8F9FA] shadow-[0_10px_36px_rgb(0_0_0/0.14),0_0_24px_color-mix(in_srgb,#00BDF1_22%,transparent)]";

/** Soft ease shared by rotate + position morph. */
const scrollEase = cubicBezier(0.45, 0, 0.55, 1);

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

function docTop(el: Element) {
  return el.getBoundingClientRect().top + window.scrollY;
}

/**
 * Dual-face 3D card that morphs from the Hero slot into the About slot.
 *
 * At scrollYProgress = 0 the card is pinned exactly to the hero headline gap
 * (WEB DESIGN · avatar · AUTOMATION). Motion only begins after the user
 * scrolls, finishing when the About avatar slot sits under the nav.
 */
export default function AvatarScrollFlip({
  heroRef,
  aboutRef,
}: AvatarScrollFlipProps) {
  const reduceMotion = useReducedMotion();
  const [ready, setReady] = useState(false);

  const { scrollY } = useScroll();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const width = useMotionValue(0);
  const height = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const opacity = useMotionValue(0);

  useLayoutEffect(() => {
    if (reduceMotion) {
      document.documentElement.removeAttribute("data-avatar-flip");
      setReady(false);
      return;
    }

    const heroSlot = document.querySelector<HTMLElement>(
      '[data-avatar-slot="hero"]',
    );
    if (heroSlot) {
      const r = heroSlot.getBoundingClientRect();
      x.set(r.left);
      y.set(r.top);
      width.set(r.width);
      height.set(r.height);
      rotateY.set(0);
      opacity.set(1);
      document.documentElement.setAttribute("data-avatar-flip", "on");
    }

    setReady(true);

    return () => {
      document.documentElement.removeAttribute("data-avatar-flip");
    };
  }, [reduceMotion, x, y, width, height, rotateY, opacity]);

  useAnimationFrame(() => {
    if (reduceMotion || !ready) return;

    const heroSlot = document.querySelector<HTMLElement>(
      '[data-avatar-slot="hero"]',
    );
    const aboutSlot = document.querySelector<HTMLElement>(
      '[data-avatar-slot="about"]',
    );
    if (!heroSlot || !aboutSlot || !heroRef.current || !aboutRef.current) {
      opacity.set(0);
      document.documentElement.removeAttribute("data-avatar-flip");
      return;
    }

    document.documentElement.setAttribute("data-avatar-flip", "on");

    const from = heroSlot.getBoundingClientRect();
    const to = aboutSlot.getBoundingClientRect();

    /*
     * Document-space runway:
     * - start = 0 → progress is exactly 0 at the page top (hero slot)
     * - end   = when the about slot would rest just under the sticky nav
     */
    const startY = 0;
    const endY = Math.max(startY + 1, docTop(aboutSlot) - 112);
    const raw = clamp01((scrollY.get() - startY) / (endY - startY));
    const t = scrollEase(raw);

    x.set(lerp(from.left, to.left, t));
    y.set(lerp(from.top, to.top, t));
    width.set(lerp(from.width, to.width, t));
    height.set(lerp(from.height, to.height, t));
    rotateY.set(t * 360);
    opacity.set(1);
  });

  if (reduceMotion || !ready) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-40 will-change-transform"
      style={{
        x,
        y,
        width,
        height,
        opacity,
        perspective: 1000,
      }}
    >
      <motion.div
        className="relative h-full w-full [transform-style:preserve-3d]"
        style={{ rotateY }}
      >
        <div
          className={FACE_CLASS}
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          <Image
            src={avatarFront}
            alt=""
            width={480}
            height={480}
            sizes="(min-width: 768px) 240px, 192px"
            placeholder="blur"
            className="h-full w-full object-cover object-[center_18%]"
            priority
          />
        </div>

        <div
          className={FACE_CLASS}
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <Image
            src={avatarBack}
            alt=""
            width={480}
            height={480}
            sizes="(min-width: 768px) 240px, 192px"
            placeholder="blur"
            className="h-full w-full object-cover object-[center_18%]"
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
