import { invalidExpandResponse, parseExpandParam } from "@/lib/expand";
import { actorsForMovies, findMovie } from "@/lib/film-queries";
import { MOVIE_EXPANDABLE } from "@/lib/paged-movies";
import type { MovieDetail } from "@/types/film";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const expand = parseExpandParam(
    new URL(request.url).searchParams,
    MOVIE_EXPANDABLE,
  );
  if ("invalid" in expand) {
    return invalidExpandResponse(expand.invalid, MOVIE_EXPANDABLE);
  }

  const { id } = await params;
  const movie = findMovie(id);
  if (!movie) {
    return Response.json({ error: "Movie not found" }, { status: 404 });
  }

  const result: MovieDetail = { movie };
  if (expand.expand.has("actors")) result.actors = actorsForMovies([movie]);

  return Response.json(result);
}
