import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/media/breadcrumbs";
import { Section } from "@/components/media/section";
import { CastList } from "@/components/film/cast-list";
import { MovieFacts } from "@/components/film/movie-facts";
import { actorsForMovies, findMovie } from "@/lib/film-queries";
import { routes } from "@/lib/routes";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const movie = findMovie((await params).id);
  return { title: movie ? `${movie.title} · Media` : "Movie not found" };
}

export default async function MoviePage({ params }: Props) {
  const { id } = await params;
  const movie = findMovie(id);
  if (!movie) notFound();

  const actors = actorsForMovies([movie]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <Breadcrumbs
          items={[
            { label: "Media", href: routes.media },
            { label: "Film", href: routes.film },
            { label: "Movies", href: routes.movies },
            { label: movie.title },
          ]}
        />
        <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
          {movie.title}
          <span className="ml-2 font-normal text-zinc-500">
            ({movie.releaseDate.slice(0, 4)})
          </span>
        </h1>
        {movie.synopsis && (
          <p className="max-w-2xl text-zinc-600 dark:text-zinc-400">
            {movie.synopsis}
          </p>
        )}
      </div>

      <MovieFacts movie={movie} />

      <Section title="Cast">
        <CastList cast={movie.cast} actors={actors} />
      </Section>
    </div>
  );
}
