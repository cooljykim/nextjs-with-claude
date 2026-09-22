import type { SortOrder } from "@/types/list";

export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];
export const DEFAULT_PAGE_SIZE = 10;

/** Describes one paginated list page, so shared components can build its links. */
export interface ListConfig {
  basePath: string;
  defaultSortBy: string;
  defaultSortOrder: SortOrder;
}

export interface ListState {
  limit: number;
  offset: number;
  sortBy: string;
  sortOrder: SortOrder;
  q: string; // keyword search; lists without search never set it
}

/** The query parameters for a list link. Parameters equal to their defaults are left out. */
export function listParams(
  config: ListConfig,
  state: Partial<ListState> = {},
): URLSearchParams {
  const params = new URLSearchParams();

  if (state.q) {
    params.set("q", state.q);
  }
  if (state.limit !== undefined && state.limit !== DEFAULT_PAGE_SIZE) {
    params.set("limit", String(state.limit));
  }
  if (state.offset !== undefined && state.offset !== 0) {
    params.set("offset", String(state.offset));
  }
  if (state.sortBy !== undefined && state.sortBy !== config.defaultSortBy) {
    params.set("sortBy", state.sortBy);
  }
  if (
    state.sortOrder !== undefined &&
    state.sortOrder !== config.defaultSortOrder
  ) {
    params.set("sortOrder", state.sortOrder);
  }

  return params;
}

/** Builds a link to a list page. */
export function listHref(
  config: ListConfig,
  state: Partial<ListState> = {},
): string {
  const query = listParams(config, state).toString();
  return query ? `${config.basePath}?${query}` : config.basePath;
}
