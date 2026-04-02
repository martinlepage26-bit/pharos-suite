# CompassAI Policy, Deliverables, And Approval

## Module purpose

Specify how CompassAI turns tiered evidence into blocking controls, deliverables, and explicit approval states.

## Policy engine

Each policy rule must define:

- `when`
- required controls
- required deliverables
- receipt or review markers
- `gaps_if_unmet`
- policy version

Policy rules may not require capabilities that exist only at roadmap status.

## Deliverable generator

Core deliverables:

- use-case record
- model card
- risk assessment
- DPIA when applicable
- monitoring plan
- approval record
- audit trail export

Generation rule:

- evidence-derived fields remain traceable to source evidence
- manual additions are allowed only as timestamped operator notes
- manual additions must never masquerade as evidence-derived facts

## Approval workflow

Blocking gates:

1. `intake_complete`
2. `risk_assessed`
3. `controls_satisfied`
4. `approved_for_deploy`

Overrides:

- allowed only with explicit reason
- actor identity and timestamp required
- override path remains visible to auditors

## Roles

- `governance_admin`
- `risk_owner`
- `approver`
- `independent_reviewer` for T3

## Governance-program API note

The hosted governance-program integration is real at the backend/API-contract level.

Canonical contract:

- `compassai/docs/governance-program-openapi.yaml`

Supporting control docs:

- `compassai/docs/governance-program-roadmap.md`
- `compassai/docs/governance-program-migration-guide.md`

This module does not claim a complete standalone CompassAI browser workbench is already shipped.

## Acceptance criteria

- every blocked gate has a concrete unmet condition
- every generated deliverable cites or links back to evidence
- every policy version change can trigger reassessment without rewriting history
- every approval record names the actual approving role

## Open gaps

- `compass_cli` is not a shipped binary
- Quebec/French disclosure templates need explicit locale configuration
- policy version collections and cleaner service extraction remain architecture follow-up work

## Source anchors

- `docs/COM-AUR-specs-v3-infrafabric-implemented-2026-03-06.md`
- `compassai/docs/governance-program-openapi.yaml`
- `compassai/docs/governance-program-roadmap.md`
- `compassai/docs/governance-program-migration-guide.md`
- `compassai/docs/backend-consolidation-plan.md`

