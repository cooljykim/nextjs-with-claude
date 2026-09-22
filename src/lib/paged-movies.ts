import { catalogMovies } from "@/data/film-catalog";
import { invalidExpandResponse, parseExpandParam } from "@/lib/expand";
import { actorsForMovies, findActor } from "@/lib/film-queries";
import { buildPagination, parseListParams, type ListQuery } from "@/lib/list-params";
import { matchesAllTerms, parseSearchParam, searchTerms } from "@/lib/search";
import { sortItems } from "@/lib/sort";
import {
  MOVIE_SORT_FIELDS,
  type Movie,
  type MovieSortBy,
  type PagedMovieList,
} from "@/types/film";

export const MOVIE_EXPANDABLE = ["actors"] as const;
export type MovieExpand = (typeof MOVIE_EXPANDABLE)[number];

export type MoviesQuery = ListQuery<MovieSortBy> & { q?: string };

/** Validates every parameter of GET /api/movies. On a problem, returns the 400 response to send. */
export function parseMoviesRequest(
  request: Request,
): { query: MoviesQuery; expand: Set<MovieExpand> } | { errorResponse: Response } {
  const params = new URL(request.url).searchParams;

  const expand = parseExpandParam(params, MOVIE_EXPANDABLE);
  if ("invalid" in expand) {
    return { errorResponse: invalidExpandResponse(expand.invalid, MOVIE_EXPANDABLE) };
  }

  const parsed = parseMoviesQuery(params);
  if ("errors" in parsed) {
    return {
      errorResponse: Response.json({ error: parsed.errors.join("; ") }, { status: 400 }),
    };
  }

  return { query: parsed.query, expand: expand.expand };
}

/** Validates limit, offset, sortBy, sortOrder and q. Collects every problem found. */
export function parseMoviesQuery(
  params: URLSearchParams,
): { query: MoviesQuery } | { errors: string[] } {
  const list = parseListParams(params, MOVIE_SORT_FIELDS, {
    sortBy: "title",
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

/** Title, director, genres and the names of the cast. The synopsis is not searched. */
function searchableFields(movie: Movie): (string | undefined)[] {
  return [
    movie.title,
    movie.director,
    ...movie.genres,
    ...movie.cast.map((credit) => findActor(credit.actorId)?.name),
  ];
}

function sortKey(movie: Movie, sortBy: MovieSortBy): string | number {
  switch (sortBy) {
    case "title":
      return movie.title;
    case "releaseDate":
      return movie.releaseDate;
    case "runtime":
      return movie.runtimeMin;
  }
}

export function getPagedMovies(
  query: MoviesQuery,
  expand: Set<MovieExpand>,
): PagedMovieList {
  const { limit, offset, sortBy, sortOrder, q } = query;

  const matched = q
    ? catalogMovies.filter((m) => matchesAllTerms(searchTerms(q), searchableFields(m)))
    : catalogMovies;
  const sorted = sortItems(matched, (m) => sortKey(m, sortBy), (m) => m.id, sortOrder);
  const movies = sorted.slice(offset, offset + limit);

  const result: PagedMovieList = {
    movies,
    pagination: buildPagination(sorted.length, limit, offset),
    sort: { sortBy, sortOrder },
  };
  if (q) result.search = { q };
  if (expand.has("actors")) result.actors = actorsForMovies(movies);

  return result;
}
