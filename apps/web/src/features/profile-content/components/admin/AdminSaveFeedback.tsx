"use client";

import { useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { Check, LoaderCircle, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type AdminSaveFeedbackProps = {
  saveToken: string | null;
  errorToken: string | null;
  hasDatabaseError: boolean;
};

function formSnapshot(form: HTMLFormElement) {
  return JSON.stringify(Array.from(new FormData(form).entries()));
}

export function AdminSaveFeedback({ saveToken, errorToken, hasDatabaseError }: AdminSaveFeedbackProps) {
  const { pending } = useFormStatus();
  const container = useRef<HTMLDivElement>(null);
  const baseline = useRef<string | null>(null);
  const [dirty, setDirty] = useState(false);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const form = container.current?.closest("form");
    if (!form) return;
    const frame = window.requestAnimationFrame(() => {
      baseline.current = formSnapshot(form);
      setDirty(false);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [saveToken]);

  useEffect(() => {
    const form = container.current?.closest("form");
    if (!form) return;
    let frame = 0;
    const check = () => {
      if (baseline.current !== null) setDirty(formSnapshot(form) !== baseline.current);
    };
    const scheduleCheck = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(check);
    };
    form.addEventListener("input", scheduleCheck);
    form.addEventListener("change", scheduleCheck);
    form.addEventListener("click", scheduleCheck);
    const interval = window.setInterval(check, 400);
    return () => {
      form.removeEventListener("input", scheduleCheck);
      form.removeEventListener("change", scheduleCheck);
      form.removeEventListener("click", scheduleCheck);
      window.cancelAnimationFrame(frame);
      window.clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (!saveToken && !errorToken) return;
    setShowResult(true);
    if (saveToken) {
      toast.success("Content saved successfully.", { id: `profile-saved-${saveToken}` });
    }
    if (errorToken) toast.error("Content could not be saved.", { id: `profile-save-error-${errorToken}` });
    const timer = window.setTimeout(() => setShowResult(false), 5000);
    return () => window.clearTimeout(timer);
  }, [saveToken, errorToken]);

  const status = pending
    ? "Saving your changes…"
    : showResult && saveToken
      ? "Saved successfully"
      : showResult && hasDatabaseError
        ? "Save failed. Please try again."
        : "";
  const visible = dirty || pending || showResult;

  return (
    <div ref={container} className={visible ? "sticky bottom-0 z-10 flex flex-wrap items-center justify-between gap-3 border-t border-border/60 bg-background/95 py-4 backdrop-blur" : "hidden"}>
      <span role="status" aria-live="polite" className={`inline-flex items-center gap-2 text-sm ${showResult && saveToken && !pending ? "text-emerald-700 dark:text-emerald-300" : "text-muted-foreground"}`}>
        {showResult && saveToken && !pending ? <Check className="h-4 w-4" aria-hidden="true" /> : null}
        {status}
      </span>
      {dirty || pending ? (
        <Button type="submit" size="lg" disabled={pending}>
          {pending ? <LoaderCircle className="h-4 w-4 animate-spin motion-reduce:animate-none" aria-hidden="true" /> : <Save className="h-4 w-4" aria-hidden="true" />}
          {pending ? "Saving…" : "Save Content"}
        </Button>
      ) : null}
    </div>
  );
}
