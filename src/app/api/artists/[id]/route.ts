import { artists } from "@/data/artists";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const artist = artists.find((a) => a.id === id);

  if (!artist) {
    return Response.json({ error: "Artist not found" }, { status: 404 });
  }

  return Response.json({ artist });
}
