import Link from "next/link";
import { formatDuration } from "@/lib/format";
import type { Song } from "@/types/music";
import { songHref } from "@/lib/routes";

interface SongCardProps {
  song: Song;
  artistName?: string;
  albumTitle?: string;
}

export function SongCard({ song, artistName, albumTitle }: SongCardProps) {
  return (
    <article className="flex h-28 flex-col justify-between rounded-xl border border-black/[.08] bg-white p-4 dark:border-white/[.145] dark:bg-black">
      <div className="min-w-0">
        <h3 className="truncate text-sm font-medium">
          <Link
            href={songHref(song.id)}
            className="text-black hover:underline dark:text-zinc-50"
          >
            {song.title}
          </Link>
        </h3>
        <p className="truncate text-sm text-zinc-600 dark:text-zinc-400">
          {artistName ?? "Unknown artist"}
        </p>
      </div>
      <p className="flex justify-between gap-2 text-xs text-zinc-500">
        <span className="truncate">{albumTitle ?? "Single"}</span>
        <span className="tabular-nums">{formatDuration(song.durationSec)}</span>
      </p>
    </article>
  );
}
