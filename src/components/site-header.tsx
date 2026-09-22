"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { routes } from "@/lib/routes";

// Top-level sections. Add new categories here.
const ITEMS: { label: string; href: string }[] = [
  { label: "Home", href: "/" },
  { label: "Media", href: routes.media },
  { label: "Jay", href: "/jay" },
];

/** Site-wide navigation. Hidden on the home page, which has its own layout. */
export function SiteHeader() {
  const pathname = usePathname();
  if (pathname === "/") return null;

  return (
    <header className="border-b border-black/[.08] bg-white dark:border-white/[.145] dark:bg-black">
      <nav
        aria-label="Site"
        className="mx-auto flex w-full max-w-5xl gap-1 px-6 py-3 text-sm font-medium"
      >
        {ITEMS.map((item) => {
          // "/" would match everything, so Home only counts as active on "/" itself.
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`rounded-full px-4 py-2 transition-colors ${
                active
                  ? "bg-foreground text-background"
                  : "text-zinc-600 hover:bg-black/[.04] dark:text-zinc-400 dark:hover:bg-white/[.08]"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
