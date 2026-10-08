"use client";

import { useFormStatus } from "react-dom";

export function SaveWatchButton({ editing }: { editing: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="min-h-11 cursor-pointer rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-80 disabled:cursor-wait disabled:opacity-50">
      {pending ? "Menyimpan..." : editing ? "Simpan perubahan" : "Tambah tontonan"}
    </button>
  );
}

export function DeleteWatchButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(event) => {
        if (!window.confirm("Hapus judul ini dari tracker?")) event.preventDefault();
      }}
      className="min-h-11 cursor-pointer text-sm font-medium text-destructive hover:underline disabled:cursor-wait disabled:opacity-50"
    >
      {pending ? "Menghapus..." : "Hapus judul ini"}
    </button>
  );
}
