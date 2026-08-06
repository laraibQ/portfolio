"use client";

import { useState, type FormEvent } from "react";
import { Loader2, Mail, Phone } from "lucide-react";
import { contactInfo, openTo, referencesNote } from "@/data/portfolioData";
import { Reveal } from "@/components/ui/Motion";
import {
  buildMailtoUrl,
  LIMITS,
  validateContact,
  type ContactPayload,
  type FieldErrors,
} from "@/lib/contact";

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const baseField =
  "w-full rounded-2xl border bg-panel px-4 py-3.5 text-sm text-foreground outline-none backdrop-blur-md transition-all placeholder:text-subtle";

function fieldClassName(hasError: boolean) {
  return `${baseField} ${
    hasError
      ? "border-error/70 focus:border-error"
      : "border-line hover:border-accent/30 focus:border-accent"
  }`;
}

type Status = "idle" | "submitting" | "success" | "error";

const EMPTY: ContactPayload = { name: "", email: "", message: "" };

export default function Contact() {
  const [values, setValues] = useState<ContactPayload>(EMPTY);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [formError, setFormError] = useState<string | null>(null);
  const [fallbackUrl, setFallbackUrl] = useState<string | null>(null);

  function update(field: keyof ContactPayload, value: string) {
    setValues((previous) => ({ ...previous, [field]: value }));
    // Clear the error as soon as the visitor starts correcting it.
    setFieldErrors((previous) =>
      previous[field] ? { ...previous, [field]: undefined } : previous,
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;

    const validation = validateContact(values);
    if (!validation.ok) {
      setFieldErrors(validation.errors);
      setStatus("error");
      setFormError("Please fix the highlighted fields and try again.");
      setFallbackUrl(null);
      return;
    }

    setFieldErrors({});
    setFormError(null);
    setFallbackUrl(null);
    setStatus("submitting");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...validation.data, company: "" }),
      });

      if (response.ok) {
        setValues(EMPTY);
        setStatus("success");
        return;
      }

      const payload = (await response.json().catch(() => null)) as
        | { code?: string; message?: string; errors?: FieldErrors }
        | null;

      if (payload?.code === "validation_error" && payload.errors) {
        setFieldErrors(payload.errors);
        setFormError("Please fix the highlighted fields and try again.");
        setStatus("error");
        return;
      }

      // Provider outage or unconfigured environment: hand the visitor a route
      // that always works rather than a dead end.
      setFormError(
        payload?.message ??
          "Something went wrong sending your message.",
      );
      setFallbackUrl(buildMailtoUrl(contactInfo.email, validation.data));
      setStatus("error");
    } catch {
      setFormError("Network error — check your connection and try again.");
      setFallbackUrl(buildMailtoUrl(contactInfo.email, validation.data));
      setStatus("error");
    }
  }

  const submitting = status === "submitting";

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative border-t border-hairline"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="glow-orb bottom-0 left-1/2 h-80 w-80 -translate-x-1/2 bg-[color-mix(in_srgb,var(--accent)_16%,transparent)]" />
      </div>

      <div className="mx-auto grid w-full max-w-6xl gap-12 px-4 py-24 sm:px-6 sm:py-32 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <Reveal>
          <p className="mb-4 text-[11px] font-medium tracking-[0.22em] text-accent-text uppercase">
            Contact
          </p>
          <h2
            id="contact-heading"
            className="font-display text-4xl font-bold tracking-[-0.04em] text-foreground sm:text-5xl"
          >
            Let&apos;s build something production-ready.
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-muted sm:text-lg">
            {openTo.detail} Reach out directly or send a short brief.
          </p>
          <p className="mt-3 max-w-md text-sm text-subtle">{referencesNote}</p>

          <ul className="mt-10 space-y-3">
            {[
              {
                href: contactInfo.emailHref,
                label: contactInfo.email,
                icon: <Mail className="size-4" strokeWidth={1.75} />,
                external: true,
              },
              {
                href: contactInfo.phoneHref,
                label: contactInfo.phone,
                icon: <Phone className="size-4" strokeWidth={1.75} />,
              },
              {
                href: contactInfo.linkedin,
                label: "LinkedIn",
                icon: <LinkedInIcon className="size-4" />,
                external: true,
              },
            ].map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  {...(item.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="glass-panel group inline-flex min-h-11 w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm text-muted transition-all hover:translate-x-1.5 hover:text-accent-text"
                >
                  <span className="inline-flex size-9 items-center justify-center rounded-full border border-line bg-panel group-hover:border-accent/40">
                    {item.icon}
                  </span>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.1}>
          <form
            onSubmit={handleSubmit}
            className="glass-panel space-y-4 rounded-3xl p-6 sm:p-8"
            noValidate
          >
            <div>
              <label
                htmlFor="contact-name"
                className="mb-2 block text-xs tracking-wide text-subtle uppercase"
              >
                Name
              </label>
              <input
                id="contact-name"
                name="name"
                type="text"
                autoComplete="name"
                maxLength={LIMITS.name.max}
                value={values.name}
                onChange={(event) => update("name", event.target.value)}
                className={fieldClassName(Boolean(fieldErrors.name))}
                placeholder="Your name"
                aria-invalid={Boolean(fieldErrors.name)}
                aria-describedby={fieldErrors.name ? "contact-name-error" : undefined}
              />
              {fieldErrors.name ? (
                <p id="contact-name-error" className="mt-2 text-xs text-error">
                  {fieldErrors.name}
                </p>
              ) : null}
            </div>

            <div>
              <label
                htmlFor="contact-email"
                className="mb-2 block text-xs tracking-wide text-subtle uppercase"
              >
                Email
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                autoComplete="email"
                maxLength={LIMITS.email.max}
                value={values.email}
                onChange={(event) => update("email", event.target.value)}
                className={fieldClassName(Boolean(fieldErrors.email))}
                placeholder="you@example.com"
                aria-invalid={Boolean(fieldErrors.email)}
                aria-describedby={fieldErrors.email ? "contact-email-error" : undefined}
              />
              {fieldErrors.email ? (
                <p id="contact-email-error" className="mt-2 text-xs text-error">
                  {fieldErrors.email}
                </p>
              ) : null}
            </div>

            <div>
              <label
                htmlFor="contact-message"
                className="mb-2 block text-xs tracking-wide text-subtle uppercase"
              >
                Message
              </label>
              <textarea
                id="contact-message"
                name="message"
                rows={5}
                maxLength={LIMITS.message.max}
                value={values.message}
                onChange={(event) => update("message", event.target.value)}
                className={`${fieldClassName(Boolean(fieldErrors.message))} min-h-32 resize-y`}
                placeholder="Project goals, timeline, or a quick hello…"
                aria-invalid={Boolean(fieldErrors.message)}
                aria-describedby={
                  fieldErrors.message ? "contact-message-error" : undefined
                }
              />
              {fieldErrors.message ? (
                <p id="contact-message-error" className="mt-2 text-xs text-error">
                  {fieldErrors.message}
                </p>
              ) : null}
            </div>

            {/* Honeypot: hidden from users and assistive tech, irresistible to bots. */}
            <div className="sr-only" aria-hidden>
              <label htmlFor="contact-company">Company</label>
              <input
                id="contact-company"
                name="company"
                type="text"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-accent px-7 text-sm font-semibold text-dark transition-transform hover:scale-[1.03] hover:shadow-[0_0_32px_color-mix(in_srgb,var(--accent)_40%,transparent)] active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
              >
                {submitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" aria-hidden />
                    Sending…
                  </>
                ) : (
                  "Send Message"
                )}
              </button>
            </div>

            <div aria-live="polite" className="min-h-5">
              {status === "success" ? (
                <p className="text-sm text-accent-text">
                  Thanks — your message is on its way. I&apos;ll reply within a
                  day or two.
                </p>
              ) : null}
              {status === "error" && formError ? (
                <p className="text-sm text-error">
                  {formError}
                  {fallbackUrl ? (
                    <>
                      {" "}
                      <a
                        href={fallbackUrl}
                        className="font-medium text-accent-text underline"
                      >
                        Send it from your email app instead
                      </a>
                      .
                    </>
                  ) : null}
                </p>
              ) : null}
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
