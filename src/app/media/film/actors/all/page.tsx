import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/media/breadcrumbs";
import { EmptyState } from "@/components/media/empty-state";
import { InvalidParamsNotice } from "@/components/media/invalid-params-notice";
import { Pagination } from "@/components/media/pagination";
import { SearchBox } from "@/components/media/search-box";
import { ActorTable } from "@/components/film/actor-table";
import { ACTORS_LIST } from "@/lib/actors-list-url";
import { movieCountForActor } from "@/lib/film-queries";
import { DEFAULT_PAGE_SIZE, listHref, listParams } from "@/lib/list-url";
import { toURLSearchParams } from "@/lib/list-params";
import { getPagedActors, parseActorsQuery } from "@/lib/paged-actors";
import { routes } from "@/lib/routes";

export const metadata: Metadata = { title: "All actors · Media" };

export default async function AllActorsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const parsed = parseActorsQuery(toURLSearchParams(await searchParams));
  const hasInvalidParams = "errors" in parsed;
  // Invalid parameters fall back to the defaults, with a notice.
  const query = hasInvalidParams
    ? {
        limit: DEFAULT_PAGE_SIZE,
        offset: 0,
        sortBy: "name" as const,
        sortOrder: "asc" as const,
        q: undefined,
      }
    : parsed.query;

  const { actors, pagination, sort, search } = getPagedActors(query);
  const q = search?.q;
  const rows = actors.map((actor) => ({
    actor,
    movieCount: movieCountForActor(actor.id),
  }));

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs
        items={[
          { label: "Media", href: routes.media },
          { label: "Film", href: routes.film },
          { label: "Actors", href: routes.actors },
          { label: "All actors" },
        ]}
      />
      <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
        All actors
      </h1>

      {hasInvalidParams && <InvalidParamsNotice />}

      <SearchBox
        action={ACTORS_LIST.basePath}
        label="Search actors"
        placeholder="Search actors by name"
        q={q}
        keep={Object.fromEntries(
          listParams(ACTORS_LIST, { ...sort, limit: pagination.limit }),
        )}
        clearHref={listHref(ACTORS_LIST, { ...sort, limit: pagination.limit })}
      />

      {rows.length > 0 ? (
        <ActorTable
          rows={rows}
          sortBy={sort.sortBy}
          sortOrder={sort.sortOrder}
          limit={pagination.limit}
          q={q}
        />
      ) : pagination.total === 0 ? (
        <EmptyState
          message={q ? `No actors match “${q}”.` : "There are no actors yet."}
          actionLabel={q ? "Clear search" : undefined}
          actionHref={q ? ACTORS_LIST.basePath : undefined}
        />
      ) : (
        <EmptyState
          message="There are no actors on this page."
          actionLabel="Back to the first page"
          actionHref={listHref(ACTORS_LIST, {
            ...sort,
            limit: pagination.limit,
            q,
          })}
        />
      )}

      <Pagination
        list={ACTORS_LIST}
        pagination={pagination}
        shown={rows.length}
        sortBy={sort.sortBy}
        sortOrder={sort.sortOrder}
        q={q}
      />
    </div>
  );
}
