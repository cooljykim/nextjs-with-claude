import { invalidExpandResponse, parseExpand } from "@/lib/expand-song";
import { getPagedSongs, parsePagedSongsQuery } from "@/lib/paged-songs";

export async function GET(request: Request) {
  const parsedExpand = parseExpand(request);
  if ("invalid" in parsedExpand) {
    return invalidExpandResponse(parsedExpand.invalid);
  }

  const parsedQuery = parsePagedSongsQuery(request);
  if ("errors" in parsedQuery) {
    return Response.json(
      { error: parsedQuery.errors.join("; ") },
      { status: 400 },
    );
  }

  return Response.json(getPagedSongs(parsedQuery.query, parsedExpand.expand));
}
