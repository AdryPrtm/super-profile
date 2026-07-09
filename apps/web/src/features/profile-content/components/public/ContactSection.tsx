import { Mail } from "lucide-react";

import type { ProfileContent } from "@/features/profile-content/data/profile-content";
import { toMailto } from "@/features/profile-content/utils/profile-links";

type ContactSectionProps = {
  contact: ProfileContent["contact"];
};

export function ContactSection({ contact }: ContactSectionProps) {
  return (
    <section id="contact" className="px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <p className="mb-6 text-sm font-medium uppercase tracking-widest text-muted-foreground">
          {contact.eyebrow}
        </p>
        <h2 className="text-3xl font-light tracking-tight sm:text-4xl">
          {contact.title}
        </h2>
        <p className="mx-auto mt-4 max-w-md text-muted-foreground">
          {contact.description}
        </p>
        <a
          href={toMailto(contact.email)}
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-foreground px-8 py-3 text-sm font-medium text-background transition-opacity hover:opacity-80"
        >
          <Mail className="h-4 w-4" />
          {contact.buttonLabel}
        </a>
      </div>
    </section>
  );
}
