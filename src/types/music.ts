export interface Artist {
  id: string;
  name: string;
  imageUrl?: string;
}

export interface Album {
  id: string;
  title: string;
  artistId: string; // references Artist.id
  releaseDate?: string; // ISO 8601 date, e.g. "2024-05-17"
  coverUrl?: string;
}

export interface Song {
  id: string;
  title: string;
  artistId: string; // references Artist.id
  albumId?: string; // references Album.id; singles may have no album
  trackNumber?: number; // position within the album
  durationSec: number;
  genre?: string;
}
