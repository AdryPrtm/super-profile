"use client";

import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  isCustomSocialIcon,
  resolveSocialIconValue,
  SOCIAL_ICON_OPTIONS,
  SocialIcon,
} from "@/features/profile-content/components/SocialIcon";
import type { SocialLink } from "@/features/profile-content/data/profile-content";
import { cn } from "@/lib/utils";

export type SocialRow = SocialLink & { key: string };

const CUSTOM_ICON_VALUE = "custom";

const selectClass =
  "border-input dark:bg-input/30 focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-md border bg-transparent px-3 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50";

type SocialsFieldsetProps = {
  rows: SocialRow[];
  onAdd: () => void;
  onRemove: (key: string) => void;
  onMove: (key: string, direction: -1 | 1) => void;
  onUpdate: (key: string, changes: Partial<SocialLink>) => void;
};

export function SocialsFieldset({
  rows,
  onAdd,
  onRemove,
  onMove,
  onUpdate,
}: SocialsFieldsetProps) {
  // Mode custom disimpan terpisah karena field icon masih kosong tepat setelah
  // opsi custom dipilih.
  const [customKeys, setCustomKeys] = useState<string[]>([]);

  return (
    <div className="space-y-3">
      {rows.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border/60 px-4 py-6 text-center text-sm text-muted-foreground">
          Belum ada social link. Tambahkan lewat tombol di bawah.
        </p>
      ) : null}

      {rows.map((row, index) => {
        const label = row.label.trim() || "social baru";
        const isCustom =
          customKeys.includes(row.key) || isCustomSocialIcon(row.icon);
        const iconValue = isCustom
          ? CUSTOM_ICON_VALUE
          : resolveSocialIconValue(row.icon);
        // Icon dari data lama bisa di luar daftar preset; tetap ditampilkan
        // supaya tidak diam-diam berubah saat card dibuka.
        const extraOption =
          iconValue &&
          iconValue !== CUSTOM_ICON_VALUE &&
          !SOCIAL_ICON_OPTIONS.some((option) => option.value === iconValue)
            ? iconValue
            : null;

        return (
          <div
            key={row.key}
            className="space-y-3 rounded-lg border border-border/60 p-4"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border/60 bg-background text-muted-foreground">
                <SocialIcon icon={row.icon} label={row.label} />
              </span>
              <p className="flex-1 truncate text-sm font-medium">
                {row.label.trim() || "Social baru"}
              </p>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={`Pindahkan ${label} ke atas`}
                disabled={index === 0}
                onClick={() => onMove(row.key, -1)}
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={`Pindahkan ${label} ke bawah`}
                disabled={index === rows.length - 1}
                onClick={() => onMove(row.key, 1)}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={`Hapus ${label}`}
                onClick={() => onRemove(row.key)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor={`${row.key}-label`}>Nama</Label>
                <Input
                  id={`${row.key}-label`}
                  name="socialLabel"
                  value={row.label}
                  placeholder="Instagram"
                  onChange={(event) =>
                    onUpdate(row.key, { label: event.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`${row.key}-icon`}>Ikon</Label>
                <select
                  id={`${row.key}-icon`}
                  className={cn(
                    selectClass,
                    !iconValue && "text-muted-foreground",
                  )}
                  value={iconValue}
                  onChange={(event) => {
                    const value = event.target.value;

                    setCustomKeys((current) =>
                      value === CUSTOM_ICON_VALUE
                        ? [...current, row.key]
                        : current.filter((key) => key !== row.key),
                    );
                    onUpdate(row.key, {
                      icon: value === CUSTOM_ICON_VALUE ? "" : value,
                    });
                  }}
                >
                  <option value="">Pilih ikon</option>
                  {extraOption ? (
                    <option value={extraOption}>{extraOption}</option>
                  ) : null}
                  {SOCIAL_ICON_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                  <option value={CUSTOM_ICON_VALUE}>Custom (URL gambar)</option>
                </select>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor={`${row.key}-url`}>Link</Label>
                <Input
                  id={`${row.key}-url`}
                  name="socialUrl"
                  inputMode="url"
                  value={row.url}
                  placeholder="https://instagram.com/username"
                  onChange={(event) =>
                    onUpdate(row.key, { url: event.target.value })
                  }
                />
              </div>
              {isCustom ? (
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor={`${row.key}-custom-icon`}>
                    Link Ikon Custom
                  </Label>
                  <Input
                    id={`${row.key}-custom-icon`}
                    inputMode="url"
                    value={row.icon}
                    placeholder="https://cdn.simpleicons.org/instagram"
                    onChange={(event) =>
                      onUpdate(row.key, { icon: event.target.value })
                    }
                  />
                </div>
              ) : null}
              <input type="hidden" name="socialIcon" value={row.icon} />
            </div>
          </div>
        );
      })}

      <Button type="button" variant="outline" onClick={onAdd}>
        <Plus className="h-4 w-4" />
        Tambah Social
      </Button>
    </div>
  );
}
