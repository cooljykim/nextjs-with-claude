import { listHref, type ListConfig, type ListState } from "@/lib/list-url";
import { routes } from "@/lib/routes";

export const ARTIST_SORT_FIELDS = ["name"] as const;
export type ArtistSortBy = (typeof ARTIST_SORT_FIELDS)[number];

export const ARTISTS_LIST: ListConfig = {
  basePath: `${routes.artists}/all`,
  defaultSortBy: "name",
  defaultSortOrder: "asc",
};

export function artistsListHref(state: Partial<ListState> = {}): string {
  return listHref(ARTISTS_LIST, state);
}
