"use client";

export function uploadToSignedUrl({
  blob,
  onProgress,
  signedUrl,
}: {
  blob: Blob;
  onProgress: (progress: number) => void;
  signedUrl: string;
}) {
  const request = new XMLHttpRequest();
  const promise = new Promise<void>((resolve, reject) => {
    request.open("PUT", signedUrl);
    request.setRequestHeader("x-upsert", "true");
    request.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable)
        onProgress(Math.round((event.loaded / event.total) * 100));
    });
    request.addEventListener("load", () => {
      if (request.status >= 200 && request.status < 300) resolve();
      else reject(new Error("UPLOAD_FAILED"));
    });
    request.addEventListener("error", () => reject(new Error("UPLOAD_FAILED")));
    request.addEventListener("abort", () =>
      reject(new DOMException("Upload cancelled", "AbortError")),
    );
    const body = new FormData();
    body.append("cacheControl", "3600");
    body.append("", blob, "media");
    request.send(body);
  });
  return { cancel: () => request.abort(), promise };
}
