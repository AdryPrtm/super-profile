"use client";

import { useState } from "react";

import { AdminFormSection } from "@/features/profile-content/components/admin/AdminFormSection";
import {
  ExperiencesFieldset,
  type ExperienceRow,
} from "@/features/profile-content/components/admin/ExperiencesFieldset";
import type { Experience } from "@/features/profile-content/data/profile-content";

type ExperiencesEditorProps = {
  experiences: Experience[];
};

// Hanya dipakai untuk baris yang ditambahkan di browser, jadi tidak pernah
// ikut menentukan hasil render pertama di server.
let addedRowCount = 0;

function nextKey() {
  addedRowCount += 1;
  return `experience-added-${addedRowCount}`;
}

export function ExperiencesEditor({ experiences }: ExperiencesEditorProps) {
  const [rows, setRows] = useState<ExperienceRow[]>(() =>
    experiences.map((experience, index) => ({
      ...experience,
      key: `experience-${index}`,
    })),
  );

  return (
    <AdminFormSection title="Experience">
      <ExperiencesFieldset
        rows={rows}
        onAdd={() =>
          setRows((current) => [
            ...current,
            {
              key: nextKey(),
              period: "",
              role: "",
              company: "",
              description: "",
            },
          ])
        }
        onRemove={(key) =>
          setRows((current) => current.filter((row) => row.key !== key))
        }
        onUpdate={(key, changes) =>
          setRows((current) =>
            current.map((row) => (row.key === key ? { ...row, ...changes } : row)),
          )
        }
      />
    </AdminFormSection>
  );
}
