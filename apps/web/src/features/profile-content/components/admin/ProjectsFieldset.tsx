"use client";

import { ImagePlus, Loader2, Plus, Trash2, X } from "lucide-react";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadProjectImage } from "@/features/profile-content/actions/upload-project-image-action";
import { textareaClass } from "@/features/profile-content/components/admin/ProfileTextareaField";
import type { Project } from "@/features/profile-content/data/profile-content";
import { cn } from "@/lib/utils";

export type ProjectRow = Project & { key: string };

type ProjectRowCardProps = {
  row: ProjectRow;
  availableTech: string[];
  onRemove: (key: string) => void;
  onUpdate: (key: string, changes: Partial<Project>) => void;
};

function ProjectRowCard({
  row,
  availableTech,
  onRemove,
  onUpdate,
}: ProjectRowCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Tech yang tersimpan tapi skill-nya sudah dihapus dari section Skills.
  const orphanTech = row.tech.filter((tech) => !availableTech.includes(tech));

  function toggleTech(tech: string) {
    onUpdate(row.key, {
      tech: row.tech.includes(tech)
        ? row.tech.filter((item) => item !== tech)
        : [...row.tech, tech],
    });
  }

  async function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) {
      return;
    }

    setUploading(true);
    setUploadError(null);

    const uploaded: string[] = [];

    for (const file of Array.from(fileList)) {
      const payload = new FormData();
      payload.append("file", file);

      const result = await uploadProjectImage(payload);

      if (result.error) {
        setUploadError(result.error);
        break;
      }

      if (result.url) {
        uploaded.push(result.url);
      }
    }

    if (uploaded.length > 0) {
      onUpdate(row.key, { images: [...row.images, ...uploaded] });
    }

    setUploading(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-4 rounded-lg border border-border/60 p-4">
      <div className="flex items-center gap-3">
        <p className="flex-1 truncate text-sm font-medium">
          {row.title.trim() || "Project baru"}
        </p>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={`Hapus ${row.title.trim() || "project baru"}`}
          onClick={() => onRemove(row.key)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${row.key}-title`}>Judul</Label>
        <Input
          id={`${row.key}-title`}
          name="projectTitle"
          value={row.title}
          placeholder="Project Alpha"
          onChange={(event) => onUpdate(row.key, { title: event.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${row.key}-description`}>Deskripsi</Label>
        <textarea
          id={`${row.key}-description`}
          name="projectDescription"
          rows={3}
          className={textareaClass}
          value={row.description}
          placeholder="Ringkas apa yang kamu bangun dan hasilnya."
          onChange={(event) =>
            onUpdate(row.key, { description: event.target.value })
          }
        />
      </div>

      <div className="space-y-2">
        <Label>Tech Stack</Label>
        <input
          type="hidden"
          name="projectTech"
          value={JSON.stringify(row.tech)}
        />

        {availableTech.length === 0 && orphanTech.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Belum ada skill. Tambahkan dulu di section Skills, lalu pilih di
            sini.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {availableTech.map((tech) => {
              const selected = row.tech.includes(tech);

              return (
                <button
                  key={tech}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => toggleTech(tech)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs transition-colors",
                    selected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border/60 text-muted-foreground hover:border-border hover:text-foreground",
                  )}
                >
                  {tech}
                </button>
              );
            })}

            {orphanTech.map((tech) => (
              <button
                key={tech}
                type="button"
                onClick={() => toggleTech(tech)}
                title="Skill ini sudah tidak ada di daftar Skills. Klik untuk melepas."
                className="flex items-center gap-1 rounded-full border border-dashed border-destructive/60 px-3 py-1 text-xs text-destructive"
              >
                {tech}
                <X className="h-3 w-3" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label>Gambar</Label>
        <input
          type="hidden"
          name="projectImages"
          value={JSON.stringify(row.images)}
        />

        {row.images.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {row.images.map((url) => (
              <div
                key={url}
                className="relative h-20 w-28 overflow-hidden rounded-md border border-border/60"
              >
                <img src={url} alt="" className="h-full w-full object-cover" />
                <button
                  type="button"
                  aria-label="Hapus gambar ini"
                  onClick={() =>
                    onUpdate(row.key, {
                      images: row.images.filter((item) => item !== url),
                    })
                  }
                  className="absolute right-1 top-1 rounded-full bg-background/90 p-1 text-foreground shadow-sm transition-colors hover:bg-background"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        ) : null}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(event) => handleFiles(event.target.files)}
        />

        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
          >
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ImagePlus className="h-4 w-4" />
            )}
            {uploading ? "Mengunggah..." : "Upload Gambar"}
          </Button>
          <span className="text-xs text-muted-foreground">
            PNG, JPG, WEBP, GIF, atau SVG. Maksimal 5 MB per gambar.
          </span>
        </div>

        {uploadError ? (
          <p className="text-sm text-destructive">{uploadError}</p>
        ) : null}
      </div>
    </div>
  );
}

type ProjectsFieldsetProps = {
  rows: ProjectRow[];
  availableTech: string[];
  onAdd: () => void;
  onRemove: (key: string) => void;
  onUpdate: (key: string, changes: Partial<Project>) => void;
};

export function ProjectsFieldset({
  rows,
  availableTech,
  onAdd,
  onRemove,
  onUpdate,
}: ProjectsFieldsetProps) {
  return (
    <div className="space-y-3">
      {rows.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border/60 px-4 py-6 text-center text-sm text-muted-foreground">
          Belum ada project. Tambahkan lewat tombol di bawah.
        </p>
      ) : null}

      {rows.map((row) => (
        <ProjectRowCard
          key={row.key}
          row={row}
          availableTech={availableTech}
          onRemove={onRemove}
          onUpdate={onUpdate}
        />
      ))}

      <Button type="button" variant="outline" onClick={onAdd}>
        <Plus className="h-4 w-4" />
        Tambah Project
      </Button>
    </div>
  );
}
