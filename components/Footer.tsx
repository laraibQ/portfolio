"use client";

import { ArrowUp, Mail } from "lucide-react";
import { contactInfo } from "@/data/portfolioData";
import { Reveal } from "@/components/ui/Motion";

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const year = new Date().getFullYear();

export default function Footer() {
  return (
    <Reveal>
      <footer className="border-t border-hairline">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 sm:py-12 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="space-y-2">
            <a
              href="#top"
              className="font-display text-lg font-bold tracking-tight text-foreground transition-colors hover:text-accent-text"
            >
              {contactInfo.name}
            </a>
            <p className="text-sm text-subtle">
              WordPress Developer · Automation Builder
            </p>
            <p className="text-xs text-subtle">
              © {year} {contactInfo.name}. Crafted with intention.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={contactInfo.emailHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Email"
              className="inline-flex size-11 items-center justify-center rounded-full border border-line bg-panel text-muted backdrop-blur-md transition-transform hover:scale-105 hover:border-accent hover:text-accent-text"
            >
              <Mail className="size-4" strokeWidth={1.75} />
            </a>
            <a
              href={contactInfo.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="inline-flex size-11 items-center justify-center rounded-full border border-line bg-panel text-muted backdrop-blur-md transition-transform hover:scale-105 hover:border-accent hover:text-accent-text"
            >
              <LinkedInIcon className="size-4" />
            </a>
            <a
              href="#top"
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-panel px-4 text-xs font-medium tracking-wide text-muted backdrop-blur-md transition-colors hover:border-accent hover:text-accent-text"
            >
              Back to top
              <ArrowUp className="size-3.5" strokeWidth={1.75} />
            </a>
          </div>
        </div>
      </footer>
    </Reveal>
  );
}
