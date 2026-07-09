import type { ReactNode } from "react";

type AdminFormSectionProps = {
  title: string;
  children: ReactNode;
};

export function AdminFormSection({ title, children }: AdminFormSectionProps) {
  return (
    <section className="space-y-5 rounded-lg border border-border/60 p-5">
      <h2 className="text-lg font-medium tracking-tight">{title}</h2>
      <div className="grid gap-4">{children}</div>
    </section>
  );
}
