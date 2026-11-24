"use client";

import { FileUp, Loader2, Trash2 } from "lucide-react";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { uploadCvFile } from "@/features/profile-content/actions/upload-cv-file-action";
import { toCvDownloadUrl } from "@/features/profile-content/utils/profile-links";

export function CvFileField({ cvUrl }: { cvUrl: string }) {
  const [url, setUrl] = useState(cvUrl);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(file: File | undefined) {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setError("The PDF exceeds the 10 MB limit.");
      if (inputRef.current) inputRef.current.value = "";
      return;
    }
    setUploading(true);
    setError(null);
    const data = new FormData();
    data.append("file", file);
    try {
      const result = await uploadCvFile(data);
      if (result.error) setError(result.error);
      else if (result.url) setUrl(result.url);
    } catch {
      setError("Could not upload the PDF. Please try again.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-3">
      <input type="hidden" name="contactCvUrl" value={url} />
      <p className="text-sm font-medium">Public CV (PDF)</p>
      <div className="flex flex-wrap items-center gap-2">
        <input ref={inputRef} type="file" accept="application/pdf,.pdf" className="sr-only" aria-label="Choose public CV PDF" onChange={(event) => void handleUpload(event.target.files?.[0])} />
        <Button type="button" variant="outline" disabled={uploading} onClick={() => inputRef.current?.click()}>
          {uploading ? <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin motion-reduce:animate-none" /> : <FileUp aria-hidden="true" className="h-4 w-4" />}
          {uploading ? "Uploading..." : url ? "Replace PDF" : "Upload PDF"}
        </Button>
        {url ? <Button type="button" variant="ghost" disabled={uploading} onClick={() => setUrl("")}><Trash2 aria-hidden="true" className="h-4 w-4" />Remove</Button> : null}
        {url ? <a href={toCvDownloadUrl(url)} className="text-sm underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2">Download current CV</a> : null}
      </div>
      <p className="text-xs text-muted-foreground">PDF, maximum 10 MB. Save content to publish or remove the download button.</p>
      {error ? <p role="alert" className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
