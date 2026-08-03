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
});
