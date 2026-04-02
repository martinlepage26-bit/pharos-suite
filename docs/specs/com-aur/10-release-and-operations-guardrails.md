# Release And Operations Guardrails

## Purpose

Provide the short operational rules that keep derivative specs, proposals, and rollout notes from outrunning the evidence.

## Current runtime guardrails

- treat PHAROS as the current browser shell
- treat Aurora and CompassAI backends as current proven runtimes
- do not present staged frontends as shipped standalone products
- do not present roadmap modules as live enforcement gates

## Metrics guardrail

Processing time, accuracy, coverage, and cycle-time numbers remain:

- design targets
- deployment-specific until locally baselined
- non-benchmark figures unless independently audited

## Blocked release claims

Do not claim:

- Aurora or CompassAI are automatically compliant with GDPR, HIPAA, EU AI Act, or similar frameworks
- CompassAI certifies compliance
- automated `if.gov.council` runtime exists today
- hard `if.switchboard` deployment enforcement is current
- `compass_cli` is shipped
- design targets are audited benchmarks

## Required reviewer checks before external use

1. confirm the current module/runtime status being referenced
2. confirm the relevant jurisdiction freshness date
3. confirm whether the statement is about backend truth, staged frontend intent, or roadmap direction
4. confirm the statement cites evidence or is explicitly marked as future state

## Open gaps that must remain visible

- standalone frontend completeness remains unproven
- Quebec/French disclosure defaults need explicit configuration
- hard technical deploy gating is not yet a current claim
- backend architecture cleanup remains in progress

## Source anchors

- `docs/COM-AUR-specs-v3-infrafabric-implemented-2026-03-06.md`
- `docs/pharos-product-boundaries.md`
- `compassai/docs/governance-program-roadmap.md`
- `compassai/docs/backend-consolidation-plan.md`
