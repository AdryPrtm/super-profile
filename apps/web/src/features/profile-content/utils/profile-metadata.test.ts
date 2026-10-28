import assert from "node:assert/strict";
import { it } from "node:test";
import { buildProfileContentFromFormData } from "./profile-content-codec";
import { normalizeProfileContent } from "../data/profile-content";

it("uses an existing profile name for the webpage title before metadata is configured", () => {
  const content = normalizeProfileContent({ hero: { name: "Adryan Putra Pratama", headline: "Software Engineer", summary: "Personal portfolio" } });
  assert.equal(content.metadata.homeTitle, "Adryan Putra Pratama — Software Engineer");
  assert.equal(content.metadata.homeDescription, "Personal portfolio");
  assert.equal(content.hero.firstName, "Adryan Putra");
  assert.equal(content.hero.lastName, "Pratama");
});

it("builds the full name from the two hero name fields", () => {
  const form = new FormData();
  form.set("heroFirstName", "Adryan Putra");
  form.set("heroLastName", "Pratama");

  const content = normalizeProfileContent(buildProfileContentFromFormData(form));
  assert.equal(content.hero.name, "Adryan Putra Pratama");
  assert.equal(content.hero.firstName, "Adryan Putra");
  assert.equal(content.hero.lastName, "Pratama");
});

it("keeps admin-edited webpage metadata through form parsing and database normalization", () => {
  const form = new FormData();
  form.set("metadataHomeTitle", "Adryan | Portfolio");
  form.set("metadataHomeDescription", "Projects and experience by Adryan.");
  form.set("metadataWatchTitle", "Adryan's Watch Journal");
  form.set("metadataWatchDescription", "Films, series, and anime in my collection.");
  const saved = buildProfileContentFromFormData(form);
  assert.deepEqual(normalizeProfileContent(saved).metadata, {
    homeTitle: "Adryan | Portfolio",
    homeDescription: "Projects and experience by Adryan.",
    watchTitle: "Adryan's Watch Journal",
    watchDescription: "Films, series, and anime in my collection.",
  });
});
