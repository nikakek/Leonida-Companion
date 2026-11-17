import { isRegionId, type RegionId } from "@/config/regions";

/** Shared by the client form and the API route so both validate identically. */

export const SUBMISSION_LIMITS = { title: 80, description: 600, contact: 120 } as const;

export const submissionCategories = [
  "Easter Egg",
  "Collectible",
  "Stunt Jump",
  "Safe House",
  "Cheat",
  "Other",
] as const;

export type SubmissionCategory = (typeof submissionCategories)[number];

export interface Submission {
  title: string;
  region: RegionId;
  category: SubmissionCategory;
  description: string;
  contact: string;
}

export type SubmissionField = keyof Submission;
export type SubmissionErrors = Partial<Record<SubmissionField, string>>;

export type ValidationResult = { ok: true; value: Submission } | { ok: false; errors: SubmissionErrors };

/** Trims and strips control characters (newlines are kept only where allowed). */
export function cleanText(value: unknown, { multiline = false } = {}): string {
  if (typeof value !== "string") return "";
  const pattern = multiline ? /[\u0000-\u0009\u000B-\u001F\u007F]/g : /[\u0000-\u001F\u007F]/g;
  return value.replace(/\r\n?/g, "\n").replace(pattern, "").trim();
}

function isCategory(value: unknown): value is SubmissionCategory {
  return typeof value === "string" && (submissionCategories as readonly string[]).includes(value);
}

export function validateSubmission(raw: unknown): ValidationResult {
  const input = (typeof raw === "object" && raw !== null ? raw : {}) as Record<string, unknown>;
  const title = cleanText(input.title);
  const description = cleanText(input.description, { multiline: true });
  const contact = cleanText(input.contact);
  const errors: SubmissionErrors = {};

  if (!title) errors.title = "Add a short title.";
  else if (title.length > SUBMISSION_LIMITS.title) errors.title = `Keep the title under ${SUBMISSION_LIMITS.title} characters.`;

  if (!isRegionId(input.region)) errors.region = "Choose a region.";
  if (!isCategory(input.category)) errors.category = "Choose a category.";

  if (!description) errors.description = "Describe what you found and where.";
  else if (description.length > SUBMISSION_LIMITS.description)
    errors.description = `Keep the description under ${SUBMISSION_LIMITS.description} characters.`;

  if (contact.length > SUBMISSION_LIMITS.contact) errors.contact = `Keep contact under ${SUBMISSION_LIMITS.contact} characters.`;

  if (Object.keys(errors).length > 0 || !isRegionId(input.region) || !isCategory(input.category)) {
    return { ok: false, errors };
  }
  return { ok: true, value: { title, region: input.region, category: input.category, description, contact } };
}
