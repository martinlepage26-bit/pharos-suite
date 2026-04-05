# Handoff Schema: HEPHAISTOS → Queen Keyport

**Purpose:** HEPHAISTOS (Forging/Tier 0) defines scope and passes it to Queen Keyport (Governance/Tier 1) for constraint synthesis.

## Required Fields

All fields are **mandatory** unless marked `[OPTIONAL]`.

### 1. Scope Identity
```
scope_id: <unique identifier, format: SCOPE-YYYY-MM-DD-NNNN>
task_name: <human-readable description of what is being built>
forged_by: <HEPHAISTOS version or identifier>
timestamp: <ISO 8601 timestamp when scope was defined>
```

### 2. Artifact Definition
```
artifact_type: <system|dataset|narrative|agent|analysis|policy|process|other>
artifact_name: <specific name of the artifact being built>
artifact_scope: <brief description of boundaries and what is included/excluded>
artifact_consequence_domain: <none|internal|operational|external|regulatory|legal|clinical|reputational>
```

### 3. Evidence Requirements
```
evidence_threshold: <minimal|moderate|rigorous|scientific|expert|unanimous>
required_evidence:
  - <evidence type 1>
  - <evidence type 2>
  - <...>
evidence_gaps: <any known gaps or uncertainties>
```

### 4. Stakeholder Analysis
```
primary_audience: <who will use or be affected by this artifact>
secondary_stakeholders:
  - <stakeholder 1>
  - <stakeholder 2>
vulnerable_populations: <list any populations that could be disadvantaged or harmed>
```

### 5. Decision Dependencies
```
depends_on:
  - <prior scope that must be resolved first>
blocks:
  - <downstream scopes that cannot proceed until this is approved>
cross_domain_dependencies:
  - <other systems or decisions that interact>
```

### 6. Diamond Eyes Assessment (Wisdom/Care Validation)

**Apply the Diamond Eyes Protocol** (see `templates/diamond-eyes-protocol.md`) before completing this handoff.

```
diamond_eyes_assessment:
  does_this_serve_flourishing: <yes|conditional|no>
  
  clarity_gate: <What exactly is being decided? Who is affected? What does success look like for them?>
  
  wisdom_assessment:
    autonomy: <Does this preserve human choice and agency, or hide constraint behind process?>
    transparency: <Are tradeoffs visible? Are value choices named?>
    accountability: <Can someone be held responsible? Or is accountability distributed/avoided?>
    dignification: <Are people treated as ends or inputs to the system?>
    care: <Is there genuine concern for those affected, or optimization of metrics?>
  
  care_requirement: <What aspect of human flourishing must this scope preserve, protect, or enable?>
  
  wisdom_constraints:
    - <constraint 1 that Diamond Eyes validates>
    - <constraint 2>
  
  flagged_concerns:
    - <concern 1 that should trigger governance review>
    - <concern 2 — especially equity/fairness if vulnerable populations exist>
  
  escalation_needed: <true|false — set true if wisdom cannot be assured at this stage>
```

**Decision Logic:**
- **If `does_this_serve_flourishing: yes`** → Scope is wise and correct. Proceed to governance with confidence.
- **If `does_this_serve_flourishing: conditional`** → Scope serves flourishing IF certain conditions are met. Name them explicitly. Governance must validate conditions.
- **If `does_this_serve_flourishing: no`** → Scope creates theater or enables harm. Escalate to HEPHAISTOS for redesign before governance review.

### 7. Escalation Triggers
```
escalate_if:
  - <condition 1 that would require immediate escalation back to HEPHAISTOS>
  - <condition 2>
```

---

## Validation Rules

**Schema validation:** All required fields must be present and non-empty (except `[OPTIONAL]`).

**Logical validation:**
- If `artifact_consequence_domain` is `regulatory`, `legal`, or `clinical`, then `evidence_threshold` must be at least `rigorous`
- If `vulnerable_populations` is non-empty, then `flagged_concerns` must include equity and fairness considerations
- `artifact_scope` must explicitly name what is **excluded** (not just what's included)

**Machine-checkable:** Use this JSON form for validation:

```json
{
  "scope_id": "string",
  "task_name": "string",
  "forged_by": "string",
  "timestamp": "ISO8601",
  "artifact_type": "enum: system|dataset|narrative|agent|analysis|policy|process|other",
  "artifact_name": "string",
  "artifact_scope": "string (must include exclusions)",
  "artifact_consequence_domain": "enum: none|internal|operational|external|regulatory|legal|clinical|reputational",
  "evidence_threshold": "enum: minimal|moderate|rigorous|scientific|expert|unanimous",
  "required_evidence": ["array of strings"],
  "evidence_gaps": "string",
  "primary_audience": "string",
  "secondary_stakeholders": ["array"],
  "vulnerable_populations": ["array"],
  "depends_on": ["array"],
  "blocks": ["array"],
  "cross_domain_dependencies": ["array"],
  "does_this_serve_flourishing": "enum: yes|no|unknown",
  "wisdom_constraints": ["array"],
  "flagged_concerns": ["array"],
  "escalate_if": ["array"]
}
```

---

## Response from Queen Keyport

When Queen Keyport receives this handoff, she will respond with a **Governance Decision** (see `templates/queen-keyport-to-hermes.md`).

If validation fails or escalation is triggered, Queen Keyport will return to HEPHAISTOS with specific remediation requests.
