# Movies API — Design

Status: **Implemented** (movies and actors APIs with mock data, and the UI pages under `/media/film`).

This document records the design discussions for the movies APIs. Decisions are added to the [Decision log](#decision-log) as they are made, and unresolved topics stay in [Open questions](#open-questions).

## Context

Movies will belong to the **media** category, alongside songs, artists and albums. The existing music APIs already settled a number of conventions, which are the starting point here (they can be changed for movies, but that should be a deliberate choice):

| Topic | Convention used by the music APIs |
| --- | --- |
| Path style | Flat resource paths, not nested under the category: `/api/songs`, `/api/artists`, `/api/albums`. The UI routes are nested (`/media/...`), and the API does not mirror them. |
| Versions | The original endpoints are unpaginated. Paginated endpoints live under `/api/v2/...`. Existing endpoints are not modified when a new capability is added. |
| Single-item response | An object with a named key: `{ "song": { ... } }`, with related records as optional sibling keys: `{ "song", "artist"?, "album"? }`. |
| List response | An object with a named key: `{ "songs": [ ... ] }`, never a bare array. |
| Relations | Records reference each other by ID only (`artistId`, `albumId`). Related records are included only when asked for with `?expand=`. |
| Expanded records in a list | Sideloaded once, as maps keyed by ID (`artists`, `albums`), to avoid duplicates. |
| Pagination | Offset-based: `limit` (default 10, 1–100) and `offset`, with a `pagination` block (`total`, `limit`, `offset`, `hasNext`, `hasPrev`, `nextOffset`, `prevOffset`). Invalid values return `400`. |
| Sorting | `sortBy` and `sortOrder` (`asc` / `desc`). Text is compared case-insensitively, missing values sort last in both directions, and ties are broken by `id`. The response echoes the applied sort. |
| Data | Mock data for now, structured so it can later be backed by a database. |

See `songs-pagination-design.md` for the reasoning behind the pagination and sorting conventions, including the cursor-based alternative.

## Content hierarchy

Media is split into **groups by medium**. Everything that only makes sense for one medium lives inside that group:

```
media
├── music
│   ├── songs
│   ├── albums
│   └── artists
└── film
    ├── movies
    └── actors     (directors and others may follow)
```

Albums and artists only apply to songs (the album page lists tracks, and the artist page lists songs and albums), so they belong to `music`, not to `media` directly. Movies get their own people list (actors) for the same reason.

### Planned UI routes

| Route | Purpose |
| --- | --- |
| `/media` | Media landing page |
| `/media/music` | Music group landing page |
| `/media/music/songs`, `/all`, `/[id]` | Songs: landing, paginated list, detail |
| `/media/music/artists`, `/all`, `/[id]` | Artists: landing, paginated list, detail |
| `/media/music/albums`, `/all`, `/[id]` | Albums: landing, paginated list, detail |
| `/media/film` | Film group landing page |
| `/media/film/movies`, `/all`, `/[id]` | Movies (tentative) |
| `/media/film/actors`, `/all`, `/[id]` | Actors (tentative) |

The group is named `film` (not `movies`) so the movies list is `/media/film/movies` instead of `/media/movies/movies`.

The media sidebar shows the groups as headings with their sections beneath: Songs, Artists and Albums under "Music", and Movies and Actors under "Film". The group headings need a clear visual difference from the links below them.

### API paths

The API stays flat and does not mirror the UI groups: `/api/songs`, `/api/artists`, `/api/albums`, and (for film) `/api/movies` and `/api/actors`. The resource names do not collide, so no group prefix is needed. This is worth revisiting if a generic `people` resource ever appears.

## Goals

- Provide movie and actor APIs that follow the conventions of the music APIs (wrapped responses, ID references, `expand`, offset pagination, sorting).
- Support finding movies and actors by keyword.
- Start with mock data that can later be swapped for a database.

## Non-goals (first version)

- Filtering by genre, year, rating and so on. It can be added to the list endpoints later.
- Directors, crew and studios as their own records. The director is plain text for now.
- Cursor-based pagination.
- Reviews, user ratings and watch lists.

## Open questions

None. Everything raised so far is settled in the [decision log](#decision-log).

## Decision log

Each entry records the decision, the date, and the reason.

1. **Media is split into groups by medium** (2026-09-21). Albums and artists only apply to songs, so they should not sit at the same level as movies and other media types. `music` and `film` sit side by side under `media`.
2. **Group names are `music` and `film`** (2026-09-21). A group named `movies` containing a list named `movies` would give `/media/movies/movies`.
3. **Artists and actors are separate lists, not one shared "people" list** (2026-09-21). Artists are not always people (bands and groups are artists), each medium stays independent, and a person who is both an artist and an actor is simply two records. If a link between the two is wanted later, an optional cross-reference can be added without merging them.
4. **Existing music routes move under `/media/music` with no redirects** (2026-09-21). The app is new, so old URLs are not worth preserving.
5. **Each group has its own landing page** (2026-09-21): `/media/music` and `/media/film`. The `/media` landing page stays.
6. **The API stays flat** (2026-09-21), as already decided for the music APIs.
7. **Director is plain text for now** (2026-09-21). A `director` string keeps the first version to two entities (movie and actor). It can become its own record later.
8. **Runtime is stored as `runtimeMin`** (2026-09-21). Minutes are the natural unit for films. Songs use `durationSec`; this is an intentional difference.
9. **Movies and actors are paginated from the start, at `/api/movies` and `/api/actors`** (2026-09-21). There is no unpaginated version and no `v2` prefix, because those only existed for songs to avoid changing an existing endpoint.
10. **Keyword search is supported** (2026-09-21) through a `q` parameter on the list endpoints. Filtering by fields such as genre or year is still deferred.
11. **Search details** (2026-09-21):
    - Movies are matched on title, director, genres and cast names. The synopsis is not searched, because long text produces noisy matches.
    - Terms are matched case-insensitively as substrings, and every term must match (AND).
    - There is no relevance sorting in the first version. A `sortBy=relevance` option can be added later if real use shows the need.
12. **Mock data** (2026-09-21): about 150 movies and 60 actors, with 3 to 6 cast members per movie. It includes edge cases: movies with no synopsis or poster, duplicate titles such as remakes, and actors who appear in many movies.

## API sketch

### Types

```ts
interface Actor {
  id: string;
  name: string;
  birthDate?: string; // ISO 8601 date
  imageUrl?: string;
}

interface CastCredit {
  actorId: string; // references Actor.id
  character?: string;
  order?: number; // billing order
}

interface Movie {
  id: string;
  title: string;
  releaseDate: string; // ISO 8601 date
  runtimeMin: number;
  genres: string[];
  contentRating?: string; // e.g. "PG-13"
  synopsis?: string;
  posterUrl?: string;
  director?: string;
  cast: CastCredit[];
}
```

A movie has many actors, each with a character name, so the cast is an array of credits on the movie (unlike a song, which has a single `artistId`).

### Endpoints

| Endpoint | Returns |
| --- | --- |
| `GET /api/movies` | `{ movies, actors?, pagination, sort, search? }` |
| `GET /api/movies/[id]` | `{ movie, actors? }` |
| `GET /api/actors` | `{ actors, pagination, sort, search? }` |
| `GET /api/actors/[id]` | `{ actor, movies? }` |

Unknown IDs return `404` with `{ "error": "..." }`. Invalid parameters return `400`.

### List parameters

| Param | Default | Rules |
| --- | --- | --- |
| `limit` | `10` | Integer, 1–100, otherwise `400` |
| `offset` | `0` | Integer, >= 0 |
| `sortBy` | `title` (movies), `name` (actors) | See below |
| `sortOrder` | `asc` | `asc` or `desc` |
| `expand` | none | Movies: `actors`. Actors: not applicable on the list. |
| `q` | none | Keyword search. See [Keyword search](#keyword-search). |

Sortable fields: movies by `title`, `releaseDate` and `runtime`; actors by `name` and `birthDate`. As with songs, text is compared case-insensitively, missing values sort last in both directions, and ties are broken by `id`.

### Expand

- `?expand=actors` on `GET /api/movies` sideloads each referenced actor once, as a map keyed by ID (the same shape as `artists` on the songs list). On `GET /api/movies/[id]` the actors are returned next to `movie`, also as a map keyed by ID (`{ movie, actors }`).
- `?expand=movies` on `GET /api/actors/[id]` returns the actor's filmography as `movies`.

### Keyword search

Search is a `q` parameter on the list endpoints, not a separate `/search` endpoint, so it combines with pagination, sorting and `expand`.

**Movies**

- Matches against `title`, `director`, `genres` and the **names of the cast**. The synopsis is not searched, because long text produces noisy matches.
- The query is trimmed and split on whitespace into terms. A movie matches when **every term** appears in at least one of the searched fields (AND across terms).
- Matching is a case-insensitive substring match.
- Example: `?q=ford star` matches a movie titled "Star Wars" with an actor named "Harrison Ford".
- Because each term only has to appear in some field, a full-name query can match more than that person. `?q=Ava Cross` finds movies with the actor "Ava Cross", and also movies with "Ava Hart" and "Caleb Cross" in the cast. Matching a phrase (for example, a quoted `"Ava Cross"`) is not supported in the first version.

**Actors:** matches against `name`, with the same term rules.

**Behavior**

- An empty or all-whitespace `q` is ignored. A `q` longer than 100 characters returns `400`.
- `pagination.total` is the number of **matching** items, and `offset` applies to the matches.
- The response echoes the search as `search: { q }` when one was applied.
- Sorting applies to the matches as usual. Search does not change the default sort.
- Clients should restart from `offset=0` when the query changes, as with the sort.

Not in the first version: a `sortBy=relevance` option (for example, title matches ahead of cast matches). It can be added later if it turns out to be needed.

Songs, artists and albums do not have search. Adding `q` to them would follow the same rules.

## Implementation notes

**Movies and actors APIs** (2026-09-21):

- Types in `src/types/film.ts`; the mock catalog (150 movies, 60 actors) in `src/data/film-catalog.ts`, generated deterministically so it is the same on every run.
- Routes: `src/app/api/movies/route.ts`, `movies/[id]/route.ts`, `actors/route.ts`, `actors/[id]/route.ts`.
- Logic in `src/lib/paged-movies.ts`, `paged-actors.ts` and `film-queries.ts`, using small shared helpers for `expand` (`expand.ts`), search (`search.ts`) and sorting (`sort.ts`), plus the list parameter parsing and pagination already used by artists and albums (`list-params.ts`).
- On `GET /api/actors`, any `expand` value returns `400`, since nothing can be expanded on the list.

**Regrouping of the music UI**

The regrouping of the music UI is **done** (2026-09-21). The checklist below is what it covered. Links to pages now go through `src/lib/routes.ts`, so a future move only needs to change that file and the route folders.

- **Routes to move** from `/media/{songs,artists,albums}/...` to `/media/music/{songs,artists,albums}/...`, keeping each section's landing, `all` and `[id]` pages.
- **New landing pages** for `/media/music` and `/media/film`.
- **Links to update:** the sidebar, breadcrumbs (Media / Music / Songs / ...), the "See all" and "Browse all" links, the list URL helpers (`SONGS_LIST_PATH`, the artists and albums list configs), and every hard-coded `/media/songs`, `/media/artists` and `/media/albums` link in components and pages.
- **Sidebar** becomes grouped: headings for Music and Film, with the sections beneath each.
- **Code layout:** the UI components currently live in `src/components/media/`. They are mostly music-specific, so they may move to a `music` folder, keeping the genuinely shared ones (pagination, breadcrumbs, empty state, and so on) in a shared place.
- **The music APIs and their design docs are unaffected**, since the API paths stay flat.
