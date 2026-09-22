import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/media/breadcrumbs";
import { EmptyState } from "@/components/media/empty-state";
import { InvalidParamsNotice } from "@/components/media/invalid-params-notice";
import { Pagination } from "@/components/media/pagination";
import { SearchBox } from "@/components/media/search-box";
import { MovieTable } from "@/components/film/movie-table";
import { DEFAULT_PAGE_SIZE, listHref, listParams } from "@/lib/list-url";
import { toURLSearchParams } from "@/lib/list-params";
import { MOVIES_LIST } from "@/lib/movies-list-url";
import { getPagedMovies, parseMoviesQuery } from "@/lib/paged-movies";
import { routes } from "@/lib/routes";

export const metadata: Metadata = { title: "All movies · Media" };

export default async function AllMoviesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const parsed = parseMoviesQuery(toURLSearchParams(await searchParams));
  const hasInvalidParams = "errors" in parsed;
  // Invalid parameters fall back to the defaults, with a notice.
  const query = hasInvalidParams
    ? {
        limit: DEFAULT_PAGE_SIZE,
        offset: 0,
        sortBy: "title" as const,
        sortOrder: "asc" as const,
        q: undefined,
      }
    : parsed.query;

  const { movies, pagination, sort, search } = getPagedMovies(query, new Set());
  const q = search?.q;

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs
        items={[
          { label: "Media", href: routes.media },
          { label: "Film", href: routes.film },
          { label: "Movies", href: routes.movies },
          { label: "All movies" },
        ]}
      />
      <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
        All movies
      </h1>

      {hasInvalidParams && <InvalidParamsNotice />}

      <SearchBox
        action={MOVIES_LIST.basePath}
        label="Search movies"
        placeholder="Search by title, director, genre or actor"
        q={q}
        keep={Object.fromEntries(
          listParams(MOVIES_LIST, { ...sort, limit: pagination.limit }),
        )}
        clearHref={listHref(MOVIES_LIST, { ...sort, limit: pagination.limit })}
      />

      {movies.length > 0 ? (
        <MovieTable
          movies={movies}
          sortBy={sort.sortBy}
          sortOrder={sort.sortOrder}
          limit={pagination.limit}
          q={q}
        />
      ) : pagination.total === 0 ? (
        <EmptyState
          message={q ? `No movies match “${q}”.` : "There are no movies yet."}
          actionLabel={q ? "Clear search" : undefined}
          actionHref={q ? MOVIES_LIST.basePath : undefined}
        />
      ) : (
        <EmptyState
          message="There are no movies on this page."
          actionLabel="Back to the first page"
          actionHref={listHref(MOVIES_LIST, {
            ...sort,
            limit: pagination.limit,
            q,
          })}
        />
      )}

      <Pagination
        list={MOVIES_LIST}
        pagination={pagination}
        shown={movies.length}
        sortBy={sort.sortBy}
        sortOrder={sort.sortOrder}
        q={q}
      />
    </div>
  );
}
