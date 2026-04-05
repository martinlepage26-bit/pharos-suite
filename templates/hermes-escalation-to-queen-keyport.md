# Feedback Loop Schema: Hermes → Queen Keyport

**Purpose:** Hermes (Routing/Tier 2) monitors implementation and reports back to Queen Keyport (Governance/Tier 1) on execution status, constraint violations, and escalations.

## Three Event Types

### 1. Status Report (Regular Monitoring)

```
report_id: <unique identifier, format: REPORT-YYYY-MM-DD-NNNN>
report_type: status
references_decision_id: <the decision_id from Queen Keyport handoff>
reported_by: <Hermes version or identifier>
timestamp: <ISO 8601 timestamp when report was generated>

status_summary: <brief status of implementation>

metrics:
  - metric_name: <name>
    current_value: <current value>
    threshold: <threshold>
    status: <OK|WARNING|CRITICAL>
    
constraint_compliance:
  - constraint: <constraint from governance decision>
    compliant: <yes|no|partial>
    evidence: <how compliance is verified>
    
escalation_triggered: false
next_report_scheduled: <ISO 8601 timestamp of next report>
```

---

### 2. Warning (Constraint Deviation)

```
report_id: <unique identifier, format: WARN-YYYY-MM-DD-NNNN>
report_type: warning
references_decision_id: <the decision_id>
reported_by: <Hermes version or identifier>
timestamp: <ISO 8601 timestamp>

severity: <low|medium|high>

constraint_violated:
  constraint: <which constraint from governance decision>
  expected_behavior: <what governance expected>
  observed_behavior: <what is actually happening>
  deviation_magnitude: <how far from constraint>
  
root_cause_hypothesis:
  - <possible cause 1>
  - <possible cause 2>
  
immediate_action_taken:
  - <action 1>
  - <action 2>
  
escalation_triggered: true
escalation_required_by: <ISO 8601 timestamp — when this needs Queen Keyport response>
```

---

### 3. Escalation (Critical Issue)

```
report_id: <unique identifier, format: ESCALATE-YYYY-MM-DD-NNNN>
report_type: escalation
references_decision_id: <the decision_id>
reported_by: <Hermes version or identifier>
timestamp: <ISO 8601 timestamp>

escalation_reason: <one of the reasons listed below>

escalation_categories:
  constraint_violation: <yes|no — governance constraint has been broken>
  implementation_impossible: <yes|no — cannot execute the approved decision>
  integration_failure: <yes|no — external system integration has failed>
  security_or_safety_concern: <yes|no — urgent safety/security issue>
  right_arm_disagreement: <yes|no — Philosopher or Power-Analyst has flagged issue>
  diamond_eyes_concern: <yes|no — decision is not serving flourishing as intended>

detailed_situation:
  what_happened: <clear description>
  when_discovered: <timestamp>
  who_is_affected: <people/systems affected>
  immediate_impact: <what's at risk>
  
escalation_request:
  action_needed: <what Queen Keyport must decide>
  options_available:
    - <option 1>
    - <option 2>
    - <option 3>
  recommendation: <which option Hermes recommends and why>
  
timeline_critical: <yes|no>
decision_needed_by: <ISO 8601 timestamp — hard deadline for response>
```

---

## Validation Rules

**Schema validation:** All required fields must be present and non-empty.

**Logical validation:**
- Status reports must have `escalation_triggered: false`
- Warnings must have `escalation_triggered: true`
- Escalations must have at least one category set to `yes`
- If `timeline_critical` is `yes`, then `decision_needed_by` must be specified and before current time + 24 hours

**Machine-checkable JSON form (Status Report):**

```json
{
  "report_id": "string",
  "report_type": "enum: status|warning|escalation",
  "references_decision_id": "string",
  "reported_by": "string",
  "timestamp": "ISO8601",
  "status_summary": "string",
  "metrics": [
    {
      "metric_name": "string",
      "current_value": "number|string",
      "threshold": "number|string",
      "status": "enum: OK|WARNING|CRITICAL"
    }
  ],
  "constraint_compliance": [
    {
      "constraint": "string",
      "compliant": "enum: yes|no|partial",
      "evidence": "string"
    }
  ],
  "escalation_triggered": false,
  "next_report_scheduled": "ISO8601"
}
```

**Machine-checkable JSON form (Warning):**

```json
{
  "report_id": "string",
  "report_type": "warning",
  "references_decision_id": "string",
  "reported_by": "string",
  "timestamp": "ISO8601",
  "severity": "enum: low|medium|high",
  "constraint_violated": {
    "constraint": "string",
    "expected_behavior": "string",
    "observed_behavior": "string",
    "deviation_magnitude": "string"
  },
  "root_cause_hypothesis": ["array"],
  "immediate_action_taken": ["array"],
  "escalation_triggered": true,
  "escalation_required_by": "ISO8601"
}
```

**Machine-checkable JSON form (Escalation):**

```json
{
  "report_id": "string",
  "report_type": "escalation",
  "references_decision_id": "string",
  "reported_by": "string",
  "timestamp": "ISO8601",
  "escalation_reason": "string",
  "escalation_categories": {
    "constraint_violation": "boolean",
    "implementation_impossible": "boolean",
    "integration_failure": "boolean",
    "security_or_safety_concern": "boolean",
    "right_arm_disagreement": "boolean",
    "diamond_eyes_concern": "boolean"
  },
  "detailed_situation": {
    "what_happened": "string",
    "when_discovered": "ISO8601",
    "who_is_affected": "string",
    "immediate_impact": "string"
  },
  "escalation_request": {
    "action_needed": "string",
    "options_available": ["array"],
    "recommendation": "string"
  },
  "timeline_critical": "boolean",
  "decision_needed_by": "ISO8601"
}
```

---

## Response Path

When Queen Keyport receives an escalation, she:
1. Reviews the situation
2. Consults right-arms (Philosopher, Power-Analyst) if needed
3. Decides on remediation
4. Either:
   - **Returns a modified Governance Decision** (returns to normal flow)
   - **Escalates back to HEPHAISTOS** (if scope must change)
   - **Directs Hermes to remediate** (if implementation can self-correct)

All responses close with a timestamp, decision authority, and new monitoring requirements.
