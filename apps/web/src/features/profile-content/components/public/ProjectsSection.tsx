import { ProjectCard } from "@/features/profile-content/components/public/ProjectCard";
import type { Project } from "@/features/profile-content/data/profile-content";

type ProjectsSectionProps = {
  projects: Project[];
};

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  return (
    <section id="projects" className="px-6 py-24">
      <div className="mx-auto max-w-2xl">
        <p className="mb-12 text-sm font-medium uppercase tracking-widest text-muted-foreground">
          Selected Projects
        </p>

        <div className="space-y-6">
          {projects.map((project, index) => (
            <ProjectCard key={`${project.title}-${index}`} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
