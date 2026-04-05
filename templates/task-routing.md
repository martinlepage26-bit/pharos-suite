# HEPHAISTOS Task Routing Template

Use this template to open any non-trivial task. Fill it out before activating skills.

---

## Task Intake

**Task description:** [what is being built, analyzed, revised, or decided]

**Artifact type:** [document / analysis / manuscript / policy / code / audio / visual / mixed]

**Requestor intent:** [what outcome does the operator need from this task]

---

## Consequence Classification

**Primary consequence domain:**
- [ ] Governance (constraint design, validation, policy, evidence, auditability, risk)
- [ ] Interpretive / conceptual (framing, philosophy, power analysis, epistemics)
- [ ] Research (method design, qualitative analysis, empirical grounding)
- [ ] Writing / publishing (manuscript, book, narrative, academic paper)
- [ ] Output / delivery (audio, visual identity, brand)
- [ ] Mixed — specify: ___

**Consequence severity:**
- [ ] High — institutional, legal, clinical, labor, or reputational consequence
- [ ] Medium — reviewable artifact with external audience or publication target
- [ ] Low — internal, exploratory, or reversible

**Governance trigger check:**
- [ ] Touches constraint design or operational boundaries?
- [ ] Requires evidence thresholds or validation?
- [ ] Has auditability or escalation requirements?
- [ ] Involves regulated, jurisdiction-sensitive, or safety-relevant content?

If any governance trigger is checked, classify as governance-primary.

---

## Skill Routing Decision

**Single skill sufficient?**
- [ ] Yes — skill: ___
- [ ] No — composition needed (see below)

**Composition (if needed):**

```
PRIMARY SKILL: ___
  — Contributes: ___
  — Acceptance criterion: ___

SECONDARY SKILL: ___
  — Contributes: ___
  — Activation trigger: ___
  — Acceptance criterion: ___

CONFLICT-RESOLUTION RULE: ___

COMPOSITION RATIONALE: ___
```

---

## Review Threshold

**Delta-first review (default):**
- [ ] Sufficient — no escalation triggers present

**Full structured review (escalation):**
- [ ] Externally exposed / client-facing / publish-target
- [ ] Regulated / jurisdiction-sensitive / safety-relevant
- [ ] Institutional / legal / clinical / labor consequence
- [ ] Described as "full" / "complete" / "exhaustive" / "comprehensive"
- [ ] Still ambiguous after first-pass review

If escalating, map across: L1 (claims/boundary), L2 (runtime correctness),
L3 (adversarial/abuse), L4 (ops/recovery), L5 (external-reviewer clarity).

---

## Completion Criteria

The task is complete when:
- [ ] Output is structured, bounded, and consequentially legible
- [ ] Claims do not exceed supporting evidence
- [ ] Open risks or limitations are named explicitly
- [ ] Artifact is reconstructable by a future operator
- [ ] High-severity findings have named owners and next actions
- [ ] If composed, each skill's contribution is traceable

---

## Open Risks / Degraded Boundaries

[Name any claims that must be degraded to `bounded/degraded` because specialist
quorum is absent or evidence is insufficient. Do not leave this blank if risks exist.]
