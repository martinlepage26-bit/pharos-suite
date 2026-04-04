// AurorA — Intake Validators
// Source: Spec 03 — aurora-file-intake-module
// TODO (Module 03 build): implement MIME + size guards

import type { IntakeRequest, IntakeResult } from "./types";

export async function validateIntake(_request: IntakeRequest): Promise<IntakeResult> {
  throw new Error("NOT IMPLEMENTED — see Spec 03 §intake-validation");
}
