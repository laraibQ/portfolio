"use client";

import { useRef, type ReactNode } from "react";
import AvatarScrollFlip from "@/components/AvatarScrollFlip";

type HeroAboutBridgeProps = {
  hero: ReactNode;
  about: ReactNode;
};

/**
 * Provides stable section refs for the Hero → About avatar morph so useScroll
 * can target the real runway (hero start → about settle) instead of a short
 * viewport-only window.
 */
export default function HeroAboutBridge({ hero, about }: HeroAboutBridgeProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative">
      <div ref={heroRef} data-avatar-track="hero">
        {hero}
      </div>
      <div ref={aboutRef} data-avatar-track="about">
        {about}
      </div>
      <AvatarScrollFlip heroRef={heroRef} aboutRef={aboutRef} />
    </div>
  );
}
