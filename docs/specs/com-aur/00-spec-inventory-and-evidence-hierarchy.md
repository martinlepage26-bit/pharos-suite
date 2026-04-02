# Spec Inventory And Evidence Hierarchy

## Governing object

This packet is a source-tree plus control-design problem. The software model is recursive, but the current documentation is partly monolithic and partly scattered across product, migration, and operations notes.

## Archive map

### Source-bearing artifacts

- `docs/COM-AUR-specs-v3-infrafabric-implemented-2026-03-06.md`
- `compassai/docs/governance-program-openapi.yaml`

### Generated synthesis artifacts

- `aurorai/memory/PRD.md`
- `compassai/memory/PRD.md`

### Control artifacts

- `docs/pharos-product-boundaries.md`
- `aurorai/README.md`
- `compassai/README.md`
- `aurorai/docs/infrafabric-alignment-v2.md`
- `compassai/docs/infrafabric-alignment-v2.md`
- `docs/d1-r2-endpoint-mapping.md`
- `memory/module-map-com-aur-v0-1.md`
- `compassai/docs/governance-program-roadmap.md`
- `compassai/docs/governance-program-migration-guide.md`
- `compassai/docs/backend-consolidation-plan.md`
- `docs/govern-suite-operations-runbook.md`

### Visualization / presentation artifacts

- None were used as claim-bearing sources in this pass.

## Evidence hierarchy

1. `COM-AUR-specs-v3...md` is the closest thing to the canonical product spec, but it is too merged to serve clean module ownership.
2. `governance-program-openapi.yaml` is stronger than roadmap prose for the hosted governance-program contract.
3. `pharos-product-boundaries.md` outranks legacy naming habits because it explicitly governs current browser truth and rename holds.
4. `README.md`, alignment, migration, and mapping notes are control artifacts. They are reliable for current repo shape, ownership, and state-preservation rules, but they do not promote maturity claims by themselves.
5. `memory/PRD.md` files are useful for product intent and backlog direction, but they must not be treated as proof of current frontend completeness.

## Key findings

### Finding 1

- Claim: Naming drift is the main documentation hazard in the current packet.
- Mechanism: The packet alternates between `AurorAI`, `Aurora`, `ComPassAI`, and `CompassAI`, with each label doing different work in product, service, and architecture layers.
- Consequence domain: documentation, workflow, legitimacy
- Evidence: `docs/pharos-product-boundaries.md`, `memory/module-map-com-aur-v0-1.md`, `docs/COM-AUR-specs-v3...md`

### Finding 2

- Claim: The file-intake module and the governance engine are coupled by behavior but not separated clearly enough by spec ownership.
- Mechanism: Intake, extraction, evidence packaging, handoff, use-case intake, evidence ingest, risk tiering, and approval gates are described across several files with different scopes.
- Consequence domain: workflow, auditability
- Evidence: `docs/COM-AUR-specs-v3...md`, `docs/d1-r2-endpoint-mapping.md`, `docs/govern-suite-operations-runbook.md`, `compassai/docs/governance-program-openapi.yaml`

### Finding 3

- Claim: The current packet is vulnerable to method lock.
- Mechanism: The merged spec is polished enough that derivative readers can mistake narrative completeness for implemented completeness, especially around frontend maturity, automated governance features, and regulatory posture.
- Consequence domain: release, review, legitimacy
- Evidence: `docs/COM-AUR-specs-v3...md`, `compassai/memory/PRD.md`, `compassai/docs/governance-program-roadmap.md`

## Recursive risks

- Re-entry: PRDs and roadmap notes can re-enter as if they were current runtime proof.
- Admissibility drift: browser-surface claims, backend proof, and future-storage migration notes are mixed unless separated.
- Method lock: the merged spec can become the only visible account and flatten the distinction between product contract and implementation direction.
- Missing interruption point: there was no compact index telling a reviewer which file settles which question.

## Controls

| finding | mechanism | control | owner | evidence | review_interval | consequence_domain |
|---|---|---|---|---|---|---|
| Naming drift | mixed labels across layers | Maintain a three-layer naming table and require every spec to declare which layer it is speaking about | spec owner | `02-product-boundaries-and-naming.md` | every spec edit | documentation |
| Intake/governance coupling ambiguity | responsibilities split across files | Separate Aurora intake, Aurora evidence, handoff, and CompassAI governance into distinct modules with explicit interfaces | product architecture owner | this modular pack | each release checkpoint | workflow |
| Overclaim risk | polished merged narrative | Keep claim-boundary and release-guardrail modules separate from product-feature modules | governance owner | `01`, `09`, `10` modules | monthly | legitimacy |
| Frontend maturity drift | PRD and staged frontend notes | Treat backend/API contracts as current proof; treat frontend workbench language as staged unless separately verified | product owner | `02`, `07` modules | each external spec update | release |

## Bounded conclusion

This packet supports a modular rewrite. It does not support claiming new runtime behavior, new frontend completeness, or stronger regulatory maturity than the current sources prove.

