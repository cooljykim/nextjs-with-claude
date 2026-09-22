import Link from "next/link";
import { actorHref } from "@/lib/routes";
import type { Actor } from "@/types/film";

interface ActorCardProps {
  actor: Actor;
  movieCount: number;
}

export function ActorCard({ actor, movieCount }: ActorCardProps) {
  return (
    <Link
      href={actorHref(actor.id)}
      className="flex h-28 flex-col justify-between rounded-xl border border-black/[.08] bg-white p-4 transition-colors hover:bg-black/[.02] dark:border-white/[.145] dark:bg-black dark:hover:bg-white/[.06]"
    >
      <h3 className="truncate text-sm font-medium text-black dark:text-zinc-50">
        {actor.name}
      </h3>
      <p className="text-xs text-zinc-500">
        {movieCount} {movieCount === 1 ? "movie" : "movies"}
      </p>
    </Link>
  );
}
