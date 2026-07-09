import {
  DEFAULT_PROFILE_CONTENT,
  type Experience,
  type ProfileContent,
  type Project,
  type Skill,
} from "@/features/profile-content/data/profile-content";
import { getText, splitLines } from "@/features/profile-content/utils/form-data";

function parseSkills(value: string): Skill[] {
  return splitLines(value).flatMap((line) => {
    const [name = "", category = ""] = line.split("|").map((part) => part.trim());

    if (!name) {
      return [];
    }

    return [{ name, category }];
  });
}

function parseProjects(value: string): Project[] {
  return splitLines(value).flatMap((line) => {
    const [title = "", description = "", tags = "", link = "#"] = line
      .split("|")
      .map((part) => part.trim());

    if (!title) {
      return [];
    }

    return [
      {
        title,
        description,
        tags: tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        link: link || "#",
      },
    ];
  });
}

function parseExperiences(value: string): Experience[] {
  return splitLines(value).flatMap((line) => {
    const [period = "", role = "", company = "", description = ""] = line
      .split("|")
      .map((part) => part.trim());

    if (!role) {
      return [];
    }

    return [{ period, role, company, description }];
  });
}

export function buildProfileContentFromFormData(formData: FormData) {
  const fallback = DEFAULT_PROFILE_CONTENT;
  const aboutParagraphs = splitLines(getText(formData, "aboutParagraphs", ""));

  return {
    hero: {
      initials: getText(formData, "heroInitials", fallback.hero.initials),
      name: getText(formData, "heroName", fallback.hero.name),
      headline: getText(formData, "heroHeadline", fallback.hero.headline),
      summary: getText(formData, "heroSummary", fallback.hero.summary),
      primaryCtaLabel: getText(
        formData,
        "heroPrimaryCtaLabel",
        fallback.hero.primaryCtaLabel,
      ),
      secondaryCtaLabel: getText(
        formData,
        "heroSecondaryCtaLabel",
        fallback.hero.secondaryCtaLabel,
      ),
    },
    about: {
      eyebrow: getText(formData, "aboutEyebrow", fallback.about.eyebrow),
      location: getText(formData, "aboutLocation", fallback.about.location),
      paragraphs:
        aboutParagraphs.length > 0 ? aboutParagraphs : fallback.about.paragraphs,
    },
    skills: parseSkills(getText(formData, "skills", "")),
    projects: parseProjects(getText(formData, "projects", "")),
    experiences: parseExperiences(getText(formData, "experiences", "")),
    contact: {
      eyebrow: getText(formData, "contactEyebrow", fallback.contact.eyebrow),
      title: getText(formData, "contactTitle", fallback.contact.title),
      description: getText(
        formData,
        "contactDescription",
        fallback.contact.description,
      ),
      email: getText(formData, "contactEmail", fallback.contact.email),
      buttonLabel: getText(
        formData,
        "contactButtonLabel",
        fallback.contact.buttonLabel,
      ),
    },
    socialLinks: {
      github: getText(formData, "socialGithub", fallback.socialLinks.github),
      linkedin: getText(
        formData,
        "socialLinkedin",
        fallback.socialLinks.linkedin,
      ),
      twitter: getText(formData, "socialTwitter", fallback.socialLinks.twitter),
      email: getText(formData, "socialEmail", fallback.socialLinks.email),
    },
    footer: {
      copyrightName: getText(
        formData,
        "footerCopyrightName",
        fallback.footer.copyrightName,
      ),
    },
  } satisfies ProfileContent;
}

export function skillsToText(skills: Skill[]) {
  return skills.map((skill) => `${skill.name} | ${skill.category}`).join("\n");
}

export function projectsToText(projects: Project[]) {
  return projects
    .map(
      (project) =>
        `${project.title} | ${project.description} | ${project.tags.join(", ")} | ${project.link}`,
    )
    .join("\n");
}

export function experiencesToText(experiences: Experience[]) {
  return experiences
    .map(
      (experience) =>
        `${experience.period} | ${experience.role} | ${experience.company} | ${experience.description}`,
    )
    .join("\n");
}
