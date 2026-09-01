"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

type SkillLogoProps = {
  src: string;
  name: string;
  className?: string;
};

export function SkillLogo({ src, name, className }: SkillLogoProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const logoUrl = src.trim();

  if (!logoUrl || failedSrc === logoUrl) {
    return (
      <span
        aria-hidden="true"
        className={cn(
          "flex shrink-0 items-center justify-center rounded-md bg-muted text-xs font-semibold text-muted-foreground",
          className,
        )}
      >
        {name.trim().charAt(0).toUpperCase() || "?"}
      </span>
    );
  }

  return (
    <img
      src={logoUrl}
      alt=""
      loading="lazy"
      onError={() => setFailedSrc(logoUrl)}
      className={cn("shrink-0 rounded-md object-contain", className)}
    />
  );
}
