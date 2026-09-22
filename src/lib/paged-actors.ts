import { catalogActors } from "@/data/film-catalog";
import { buildPagination, parseListParams, type ListQuery } from "@/lib/list-params";
import { matchesAllTerms, parseSearchParam, searchTerms } from "@/lib/search";
import { sortItems } from "@/lib/sort";
import {
  ACTOR_SORT_FIELDS,
  type Actor,
  type ActorSortBy,
  type PagedActorList,
} from "@/types/film";

export type ActorsQuery = ListQuery<ActorSortBy> & { q?: string };

/** Validates every parameter of GET /api/actors. On a problem, returns the 400 response to send. */
export function parseActorsRequest(
  request: Request,
): { query: ActorsQuery } | { errorResponse: Response } {
  const params = new URL(request.url).searchParams;

  // Nothing can be expanded on the actors list.
  if (params.has("expand")) {
    return {
      errorResponse: Response.json(
        { error: "expand is not supported on this endpoint", allowed: [] },
        { status: 400 },
      ),
    };
  }

  const parsed = parseActorsQuery(params);
  if ("errors" in parsed) {
    return {
      errorResponse: Response.json({ error: parsed.errors.join("; ") }, { status: 400 }),
    };
  }

  return { query: parsed.query };
}

/** Validates limit, offset, sortBy, sortOrder and q. Collects every problem found. */
export function parseActorsQuery(
  params: URLSearchParams,
): { query: ActorsQuery } | { errors: string[] } {
  const list = parseListParams(params, ACTOR_SORT_FIELDS, {
    sortBy: "name",
    sortOrder: "asc",
  });
  const search = parseSearchParam(params);

  const errors = [
    ..."errors" in list ? list.errors : [],
    ..."error" in search ? [search.error] : [],
  ];
  if ("errors" in list || "error" in search) return { errors };

  return { query: { ...list.query, q: search.q } };
}

function sortKey(actor: Actor, sortBy: ActorSortBy): string | undefined {
  return sortBy === "name" ? actor.name : actor.birthDate;
}

export function getPagedActors(query: ActorsQuery): PagedActorList {
  const { limit, offset, sortBy, sortOrder, q } = query;

  const matched = q
    ? catalogActors.filter((a) => matchesAllTerms(searchTerms(q), [a.name]))
    : catalogActors;
  const sorted = sortItems(matched, (a) => sortKey(a, sortBy), (a) => a.id, sortOrder);

  const result: PagedActorList = {
    actors: sorted.slice(offset, offset + limit),
    pagination: buildPagination(sorted.length, limit, offset),
    sort: { sortBy, sortOrder },
  };
  if (q) result.search = { q };

  return result;
}
