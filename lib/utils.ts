import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// --- Date helpers ---------------------------------------------------------
// These helpers treat backend dates that are date-only but encoded as UTC
// midnight ISO strings (e.g. "2025-09-29T00:00:00.000Z"). The goal is to
// interpret them as date-only values (Y-M-D) without shifting due to local
// timezone during SSR/SSG.

/**
 * Parse an ISO string (UTC) and return a local Date representing the same
 * Y/M/D (time set to local midnight). Returns null on invalid input.
 */
export function utcIsoToLocalDateOnly(isoString: string | null | undefined): Date | null {
  if (!isoString) return null;
  try {
    const d = new Date(isoString);
    const y = d.getUTCFullYear();
    const m = d.getUTCMonth();
    const dt = d.getUTCDate();
    return new Date(y, m, dt);
  } catch {
    return null;
  }
}

/**
 * Convert a local Date (date-only) into an ISO string representing that
 * date at UTC midnight. Useful for sending to backends that expect
 * date-only values encoded as UTC midnight.
 */
export function localDateToUtcIso(date: Date | null | undefined): string | null {
  if (!date) return null;
  try {
    // Build a Date at UTC midnight by using Date.UTC with local Y/M/D
    const y = date.getFullYear();
    const m = date.getMonth();
    const dt = date.getDate();
    const utcDate = new Date(Date.UTC(y, m, dt, 0, 0, 0, 0));
    return utcDate.toISOString();
  } catch {
    return null;
  }
}
