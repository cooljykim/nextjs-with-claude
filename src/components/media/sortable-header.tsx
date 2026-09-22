import Link from "next/link";
import { listHref, type ListConfig } from "@/lib/list-url";
import type { SortOrder } from "@/types/list";

interface SortableHeaderProps {
  list: ListConfig;
  label: string;
  field: string;
  sortBy: string;
  sortOrder: SortOrder;
  limit: number;
  q?: string; // keep the current search when re-sorting
  align?: "left" | "right";
}

/** A column header that links to the same list sorted by this column. */
export function SortableHeader({
  list,
  label,
  field,
  sortBy,
  sortOrder,
  limit,
  q,
  align = "left",
}: SortableHeaderProps) {
  const active = sortBy === field;
  // Clicking the active column flips the order; a new column starts ascending.
  // Either way, go back to the first page, since positions no longer match.
  const nextOrder: SortOrder = active && sortOrder === "asc" ? "desc" : "asc";

  return (
    <th
      scope="col"
      aria-sort={
        active ? (sortOrder === "asc" ? "ascending" : "descending") : "none"
      }
      className={`px-4 py-3 font-medium ${align === "right" ? "text-right" : "text-left"}`}
    >
      <Link
        href={listHref(list, { limit, sortBy: field, sortOrder: nextOrder, q })}
        className={`inline-flex items-center gap-1 hover:text-black dark:hover:text-zinc-50 ${
          active ? "text-black dark:text-zinc-50" : ""
        }`}
      >
        {label}
        <span aria-hidden="true" className="w-3 text-xs">
          {active ? (sortOrder === "asc" ? "▲" : "▼") : ""}
        </span>
      </Link>
    </th>
  );
}

/** A column header that isn't sortable. */
export function PlainHeader({
  label,
  align = "left",
}: {
  label: string;
  align?: "left" | "right";
}) {
  return (
    <th
      scope="col"
      className={`px-4 py-3 font-medium ${align === "right" ? "text-right" : "text-left"}`}
    >
      {label}
    </th>
  );
}
