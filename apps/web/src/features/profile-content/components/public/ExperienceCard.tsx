"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

import type { Experience } from "@/features/profile-content/data/profile-content";
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

  const heading = (
    <span
      className={cn(
        "flex flex-wrap items-baseline gap-x-2 gap-y-1",
        contentOnRight ? "md:justify-start" : "md:justify-end",
      )}
    >
      <span className="text-base font-medium text-foreground">
        {experience.role}
      </span>
      {experience.company ? (
        <span className="text-sm text-muted-foreground">
          {experience.company}
        </span>
      ) : null}
      {expandable ? (
        <ChevronDown
          aria-hidden
          className={cn(
            "h-4 w-4 shrink-0 self-center text-muted-foreground transition-transform duration-300",
            open && "rotate-180",
          )}
        />
      ) : null}
    </span>
  );

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
        <span className="rounded-full bg-primary px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-primary-foreground shadow-sm">
          {experience.period}
        </span>
      </div>

      <div
        className={cn(
          "md:row-start-1",
          contentOnRight
            ? "md:col-start-2 md:text-left"
            : "md:col-start-1 md:text-right",
        )}
      >
        {expandable ? (
          <button
            type="button"
            aria-expanded={open}
            onClick={() => setOpen((current) => !current)}
            className={cn(
              "block w-full text-left transition-opacity hover:opacity-80",
              contentOnRight ? "md:text-left" : "md:text-right",
            )}
          >
            {heading}
          </button>
        ) : (
          heading
        )}

        {expandable && open ? (
          <div className="animate-in fade-in-0 slide-in-from-top-1 mt-3 rounded-xl border border-border/50 bg-card/60 p-5 shadow-sm duration-300">
            <p className="text-sm leading-relaxed text-muted-foreground">
              {experience.description}
            </p>
          </div>
        ) : null}
      </div>
    </li>
  );
}
