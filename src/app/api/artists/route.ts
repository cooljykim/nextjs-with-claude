import { artists } from "@/data/artists";

export async function GET() {
  return Response.json(artists);
}
