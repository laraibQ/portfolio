"use client";

import { ArrowUpRight } from "lucide-react";
import { featuredCaseStudies } from "@/data/portfolioData";
import { Reveal, Stagger } from "@/components/ui/Motion";

const steps = [
  { key: "problem", label: "Problem" },
  { key: "role", label: "My role" },
  { key: "solution", label: "Solution" },
  { key: "result", label: "Result" },
] as const;

export default function CaseStudies() {
  return (
    <section
      id="case-studies"
      aria-labelledby="case-studies-heading"
      className="relative border-t border-hairline"
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <Reveal className="mb-14 max-w-2xl sm:mb-16">
          <p className="mb-4 text-[11px] font-medium tracking-[0.22em] text-accent-text uppercase">
            Case Studies
          </p>
          <h2
            id="case-studies-heading"
            className="font-display text-4xl font-bold tracking-[-0.04em] text-foreground sm:text-5xl md:text-6xl"
          >
            Problem, role,
            <br />
            solution, result.
          </h2>
          <p className="mt-5 text-base text-muted sm:text-lg">
            Three builds broken down the way hiring managers scan—what broke,
            what I owned, what shipped, and the measurable outcome.
          </p>
        </Reveal>

        <Stagger className="grid gap-6 lg:gap-8" stagger={0.1}>
          {featuredCaseStudies.map((project, index) => {
            const study = project.caseStudy;
            const narrative = {
              problem: study.problem,
              role: study.role,
              solution: study.solution,
              result: study.result,
            };

            return (
              <article
                key={project.id}
                className="border-t border-hairline pt-8 first:border-t-0 first:pt-0 sm:pt-10"
              >
                <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-12">
                  <div>
                    <p className="text-[11px] font-medium tracking-[0.2em] text-subtle uppercase">
                      {String(index + 1).padStart(2, "0")}
                    </p>
                    <h3 className="mt-3 font-display text-2xl font-bold tracking-[-0.03em] text-foreground sm:text-3xl">
                      {project.title}
                    </h3>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 text-[10px] font-semibold tracking-[0.14em] text-accent-text uppercase">
                        {project.ownership}
                      </span>
                      <span className="rounded-full border border-line bg-panel px-2.5 py-1 text-[10px] font-semibold tracking-[0.14em] text-muted uppercase">
                        {project.metric}
                      </span>
                    </div>
                    {project.url ? (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-accent-text transition-colors hover:text-foreground"
                      >
                        View live site
                        <ArrowUpRight className="size-4" strokeWidth={1.75} />
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    ) : project.workflow ? (
                      <div className="mt-6">
                        <p className="mb-3 text-[11px] font-medium tracking-[0.16em] text-subtle uppercase">
                          Workflow
                        </p>
                        <ol className="flex flex-wrap gap-2">
                          {project.workflow.map((step, stepIndex) => (
                            <li
                              key={step}
                              className="inline-flex items-center gap-2 rounded-full border border-line bg-panel px-3 py-1.5 text-[11px] tracking-wide text-muted"
                            >
                              <span className="font-mono text-[10px] text-accent-text">
                                {String(stepIndex + 1).padStart(2, "0")}
                              </span>
                              {step}
                            </li>
                          ))}
                        </ol>
                      </div>
                    ) : null}
                  </div>

                  <dl className="grid gap-5 sm:grid-cols-2">
                    {steps.map((step) => (
                      <div key={step.key} className="space-y-2">
                        <dt className="text-[11px] font-medium tracking-[0.18em] text-accent-text uppercase">
                          {step.label}
                        </dt>
                        <dd className="text-sm leading-relaxed text-muted sm:text-[15px]">
                          {narrative[step.key]}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </article>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
