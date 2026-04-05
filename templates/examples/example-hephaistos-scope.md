# Example: HEPHAISTOS Scope Definition

## Scope Identity
```
scope_id: SCOPE-2026-04-05-0001
task_name: Implement bias testing framework for agent systems
forged_by: HEPHAISTOS v1.0
timestamp: 2026-04-05T09:00:00Z
```

## Artifact Definition
```
artifact_type: system
artifact_name: Fairness Review Stack
artifact_scope: A skill composition for testing algorithmic fairness in AI systems before deployment. Includes demographic parity testing, equalized odds validation, and calibration assessment across protected attributes. Does NOT include: data collection, real-world deployment testing, continuous monitoring post-launch, or policy interpretation.
artifact_consequence_domain: external (affects users outside the system)
```

## Evidence Requirements
```
evidence_threshold: rigorous
required_evidence:
  - peer-reviewed fairness metrics definitions
  - test case results across demographic groups
  - disparity magnitude calculations
  - sensitivity analysis on threshold settings
  - integration verification with deployment pipeline
evidence_gaps: industry standards for fairness thresholds vary; this implementation uses NIST AI RMF definitions as baseline but may need refinement based on domain
```

## Stakeholder Analysis
```
primary_audience: AI system developers and quality teams deploying algorithmic systems
secondary_stakeholders:
  - downstream users of AI systems
  - compliance/governance teams
  - data protection officers
vulnerable_populations:
  - protected classes (race, gender, age, disability)
  - historically marginalized groups
  - populations with limited data representation
```

## Decision Dependencies
```
depends_on:
  - SCOPE-2026-04-01-0005 (skill composition framework must be operational)
blocks:
  - any agent/algorithm deployment that lacks fairness testing
cross_domain_dependencies:
  - Power-Analyst needs to map who controls fairness criteria definition
  - Philosopher needs to evaluate what "fairness" means in this domain
```

## Forging Questions (Diamond Eyes Integration)
```
does_this_serve_flourishing: unknown
wisdom_constraints:
  - Fairness testing must not become a rubber-stamp gate that creates false sense of equity
  - Must preserve transparency about tradeoffs in fairness metrics
  - Must avoid perpetuating whose definition of fairness is centered
flagged_concerns:
  - Risk of algorithmic fairness being used to legitimize biased systems
  - Whose perspective defines what counts as "fair"?
  - How do we handle legitimate reasons for differential outcomes vs. discriminatory ones?
```

## Escalation Triggers
```
escalate_if:
  - Queen Keyport identifies fundamental incompatibility with other constraints
  - Right-arms disagree about what fairness means
  - Evidence gathering reveals fairness testing cannot be operationalized
```

---

**Next step:** This scope is handed to Queen Keyport, who will synthesize it with inputs from Philosopher and Power-Analyst, then issue a Governance Decision.
