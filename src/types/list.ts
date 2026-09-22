// Generic shapes shared by every paginated list (songs, artists, albums,
// movies, actors, ...). Nothing here is specific to one resource.

export const SORT_ORDERS = ["asc", "desc"] as const;
export type SortOrder = (typeof SORT_ORDERS)[number];

export const DEFAULT_LIMIT = 10;
export const DEFAULT_SORT_ORDER: SortOrder = "asc";

export interface Pagination {
  total: number;
  limit: number;
  offset: number;
  hasNext: boolean;
  hasPrev: boolean;
  nextOffset: number | null;
  prevOffset: number | null;
}
