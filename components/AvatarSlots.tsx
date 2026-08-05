"use client";

import Avatar from "@/components/Avatar";

/** Shared frame chrome — matches the floating flip card. */
export const AVATAR_FRAME_CLASS =
  "relative overflow-hidden rounded-3xl border border-[#00BDF1]/40 bg-[#F8F9FA] shadow-[0_10px_36px_rgb(0_0_0/0.14),0_0_24px_color-mix(in_srgb,#00BDF1_22%,transparent)]";

export const HERO_AVATAR_SLOT_CLASS =
  "relative h-36 w-36 shrink-0 sm:h-40 sm:w-40 md:h-48 md:w-48";

export const ABOUT_AVATAR_SLOT_CLASS =
  "relative aspect-[3/4] w-[min(68vw,220px)] shrink-0 sm:w-[240px]";

/**
 * Layout anchors for the scroll-flip morph. Static avatars keep LCP / no-JS /
 * reduced-motion working; the floating card hides them once it takes over.
 */
export function HeroAvatarSlot() {
  return (
    <div
      data-avatar-slot="hero"
      className={HERO_AVATAR_SLOT_CLASS}
      aria-hidden
    >
      <div className="avatar-slot-static h-full w-full">
        <Avatar
          className="relative h-full w-full"
          sizes="(min-width: 768px) 192px, (min-width: 640px) 160px, 144px"
          priority
        />
      </div>
    </div>
  );
}

export function AboutAvatarSlot() {
  return (
    <div data-avatar-slot="about" className={ABOUT_AVATAR_SLOT_CLASS}>
      <div className="avatar-slot-static h-full w-full">
        <Avatar
          className="relative h-full w-full"
          sizes="(min-width: 640px) 240px, 68vw"
        />
      </div>
    </div>
  );
}
