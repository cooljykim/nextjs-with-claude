import { SORT_ORDERS, type Pagination, type SortOrder } from "@/types/list";
import { DEFAULT_PAGE_SIZE } from "@/lib/list-url";

const MIN_LIMIT = 1;
const MAX_LIMIT = 100;

/** Next.js searchParams -> URLSearchParams. Repeated parameters use the first value. */
export function toURLSearchParams(raw: {
  [key: string]: string | string[] | undefined;
}): URLSearchParams {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(raw)) {
    const first = Array.isArray(value) ? value[0] : value;
    if (first !== undefined) params.set(key, first);
  }
  return params;
}

export interface ListQuery<SortBy extends string> {
  limit: number;
  offset: number;
  sortBy: SortBy;
  sortOrder: SortOrder;
}

/** Parses and validates limit/offset/sortBy/sortOrder. Collects every problem found. */
export function parseListParams<SortBy extends string>(
  params: URLSearchParams,
  sortFields: readonly SortBy[],
  defaults: { sortBy: SortBy; sortOrder: SortOrder },
): { query: ListQuery<SortBy> } | { errors: string[] } {
  const errors: string[] = [];

  let limit = DEFAULT_PAGE_SIZE;
  const rawLimit = params.get("limit");
  if (rawLimit !== null) {
    if (!/^\d+$/.test(rawLimit) || +rawLimit < MIN_LIMIT || +rawLimit > MAX_LIMIT) {
      errors.push(`limit must be an integer from ${MIN_LIMIT} to ${MAX_LIMIT}`);
    } else {
      limit = +rawLimit;
    }
  }

  let offset = 0;
  const rawOffset = params.get("offset");
  if (rawOffset !== null) {
    if (!/^\d+$/.test(rawOffset)) {
      errors.push("offset must be an integer of 0 or more");
    } else {
      offset = +rawOffset;
    }
  }

  let sortBy = defaults.sortBy;
  const rawSortBy = params.get("sortBy");
  if (rawSortBy !== null) {
    if (!(sortFields as readonly string[]).includes(rawSortBy)) {
      errors.push(`sortBy must be one of: ${sortFields.join(", ")}`);
    } else {
      sortBy = rawSortBy as SortBy;
    }
  }

  let sortOrder = defaults.sortOrder;
  const rawSortOrder = params.get("sortOrder");
  if (rawSortOrder !== null) {
    if (!(SORT_ORDERS as readonly string[]).includes(rawSortOrder)) {
      errors.push(`sortOrder must be one of: ${SORT_ORDERS.join(", ")}`);
    } else {
      sortOrder = rawSortOrder as SortOrder;
    }
  }

  return errors.length > 0
    ? { errors }
    : { query: { limit, offset, sortBy, sortOrder } };
}

export function buildPagination(
  total: number,
  limit: number,
  offset: number,
): Pagination {
  return {
    total,
    limit,
    offset,
    hasNext: offset + limit < total,
    hasPrev: offset > 0,
    nextOffset: offset + limit < total ? offset + limit : null,
    prevOffset: offset > 0 ? Math.max(0, offset - limit) : null,
  };
}
