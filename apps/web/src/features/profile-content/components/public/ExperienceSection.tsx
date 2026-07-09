import type { Experience } from "@/features/profile-content/data/profile-content";

type ExperienceSectionProps = {
  experiences: Experience[];
};

export function ExperienceSection({ experiences }: ExperienceSectionProps) {
  return (
    <section id="experience" className="px-6 py-24">
      <div className="mx-auto max-w-2xl">
        <p className="mb-12 text-sm font-medium uppercase tracking-widest text-muted-foreground">
          Experience
        </p>

        <div className="space-y-8">
          {experiences.map((experience) => (
            <div
              key={`${experience.period}-${experience.role}-${experience.company}`}
              className="group relative border-l-2 border-border/50 pl-6 transition-colors hover:border-foreground/30"
            >
              <div className="absolute -left-[5px] top-1 h-2 w-2 rounded-full bg-border transition-colors group-hover:bg-foreground/50" />
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {experience.period}
              </p>
              <h3 className="mt-1 text-base font-medium">
                {experience.role}
              </h3>
              <p className="text-sm text-muted-foreground">
                {experience.company}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground/80">
                {experience.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
