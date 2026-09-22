"use client";

import { useRouter } from "next/navigation";
import {
  listHref,
  PAGE_SIZE_OPTIONS,
  type ListConfig,
} from "@/lib/list-url";
import type { SortOrder } from "@/types/list";

interface PageSizeSelectProps {
  list: ListConfig;
  limit: number;
  sortBy: string;
  sortOrder: SortOrder;
  q?: string;
}

export function PageSizeSelect({
  list,
  limit,
  sortBy,
  sortOrder,
  q,
}: PageSizeSelectProps) {
  const router = useRouter();
  // Keep a custom size from the URL (e.g. ?limit=25) selectable.
  const options = PAGE_SIZE_OPTIONS.includes(limit)
    ? PAGE_SIZE_OPTIONS
    : [...PAGE_SIZE_OPTIONS, limit].sort((a, b) => a - b);

  return (
    <label className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
      Per page
      <select
        value={limit}
        onChange={(e) =>
          // A new page size restarts from the first page.
          router.push(
            listHref(list, {
              limit: Number(e.target.value),
              sortBy,
              sortOrder,
              q,
            }),
          )
        }
        className="rounded-md border border-black/[.15] bg-white px-2 py-1 text-black dark:border-white/[.2] dark:bg-black dark:text-zinc-50"
      >
        {options.map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>
    </label>
  );
}
