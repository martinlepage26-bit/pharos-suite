// AurorA — intake validators
// Source: Spec 03, runtime truth (server.py allows .pdf, .txt, .docx; legacy .doc rejected)

export const MIME_ALLOWLIST: readonly string[] = [
  "application/pdf",
  "text/plain",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
] as const;

// 50 MB — derived from CF Workers request limits + document intake scope
export const SIZE_CEILING_BYTES: number = 52_428_800;

type ValidationOk = { valid: true };
type ValidationFail = { valid: false; reason: string };
type ValidationResult = ValidationOk | ValidationFail;

export function validateMimeType(mimeType: string): ValidationResult {
  if (MIME_ALLOWLIST.includes(mimeType)) {
    return { valid: true };
  }
  return {
    valid: false,
    reason: `MIME type "${mimeType}" is not in the allowlist. Allowed: ${MIME_ALLOWLIST.join(", ")}`,
  };
}

export function validateFileSize(sizeBytes: number): ValidationResult {
  if (sizeBytes <= SIZE_CEILING_BYTES) {
    return { valid: true };
  }
  const actualMb = (sizeBytes / 1_048_576).toFixed(2);
  const ceilingMb = (SIZE_CEILING_BYTES / 1_048_576).toFixed(0);
  return {
    valid: false,
    reason: `File size ${actualMb} MB exceeds the ${ceilingMb} MB ceiling (${sizeBytes} bytes > ${SIZE_CEILING_BYTES} bytes)`,
  };
}

// Spec 03 does not require magic-byte verification — pass-through
export async function validateContentTypeHeader(
  _declared: string,
  _buffer: ArrayBuffer,
): Promise<ValidationResult> {
  return { valid: true };
}
