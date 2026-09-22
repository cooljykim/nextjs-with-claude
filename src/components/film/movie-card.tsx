import Link from "next/link";
import { formatRuntime } from "@/lib/format";
import { movieHref } from "@/lib/routes";
import type { Movie } from "@/types/film";

export function MovieCard({ movie }: { movie: Movie }) {
  return (
    <Link
      href={movieHref(movie.id)}
      className="flex h-28 flex-col justify-between rounded-xl border border-black/[.08] bg-white p-4 transition-colors hover:bg-black/[.02] dark:border-white/[.145] dark:bg-black dark:hover:bg-white/[.06]"
    >
      <div className="min-w-0">
        <h3 className="truncate text-sm font-medium text-black dark:text-zinc-50">
          {movie.title}
        </h3>
        <p className="truncate text-sm text-zinc-600 dark:text-zinc-400">
          {movie.genres.join(", ")}
        </p>
      </div>
      <p className="flex justify-between gap-2 text-xs text-zinc-500">
        <span>{movie.releaseDate.slice(0, 4)}</span>
        <span className="tabular-nums">{formatRuntime(movie.runtimeMin)}</span>
      </p>
    </Link>
  );
}
