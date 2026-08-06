"use client";

import { ArrowUpRight } from "lucide-react";
import { outcomeProofs, referencesNote } from "@/data/portfolioData";
import { Reveal, Stagger } from "@/components/ui/Motion";

export default function Outcomes() {
  return (
    <section
      id="outcomes"
      aria-labelledby="outcomes-heading"
      className="relative border-t border-hairline"
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <Reveal className="mb-14 max-w-2xl sm:mb-16">
          <p className="mb-4 text-[11px] font-medium tracking-[0.22em] text-accent-text uppercase">
            Outcomes
          </p>
          <h2
            id="outcomes-heading"
            className="font-display text-4xl font-bold tracking-[-0.04em] text-foreground sm:text-5xl md:text-6xl"
          >
            Proof from
            <br />
            shipped work.
          </h2>
          <p className="mt-5 text-base text-muted sm:text-lg">
            Measurable results from live projects—not invented quotes. Named
            client testimonials replace these when written permission lands.
          </p>
        </Reveal>

        <Stagger className="grid gap-4 md:grid-cols-3 lg:gap-5" stagger={0.08}>
          {outcomeProofs.map((item) => {
            const body = (
              <>
                <p className="text-[11px] font-medium tracking-[0.16em] text-accent-text uppercase">
                  {item.metric}
                </p>
                <p className="mt-4 text-base leading-relaxed text-foreground sm:text-lg">
                  {item.statement}
                </p>
                <div className="mt-8 flex items-center justify-between gap-3 border-t border-hairline pt-4">
                  <span className="text-sm text-muted">{item.project}</span>
                  {item.url ? (
                    <ArrowUpRight
                      className="size-4 shrink-0 text-muted transition-colors group-hover:text-accent-text"
                      strokeWidth={1.75}
                    />
                  ) : null}
                </div>
              </>
            );

            if (item.url) {
              return (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group glass-panel flex flex-col rounded-3xl p-6 transition-transform duration-300 hover:-translate-y-1 sm:p-7"
                >
                  {body}
                  <span className="sr-only">
                    {" "}
                    — {item.project} (opens in a new tab)
                  </span>
                </a>
              );
            }

            return (
              <article
                key={item.id}
                className="glass-panel flex flex-col rounded-3xl p-6 sm:p-7"
              >
                {body}
              </article>
            );
          })}
        </Stagger>

        <Reveal delay={0.15} className="mt-10">
          <p className="max-w-2xl text-sm text-subtle">{referencesNote}</p>
        </Reveal>
      </div>
    </section>
  );
}
