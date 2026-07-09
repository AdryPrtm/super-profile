import type { Skill } from "@/features/profile-content/data/profile-content";

type SkillsSectionProps = {
  skills: Skill[];
};

export function SkillsSection({ skills }: SkillsSectionProps) {
  return (
    <section id="skills" className="px-6 py-24">
      <div className="mx-auto max-w-2xl">
        <p className="mb-12 text-sm font-medium uppercase tracking-widest text-muted-foreground">
          Skills & Technologies
        </p>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {skills.map((skill) => (
            <div
              key={`${skill.name}-${skill.category}`}
              className="group rounded-xl border border-border/50 p-4 transition-all duration-300 hover:border-border hover:bg-accent/50"
            >
              <p className="text-sm font-medium">{skill.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {skill.category}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
