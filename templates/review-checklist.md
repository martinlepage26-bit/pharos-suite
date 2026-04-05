# HEPHAISTOS Review Checklist

Use this checklist before promoting any output to final or externally exposed status.
Select the appropriate review depth based on consequence classification.

---

## Tier A — Delta-First Review (Default)

Apply to all tasks before declaring complete.

**Claims and Boundary**
- [ ] Do all claims fall within what the evidence supports?
- [ ] Are bounded/degraded claims marked explicitly where specialist quorum is absent?
- [ ] Is there any claim that was stated without evidence and should be removed or qualified?

**Completeness vs. Fake Completion**
- [ ] Does the output address the actual task, not a simpler version of it?
- [ ] Is there any repetition being treated as validation?
- [ ] Are open risks named, or have they been silently dropped?

**Artifact Legibility**
- [ ] Is the output structured so a future operator can follow the reasoning?
- [ ] Is it clear which skill(s) produced which sections?
- [ ] Are high-severity findings named with owners and next actions?

---

## Tier B — Full Structured Review (Escalation Required)

Apply when escalation triggers are present (see task-routing.md).

**L1 — Claims and Boundary**
- [ ] Are all factual claims traceable to a source or evidence layer?
- [ ] Is any assertion made beyond what the evidence warrants?
- [ ] Are uncertainty and degradation language applied consistently?
- Finding: ___ / none

**L2 — Runtime / Implementation Correctness**
- [ ] If the output includes scripts, commands, or code, are they correct?
- [ ] Are tool invocations, file references, and paths accurate?
- [ ] Does the output work in the actual operating environment (WSL / local repo)?
- Finding: ___ / none

**L3 — Adversarial / Abuse Potential**
- [ ] Could this output be misused or exploited if exposed externally?
- [ ] Does the output create unintended scope, permission, or disclosure risks?
- [ ] Are governance controls binding, or can they be trivially bypassed?
- Finding: ___ / none

**L4 — Ops and Recovery**
- [ ] If this output fails or produces errors, what is the recovery path?
- [ ] Are irreversible actions flagged and requiring explicit authorization?
- [ ] Are there any infra-altering implications that haven't been authorized?
- Finding: ___ / none

**L5 — External-Reviewer Clarity**
- [ ] Would a competent reviewer outside this conversation understand this output?
- [ ] Is jargon used consistently and defined where needed?
- [ ] Does the artifact stand alone, or does it require context only the author has?
- Finding: ___ / none

---

## Governance Override Check

Before final promotion:
- [ ] Is governance authority preserved? (governance controls were not overridden by
  stylistic or speculative impulse)
- [ ] Is Philosopher operating as interpretive frame, not detached abstraction?
- [ ] Is MA inside Philosopher, not operating as a separate sovereign layer?
- [ ] Is HEPHAISTOS identity intact? (no platform identity leakage in new files)
- [ ] Is the control model intact? (single-owner, bounded claims, delta-first default)

---

## Promotion Decision

- [ ] Output is ready for final use / external exposure
- [ ] Output requires revision — issues named: ___
- [ ] Output must be degraded to bounded/degraded — reason: ___
- [ ] Output requires escalation to human operator — reason: ___
