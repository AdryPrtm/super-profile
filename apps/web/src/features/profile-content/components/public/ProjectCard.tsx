"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";

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
  index: number;
};

function TechChips({ tech }: { tech: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tech.map((item) => (
        <span
          key={item}
          className="border border-[var(--portfolio-border)] px-2.5 py-1 text-[0.7rem] font-medium text-[var(--portfolio-muted)]"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

export function ProjectCard({ project, index }: ProjectCardProps) {
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
          className="group flex h-full w-full cursor-pointer flex-col border border-[var(--portfolio-border)] bg-[var(--portfolio-background)] text-left transition-colors hover:border-[var(--portfolio-accent)] hover:bg-[var(--portfolio-surface)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--portfolio-accent)]"
        >
          <div className="relative flex aspect-[16/10] w-full items-center justify-center overflow-hidden border-b border-[var(--portfolio-border)] bg-[var(--portfolio-surface)]">
            {cover ? (
              <img
                src={cover}
                alt={`${project.title} preview`}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              />
            ) : (
              <div className="flex h-full w-full flex-col justify-between p-6 sm:p-8">
                <span className="portfolio-label text-[var(--portfolio-accent)]">Selected work / {String(index + 1).padStart(2, "0")}</span>
                <span aria-hidden="true" className="line-clamp-2 max-w-full break-words text-4xl font-bold leading-none tracking-[-0.07em] text-[var(--portfolio-accent)] opacity-80 sm:text-5xl">{project.title}</span>
                <span className="h-px w-full bg-[var(--portfolio-border)]" />
              </div>
            )}
          </div>
          <div className="flex w-full flex-1 flex-col p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-xl font-bold tracking-tight sm:text-2xl">{project.title}</h3>
              <ArrowUpRight aria-hidden="true" className="h-5 w-5 shrink-0 text-[var(--portfolio-accent)]" />
            </div>
            <p className="mt-3 mb-6 line-clamp-3 text-sm leading-relaxed text-[var(--portfolio-muted)]">{project.description}</p>
            <div className="mt-auto"><TechChips tech={project.tech} /></div>
          </div>
        </button>
      </DialogTrigger>

      <DialogContent className="portfolio rounded-none border-[var(--portfolio-border)]">
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
              alt={`${project.title} screenshot ${safeIndex + 1}`}
              className="max-h-[55vh] w-full rounded-xl border border-border/50 object-contain"
            />

            {project.images.length > 1 ? (
              <div className="flex flex-wrap gap-2">
                {project.images.map((image, index) => (
                  <button
                    key={image}
                    type="button"
                    aria-label={`View image ${index + 1}`}
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
                      alt={`${project.title} screenshot ${index + 1}`}
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
