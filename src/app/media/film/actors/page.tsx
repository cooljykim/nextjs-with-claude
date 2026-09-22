import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ComingSoon } from "@/components/media/coming-soon";
import { SearchBox } from "@/components/media/search-box";
import { SectionSkeleton, Section } from "@/components/media/section";
import { ActorCard } from "@/components/film/actor-card";
import { ACTORS_LIST, actorsListHref } from "@/lib/actors-list-url";
import { movieCountForActor } from "@/lib/film-queries";
import { getPagedActors } from "@/lib/paged-actors";

export const metadata: Metadata = { title: "Actors · Media" };

const GRID = "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6";

// Placeholder for a curated list: for now, the first few actors by name.
async function DiscoverActors() {
  const { actors } = getPagedActors({
    limit: 6,
    offset: 0,
    sortBy: "name",
    sortOrder: "asc",
  });

  return (
    <Section title="Discover actors" seeAllHref={actorsListHref()}>
      <div className={GRID}>
        {actors.map((actor) => (
          <ActorCard
            key={actor.id}
            actor={actor}
            movieCount={movieCountForActor(actor.id)}
          />
        ))}
      </div>
    </Section>
  );
}

export default function ActorsLandingPage() {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
          Actors
        </h1>
        <Link
          href={actorsListHref()}
          className="inline-flex h-11 items-center justify-center rounded-full bg-foreground px-5 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
        >
          Browse all actors
        </Link>
      </div>

      <SearchBox
        action={ACTORS_LIST.basePath}
        label="Search actors"
        placeholder="Search actors by name"
      />

      <Suspense fallback={<SectionSkeleton title="Discover actors" />}>
        <DiscoverActors />
      </Suspense>
      <ComingSoon title="Your favorite actors" />
      <ComingSoon title="Recommended for you" />
    </div>
  );
}
