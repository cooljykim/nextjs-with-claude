import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AlbumCard } from "@/components/media/album-card";
import { Breadcrumbs } from "@/components/media/breadcrumbs";
import { SongList } from "@/components/media/song-list";
import { Section } from "@/components/media/section";
import { routes } from "@/lib/routes";
import {
  findArtist,
  getAlbumsByArtist,
  getSongsByArtist,
} from "@/lib/catalog-queries";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const artist = findArtist((await params).id);
  return { title: artist ? `${artist.name} · Media` : "Artist not found" };
}

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

export default async function ArtistPage({ params }: Props) {
  const { id } = await params;
  const artist = findArtist(id);
  if (!artist) notFound();

  const albums = getAlbumsByArtist(artist.id);
  const songs = getSongsByArtist(artist.id);
  const albumsById = Object.fromEntries(albums.map((a) => [a.id, a]));

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <Breadcrumbs
          items={[
            { label: "Media", href: routes.media },
            { label: "Music", href: routes.music },
            { label: "Artists", href: routes.artists },
            { label: artist.name },
          ]}
        />
        <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
          {artist.name}
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          {plural(albums.length, "album")} · {plural(songs.length, "song")}
        </p>
      </div>

      {albums.length > 0 && (
        <Section title="Albums">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {albums.map((album) => (
              <AlbumCard key={album.id} album={album} artistName={artist.name} />
            ))}
          </div>
        </Section>
      )}

      <Section title="Songs">
        <SongList songs={songs} albums={albumsById} />
      </Section>
    </div>
  );
}
