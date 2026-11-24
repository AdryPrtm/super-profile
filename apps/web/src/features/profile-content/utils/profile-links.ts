export function toMailto(email: string) {
  return email.startsWith("mailto:") ? email : `mailto:${email}`;
}

export const CV_DOWNLOAD_FILENAME = "CV_Adryan_Pratama.pdf";

export function toCvDownloadUrl(url: string) {
  try {
    const downloadUrl = new URL(url);
    downloadUrl.searchParams.set("download", CV_DOWNLOAD_FILENAME);
    return downloadUrl.toString();
  } catch {
    return url;
  }
}
