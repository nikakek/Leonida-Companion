export type Status = "confirmed" | "testing" | "sample";

/** Shared fields every data record must carry. */
export interface Verifiable {
  status: Status;
  /** ISO date (YYYY-MM-DD) of the last verification check. */
  lastVerified: string;
  sourceUrl?: string;
}
