import { songs } from "@/data/songs";
import {
  invalidExpandResponse,
  parseExpand,
  sideloadSongs,
} from "@/lib/expand-song";

export async function GET(request: Request) {
  const parsed = parseExpand(request);
  if ("invalid" in parsed) return invalidExpandResponse(parsed.invalid);

  return Response.json(sideloadSongs(songs, parsed.expand));
}
