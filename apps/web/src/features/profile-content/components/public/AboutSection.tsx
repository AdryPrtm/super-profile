import { MapPin } from "lucide-react";

import type { ProfileContent } from "@/features/profile-content/data/profile-content";

type AboutSectionProps = {
  about: ProfileContent["about"];
};

export function AboutSection({ about }: AboutSectionProps) {
  return (
    <section id="about" className="px-6 py-24">
      <div className="mx-auto max-w-2xl">
        <p className="mb-12 text-sm font-medium uppercase tracking-widest text-muted-foreground">
          {about.eyebrow}
        </p>

        <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
          {about.location ? (
            <p>
              <span className="inline-flex items-center gap-1 text-foreground">
                <MapPin className="h-4 w-4" />
                {about.location}
              </span>
            </p>
          ) : null}
          {about.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
