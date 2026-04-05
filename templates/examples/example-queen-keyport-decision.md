# Example: Queen Keyport Governance Decision

## Decision Identity
```
decision_id: DECISION-2026-04-05-0001
references_scope_id: SCOPE-2026-04-05-0001
decided_by: Queen Keyport v1.0
timestamp: 2026-04-05T14:30:00Z
```

## Governance Decision
```
approval_status: conditional
approval_rationale: Fairness Review Stack is approved for implementation with conditions that resolve whose definition of fairness is centered and how tradeoffs are transparent. Without these conditions, risk of false legitimacy is unacceptable.
conditions:
  - Philosopher must document fairness framework rationale and acknowledge assumptions
  - System must include transparency mode showing which fairness metrics are optimized for vs. which are acceptable but not optimized
  - Deployment policy must require human review of fairness tradeoffs before approval
```

## Constraints (Mandatory)
```
mandatory_constraints:
  - Fairness testing must output both absolute metrics AND disparity magnitude
  - All fairness decisions must be auditable (document why each metric was chosen)
  - No system can deploy with fairness test marked "pass" if disparity is >2x
  - Fairness results must be visible to downstream users (transparency requirement)
  - Philosopher must explicitly acknowledge which fairness definitions are NOT being tested

constraint_rationale: These constraints ensure fairness testing becomes an integrity gate, not a legitimacy cover. Magnitude disclosure prevents false sense of equality. Auditability enables governance. Philosopher acknowledgment prevents "fairness theater."
```

## Right-Arm Input Summary
```
philosopher_input:
  position: Fairness is inherently normative — testing cannot be value-neutral. We are choosing whose conception of fairness matters. This choice must be visible and debatable.
  key_values: justice, dignity, transparency, intellectual honesty, accountability

power_analyst_input:
  position: Control over fairness metric definition is control over who counts as "fair treatment." Whoever defines the metrics has structural power. Must map who decides and who is affected.

right_arm_disagreement: none
governance_synthesis: Philosopher's insight that fairness is normative is fundamental. Power-Analyst's structural analysis means we must make metric selection transparent and auditable. Both inputs converge on same conclusion: transparency is the control gate.
```

## Evidence and Validation Gates
```
evidence_validated:
  - fairness metrics definitions: PASS (NIST AI RMF, academic consensus)
  - test case results: CONDITIONAL (need to verify coverage across demographic intersections)
  - disparity magnitude: PASS (standard statistical practice)
  - sensitivity analysis: PASS (implementation includes parameter sensitivity testing)
  - integration verification: PENDING (depends on deployment pipeline finalization)

unresolved_evidence_gaps:
  - no consensus on fairness threshold ("how much disparity is acceptable?") — treating as policy decision, not technical question
  - representation in testing data for underrepresented groups — may require synthetic data or domain expertise
  
quality_gates:
  - code review: PASS
  - documentation: PASS
  - test coverage: FLAGGED (fairness testing itself needs adversarial testing)
```

## Diamond Eyes Validation
```
diamond_eyes_assessment:
  serves_flourishing: conditional (serves flourishing IF transparency and policy gates are mandatory)
  wisdom_assessment: This system can serve genuine flourishing by making fairness choices explicit and debatable. But it can cause harm by creating false sense of equity. The difference depends entirely on whether policies require human accountability for fairness tradeoffs.
  care_requirement: System must be designed to preserve human accountability. Developers must be able to explain and justify fairness choices. Users must be informed when fairness has been sacrificed for other objectives.
```

## Systems and Routing
```
systems_involved:
  - system_name: Power-Analyst skill
    role: document who controls fairness metric selection
    integration_type: skill composition
  - system_name: Philosopher skill
    role: articulate normative framework and assumptions
    integration_type: skill composition
  - system_name: Red-Team skill
    role: test fairness claims adversarially
    integration_type: skill composition
  - system_name: AI system being tested
    role: subject of fairness testing
    integration_type: api

integration_sequence:
  1. Power-Analyst runs structural analysis
  2. Philosopher documents fairness assumptions
  3. Fairness metrics implemented
  4. Red-Team conducts adversarial testing
  5. Results delivered with human review requirement

monitoring_required:
  - disparity magnitude across demographic groups
  - number of fairness test failures caught before deployment
  - post-deployment outcome monitoring (do results match fairness predictions?)
```

## Escalation Triggers and Feedback Loop
```
escalate_to_governance_if:
  - fairness testing is deployed without human review gate
  - disparity is >2x but system marked as approved anyway
  - Philosopher framework is documented but not shared with users
  - post-deployment monitoring shows fairness claims were inaccurate

feedback_frequency: weekly during implementation, then on-exception post-deployment
```

---

**Next step:** This governance decision is handed to Hermes, who will design the implementation/routing plan and integrate with deployment systems.
