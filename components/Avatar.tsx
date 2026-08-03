"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import avatarNeutral from "@/assets/avatar/laraib-avatar.png";
import avatarSmile from "@/assets/avatar/laraib-avatar-smile.png";

const SIZES = "(min-width: 768px) 192px, (min-width: 640px) 160px, 144px";

/**
 * Statically imported so Next resizes them to the ~192px render box and serves
 * AVIF/WebP; the 2MB masters in `assets/` are never shipped to the browser.
 */
export default function Avatar() {
  const reduceMotion = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const [failed, setFailed] = useState(false);

  return (
    <motion.div
      className="relative h-36 w-36 shrink-0 sm:h-40 sm:w-40 md:h-48 md:w-48"
      initial={reduceMotion ? false : { opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      <motion.div
        className="relative h-full w-full overflow-hidden rounded-3xl border border-[#00BDF1]/40 bg-[#F8F9FA] shadow-[0_10px_36px_rgb(0_0_0/0.14),0_0_24px_color-mix(in_srgb,#00BDF1_22%,transparent)]"
        animate={reduceMotion ? undefined : { y: [-5, 5, -5] }}
        transition={
          reduceMotion
            ? undefined
            : { duration: 5, repeat: Infinity, ease: "easeInOut" }
        }
      >
        {failed ? (
          <div className="flex h-full w-full items-center justify-center bg-[#F8F9FA] font-display text-3xl font-bold text-[#0F0F0F]">
            LM
          </div>
        ) : (
          <>
            <Image
              src={avatarNeutral}
              alt="Illustrated portrait of Laraib Mujahid"
              sizes={SIZES}
              placeholder="blur"
              priority
              className="h-full w-full object-cover object-[center_18%]"
              onError={() => setFailed(true)}
            />
            <motion.div
              className="absolute inset-0"
              initial={false}
              animate={{ opacity: hovered ? 1 : 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              aria-hidden
            >
              <Image
                src={avatarSmile}
                alt=""
                sizes={SIZES}
                placeholder="blur"
                className="h-full w-full object-cover object-[center_18%]"
                onError={() => setFailed(true)}
              />
            </motion.div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
