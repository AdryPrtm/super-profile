import type { Experience } from "@/features/profile-content/data/profile-content";

export const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const MONTH_OPTIONS = MONTH_LABELS.map((label, index) => ({
  value: String(index + 1),
  label,
}));

export const LOCATION_TYPE_OPTIONS = ["On-site", "Hybrid", "Remote"];

function monthLabel(month: string) {
  const index = Number.parseInt(month, 10) - 1;
  return MONTH_LABELS[index] ?? "";
}

function formatMonthYear(month: string, year: string) {
  if (!year) {
    return "";
  }

  const label = monthLabel(month);
  return label ? `${label} ${year}` : year;
}

/** Jumlah bulan absolut, dipakai untuk menghitung durasi. */
function toAbsoluteMonths(month: string, year: string) {
  const parsedYear = Number.parseInt(year, 10);
  const parsedMonth = Number.parseInt(month, 10);

  if (Number.isNaN(parsedYear) || Number.isNaN(parsedMonth)) {
    return null;
  }

  return parsedYear * 12 + (parsedMonth - 1);
}

/** 6 -> "6 mos", 14 -> "1 yr 2 mos". */
export function formatDuration(totalMonths: number) {
  if (totalMonths <= 0) {
    return "";
  }

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  const parts = [];

  if (years > 0) {
    parts.push(`${years} ${years === 1 ? "yr" : "yrs"}`);
  }

  if (months > 0) {
    parts.push(`${months} ${months === 1 ? "mo" : "mos"}`);
  }

  return parts.join(" ");
}

type PeriodInput = Pick<
  Experience,
  "startMonth" | "startYear" | "endMonth" | "endYear" | "isCurrent" | "period"
>;

/** "Feb 2023 - Jul 2023 · 6 mos", dengan fallback ke period format lama. */
export function formatExperiencePeriod(experience: PeriodInput) {
  const start = formatMonthYear(experience.startMonth, experience.startYear);

  if (!start) {
    return experience.period;
  }

  const now = new Date();
  const end = experience.isCurrent
    ? "Present"
    : formatMonthYear(experience.endMonth, experience.endYear);

  const range = end ? `${start} - ${end}` : start;

  const startMonths = toAbsoluteMonths(
    experience.startMonth,
    experience.startYear,
  );
  const endMonths = experience.isCurrent
    ? now.getFullYear() * 12 + now.getMonth()
    : toAbsoluteMonths(experience.endMonth, experience.endYear);

  if (startMonths === null || endMonths === null) {
    return range;
  }

  // Inklusif: Feb 2023 - Jul 2023 dihitung 6 bulan.
  const duration = formatDuration(endMonths - startMonths + 1);

  return duration ? `${range} · ${duration}` : range;
}
