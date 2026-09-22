import { catalogAlbums, catalogArtists, catalogSongs } from "@/data/catalog";
import type { Album, Artist, Song } from "@/types/music";

const artistsById = new Map(catalogArtists.map((a) => [a.id, a]));
const albumsById = new Map(catalogAlbums.map((a) => [a.id, a]));
const songsById = new Map(catalogSongs.map((s) => [s.id, s]));

export function findSong(id: string): Song | undefined {
  return songsById.get(id);
}

export function findArtist(id: string): Artist | undefined {
  return artistsById.get(id);
}

export function findAlbum(id: string): Album | undefined {
  return albumsById.get(id);
}

export function getAlbumsByArtist(artistId: string): Album[] {
  return catalogAlbums
    .filter((a) => a.artistId === artistId)
    .sort((a, b) => (b.releaseDate ?? "").localeCompare(a.releaseDate ?? ""));
}

export function getSongsByArtist(artistId: string): Song[] {
  return catalogSongs
    .filter((s) => s.artistId === artistId)
    .sort((a, b) => a.title.localeCompare(b.title) || a.id.localeCompare(b.id));
}

/** Tracks in album order. */
export function getSongsByAlbum(albumId: string): Song[] {
  return catalogSongs
    .filter((s) => s.albumId === albumId)
    .sort(
      (a, b) =>
        (a.trackNumber ?? Infinity) - (b.trackNumber ?? Infinity) ||
        a.id.localeCompare(b.id),
    );
}

const albumCountByArtist = new Map<string, number>();
for (const album of catalogAlbums) {
  albumCountByArtist.set(
    album.artistId,
    (albumCountByArtist.get(album.artistId) ?? 0) + 1,
  );
}

const songCountByArtist = new Map<string, number>();
const songCountByAlbum = new Map<string, number>();
for (const song of catalogSongs) {
  songCountByArtist.set(
    song.artistId,
    (songCountByArtist.get(song.artistId) ?? 0) + 1,
  );
  if (song.albumId) {
    songCountByAlbum.set(
      song.albumId,
      (songCountByAlbum.get(song.albumId) ?? 0) + 1,
    );
  }
}

export const albumCountForArtist = (artistId: string) =>
  albumCountByArtist.get(artistId) ?? 0;
export const songCountForArtist = (artistId: string) =>
  songCountByArtist.get(artistId) ?? 0;
export const songCountForAlbum = (albumId: string) =>
  songCountByAlbum.get(albumId) ?? 0;
