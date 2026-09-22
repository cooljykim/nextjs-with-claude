import type { Actor, CastCredit, Movie } from "@/types/film";

// A deterministic mock catalog for the /api/movies and /api/actors endpoints:
// 60 actors and 150 movies. It includes edge cases on purpose: movies with no
// synopsis, poster, director or content rating, actors and credits with missing
// fields, remakes that share a title with an earlier movie, and a few actors
// who appear in many movies.

const pad = (n: number, width: number) => String(n).padStart(width, "0");

// Small seeded random number generator, so the catalog is the same on every run.
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(20260921);
const pick = <T>(items: readonly T[]): T => items[Math.floor(rand() * items.length)];

const FIRST_NAMES = [
  "Ava", "Liam", "Noah", "Mia", "Ethan", "Zoe", "Lucas", "Nora", "Owen", "Ivy",
  "Caleb", "Ruby", "Miles", "Hazel", "Felix", "Iris", "Jasper", "Maya", "Theo", "Elena",
];
const LAST_NAMES = [
  "Hart", "Vale", "Quinn", "Rowe", "Stone", "Marsh", "Blake", "Ford", "Reyes", "Lane",
  "Cross", "Bennett", "Frost", "Wells", "Park", "Navarro", "Sloan", "Ellis", "Moreno", "Grey",
];

const TITLE_ADJECTIVES = [
  "Silent", "Crimson", "Last", "Hidden", "Broken", "Golden", "Midnight", "Forgotten", "Burning", "Distant",
  "Hollow", "Rising", "Fallen", "Secret", "Endless", "Winter", "Savage", "Gentle", "Lost", "Bright",
];
const TITLE_NOUNS = [
  "Horizon", "Kingdom", "Harbor", "Witness", "Frontier", "Garden", "Signal", "Empire", "Promise", "Shadow",
  "Voyage", "Letters", "Mirror", "Tide", "Summit", "Orchard", "Requiem", "Passage", "Fortune", "Echo",
];

const GENRES = [
  "Drama", "Comedy", "Thriller", "Action", "Sci-Fi", "Romance",
  "Horror", "Adventure", "Mystery", "Fantasy", "Crime", "Animation",
];
const CONTENT_RATINGS = ["G", "PG", "PG-13", "R"];
const CHARACTERS = [
  "Detective Ross", "Dr. Amari", "Captain Voss", "Mara", "Old Tom", "Professor Finch",
  "Sergeant Doyle", "Lena", "The Stranger", "Agent Kade", "Mayor Ellison", "Nina",
  "Judge Rowan", "Sam", "Colonel Hayes", "Iris", "Father Bell", "Jonah", "Queen Adela", "Rex",
];

const ACTOR_COUNT = 60;
const MOVIE_COUNT = 150;
const REMAKE_COUNT = 6; // the last few movies reuse the title of an earlier one

export const catalogActors: Actor[] = Array.from({ length: ACTOR_COUNT }, (_, i) => {
  const actor: Actor = {
    id: `actor-${pad(i + 1, 2)}`,
    // (i % 20, ...) never repeats a first/last name pair across the 60 actors.
    name: `${FIRST_NAMES[i % 20]} ${LAST_NAMES[(i * 3 + Math.floor(i / 20) * 5) % 20]}`,
  };
  if (i % 7 !== 0) {
    const year = 1950 + ((i * 11) % 50);
    const month = ((i * 5) % 12) + 1;
    const day = ((i * 13) % 28) + 1;
    actor.birthDate = `${year}-${pad(month, 2)}-${pad(day, 2)}`;
  }
  if (i % 3 !== 0) actor.imageUrl = `https://example.com/actors/${actor.id}.jpg`;
  return actor;
});

function makeCast(): CastCredit[] {
  const size = 3 + Math.floor(rand() * 4); // 3 to 6 actors
  const chosen = new Set<number>();
  while (chosen.size < size) {
    // Squaring the random number favors low indexes, so the first few actors
    // appear in many movies and the last few in very few.
    chosen.add(Math.floor(rand() ** 2 * ACTOR_COUNT));
  }
  return [...chosen].map((actorIndex, i) => {
    const credit: CastCredit = { actorId: catalogActors[actorIndex].id, order: i + 1 };
    if (rand() > 0.15) credit.character = pick(CHARACTERS);
    return credit;
  });
}

function makeMovie(i: number): Movie {
  const id = `movie-${pad(i + 1, 3)}`;
  // (i % 20, ...) never repeats an adjective/noun pair across the first 150 movies.
  const title = `${TITLE_ADJECTIVES[i % 20]} ${TITLE_NOUNS[(i * 3 + Math.floor(i / 20) * 7) % 20]}`;

  const genreCount = 1 + Math.floor(rand() * 3);
  const genres = [...new Set(Array.from({ length: genreCount }, () => pick(GENRES)))];

  const year = 1980 + ((i * 7) % 35); // 1980 to 2014
  const month = ((i * 5) % 12) + 1;
  const day = ((i * 11) % 28) + 1;

  const movie: Movie = {
    id,
    title: i % 3 === 0 ? `The ${title}` : title,
    releaseDate: `${year}-${pad(month, 2)}-${pad(day, 2)}`,
    runtimeMin: 80 + Math.floor(rand() * 100),
    genres,
    cast: makeCast(),
  };

  if (i % 10 !== 4) movie.contentRating = pick(CONTENT_RATINGS);
  if (i % 9 !== 0) {
    const [genre] = genres;
    movie.synopsis = `A ${genre.toLowerCase()} about ${TITLE_NOUNS[(i * 7) % 20].toLowerCase()} and ${TITLE_ADJECTIVES[(i * 3) % 20].toLowerCase()} secrets.`;
  }
  if (i % 3 !== 0) movie.posterUrl = `https://example.com/posters/${id}.jpg`;
  if (i % 13 !== 0) movie.director = `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`;

  return movie;
}

const originals = Array.from({ length: MOVIE_COUNT - REMAKE_COUNT }, (_, i) => makeMovie(i));

// Remakes: same title as an earlier movie, released years later.
const remakes = Array.from({ length: REMAKE_COUNT }, (_, j) => {
  const movie = makeMovie(MOVIE_COUNT - REMAKE_COUNT + j);
  const original = originals[j * 7];
  const month = ((j * 5) % 12) + 1;
  return {
    ...movie,
    title: original.title,
    releaseDate: `${2015 + j * 2}-${pad(month, 2)}-${pad(((j * 9) % 28) + 1, 2)}`,
  };
});

export const catalogMovies: Movie[] = [...originals, ...remakes];
