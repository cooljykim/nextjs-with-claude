import Link from "next/link";
import { MediaSubNav } from "@/components/media/media-sub-nav";
import { routes } from "@/lib/routes";

export default function MediaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col bg-zinc-50 font-sans dark:bg-black">
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-6 py-8 md:flex-row md:gap-10">
        <aside className="shrink-0 md:w-44">
          <div className="md:sticky md:top-8">
            <Link
              href={routes.media}
              className="mb-3 hidden border-b border-black/[.1] px-3 pb-3 text-lg font-semibold tracking-tight text-black hover:opacity-70 md:block dark:border-white/[.15] dark:text-zinc-50"
            >
              Media
            </Link>
            <MediaSubNav />
          </div>
        </aside>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
