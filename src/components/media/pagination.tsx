import Link from "next/link";
import { PageSizeSelect } from "@/components/media/page-size-select";
import { listHref, type ListConfig } from "@/lib/list-url";
import type { Pagination as PaginationInfo, SortOrder } from "@/types/list";

interface PaginationProps {
  list: ListConfig;
  pagination: PaginationInfo;
  shown: number; // number of items on the current page
  sortBy: string;
  sortOrder: SortOrder;
  q?: string; // keep the current search while paging
}

const buttonClass =
  "rounded-full border border-black/[.15] px-4 py-2 text-sm font-medium transition-colors dark:border-white/[.2]";

export function Pagination({
  list,
  pagination,
  shown,
  sortBy,
  sortOrder,
  q,
}: PaginationProps) {
  const { total, limit, offset, nextOffset, prevOffset } = pagination;
  const page = Math.floor(offset / limit) + 1;
  const pages = Math.max(1, Math.ceil(total / limit));
  const summary =
    shown > 0
      ? `${offset + 1}–${offset + shown} of ${total}`
      : `0 of ${total}`;

  const href = (o: number) =>
    listHref(list, { limit, offset: o, sortBy, sortOrder, q });

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        {summary} · Page {page} of {pages}
      </p>
      <div className="flex items-center gap-4">
        <PageSizeSelect
          list={list}
          limit={limit}
          sortBy={sortBy}
          sortOrder={sortOrder}
          q={q}
        />
        <div className="flex gap-2">
          {prevOffset !== null ? (
            <Link
              href={href(prevOffset)}
              className={`${buttonClass} hover:bg-black/[.04] dark:hover:bg-white/[.08]`}
            >
              Previous
            </Link>
          ) : (
            <span
              aria-disabled="true"
              className={`${buttonClass} cursor-not-allowed text-zinc-400 dark:text-zinc-600`}
            >
              Previous
            </span>
          )}
          {nextOffset !== null ? (
            <Link
              href={href(nextOffset)}
              className={`${buttonClass} hover:bg-black/[.04] dark:hover:bg-white/[.08]`}
            >
              Next
            </Link>
          ) : (
            <span
              aria-disabled="true"
              className={`${buttonClass} cursor-not-allowed text-zinc-400 dark:text-zinc-600`}
            >
              Next
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
