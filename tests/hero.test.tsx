import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Hero from "@/components/Hero";

// The avatar pulls in Next's static image pipeline, which is out of scope here.
vi.mock("@/components/Avatar", () => ({ default: () => null }));

describe("Hero", () => {
  it("exposes a single real level-one heading", () => {
    render(<Hero />);

    const headings = screen.getAllByRole("heading", { level: 1 });
    expect(headings).toHaveLength(1);
    expect(headings[0]).toHaveTextContent(/WEB DESIGN/);
    expect(headings[0]).toHaveTextContent(/AUTOMATION/);
  });

  it("links both calls to action to real destinations", () => {
    render(<Hero />);

    expect(screen.getByRole("link", { name: /explore work/i })).toHaveAttribute(
      "href",
      "/work",
    );
    expect(screen.getByRole("link", { name: /get in touch/i })).toHaveAttribute(
      "href",
      "/#contact",
    );
  });

  /**
   * Framer Motion writes `initial` straight into the rendered markup, so an
   * opacity-0 initial state here would leave the LCP region invisible until the
   * bundle hydrates. That measured as a 3.5s gap between FCP and LCP on
   * throttled mobile, and a permanently blank hero if JavaScript fails to run.
   * Entrance animation for this section belongs in CSS.
   */
  it("paints its content without waiting for hydration", () => {
    const { container } = render(<Hero />);

    const hidden = [...container.querySelectorAll<HTMLElement>("*")].filter(
      (element) =>
        element.style.opacity === "0" ||
        element.style.visibility === "hidden" ||
        element.style.transform?.includes("scale(0)"),
    );

    expect(hidden.map((element) => element.outerHTML.slice(0, 120))).toEqual([]);
  });
});
