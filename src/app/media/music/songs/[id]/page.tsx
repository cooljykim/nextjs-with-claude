import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/media/breadcrumbs";
import { SongDetail } from "@/components/media/song-detail";
import { findAlbum, findArtist, findSong } from "@/lib/catalog-queries";
import { artistHref, routes } from "@/lib/routes";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const song = findSong((await params).id);
  return { title: song ? `${song.title} · Media` : "Song not found" };
}

export default async function SongPage({ params }: Props) {
  const { id } = await params;
  const song = findSong(id);
  if (!song) notFound();

  const artist = findArtist(song.artistId);
  const album = song.albumId ? findAlbum(song.albumId) : undefined;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <Breadcrumbs
          items={[
            { label: "Media", href: routes.media },
            { label: "Music", href: routes.music },
            { label: "Songs", href: routes.songs },
            { label: song.title },
          ]}
        />
        <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
          {song.title}
        </h1>
        {artist && (
          <p className="text-zinc-600 dark:text-zinc-400">
            by{" "}
            <Link
              href={artistHref(artist.id)}
              className="font-medium text-black hover:underline dark:text-zinc-50"
            >
              {artist.name}
            </Link>
          </p>
        )}
      </div>

      <SongDetail song={song} artist={artist} album={album} />
    </div>
  );
}
