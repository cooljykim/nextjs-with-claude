import Link from "next/link";
import { PlainHeader, SortableHeader } from "@/components/media/sortable-header";
import { ACTORS_LIST } from "@/lib/actors-list-url";
import { actorHref } from "@/lib/routes";
import type { Actor } from "@/types/film";
import type { SortOrder } from "@/types/list";

export interface ActorRow {
  actor: Actor;
  movieCount: number;
}

interface ActorTableProps {
  rows: ActorRow[];
  sortBy: string;
  sortOrder: SortOrder;
  limit: number;
  q?: string;
}

export function ActorTable({ rows, sortBy, sortOrder, limit, q }: ActorTableProps) {
  const header = { list: ACTORS_LIST, sortBy, sortOrder, limit, q };

  return (
    <div className="overflow-x-auto rounded-xl border border-black/[.08] bg-white dark:border-white/[.145] dark:bg-black">
      <table className="w-full text-sm">
        <thead className="border-b border-black/[.08] text-zinc-600 dark:border-white/[.145] dark:text-zinc-400">
          <tr>
            <SortableHeader label="Name" field="name" {...header} />
            <SortableHeader label="Born" field="birthDate" {...header} />
            <PlainHeader label="Movies" align="right" />
          </tr>
        </thead>
        <tbody className="divide-y divide-black/[.06] dark:divide-white/[.1]">
          {rows.map(({ actor, movieCount }) => (
            <tr key={actor.id}>
              <td className="px-4 py-3 font-medium">
                <Link
                  href={actorHref(actor.id)}
                  className="text-black hover:underline dark:text-zinc-50"
                >
                  {actor.name}
                </Link>
              </td>
              <td className="px-4 py-3">{actor.birthDate ?? "—"}</td>
              <td className="px-4 py-3 text-right tabular-nums">{movieCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
