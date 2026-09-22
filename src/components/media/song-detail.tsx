import Link from "next/link";
import { formatDuration } from "@/lib/format";
import type { Album, Artist, Song } from "@/types/music";
import { albumHref, artistHref } from "@/lib/routes";

interface SongDetailProps {
  song: Song;
  artist?: Artist;
  album?: Album;
}

const MISSING = "—";

/** Everything we know about one song. */
export function SongDetail({ song, artist, album }: SongDetailProps) {
  const facts: { label: string; value: React.ReactNode }[] = [
    {
      label: "Artist",
      value: artist ? (
        <Link
          href={artistHref(artist.id)}
          className="hover:underline"
        >
          {artist.name}
        </Link>
      ) : (
        MISSING
      ),
    },
    {
      label: "Album",
      value: album ? (
        <Link href={albumHref(album.id)} className="hover:underline">
          {album.title}
        </Link>
      ) : (
        "Single"
      ),
    },
    { label: "Track", value: song.trackNumber ?? MISSING },
    { label: "Released", value: album?.releaseDate ?? MISSING },
    { label: "Genre", value: song.genre ?? MISSING },
    { label: "Duration", value: formatDuration(song.durationSec) },
  ];

  return (
    <dl className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-black/[.08] bg-black/[.08] sm:grid-cols-2 dark:border-white/[.145] dark:bg-white/[.145]">
      {facts.map(({ label, value }) => (
        <div key={label} className="bg-white px-5 py-4 dark:bg-black">
          <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            {label}
          </dt>
          <dd className="mt-1 text-base text-black dark:text-zinc-50">
            {value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
