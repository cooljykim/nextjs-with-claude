import Link from "next/link";
import { formatDuration } from "@/lib/format";
import type { Album, Song } from "@/types/music";
import { albumHref, songHref } from "@/lib/routes";

interface SongListProps {
  songs: Song[];
  /** When given, an Album column links each song to its album. */
  albums?: Record<string, Album>;
  /** Show the track number column (for a single album's tracks). */
  showTrackNumber?: boolean;
}

/** A simple, unpaginated list of songs for detail pages. */
export function SongList({ songs, albums, showTrackNumber }: SongListProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-black/[.08] bg-white dark:border-white/[.145] dark:bg-black">
      <table className="w-full text-sm">
        <thead className="border-b border-black/[.08] text-zinc-600 dark:border-white/[.145] dark:text-zinc-400">
          <tr>
            {showTrackNumber && (
              <th scope="col" className="w-12 px-4 py-3 text-left font-medium">
                #
              </th>
            )}
            <th scope="col" className="px-4 py-3 text-left font-medium">
              Title
            </th>
            {albums && (
              <th scope="col" className="px-4 py-3 text-left font-medium">
                Album
              </th>
            )}
            <th scope="col" className="px-4 py-3 text-right font-medium">
              Duration
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-black/[.06] dark:divide-white/[.1]">
          {songs.map((song) => {
            const album = song.albumId ? albums?.[song.albumId] : undefined;
            return (
              <tr key={song.id}>
                {showTrackNumber && (
                  <td className="px-4 py-3 tabular-nums text-zinc-500">
                    {song.trackNumber ?? "—"}
                  </td>
                )}
                <td className="px-4 py-3 font-medium">
                  <Link
                    href={songHref(song.id)}
                    className="text-black hover:underline dark:text-zinc-50"
                  >
                    {song.title}
                  </Link>
                </td>
                {albums && (
                  <td className="px-4 py-3">
                    {album ? (
                      <Link
                        href={albumHref(album.id)}
                        className="hover:underline"
                      >
                        {album.title}
                      </Link>
                    ) : (
                      "Single"
                    )}
                  </td>
                )}
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
