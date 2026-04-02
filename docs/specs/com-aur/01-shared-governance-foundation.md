# Shared Governance Foundation

## Objective

Define the shared rules that every Aurora and CompassAI module must obey before any feature-specific specification is read.

## Shared product model

- `PHAROS` is the public shell.
- `CompassAI` is the governance application within PHAROS.
- `Aurora` is the intake and document-processing workflow within CompassAI.
- `AurorAI` remains the compatibility/service label for the current intake-and-IDP backend.
- `ComPassAI` remains the architecture/spec alias for the governance layer where legacy materials use that spelling.

## Shared architectural flow

`artifact intake -> classification -> extraction -> control checks -> evidence package -> governance intake -> risk/policy/deliverables -> approval -> reassessment`

## Shared claim discipline

Every major module section must answer:

1. What is being claimed?
2. What mechanism supports it?
3. What consequence domain is affected?

No module may promote itself above:

- current InfraFabric registry status
- current backend/runtime proof
- current browser-surface proof
- current jurisdictional freshness date

## Shared non-goals

This modular pack does not:

- rename repos, env vars, routes, or storage keys
- claim standalone production frontends for Aurora or CompassAI
- turn roadmap integrations into current capabilities
- convert generated deliverables into compliance certification

## Shared artifact rules

- Evidence packages are append-only.
- Assessments are append-only.
- A new run creates a new record; it does not silently rewrite the old one.
- A new evidence arrival after assessment creates reassessment pressure.
- Missing lineage downgrades the exposed state; it does not justify inferred completeness.

## Shared actors

- `operator`: submits or manages intake and document processing
- `extractor`: runs Aurora processing steps
- `validator`: reviews low-confidence or policy-triggered outputs
- `risk_owner`: reviews risk logic and uncertainty fields
- `approver`: signs deployability decisions
- `governance_admin`: owns policy/version/freshness maintenance
- `auditor`: external or internal reviewer with read-only evidence expectations

## Shared state rules

- `intake_complete` is not the same as `approved_for_deploy`.
- `hash_verified` is not the same as `correct`.
- `generated` is not the same as `legally sufficient`.
- `preview` is not the same as `production-grade`.

## Source anchors

- `docs/COM-AUR-specs-v3-infrafabric-implemented-2026-03-06.md`
- `docs/pharos-product-boundaries.md`
- `aurorai/README.md`
- `compassai/README.md`

