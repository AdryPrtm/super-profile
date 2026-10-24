"use client";

import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { uploadHeroImage } from "@/features/profile-content/actions/upload-hero-image-action";

export function HeroImageField({ imageUrl }: { imageUrl: string }) {
  const [url, setUrl] = useState(imageUrl);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    setError(null);
    const data = new FormData();
    data.append("file", file);
    try {
      const result = await uploadHeroImage(data);
      if (result.error) setError(result.error);
      else if (result.url) setUrl(result.url);
    } catch {
      setError("Could not upload the PNG image. Please try again.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-3">
      <input type="hidden" name="heroImageUrl" value={url} />
      <p className="text-sm font-medium">Profile image</p>
      <div className="flex flex-wrap items-center gap-5">
        <div className="flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-muted text-xs text-muted-foreground">
          {url ? <img src={url} alt="Current profile image" className="h-full w-full object-cover" /> : "No image yet"}
        </div>
        <div className="space-y-3">
          <input ref={inputRef} type="file" accept="image/png,.png" className="sr-only" aria-label="Choose profile PNG image" onChange={(event) => void handleUpload(event.target.files?.[0])} />
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" disabled={uploading} onClick={() => inputRef.current?.click()}>
              {uploading ? <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" /> : <ImagePlus aria-hidden="true" className="h-4 w-4" />}
              {uploading ? "Uploading..." : url ? "Replace PNG" : "Upload PNG"}
            </Button>
            {url ? <Button type="button" variant="ghost" disabled={uploading} onClick={() => setUrl("")}><Trash2 aria-hidden="true" className="h-4 w-4" />Remove</Button> : null}
          </div>
          <p className="text-xs text-muted-foreground">Square PNG recommended, maximum 5 MB. Save content to publish the new image.</p>
        </div>
      </div>
      {error ? <p role="alert" className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
