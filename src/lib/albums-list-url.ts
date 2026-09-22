import { listHref, type ListConfig, type ListState } from "@/lib/list-url";
import { routes } from "@/lib/routes";

export const ALBUM_SORT_FIELDS = ["title", "artist", "releaseDate"] as const;
export type AlbumSortBy = (typeof ALBUM_SORT_FIELDS)[number];

export const ALBUMS_LIST: ListConfig = {
  basePath: `${routes.albums}/all`,
  defaultSortBy: "title",
  defaultSortOrder: "asc",
};

export function albumsListHref(state: Partial<ListState> = {}): string {
  return listHref(ALBUMS_LIST, state);
}
