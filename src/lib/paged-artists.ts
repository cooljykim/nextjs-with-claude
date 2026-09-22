import { catalogArtists } from "@/data/catalog";
import { albumCountForArtist, songCountForArtist } from "@/lib/catalog-queries";
import { ARTIST_SORT_FIELDS, type ArtistSortBy } from "@/lib/artists-list-url";
import { buildPagination, parseListParams, type ListQuery } from "@/lib/list-params";
import type { Artist } from "@/types/music";
import type { Pagination } from "@/types/list";

export type ArtistsQuery = ListQuery<ArtistSortBy>;

export interface ArtistRow {
  artist: Artist;
  albumCount: number;
  songCount: number;
}

export interface PagedArtists {
  artists: ArtistRow[];
  pagination: Pagination;
  sort: { sortBy: ArtistSortBy; sortOrder: "asc" | "desc" };
}

export function parseArtistsParams(params: URLSearchParams) {
  return parseListParams(params, ARTIST_SORT_FIELDS, {
    sortBy: "name",
    sortOrder: "asc",
  });
}

export function getPagedArtists(query: ArtistsQuery): PagedArtists {
  const { limit, offset, sortBy, sortOrder } = query;
  const direction = sortOrder === "desc" ? -1 : 1;

  // Case-insensitive by name; ties (equal names) are broken by id.
  const sorted = [...catalogArtists].sort((a, b) => {
    const x = a.name.toLowerCase();
    const y = b.name.toLowerCase();
    if (x !== y) return (x < y ? -1 : 1) * direction;
    return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
  });

  const artists = sorted.slice(offset, offset + limit).map((artist) => ({
    artist,
    albumCount: albumCountForArtist(artist.id),
    songCount: songCountForArtist(artist.id),
  }));

  return {
    artists,
    pagination: buildPagination(sorted.length, limit, offset),
    sort: { sortBy, sortOrder },
  };
}
