import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AlbumCard } from "@/components/media/album-card";
import { ComingSoon } from "@/components/media/coming-soon";
import { SectionSkeleton, Section } from "@/components/media/section";
import { albumsListHref } from "@/lib/albums-list-url";
import { getPagedAlbums } from "@/lib/paged-albums";

export const metadata: Metadata = { title: "Albums · Media" };

const GRID = "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6";

// Newest first, by release date.
const newAlbumsHref = albumsListHref({
  sortBy: "releaseDate",
  sortOrder: "desc",
});

async function NewAlbums() {
  const { albums } = getPagedAlbums({
    limit: 6,
    offset: 0,
    sortBy: "releaseDate",
    sortOrder: "desc",
  });

  return (
    <Section title="New albums" seeAllHref={newAlbumsHref}>
      <div className={GRID}>
        {albums.map(({ album, artist }) => (
          <AlbumCard key={album.id} album={album} artistName={artist?.name} />
        ))}
      </div>
    </Section>
  );
}

export default function AlbumsLandingPage() {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
          Albums
        </h1>
        <Link
          href={albumsListHref()}
          className="inline-flex h-11 items-center justify-center rounded-full bg-foreground px-5 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
        >
          Browse all albums
        </Link>
      </div>

      <Suspense fallback={<SectionSkeleton title="New albums" />}>
        <NewAlbums />
      </Suspense>
      <ComingSoon title="Your favorite albums" />
      <ComingSoon title="Recommended for you" />
    </div>
  );
}
