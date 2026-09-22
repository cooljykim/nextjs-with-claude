import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/media/breadcrumbs";
import { EmptyState } from "@/components/media/empty-state";
import { Section } from "@/components/media/section";
import { Filmography } from "@/components/film/filmography";
import { findActor, moviesForActor } from "@/lib/film-queries";
import { routes } from "@/lib/routes";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const actor = findActor((await params).id);
  return { title: actor ? `${actor.name} · Media` : "Actor not found" };
}

export default async function ActorPage({ params }: Props) {
  const { id } = await params;
  const actor = findActor(id);
  if (!actor) notFound();

  const movies = moviesForActor(actor.id);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <Breadcrumbs
          items={[
            { label: "Media", href: routes.media },
            { label: "Film", href: routes.film },
            { label: "Actors", href: routes.actors },
            { label: actor.name },
          ]}
        />
        <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
          {actor.name}
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          {actor.birthDate ? `Born ${actor.birthDate} · ` : ""}
          {movies.length} {movies.length === 1 ? "movie" : "movies"}
        </p>
      </div>

      <Section title="Filmography">
        {movies.length > 0 ? (
          <Filmography movies={movies} actorId={actor.id} />
        ) : (
          <EmptyState message="No movies yet." />
        )}
      </Section>
    </div>
  );
}
