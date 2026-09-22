/** Loading placeholder for the paginated list pages. */
export function ListSkeleton({ rows = 10 }: { rows?: number }) {
  return (
    <div className="flex animate-pulse flex-col gap-6" aria-busy="true">
      <div className="h-4 w-48 rounded bg-black/[.08] dark:bg-white/[.12]" />
      <div className="h-8 w-40 rounded bg-black/[.08] dark:bg-white/[.12]" />
      <div className="overflow-hidden rounded-xl border border-black/[.08] bg-white dark:border-white/[.145] dark:bg-black">
        {Array.from({ length: rows }, (_, i) => (
          <div
            key={i}
            className="h-11 border-b border-black/[.06] last:border-b-0 dark:border-white/[.1]"
          />
        ))}
      </div>
    </div>
  );
}
