import { catalogAlbums } from "@/data/catalog";
import { findArtist, songCountForAlbum } from "@/lib/catalog-queries";
import { ALBUM_SORT_FIELDS, type AlbumSortBy } from "@/lib/albums-list-url";
import { buildPagination, parseListParams, type ListQuery } from "@/lib/list-params";
import type { Album, Artist } from "@/types/music";
import type { Pagination, SortOrder } from "@/types/list";

export type AlbumsQuery = ListQuery<AlbumSortBy>;

export interface AlbumRow {
  album: Album;
  artist?: Artist;
  songCount: number;
}

export interface PagedAlbums {
  albums: AlbumRow[];
  pagination: Pagination;
  sort: { sortBy: AlbumSortBy; sortOrder: SortOrder };
}

export function parseAlbumsParams(params: URLSearchParams) {
  return parseListParams(params, ALBUM_SORT_FIELDS, {
    sortBy: "title",
    sortOrder: "asc",
  });
}

function sortValue(album: Album, sortBy: AlbumSortBy): string | undefined {
  switch (sortBy) {
    case "title":
      return album.title;
    case "artist":
      return findArtist(album.artistId)?.name;
    case "releaseDate":
      return album.releaseDate;
  }
}

/** Case-insensitive; albums missing the value go last in both directions; ties by id. */
function sortAlbums(albums: Album[], sortBy: AlbumSortBy, order: SortOrder) {
  const direction = order === "desc" ? -1 : 1;
  const keys = new Map(
    albums.map((a) => [a.id, sortValue(a, sortBy)?.toLowerCase()]),
  );

  return [...albums].sort((a, b) => {
    const x = keys.get(a.id);
    const y = keys.get(b.id);
    if (x === undefined && y !== undefined) return 1;
    if (x !== undefined && y === undefined) return -1;
    if (x !== undefined && y !== undefined && x !== y) {
      return (x < y ? -1 : 1) * direction;
    }
    return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
  });
}

export function getPagedAlbums(query: AlbumsQuery): PagedAlbums {
  const { limit, offset, sortBy, sortOrder } = query;
  const sorted = sortAlbums(catalogAlbums, sortBy, sortOrder);

  const albums = sorted.slice(offset, offset + limit).map((album) => ({
    album,
    artist: findArtist(album.artistId),
    songCount: songCountForAlbum(album.id),
  }));

  return {
    albums,
    pagination: buildPagination(sorted.length, limit, offset),
    sort: { sortBy, sortOrder },
  };
}
