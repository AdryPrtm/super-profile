import { SkillLogo } from "@/features/profile-content/components/SkillLogo";
import type { Skill } from "@/features/profile-content/data/profile-content";

type SkillsSectionProps = {
  skills: Skill[];
};

export function SkillsSection({ skills }: SkillsSectionProps) {
  const categories = Array.from(new Set(skills.map((skill) => skill.category || "Other")));

  return (
    <section id="skills" className="portfolio-section bg-[var(--portfolio-surface)]">
      <div className="portfolio-shell py-20 sm:py-28">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="portfolio-label mb-5 text-[var(--portfolio-accent)]">03 / Capabilities</p>
            <h2 className="portfolio-heading">Tools of the trade<span className="text-[var(--portfolio-accent)]">.</span></h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-[var(--portfolio-muted)]">A practical toolkit built around thoughtful digital products.</p>
        </div>
        <div className="grid border-l border-t border-[var(--portfolio-border)] sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <div key={category} className="min-h-44 border-b border-r border-[var(--portfolio-border)] bg-[var(--portfolio-background)] p-5 sm:p-6">
              <p className="portfolio-label mb-7 text-[var(--portfolio-accent)]">{category}</p>
              <ul className="space-y-4">
                {skills.filter((skill) => (skill.category || "Other") === category).map((skill) => (
                  <li key={`${skill.name}-${skill.category}`} className="flex items-center gap-3 text-sm font-semibold">
                    <SkillLogo src={skill.logo} name={skill.name} className="h-6 w-6 shrink-0" />
                    <span>{skill.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
