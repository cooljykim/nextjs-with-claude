import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArtistCard } from "@/components/media/artist-card";
import { ComingSoon } from "@/components/media/coming-soon";
import { SectionSkeleton, Section } from "@/components/media/section";
import { artistsListHref } from "@/lib/artists-list-url";
import { getPagedArtists } from "@/lib/paged-artists";

export const metadata: Metadata = { title: "Artists · Media" };

const GRID = "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6";

// Placeholder for a curated list: for now, the first few artists by name.
async function DiscoverArtists() {
  const { artists } = getPagedArtists({
    limit: 6,
    offset: 0,
    sortBy: "name",
    sortOrder: "asc",
  });

  return (
    <Section title="Discover artists" seeAllHref={artistsListHref()}>
      <div className={GRID}>
        {artists.map(({ artist, albumCount, songCount }) => (
          <ArtistCard
            key={artist.id}
            artist={artist}
            albumCount={albumCount}
            songCount={songCount}
          />
        ))}
      </div>
    </Section>
  );
}

export default function ArtistsLandingPage() {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
          Artists
        </h1>
        <Link
          href={artistsListHref()}
          className="inline-flex h-11 items-center justify-center rounded-full bg-foreground px-5 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
        >
          Browse all artists
        </Link>
      </div>

      <Suspense fallback={<SectionSkeleton title="Discover artists" />}>
        <DiscoverArtists />
      </Suspense>
      <ComingSoon title="Your favorite artists" />
      <ComingSoon title="Recommended for you" />
    </div>
  );
}
