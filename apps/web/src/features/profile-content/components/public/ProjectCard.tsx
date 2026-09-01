"use client";

import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Project } from "@/features/profile-content/data/profile-content";
import { cn } from "@/lib/utils";

type ProjectCardProps = {
  project: Project;
};

function TechChips({ tech }: { tech: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tech.map((item) => (
        <span
          key={item}
          className="rounded-full bg-accent/80 px-2.5 py-0.5 text-xs text-muted-foreground"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

export function ProjectCard({ project }: ProjectCardProps) {
  const [activeImage, setActiveImage] = useState(0);

  const cover = project.images[0];
  // Index dijaga tetap valid kalau daftar gambar berubah.
  const safeIndex = Math.min(
    activeImage,
    Math.max(project.images.length - 1, 0),
  );
  const mainImage = project.images[safeIndex];

  return (
    <Dialog
      onOpenChange={(open) => {
        if (open) {
          setActiveImage(0);
        }
      }}
    >
      <DialogTrigger asChild>
        <button
          type="button"
          className="group block w-full rounded-2xl border border-border/50 p-6 text-left transition-all duration-300 hover:border-border hover:bg-accent/30"
        >
          <div className="flex items-start gap-4">
            {cover ? (
              <img
                src={cover}
                alt=""
                loading="lazy"
                className="h-20 w-28 shrink-0 rounded-lg border border-border/50 object-cover"
              />
            ) : null}

            <div className="min-w-0 flex-1 space-y-3">
              <h3 className="text-lg font-medium group-hover:text-foreground">
                {project.title}
              </h3>
              <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                {project.description}
              </p>
              <TechChips tech={project.tech} />
            </div>
          </div>
        </button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{project.title}</DialogTitle>
          {project.description ? (
            <DialogDescription>{project.description}</DialogDescription>
          ) : null}
        </DialogHeader>

        {mainImage ? (
          <div className="space-y-3">
            <img
              src={mainImage}
              alt=""
              className="max-h-[55vh] w-full rounded-xl border border-border/50 object-contain"
            />

            {project.images.length > 1 ? (
              <div className="flex flex-wrap gap-2">
                {project.images.map((image, index) => (
                  <button
                    key={image}
                    type="button"
                    aria-label={`Lihat gambar ${index + 1}`}
                    aria-current={index === safeIndex}
                    onClick={() => setActiveImage(index)}
                    className={cn(
                      "h-14 w-20 overflow-hidden rounded-md border transition-opacity",
                      index === safeIndex
                        ? "border-primary"
                        : "border-border/50 opacity-60 hover:opacity-100",
                    )}
                  >
                    <img
                      src={image}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}

        {project.tech.length > 0 ? (
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Tech Stack
            </p>
            <TechChips tech={project.tech} />
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
