"use client";

import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { textareaClass } from "@/features/profile-content/components/admin/ProfileTextareaField";
import type { Experience } from "@/features/profile-content/data/profile-content";
import { cn } from "@/lib/utils";

export type ExperienceRow = Experience & { key: string };

const PRESENT_LABEL = "Present";

// Rentang tahun dihitung sekali di module supaya server dan client merender
// daftar option yang sama.
const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 51 }, (_, index) =>
  String(CURRENT_YEAR + 1 - index),
);

const selectClass =
  "border-input dark:bg-input/30 focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-md border bg-transparent px-3 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:ring-[3px]";

/** "2024 - Present" -> { start: "2024", end: "Present" } */
function splitPeriod(period: string) {
  const [start = "", end = ""] = period.split("-").map((part) => part.trim());
  return { start, end };
}

function joinPeriod(start: string, end: string) {
  if (!start) {
    return end;
  }

  return end ? `${start} - ${end}` : start;
}

type YearSelectProps = {
  id: string;
  label: string;
  value: string;
  includePresent?: boolean;
  onChange: (value: string) => void;
};

function YearSelect({
  id,
  label,
  value,
  includePresent,
  onChange,
}: YearSelectProps) {
  // Tahun hasil input lama bisa di luar rentang option; tetap tampilkan supaya
  // nilainya tidak diam-diam berubah saat card dibuka.
  const extraOption =
    value && value !== PRESENT_LABEL && !YEAR_OPTIONS.includes(value)
      ? value
      : null;

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <select
        id={id}
        className={cn(selectClass, !value && "text-muted-foreground")}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="">—</option>
        {includePresent ? (
          <option value={PRESENT_LABEL}>{PRESENT_LABEL}</option>
        ) : null}
        {extraOption ? (
          <option value={extraOption}>{extraOption}</option>
        ) : null}
        {YEAR_OPTIONS.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
}

type ExperiencesFieldsetProps = {
  rows: ExperienceRow[];
  onAdd: () => void;
  onRemove: (key: string) => void;
  onUpdate: (key: string, changes: Partial<Experience>) => void;
};

export function ExperiencesFieldset({
  rows,
  onAdd,
  onRemove,
  onUpdate,
}: ExperiencesFieldsetProps) {
  return (
    <div className="space-y-3">
      {rows.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border/60 px-4 py-6 text-center text-sm text-muted-foreground">
          Belum ada experience. Tambahkan lewat tombol di bawah.
        </p>
      ) : null}

      {rows.map((row) => {
        const { start, end } = splitPeriod(row.period);

        return (
          <div
            key={row.key}
            className="space-y-4 rounded-lg border border-border/60 p-4"
          >
            <div className="flex items-center gap-3">
              <p className="flex-1 truncate text-sm font-medium">
                {row.role.trim() || "Experience baru"}
              </p>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={`Hapus ${row.role.trim() || "experience baru"}`}
                onClick={() => onRemove(row.key)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <input type="hidden" name="experiencePeriod" value={row.period} />

            <div className="grid gap-3 sm:grid-cols-2">
              <YearSelect
                id={`${row.key}-period-start`}
                label="Tahun Mulai"
                value={start}
                onChange={(value) =>
                  onUpdate(row.key, { period: joinPeriod(value, end) })
                }
              />
              <YearSelect
                id={`${row.key}-period-end`}
                label="Tahun Selesai"
                value={end}
                includePresent
                onChange={(value) =>
                  onUpdate(row.key, { period: joinPeriod(start, value) })
                }
              />
              <div className="space-y-2">
                <Label htmlFor={`${row.key}-role`}>Posisi</Label>
                <Input
                  id={`${row.key}-role`}
                  name="experienceRole"
                  value={row.role}
                  placeholder="Senior Software Engineer"
                  onChange={(event) =>
                    onUpdate(row.key, { role: event.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`${row.key}-company`}>Company</Label>
                <Input
                  id={`${row.key}-company`}
                  name="experienceCompany"
                  value={row.company}
                  placeholder="Company Name"
                  onChange={(event) =>
                    onUpdate(row.key, { company: event.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`${row.key}-description`}>Deskripsi</Label>
              <textarea
                id={`${row.key}-description`}
                name="experienceDescription"
                rows={3}
                className={textareaClass}
                value={row.description}
                placeholder="Muncul saat card di-click di halaman publik."
                onChange={(event) =>
                  onUpdate(row.key, { description: event.target.value })
                }
              />
            </div>
          </div>
        );
      })}

      <Button type="button" variant="outline" onClick={onAdd}>
        <Plus className="h-4 w-4" />
        Tambah Experience
      </Button>
    </div>
  );
}
