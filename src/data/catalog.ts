import type { Album, Artist, Song } from "@/types/music";

// A larger, deterministic mock catalog for the paginated /api/v2 endpoints.
// It is separate from src/data/{songs,artists,albums}.ts so the original
// endpoints keep returning exactly what they did before.

const pad = (n: number, width: number) => String(n).padStart(width, "0");

const ARTISTS: { name: string; genre: string }[] = [
  { name: "Velvet Circuit", genre: "Synthwave" },
  { name: "Harbor & Pine", genre: "Indie Folk" },
  { name: "Lumen Field", genre: "Electronic" },
  { name: "The Paper Kites Club", genre: "Pop" },
  { name: "Marble Season", genre: "Jazz" },
  { name: "Ash & Ember", genre: "Rock" },
  { name: "Cobalt Youth", genre: "Hip Hop" },
  { name: "Northern Static", genre: "Ambient" },
  { name: "Golden Hour Assembly", genre: "Soul" },
  { name: "Quiet Orchard", genre: "Classical" },
  { name: "Iron Lantern", genre: "Metal" },
  { name: "Dust Road Choir", genre: "Country" },
];

const ALBUM_TITLES = [
  "After Dark",
  "Low Tide",
  "Signal Bloom",
  "Glass Houses",
  "Slow Weather",
  "Ninth Street",
  "Afterglow",
  "Fault Lines",
  "Small Hours",
  "Open Water",
  "Paper Moons",
  "Long Way Home",
  "Static Garden",
  "Red Sky Morning",
  "Borrowed Time",
  "Second Wind",
  "Northbound",
  "Hollow Crown",
  "Wildflower Season",
  "Blue Hour",
  "Echo Park",
  "Late Bloomers",
  "Salt & Light",
  "Overpass",
  "Kingfisher",
  "Tidewater",
  "Half Light",
  "Dry Season",
  "Loose Change",
  "Harvest Moon",
  "Copper Wire",
  "Undertow",
  "Winter Garden",
  "Field Notes",
  "Afterimage",
  "Last Call",
];

const ADJECTIVES = [
  "Midnight",
  "Neon",
  "Paper",
  "Quiet",
  "Static",
  "Golden",
  "Hollow",
  "Electric",
  "Faded",
  "Silver",
  "Restless",
  "Distant",
  "Velvet",
  "Broken",
  "Wild",
  "Slow",
];

const NOUNS = [
  "Drive",
  "Rain",
  "Boats",
  "Hours",
  "Bloom",
  "Ghost",
  "River",
  "Skyline",
  "Fire",
  "Letters",
  "Highway",
  "Garden",
  "Echo",
  "Shadow",
  "Harbor",
];

const ALBUMS_PER_ARTIST = 3;
const TRACKS_PER_ALBUM = 7;
const SINGLES_PER_ARTIST = 4;

export const catalogArtists: Artist[] = ARTISTS.map((a, i) => ({
  id: `artist-${pad(i + 1, 2)}`,
  name: a.name,
}));

export const catalogAlbums: Album[] = ARTISTS.flatMap((_, i) =>
  Array.from({ length: ALBUMS_PER_ARTIST }, (_, j) => {
    const n = i * ALBUMS_PER_ARTIST + j;
    const year = 2018 + ((i + j * 2) % 7);
    const month = ((i * 5 + j * 3) % 12) + 1;
    const day = ((i * 7 + j * 11) % 28) + 1;
    return {
      id: `album-${pad(n + 1, 2)}`,
      title: ALBUM_TITLES[n % ALBUM_TITLES.length],
      artistId: catalogArtists[i].id,
      releaseDate: `${year}-${pad(month, 2)}-${pad(day, 2)}`,
    };
  }),
);

let songCounter = 0;

function makeSong(artistIndex: number, albumId?: string, track?: number): Song {
  const n = songCounter++;
  const title = `${ADJECTIVES[n % ADJECTIVES.length]} ${NOUNS[(n * 7 + 3) % NOUNS.length]}`;
  const song: Song = {
    id: `song-${pad(n + 1, 3)}`,
    title,
    artistId: catalogArtists[artistIndex].id,
    durationSec: 150 + ((n * 37) % 150),
  };
  if (albumId) song.albumId = albumId;
  if (track) song.trackNumber = track;
  // Leave some songs without a genre to exercise "missing values last" sorting.
  if (n % 11 !== 0) song.genre = ARTISTS[artistIndex].genre;
  return song;
}

export const catalogSongs: Song[] = [
  ...catalogAlbums.flatMap((album) => {
    const artistIndex = catalogArtists.findIndex((a) => a.id === album.artistId);
    return Array.from({ length: TRACKS_PER_ALBUM }, (_, t) =>
      makeSong(artistIndex, album.id, t + 1),
    );
  }),
  // Singles: no album, no track number.
  ...ARTISTS.flatMap((_, artistIndex) =>
    Array.from({ length: SINGLES_PER_ARTIST }, () => makeSong(artistIndex)),
  ),
];
