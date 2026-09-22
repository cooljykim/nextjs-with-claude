import type { Metadata } from "next";
import { AlbumTable } from "@/components/media/album-table";
import { Breadcrumbs } from "@/components/media/breadcrumbs";
import { EmptyState } from "@/components/media/empty-state";
import { InvalidParamsNotice } from "@/components/media/invalid-params-notice";
import { Pagination } from "@/components/media/pagination";
import { ALBUMS_LIST } from "@/lib/albums-list-url";
import { DEFAULT_PAGE_SIZE } from "@/lib/list-url";
import { toURLSearchParams } from "@/lib/list-params";
import { getPagedAlbums, parseAlbumsParams } from "@/lib/paged-albums";
import { routes } from "@/lib/routes";

export const metadata: Metadata = { title: "All albums · Media" };

export default async function AllAlbumsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const parsed = parseAlbumsParams(toURLSearchParams(await searchParams));
  const hasInvalidParams = "errors" in parsed;
  const query = hasInvalidParams
    ? {
        limit: DEFAULT_PAGE_SIZE,
        offset: 0,
        sortBy: "title" as const,
        sortOrder: "asc" as const,
      }
    : parsed.query;

  const { albums, pagination, sort } = getPagedAlbums(query);

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs
        items={[
          { label: "Media", href: routes.media },
          { label: "Music", href: routes.music },
          { label: "Albums", href: routes.albums },
          { label: "All albums" },
        ]}
      />
      <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
        All albums
      </h1>

      {hasInvalidParams && <InvalidParamsNotice />}

      {albums.length > 0 ? (
        <AlbumTable
          rows={albums}
          sortBy={sort.sortBy}
          sortOrder={sort.sortOrder}
          limit={pagination.limit}
        />
      ) : (
        <EmptyState
          message="There are no albums on this page."
          actionLabel="Back to the first page"
          actionHref={ALBUMS_LIST.basePath}
        />
      )}

      <Pagination
        list={ALBUMS_LIST}
        pagination={pagination}
        shown={albums.length}
        sortBy={sort.sortBy}
        sortOrder={sort.sortOrder}
      />
    </div>
  );
}
