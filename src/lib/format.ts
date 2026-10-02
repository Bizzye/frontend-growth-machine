const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "2-digit",
  // Dates come from the API as UTC ISO strings (birth dates are stored at 00:00 UTC).
  // Formatting in the user's timezone would shift them to the previous day in UTC-X zones.
  timeZone: "UTC",
});

export function formatDate(value?: string | null): string {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return dateFormatter.format(date);
}

/** Converts a `yyyy-mm-dd` value from `<input type="date">` into an ISO string. */
export function toIsoDate(value?: string): string | undefined {
  if (!value) return undefined;

  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}
