import { Github, Linkedin, Mail, Twitter } from "lucide-react";

import type { ProfileContent } from "@/features/profile-content/data/profile-content";

type ProfileFooterProps = {
  footer: ProfileContent["footer"];
  socialLinks: ProfileContent["socialLinks"];
};

export function ProfileFooter({ footer, socialLinks }: ProfileFooterProps) {
  const socialItems = [
    { href: socialLinks.github, label: "GitHub", Icon: Github },
    { href: socialLinks.linkedin, label: "LinkedIn", Icon: Linkedin },
    { href: socialLinks.twitter, label: "Twitter", Icon: Twitter },
    { href: socialLinks.email, label: "Email", Icon: Mail },
  ].filter((item) => item.href);

  return (
    <footer className="border-t border-border/50 px-6 py-12">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-6">
        <div className="flex items-center gap-6">
          {socialItems.map(({ href, label, Icon }) => (
            <a
              key={label}
              href={href}
              className="text-muted-foreground transition-colors hover:text-foreground"
              aria-label={label}
            >
              <Icon className="h-5 w-5" />
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
