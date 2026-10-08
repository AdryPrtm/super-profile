import { ProjectCard } from "@/features/profile-content/components/public/ProjectCard";
import type { Project } from "@/features/profile-content/data/profile-content";

type ProjectsSectionProps = {
  projects: Project[];
};

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  return (
    <section id="projects" className="portfolio-section">
      <div className="portfolio-shell py-20 sm:py-28">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="portfolio-label mb-5 text-[var(--portfolio-accent)]">04 / Work</p>
            <h2 className="portfolio-heading">Selected projects<span className="text-[var(--portfolio-accent)]">.</span></h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-[var(--portfolio-muted)]">A closer look at the ideas, systems, and details behind the work.</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {projects.map((project, index) => (
            <ProjectCard key={`${project.title}-${index}`} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
