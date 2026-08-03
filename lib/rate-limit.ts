type Bucket = {
  count: number;
  resetAt: number;
};

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

/**
 * Fixed-window limiter held in process memory.
 *
 * Accepted limitation: each server instance keeps its own counters, so the
 * effective limit on a multi-instance or serverless deployment is
 * `limit x instances`. That is fine for abuse-dampening on a contact form; a
 * shared store (Redis/Upstash) would be required for a hard global guarantee.
 * See docs/adr/0003-contact-form-delivery.md.
 */
export function createRateLimiter({
  limit,
  windowMs,
  now = () => Date.now(),
}: {
  limit: number;
  windowMs: number;
  now?: () => number;
}) {
  const buckets = new Map<string, Bucket>();

  function prune(currentTime: number) {
    for (const [key, bucket] of buckets) {
      if (bucket.resetAt <= currentTime) buckets.delete(key);
    }
  }

  return function check(key: string): RateLimitResult {
    const currentTime = now();

    // Keeps memory bounded without a background timer.
    if (buckets.size > 5000) prune(currentTime);

    const existing = buckets.get(key);

    if (!existing || existing.resetAt <= currentTime) {
      buckets.set(key, { count: 1, resetAt: currentTime + windowMs });
      return { allowed: true, remaining: limit - 1, retryAfterSeconds: 0 };
    }

    if (existing.count >= limit) {
      return {
        allowed: false,
        remaining: 0,
        retryAfterSeconds: Math.max(
          1,
          Math.ceil((existing.resetAt - currentTime) / 1000),
        ),
      };
    }

    existing.count += 1;
    return {
      allowed: true,
      remaining: limit - existing.count,
      retryAfterSeconds: 0,
    };
  };
}
