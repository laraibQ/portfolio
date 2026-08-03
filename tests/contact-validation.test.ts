import { describe, expect, it } from "vitest";
import {
  buildMailtoUrl,
  LIMITS,
  validateContact,
} from "@/lib/contact";

describe("validateContact", () => {
  const valid = {
    name: "Laraib Mujahid",
    email: "hello@example.com",
    message: "I would like to discuss a WordPress build.",
  };

  it("accepts a well-formed submission", () => {
    const result = validateContact(valid);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data).toEqual(valid);
  });

  it("trims surrounding whitespace before storing values", () => {
    const result = validateContact({
      name: "  Laraib  ",
      email: "  hello@example.com  ",
      message: `  ${valid.message}  `,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.name).toBe("Laraib");
      expect(result.data.email).toBe("hello@example.com");
      expect(result.data.message).toBe(valid.message);
    }
  });

  it("reports every empty field at once rather than one at a time", () => {
    const result = validateContact({});
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(Object.keys(result.errors).sort()).toEqual([
        "email",
        "message",
        "name",
      ]);
    }
  });

  it.each([
    "plainaddress",
    "no-at-sign.com",
    "missing@domain",
    "spaces in@example.com",
    "double@@example.com",
  ])("rejects malformed email %s", (email) => {
    const result = validateContact({ ...valid, email });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.email).toBeTruthy();
  });

  it("rejects a name shorter than the minimum", () => {
    const result = validateContact({ ...valid, name: "L" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.name).toContain("2 characters");
  });

  it("accepts values sitting exactly on the boundaries", () => {
    const result = validateContact({
      name: "L".repeat(LIMITS.name.max),
      email: valid.email,
      message: "m".repeat(LIMITS.message.max),
    });
    expect(result.ok).toBe(true);
  });

  it("rejects values one character past the boundaries", () => {
    const result = validateContact({
      name: "L".repeat(LIMITS.name.max + 1),
      email: valid.email,
      message: "m".repeat(LIMITS.message.max + 1),
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.name).toBeTruthy();
      expect(result.errors.message).toBeTruthy();
    }
  });

  it("rejects a message below the minimum length", () => {
    const result = validateContact({ ...valid, message: "hi" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.message).toBeTruthy();
  });

  it.each([null, undefined, "a string", 42, []])(
    "treats non-object input %s as fully invalid instead of throwing",
    (input) => {
      const result = validateContact(input);
      expect(result.ok).toBe(false);
    },
  );

  it("ignores non-string field types instead of coercing them", () => {
    const result = validateContact({
      name: 123,
      email: { address: "hello@example.com" },
      message: ["hello there friend"],
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.name).toBeTruthy();
      expect(result.errors.email).toBeTruthy();
      expect(result.errors.message).toBeTruthy();
    }
  });
});

describe("buildMailtoUrl", () => {
  it("encodes the subject and body so special characters survive", () => {
    const url = buildMailtoUrl("me@example.com", {
      name: "A & B",
      email: "sender@example.com",
      message: "Line one\nLine two?",
    });

    expect(url.startsWith("mailto:me@example.com?")).toBe(true);
    expect(url).toContain("A%20%26%20B");
    expect(url).toContain("Line%20one%0ALine%20two%3F");
  });

  it("falls back to a neutral subject when no name is supplied", () => {
    expect(buildMailtoUrl("me@example.com", {})).toContain("a%20visitor");
  });
});
