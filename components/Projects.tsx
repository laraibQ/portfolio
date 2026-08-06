"use client";

import { useLayoutEffect, useRef, type MouseEvent } from "react";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { projects, type Project } from "@/data/portfolioData";
import { Reveal } from "@/components/ui/Motion";
import { ensureGsap, gsap, shouldAnimate, EASE } from "@/lib/gsap";

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const rotateXTo = useRef<ReturnType<typeof gsap.quickTo> | null>(null);
  const rotateYTo = useRef<ReturnType<typeof gsap.quickTo> | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !shouldAnimate()) return;

    ensureGsap();

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { autoAlpha: 0, y: 40, scale: 0.97 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          delay: index * 0.06,
          ease: EASE,
          clearProps: "transform",
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            once: true,
          },
        },
      );

      gsap.set(el, { transformPerspective: 900 });
      rotateXTo.current = gsap.quickTo(el, "rotationX", {
        duration: 0.35,
        ease: EASE,
      });
      rotateYTo.current = gsap.quickTo(el, "rotationY", {
        duration: 0.35,
        ease: EASE,
      });
    }, el);

    return () => ctx.revert();
  }, [index]);

  function onMove(event: MouseEvent<HTMLElement>) {
    if (!ref.current || !rotateXTo.current || !rotateYTo.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    rotateXTo.current((0.5 - py) * 10);
    rotateYTo.current((px - 0.5) * 10);
    ref.current.style.setProperty("--mouse-x", `${event.clientX - rect.left}px`);
    ref.current.style.setProperty("--mouse-y", `${event.clientY - rect.top}px`);
  }

  function onLeave() {
    rotateXTo.current?.(0);
    rotateYTo.current?.(0);
  }

  const isLive = Boolean(project.url);
  const className = `bento-card group col-span-12 flex cursor-pointer flex-col justify-between rounded-3xl p-6 sm:p-8 ${project.span}`;

  const content = (
    <>
      <div className="relative z-10">
        <div className="mb-6 flex items-start justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 text-[10px] font-semibold tracking-[0.16em] text-accent-text uppercase">
              {project.category === "automation"
                ? "Automation"
                : project.category === "uiux"
                  ? "UI/UX Design"
                  : "Live Build"}
            </span>
            <span className="rounded-full border border-line bg-panel px-2.5 py-1 text-[10px] font-semibold tracking-[0.14em] text-muted uppercase">
              {project.ownership}
            </span>
          </div>
          {isLive ? (
            <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-line bg-panel text-muted transition-all group-hover:border-accent/40 group-hover:text-accent-text group-hover:shadow-[0_0_20px_color-mix(in_srgb,var(--accent)_35%,transparent)]">
              <ArrowUpRight className="size-4" strokeWidth={1.75} />
            </span>
          ) : null}
        </div>

        <h3
          className={`font-display font-bold tracking-[-0.03em] text-foreground transition-colors group-hover:text-accent-text ${
            project.featured
              ? "text-3xl sm:text-4xl md:text-5xl"
              : "text-2xl sm:text-3xl"
          }`}
        >
          {project.title}
        </h3>
        <p className="mt-2 text-sm font-medium text-accent-text">
          {project.metric}
        </p>
        <p
          className={`mt-3 max-w-xl leading-relaxed text-muted ${
            project.featured ? "text-base sm:text-lg" : "text-sm sm:text-base"
          }`}
        >
          {project.description}
        </p>
        {project.workflow ? (
          <ol className="mt-5 flex flex-wrap gap-2">
            {project.workflow.map((step, stepIndex) => (
              <li
                key={step}
                className="inline-flex items-center gap-1.5 rounded-full border border-line bg-panel px-2.5 py-1 text-[10px] tracking-wide text-muted"
              >
                <span className="font-mono text-accent-text">
                  {String(stepIndex + 1).padStart(2, "0")}
                </span>
                {step}
              </li>
            ))}
          </ol>
        ) : null}
      </div>

      <ul className="relative z-10 mt-8 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <li
            key={tag}
            className="rounded-full border border-line bg-panel px-3 py-1 text-[11px] tracking-wide text-muted transition-all group-hover:border-accent/35 group-hover:bg-accent/10 group-hover:text-accent-text"
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
        ref={ref as never}
        href={project.url!}
        target="_blank"
        rel="noopener noreferrer"
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className={className}
      >
        {content}
      </a>
    );
  }

  return (
    <div
      ref={ref as never}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={className}
    >
      {content}
    </div>
  );
}

export default function Projects() {
  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="relative border-t border-hairline"
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <Reveal className="mb-14 flex max-w-2xl flex-col gap-5 sm:mb-16">
          <div>
            <p className="mb-4 text-[11px] font-medium tracking-[0.22em] text-accent-text uppercase">
              Selected Work
            </p>
            <h2
              id="projects-heading"
              className="font-display text-4xl font-bold tracking-[-0.04em] text-foreground sm:text-5xl md:text-6xl"
            >
              Sites that ship.
              <br />
              Systems that scale.
            </h2>
            <p className="mt-5 text-base text-muted sm:text-lg">
              A bento of production WordPress, Shopify, and n8n automation—
              each card shows ownership and a metric. Deep dives live in{" "}
              <a
                href="/#case-studies"
                className="text-accent-text transition-colors hover:text-foreground"
              >
                Case Studies
              </a>
              .
            </p>
          </div>
          <Link
            href="/work"
            className="inline-flex min-h-11 w-fit items-center gap-2 text-sm font-medium text-accent-text transition-colors hover:text-foreground"
          >
            View all projects
            <ArrowUpRight className="size-4" strokeWidth={1.75} />
          </Link>
        </Reveal>

        <div
          className="grid grid-cols-12 gap-4 md:gap-5"
          style={{ perspective: "1200px" }}
        >
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
