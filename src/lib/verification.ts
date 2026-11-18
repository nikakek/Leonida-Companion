import type { Verifiable } from "@/lib/types";

/** Most recent `lastVerified` date (ISO) in a set of records: the "last updated" date shown on hub pages. */
export function latestVerified(records: readonly Verifiable[]): string {
  return records.reduce((latest, record) => (record.lastVerified > latest ? record.lastVerified : latest), "1970-01-01");
}

export function countByStatus(records: readonly Verifiable[]) {
  return {
    total: records.length,
    confirmed: records.filter((record) => record.status === "confirmed").length,
  };
}
