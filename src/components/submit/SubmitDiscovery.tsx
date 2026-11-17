"use client";

import { useCallback, useEffect, useId, useRef, useState, type FormEvent } from "react";
import { CloseIcon } from "@/components/Icons";
import { regions } from "@/config/regions";
import { useSubmissions } from "@/hooks/useSubmissions";
import { OPEN_SUBMIT_EVENT } from "@/lib/events";
import {
  SUBMISSION_LIMITS,
  submissionCategories,
  validateSubmission,
  type SubmissionErrors,
  type SubmissionField,
} from "@/lib/submission";

type FormValues = Record<SubmissionField, string> & { website: string };

const emptyForm: FormValues = { title: "", region: "", category: "", description: "", contact: "", website: "" };

/** The single "Submit a Discovery" dialog, mounted once in the layout and opened via OPEN_SUBMIT_EVENT. */
export function SubmitDiscovery() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const formId = useId();
  const [values, setValues] = useState<FormValues>(emptyForm);
  const [errors, setErrors] = useState<SubmissionErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const { add } = useSubmissions();

  const open = useCallback(() => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    restoreFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setFormError(null);
    dialog.showModal();
  }, []);

  useEffect(() => {
    window.addEventListener(OPEN_SUBMIT_EVENT, open);
    // Support old deep links such as /map#submit.
    const openFromHash = () => {
      if (window.location.hash === "#submit") open();
    };
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => {
      window.removeEventListener(OPEN_SUBMIT_EVENT, open);
      window.removeEventListener("hashchange", openFromHash);
    };
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onClose = () => {
      if (window.location.hash === "#submit") {
        window.history.replaceState(null, "", window.location.pathname + window.location.search);
      }
      restoreFocusRef.current?.focus();
    };
    dialog.addEventListener("close", onClose);
    return () => dialog.removeEventListener("close", onClose);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 4500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const update = (field: keyof FormValues, value: string) => {
    setValues((previous) => ({ ...previous, [field]: value }));
    if (field in errors) setErrors((previous) => ({ ...previous, [field]: undefined }));
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;
    const result = validateSubmission(values);
    if (!result.ok) {
      setErrors(result.errors);
      setFormError("Please fix the highlighted fields.");
      const firstInvalid = Object.keys(result.errors)[0];
      if (firstInvalid) document.getElementById(`${formId}-${firstInvalid}`)?.focus();
      return;
    }
    setSubmitting(true);
    setFormError(null);
    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...result.value, website: values.website }),
      });
      const data = (await response.json().catch(() => ({}))) as { error?: string; errors?: SubmissionErrors };
      if (!response.ok) {
        if (data.errors) setErrors(data.errors);
        setFormError(
          response.status === 429
            ? "Too many submissions from this connection. Please try again in a few minutes."
            : (data.error ?? "Something went wrong. Please try again."),
        );
        return;
      }
      add({
        id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
        title: result.value.title,
        region: result.value.region,
        category: result.value.category,
        createdAt: new Date().toISOString(),
      });
      setValues(emptyForm);
      setErrors({});
      dialogRef.current?.close();
      setToast("Thanks! Your discovery was sent for review.");
    } catch {
      setFormError("You seem to be offline. Please try again when you are connected.");
    } finally {
      setSubmitting(false);
    }
  };

  const fieldProps = (field: SubmissionField) => ({
    id: `${formId}-${field}`,
    name: field,
    "aria-invalid": errors[field] ? true : undefined,
    "aria-describedby": errors[field] ? `${formId}-${field}-error` : undefined,
  });

  const fieldError = (field: SubmissionField) =>
    errors[field] ? (
      <p id={`${formId}-${field}-error`} className="mt-1.5 text-[14px] text-[#FF8A9B]">
        {errors[field]}
      </p>
    ) : null;

  return (
    <>
      <dialog
        ref={dialogRef}
        aria-labelledby={`${formId}-heading`}
        className="dialog-sheet dialog-modal backdrop:bg-transparent"
        onClick={(event) => {
          if (event.target === event.currentTarget) dialogRef.current?.close();
        }}
      >
        <div className="p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] md:p-8">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h2 id={`${formId}-heading`} className="card-title">
                Submit a Discovery
              </h2>
              <p className="mt-1 text-[15px] text-muted">
                Found something? Tell us. Every submission is reviewed by hand before anything is published.
              </p>
            </div>
            <button
              type="button"
              aria-label="Close"
              onClick={() => dialogRef.current?.close()}
              className="-mt-1 -mr-2 flex size-11 shrink-0 items-center justify-center rounded-full text-muted transition-colors duration-150 hover:text-fg"
            >
              <CloseIcon size={22} />
            </button>
          </div>

          <form noValidate onSubmit={onSubmit} className="flex flex-col gap-4">
            <div>
              <label htmlFor={`${formId}-title`} className="mb-1.5 flex justify-between text-[15px] font-medium">
                Title <span className="font-normal text-muted">{values.title.length}/{SUBMISSION_LIMITS.title}</span>
              </label>
              <input
                {...fieldProps("title")}
                type="text"
                required
                maxLength={SUBMISSION_LIMITS.title}
                autoComplete="off"
                value={values.title}
                onChange={(event) => update("title", event.target.value)}
                className="field"
                placeholder="e.g. Hidden mural behind the diner"
              />
              {fieldError("title")}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor={`${formId}-region`} className="mb-1.5 block text-[15px] font-medium">
                  Region
                </label>
                <select
                  {...fieldProps("region")}
                  required
                  value={values.region}
                  onChange={(event) => update("region", event.target.value)}
                  className="field"
                >
                  <option value="" disabled>
                    Choose a region
                  </option>
                  {regions.map((region) => (
                    <option key={region.id} value={region.id}>
                      {region.name}
                    </option>
                  ))}
                </select>
                {fieldError("region")}
              </div>
              <div>
                <label htmlFor={`${formId}-category`} className="mb-1.5 block text-[15px] font-medium">
                  Category
                </label>
                <select
                  {...fieldProps("category")}
                  required
                  value={values.category}
                  onChange={(event) => update("category", event.target.value)}
                  className="field"
                >
                  <option value="" disabled>
                    Choose a category
                  </option>
                  {submissionCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {fieldError("category")}
              </div>
            </div>

            <div>
              <label htmlFor={`${formId}-description`} className="mb-1.5 flex justify-between text-[15px] font-medium">
                Description
                <span className="font-normal text-muted">
                  {values.description.length}/{SUBMISSION_LIMITS.description}
                </span>
              </label>
              <textarea
                {...fieldProps("description")}
                required
                rows={4}
                maxLength={SUBMISSION_LIMITS.description}
                value={values.description}
                onChange={(event) => update("description", event.target.value)}
                className="field resize-y"
                placeholder="What is it, and how do you get there? For cheats, list the exact buttons and platform."
              />
              {fieldError("description")}
            </div>

            <div>
              <label htmlFor={`${formId}-contact`} className="mb-1.5 block text-[15px] font-medium">
                Contact <span className="font-normal text-muted">(optional)</span>
              </label>
              <input
                {...fieldProps("contact")}
                type="text"
                maxLength={SUBMISSION_LIMITS.contact}
                autoComplete="off"
                value={values.contact}
                onChange={(event) => update("contact", event.target.value)}
                className="field"
                placeholder="Email or handle, if you want credit or a reply"
              />
              {fieldError("contact")}
            </div>

            {/* Honeypot: hidden from people and assistive tech; bots tend to fill it. */}
            <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
              <label htmlFor={`${formId}-website`}>Website</label>
              <input
                id={`${formId}-website`}
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={values.website}
                onChange={(event) => update("website", event.target.value)}
              />
            </div>

            <p role="alert" className="min-h-0 text-[15px] text-[#FF8A9B] empty:hidden">
              {formError}
            </p>

            <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:justify-end">
              <button type="button" className="btn-secondary" onClick={() => dialogRef.current?.close()}>
                Cancel
              </button>
              <button type="submit" className="btn-primary" disabled={submitting} aria-disabled={submitting}>
                {submitting ? "Sending…" : "Send for Review"}
              </button>
            </div>
          </form>
        </div>
      </dialog>

      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 top-[calc(var(--header-h)+env(safe-area-inset-top)+12px)] z-50 flex justify-center px-4"
      >
        {toast ? (
          <p className="pointer-events-auto rounded-full bg-ok px-5 py-3 text-[15px] font-semibold text-on-accent">
            {toast}
          </p>
        ) : null}
      </div>
    </>
  );
}
