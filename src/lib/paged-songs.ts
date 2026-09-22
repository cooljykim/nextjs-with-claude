import { catalogAlbums, catalogArtists, catalogSongs } from "@/data/catalog";
import {
  DEFAULT_SORT_BY,
  SONG_SORT_FIELDS,
  type PagedSongList,
  type SongSortBy,
} from "@/types/paged-songs";
import {
  DEFAULT_LIMIT,
  DEFAULT_SORT_ORDER,
  SORT_ORDERS,
  type SortOrder,
} from "@/types/list";
import type { Song } from "@/types/music";

const MIN_LIMIT = 1;
const MAX_LIMIT = 100;

export interface PagedSongsQuery {
  limit: number;
  offset: number;
  sortBy: SongSortBy;
  sortOrder: SortOrder;
}

const artistsById = new Map(catalogArtists.map((a) => [a.id, a]));
const albumsById = new Map(catalogAlbums.map((a) => [a.id, a]));

/** Parses and validates limit/offset/sortBy/sortOrder. Collects every problem found. */
export function parsePagedSongsQuery(
  request: Request,
): { query: PagedSongsQuery } | { errors: string[] } {
  return parsePagedSongsParams(new URL(request.url).searchParams);
}

export function parsePagedSongsParams(
  params: URLSearchParams,
): { query: PagedSongsQuery } | { errors: string[] } {
  const errors: string[] = [];

  let limit = DEFAULT_LIMIT;
  const rawLimit = params.get("limit");
  if (rawLimit !== null) {
    if (!/^\d+$/.test(rawLimit) || +rawLimit < MIN_LIMIT || +rawLimit > MAX_LIMIT) {
      errors.push(`limit must be an integer from ${MIN_LIMIT} to ${MAX_LIMIT}`);
    } else {
      limit = +rawLimit;
    }
  }

  let offset = 0;
  const rawOffset = params.get("offset");
  if (rawOffset !== null) {
    if (!/^\d+$/.test(rawOffset)) {
      errors.push("offset must be an integer of 0 or more");
    } else {
      offset = +rawOffset;
    }
  }

  let sortBy: SongSortBy = DEFAULT_SORT_BY;
  const rawSortBy = params.get("sortBy");
  if (rawSortBy !== null) {
    if (!(SONG_SORT_FIELDS as readonly string[]).includes(rawSortBy)) {
      errors.push(`sortBy must be one of: ${SONG_SORT_FIELDS.join(", ")}`);
    } else {
      sortBy = rawSortBy as SongSortBy;
    }
  }

  let sortOrder: SortOrder = DEFAULT_SORT_ORDER;
  const rawSortOrder = params.get("sortOrder");
  if (rawSortOrder !== null) {
    if (!(SORT_ORDERS as readonly string[]).includes(rawSortOrder)) {
      errors.push(`sortOrder must be one of: ${SORT_ORDERS.join(", ")}`);
    } else {
      sortOrder = rawSortOrder as SortOrder;
    }
  }

  return errors.length > 0
    ? { errors }
    : { query: { limit, offset, sortBy, sortOrder } };
}

/** The value a song is sorted on, or undefined when the song has none. */
function sortValue(song: Song, sortBy: SongSortBy): string | number | undefined {
  switch (sortBy) {
    case "title":
      return song.title;
    case "artist":
      return artistsById.get(song.artistId)?.name;
    case "album":
      return song.albumId ? albumsById.get(song.albumId)?.title : undefined;
    case "duration":
      return song.durationSec;
    case "genre":
      return song.genre;
    case "releaseDate":
      return song.albumId ? albumsById.get(song.albumId)?.releaseDate : undefined;
  }
}

function compareValues(a: string | number, b: string | number): number {
  if (typeof a === "number" && typeof b === "number") return a - b;
  const x = String(a).toLowerCase();
  const y = String(b).toLowerCase();
  return x < y ? -1 : x > y ? 1 : 0;
}

/**
 * Sorts by the requested field, case-insensitively. Songs missing the value go
 * last in both directions. Ties are broken by song id (ascending) so the order
 * is fully deterministic.
 */
function sortSongs(songs: Song[], sortBy: SongSortBy, sortOrder: SortOrder): Song[] {
  const direction = sortOrder === "desc" ? -1 : 1;
  const keys = new Map(songs.map((s) => [s.id, sortValue(s, sortBy)]));

  return [...songs].sort((a, b) => {
    const va = keys.get(a.id);
    const vb = keys.get(b.id);

    if (va === undefined && vb !== undefined) return 1;
    if (va !== undefined && vb === undefined) return -1;
    if (va !== undefined && vb !== undefined) {
      const cmp = compareValues(va, vb);
      if (cmp !== 0) return cmp * direction;
    }
    return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
  });
}

export function getPagedSongs(
  query: PagedSongsQuery,
  expand: Set<"artist" | "album">,
): PagedSongList {
  const { limit, offset, sortBy, sortOrder } = query;

  const sorted = sortSongs(catalogSongs, sortBy, sortOrder);
  const total = sorted.length;
  const songs = sorted.slice(offset, offset + limit);

  const result: PagedSongList = {
    songs,
    pagination: {
      total,
      limit,
      offset,
      hasNext: offset + limit < total,
      hasPrev: offset > 0,
      nextOffset: offset + limit < total ? offset + limit : null,
      prevOffset: offset > 0 ? Math.max(0, offset - limit) : null,
    },
    sort: { sortBy, sortOrder },
  };

  if (expand.has("artist")) {
    const ids = new Set(songs.map((s) => s.artistId));
    result.artists = Object.fromEntries(
      catalogArtists.filter((a) => ids.has(a.id)).map((a) => [a.id, a]),
    );
  }
  if (expand.has("album")) {
    const ids = new Set(songs.flatMap((s) => (s.albumId ? [s.albumId] : [])));
    result.albums = Object.fromEntries(
      catalogAlbums.filter((a) => ids.has(a.id)).map((a) => [a.id, a]),
    );
  }

  return result;
}
