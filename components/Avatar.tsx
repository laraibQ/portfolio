"use client";

import { useState } from "react";
import Image from "next/image";
import avatarNeutral from "@/assets/avatar/laraib-avatar.png";
import avatarSmile from "@/assets/avatar/laraib-avatar-smile.png";

const FRAME_CLASS =
  "relative h-full w-full overflow-hidden rounded-3xl border border-[#00BDF1]/40 bg-[#F8F9FA] shadow-[0_10px_36px_rgb(0_0_0/0.14),0_0_24px_color-mix(in_srgb,#00BDF1_22%,transparent)]";

type AvatarProps = {
  /** Outer size box. Defaults to the compact Hero treatment. */
  className?: string;
  sizes?: string;
  priority?: boolean;
};

/**
 * Statically imported so Next resizes them to the render box and serves
 * AVIF/WebP; the 2MB masters in `assets/` are never shipped to the browser.
 *
 * Float and hover crossfade are CSS rather than JS motion, because the Hero
 * instance sits in the LCP region and must not depend on hydration to paint.
 */
export default function Avatar({
  className = "relative h-36 w-36 shrink-0 sm:h-40 sm:w-40 md:h-48 md:w-48",
  sizes = "(min-width: 768px) 192px, (min-width: 640px) 160px, 144px",
  priority = false,
}: AvatarProps) {
  const [failed, setFailed] = useState(false);
  // The smile is only fetched once a pointer arrives, so touch devices — where
  // hover is unreachable anyway — never pay for a second image.
  const [smileMounted, setSmileMounted] = useState(false);

  return (
    <div className={className}>
      {failed ? (
        <div
          className={`${FRAME_CLASS} flex items-center justify-center font-display text-3xl font-bold text-[#0F0F0F]`}
        >
          LM
        </div>
      ) : (
        <div
          className={`avatar-float group ${FRAME_CLASS}`}
          onPointerEnter={() => setSmileMounted(true)}
        >
          <Image
            src={avatarNeutral}
            alt="Illustrated portrait of Laraib Mujahid"
            sizes={sizes}
            placeholder="blur"
            priority={priority}
            className="h-full w-full object-cover object-[center_18%]"
            onError={() => setFailed(true)}
          />
          {smileMounted ? (
            <Image
              src={avatarSmile}
              alt=""
              aria-hidden
              sizes={sizes}
              placeholder="blur"
              className="absolute inset-0 h-full w-full object-cover object-[center_18%] opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100"
            />
          ) : null}
        </div>
      )}
    </div>
  );
}
