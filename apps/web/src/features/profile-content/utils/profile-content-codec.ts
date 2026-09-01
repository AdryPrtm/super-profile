import {
  DEFAULT_PROFILE_CONTENT,
  type Experience,
  type ProfileContent,
  type Project,
  type Skill,
} from "@/features/profile-content/data/profile-content";
import { getText, splitLines } from "@/features/profile-content/utils/form-data";

function readEntry(value: FormDataEntryValue | undefined) {
  return typeof value === "string" ? value.trim() : "";
}

function parseSkills(formData: FormData): Skill[] {
  const names = formData.getAll("skillName");
  const categories = formData.getAll("skillCategory");
  const logos = formData.getAll("skillLogo");

  return names.flatMap((rawName, index) => {
    const name = readEntry(rawName);

    if (!name) {
      return [];
    }

    return [
      {
        name,
        category: readEntry(categories[index]),
        logo: readEntry(logos[index]),
      },
    ];
  });
}

function readJsonStringArray(value: FormDataEntryValue | undefined) {
  const raw = readEntry(value);

  if (!raw) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim())
      .filter(Boolean);
  } catch {
    return [];
  }
}

function parseProjects(formData: FormData): Project[] {
  const titles = formData.getAll("projectTitle");
  const descriptions = formData.getAll("projectDescription");
  const techStacks = formData.getAll("projectTech");
  const imageLists = formData.getAll("projectImages");

  return titles.flatMap((rawTitle, index) => {
    const title = readEntry(rawTitle);

    if (!title) {
      return [];
    }

    return [
      {
        title,
        description: readEntry(descriptions[index]),
        tech: readJsonStringArray(techStacks[index]),
        images: readJsonStringArray(imageLists[index]),
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
    skills: parseSkills(formData),
    projects: parseProjects(formData),
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

export function experiencesToText(experiences: Experience[]) {
  return experiences
    .map(
      (experience) =>
        `${experience.period} | ${experience.role} | ${experience.company} | ${experience.description}`,
    )
    .join("\n");
}
