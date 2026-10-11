import { SocialIcon } from "@/features/profile-content/components/SocialIcon";
import type { ProfileContent } from "@/features/profile-content/data/profile-content";

type ProfileFooterProps = {
  footer: ProfileContent["footer"];
  socials: ProfileContent["socials"];
};

export function ProfileFooter({ footer, socials }: ProfileFooterProps) {
  const socialItems = socials.filter((social) => social.url.trim());

  return (
    <footer className="px-5 py-10 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold tracking-tight">SUPER<span className="text-[var(--portfolio-accent)]">/</span>PROFILE</p>
          <p className="mt-2 text-xs text-[var(--portfolio-muted)]">© {new Date().getFullYear()} {footer.copyrightName}. All rights reserved.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {socialItems.map((social, index) => (
            <a
              key={`${social.url}-${index}`}
              href={social.url}
              className="flex h-11 w-11 items-center justify-center border border-[var(--portfolio-border)] text-[var(--portfolio-muted)] transition-colors hover:border-[var(--portfolio-accent)] hover:text-[var(--portfolio-accent)]"
              aria-label={social.label || "Social link"}
            >
              <SocialIcon icon={social.icon} label={social.label} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
