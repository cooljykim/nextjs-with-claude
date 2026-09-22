import { listHref, type ListConfig, type ListState } from "@/lib/list-url";
import { routes } from "@/lib/routes";

export const MOVIES_LIST: ListConfig = {
  basePath: `${routes.movies}/all`,
  defaultSortBy: "title",
  defaultSortOrder: "asc",
};

export function moviesListHref(state: Partial<ListState> = {}): string {
  return listHref(MOVIES_LIST, state);
}
