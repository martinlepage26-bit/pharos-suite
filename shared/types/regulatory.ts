// Regulatory boundaries and localization types
// Source: Spec 09 — regulatory-boundaries-and-localization
// TODO: populate jurisdiction codes and boundary rules from Spec 09

export type JurisdictionCode =
  | "CA-QC"
  | "CA-ON"
  | "EU"
  | string; // TODO: narrow to known codes per Spec 09

export interface JurisdictionBoundary {
  code: JurisdictionCode;
  dataResidencyRequired: boolean;
  retentionDays: number;
  // TODO: add regulatory body refs, applicable standards per Spec 09
}

export const DEFAULT_JURISDICTION: JurisdictionCode = "CA-QC";
// NOTE: Default reflects Montréal operator context.
// Do NOT change without reviewing Spec 09 localization requirements.
