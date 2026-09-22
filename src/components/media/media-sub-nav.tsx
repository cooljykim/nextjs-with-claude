"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { routes } from "@/lib/routes";

interface NavItem {
  label: string;
  href: string;
  enabled: boolean;
}

interface NavGroup {
  label: string;
  href: string;
  items: NavItem[];
}

const GROUPS: NavGroup[] = [
  {
    label: "Music",
    href: routes.music,
    items: [
      { label: "Songs", href: routes.songs, enabled: true },
      { label: "Artists", href: routes.artists, enabled: true },
      { label: "Albums", href: routes.albums, enabled: true },
    ],
  },
  {
    label: "Film",
    href: routes.film,
    items: [
      { label: "Movies", href: routes.movies, enabled: true },
      { label: "Actors", href: routes.actors, enabled: true },
    ],
  },
];

const ITEM_CLASS = "block whitespace-nowrap rounded-lg px-3 py-2";

/**
 * Side navigation for the media section: groups (Music, Film) with their
 * sections beneath. On small screens each group becomes one horizontal row.
 */
export function MediaSubNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Media sections"
      className="flex flex-col gap-2 text-sm md:gap-6"
    >
      {GROUPS.map((group) => (
        <div
          key={group.href}
          className="flex flex-wrap items-center gap-x-1 md:block"
        >
          <Link
            href={group.href}
            aria-current={pathname === group.href ? "page" : undefined}
            className={`block whitespace-nowrap rounded-lg px-3 py-2 font-semibold text-black transition-colors md:py-1 dark:text-zinc-50 ${
              pathname === group.href
                ? "bg-black/[.07] dark:bg-white/[.12]"
                : "hover:bg-black/[.04] dark:hover:bg-white/[.08]"
            }`}
          >
            {group.label}
          </Link>

          <div className="flex flex-wrap gap-1 md:ml-3 md:flex-col md:gap-0.5 md:border-l md:border-black/[.1] md:pl-2 dark:md:border-white/[.15]">
            {group.items.map((item) => {
              if (!item.enabled) {
                return (
                  <span
                    key={item.href}
                    aria-disabled="true"
                    title="Coming soon"
                    className={`${ITEM_CLASS} cursor-not-allowed font-medium text-zinc-400 dark:text-zinc-600`}
                  >
                    {item.label}
                  </span>
                );
              }

              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`${ITEM_CLASS} transition-colors ${
                    active
                      ? "bg-black/[.07] font-semibold text-black dark:bg-white/[.12] dark:text-zinc-50"
                      : "font-medium text-zinc-600 hover:bg-black/[.04] dark:text-zinc-400 dark:hover:bg-white/[.08]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}
