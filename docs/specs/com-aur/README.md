# COM-AUR Modular Spec Pack

This pack restructures the current `AurorAI` / `Aurora` and `ComPassAI` / `CompassAI` specs into explicit modules without changing application code.

## Authority status

- Formal design authority for future implementation lives in this pack.
- Read [00a-authority-and-transition-status.md](./00a-authority-and-transition-status.md) before treating any local code, progress note, or scaffold file as authoritative.
- Current proven runtime truth remains the tracked Python backends in `aurorai/server.py` and `compassai/backend/server.py`.
- Local Worker/TypeScript files under `aurorai/src/`, `compassai/src/modules/`, `shared/`, and `aurorai/wrangler.toml` are provisional scaffolds unless and until they are aligned to this pack and explicitly promoted.
- The former standalone CompassAI Worker entrypoint (`compassai/src/index.ts` + `compassai/wrangler.toml`) was retired during the post-consolidation repair pass and is no longer part of the live module surface.
- `progress.md` is historical evidence and session reporting only. It does not define canonical names, routes, states, schemas, or deployment truth.

## Governing object

This packet is primarily a control-design problem over a recursive workflow:

`Aurora file intake -> extraction -> evidence package -> CompassAI governance intake -> risk/policy/deliverables -> approval -> reassessment`

## How to read this pack

1. Start with [00a-authority-and-transition-status.md](./00a-authority-and-transition-status.md).
2. Then read [00-spec-inventory-and-evidence-hierarchy.md](./00-spec-inventory-and-evidence-hierarchy.md).
3. Use [01-shared-governance-foundation.md](./01-shared-governance-foundation.md) and [02-product-boundaries-and-naming.md](./02-product-boundaries-and-naming.md) before reading any product module.
4. For Aurora intake and document processing, read [03-aurora-file-intake-module.md](./03-aurora-file-intake-module.md) and [04-aurora-extraction-controls-and-evidence.md](./04-aurora-extraction-controls-and-evidence.md).
5. For the cross-system contract, read [05-cross-system-evidence-handoff.md](./05-cross-system-evidence-handoff.md).
6. For CompassAI governance behavior, read [06-compassai-governance-engine.md](./06-compassai-governance-engine.md) and [07-compassai-policy-deliverables-and-approval.md](./07-compassai-policy-deliverables-and-approval.md).
7. For persistence and recursion, read [08-data-lineage-storage-and-recursion.md](./08-data-lineage-storage-and-recursion.md).
8. For jurisdiction and release boundaries, read [09-regulatory-boundaries-and-localization.md](./09-regulatory-boundaries-and-localization.md) and [10-release-and-operations-guardrails.md](./10-release-and-operations-guardrails.md).

## Retrieved current spec packet

### Source-bearing artifacts

| File | Role |
|---|---|
| `docs/COM-AUR-specs-v3-infrafabric-implemented-2026-03-06.md` | Legacy merged product spec for AurorAI + ComPassAI |
| `compassai/docs/governance-program-openapi.yaml` | Current governance-program API contract |

### Generated synthesis / product-direction artifacts

| File | Role |
|---|---|
| `aurorai/memory/PRD.md` | Aurora product-direction PRD mixed with backend truth |
| `compassai/memory/PRD.md` | CompassAI PRD mixed with target state and historical notes |

### Control and boundary artifacts

| File | Role |
|---|---|
| `docs/pharos-product-boundaries.md` | Canonical naming and browser-boundary rules |
| `aurorai/README.md` | Current Aurora runtime and boundary summary |
| `compassai/README.md` | Current CompassAI runtime and boundary summary |
| `aurorai/docs/infrafabric-alignment-v2.md` | Aurora recursive-state alignment note |
| `compassai/docs/infrafabric-alignment-v2.md` | CompassAI governance-cycle alignment note |
| `aurorai/frontend/README.md` | Aurora frontend boundary note |
| `compassai/frontend/README.md` | CompassAI frontend boundary note |
| `compassai/frontend/src/features/governanceProgram/README.md` | Staged hosted-workbench scope note |
| `docs/d1-r2-endpoint-mapping.md` | Storage migration map for Aurora + CompassAI endpoints |
| `memory/module-map-com-aur-v0-1.md` | Early responsibility split and module map |
| `compassai/docs/governance-program-roadmap.md` | Governance-program roadmap |
| `compassai/docs/governance-program-migration-guide.md` | Hosted governance-program migration instructions |
| `compassai/docs/backend-consolidation-plan.md` | Backend architecture cleanup plan |
| `docs/govern-suite-operations-runbook.md` | Current local operating model and handoff commands |

### Adjacent architecture notes worth keeping in scope

| File | Role |
|---|---|
| `docs/infrafabric-d1-r2-recursive-schema.md` | Recursive storage schema proposal |
| `compassai/docs/ledger-layer-1.md` | Additive ledger layer note |
| `compassai/docs/pharos-method-integration.md` | Method-pack integration note |
| `docs/free-first-architecture.md` | Hosting and public/private boundary note |

## New modular pack

| Module | Purpose |
|---|---|
| `00a` | Authority freeze, runtime-truth boundary, and transition status |
| `00` | Evidence hierarchy and control findings |
| `01` | Shared governance foundation |
| `02` | Product boundaries and naming rules |
| `03` | Aurora file intake module |
| `04` | Aurora extraction, controls, and evidence package |
| `05` | Cross-system evidence handoff contract |
| `06` | CompassAI governance engine |
| `07` | CompassAI policy, deliverables, and approval workflow |
| `08` | Data lineage, storage, and recursion |
| `09` | Regulatory boundaries and localization |
| `10` | Release and operations guardrails |

## Editorial rule for this pack

The modular pack may clarify, split, and normalize the legacy material, but it may not silently upgrade:

- deployment maturity
- frontend completeness
- regulatory status
- InfraFabric registry status
- current runtime shape

This pack also overrides local scaffold convenience. If a Worker/TypeScript file, progress note, or placeholder schema conflicts with this pack, the pack wins unless the tracked runtime proves a narrower current-state exception.
