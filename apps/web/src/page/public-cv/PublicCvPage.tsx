import { AboutSection } from "@/features/profile-content/components/public/AboutSection";
import { ContactSection } from "@/features/profile-content/components/public/ContactSection";
import { ExperienceSection } from "@/features/profile-content/components/public/ExperienceSection";
import { HeroSection } from "@/features/profile-content/components/public/HeroSection";
import { ProfileFooter } from "@/features/profile-content/components/public/ProfileFooter";
import { ProjectsSection } from "@/features/profile-content/components/public/ProjectsSection";
import { SkillsSection } from "@/features/profile-content/components/public/SkillsSection";
import type { ProfileContent } from "@/features/profile-content/data/profile-content";

type PublicCvPageProps = {
  content: ProfileContent;
};

export function PublicCvPage({ content }: PublicCvPageProps) {
  return (
    <main>
      <HeroSection hero={content.hero} />
      <AboutSection about={content.about} />
      <SkillsSection skills={content.skills} />
      <ProjectsSection projects={content.projects} />
      <ExperienceSection experiences={content.experiences} />
      <ContactSection contact={content.contact} />
      <ProfileFooter
        footer={content.footer}
        socialLinks={content.socialLinks}
      />
    </main>
  );
}
