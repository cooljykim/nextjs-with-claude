import Link from "next/link";
import { PlainHeader, SortableHeader } from "@/components/media/sortable-header";
import { formatRuntime } from "@/lib/format";
import { MOVIES_LIST } from "@/lib/movies-list-url";
import { movieHref } from "@/lib/routes";
import type { Movie } from "@/types/film";
import type { SortOrder } from "@/types/list";

interface MovieTableProps {
  movies: Movie[];
  sortBy: string;
  sortOrder: SortOrder;
  limit: number;
  q?: string;
}

const MISSING = "—";

export function MovieTable({ movies, sortBy, sortOrder, limit, q }: MovieTableProps) {
  const header = { list: MOVIES_LIST, sortBy, sortOrder, limit, q };

  return (
    <div className="overflow-x-auto rounded-xl border border-black/[.08] bg-white dark:border-white/[.145] dark:bg-black">
      <table className="w-full text-sm">
        <thead className="border-b border-black/[.08] text-zinc-600 dark:border-white/[.145] dark:text-zinc-400">
          <tr>
            <SortableHeader label="Title" field="title" {...header} />
            <SortableHeader label="Released" field="releaseDate" {...header} />
            <SortableHeader label="Runtime" field="runtime" {...header} />
            <PlainHeader label="Genres" />
            <PlainHeader label="Rating" />
            <PlainHeader label="Director" />
          </tr>
        </thead>
        <tbody className="divide-y divide-black/[.06] dark:divide-white/[.1]">
          {movies.map((movie) => (
            <tr key={movie.id}>
              <td className="px-4 py-3 font-medium">
                <Link
                  href={movieHref(movie.id)}
                  className="text-black hover:underline dark:text-zinc-50"
                >
                  {movie.title}
                </Link>
              </td>
              <td className="px-4 py-3">{movie.releaseDate}</td>
              <td className="px-4 py-3 tabular-nums">
                {formatRuntime(movie.runtimeMin)}
              </td>
              <td className="px-4 py-3">{movie.genres.join(", ")}</td>
              <td className="px-4 py-3">{movie.contentRating ?? MISSING}</td>
              <td className="px-4 py-3">{movie.director ?? MISSING}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
