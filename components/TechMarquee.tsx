const marqueeItems = [
  "WordPress",
  "Elementor",
  "Shopify",
  "Webflow",
  "Figma",
  "Liquid",
  "JavaScript",
  "n8n",
  "Cursor",
  "Claude AI",
  "SEO",
  "GitHub",
] as const;

export default function TechMarquee() {
  return (
    <div
      className="relative overflow-hidden border-y border-hairline py-5"
      aria-hidden="true"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent sm:w-28" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent sm:w-28" />

      <div className="tech-marquee flex w-max gap-3">
        {[...marqueeItems, ...marqueeItems].map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-panel px-4 py-2 text-xs tracking-[0.14em] text-muted uppercase"
          >
            <span className="size-1 shrink-0 rounded-full bg-accent/80" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
