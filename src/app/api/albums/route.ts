import { albums } from "@/data/albums";

export async function GET() {
  return Response.json(albums);
}
