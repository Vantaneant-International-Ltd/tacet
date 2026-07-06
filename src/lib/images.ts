import type { Env } from "../types";

// Images live in R2 under a per-post ULID key, as two objects: the original and one
// resized variant. The variant is produced by the browser before upload (canvas), which
// keeps the Worker free of an image-decoding dependency while still storing a real
// downscaled variant, per lockfile §3. Display uses the variant everywhere.
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MAX_ORIGINAL = 10 * 1024 * 1024; // 10 MB
const MAX_VARIANT = 3 * 1024 * 1024; // 3 MB

export function isAllowedImage(type: string, size: number, max: number): boolean {
  return ALLOWED.has(type) && size > 0 && size <= max;
}

export function originalKey(key: string): string {
  return `posts/${key}/original`;
}
export function variantKey(key: string): string {
  return `posts/${key}/variant`;
}

export async function storeImagePair(
  env: Env,
  key: string,
  original: File,
  variant: File,
): Promise<void> {
  if (!isAllowedImage(original.type, original.size, MAX_ORIGINAL)) {
    throw new Error("original image is not an allowed type or is too large");
  }
  if (!isAllowedImage(variant.type, variant.size, MAX_VARIANT)) {
    throw new Error("variant image is not an allowed type or is too large");
  }
  await env.BUCKET.put(originalKey(key), await original.arrayBuffer(), {
    httpMetadata: { contentType: original.type },
  });
  await env.BUCKET.put(variantKey(key), await variant.arrayBuffer(), {
    httpMetadata: { contentType: variant.type },
  });
}

export async function deleteImagePair(env: Env, key: string): Promise<void> {
  await env.BUCKET.delete([originalKey(key), variantKey(key)]);
}

// Avatars: one per user, stored under avatars/<userId>/{original,variant}.
export function avatarVariantKey(userId: string): string {
  return `avatars/${userId}/variant`;
}

export async function storeAvatar(env: Env, userId: string, original: File, variant: File): Promise<void> {
  if (!isAllowedImage(original.type, original.size, MAX_ORIGINAL)) {
    throw new Error("avatar is not an allowed type or is too large");
  }
  if (!isAllowedImage(variant.type, variant.size, MAX_VARIANT)) {
    throw new Error("avatar variant is not an allowed type or is too large");
  }
  await env.BUCKET.put(`avatars/${userId}/original`, await original.arrayBuffer(), {
    httpMetadata: { contentType: original.type },
  });
  await env.BUCKET.put(`avatars/${userId}/variant`, await variant.arrayBuffer(), {
    httpMetadata: { contentType: variant.type },
  });
}
