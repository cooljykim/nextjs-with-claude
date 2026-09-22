/** Parses `?expand=a,b` against the values an endpoint allows. Returns the unknown values if any. */
export function parseExpandParam<T extends string>(
  params: URLSearchParams,
  allowed: readonly T[],
): { expand: Set<T> } | { invalid: string[] } {
  const raw = params.get("expand");
  const values = raw ? raw.split(",").map((v) => v.trim()).filter(Boolean) : [];

  const invalid = values.filter((v) => !(allowed as readonly string[]).includes(v));
  if (invalid.length > 0) return { invalid };

  return { expand: new Set(values as T[]) };
}

export function invalidExpandResponse(invalid: string[], allowed: readonly string[]) {
  return Response.json(
    { error: `Invalid expand value(s): ${invalid.join(", ")}`, allowed },
    { status: 400 },
  );
}
