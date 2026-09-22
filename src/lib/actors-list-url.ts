import { listHref, type ListConfig, type ListState } from "@/lib/list-url";
import { routes } from "@/lib/routes";

export const ACTORS_LIST: ListConfig = {
  basePath: `${routes.actors}/all`,
  defaultSortBy: "name",
  defaultSortOrder: "asc",
};

export function actorsListHref(state: Partial<ListState> = {}): string {
  return listHref(ACTORS_LIST, state);
}
