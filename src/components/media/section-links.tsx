import Link from "next/link";

export interface SectionLink {
  title: string;
  description: string;
  href: string;
  enabled: boolean;
}

const CARD =
  "flex min-h-28 flex-col justify-between rounded-xl border p-4";

/** Cards that lead to the sections of a group. Unbuilt sections show as "Coming soon". */
export function SectionLinks({ sections }: { sections: SectionLink[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {sections.map((section) =>
        section.enabled ? (
          <Link
            key={section.href}
            href={section.href}
            className={`${CARD} border-black/[.08] bg-white transition-colors hover:bg-black/[.02] dark:border-white/[.145] dark:bg-black dark:hover:bg-white/[.06]`}
          >
            <h2 className="text-base font-semibold text-black dark:text-zinc-50">
              {section.title}
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {section.description}
            </p>
          </Link>
        ) : (
          <div
            key={section.href}
            aria-disabled="true"
            className={`${CARD} border-dashed border-black/[.15] bg-white dark:border-white/[.2] dark:bg-black`}
          >
            <h2 className="text-base font-semibold text-zinc-400 dark:text-zinc-600">
              {section.title}
            </h2>
            <p className="text-sm text-zinc-500">Coming soon</p>
          </div>
        ),
      )}
    </div>
  );
}
