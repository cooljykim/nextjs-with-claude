import Link from "next/link";
import { PlainHeader, SortableHeader } from "@/components/media/sortable-header";
import { ARTISTS_LIST } from "@/lib/artists-list-url";
import type { ArtistRow } from "@/lib/paged-artists";
import type { SortOrder } from "@/types/list";
import { artistHref } from "@/lib/routes";

interface ArtistTableProps {
  rows: ArtistRow[];
  sortBy: string;
  sortOrder: SortOrder;
  limit: number;
}

export function ArtistTable({ rows, sortBy, sortOrder, limit }: ArtistTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-black/[.08] bg-white dark:border-white/[.145] dark:bg-black">
      <table className="w-full text-sm">
        <thead className="border-b border-black/[.08] text-zinc-600 dark:border-white/[.145] dark:text-zinc-400">
          <tr>
            <SortableHeader
              list={ARTISTS_LIST}
              label="Name"
              field="name"
              sortBy={sortBy}
              sortOrder={sortOrder}
              limit={limit}
            />
            <PlainHeader label="Albums" align="right" />
            <PlainHeader label="Songs" align="right" />
          </tr>
        </thead>
        <tbody className="divide-y divide-black/[.06] dark:divide-white/[.1]">
          {rows.map(({ artist, albumCount, songCount }) => (
            <tr key={artist.id}>
              <td className="px-4 py-3 font-medium">
                <Link
                  href={artistHref(artist.id)}
                  className="text-black hover:underline dark:text-zinc-50"
                >
                  {artist.name}
                </Link>
              </td>
              <td className="px-4 py-3 text-right tabular-nums">{albumCount}</td>
              <td className="px-4 py-3 text-right tabular-nums">{songCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
