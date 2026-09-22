import Link from "next/link";
import { actorHref } from "@/lib/routes";
import type { Actor, CastCredit } from "@/types/film";

interface CastListProps {
  cast: CastCredit[];
  actors: Record<string, Actor>;
}

/** A movie's cast in billing order, each actor linking to their page. */
export function CastList({ cast, actors }: CastListProps) {
  const credits = [...cast].sort(
    (a, b) => (a.order ?? Infinity) - (b.order ?? Infinity),
  );

  return (
    <div className="overflow-x-auto rounded-xl border border-black/[.08] bg-white dark:border-white/[.145] dark:bg-black">
      <table className="w-full text-sm">
        <thead className="border-b border-black/[.08] text-zinc-600 dark:border-white/[.145] dark:text-zinc-400">
          <tr>
            <th scope="col" className="px-4 py-3 text-left font-medium">
              Actor
            </th>
            <th scope="col" className="px-4 py-3 text-left font-medium">
              Character
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-black/[.06] dark:divide-white/[.1]">
          {credits.map((credit) => {
            const actor = actors[credit.actorId];
            return (
              <tr key={credit.actorId}>
                <td className="px-4 py-3 font-medium">
                  {actor ? (
                    <Link
                      href={actorHref(actor.id)}
                      className="text-black hover:underline dark:text-zinc-50"
                    >
                      {actor.name}
                    </Link>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-4 py-3">{credit.character ?? "—"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
