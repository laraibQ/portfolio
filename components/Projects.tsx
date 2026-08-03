"use client";

import { useRef, type MouseEvent } from "react";
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { projects, type Project } from "@/data/portfolioData";
import { Reveal } from "@/components/ui/Motion";

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(mouseY, [0, 1], [8, -8]), {
    stiffness: 220,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-8, 8]), {
    stiffness: 220,
    damping: 20,
  });
  const glareX = useTransform(mouseX, (value) => `${value * 100}%`);
  const glareY = useTransform(mouseY, (value) => `${value * 100}%`);
  const glare = useMotionTemplate`radial-gradient(650px circle at ${glareX} ${glareY}, color-mix(in srgb, var(--accent) 18%, transparent), transparent 40%)`;

  function onMove(event: MouseEvent<HTMLElement>) {
    if (reduceMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mouseX.set((event.clientX - rect.left) / rect.width);
    mouseY.set((event.clientY - rect.top) / rect.height);
    ref.current.style.setProperty("--mouse-x", `${event.clientX - rect.left}px`);
    ref.current.style.setProperty("--mouse-y", `${event.clientY - rect.top}px`);
  }

  function onLeave() {
    mouseX.set(0.5);
    mouseY.set(0.5);
  }

  const isLive = Boolean(project.url);
  const sharedProps = {
    ref: ref as never,
    onMouseMove: onMove,
    onMouseLeave: onLeave,
    style: reduceMotion
      ? undefined
      : { rotateX, rotateY, transformStyle: "preserve-3d" as const },
    initial: reduceMotion ? false : { opacity: 0, y: 36, scale: 0.97 },
    whileInView: { opacity: 1, y: 0, scale: 1 },
    viewport: { once: true, amount: 0.15 },
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1] as const,
      delay: index * 0.06,
    },
    whileHover: reduceMotion
      ? undefined
      : { scale: 1.015, z: 20 },
    className: `bento-card group col-span-12 flex cursor-pointer flex-col justify-between rounded-3xl p-6 sm:p-8 ${project.span}`,
  };

  const content = (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: glare }}
      />

      <div className="relative z-10">
        <div className="mb-6 flex items-start justify-between gap-3">
          <span className="rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 text-[10px] font-semibold tracking-[0.16em] text-accent-text uppercase">
            {project.category === "automation"
              ? "Automation"
              : project.category === "uiux"
                ? "UI/UX Design"
                : "Live Build"}
          </span>
          {isLive ? (
            <span className="inline-flex size-9 items-center justify-center rounded-full border border-line bg-panel text-muted transition-all group-hover:border-accent/40 group-hover:text-accent-text group-hover:shadow-[0_0_20px_color-mix(in_srgb,var(--accent)_35%,transparent)]">
              <ArrowUpRight className="size-4" strokeWidth={1.75} />
            </span>
          ) : null}
        </div>

        <h3
          className={`font-display font-bold tracking-[-0.03em] text-foreground transition-colors group-hover:text-accent-text ${
            project.featured ? "text-3xl sm:text-4xl md:text-5xl" : "text-2xl sm:text-3xl"
          }`}
        >
          {project.title}
        </h3>
        <p
          className={`mt-4 max-w-xl leading-relaxed text-muted ${
            project.featured ? "text-base sm:text-lg" : "text-sm sm:text-base"
          }`}
        >
          {project.description}
        </p>
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
      <motion.a
        href={project.url!}
        target="_blank"
        rel="noopener noreferrer"
        {...sharedProps}
      >
        {content}
      </motion.a>
    );
  }

  return <motion.div {...sharedProps}>{content}</motion.div>;
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
              crafted for clarity and speed.
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
