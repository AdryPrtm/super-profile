import { MapPin } from "lucide-react";

import type { ProfileContent } from "@/features/profile-content/data/profile-content";

type AboutSectionProps = {
  about: ProfileContent["about"];
};

export function AboutSection({ about }: AboutSectionProps) {
  return (
    <section id="about" className="portfolio-section">
      <div className="portfolio-shell grid gap-10 py-20 sm:py-28 md:grid-cols-[minmax(0,0.65fr)_minmax(0,1fr)] md:gap-16">
        <div>
          <p className="portfolio-label mb-6 text-[var(--portfolio-accent)]">02 / {about.eyebrow}</p>
          <h2 className="portfolio-heading">A little<br />about me<span className="text-[var(--portfolio-accent)]">.</span></h2>
          {about.location ? (
            <p className="mt-8 inline-flex items-center gap-2 text-sm text-[var(--portfolio-muted)]">
              <MapPin aria-hidden="true" className="h-4 w-4" />
              {about.location}
            </p>
          ) : null}
        </div>
        <div className="space-y-6 border-l-2 border-[var(--portfolio-accent)] pl-6 text-lg leading-relaxed text-[var(--portfolio-muted)] sm:pl-9 sm:text-xl">
          {about.paragraphs.map((paragraph, index) => (
            <p key={`${index}-${paragraph}`}>{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
