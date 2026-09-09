import { SocialIcon } from "@/features/profile-content/components/SocialIcon";
import type { ProfileContent } from "@/features/profile-content/data/profile-content";

type ProfileFooterProps = {
  footer: ProfileContent["footer"];
  socials: ProfileContent["socials"];
};

export function ProfileFooter({ footer, socials }: ProfileFooterProps) {
  const socialItems = socials.filter((social) => social.url.trim());

  return (
    <footer className="border-t border-border/50 px-6 py-12">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-6">
        <div className="flex items-center gap-6">
          {socialItems.map((social, index) => (
            <a
              key={`${social.url}-${index}`}
              href={social.url}
              className="text-muted-foreground transition-colors hover:text-foreground"
              aria-label={social.label || "Social link"}
            >
              <SocialIcon icon={social.icon} label={social.label} />
            </a>
          ))}
        </div>
        <p className="text-xs text-muted-foreground/60">
          Copyright {new Date().getFullYear()} {footer.copyrightName}. All
          rights reserved.
        </p>
      </div>
    </footer>
  );
}
