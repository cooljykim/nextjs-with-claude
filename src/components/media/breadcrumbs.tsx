import Link from "next/link";

export interface Crumb {
  label: string;
  href?: string; // the last crumb has no link
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-zinc-600 dark:text-zinc-400">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden="true">/</span>}
            {item.href ? (
              <Link
                href={item.href}
                className="hover:text-black dark:hover:text-zinc-50"
              >
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-black dark:text-zinc-50">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
