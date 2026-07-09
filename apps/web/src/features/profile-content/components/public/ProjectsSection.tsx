import { ExternalLink } from "lucide-react";

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
          {projects.map((project) => (
            <a
              key={`${project.title}-${project.link}`}
              href={project.link}
              className="group block rounded-2xl border border-border/50 p-6 transition-all duration-300 hover:border-border hover:bg-accent/30"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-3">
                  <h3 className="text-lg font-medium group-hover:text-foreground">
                    {project.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-accent/80 px-2.5 py-0.5 text-xs text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground/50 transition-all group-hover:text-foreground" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
