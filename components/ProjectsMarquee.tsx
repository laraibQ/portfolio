"use client";

import Link from "next/link";
import { projects } from "@/data/portfolioData";

const previewAccents: Record<string, string> = {
  solvix: "#00BDF1",
  bolo: "#A78BFA",
  clona: "#34D399",
  makeup4u: "#F472B6",
  "n8n-whatsapp": "#EA4B71",
  "n8n-gmail": "#FBBF24",
};

const marqueeProjects = projects.filter(
  (project) => project.category === "web" || project.category === "uiux",
);

function BrowserPreview({
  title,
  url,
  accent,
  tags,
}: {
  title: string;
  url: string | null;
  accent: string;
  tags: string[];
}) {
  const host = url
    ? new URL(url).hostname.replace(/^www\./, "")
    : `${title.toLowerCase().replace(/[^a-z0-9]+/g, "")}.app`;

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-[#111111] shadow-[0_20px_50px_rgb(0_0_0_/0.35)]">
      <div className="flex items-center gap-1.5 border-b border-white/6 bg-[#161616] px-3 py-2.5">
        <span className="size-2 rounded-full bg-[#FF5F57]" aria-hidden />
        <span className="size-2 rounded-full bg-[#FEBC2E]" aria-hidden />
        <span className="size-2 rounded-full bg-[#28C840]" aria-hidden />
        <span className="ml-3 truncate rounded-md bg-white/5 px-2.5 py-0.5 text-[10px] tracking-wide text-subtle">
          {host}
        </span>
      </div>

      <div
        className="relative aspect-[16/10] overflow-hidden"
        style={{
          background: `radial-gradient(circle at 20% 15%, color-mix(in srgb, ${accent} 28%, transparent), transparent 42%), linear-gradient(160deg, #141414 0%, #0a0a0a 55%, #101010 100%)`,
        }}
      >
        <div className="absolute inset-x-4 top-4 h-7 rounded-md border border-white/8 bg-white/5" />
        <div className="absolute inset-x-4 top-14 grid grid-cols-3 gap-2">
          <div
            className="col-span-2 h-20 rounded-lg border border-white/8"
            style={{
              background: `linear-gradient(135deg, color-mix(in srgb, ${accent} 45%, #1a1a1a), #151515)`,
            }}
          />
          <div className="flex flex-col gap-2">
            <div className="h-9 rounded-md border border-white/8 bg-white/5" />
            <div className="h-9 rounded-md border border-white/8 bg-white/[0.035]" />
          </div>
        </div>
        <div className="absolute inset-x-4 bottom-4 flex gap-2">
          {tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/10 bg-black/30 px-2 py-0.5 text-[9px] tracking-wide text-white/55"
            >
              {tag}
            </span>
          ))}
        </div>
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgb(255 255 255 / 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgb(255 255 255 / 0.04) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
      </div>
    </div>
  );
}

function MarqueeCard({
  project,
  index,
}: {
  project: (typeof marqueeProjects)[number];
  index: number;
}) {
  const accent = previewAccents[project.id] ?? "#00BDF1";
  const className =
    "group/card w-[min(78vw,340px)] shrink-0 rounded-3xl border border-line bg-[#0a0a0a] p-4 transition-colors hover:border-accent/45 sm:w-[360px] sm:p-5";

  const body = (
    <>
      <BrowserPreview
        title={project.title}
        url={project.url}
        accent={accent}
        tags={project.tags}
      />
      <div className="mt-4 flex items-end justify-between gap-3 px-1">
        <h3 className="font-display text-lg font-semibold tracking-[-0.02em] text-foreground transition-colors group-hover/card:text-accent-text sm:text-xl">
          {project.title}
        </h3>
        <span className="text-[10px] font-medium tracking-[0.16em] text-subtle uppercase">
          {String((index % marqueeProjects.length) + 1).padStart(2, "0")}
        </span>
      </div>
    </>
  );

  if (project.url) {
    return (
      <a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {body}
      </a>
    );
  }

  return <div className={className}>{body}</div>;
}

export default function ProjectsMarquee() {
  const loop = [...marqueeProjects, ...marqueeProjects];

  return (
    <section
      id="projects-marquee"
      aria-labelledby="projects-marquee-heading"
      className="relative overflow-hidden border-t border-hairline"
    >
      <div className="mx-auto flex w-full max-w-6xl items-end justify-between gap-6 px-4 pt-20 pb-10 sm:px-6 sm:pt-28 sm:pb-12 lg:px-8">
        <h2
          id="projects-marquee-heading"
          className="font-display text-5xl font-bold tracking-[-0.05em] text-foreground uppercase sm:text-6xl md:text-7xl lg:text-8xl"
        >
          Projects
        </h2>

        <Link
          href="/work"
          className="mb-1 inline-flex min-h-11 shrink-0 items-center gap-2.5 text-sm font-medium text-muted transition-colors hover:text-accent-text"
        >
          <span className="relative inline-flex size-2.5 items-center justify-center">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-50" />
            <span className="relative inline-flex size-2 rounded-full bg-accent shadow-[0_0_12px_var(--accent)]" />
          </span>
          View all projects
        </Link>
      </div>

      <div className="projects-marquee-track relative pb-20 sm:pb-28">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-background to-transparent sm:w-20" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-background to-transparent sm:w-20" />

        <div className="projects-marquee flex w-max gap-4 px-4 sm:gap-5 sm:px-6">
          {loop.map((project, index) => (
            <MarqueeCard
              key={`${project.id}-${index}`}
              project={project}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
