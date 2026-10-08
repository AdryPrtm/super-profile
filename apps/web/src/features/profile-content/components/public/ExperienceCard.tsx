"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";

import type { Experience } from "@/features/profile-content/data/profile-content";
import { formatExperiencePeriod } from "@/features/profile-content/utils/experience-period";
import { richTextClass } from "@/features/profile-content/utils/rich-text";

type ExperienceCardProps = {
  experience: Experience;
  index: number;
};

export function ExperienceCard({ experience, index }: ExperienceCardProps) {
  const [open, setOpen] = useState(false);

  const expandable = Boolean(experience.description);
  const period = formatExperiencePeriod(experience);
  const subtitle = [experience.company, experience.locationType]
    .filter(Boolean)
    .join(" · ");

  return (
    <li className="grid gap-4 border-b border-[var(--portfolio-border)] py-7 sm:grid-cols-[minmax(0,0.35fr)_minmax(0,1fr)] sm:gap-10 sm:py-9">
      <div className="flex items-start gap-3">
        <span className="portfolio-label text-[var(--portfolio-accent)]">{String(index + 1).padStart(2, "0")}</span>
        {period ? <span className="text-sm text-[var(--portfolio-muted)]">{period}</span> : null}
      </div>
      <div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold tracking-tight sm:text-2xl">{experience.role}</h3>
            {subtitle ? <p className="mt-2 text-sm text-[var(--portfolio-muted)]">{subtitle}</p> : null}
          </div>
          <ArrowUpRight aria-hidden="true" className="h-5 w-5 shrink-0 text-[var(--portfolio-accent)]" />
        </div>
        {expandable ? (
          <>
            <button type="button" aria-expanded={open} onClick={() => setOpen((current) => !current)} className="mt-5 inline-flex min-h-11 cursor-pointer items-center border-b border-[var(--portfolio-foreground)] text-xs font-bold uppercase tracking-[0.12em] hover:text-[var(--portfolio-accent)]">
              {open ? "Show less" : "View details"}
            </button>
            {open ? (
              <div id={`experience-details-${index}`} className={`mt-5 max-w-2xl border-l-2 border-[var(--portfolio-accent)] pl-5 text-sm leading-relaxed text-[var(--portfolio-muted)] ${richTextClass}`} dangerouslySetInnerHTML={{ __html: experience.description }} />
            ) : null}
          </>
        ) : null}
      </div>
    </li>
  );
}
