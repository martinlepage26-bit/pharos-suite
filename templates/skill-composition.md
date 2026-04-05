# HEPHAISTOS Skill Composition Template

Use when a task requires more than one skill. Fill out completely before running.
Do not merge skill roles vaguely. Each field must have a concrete answer.

---

## Composition Declaration

**Task:** [one sentence describing what is being produced]

**Why composition is needed:** [why single-skill routing is insufficient]

---

## Primary Skill

**Skill name:** ___

**Role in this composition:** [what specific function this skill performs]

**Input it receives:** [what artifact, document, or prompt it is given]

**Output it produces:** [what it is expected to return]

**Acceptance criterion:** [what makes this layer complete — be specific]

---

## Secondary Skill

**Skill name:** ___

**Role in this composition:** [what specific function this skill performs]

**Activation trigger:** [when does secondary fire — after primary completes / in parallel / conditional on primary output]

**Input it receives:** [primary output / original prompt / both]

**Output it produces:** [what it is expected to return]

**Acceptance criterion:** [what makes this layer complete — be specific]

---

## Conflict-Resolution Rule

[If primary and secondary produce conflicting outputs, which wins and why?
Name the specific rule — do not write "use judgment."]

Examples:
- "Governance analysis overrides rhetorical preference"
- "Philosopher's conceptual framing governs; publisher executes within it"
- "Red-team findings are final; governance translates them into controls"
- "Human operator arbitrates if the divergence affects a consequential claim"

**Rule:** ___

---

## Composition Rationale

[One sentence: why this pairing produces a better output than either skill alone]

___

---

## Output Contract

**Final artifact type:** [document / memo / manuscript / control register / analysis]

**Audience:** [who will read or use this artifact]

**Reviewability requirement:** [what must be present for a future operator to reconstruct the reasoning]

**Degraded boundary note:** [if any claim must be marked as bounded/degraded, name it here]
