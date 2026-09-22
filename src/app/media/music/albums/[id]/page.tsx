import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/media/breadcrumbs";
import { SongList } from "@/components/media/song-list";
import { Section } from "@/components/media/section";
import { findAlbum, findArtist, getSongsByAlbum } from "@/lib/catalog-queries";
import { formatDuration } from "@/lib/format";
import { artistHref, routes } from "@/lib/routes";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const album = findAlbum((await params).id);
  return { title: album ? `${album.title} · Media` : "Album not found" };
}

export default async function AlbumPage({ params }: Props) {
  const { id } = await params;
  const album = findAlbum(id);
  if (!album) notFound();

  const artist = findArtist(album.artistId);
  const songs = getSongsByAlbum(album.id);
  const totalSeconds = songs.reduce((sum, s) => sum + s.durationSec, 0);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <Breadcrumbs
          items={[
            { label: "Media", href: routes.media },
            { label: "Music", href: routes.music },
            { label: "Albums", href: routes.albums },
            { label: album.title },
          ]}
        />
        <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
          {album.title}
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          {artist && (
            <>
              by{" "}
              <Link
                href={artistHref(artist.id)}
                className="font-medium text-black hover:underline dark:text-zinc-50"
              >
                {artist.name}
              </Link>{" "}
              ·{" "}
            </>
          )}
          {album.releaseDate ? `${album.releaseDate} · ` : ""}
          {songs.length} {songs.length === 1 ? "song" : "songs"} ·{" "}
          {formatDuration(totalSeconds)}
        </p>
      </div>

      <Section title="Tracks">
        <SongList songs={songs} showTrackNumber />
      </Section>
    </div>
  );
}
