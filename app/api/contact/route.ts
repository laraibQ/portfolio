import type { NextRequest } from "next/server";
import { validateContact } from "@/lib/contact";
import { createRateLimiter } from "@/lib/rate-limit";

/** 5 submissions per IP per 10 minutes — generous for humans, hostile to scripts. */
const checkRateLimit = createRateLimiter({
  limit: 5,
  windowMs: 10 * 60 * 1000,
});

const SEND_TIMEOUT_MS = 8_000;
const RESEND_ENDPOINT = "https://api.resend.com/emails";

type Outcome =
  | "sent"
  | "validation_error"
  | "rate_limited"
  | "invalid_json"
  | "honeypot"
  | "not_configured"
  | "delivery_failed";

/** Never logs names, emails or message bodies — only what is needed to debug. */
function log(requestId: string, outcome: Outcome, durationMs: number) {
  console.info(
    JSON.stringify({
      event: "contact.submit",
      requestId,
      outcome,
      durationMs,
    }),
  );
}

function clientIp(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

function json(body: unknown, status: number, headers?: HeadersInit) {
  return Response.json(body, { status, headers });
}

async function deliver(payload: {
  name: string;
  email: string;
  message: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !to || !from) return "not_configured" as const;

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      // Plain text only: nothing user-supplied is ever interpreted as markup.
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: payload.email,
        subject: `Portfolio inquiry from ${payload.name}`,
        text: `Name: ${payload.name}\nEmail: ${payload.email}\n\n${payload.message}`,
      }),
      signal: AbortSignal.timeout(SEND_TIMEOUT_MS),
    });

    return response.ok ? ("sent" as const) : ("delivery_failed" as const);
  } catch {
    // Covers timeouts, DNS failures and provider outages alike.
    return "delivery_failed" as const;
  }
}

export async function POST(request: NextRequest) {
  const startedAt = Date.now();
  const requestId = crypto.randomUUID();
  const finish = (outcome: Outcome) => log(requestId, outcome, Date.now() - startedAt);

  const rate = checkRateLimit(clientIp(request));
  if (!rate.allowed) {
    finish("rate_limited");
    return json(
      {
        ok: false,
        code: "rate_limited",
        message: "Too many messages sent. Please try again shortly.",
      },
      429,
      { "Retry-After": String(rate.retryAfterSeconds) },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    finish("invalid_json");
    return json({ ok: false, code: "invalid_json" }, 400);
  }

  // Bots fill every field they find; humans never see this one.
  const honeypot = (body as Record<string, unknown>)?.company;
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    finish("honeypot");
    return json({ ok: true }, 200);
  }

  const result = validateContact(body);
  if (!result.ok) {
    finish("validation_error");
    return json(
      { ok: false, code: "validation_error", errors: result.errors },
      400,
    );
  }

  const outcome = await deliver(result.data);
  finish(outcome);

  if (outcome === "not_configured") {
    return json(
      {
        ok: false,
        code: "not_configured",
        message: "Direct sending is unavailable right now.",
      },
      503,
    );
  }

  if (outcome === "delivery_failed") {
    return json(
      {
        ok: false,
        code: "delivery_failed",
        message: "Your message could not be delivered.",
      },
      502,
    );
  }

  return json({ ok: true }, 200);
}
