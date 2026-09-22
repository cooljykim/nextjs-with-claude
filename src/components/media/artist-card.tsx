import Link from "next/link";
import type { Artist } from "@/types/music";
import { artistHref } from "@/lib/routes";

interface ArtistCardProps {
  artist: Artist;
  albumCount: number;
  songCount: number;
}

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

export function ArtistCard({ artist, albumCount, songCount }: ArtistCardProps) {
  return (
    <Link
      href={artistHref(artist.id)}
      className="flex h-28 flex-col justify-between rounded-xl border border-black/[.08] bg-white p-4 transition-colors hover:bg-black/[.02] dark:border-white/[.145] dark:bg-black dark:hover:bg-white/[.06]"
    >
      <h3 className="truncate text-sm font-medium text-black dark:text-zinc-50">
        {artist.name}
      </h3>
      <p className="text-xs text-zinc-500">
        {plural(albumCount, "album")} · {plural(songCount, "song")}
      </p>
    </Link>
  );
}
