import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Contact from "@/components/Contact";

const fetchMock = vi.fn();

function jsonResponse(body: unknown, status: number) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  } as Response;
}

/**
 * Sets each field with a single change event. Character-by-character typing is
 * accurate but re-renders a motion-heavy tree per keystroke, which makes these
 * tests slow enough to be flaky; keystroke behaviour is covered separately by
 * the "clears a field error" test.
 */
function fillForm(overrides: Partial<Record<"name" | "email" | "message", string>> = {}) {
  const values = {
    name: "Laraib Mujahid",
    email: "client@example.com",
    message: "I need a Shopify store customised for launch.",
    ...overrides,
  };

  fireEvent.change(screen.getByLabelText(/^name$/i), {
    target: { value: values.name },
  });
  fireEvent.change(screen.getByLabelText(/^email$/i), {
    target: { value: values.email },
  });
  fireEvent.change(screen.getByLabelText(/^message$/i), {
    target: { value: values.message },
  });
}

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("Contact form", () => {
  it("shows specific inline errors and does not call the API when empty", async () => {
    const user = userEvent.setup();
    render(<Contact />);

    await user.click(screen.getByRole("button", { name: /send message/i }));

    expect(await screen.findByText(/please enter your name/i)).toBeInTheDocument();
    expect(screen.getByText(/please enter your email/i)).toBeInTheDocument();
    expect(screen.getByText(/please add a short message/i)).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("marks invalid fields with aria-invalid for screen readers", async () => {
    const user = userEvent.setup();
    render(<Contact />);

    await user.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => {
      expect(screen.getByLabelText(/^email$/i)).toHaveAttribute(
        "aria-invalid",
        "true",
      );
    });
  });

  it("clears a field error as soon as the visitor edits that field", async () => {
    const user = userEvent.setup();
    render(<Contact />);

    await user.click(screen.getByRole("button", { name: /send message/i }));
    expect(await screen.findByText(/please enter your name/i)).toBeInTheDocument();

    await user.type(screen.getByLabelText(/^name$/i), "Laraib");

    await waitFor(() => {
      expect(screen.queryByText(/please enter your name/i)).not.toBeInTheDocument();
    });
  });

  it("rejects a malformed email before hitting the network", async () => {
    const user = userEvent.setup();
    render(<Contact />);

    fillForm({ email: "not-an-email" });
    await user.click(screen.getByRole("button", { name: /send message/i }));

    expect(await screen.findByText(/check for typos/i)).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("posts once and confirms success on a valid submission", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ ok: true }, 200));
    const user = userEvent.setup();
    render(<Contact />);

    fillForm();
    await user.click(screen.getByRole("button", { name: /send message/i }));

    expect(await screen.findByText(/on its way/i)).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0]![0]).toBe("/api/contact");
  });

  it("resets the fields after a successful send", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ ok: true }, 200));
    const user = userEvent.setup();
    render(<Contact />);

    fillForm();
    await user.click(screen.getByRole("button", { name: /send message/i }));

    await screen.findByText(/on its way/i);
    expect(screen.getByLabelText(/^name$/i)).toHaveValue("");
    expect(screen.getByLabelText(/^message$/i)).toHaveValue("");
  });

  it("offers a mailto fallback when delivery is not configured", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(
        { ok: false, code: "not_configured", message: "Unavailable." },
        503,
      ),
    );
    const user = userEvent.setup();
    render(<Contact />);

    fillForm();
    await user.click(screen.getByRole("button", { name: /send message/i }));

    const fallback = await screen.findByRole("link", {
      name: /send it from your email app/i,
    });
    expect(fallback).toHaveAttribute(
      "href",
      expect.stringContaining("mailto:"),
    );
  });

  it("offers a mailto fallback when the network request throws", async () => {
    fetchMock.mockRejectedValue(new Error("offline"));
    const user = userEvent.setup();
    render(<Contact />);

    fillForm();
    await user.click(screen.getByRole("button", { name: /send message/i }));

    expect(await screen.findByText(/network error/i)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /send it from your email app/i }),
    ).toBeInTheDocument();
  });

  it("surfaces server-side field errors returned by the API", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(
        {
          ok: false,
          code: "validation_error",
          errors: { email: "That domain is blocked." },
        },
        400,
      ),
    );
    const user = userEvent.setup();
    render(<Contact />);

    fillForm();
    await user.click(screen.getByRole("button", { name: /send message/i }));

    expect(await screen.findByText(/that domain is blocked/i)).toBeInTheDocument();
  });

  it("disables the button while in flight so it cannot double-submit", async () => {
    let release: (value: Response) => void = () => {};
    fetchMock.mockReturnValue(
      new Promise<Response>((resolve) => {
        release = resolve;
      }),
    );

    const user = userEvent.setup();
    render(<Contact />);

    fillForm();
    const button = screen.getByRole("button", { name: /send message/i });
    await user.click(button);

    const sending = await screen.findByRole("button", { name: /sending/i });
    expect(sending).toBeDisabled();

    await user.click(sending);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    release(jsonResponse({ ok: true }, 200));
    await screen.findByText(/on its way/i);
  });

  it("includes the honeypot field so bots have something to fill", () => {
    render(<Contact />);

    const honeypot = document.querySelector<HTMLInputElement>("#contact-company");
    expect(honeypot).not.toBeNull();
    expect(honeypot).toHaveAttribute("tabindex", "-1");
  });
});
