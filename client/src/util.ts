const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

// Byline pieces for `HANDLE · HH:MM · DD MMM` (mono, uppercased by CSS). Local time.
export function bylineTime(iso: string): string {
  const d = new Date(iso);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
export function bylineDate(iso: string): string {
  const d = new Date(iso);
  return `${pad(d.getDate())} ${MONTHS[d.getMonth()]}`;
}

// Downscale an image in the browser to one variant (max edge, JPEG). The Worker stores
// this alongside the original, so no server-side image library is needed (lockfile §3).
export async function resizeImage(file: File, maxEdge = 1280, quality = 0.82): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
  const w = Math.max(1, Math.round(bitmap.width * scale));
  const h = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("could not prepare the image");
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("could not prepare the image"))),
      "image/jpeg",
      quality,
    );
  });
}
