import { getPagedActors, parseActorsRequest } from "@/lib/paged-actors";

export async function GET(request: Request) {
  const parsed = parseActorsRequest(request);
  if ("errorResponse" in parsed) return parsed.errorResponse;

  return Response.json(getPagedActors(parsed.query));
}
