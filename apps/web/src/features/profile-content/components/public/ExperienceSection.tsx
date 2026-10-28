import { ExperienceCard } from "@/features/profile-content/components/public/ExperienceCard";
import type { Experience } from "@/features/profile-content/data/profile-content";

type ExperienceSectionProps = {
  experiences: Experience[];
};

export function ExperienceSection({ experiences }: ExperienceSectionProps) {
  return (
    <section id="experience" className="portfolio-section bg-[var(--portfolio-surface)]">
      <div className="portfolio-shell py-20 sm:py-28">
        <p className="portfolio-label mb-5 text-[var(--portfolio-accent)]">05 / Journey</p>
        <h2 className="portfolio-heading mb-4">Experience<span className="text-[var(--portfolio-accent)]">.</span></h2>
        <p className="mb-12 max-w-xl text-sm leading-relaxed text-[var(--portfolio-muted)] sm:text-base">A path through the roles and projects that shaped where I am today.</p>
        <ol className="ml-3 border-l-2 border-[var(--portfolio-accent)] sm:ml-4">
          {experiences.map((experience, index) => (
            <ExperienceCard
              key={`${experience.role}-${index}`}
              experience={experience}
              index={index}
            />
          ))}
        </ol>
      </div>
    </section>
  );
}
