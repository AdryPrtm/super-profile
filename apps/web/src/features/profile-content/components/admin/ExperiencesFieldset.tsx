"use client";

import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/features/profile-content/components/admin/RichTextEditor";
import type { Experience } from "@/features/profile-content/data/profile-content";
import {
  formatExperiencePeriod,
  LOCATION_TYPE_OPTIONS,
  MONTH_OPTIONS,
} from "@/features/profile-content/utils/experience-period";
import { cn } from "@/lib/utils";

export type ExperienceRow = Experience & { key: string };

// Rentang tahun dihitung sekali di module supaya server dan client merender
// daftar option yang sama.
const CURRENT_YEAR = new Date().getFullYear();

const YEAR_SELECT_OPTIONS = Array.from({ length: 51 }, (_, index) => {
  const year = String(CURRENT_YEAR - index);
  return { value: year, label: year };
});

const LOCATION_SELECT_OPTIONS = LOCATION_TYPE_OPTIONS.map((type) => ({
  value: type,
  label: type,
}));

const selectClass =
  "border-input dark:bg-input/30 focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-md border bg-transparent px-3 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50";

type SelectFieldProps = {
  id: string;
  value: string;
  disabled?: boolean;
  placeholder: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
};

function SelectField({
  id,
  value,
  disabled,
  placeholder,
  options,
  onChange,
}: SelectFieldProps) {
  // Nilai dari data lama bisa di luar daftar option; tetap ditampilkan supaya
  // tidak diam-diam berubah saat card dibuka.
  const extraOption =
    value && !options.some((option) => option.value === value) ? value : null;

  return (
    <select
      id={id}
      className={cn(selectClass, !value && "text-muted-foreground")}
      value={value}
      disabled={disabled}
      onChange={(event) => onChange(event.target.value)}
    >
      <option value="">{placeholder}</option>
      {extraOption ? <option value={extraOption}>{extraOption}</option> : null}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
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
        const preview = formatExperiencePeriod(row);

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

            {/* Select di bawah hanya UI; nilainya dikirim lewat hidden input
                supaya select yang disabled tetap ikut tersimpan. */}
            <input
              type="hidden"
              name="experienceLocationType"
              value={row.locationType}
            />
            <input
              type="hidden"
              name="experienceStartMonth"
              value={row.startMonth}
            />
            <input
              type="hidden"
              name="experienceStartYear"
              value={row.startYear}
            />
            <input
              type="hidden"
              name="experienceEndMonth"
              value={row.isCurrent ? "" : row.endMonth}
            />
            <input
              type="hidden"
              name="experienceEndYear"
              value={row.isCurrent ? "" : row.endYear}
            />
            <input
              type="hidden"
              name="experienceIsCurrent"
              value={row.isCurrent ? "1" : "0"}
            />
            <input type="hidden" name="experiencePeriod" value={row.period} />

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor={`${row.key}-role`}>Posisi</Label>
                <Input
                  id={`${row.key}-role`}
                  name="experienceRole"
                  value={row.role}
                  placeholder="Cloud Computing Student"
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
                  placeholder="Bangkit Academy"
                  onChange={(event) =>
                    onUpdate(row.key, { company: event.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2 sm:max-w-xs">
              <Label htmlFor={`${row.key}-location-type`}>Tipe Kerja</Label>
              <SelectField
                id={`${row.key}-location-type`}
                value={row.locationType}
                placeholder="Pilih tipe"
                options={LOCATION_SELECT_OPTIONS}
                onChange={(value) => onUpdate(row.key, { locationType: value })}
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor={`${row.key}-start-month`}>Mulai</Label>
                <div className="grid grid-cols-2 gap-2">
                  <SelectField
                    id={`${row.key}-start-month`}
                    value={row.startMonth}
                    placeholder="Bulan"
                    options={MONTH_OPTIONS}
                    onChange={(value) =>
                      onUpdate(row.key, { startMonth: value })
                    }
                  />
                  <SelectField
                    id={`${row.key}-start-year`}
                    value={row.startYear}
                    placeholder="Tahun"
                    options={YEAR_SELECT_OPTIONS}
                    onChange={(value) => onUpdate(row.key, { startYear: value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`${row.key}-end-month`}>Selesai</Label>
                <div className="grid grid-cols-2 gap-2">
                  <SelectField
                    id={`${row.key}-end-month`}
                    value={row.isCurrent ? "" : row.endMonth}
                    disabled={row.isCurrent}
                    placeholder="Bulan"
                    options={MONTH_OPTIONS}
                    onChange={(value) => onUpdate(row.key, { endMonth: value })}
                  />
                  <SelectField
                    id={`${row.key}-end-year`}
                    value={row.isCurrent ? "" : row.endYear}
                    disabled={row.isCurrent}
                    placeholder="Tahun"
                    options={YEAR_SELECT_OPTIONS}
                    onChange={(value) => onUpdate(row.key, { endYear: value })}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id={`${row.key}-is-current`}
                checked={row.isCurrent}
                onCheckedChange={(checked) =>
                  onUpdate(row.key, { isCurrent: checked === true })
                }
              />
              <Label
                htmlFor={`${row.key}-is-current`}
                className="text-sm font-normal"
              >
                Masih bekerja di sini
              </Label>
            </div>

            {preview ? (
              <p className="text-xs text-muted-foreground">
                Tampil sebagai:{" "}
                <span className="text-foreground">{preview}</span>
              </p>
            ) : null}

            <div className="space-y-2">
              <Label htmlFor={`${row.key}-description`}>Deskripsi</Label>
              <input
                type="hidden"
                name="experienceDescription"
                value={row.description}
              />
              <RichTextEditor
                id={`${row.key}-description`}
                value={row.description}
                placeholder="Muncul saat tombol Show more di-click di halaman publik."
                onChange={(value) =>
                  onUpdate(row.key, { description: value })
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
