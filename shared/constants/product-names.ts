// Canonical product name registry
// Source: Spec 02 and freeze doc 00a — authority-and-transition-status
// Use these exports for canonical product/workflow naming only.

export const PHAROS = "PHAROS";
export const COMPASSAI = "CompassAI";
export const AURORA = "Aurora";

export const PRODUCT_NAMES = {
  PHAROS,
  COMPASSAI,
  AURORA,
} as const;

// Compatibility aliases remain explicit and secondary while the repo
// filesystem and legacy materials are still being normalized.
export const LEGACY_PRODUCT_NAME_ALIASES = {
  pharos_suite: "pharos-suite",
  aurorai_service: "AurorAI",
  aurorai_directory: "aurorai/",
  compassai_architecture: "ComPassAI",
  drift_aurora: "AurorA",
  drift_compassai: "COMPASSai",
} as const;
