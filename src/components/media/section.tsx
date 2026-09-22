import Link from "next/link";

interface SectionProps {
  title: string;
  seeAllHref?: string;
  children: React.ReactNode;
}

/** A titled block on a landing page, with an optional "See all" link. */
export function Section({ title, seeAllHref, children }: SectionProps) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between">
        <h2 className="text-lg font-semibold tracking-tight text-black dark:text-zinc-50">
          {title}
        </h2>
        {seeAllHref && (
          <Link
            href={seeAllHref}
            className="text-sm font-medium text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            See all →
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}

export function SectionSkeleton({ title }: { title: string }) {
  return (
    <Section title={title}>
      <div
        className="grid animate-pulse grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6"
        aria-busy="true"
      >
        {Array.from({ length: 6 }, (_, i) => (
          <div
            key={i}
            className="h-28 rounded-xl bg-black/[.08] dark:bg-white/[.12]"
          />
        ))}
      </div>
    </Section>
  );
}
