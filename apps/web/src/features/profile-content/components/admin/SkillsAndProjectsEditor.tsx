"use client";

import { useState } from "react";

import { AdminFormSection } from "@/features/profile-content/components/admin/AdminFormSection";
import {
  ProjectsFieldset,
  type ProjectRow,
} from "@/features/profile-content/components/admin/ProjectsFieldset";
import {
  SkillsFieldset,
  type SkillRow,
} from "@/features/profile-content/components/admin/SkillsFieldset";
import type {
  Project,
  Skill,
} from "@/features/profile-content/data/profile-content";

type SkillsAndProjectsEditorProps = {
  skills: Skill[];
  projects: Project[];
};

/**
 * Skills dan Projects dirender bersama karena tech stack sebuah project
 * memilih dari daftar skill yang sedang diedit. Dengan state di satu tempat,
 * skill yang baru ditambahkan langsung bisa dipilih tanpa perlu save dulu.
 */

// Hanya dipakai untuk baris yang ditambahkan di browser, jadi tidak pernah
// ikut menentukan hasil render pertama di server.
let addedRowCount = 0;

function nextKey(prefix: string) {
  addedRowCount += 1;
  return `${prefix}-added-${addedRowCount}`;
}

export function SkillsAndProjectsEditor({
  skills,
  projects,
}: SkillsAndProjectsEditorProps) {
  const [skillRows, setSkillRows] = useState<SkillRow[]>(() =>
    skills.map((skill, index) => ({ ...skill, key: `skill-${index}` })),
  );
  const [projectRows, setProjectRows] = useState<ProjectRow[]>(() =>
    projects.map((project, index) => ({ ...project, key: `project-${index}` })),
  );

  const availableTech = [
    ...new Set(skillRows.map((row) => row.name.trim()).filter(Boolean)),
  ];

  return (
    <>
      <AdminFormSection title="Skills">
        <SkillsFieldset
          rows={skillRows}
          onAdd={() =>
            setSkillRows((current) => [
              ...current,
              { key: nextKey("skill"), name: "", category: "", logo: "" },
            ])
          }
          onRemove={(key) =>
            setSkillRows((current) => current.filter((row) => row.key !== key))
          }
          onUpdate={(key, changes) =>
            setSkillRows((current) =>
              current.map((row) =>
                row.key === key ? { ...row, ...changes } : row,
              ),
            )
          }
        />
      </AdminFormSection>

      <AdminFormSection title="Projects">
        <ProjectsFieldset
          rows={projectRows}
          availableTech={availableTech}
          onAdd={() =>
            setProjectRows((current) => [
              ...current,
              {
                key: nextKey("project"),
                title: "",
                description: "",
                tech: [],
                images: [],
              },
            ])
          }
          onRemove={(key) =>
            setProjectRows((current) =>
              current.filter((row) => row.key !== key),
            )
          }
          onUpdate={(key, changes) =>
            setProjectRows((current) =>
              current.map((row) =>
                row.key === key ? { ...row, ...changes } : row,
              ),
            )
          }
        />
      </AdminFormSection>
    </>
  );
}
