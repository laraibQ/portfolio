"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";

const NAV_LINKS = [
  { href: "/#about", label: "About", homeHash: "#about" },
  { href: "/#services", label: "Services", homeHash: "#services" },
  { href: "/work", label: "Work", homeHash: null },
  { href: "/#experience", label: "Experience", homeHash: "#experience" },
  { href: "/#contact", label: "Contact", homeHash: "#contact" },
] as const;

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-line bg-background/80 shadow-[0_10px_40px_rgb(0_0_0/0.08)] backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="group flex items-center gap-2 font-display text-sm font-semibold tracking-tight text-foreground sm:text-base"
        >
          <span className="size-1.5 rounded-full bg-accent shadow-[0_0_12px_var(--accent)]" />
          <span className="transition-colors group-hover:text-accent-text">
            Laraib Mujahid
          </span>
        </Link>

        <nav
          aria-label="Primary"
          className="glass-panel hidden items-center gap-1 rounded-full px-2 py-1 md:flex"
        >
          {NAV_LINKS.map((link) => {
            const href = isHome && link.homeHash ? link.homeHash : link.href;
            const active = link.href === "/work" && pathname === "/work";

            return (
              <Link
                key={link.href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium tracking-wide transition-colors hover:bg-panel-strong hover:text-foreground ${
                  active ? "bg-panel-strong text-accent-text" : "text-muted"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <span className="hidden items-center gap-2 text-[11px] font-medium tracking-[0.14em] text-accent-text uppercase sm:inline-flex">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-accent" />
            </span>
            Available
          </span>

          <ThemeToggle />

          <motion.button
            type="button"
            whileTap={{ scale: 0.94 }}
            className="relative inline-flex size-9 items-center justify-center rounded-full border border-line bg-panel text-foreground backdrop-blur-md before:absolute before:top-1/2 before:left-1/2 before:size-11 before:-translate-x-1/2 before:-translate-y-1/2 before:content-[''] md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-nav"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="border-t border-line bg-background/95 backdrop-blur-xl md:hidden"
          >
            <nav aria-label="Mobile" className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-5">
              {NAV_LINKS.map((link, index) => {
                const href = isHome && link.homeHash ? link.homeHash : link.href;
                const active = link.href === "/work" && pathname === "/work";

                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={href}
                      onClick={() => setOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className="flex min-h-11 items-center rounded-xl px-3 text-sm text-muted transition-colors hover:bg-panel-strong hover:text-accent-text"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.header>
  );
}
