import { formatRuntime } from "@/lib/format";
import type { Movie } from "@/types/film";

const MISSING = "—";

/** The key facts about one movie. */
export function MovieFacts({ movie }: { movie: Movie }) {
  const facts: { label: string; value: string }[] = [
    { label: "Released", value: movie.releaseDate },
    { label: "Runtime", value: formatRuntime(movie.runtimeMin) },
    { label: "Genres", value: movie.genres.join(", ") || MISSING },
    { label: "Rating", value: movie.contentRating ?? MISSING },
    { label: "Director", value: movie.director ?? MISSING },
  ];

  return (
    <dl className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-black/[.08] bg-black/[.08] sm:grid-cols-2 dark:border-white/[.145] dark:bg-white/[.145]">
      {facts.map(({ label, value }) => (
        <div key={label} className="bg-white px-5 py-4 dark:bg-black">
          <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            {label}
          </dt>
          <dd className="mt-1 text-base text-black dark:text-zinc-50">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
