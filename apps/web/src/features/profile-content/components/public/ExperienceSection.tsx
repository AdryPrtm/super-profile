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
        <h2 className="portfolio-heading mb-12">Experience<span className="text-[var(--portfolio-accent)]">.</span></h2>
        <ol className="border-t border-[var(--portfolio-border)]">
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
