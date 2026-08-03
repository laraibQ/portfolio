export type ContactPayload = {
  name: string;
  email: string;
  message: string;
};

export type ContactField = keyof ContactPayload;

export type FieldErrors = Partial<Record<ContactField, string>>;

export type ValidationResult =
  | { ok: true; data: ContactPayload }
  | { ok: false; errors: FieldErrors };

export const LIMITS = {
  name: { min: 2, max: 80 },
  email: { max: 254 },
  message: { min: 10, max: 2000 },
} as const;

/** Deliberately permissive: the goal is catching typos, not RFC 5322 compliance. */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@.]+\.[^\s@]{2,}$/;

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

/**
 * Single validation source shared by the form and the route handler, so the
 * client can show inline errors without the server trusting the client.
 * Messages are specific and actionable rather than "invalid input".
 */
export function validateContact(input: unknown): ValidationResult {
  const record = (input ?? {}) as Record<string, unknown>;
  const name = asString(record.name);
  const email = asString(record.email);
  const message = asString(record.message);
  const errors: FieldErrors = {};

  if (!name) {
    errors.name = "Please enter your name.";
  } else if (name.length < LIMITS.name.min) {
    errors.name = `Your name needs at least ${LIMITS.name.min} characters.`;
  } else if (name.length > LIMITS.name.max) {
    errors.name = `Please keep your name under ${LIMITS.name.max} characters.`;
  }

  if (!email) {
    errors.email = "Please enter your email so I can reply.";
  } else if (email.length > LIMITS.email.max) {
    errors.email = "That email address is too long.";
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = "That doesn't look like a valid email — check for typos.";
  }

  if (!message) {
    errors.message = "Please add a short message.";
  } else if (message.length < LIMITS.message.min) {
    errors.message = `Tell me a little more — at least ${LIMITS.message.min} characters.`;
  } else if (message.length > LIMITS.message.max) {
    errors.message = `Please keep it under ${LIMITS.message.max} characters (currently ${message.length}).`;
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, data: { name, email, message } };
}

/** Used when the API is unavailable so the visitor is never left with a dead form. */
export function buildMailtoUrl(to: string, payload: Partial<ContactPayload>) {
  const subject = encodeURIComponent(
    `Portfolio inquiry from ${payload.name?.trim() || "a visitor"}`,
  );
  const body = encodeURIComponent(
    [
      `Name: ${payload.name?.trim() ?? ""}`,
      `Email: ${payload.email?.trim() ?? ""}`,
      "",
      payload.message?.trim() ?? "",
    ].join("\n"),
  );
  return `mailto:${to}?subject=${subject}&body=${body}`;
}
