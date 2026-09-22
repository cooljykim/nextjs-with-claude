export const MAX_QUERY_LENGTH = 100;

/**
 * Parses `?q=`. The query is trimmed; an empty or all-whitespace query is
 * ignored (no search). Too long a query is an error.
 */
export function parseSearchParam(
  params: URLSearchParams,
): { q?: string } | { error: string } {
  const raw = params.get("q");
  if (raw === null) return {};

  const q = raw.trim();
  if (q === "") return {};
  if (q.length > MAX_QUERY_LENGTH) {
    return { error: `q must be at most ${MAX_QUERY_LENGTH} characters` };
  }
  return { q };
}

/** Splits a query into lowercase terms on whitespace. */
export function searchTerms(q: string): string[] {
  return q.toLowerCase().split(/\s+/).filter(Boolean);
}

/**
 * True when every term appears (case-insensitively, as a substring) in at
 * least one of the fields. Missing fields are skipped.
 */
export function matchesAllTerms(
  terms: string[],
  fields: (string | undefined)[],
): boolean {
  const haystack = fields.filter((f): f is string => f !== undefined).map((f) => f.toLowerCase());
  return terms.every((term) => haystack.some((field) => field.includes(term)));
}
