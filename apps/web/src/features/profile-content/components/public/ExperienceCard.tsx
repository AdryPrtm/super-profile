"use client";

import { useState } from "react";

import type { Experience } from "@/features/profile-content/data/profile-content";
import { formatExperiencePeriod } from "@/features/profile-content/utils/experience-period";
import { richTextClass } from "@/features/profile-content/utils/rich-text";
import { cn } from "@/lib/utils";

type ExperienceCardProps = {
  experience: Experience;
  /** Item genap tampil di kanan garis timeline, ganjil di kiri. */
  index: number;
};

export function ExperienceCard({ experience, index }: ExperienceCardProps) {
  const [open, setOpen] = useState(false);

  const contentOnRight = index % 2 === 0;
  const expandable = Boolean(experience.description);
  const period = formatExperiencePeriod(experience);
  const subtitle = [experience.company, experience.locationType]
    .filter(Boolean)
    .join(" · ");

  return (
    <li className="relative pl-12 md:grid md:grid-cols-2 md:items-start md:gap-x-12 md:pl-0">
      <span
        aria-hidden
        className="absolute left-4 top-2.5 h-3 w-3 -translate-x-1/2 rounded-full bg-primary ring-4 ring-background md:left-1/2"
      />

      <div
        className={cn(
          "mb-3 flex md:row-start-1 md:mb-0",
          contentOnRight
            ? "md:col-start-1 md:justify-end"
            : "md:col-start-2 md:justify-start",
        )}
      >
        {period ? (
          <span className="rounded-full bg-primary px-4 py-1.5 text-xs font-medium tracking-wide text-primary-foreground shadow-sm">
            {period}
          </span>
        ) : null}
      </div>

      <div
        className={cn(
          "md:row-start-1",
          contentOnRight
            ? "md:col-start-2 md:text-left"
            : "md:col-start-1 md:text-right",
        )}
      >
        <h3 className="text-base font-medium text-foreground">
          {experience.role}
        </h3>
        {subtitle ? (
          <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>
        ) : null}

        {expandable ? (
          <>
            <button
              type="button"
              aria-expanded={open}
              onClick={() => setOpen((current) => !current)}
              className="mt-2 rounded-full border border-border/60 px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-border hover:text-foreground"
            >
              {open ? "Show less" : "Show more"}
            </button>

            {open ? (
              <div
                className={cn(
                  "animate-in fade-in-0 slide-in-from-top-1 mt-3 rounded-xl border border-border/50 bg-card/60 p-5 text-left text-sm leading-relaxed text-muted-foreground shadow-sm duration-300",
                  richTextClass,
                )}
                // Konten ditulis sendiri lewat form admin, bukan input publik.
                dangerouslySetInnerHTML={{ __html: experience.description }}
              />
            ) : null}
          </>
        ) : null}
      </div>
    </li>
  );
}
