import { Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { saveAdminProfileContent } from "@/features/profile-content/actions/save-profile-content-action";
import { AdminFormSection } from "@/features/profile-content/components/admin/AdminFormSection";
import { ExperiencesEditor } from "@/features/profile-content/components/admin/ExperiencesEditor";
import { ProfileField } from "@/features/profile-content/components/admin/ProfileField";
import { ProfileTextareaField } from "@/features/profile-content/components/admin/ProfileTextareaField";
import { SkillsAndProjectsEditor } from "@/features/profile-content/components/admin/SkillsAndProjectsEditor";
import { SocialsEditor } from "@/features/profile-content/components/admin/SocialsEditor";
import type { ProfileContent } from "@/features/profile-content/data/profile-content";

type AdminProfileFormProps = {
  content: ProfileContent;
};

export function AdminProfileForm({ content }: AdminProfileFormProps) {
  return (
    <form action={saveAdminProfileContent} className="space-y-6">
      <AdminFormSection title="Hero">
        <div className="grid gap-4 sm:grid-cols-2">
          <ProfileField
            label="Initials"
            name="heroInitials"
            defaultValue={content.hero.initials}
          />
          <ProfileField
            label="Name"
            name="heroName"
            defaultValue={content.hero.name}
          />
        </div>
        <ProfileField
          label="Headline"
          name="heroHeadline"
          defaultValue={content.hero.headline}
        />
        <ProfileTextareaField
          label="Summary"
          name="heroSummary"
          defaultValue={content.hero.summary}
          rows={4}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <ProfileField
            label="Primary CTA Label"
            name="heroPrimaryCtaLabel"
            defaultValue={content.hero.primaryCtaLabel}
          />
          <ProfileField
            label="Secondary CTA Label"
            name="heroSecondaryCtaLabel"
            defaultValue={content.hero.secondaryCtaLabel}
          />
        </div>
      </AdminFormSection>

      <AdminFormSection title="About">
        <div className="grid gap-4 sm:grid-cols-2">
          <ProfileField
            label="Section Label"
            name="aboutEyebrow"
            defaultValue={content.about.eyebrow}
          />
          <ProfileField
            label="Location"
            name="aboutLocation"
            defaultValue={content.about.location}
          />
        </div>
        <ProfileTextareaField
          label="Paragraphs"
          name="aboutParagraphs"
          defaultValue={content.about.paragraphs.join("\n")}
          placeholder="One paragraph per line"
          rows={6}
        />
      </AdminFormSection>

      <SkillsAndProjectsEditor
        skills={content.skills}
        projects={content.projects}
      />

      <ExperiencesEditor experiences={content.experiences} />

      <AdminFormSection title="Contact">
        <div className="grid gap-4 sm:grid-cols-2">
          <ProfileField
            label="Section Label"
            name="contactEyebrow"
            defaultValue={content.contact.eyebrow}
          />
          <ProfileField
            label="Title"
            name="contactTitle"
            defaultValue={content.contact.title}
          />
        </div>
        <ProfileTextareaField
          label="Description"
          name="contactDescription"
          defaultValue={content.contact.description}
          rows={4}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <ProfileField
            label="Email"
            name="contactEmail"
            type="email"
            defaultValue={content.contact.email}
          />
          <ProfileField
            label="Button Label"
            name="contactButtonLabel"
            defaultValue={content.contact.buttonLabel}
          />
        </div>
      </AdminFormSection>

      <SocialsEditor socials={content.socials} />

      <AdminFormSection title="Footer">
        <ProfileField
          label="Copyright Name"
          name="footerCopyrightName"
          defaultValue={content.footer.copyrightName}
        />
      </AdminFormSection>

      <div className="sticky bottom-0 flex justify-end border-t border-border/60 bg-background/95 py-4 backdrop-blur">
        <Button type="submit" size="lg">
          <Save className="h-4 w-4" />
          Save Content
        </Button>
      </div>
    </form>
  );
}
