"use client";

import { useState } from "react";

import { AdminFormSection } from "@/features/profile-content/components/admin/AdminFormSection";
import {
  SocialsFieldset,
  type SocialRow,
} from "@/features/profile-content/components/admin/SocialsFieldset";
import type { SocialLink } from "@/features/profile-content/data/profile-content";

type SocialsEditorProps = {
  socials: SocialLink[];
};

// Hanya dipakai untuk baris yang ditambahkan di browser, jadi tidak pernah
// ikut menentukan hasil render pertama di server.
let addedRowCount = 0;

function nextKey() {
  addedRowCount += 1;
  return `social-added-${addedRowCount}`;
}

/** Urutan baris = urutan ikon di footer halaman publik. */
function moveRow(rows: SocialRow[], key: string, direction: -1 | 1) {
  const index = rows.findIndex((row) => row.key === key);
  const target = index + direction;

  if (index === -1 || target < 0 || target >= rows.length) {
    return rows;
  }

  const next = [...rows];
  const [moved] = next.splice(index, 1);

  if (!moved) {
    return rows;
  }

  next.splice(target, 0, moved);
  return next;
}

export function SocialsEditor({ socials }: SocialsEditorProps) {
  const [rows, setRows] = useState<SocialRow[]>(() =>
    socials.map((social, index) => ({ ...social, key: `social-${index}` })),
  );

  return (
    <AdminFormSection title="Social Links">
      <SocialsFieldset
        rows={rows}
        onAdd={() =>
          setRows((current) => [
            ...current,
            { key: nextKey(), label: "", url: "", icon: "" },
          ])
        }
        onRemove={(key) =>
          setRows((current) => current.filter((row) => row.key !== key))
        }
        onMove={(key, direction) =>
          setRows((current) => moveRow(current, key, direction))
        }
        onUpdate={(key, changes) =>
          setRows((current) =>
            current.map((row) =>
              row.key === key ? { ...row, ...changes } : row,
            ),
          )
        }
      />
    </AdminFormSection>
  );
}
