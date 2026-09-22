import type { Metadata } from "next";

export const metadata: Metadata = { title: "Media" };

export default function MediaPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
        Media
      </h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        Choose a section from the menu to get started.
      </p>
    </div>
  );
}
