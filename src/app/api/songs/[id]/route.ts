import { songs } from "@/data/songs";
import {
  getSongDetail,
  invalidExpandResponse,
  parseExpand,
} from "@/lib/expand-song";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const parsed = parseExpand(request);
  if ("invalid" in parsed) return invalidExpandResponse(parsed.invalid);

  const { id } = await params;
  const song = songs.find((s) => s.id === id);

  if (!song) {
    return Response.json({ error: "Song not found" }, { status: 404 });
  }

  return Response.json(getSongDetail(song, parsed.expand));
}
