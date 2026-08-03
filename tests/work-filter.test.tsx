import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import WorkClient from "@/app/work/WorkClient";
import { projects, projectFilters } from "@/data/portfolioData";

function tab(name: RegExp) {
  return screen.getByRole("tab", { name });
}

/**
 * The count is the authoritative view of the active filter. Card elements are
 * unreliable immediately after a change because AnimatePresence keeps outgoing
 * cards mounted for the duration of their exit animation.
 */
function countLabel() {
  const panel = screen.getByRole("tabpanel");
  const live = panel.querySelector("[aria-live]");
  return live?.textContent?.replace(/\s+/g, " ").trim();
}

function countFor(category: string) {
  return projects.filter((project) => project.category === category).length;
}

describe("Work page filtering", () => {
  it("renders one tab per configured filter", () => {
    render(<WorkClient />);

    expect(screen.getAllByRole("tab")).toHaveLength(projectFilters.length);
    expect(tab(/^all$/i)).toHaveAttribute("aria-selected", "true");
  });

  it("shows every project under the All filter", () => {
    render(<WorkClient />);

    const panel = screen.getByRole("tabpanel");
    expect(
      within(panel).getAllByRole("heading", { level: 2 }),
    ).toHaveLength(projects.length);
  });

  it("narrows the list when a category is selected", async () => {
    const user = userEvent.setup();
    render(<WorkClient />);

    await user.click(tab(/automation workflows/i));

    expect(countLabel()).toBe(`Showing ${countFor("automation")} projects`);
    expect(tab(/automation workflows/i)).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(tab(/^all$/i)).toHaveAttribute("aria-selected", "false");
  });

  it("uses the singular noun when a category holds one project", async () => {
    const user = userEvent.setup();
    render(<WorkClient />);

    await user.click(tab(/ui\/ux designs/i));

    expect(countFor("uiux")).toBe(1);
    expect(countLabel()).toBe("Showing 1 project");
  });

  it("points the panel at whichever tab is active", async () => {
    const user = userEvent.setup();
    render(<WorkClient />);

    await user.click(tab(/web designs/i));

    expect(screen.getByRole("tabpanel")).toHaveAttribute(
      "aria-labelledby",
      "work-tab-web",
    );
  });

  it("moves between tabs with the arrow keys", async () => {
    const user = userEvent.setup();
    render(<WorkClient />);

    await user.click(tab(/^all$/i));
    await user.keyboard("{ArrowRight}");

    expect(tab(/web designs/i)).toHaveAttribute("aria-selected", "true");
    expect(tab(/web designs/i)).toHaveFocus();
  });

  it("wraps from the first tab to the last with ArrowLeft", async () => {
    const user = userEvent.setup();
    render(<WorkClient />);

    await user.click(tab(/^all$/i));
    await user.keyboard("{ArrowLeft}");

    expect(tab(/automation workflows/i)).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("jumps to the last and first tabs with End and Home", async () => {
    const user = userEvent.setup();
    render(<WorkClient />);

    await user.click(tab(/^all$/i));
    await user.keyboard("{End}");
    expect(tab(/automation workflows/i)).toHaveAttribute(
      "aria-selected",
      "true",
    );

    await user.keyboard("{Home}");
    expect(tab(/^all$/i)).toHaveAttribute("aria-selected", "true");
  });

  it("keeps only the selected tab in the tab order", async () => {
    const user = userEvent.setup();
    render(<WorkClient />);

    await user.click(tab(/web designs/i));

    expect(tab(/web designs/i)).toHaveAttribute("tabindex", "0");
    expect(tab(/^all$/i)).toHaveAttribute("tabindex", "-1");
  });

  it("warns assistive tech that live project links open a new tab", () => {
    render(<WorkClient />);

    expect(screen.getAllByText(/opens in a new tab/i).length).toBeGreaterThan(0);
  });
});
