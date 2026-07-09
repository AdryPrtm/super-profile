import prisma from "@super-profile-dry/db";
import type { Prisma } from "@super-profile-dry/db";

export type Skill = {
  name: string;
  category: string;
};

export type Project = {
  title: string;
  description: string;
  tags: string[];
  link: string;
};

export type Experience = {
  role: string;
  company: string;
  period: string;
  description: string;
};

export type ProfileContent = {
  hero: {
    initials: string;
    name: string;
    headline: string;
    summary: string;
    primaryCtaLabel: string;
    secondaryCtaLabel: string;
  };
  about: {
    eyebrow: string;
    location: string;
    paragraphs: string[];
  };
  skills: Skill[];
  projects: Project[];
  experiences: Experience[];
  contact: {
    eyebrow: string;
    title: string;
    description: string;
    email: string;
    buttonLabel: string;
  };
  socialLinks: {
    github: string;
    linkedin: string;
    twitter: string;
    email: string;
  };
  footer: {
    copyrightName: string;
  };
};

export const DEFAULT_PROFILE_CONTENT: ProfileContent = {
  hero: {
    initials: "AP",
    name: "Your Name",
    headline: "Software Engineer & Creative Developer",
    summary:
      "Crafting elegant digital experiences with clean code and thoughtful design. Passionate about building products that make a difference.",
    primaryCtaLabel: "View Projects",
    secondaryCtaLabel: "Get in Touch",
  },
  about: {
    eyebrow: "About",
    location: "Jakarta, Indonesia",
    paragraphs: [
      "I specialize in building modern web applications with a focus on user experience and performance.",
      "With a background in both design and engineering, I bridge the gap between visual aesthetics and technical implementation.",
      "When I am not coding, I explore new technologies, contribute to open-source, or enjoy a good cup of coffee.",
    ],
  },
  skills: [
    { name: "React", category: "Frontend" },
    { name: "Next.js", category: "Frontend" },
    { name: "TypeScript", category: "Language" },
    { name: "Node.js", category: "Backend" },
    { name: "PostgreSQL", category: "Database" },
    { name: "Tailwind CSS", category: "Styling" },
    { name: "Prisma", category: "ORM" },
    { name: "Docker", category: "DevOps" },
  ],
  projects: [
    {
      title: "Project Alpha",
      description:
        "A modern web application built with Next.js and TypeScript. Features real-time collaboration and responsive design.",
      tags: ["Next.js", "TypeScript", "PostgreSQL"],
      link: "#",
    },
    {
      title: "Project Beta",
      description:
        "REST API service with authentication, rate limiting, and comprehensive documentation.",
      tags: ["Node.js", "Express", "Redis"],
      link: "#",
    },
    {
      title: "Project Gamma",
      description:
        "Mobile-first dashboard with data visualization, analytics tracking, and export capabilities.",
      tags: ["React", "D3.js", "Tailwind"],
      link: "#",
    },
  ],
  experiences: [
    {
      role: "Senior Software Engineer",
      company: "Company Name",
      period: "2024 - Present",
      description:
        "Leading frontend architecture and implementing design systems for scalable applications.",
    },
    {
      role: "Software Engineer",
      company: "Previous Company",
      period: "2022 - 2024",
      description:
        "Built and maintained full-stack features, focusing on performance optimization and code quality.",
    },
    {
      role: "Junior Developer",
      company: "First Company",
      period: "2020 - 2022",
      description:
        "Developed responsive web interfaces and contributed to open-source projects.",
    },
  ],
  contact: {
    eyebrow: "Get in Touch",
    title: "Let's work together",
    description:
      "I am always open to discussing new projects, creative ideas, or opportunities to be part of your vision.",
    email: "hello@example.com",
    buttonLabel: "Say Hello",
  },
  socialLinks: {
    github: "#",
    linkedin: "#",
    twitter: "#",
    email: "mailto:hello@example.com",
  },
  footer: {
    copyrightName: "Your Name",
  },
};

const PROFILE_CONTENT_ID = "main";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readString(value: unknown, fallback: string) {
  return typeof value === "string" ? value : fallback;
}

function readParagraphs(value: unknown, fallback: string[]) {
  if (!Array.isArray(value)) {
    return fallback;
  }

  return value.filter((item): item is string => typeof item === "string");
}

function readSkills(value: unknown, fallback: Skill[]) {
  if (!Array.isArray(value)) {
    return fallback;
  }

  return value.flatMap((item) => {
    if (!isRecord(item)) {
      return [];
    }

    const name = readString(item.name, "").trim();
    if (!name) {
      return [];
    }

    return [
      {
        name,
        category: readString(item.category, "").trim(),
      },
    ];
  });
}

function readProjects(value: unknown, fallback: Project[]) {
  if (!Array.isArray(value)) {
    return fallback;
  }

  return value.flatMap((item) => {
    if (!isRecord(item)) {
      return [];
    }

    const title = readString(item.title, "").trim();
    if (!title) {
      return [];
    }

    const tags = Array.isArray(item.tags)
      ? item.tags.filter((tag): tag is string => typeof tag === "string")
      : [];

    return [
      {
        title,
        description: readString(item.description, "").trim(),
        tags,
        link: readString(item.link, "#").trim() || "#",
      },
    ];
  });
}

function readExperiences(value: unknown, fallback: Experience[]) {
  if (!Array.isArray(value)) {
    return fallback;
  }

  return value.flatMap((item) => {
    if (!isRecord(item)) {
      return [];
    }

    const role = readString(item.role, "").trim();
    if (!role) {
      return [];
    }

    return [
      {
        role,
        company: readString(item.company, "").trim(),
        period: readString(item.period, "").trim(),
        description: readString(item.description, "").trim(),
      },
    ];
  });
}

export function normalizeProfileContent(value: unknown): ProfileContent {
  const source = isRecord(value) ? value : {};
  const hero = isRecord(source.hero) ? source.hero : {};
  const about = isRecord(source.about) ? source.about : {};
  const contact = isRecord(source.contact) ? source.contact : {};
  const socialLinks = isRecord(source.socialLinks) ? source.socialLinks : {};
  const footer = isRecord(source.footer) ? source.footer : {};

  return {
    hero: {
      initials: readString(
        hero.initials,
        DEFAULT_PROFILE_CONTENT.hero.initials,
      ),
      name: readString(hero.name, DEFAULT_PROFILE_CONTENT.hero.name),
      headline: readString(
        hero.headline,
        DEFAULT_PROFILE_CONTENT.hero.headline,
      ),
      summary: readString(hero.summary, DEFAULT_PROFILE_CONTENT.hero.summary),
      primaryCtaLabel: readString(
        hero.primaryCtaLabel,
        DEFAULT_PROFILE_CONTENT.hero.primaryCtaLabel,
      ),
      secondaryCtaLabel: readString(
        hero.secondaryCtaLabel,
        DEFAULT_PROFILE_CONTENT.hero.secondaryCtaLabel,
      ),
    },
    about: {
      eyebrow: readString(about.eyebrow, DEFAULT_PROFILE_CONTENT.about.eyebrow),
      location: readString(
        about.location,
        DEFAULT_PROFILE_CONTENT.about.location,
      ),
      paragraphs: readParagraphs(
        about.paragraphs,
        DEFAULT_PROFILE_CONTENT.about.paragraphs,
      ),
    },
    skills: readSkills(source.skills, DEFAULT_PROFILE_CONTENT.skills),
    projects: readProjects(source.projects, DEFAULT_PROFILE_CONTENT.projects),
    experiences: readExperiences(
      source.experiences,
      DEFAULT_PROFILE_CONTENT.experiences,
    ),
    contact: {
      eyebrow: readString(
        contact.eyebrow,
        DEFAULT_PROFILE_CONTENT.contact.eyebrow,
      ),
      title: readString(contact.title, DEFAULT_PROFILE_CONTENT.contact.title),
      description: readString(
        contact.description,
        DEFAULT_PROFILE_CONTENT.contact.description,
      ),
      email: readString(contact.email, DEFAULT_PROFILE_CONTENT.contact.email),
      buttonLabel: readString(
        contact.buttonLabel,
        DEFAULT_PROFILE_CONTENT.contact.buttonLabel,
      ),
    },
    socialLinks: {
      github: readString(
        socialLinks.github,
        DEFAULT_PROFILE_CONTENT.socialLinks.github,
      ),
      linkedin: readString(
        socialLinks.linkedin,
        DEFAULT_PROFILE_CONTENT.socialLinks.linkedin,
      ),
      twitter: readString(
        socialLinks.twitter,
        DEFAULT_PROFILE_CONTENT.socialLinks.twitter,
      ),
      email: readString(
        socialLinks.email,
        DEFAULT_PROFILE_CONTENT.socialLinks.email,
      ),
    },
    footer: {
      copyrightName: readString(
        footer.copyrightName,
        DEFAULT_PROFILE_CONTENT.footer.copyrightName,
      ),
    },
  };
}

export async function getProfileContent() {
  try {
    const record = await prisma.profileContent.findUnique({
      where: { id: PROFILE_CONTENT_ID },
    });

    return normalizeProfileContent(record?.data);
  } catch (error) {
    console.error("Failed to load profile content", error);
    return DEFAULT_PROFILE_CONTENT;
  }
}

export async function saveProfileContent(content: ProfileContent) {
  await prisma.profileContent.upsert({
    where: { id: PROFILE_CONTENT_ID },
    update: {
      data: content as unknown as Prisma.InputJsonValue,
    },
    create: {
      id: PROFILE_CONTENT_ID,
      data: content as unknown as Prisma.InputJsonValue,
    },
  });
}
