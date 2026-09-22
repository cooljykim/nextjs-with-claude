"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Section } from "@/components/media/section";
import { formatDuration } from "@/lib/format";
import { songHref } from "@/lib/routes";
import type { PagedSongList } from "@/types/paged-songs";

/**
 * Example: a component that fetches its own data over HTTP, from the client,
 * instead of the direct function calls the rest of this app uses (a Server
 * Component calling a data function like `getPagedSongs` at render time).
 *
 * This widget calls GET /api/v2/songs itself, in the browser, after the page
 * has already rendered around it. It's placed right under the "New songs"
 * section on the songs landing page on purpose: both show the same kind of
 * data (the most recently released songs), so the two sit side by side as a
 * direct comparison — "New songs" appears instantly, server-rendered, while
 * this one briefly shows a loading state before filling in, because of the
 * extra network round trip a client-side fetch adds.
 */
export function RecentSongsWidget() {
  const [state, setState] = useState<
    | { status: "loading" }
    | { status: "error" }
    | { status: "ready"; data: PagedSongList }
  >({ status: "loading" });

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/v2/songs?limit=5&sortBy=releaseDate&sortOrder=desc", {
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        return res.json() as Promise<PagedSongList>;
      })
      .then((data) => setState({ status: "ready", data }))
      .catch((err) => {
        if (err.name !== "AbortError") setState({ status: "error" });
      });

    return () => controller.abort();
  }, []);

  return (
    <Section title="Recently added (fetched client-side)">
      <p className="-mt-2 text-xs text-zinc-500">
        Same kind of data as &ldquo;New songs&rdquo; above, but fetched here
        with a live HTTP call to <code>/api/v2/songs</code> from the browser,
        instead of rendered on the server.
      </p>

      {state.status === "loading" && (
        <ul className="flex animate-pulse flex-col gap-2" aria-busy="true">
          {Array.from({ length: 5 }, (_, i) => (
            <li key={i} className="h-6 rounded bg-black/[.08] dark:bg-white/[.12]" />
          ))}
        </ul>
      )}

      {state.status === "error" && (
        <p className="text-sm text-red-600 dark:text-red-400">
          Couldn&apos;t load recent songs.
        </p>
      )}

      {state.status === "ready" && (
        <ul className="divide-y divide-black/[.06] rounded-xl border border-black/[.08] bg-white text-sm dark:divide-white/[.1] dark:border-white/[.145] dark:bg-black">
          {state.data.songs.map((song) => (
            <li key={song.id} className="flex items-center justify-between px-4 py-3">
              <Link href={songHref(song.id)} className="hover:underline">
                {song.title}
              </Link>
              <span className="tabular-nums text-zinc-500">
                {formatDuration(song.durationSec)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}
