import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ComingSoon } from "@/components/media/coming-soon";
import { RecentSongsWidget } from "@/components/media/recent-songs-widget";
import { SongCard } from "@/components/media/song-card";
import { SectionSkeleton, Section } from "@/components/media/section";
import { getPagedSongs } from "@/lib/paged-songs";
import { songsListHref } from "@/lib/songs-list-url";

export const metadata: Metadata = { title: "Songs · Media" };

const NEW_SONGS_COUNT = 6;

const GRID = "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6";

// "New" means the most recently released album. Songs have no date of their own.
const newSongsHref = songsListHref({
  sortBy: "releaseDate",
  sortOrder: "desc",
});

async function NewSongs() {
  const { songs, artists, albums } = getPagedSongs(
    {
      limit: NEW_SONGS_COUNT,
      offset: 0,
      sortBy: "releaseDate",
      sortOrder: "desc",
    },
    new Set(["artist", "album"]),
  );

  return (
    <Section title="New songs" seeAllHref={newSongsHref}>
      <div className={GRID}>
        {songs.map((song) => (
          <SongCard
            key={song.id}
            song={song}
            artistName={artists?.[song.artistId]?.name}
            albumTitle={song.albumId ? albums?.[song.albumId]?.title : undefined}
          />
        ))}
      </div>
    </Section>
  );
}

export default function SongsLandingPage() {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
          Songs
        </h1>
        <Link
          href={songsListHref()}
          className="inline-flex h-11 items-center justify-center rounded-full bg-foreground px-5 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
        >
          Browse all songs
        </Link>
      </div>

      <Suspense fallback={<SectionSkeleton title="New songs" />}>
        <NewSongs />
      </Suspense>
      <RecentSongsWidget />
      <ComingSoon title="Your favorites" />
      <ComingSoon title="Recommended for you" />
    </div>
  );
}
