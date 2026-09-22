import { catalogActors, catalogMovies } from "@/data/film-catalog";
import type { Actor, Movie } from "@/types/film";

const actorsById = new Map(catalogActors.map((a) => [a.id, a]));
const moviesById = new Map(catalogMovies.map((m) => [m.id, m]));

export function findActor(id: string): Actor | undefined {
  return actorsById.get(id);
}

export function findMovie(id: string): Movie | undefined {
  return moviesById.get(id);
}

/** The actors in a movie's cast, keyed by id. */
export function actorsForMovies(movies: Movie[]): Record<string, Actor> {
  const result: Record<string, Actor> = {};
  for (const movie of movies) {
    for (const credit of movie.cast) {
      const actor = actorsById.get(credit.actorId);
      if (actor) result[actor.id] = actor;
    }
  }
  return result;
}

const movieCountByActor = new Map<string, number>();
for (const movie of catalogMovies) {
  for (const credit of movie.cast) {
    movieCountByActor.set(
      credit.actorId,
      (movieCountByActor.get(credit.actorId) ?? 0) + 1,
    );
  }
}

export const movieCountForActor = (actorId: string) =>
  movieCountByActor.get(actorId) ?? 0;

/** An actor's filmography, newest first. */
export function moviesForActor(actorId: string): Movie[] {
  return catalogMovies
    .filter((m) => m.cast.some((c) => c.actorId === actorId))
    .sort(
      (a, b) =>
        b.releaseDate.localeCompare(a.releaseDate) || a.id.localeCompare(b.id),
    );
}
