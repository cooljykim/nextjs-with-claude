import type { Album, Artist, Song } from "@/types/music";
import type { Pagination, SortOrder } from "@/types/list";

export const SONG_SORT_FIELDS = [
  "title",
  "artist",
  "album",
  "duration",
  "genre",
  "releaseDate",
] as const;
export type SongSortBy = (typeof SONG_SORT_FIELDS)[number];

export const DEFAULT_SORT_BY: SongSortBy = "title";

export interface PagedSongList {
  songs: Song[];
  artists?: Record<string, Artist>; // keyed by Artist.id
  albums?: Record<string, Album>; // keyed by Album.id
  pagination: Pagination;
  sort: { sortBy: SongSortBy; sortOrder: SortOrder };
}
