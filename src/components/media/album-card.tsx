import Link from "next/link";
import type { Album } from "@/types/music";
import { albumHref } from "@/lib/routes";

interface AlbumCardProps {
  album: Album;
  artistName?: string;
}

export function AlbumCard({ album, artistName }: AlbumCardProps) {
  return (
    <Link
      href={albumHref(album.id)}
      className="flex h-28 flex-col justify-between rounded-xl border border-black/[.08] bg-white p-4 transition-colors hover:bg-black/[.02] dark:border-white/[.145] dark:bg-black dark:hover:bg-white/[.06]"
    >
      <div className="min-w-0">
        <h3 className="truncate text-sm font-medium text-black dark:text-zinc-50">
          {album.title}
        </h3>
        <p className="truncate text-sm text-zinc-600 dark:text-zinc-400">
          {artistName ?? "Unknown artist"}
        </p>
      </div>
      <p className="text-xs text-zinc-500">{album.releaseDate ?? "—"}</p>
    </Link>
  );
}
