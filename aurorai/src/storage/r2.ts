// Aurora — R2 bucket client wrapper
// R2 key pattern: govern-artifacts/artifacts/{artifactId}/v1/source.{ext}
// Source: docs/d1-r2-endpoint-mapping.md Part 1

import { StorageWriteError } from "../lib/errors";

export function sanitizeFileName(name: string): string {
  const cleaned = name
    .replace(/[\0/\\]/g, "")
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .slice(0, 200);
  return cleaned || "unnamed";
}

function extensionFromMime(mimeType: string): string {
  switch (mimeType) {
    case "application/pdf": return "pdf";
    case "text/plain": return "txt";
    default: return "bin";
  }
}

export async function writeIntakeFile(
  bucket: R2Bucket,
  artifactId: string,
  fileName: string,
  mimeType: string,
  buffer: ArrayBuffer,
): Promise<{ r2Key: string }> {
  const ext = extensionFromMime(mimeType);
  const r2Key = `govern-artifacts/artifacts/${artifactId}/v1/source.${ext}`;
  const sanitized = sanitizeFileName(fileName);

  try {
    await bucket.put(r2Key, buffer, {
      httpMetadata: { contentType: mimeType },
      customMetadata: { artifactId, sourceFilename: sanitized },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new StorageWriteError("R2_WRITE_FAILED", "writeIntakeFile", message);
  }

  return { r2Key };
}
