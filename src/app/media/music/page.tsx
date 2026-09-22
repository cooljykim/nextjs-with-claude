import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/media/breadcrumbs";
import { SectionLinks } from "@/components/media/section-links";
import { routes } from "@/lib/routes";

export const metadata: Metadata = { title: "Music · Media" };

export default function MusicLandingPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <Breadcrumbs
          items={[{ label: "Media", href: routes.media }, { label: "Music" }]}
        />
        <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
          Music
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Songs, the artists who make them, and the albums they come from.
        </p>
      </div>

      <SectionLinks
        sections={[
          {
            title: "Songs",
            description: "Browse and discover songs.",
            href: routes.songs,
            enabled: true,
          },
          {
            title: "Artists",
            description: "Find artists and see their work.",
            href: routes.artists,
            enabled: true,
          },
          {
            title: "Albums",
            description: "Explore albums and their tracks.",
            href: routes.albums,
            enabled: true,
          },
        ]}
      />
    </div>
  );
}
