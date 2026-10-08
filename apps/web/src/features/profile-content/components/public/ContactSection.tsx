import { ArrowUpRight, Mail } from "lucide-react";

import type { ProfileContent } from "@/features/profile-content/data/profile-content";
import { toMailto } from "@/features/profile-content/utils/profile-links";

type ContactSectionProps = {
  contact: ProfileContent["contact"];
};

export function ContactSection({ contact }: ContactSectionProps) {
  return (
    <section id="contact" className="portfolio-section px-5 py-16 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-6xl bg-[#1d4ed8] px-6 py-12 text-white sm:px-12 sm:py-16">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <p className="portfolio-label text-blue-100">06 / {contact.eyebrow}</p>
          <ArrowUpRight aria-hidden="true" className="h-7 w-7" />
        </div>
        <h2 className="mt-14 max-w-4xl text-[clamp(3rem,7vw,6.5rem)] font-bold leading-[0.98] tracking-[-0.075em]">{contact.title}</h2>
        <div className="mt-10 flex flex-wrap items-end justify-between gap-8 border-t border-white/40 pt-7">
          <p className="max-w-lg text-base leading-relaxed text-blue-50">{contact.description}</p>
          <a href={toMailto(contact.email)} className="inline-flex min-h-12 items-center gap-3 bg-white px-5 py-3 text-sm font-bold text-[#143caa] transition-colors hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
            <Mail aria-hidden="true" className="h-4 w-4" />
            {contact.buttonLabel}
          </a>
        </div>
      </div>
    </section>
  );
}
