import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/media/breadcrumbs";
import { SectionLinks } from "@/components/media/section-links";
import { routes } from "@/lib/routes";

export const metadata: Metadata = { title: "Film · Media" };

export default function FilmLandingPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <Breadcrumbs
          items={[{ label: "Media", href: routes.media }, { label: "Film" }]}
        />
        <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
          Film
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Movies and the actors in them.
        </p>
      </div>

      <SectionLinks
        sections={[
          {
            title: "Movies",
            description: "Browse and discover movies.",
            href: routes.movies,
            enabled: true,
          },
          {
            title: "Actors",
            description: "Find actors and their films.",
            href: routes.actors,
            enabled: true,
          },
        ]}
      />
    </div>
  );
}
