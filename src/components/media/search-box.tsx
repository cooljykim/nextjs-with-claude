import Link from "next/link";

interface SearchBoxProps {
  /** The list page the form submits to. */
  action: string;
  label: string;
  placeholder: string;
  /** The current search, shown in the box. */
  q?: string;
  /** Other list settings (limit, sort) to keep when searching. */
  keep?: Record<string, string>;
  /** Where the "Clear" link goes. Shown only while a search is active. */
  clearHref?: string;
}

/** A plain GET form, so search works without client-side JavaScript. */
export function SearchBox({
  action,
  label,
  placeholder,
  q,
  keep = {},
  clearHref,
}: SearchBoxProps) {
  return (
    <form
      role="search"
      action={action}
      method="get"
      className="flex flex-wrap items-center gap-2"
    >
      <label className="sr-only" htmlFor="list-search">
        {label}
      </label>
      <input
        id="list-search"
        type="search"
        name="q"
        defaultValue={q}
        placeholder={placeholder}
        maxLength={100}
        className="h-10 w-full min-w-0 flex-1 rounded-full border border-black/[.15] bg-white px-4 text-sm text-black placeholder:text-zinc-500 sm:max-w-sm dark:border-white/[.2] dark:bg-black dark:text-zinc-50"
      />
      {/* A new search starts from the first page, so offset is not kept. */}
      {Object.entries(keep).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
      <button
        type="submit"
        className="h-10 rounded-full bg-foreground px-5 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
      >
        Search
      </button>
      {q && clearHref && (
        <Link
          href={clearHref}
          className="text-sm font-medium text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-zinc-50"
        >
          Clear
        </Link>
      )}
    </form>
  );
}
