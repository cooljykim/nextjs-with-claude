import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/media/breadcrumbs";
import { EmptyState } from "@/components/media/empty-state";
import { InvalidParamsNotice } from "@/components/media/invalid-params-notice";
import { Pagination } from "@/components/media/pagination";
import { SongTable } from "@/components/media/song-table";
import { toURLSearchParams } from "@/lib/list-params";
import { getPagedSongs, parsePagedSongsParams } from "@/lib/paged-songs";
import { SONGS_LIST, SONGS_LIST_PATH } from "@/lib/songs-list-url";
import { routes } from "@/lib/routes";
import { DEFAULT_SORT_BY } from "@/types/paged-songs";
import { DEFAULT_LIMIT, DEFAULT_SORT_ORDER } from "@/types/list";

export const metadata: Metadata = { title: "All songs · Media" };

export default async function AllSongsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = toURLSearchParams(await searchParams);

  // Invalid parameters fall back to the defaults, with a notice.
  const parsed = parsePagedSongsParams(params);
  const hasInvalidParams = "errors" in parsed;
  const query = hasInvalidParams
    ? {
        limit: DEFAULT_LIMIT,
        offset: 0,
        sortBy: DEFAULT_SORT_BY,
        sortOrder: DEFAULT_SORT_ORDER,
      }
    : parsed.query;

  const result = getPagedSongs(query, new Set(["artist", "album"]));
  const { songs, pagination, sort } = result;

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs
        items={[
          { label: "Media", href: routes.media },
          { label: "Music", href: routes.music },
          { label: "Songs", href: routes.songs },
          { label: "All songs" },
        ]}
      />
      <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
        All songs
      </h1>

      {hasInvalidParams && <InvalidParamsNotice />}

      {songs.length > 0 ? (
        <SongTable
          songs={songs}
          artists={result.artists ?? {}}
          albums={result.albums ?? {}}
          sortBy={sort.sortBy}
          sortOrder={sort.sortOrder}
          limit={pagination.limit}
        />
      ) : (
        <EmptyState
          message="There are no songs on this page."
          actionLabel="Back to the first page"
          actionHref={SONGS_LIST_PATH}
        />
      )}

      <Pagination
        list={SONGS_LIST}
        pagination={pagination}
        shown={songs.length}
        sortBy={sort.sortBy}
        sortOrder={sort.sortOrder}
      />
    </div>
  );
}
