import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ComingSoon } from "@/components/media/coming-soon";
import { SearchBox } from "@/components/media/search-box";
import { SectionSkeleton, Section } from "@/components/media/section";
import { MovieCard } from "@/components/film/movie-card";
import { getPagedMovies } from "@/lib/paged-movies";
import { MOVIES_LIST, moviesListHref } from "@/lib/movies-list-url";

export const metadata: Metadata = { title: "Movies · Media" };

const GRID = "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6";

// Newest first, by release date.
const newReleasesHref = moviesListHref({
  sortBy: "releaseDate",
  sortOrder: "desc",
});

async function NewReleases() {
  const { movies } = getPagedMovies(
    { limit: 6, offset: 0, sortBy: "releaseDate", sortOrder: "desc" },
    new Set(),
  );

  return (
    <Section title="New releases" seeAllHref={newReleasesHref}>
      <div className={GRID}>
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </Section>
  );
}

export default function MoviesLandingPage() {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
          Movies
        </h1>
        <Link
          href={moviesListHref()}
          className="inline-flex h-11 items-center justify-center rounded-full bg-foreground px-5 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
        >
          Browse all movies
        </Link>
      </div>

      <SearchBox
        action={MOVIES_LIST.basePath}
        label="Search movies"
        placeholder="Search by title, director, genre or actor"
      />

      <Suspense fallback={<SectionSkeleton title="New releases" />}>
        <NewReleases />
      </Suspense>
      <ComingSoon title="Your favorites" />
      <ComingSoon title="Recommended for you" />
    </div>
  );
}
