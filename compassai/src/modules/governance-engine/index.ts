// COMPASSai — governance pipeline orchestrator
// Source: Spec 06 — compassai-governance-engine

import { runGovernanceProgram } from "./program";
import type { ProgramInput, ProgramOutput } from "./types";

export async function runGovernancePipeline(input: ProgramInput): Promise<ProgramOutput> {
  return runGovernanceProgram(input);
}
