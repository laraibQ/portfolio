"use client";

import {
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import {
  projects,
  projectFilters,
  type Project,
  type ProjectFilterId,
} from "@/data/portfolioData";
import { ensureGsap, gsap, shouldAnimate, EASE } from "@/lib/gsap";

function categoryLabel(category: Project["category"]) {
  if (category === "automation") return "Automation";
  if (category === "uiux") return "UI/UX Design";
  return "Web Design";
}

function WorkCard({ project }: { project: Project }) {
  const isLive = Boolean(project.url);
  const className = `bento-card group flex min-h-[260px] flex-col justify-between rounded-3xl p-6 transition-transform duration-300 hover:-translate-y-1.5 sm:p-7 ${
    isLive ? "cursor-pointer" : ""
  }`;

  const content = (
    <>
      <div>
        <div className="mb-5 flex items-start justify-between gap-3">
          <span className="rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 text-[10px] font-semibold tracking-[0.16em] text-accent-text uppercase">
            {categoryLabel(project.category)}
          </span>
          {isLive ? (
            <span
              aria-hidden
              className="inline-flex size-9 items-center justify-center rounded-full border border-line bg-panel text-muted transition-all group-hover:border-accent/40 group-hover:text-accent-text"
            >
              <ArrowUpRight className="size-4" strokeWidth={1.75} />
            </span>
          ) : null}
        </div>

        <h2 className="font-display text-2xl font-bold tracking-[-0.03em] text-foreground transition-colors group-hover:text-accent-text sm:text-3xl">
          {project.title}
          {isLive ? <span className="sr-only"> (opens in a new tab)</span> : null}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
          {project.description}
        </p>
      </div>

      <ul className="mt-8 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <li
            key={tag}
            className="rounded-full border border-line bg-panel px-3 py-1 text-[11px] tracking-wide text-muted transition-all group-hover:border-accent/30 group-hover:text-accent-text"
          >
            {tag}
          </li>
        ))}
      </ul>
    </>
  );

  if (isLive) {
    return (
      <a
        href={project.url!}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        data-work-card
      >
        {content}
      </a>
    );
  }

  return (
    <div className={className} data-work-card>
      {content}
    </div>
  );
}

export default function WorkClient() {
  const [filter, setFilter] = useState<ProjectFilterId>("all");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const gridRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    if (filter === "all") return projects;
    return projects.filter((project) => project.category === filter);
  }, [filter]);

  useLayoutEffect(() => {
    const grid = gridRef.current;
    if (!grid || !shouldAnimate()) return;

    ensureGsap();
    const cards = grid.querySelectorAll("[data-work-card]");
    if (!cards.length) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        { autoAlpha: 0, y: 24, scale: 0.98 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.45,
          stagger: 0.05,
          ease: EASE,
        },
      );
    }, grid);

    return () => ctx.revert();
  }, [filter]);

  function onTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const lastIndex = projectFilters.length - 1;
    let nextIndex: number | null = null;

    if (event.key === "ArrowRight") nextIndex = index === lastIndex ? 0 : index + 1;
    if (event.key === "ArrowLeft") nextIndex = index === 0 ? lastIndex : index - 1;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = lastIndex;
    if (nextIndex === null) return;

    event.preventDefault();
    setFilter(projectFilters[nextIndex]!.id);
    tabRefs.current[nextIndex]?.focus();
  }

  return (
    <div className="relative min-h-[calc(100svh-4rem)] overflow-x-hidden pt-16">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="site-grid absolute inset-0 opacity-70" />
        <div className="glow-orb top-20 right-[10%] h-80 w-80 bg-[color-mix(in_srgb,var(--accent)_16%,transparent)]" />
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="enter-up">
          <Link
            href="/#projects"
            className="mb-8 inline-flex min-h-11 items-center gap-2 text-sm text-muted transition-colors hover:text-accent-text"
          >
            <ArrowLeft className="size-4" strokeWidth={1.75} />
            Back to home
          </Link>

          <p className="mb-4 text-[11px] font-medium tracking-[0.22em] text-accent-text uppercase">
            Portfolio
          </p>
          <h1 className="font-display text-4xl font-bold tracking-[-0.04em] text-foreground sm:text-5xl md:text-6xl">
            All Projects &amp; Works
          </h1>
          <p className="mt-5 max-w-2xl text-base text-muted sm:text-lg">
            Explore live web builds, UI/UX-led launches, and n8n automation
            systems—filter by category to find what you need.
          </p>
        </div>

        <div
          className="enter-up mt-10 flex flex-wrap gap-2 [animation-delay:120ms]"
          role="tablist"
          aria-label="Project categories"
        >
          {projectFilters.map((item, index) => {
            const active = filter === item.id;
            return (
              <button
                key={item.id}
                ref={(node) => {
                  tabRefs.current[index] = node;
                }}
                type="button"
                role="tab"
                id={`work-tab-${item.id}`}
                aria-selected={active}
                aria-controls="work-panel"
                tabIndex={active ? 0 : -1}
                onClick={() => setFilter(item.id)}
                onKeyDown={(event) => onTabKeyDown(event, index)}
                className={`min-h-11 rounded-full border px-4 text-xs font-medium tracking-wide transition-all ${
                  active
                    ? "border-accent/50 bg-accent/15 text-accent-text shadow-[0_0_24px_color-mix(in_srgb,var(--accent)_25%,transparent)]"
                    : "border-line bg-panel text-muted hover:border-accent/30 hover:text-foreground"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <div
          id="work-panel"
          role="tabpanel"
          aria-labelledby={`work-tab-${filter}`}
          tabIndex={-1}
        >
          <p className="mt-6 text-sm text-subtle" aria-live="polite">
            Showing <span className="text-accent-text">{filtered.length}</span>{" "}
            {filtered.length === 1 ? "project" : "projects"}
          </p>

          {filtered.length === 0 ? (
            <div className="glass-panel mt-8 rounded-3xl px-6 py-16 text-center">
              <p className="font-display text-xl font-semibold text-foreground">
                Nothing here yet
              </p>
              <p className="mx-auto mt-3 max-w-sm text-sm text-muted">
                There are no published projects in this category right now. New
                work lands here as it ships.
              </p>
              <button
                type="button"
                onClick={() => setFilter("all")}
                className="mt-6 inline-flex min-h-11 items-center rounded-full border border-accent/40 bg-accent/10 px-5 text-sm font-medium text-accent-text transition-colors hover:bg-accent/20"
              >
                View all projects
              </button>
            </div>
          ) : (
            <div
              ref={gridRef}
              className="mt-8 grid gap-4 sm:grid-cols-2 lg:gap-5"
            >
              {filtered.map((project) => (
                <WorkCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
