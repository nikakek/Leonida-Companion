/** Lowercase and strip diacritics/punctuation so "Solé" matches "sole". */
export function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9|]+/g, " ")
    .trim();
}

/** True when every whitespace-separated query token appears in the haystack. */
export function matchesQuery(fields: readonly string[], query: string): boolean {
  const tokens = normalize(query).split(" ").filter(Boolean);
  if (tokens.length === 0) return true;
  const haystack = normalize(fields.join(" "));
  return tokens.every((token) => haystack.includes(token));
}
