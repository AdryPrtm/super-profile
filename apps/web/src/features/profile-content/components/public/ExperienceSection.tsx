import { ExperienceCard } from "@/features/profile-content/components/public/ExperienceCard";
import type { Experience } from "@/features/profile-content/data/profile-content";

type ExperienceSectionProps = {
  experiences: Experience[];
};

export function ExperienceSection({ experiences }: ExperienceSectionProps) {
  return (
    <section id="experience" className="px-6 py-24">
      <div className="mx-auto max-w-4xl">
        <p className="mb-12 text-center text-sm font-medium uppercase tracking-widest text-muted-foreground">
          Experience
        </p>

        <div className="relative">
          {/* Garis timeline: di kiri pada mobile, di tengah mulai breakpoint md. */}
          <span
            aria-hidden
            className="absolute left-4 top-2 h-[calc(100%-1rem)] w-px -translate-x-1/2 bg-border/70 md:left-1/2"
          />

          <ol className="space-y-12">
            {experiences.map((experience, index) => (
              <ExperienceCard
                key={`${experience.role}-${index}`}
                experience={experience}
                index={index}
              />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
