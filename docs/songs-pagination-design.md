# Songs Pagination API — Design

Status: **Implemented** (offset-based `GET /api/v2/songs`). The cursor-based alternative is documented for comparison only and is not implemented.

## Goal

Add a paginated songs API so clients don't receive every song at once. Clients choose how many songs to fetch (e.g. 10 or 20), can request the next or previous set, and can tell from each response the total number of songs and whether a next or previous set exists.

The existing endpoints (`/api/songs`, `/api/songs/[id]`, `/api/artists`, `/api/albums`, and their `[id]` variants) are **not modified**. Pagination is added as a new endpoint.

## Endpoint

`GET /api/v2/songs`

A new `v2` path is used instead of something like `/api/songs/paged`, because a static segment such as `paged` could collide with the existing `/api/songs/[id]` route, where it would be read as an ID.

## Request parameters

| Param    | Default | Rules                                                                                     |
| -------- | ------- | ----------------------------------------------------------------------------------------- |
| `limit`  | `10`    | Integer, 1–100. Out-of-range or non-numeric values return `400` (no silent clamping).     |
| `offset` | `0`     | Integer, >= 0. Number of songs to skip.                                                   |
| `expand` | none    | Same as the existing songs endpoint: `artist`, `album` (comma-separated). Unknown values return `400`. |
| `sortBy` | `title` | Field to sort by. One of the values in [Sorting](#sorting). Unknown values return `400`.   |
| `sortOrder` | `asc` | `asc` or `desc`. Anything else returns `400`.                                            |

Example:

```
GET /api/v2/songs?limit=20&offset=40&sortBy=artist&sortOrder=desc&expand=artist,album
```

## Sorting

`sortBy` accepts:

| Value         | Sorts by                                   | Notes                                              |
| ------------- | ------------------------------------------ | -------------------------------------------------- |
| `title`       | Song title                                 | Default.                                           |
| `artist`      | Artist name                                | Looked up from the song's `artistId`.              |
| `album`       | Album title                                | Looked up from `albumId`. Singles have no album.   |
| `duration`    | `durationSec`                              | Numeric.                                           |
| `genre`       | Genre                                      | Some songs may have no genre.                      |
| `releaseDate` | Release date of the song's album           | Songs without an album have no release date.       |

Rules:

- Text fields (`title`, `artist`, `album`, `genre`) are compared **case-insensitively**.
- Songs with a missing value for the sort field (no album, no genre, no release date) are placed **last**, for both `asc` and `desc`. This keeps the meaningful results at the top of every page-through.
- Ties are broken by song `id` (ascending), so the order is fully deterministic. Without this, songs with equal sort values (e.g. two songs with the same title) could shuffle between requests and break paging. `id` is only an internal tie-breaker; it is **not** an accepted `sortBy` value.
- Sorting is applied **before** `offset` / `limit`, so the pagination fields always refer to positions in the sorted list.
- Clients should restart from `offset=0` when they change `sortBy` or `sortOrder`, since the positions no longer mean the same songs.

## Response

```json
{
  "songs": [{ "id": "song-41", "...": "..." }],
  "artists": { "artist-1": { "...": "..." } },
  "albums": { "album-1": { "...": "..." } },
  "pagination": {
    "total": 2350,
    "limit": 20,
    "offset": 40,
    "hasNext": true,
    "hasPrev": true,
    "nextOffset": 60,
    "prevOffset": 20
  },
  "sort": {
    "sortBy": "artist",
    "sortOrder": "desc"
  }
}
```

- `songs` is the current page only, in sorted order.
- `sort` echoes the sort that was applied (including defaults), so clients can confirm what they got.
- `artists` / `albums` are present only when requested via `expand`. They are sideloaded and keyed by ID (same as the existing list endpoint), and only include records referenced by songs on the current page.
- `pagination.total` is the total number of songs (not just this page), so clients can show "41–60 of 2350" or compute a page count.
- `pagination.hasNext` / `hasPrev` say whether another set exists in each direction.
- `pagination.nextOffset` / `prevOffset` are the values to pass as `offset` to get the next / previous set. They are `null` when there is none. Clients don't need to do the arithmetic themselves.

### TypeScript sketch

```ts
interface Pagination {
  total: number;
  limit: number;
  offset: number;
  hasNext: boolean;
  hasPrev: boolean;
  nextOffset: number | null;
  prevOffset: number | null;
}

type SongSortBy =
  | "title"
  | "artist"
  | "album"
  | "duration"
  | "genre"
  | "releaseDate";

type SortOrder = "asc" | "desc";

interface PagedSongList {
  songs: Song[];
  artists?: Record<string, Artist>;
  albums?: Record<string, Album>;
  pagination: Pagination;
  sort: { sortBy: SongSortBy; sortOrder: SortOrder };
}
```

## Alternative: cursor-based pagination

This section describes the cursor-based option so the two approaches can be compared. It supports the same features as the offset design: a page size, next/previous navigation, a total count, `expand` and sorting.

### Endpoint

`GET /api/v2/cursor/songs` (tentative path, so it can live next to `/api/v2/songs` without a naming clash)

### Request parameters

| Param       | Default | Rules                                                                                              |
| ----------- | ------- | -------------------------------------------------------------------------------------------------- |
| `limit`     | `10`    | Same as the offset design: integer, 1–100, otherwise `400`.                                         |
| `after`     | none    | Opaque cursor of a song the client already has (normally the last one received). Returns the songs that come **after** that song in the sorted order. |
| `before`    | none    | Opaque cursor of a song the client already has (normally the first one received). Returns the songs that come **before** that song, in the same sorted order. |
| `expand`    | none    | Same as the offset design.                                                                         |
| `sortBy`    | `title` | Same fields and rules as [Sorting](#sorting).                                                      |
| `sortOrder` | `asc`   | `asc` or `desc`.                                                                                   |

- With neither `after` nor `before`, the first page is returned.
- `after` and `before` cannot be used together (`400`).
- A malformed cursor, or a cursor created with a different `sortBy` / `sortOrder` than the current request, returns `400`.

Example:

```
GET /api/v2/cursor/songs?limit=20&after=eyJ2IjoiTmVvbiBSYWluIiwiaWQiOiJzb25nLTIifQ&sortBy=title
```

### Cursors

A cursor is an opaque string (base64url-encoded JSON) that records the **sort values of one song** plus its `id`, for example:

```json
{ "sortBy": "title", "sortOrder": "asc", "v": "Neon Rain", "id": "song-2" }
```

- `v` is the song's value for the sort field. It can be `null` for songs with a missing value, which sort last (see [Sorting](#sorting)).
- `id` is the tie-breaker, so the position is exact even when many songs share the same sort value.
- A cursor identifies **a song the client has already received**, not the next song. The request `after=<cursor>` means "this was the last song I got; give me the songs that come after it". Nothing about the next set is calculated in advance.
- The server evaluates the position when the request arrives, by comparing songs against the cursor's values. So if the list changes between requests, the next page reflects the list as it is then: songs added after the cursor position appear, songs added before it do not shift anything, and songs removed are simply absent.
- The cursor stores values, not a reference to a row. If the song it points to is later deleted, or its value is edited, the cursor still works and marks the same position in the sort order.
- A cursor does **not** encode `limit`. Each request can use a different page size. It does encode `sortBy` and `sortOrder`, which is why a cursor is rejected under a different sort.
- Clients must treat cursors as opaque and never build or edit them. The format can change without notice.

### Response

```json
{
  "songs": [{ "id": "song-21", "...": "..." }],
  "artists": { "artist-1": { "...": "..." } },
  "albums": { "album-1": { "...": "..." } },
  "pageInfo": {
    "limit": 20,
    "hasNext": true,
    "hasPrev": true,
    "startCursor": "eyJ2Ijoi...",
    "endCursor": "eyJ2Ijoi..."
  },
  "total": 2350,
  "sort": {
    "sortBy": "title",
    "sortOrder": "asc"
  }
}
```

- `endCursor` is the cursor of the **last** song on this page. Send it as `after` to get the songs that come after it. It is `null` when the page is empty.
- `startCursor` is the cursor of the **first** song on this page. Send it as `before` to get the songs that come before it. It is `null` when the page is empty.
- The two cursors describe songs on the current page, not the neighbouring pages. Whether there is anything beyond them is what `hasNext` / `hasPrev` say.
- `hasNext` / `hasPrev` are worked out when the response is built. If songs are added or removed afterwards, the next request may return something different (for example, `hasNext: true` followed by an empty page). Clients should rely on the actual next response, not on an earlier flag.
- `hasNext` / `hasPrev` are determined by fetching one extra song beyond the page in each direction (`limit + 1`), so they are exact.
- `total` is the total number of songs. It does not depend on the cursor. It requires a separate count, which is cheap on mock data but is a full count on a large table (the same cost as in the offset design).
- There is no `offset`, and no way to ask for "page 7".
- `artists`, `albums`, `songs` and `sort` behave as in the offset design.

### TypeScript sketch

```ts
interface PageInfo {
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
  startCursor: string | null; // first song on this page; use as `before`
  endCursor: string | null; // last song on this page; use as `after`
}

interface CursorSongList {
  songs: Song[];
  artists?: Record<string, Artist>;
  albums?: Record<string, Album>;
  pageInfo: PageInfo;
  total: number;
  sort: { sortBy: SongSortBy; sortOrder: SortOrder };
}
```

### Implementation notes

- With in-memory mock data, sort the full list, find the position of the cursor with the same comparison function used for sorting, and slice from there.
- Once backed by a database, this becomes a keyset query such as `WHERE (sort_value, id) > (:v, :id) ORDER BY sort_value, id LIMIT :limit + 1`. It needs a composite index on each sortable column plus `id`. Rules for "missing values last" (`NULL`s) make the comparison more involved, and sorts on `artist`, `album` and `releaseDate` need the joined column to be indexable.
- Fetching the previous set (`before`) means querying in the opposite direction and reversing the result before returning it.
- The "missing values last" rule is the most complex part once a database is involved. See the next subsection.

### Missing values with a database

With in-memory mock data, one comparison function can encode "missing values last" and be reused for sorting and for finding the cursor position. With a database it is harder, because in SQL any comparison against `NULL` evaluates to "unknown". A simple keyset query such as

```sql
WHERE (genre, id) > (:cursorGenre, :cursorId)
```

silently drops every song whose `genre` is `NULL` (and the same applies to no album or no release date). Since missing values sort **last** in both directions, the query has to be written by cases, based on the cursor.

The examples below sort by `genre` and use `id` as the ascending tie-breaker. `:v` is the cursor's genre and `:id` is the cursor's song id.

**`after`, ascending, cursor on a song that has a genre:**

```sql
WHERE genre > :v
   OR (genre = :v AND id > :id)
   OR genre IS NULL                 -- songs with no genre come after all the others
ORDER BY genre IS NULL, genre ASC, id ASC
LIMIT :limit + 1
```

**`after`, ascending, cursor already inside the null group (`v` is `null`):**

```sql
WHERE genre IS NULL AND id > :id
ORDER BY id ASC
LIMIT :limit + 1
```

**`after`, descending, cursor on a song that has a genre.** The comparison flips, but the `IS NULL` branch still comes last, because missing values stay last:

```sql
WHERE genre < :v
   OR (genre = :v AND id > :id)
   OR genre IS NULL
ORDER BY genre IS NULL, genre DESC, id ASC
LIMIT :limit + 1
```

**`before`, ascending, cursor on a song that has a genre.** The query runs in the opposite direction, and the null group is *after* the cursor, so it is not included:

```sql
WHERE genre < :v
   OR (genre = :v AND id < :id)
ORDER BY genre DESC, id DESC        -- then reverse the rows before returning them
LIMIT :limit + 1
```

**`before`, ascending, cursor inside the null group.** Every song with a genre comes before it, plus the nulls with a smaller id:

```sql
WHERE genre IS NOT NULL
   OR (genre IS NULL AND id < :id)
ORDER BY genre IS NULL DESC, genre DESC, id DESC
LIMIT :limit + 1
```

That is roughly six query variants: two directions, times cursor-on-value versus cursor-on-null, times `asc` versus `desc`. The offset design needs only `ORDER BY genre NULLS LAST, id LIMIT :limit OFFSET :offset`.

Other side effects:

- **Ordering syntax varies.** `NULLS LAST` is not supported by every database. Some need `ORDER BY genre IS NULL, genre`.
- **Indexes.** A plain `(genre, id)` index may not serve a query that sorts nulls last, especially with mixed directions (`genre DESC`, `id ASC`). Indexes may need to be declared to match each sort, for example `(genre DESC NULLS LAST, id ASC)`.
- **The cursor must record null explicitly.** A song with no genre, one with an empty string and one with the text "null" have to be told apart, which is why the cursor allows `"v": null`.
- **Case-insensitive sorting.** The cursor must carry the value as it is compared (lowercased), and the index must be on `lower(title)` or the equivalent.
- **Joined sorts are the hardest.** Sorting by `artist`, `album` or `releaseDate` sorts by a column on another table, which a plain index on the songs table cannot cover.

### Options to reduce the complexity

If cursor pagination is built on a database, there are three ways to reduce this:

| Option | What it means | Trade-off |
| --- | --- | --- |
| **A. Keep "missing values last" and write the case-based queries** | Implement the query variants above, in a shared query builder. | Behavior stays consistent with the offset design, but there is more query logic to write, index and test. |
| **B. Store a sentinel instead of null** | Save missing values as a fixed value, e.g. an empty string for genre, so every song has a comparable value. A high-sorting sentinel can make them sort last in `asc` but they would then sort first in `desc`, so it needs care. | Simple comparisons and plain indexes, but the sentinel leaks into the data model and can be shown to clients by mistake. |
| **C. Limit cursor sorting to fields that are always present** | Only allow `title` and `duration` (plus `artist` if every song must have an artist) as `sortBy` on the cursor endpoint. `album`, `genre` and `releaseDate` stay offset-only. | Removes the null problem entirely, but the two endpoints support different sort fields. |

A fourth choice is to drop the "missing values last" rule on the cursor endpoint and let the database's default null ordering apply. That is simple, but the two endpoints would then order the same songs differently.

Option A is the closest match to the current design. Option C is the simplest if cursor pagination is only needed for the main list views.

## Comparison: offset-based vs. cursor-based

| Aspect | Offset-based (`limit` + `offset`) | Cursor-based (`limit` + `after` / `before`) |
| --- | --- | --- |
| Request | `offset=40` | `after=<opaque cursor>` |
| Jump to an arbitrary page ("page 7 of 100") | Yes, just compute the offset | No. Only next / previous from a known position |
| Next / previous | Yes, via `nextOffset` / `prevOffset` | Yes, via `endCursor` (as `after`) / `startCursor` (as `before`) |
| Total count | Yes (`pagination.total`) | Yes (`total`), but needs a separate count |
| `hasNext` / `hasPrev` | Computed from `offset`, `limit` and `total` | Computed by fetching `limit + 1` rows |
| Songs added or removed between requests | A page can repeat or skip a song | Stable. Position is tied to sort values, not to a row count |
| Deep pages on a large table | Slower: the database still scans and discards `offset` rows | Fast: an indexed lookup regardless of depth |
| Sorting | Simple: sort, then slice | More work: cursor must carry the sort value, and needs a matching index |
| Changing `sortBy` / `sortOrder` | Restart from `offset=0` | Old cursors become invalid (`400`). Restart with no cursor |
| Missing values sorting last | Easy | Cursor must handle `null` values and the comparison is more involved |
| Client complexity | Low. Easy to build page-number UIs | Slightly higher. Store and pass opaque cursors |
| URL sharing / bookmarking | Easy and readable | Works, but the URLs are opaque and can go stale if the cursor format changes |
| Best fit | Datasets of thousands of rows, admin tables, page-number UIs | Very large or frequently changing data, infinite scroll, feeds |

### Summary

- Choose **offset-based** when clients need page numbers or random access, the dataset is modest, and simplicity matters most.
- Choose **cursor-based** when the dataset is very large or changes constantly, consistency between requests matters, or the UI is an infinite scroll or feed.
- Both can be offered side by side. The response shapes are deliberately similar (`songs`, `artists`, `albums`, `sort`, plus `pagination` or `pageInfo`), so a client can move from one to the other with small changes.

## Decision: offset/limit vs. cursor

The comparison above does not change the current decision. Offset/limit is chosen over cursor-based pagination:

- Both approaches can provide everything that is required: a total count, `hasNext` / `hasPrev`, and next / previous navigation. Neither is out of reach with cursors. The difference is effort. Offsets need a plain `LIMIT` / `OFFSET`, while cursors need reverse-direction queries for "previous" and extra care for sorting and missing values (see [Missing values with a database](#missing-values-with-a-database)). The total count costs the same in both.
- Offsets also allow jumping straight to an arbitrary page, which cursors cannot do.
- With thousands of songs, the usual weakness of offsets (slower queries at very deep pages once backed by a database) is not a concern.
- Known trade-off: if songs are added or removed between requests, a page can repeat or skip a song.

If the data later grows to millions of rows or changes constantly, this can be switched to cursors. Clients follow `nextOffset` / `prevOffset` rather than computing offsets themselves, which keeps the switch small, but it is not zero: the request parameter changes from `offset` to `after` / `before`, and the response fields change from `pagination` to `pageInfo`.

## Sort order

The default is `sortBy=title&sortOrder=asc`. See [Sorting](#sorting) for the supported fields and tie-breaking rules.

## Decisions

1. **Offset/limit** is used, not `page` / `pageSize`. (`page` and `pageSize` can disagree if the page size changes between requests.)
2. **Default sort** is `title`, ascending. Sorting by `id` is not supported as a `sortBy` option; `id` is used only as the internal tie-breaker.
3. **Parameter names** are `sortBy` and `sortOrder`. Sortable fields: `title`, `artist`, `album`, `duration`, `genre`, `releaseDate`.
4. **Missing values** (no album, genre or release date) are placed last in both `asc` and `desc`.
5. **No multi-field sorting** for now. It could be added later, e.g. as a comma-separated `sortBy`.

There are no open questions.

## Implementation notes (for later)

- Add enough mock songs to make paging meaningful (dozens to hundreds).
- Reuse the existing `parseExpand` logic and the sideloading approach from `src/lib/expand-song.ts`.
- Validate `limit`, `offset`, `sortBy` and `sortOrder`, and return `400` with a clear message on bad input.
- Sorting by `artist`, `album` or `releaseDate` needs data from other records. With mock data that is a simple lookup by ID. Once backed by a database, it becomes a join, so those sort columns may need indexes.
- Compute `total` before slicing, and sort the full list before applying `offset` / `limit`.
