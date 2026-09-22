import { albums } from "@/data/albums";
import { artists } from "@/data/artists";
import type { Album, Artist, Song } from "@/types/music";

const EXPANDABLE = ["artist", "album"] as const;
type Expandable = (typeof EXPANDABLE)[number];

/** Parses `?expand=artist,album`. Returns the invalid values if any are unknown. */
export function parseExpand(
  request: Request,
): { expand: Set<Expandable> } | { invalid: string[] } {
  const raw = new URL(request.url).searchParams.get("expand");
  const values = raw ? raw.split(",").map((v) => v.trim()).filter(Boolean) : [];

  const invalid = values.filter((v) => !EXPANDABLE.includes(v as Expandable));
  if (invalid.length > 0) return { invalid };

  return { expand: new Set(values as Expandable[]) };
}

export interface SongDetail {
  song: Song;
  artist?: Artist;
  album?: Album;
}

export function getSongDetail(
  song: Song,
  expand: Set<Expandable>,
): SongDetail {
  const result: SongDetail = { song };

  if (expand.has("artist")) {
    result.artist = artists.find((a) => a.id === song.artistId);
  }
  if (expand.has("album") && song.albumId) {
    result.album = albums.find((a) => a.id === song.albumId);
  }

  return result;
}

export interface SongList {
  songs: Song[];
  artists?: Record<string, Artist>; // keyed by Artist.id
  albums?: Record<string, Album>; // keyed by Album.id
}

/** Sideloads each referenced artist/album once, keyed by id, instead of nesting copies per song. */
export function sideloadSongs(
  songs: Song[],
  expand: Set<Expandable>,
): SongList {
  const result: SongList = { songs };

  if (expand.has("artist")) {
    const ids = new Set(songs.map((s) => s.artistId));
    result.artists = Object.fromEntries(
      artists.filter((a) => ids.has(a.id)).map((a) => [a.id, a]),
    );
  }
  if (expand.has("album")) {
    const ids = new Set(songs.flatMap((s) => (s.albumId ? [s.albumId] : [])));
    result.albums = Object.fromEntries(
      albums.filter((a) => ids.has(a.id)).map((a) => [a.id, a]),
    );
  }

  return result;
}

export function invalidExpandResponse(invalid: string[]) {
  return Response.json(
    {
      error: `Invalid expand value(s): ${invalid.join(", ")}`,
      allowed: EXPANDABLE,
    },
    { status: 400 },
  );
}
