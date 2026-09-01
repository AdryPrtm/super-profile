"use client";

import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SkillLogo } from "@/features/profile-content/components/SkillLogo";
import type { Skill } from "@/features/profile-content/data/profile-content";

export type SkillRow = Skill & { key: string };

type SkillsFieldsetProps = {
  rows: SkillRow[];
  onAdd: () => void;
  onRemove: (key: string) => void;
  onUpdate: (key: string, changes: Partial<Skill>) => void;
};

export function SkillsFieldset({
  rows,
  onAdd,
  onRemove,
  onUpdate,
}: SkillsFieldsetProps) {
  return (
    <div className="space-y-3">
      {rows.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border/60 px-4 py-6 text-center text-sm text-muted-foreground">
          Belum ada skill. Tambahkan lewat tombol di bawah.
        </p>
      ) : null}

      {rows.map((row) => (
        <div
          key={row.key}
          className="space-y-3 rounded-lg border border-border/60 p-4"
        >
          <div className="flex items-center gap-3">
            <SkillLogo
              src={row.logo}
              name={row.name}
              className="h-10 w-10 border border-border/60 bg-background p-1.5"
            />
            <p className="flex-1 truncate text-sm font-medium">
              {row.name.trim() || "Skill baru"}
            </p>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={`Hapus ${row.name.trim() || "skill baru"}`}
              onClick={() => onRemove(row.key)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor={`${row.key}-name`}>Judul</Label>
              <Input
                id={`${row.key}-name`}
                name="skillName"
                value={row.name}
                placeholder="React"
                onChange={(event) =>
                  onUpdate(row.key, { name: event.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${row.key}-category`}>Sub Judul</Label>
              <Input
                id={`${row.key}-category`}
                name="skillCategory"
                value={row.category}
                placeholder="Frontend"
                onChange={(event) =>
                  onUpdate(row.key, { category: event.target.value })
                }
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor={`${row.key}-logo`}>Link Logo</Label>
              <Input
                id={`${row.key}-logo`}
                name="skillLogo"
                inputMode="url"
                value={row.logo}
                placeholder="https://cdn.simpleicons.org/react"
                onChange={(event) =>
                  onUpdate(row.key, { logo: event.target.value })
                }
              />
            </div>
          </div>
        </div>
      ))}

      <Button type="button" variant="outline" onClick={onAdd}>
        <Plus className="h-4 w-4" />
        Tambah Skill
      </Button>
    </div>
  );
}
