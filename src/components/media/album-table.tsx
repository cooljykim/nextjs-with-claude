import Link from "next/link";
import { PlainHeader, SortableHeader } from "@/components/media/sortable-header";
import { ALBUMS_LIST } from "@/lib/albums-list-url";
import type { AlbumRow } from "@/lib/paged-albums";
import type { SortOrder } from "@/types/list";
import { albumHref, artistHref } from "@/lib/routes";

interface AlbumTableProps {
  rows: AlbumRow[];
  sortBy: string;
  sortOrder: SortOrder;
  limit: number;
}

export function AlbumTable({ rows, sortBy, sortOrder, limit }: AlbumTableProps) {
  const header = { list: ALBUMS_LIST, sortBy, sortOrder, limit };

  return (
    <div className="overflow-x-auto rounded-xl border border-black/[.08] bg-white dark:border-white/[.145] dark:bg-black">
      <table className="w-full text-sm">
        <thead className="border-b border-black/[.08] text-zinc-600 dark:border-white/[.145] dark:text-zinc-400">
          <tr>
            <SortableHeader label="Title" field="title" {...header} />
            <SortableHeader label="Artist" field="artist" {...header} />
            <SortableHeader label="Released" field="releaseDate" {...header} />
            <PlainHeader label="Songs" align="right" />
          </tr>
        </thead>
        <tbody className="divide-y divide-black/[.06] dark:divide-white/[.1]">
          {rows.map(({ album, artist, songCount }) => (
            <tr key={album.id}>
              <td className="px-4 py-3 font-medium">
                <Link
                  href={albumHref(album.id)}
                  className="text-black hover:underline dark:text-zinc-50"
                >
                  {album.title}
                </Link>
              </td>
              <td className="px-4 py-3">
                {artist ? (
                  <Link
                    href={artistHref(artist.id)}
                    className="hover:underline"
                  >
                    {artist.name}
                  </Link>
                ) : (
                  "—"
                )}
              </td>
              <td className="px-4 py-3">{album.releaseDate ?? "—"}</td>
              <td className="px-4 py-3 text-right tabular-nums">{songCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
