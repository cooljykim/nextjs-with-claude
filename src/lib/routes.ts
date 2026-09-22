// The one place that knows where each section lives in the UI.
// Link to pages through these, not hard-coded strings.

export const routes = {
  media: "/media",

  music: "/media/music",
  songs: "/media/music/songs",
  artists: "/media/music/artists",
  albums: "/media/music/albums",

  film: "/media/film",
  movies: "/media/film/movies",
  actors: "/media/film/actors",
} as const;

export const songHref = (id: string) => `${routes.songs}/${id}`;
export const artistHref = (id: string) => `${routes.artists}/${id}`;
export const albumHref = (id: string) => `${routes.albums}/${id}`;
export const movieHref = (id: string) => `${routes.movies}/${id}`;
export const actorHref = (id: string) => `${routes.actors}/${id}`;
