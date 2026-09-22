import { getPagedMovies, parseMoviesRequest } from "@/lib/paged-movies";

export async function GET(request: Request) {
  const parsed = parseMoviesRequest(request);
  if ("errorResponse" in parsed) return parsed.errorResponse;

  return Response.json(getPagedMovies(parsed.query, parsed.expand));
}
