import Link from "next/link";

interface EmptyStateProps {
  message: string;
  actionLabel?: string;
  actionHref?: string;
}

export function EmptyState({ message, actionLabel, actionHref }: EmptyStateProps) {
  return (
    <div className="rounded-xl border border-dashed border-black/[.15] bg-white px-6 py-12 text-center dark:border-white/[.2] dark:bg-black">
      <p className="text-zinc-600 dark:text-zinc-400">{message}</p>
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="mt-4 inline-block rounded-full border border-black/[.15] px-4 py-2 text-sm font-medium hover:bg-black/[.04] dark:border-white/[.2] dark:hover:bg-white/[.08]"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
