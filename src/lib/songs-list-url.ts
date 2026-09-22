import { DEFAULT_SORT_BY } from "@/types/paged-songs";
import { DEFAULT_SORT_ORDER } from "@/types/list";
import { listHref, type ListConfig, type ListState } from "@/lib/list-url";
import { routes } from "@/lib/routes";

export const SONGS_LIST_PATH = `${routes.songs}/all`;

export const SONGS_LIST: ListConfig = {
  basePath: SONGS_LIST_PATH,
  defaultSortBy: DEFAULT_SORT_BY,
  defaultSortOrder: DEFAULT_SORT_ORDER,
};

export function songsListHref(state: Partial<ListState> = {}): string {
  return listHref(SONGS_LIST, state);
}
