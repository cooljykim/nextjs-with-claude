import type { SortOrder } from "@/types/list";

/**
 * Sorts by a key, case-insensitively for text. Items with no value for the key
 * go last in both directions. Ties are broken by id (ascending), so the order
 * is fully deterministic.
 */
export function sortItems<T>(
  items: T[],
  getKey: (item: T) => string | number | undefined,
  getId: (item: T) => string,
  order: SortOrder,
): T[] {
  const direction = order === "desc" ? -1 : 1;
  const keys = new Map(
    items.map((item) => {
      const key = getKey(item);
      return [getId(item), typeof key === "string" ? key.toLowerCase() : key] as const;
    }),
  );

  return [...items].sort((a, b) => {
    const x = keys.get(getId(a));
    const y = keys.get(getId(b));

    if (x === undefined && y !== undefined) return 1;
    if (x !== undefined && y === undefined) return -1;
    if (x !== undefined && y !== undefined && x !== y) {
      return (x < y ? -1 : 1) * direction;
    }

    const idA = getId(a);
    const idB = getId(b);
    return idA < idB ? -1 : idA > idB ? 1 : 0;
  });
}
