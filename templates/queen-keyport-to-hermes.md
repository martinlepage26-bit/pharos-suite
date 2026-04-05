# Handoff Schema: Queen Keyport → Hermes

**Purpose:** Queen Keyport (Governance/Tier 1) synthesizes scope definition and right-arm input, then issues governance decisions to Hermes (Routing/Tier 2) for implementation and integration.

## Required Fields

All fields are **mandatory** unless marked `[OPTIONAL]`.

### 1. Decision Identity
```
decision_id: <unique identifier, format: DECISION-YYYY-MM-DD-NNNN>
references_scope_id: <the scope_id from HEPHAISTOS handoff>
decided_by: <Queen Keyport version or identifier>
timestamp: <ISO 8601 timestamp when decision was made>
```

### 2. Governance Decision (YES / CONDITIONAL / REJECT)
```
approval_status: <approved|conditional|rejected>
approval_rationale: <2-3 sentence justification>

if approval_status == conditional:
  conditions:
    - <condition 1>
    - <condition 2>
    - <...>
```

### 3. Constraints (Mandatory)
```
mandatory_constraints:
  - <constraint 1>
  - <constraint 2>
  - <...>

constraint_rationale: <why these constraints are non-negotiable>
```

### 4. Right-Arm Input Summary
```
philosopher_input:
  position: <summary of Philosopher's normative analysis>
  key_values: <values Philosopher identified as at stake>
  
power_analyst_input:
  position: <summary of Power-Analyst's structural analysis>
  leverage_points: <key dependencies and vulnerabilities identified>

right_arm_disagreement: <"none" or description of where inputs diverged>
governance_synthesis: <how governance resolved any disagreement>
```

### 5. Evidence and Validation Gates
```
evidence_validated:
  - <evidence type 1: PASS|FAIL|CONDITIONAL>
  - <evidence type 2: PASS|FAIL|CONDITIONAL>
  
unresolved_evidence_gaps:
  - <gap 1>
  - <gap 2>
  
quality_gates:
  - <gate 1: PASS|FAIL|FLAGGED>
  - <gate 2: PASS|FAIL|FLAGGED>
```

### 6. Diamond Eyes Validation
```
diamond_eyes_assessment:
  serves_flourishing: <yes|no|conditional>
  wisdom_assessment: <brief assessment of whether decision is wise and caring>
  care_requirement: <any care requirements or protective measures>
  
if diamond_eyes_assessment != yes:
  escalation_required: true
  escalation_to: HEPHAISTOS
```

### 7. Systems and Routing
```
systems_involved:
  - system_name: <name>
    role: <what this system does in implementation>
    integration_type: <direct|api|batch|realtime|manual|other>

integration_sequence: <order in which systems should be activated>

monitoring_required:
  - <metric 1>
  - <metric 2>
```

### 8. Escalation Triggers and Feedback Loop
```
escalate_to_governance_if:
  - <condition 1>
  - <condition 2>

feedback_frequency: <hourly|daily|weekly|on-exception>
```

---

## Validation Rules

**Schema validation:** All required fields must be present and non-empty.

**Logical validation:**
- If `approval_status` is `rejected`, then `approval_rationale` must name the specific reason(s)
- If any constraint is marked, at least one must reference a `flagged_concern` from the original scope
- If `right_arm_disagreement` is not "none", then `governance_synthesis` must explicitly address the disagreement
- If `diamond_eyes_assessment` is not `yes`, then `escalation_required` must be `true`

**Machine-checkable JSON form:**

```json
{
  "decision_id": "string",
  "references_scope_id": "string",
  "decided_by": "string",
  "timestamp": "ISO8601",
  "approval_status": "enum: approved|conditional|rejected",
  "approval_rationale": "string",
  "conditions": ["array (required if conditional)"],
  "mandatory_constraints": ["array"],
  "constraint_rationale": "string",
  "philosopher_input": {
    "position": "string",
    "key_values": ["array"]
  },
  "power_analyst_input": {
    "position": "string",
    "leverage_points": ["array"]
  },
  "right_arm_disagreement": "string",
  "governance_synthesis": "string",
  "evidence_validated": ["array of PASS|FAIL|CONDITIONAL"],
  "unresolved_evidence_gaps": ["array"],
  "quality_gates": ["array of PASS|FAIL|FLAGGED"],
  "diamond_eyes_assessment": {
    "serves_flourishing": "enum: yes|no|conditional",
    "wisdom_assessment": "string",
    "care_requirement": "string"
  },
  "escalation_required": "boolean",
  "systems_involved": [
    {
      "system_name": "string",
      "role": "string",
      "integration_type": "enum: direct|api|batch|realtime|manual|other"
    }
  ],
  "integration_sequence": "string",
  "monitoring_required": ["array"],
  "escalate_to_governance_if": ["array"],
  "feedback_frequency": "enum: hourly|daily|weekly|on-exception"
}
```

---

## Response from Hermes

When Hermes receives this governance decision, he will respond with an **Implementation/Routing Plan** (see `templates/hermes-escalation-to-queen-keyport.md` for the feedback channel).

If validation fails or constraints cannot be met, Hermes will escalate back to Queen Keyport with specific concerns.
