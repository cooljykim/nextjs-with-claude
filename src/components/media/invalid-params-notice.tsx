export function InvalidParamsNotice() {
  return (
    <p
      role="status"
      className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-900 dark:text-amber-200"
    >
      Some of the options in the link weren&apos;t valid, so the default view is
      shown.
    </p>
  );
}
