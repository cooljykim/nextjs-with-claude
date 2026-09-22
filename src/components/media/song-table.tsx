import Link from "next/link";
import { SortableHeader } from "@/components/media/sortable-header";
import { formatDuration } from "@/lib/format";
import { SONGS_LIST } from "@/lib/songs-list-url";
import type { Album, Artist, Song } from "@/types/music";
import type { SongSortBy } from "@/types/paged-songs";
import type { SortOrder } from "@/types/list";
import { albumHref, artistHref, songHref } from "@/lib/routes";

interface SongTableProps {
  songs: Song[];
  artists: Record<string, Artist>;
  albums: Record<string, Album>;
  sortBy: SongSortBy;
  sortOrder: SortOrder;
  limit: number;
}

const MISSING = "—";

export function SongTable({
  songs,
  artists,
  albums,
  sortBy,
  sortOrder,
  limit,
}: SongTableProps) {
  const header = { list: SONGS_LIST, sortBy, sortOrder, limit };

  return (
    <div className="overflow-x-auto rounded-xl border border-black/[.08] bg-white dark:border-white/[.145] dark:bg-black">
      <table className="w-full text-sm">
        <thead className="border-b border-black/[.08] text-zinc-600 dark:border-white/[.145] dark:text-zinc-400">
          <tr>
            <SortableHeader label="Title" field="title" {...header} />
            <SortableHeader label="Artist" field="artist" {...header} />
            <SortableHeader label="Album" field="album" {...header} />
            <SortableHeader label="Released" field="releaseDate" {...header} />
            <SortableHeader label="Genre" field="genre" {...header} />
            <SortableHeader
              label="Duration"
              field="duration"
              align="right"
              {...header}
            />
          </tr>
        </thead>
        <tbody className="divide-y divide-black/[.06] dark:divide-white/[.1]">
          {songs.map((song) => {
            const artist = artists[song.artistId];
            const album = song.albumId ? albums[song.albumId] : undefined;
            return (
              <tr key={song.id}>
                <td className="px-4 py-3 font-medium">
                  <Link
                    href={songHref(song.id)}
                    className="text-black hover:underline dark:text-zinc-50"
                  >
                    {song.title}
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
                    MISSING
                  )}
                </td>
                <td className="px-4 py-3">
                  {album ? (
                    <Link
                      href={albumHref(album.id)}
                      className="hover:underline"
                    >
                      {album.title}
                    </Link>
                  ) : (
                    MISSING
                  )}
                </td>
                <td className="px-4 py-3">{album?.releaseDate ?? MISSING}</td>
                <td className="px-4 py-3">{song.genre ?? MISSING}</td>
                <td className="px-4 py-3 text-right tabular-nums">
                  {formatDuration(song.durationSec)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
