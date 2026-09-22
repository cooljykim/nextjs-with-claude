import { invalidExpandResponse, parseExpandParam } from "@/lib/expand";
import { findActor, moviesForActor } from "@/lib/film-queries";
import type { ActorDetail } from "@/types/film";

const ACTOR_EXPANDABLE = ["movies"] as const;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const expand = parseExpandParam(
    new URL(request.url).searchParams,
    ACTOR_EXPANDABLE,
  );
  if ("invalid" in expand) {
    return invalidExpandResponse(expand.invalid, ACTOR_EXPANDABLE);
  }

  const { id } = await params;
  const actor = findActor(id);
  if (!actor) {
    return Response.json({ error: "Actor not found" }, { status: 404 });
  }

  const result: ActorDetail = { actor };
  if (expand.expand.has("movies")) result.movies = moviesForActor(actor.id);

  return Response.json(result);
}
