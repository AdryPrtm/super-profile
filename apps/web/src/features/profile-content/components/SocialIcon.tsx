import {
  AtSign,
  Dribbble,
  Facebook,
  Figma,
  Github,
  Gitlab,
  Globe,
  Instagram,
  Link,
  Linkedin,
  type LucideIcon,
  Mail,
  MessageCircle,
  Music,
  Palette,
  Phone,
  Send,
  Twitch,
  Twitter,
  Youtube,
} from "lucide-react";

import { SkillLogo } from "@/features/profile-content/components/SkillLogo";
import { cn } from "@/lib/utils";

/**
 * Pilihan ikon bawaan untuk social link. Field `icon` menyimpan salah satu
 * value di sini, atau URL gambar kalau platformnya belum ada di daftar.
 */
export const SOCIAL_ICON_PRESETS: {
  value: string;
  label: string;
  Icon: LucideIcon;
}[] = [
  { value: "github", label: "GitHub", Icon: Github },
  { value: "linkedin", label: "LinkedIn", Icon: Linkedin },
  { value: "instagram", label: "Instagram", Icon: Instagram },
  { value: "x", label: "X (Twitter)", Icon: Twitter },
  { value: "facebook", label: "Facebook", Icon: Facebook },
  { value: "youtube", label: "YouTube", Icon: Youtube },
  { value: "tiktok", label: "TikTok", Icon: Music },
  { value: "threads", label: "Threads", Icon: AtSign },
  { value: "whatsapp", label: "WhatsApp", Icon: MessageCircle },
  { value: "telegram", label: "Telegram", Icon: Send },
  { value: "dribbble", label: "Dribbble", Icon: Dribbble },
  { value: "behance", label: "Behance", Icon: Palette },
  { value: "figma", label: "Figma", Icon: Figma },
  { value: "gitlab", label: "GitLab", Icon: Gitlab },
  { value: "twitch", label: "Twitch", Icon: Twitch },
  { value: "email", label: "Email", Icon: Mail },
  { value: "phone", label: "Telepon", Icon: Phone },
  { value: "website", label: "Website", Icon: Globe },
  { value: "link", label: "Link lain", Icon: Link },
];

export const SOCIAL_ICON_OPTIONS = SOCIAL_ICON_PRESETS.map(
  ({ value, label }) => ({ value, label }),
);

const ICON_BY_VALUE = new Map(
  SOCIAL_ICON_PRESETS.map((preset) => [preset.value, preset.Icon]),
);

// Nama key dari data lama yang sudah tidak dipakai lagi di daftar preset.
const ICON_ALIASES: Record<string, string> = {
  twitter: "x",
  mail: "email",
};

export function isCustomSocialIcon(icon: string) {
  return /^https?:\/\//i.test(icon.trim());
}

export function resolveSocialIconValue(icon: string) {
  const value = icon.trim().toLowerCase();
  return ICON_ALIASES[value] ?? value;
}

type SocialIconProps = {
  icon: string;
  label: string;
  className?: string;
};

export function SocialIcon({ icon, label, className }: SocialIconProps) {
  const value = icon.trim();

  if (isCustomSocialIcon(value)) {
    return (
      <SkillLogo src={value} name={label} className={cn("h-5 w-5", className)} />
    );
  }

  const Icon = ICON_BY_VALUE.get(resolveSocialIconValue(value)) ?? Link;

  return <Icon className={cn("h-5 w-5", className)} aria-hidden="true" />;
}
