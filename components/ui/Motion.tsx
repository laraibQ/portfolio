"use client";

import { useRef, type MouseEvent, type ReactNode } from "react";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";

const MotionLink = motion.create(Link);

type MagneticButtonProps = {
  children: ReactNode;
  className?: string;
  href?: string;
  strength?: number;
  target?: string;
  rel?: string;
};

/** Internal routes go through next/link so navigation stays client-side. */
function isInternal(href: string, target?: string) {
  return !target && href.startsWith("/");
}

export function MagneticButton({
  children,
  className = "",
  href = "#",
  strength = 18,
  target,
  rel,
}: MagneticButtonProps) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 260, damping: 18, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 260, damping: 18, mass: 0.4 });

  function onMove(event: MouseEvent<HTMLAnchorElement>) {
    if (reduceMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const offsetX = event.clientX - rect.left - rect.width / 2;
    const offsetY = event.clientY - rect.top - rect.height / 2;
    x.set((offsetX / rect.width) * strength);
    y.set((offsetY / rect.height) * strength);
  }

  function onLeave() {
    x.set(0);
    y.set(0);
  }

  const shared = {
    ref,
    style: { x: springX, y: springY },
    onMouseMove: onMove,
    onMouseLeave: onLeave,
    whileHover: { scale: 1.03 },
    whileTap: { scale: 0.97 },
    className,
  };

  if (isInternal(href, target)) {
    return (
      <MotionLink href={href} {...shared}>
        {children}
      </MotionLink>
    );
  }

  return (
    <motion.a href={href} target={target} rel={rel} {...shared}>
      {children}
    </motion.a>
  );
}

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export function Reveal({ children, className = "", delay = 0 }: RevealProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 36, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}