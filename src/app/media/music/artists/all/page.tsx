import type { Metadata } from "next";
import { ArtistTable } from "@/components/media/artist-table";
import { Breadcrumbs } from "@/components/media/breadcrumbs";
import { EmptyState } from "@/components/media/empty-state";
import { InvalidParamsNotice } from "@/components/media/invalid-params-notice";
import { Pagination } from "@/components/media/pagination";
import { ARTISTS_LIST } from "@/lib/artists-list-url";
import { DEFAULT_PAGE_SIZE } from "@/lib/list-url";
import { toURLSearchParams } from "@/lib/list-params";
import { getPagedArtists, parseArtistsParams } from "@/lib/paged-artists";
import { routes } from "@/lib/routes";

export const metadata: Metadata = { title: "All artists · Media" };

export default async function AllArtistsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const parsed = parseArtistsParams(toURLSearchParams(await searchParams));
  const hasInvalidParams = "errors" in parsed;
  const query = hasInvalidParams
    ? {
        limit: DEFAULT_PAGE_SIZE,
        offset: 0,
        sortBy: "name" as const,
        sortOrder: "asc" as const,
      }
    : parsed.query;

  const { artists, pagination, sort } = getPagedArtists(query);

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs
        items={[
          { label: "Media", href: routes.media },
          { label: "Music", href: routes.music },
          { label: "Artists", href: routes.artists },
          { label: "All artists" },
        ]}
      />
      <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
        All artists
      </h1>

      {hasInvalidParams && <InvalidParamsNotice />}

      {artists.length > 0 ? (
        <ArtistTable
          rows={artists}
          sortBy={sort.sortBy}
          sortOrder={sort.sortOrder}
          limit={pagination.limit}
        />
      ) : (
        <EmptyState
          message="There are no artists on this page."
          actionLabel="Back to the first page"
          actionHref={ARTISTS_LIST.basePath}
        />
      )}

      <Pagination
        list={ARTISTS_LIST}
        pagination={pagination}
        shown={artists.length}
        sortBy={sort.sortBy}
        sortOrder={sort.sortOrder}
      />
    </div>
  );
}
