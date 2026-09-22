import type { Pagination, SortOrder } from "@/types/list";

export interface Actor {
  id: string;
  name: string;
  birthDate?: string; // ISO 8601 date, e.g. "1975-03-21"
  imageUrl?: string;
}

export interface CastCredit {
  actorId: string; // references Actor.id
  character?: string;
  order?: number; // billing order
}

export interface Movie {
  id: string;
  title: string;
  releaseDate: string; // ISO 8601 date
  runtimeMin: number;
  genres: string[];
  contentRating?: string; // e.g. "PG-13"
  synopsis?: string;
  posterUrl?: string;
  director?: string;
  cast: CastCredit[];
}

export const MOVIE_SORT_FIELDS = ["title", "releaseDate", "runtime"] as const;
export type MovieSortBy = (typeof MOVIE_SORT_FIELDS)[number];

export const ACTOR_SORT_FIELDS = ["name", "birthDate"] as const;
export type ActorSortBy = (typeof ACTOR_SORT_FIELDS)[number];

export interface SearchInfo {
  q: string;
}

export interface PagedMovieList {
  movies: Movie[];
  actors?: Record<string, Actor>; // keyed by Actor.id; only with ?expand=actors
  pagination: Pagination;
  sort: { sortBy: MovieSortBy; sortOrder: SortOrder };
  search?: SearchInfo; // only when a search was applied
}

export interface PagedActorList {
  actors: Actor[];
  pagination: Pagination;
  sort: { sortBy: ActorSortBy; sortOrder: SortOrder };
  search?: SearchInfo;
}

export interface MovieDetail {
  movie: Movie;
  actors?: Record<string, Actor>; // keyed by Actor.id; only with ?expand=actors
}

export interface ActorDetail {
  actor: Actor;
  movies?: Movie[]; // filmography; only with ?expand=movies
}
