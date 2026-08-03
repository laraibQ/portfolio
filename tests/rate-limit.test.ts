import { describe, expect, it } from "vitest";
import { createRateLimiter } from "@/lib/rate-limit";

function limiterWithClock(limit: number, windowMs: number) {
  let current = 1_000;
  const check = createRateLimiter({ limit, windowMs, now: () => current });
  return {
    check,
    advance(ms: number) {
      current += ms;
    },
  };
}

describe("createRateLimiter", () => {
  it("allows requests up to the limit and reports remaining budget", () => {
    const { check } = limiterWithClock(3, 60_000);

    expect(check("ip-a")).toMatchObject({ allowed: true, remaining: 2 });
    expect(check("ip-a")).toMatchObject({ allowed: true, remaining: 1 });
    expect(check("ip-a")).toMatchObject({ allowed: true, remaining: 0 });
  });

  it("blocks the request that exceeds the limit", () => {
    const { check } = limiterWithClock(2, 60_000);
    check("ip-a");
    check("ip-a");

    const blocked = check("ip-a");
    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
  });

  it("keeps counting separately per key", () => {
    const { check } = limiterWithClock(1, 60_000);

    expect(check("ip-a").allowed).toBe(true);
    expect(check("ip-b").allowed).toBe(true);
    expect(check("ip-a").allowed).toBe(false);
  });

  it("resets once the window has elapsed", () => {
    const { check, advance } = limiterWithClock(1, 60_000);
    check("ip-a");
    expect(check("ip-a").allowed).toBe(false);

    advance(60_000);
    expect(check("ip-a").allowed).toBe(true);
  });

  it("still blocks one millisecond before the window closes", () => {
    const { check, advance } = limiterWithClock(1, 60_000);
    check("ip-a");

    advance(59_999);
    expect(check("ip-a").allowed).toBe(false);
  });

  it("rounds retry-after up to whole seconds, never to zero", () => {
    const { check, advance } = limiterWithClock(1, 60_000);
    check("ip-a");

    advance(59_900);
    expect(check("ip-a").retryAfterSeconds).toBe(1);
  });
});
