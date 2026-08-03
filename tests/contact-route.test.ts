import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { NextRequest } from "next/server";

type Handler = (request: NextRequest) => Promise<Response>;

/**
 * The route holds its rate-limit buckets in module scope, so each test imports
 * a fresh copy to stay independent.
 */
async function loadRoute(): Promise<Handler> {
  vi.resetModules();
  const mod = await import("@/app/api/contact/route");
  return mod.POST as Handler;
}

function post(body: unknown, ip = "203.0.113.1") {
  const init: RequestInit = {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": ip },
    body: typeof body === "string" ? body : JSON.stringify(body),
  };
  return new Request("http://localhost/api/contact", init) as unknown as NextRequest;
}

const validBody = {
  name: "Laraib Mujahid",
  email: "client@example.com",
  message: "I would like a quote for a Shopify build.",
};

function configureDelivery() {
  process.env.RESEND_API_KEY = "test-key";
  process.env.CONTACT_TO_EMAIL = "owner@example.com";
  process.env.CONTACT_FROM_EMAIL = "site@example.com";
}

function unconfigureDelivery() {
  delete process.env.RESEND_API_KEY;
  delete process.env.CONTACT_TO_EMAIL;
  delete process.env.CONTACT_FROM_EMAIL;
}

beforeEach(() => {
  unconfigureDelivery();
  vi.spyOn(console, "info").mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  unconfigureDelivery();
});

describe("POST /api/contact", () => {
  it("rejects a malformed JSON body", async () => {
    const POST = await loadRoute();
    const response = await POST(post("{not json"));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      code: "invalid_json",
    });
  });

  it("returns field errors for an invalid payload", async () => {
    const POST = await loadRoute();
    const response = await POST(post({ name: "", email: "nope", message: "" }));

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.code).toBe("validation_error");
    expect(body.errors.email).toBeTruthy();
    expect(body.errors.name).toBeTruthy();
  });

  it("silently accepts and drops honeypot submissions without delivering", async () => {
    configureDelivery();
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const POST = await loadRoute();
    const response = await POST(post({ ...validBody, company: "Acme Bots" }));

    expect(response.status).toBe(200);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("reports 503 when no mail transport is configured", async () => {
    const POST = await loadRoute();
    const response = await POST(post(validBody));

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toMatchObject({
      code: "not_configured",
    });
  });

  it("delivers the message when the provider is configured", async () => {
    configureDelivery();
    const fetchMock = vi.fn().mockResolvedValue({ ok: true } as Response);
    vi.stubGlobal("fetch", fetchMock);

    const POST = await loadRoute();
    const response = await POST(post(validBody));

    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [, requestInit] = fetchMock.mock.calls[0]!;
    const payload = JSON.parse((requestInit as RequestInit).body as string);
    expect(payload.reply_to).toBe(validBody.email);
    expect(payload.text).toContain(validBody.message);
  });

  it("returns 502 when the provider errors", async () => {
    configureDelivery();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 500 } as Response),
    );

    const POST = await loadRoute();
    const response = await POST(post(validBody));

    expect(response.status).toBe(502);
    await expect(response.json()).resolves.toMatchObject({
      code: "delivery_failed",
    });
  });

  it("returns 502 when the provider request times out", async () => {
    configureDelivery();
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("timeout")));

    const POST = await loadRoute();
    const response = await POST(post(validBody));

    expect(response.status).toBe(502);
  });

  it("rate limits repeated submissions from the same IP", async () => {
    const POST = await loadRoute();
    const ip = "198.51.100.7";

    for (let attempt = 0; attempt < 5; attempt += 1) {
      const allowed = await POST(post(validBody, ip));
      expect(allowed.status).not.toBe(429);
    }

    const blocked = await POST(post(validBody, ip));
    expect(blocked.status).toBe(429);
    expect(blocked.headers.get("Retry-After")).toBeTruthy();
  });

  it("keeps rate limits scoped per IP", async () => {
    const POST = await loadRoute();

    for (let attempt = 0; attempt < 5; attempt += 1) {
      await POST(post(validBody, "198.51.100.8"));
    }

    const other = await POST(post(validBody, "198.51.100.9"));
    expect(other.status).not.toBe(429);
  });

  it("never writes submitted personal data to the logs", async () => {
    const info = vi.spyOn(console, "info").mockImplementation(() => {});
    const POST = await loadRoute();

    await POST(post(validBody));

    const logged = info.mock.calls.map((call) => String(call[0])).join(" ");
    expect(logged).not.toContain(validBody.email);
    expect(logged).not.toContain(validBody.name);
    expect(logged).not.toContain(validBody.message);
    expect(logged).toContain("contact.submit");
  });
});
