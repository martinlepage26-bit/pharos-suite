# Authority And Transition Status

## Purpose

Freeze authority after repo-truth arbitration so future implementation cannot proceed under ambiguous names, routes, states, metadata, or runtime claims.

## Binding authority order

1. This document plus [README.md](./README.md) and modules `00` through `10` are the formal design authority.
2. `aurorai/server.py` and `compassai/backend/server.py` remain the current proven runtime authority for live route and behavior claims.
3. Local Worker/TypeScript files under `aurorai/src/`, `compassai/src/modules/`, `shared/`, root TypeScript config files, and `aurorai/wrangler.toml` are provisional scaffolds only.
4. The former standalone CompassAI Worker entrypoint (`compassai/src/index.ts` + `compassai/wrangler.toml`) is retired and must not be treated as a deployable or browser-facing surface.
5. `progress.md` is historical evidence and session reporting only. It is not an authority source for names, contracts, states, schemas, or deployment truth.

## Canonicalization freeze

The following decisions are now binding for future implementation:

| Concern | Binding decision | Temporary compatibility allowance | Blocked until obeyed |
|---|---|---|---|
| Product names | Canonical product/workflow names are `PHAROS`, `CompassAI`, and `Aurora`. | `pharos-suite`, `aurorai/`, `AurorAI`, and `ComPassAI` may remain only where they already identify filesystem, service, or legacy-spec context. | Any new canonical types, routes, APIs, or status records |
| Legacy drift spellings | `AurorA` and `COMPASSai` are not canonical names. | Allowed only when quoting existing drift or describing compatibility debt. | Any new shared constants, types, routes, or payloads |
| Aurora intake route | Canonical intake surface is `POST /api/documents/upload`. | Existing tracked Python runtime remains the current proof point. | Any Worker intake implementation or client contract work |
| Aurora downstream routes | Canonical Aurora downstream surfaces are `POST /api/documents/{doc_id}/evidence-package` and `POST /api/documents/{doc_id}/handoff-to-compassai`. | None beyond tracked runtime proof. | Any extraction or handoff implementation work |
| CompassAI evidence routes | Canonical CompassAI surfaces are `POST /api/v1/evidence` and `GET /api/v1/evidence/use-case/{usecase_id}`. | Hosted governance-program API remains a separate backend contract anchor where explicitly stated in module `07`. | Any Worker governance routing |
| Intake metadata | Canonical intake contract must preserve source/channel/governance/regulatory context, including `artifact_id`, `received_at`, `source_channel`, `source_filename`, `source_mime_type`, `source_hash`, `operator_or_service_identity`, `document_type_hint` when known, `jurisdiction_context` when known, `legal_basis` when personal data is in scope, `purpose_of_processing`, and `retention_profile`. | Unknown values may be recorded as explicit known-unknowns. | Any further Aurora intake coding beyond alignment work |
| Intake state machine | Canonical intake states are `received`, `ingested`, `quarantined`, `classified_ready`, and `rejected`. | Local temporary aliases may be mapped during refactor, but may not become shared authority. | Storage, UI, or API work that exposes intake state |
| Governance-cycle vocabulary | Canonical governance model uses use-case intake, evidence intake, `T0`-`T3` tiering, `known_unknowns`, governance cycles, assessments, and blocking gates `intake_complete`, `risk_assessed`, `controls_satisfied`, `approved_for_deploy`. | None in canonical shared types. | Any CompassAI governance, policy, or approval implementation |
| Evidence package | Canonical evidence package fields are governed by module `04`. | Local draft shapes may exist only as provisional scaffolds. | Any extraction-output or handoff work |
| Handoff envelope | Canonical handoff envelope is governed by module `05` and must be schema-versioned, hash-verifiable, auditable, and append-only. | None for new shared types. | Any Aurora-to-CompassAI integration work |
| Lineage and record families | Canonical recursive record families are governed by module `08`. | Local partial tables may remain as draft work only. | Any schema expansion beyond alignment |
| Regulatory metadata | Canonical regulatory/localization carriage is governed by module `09`. | Existing runtime defaults may remain only as current-state proof, not future contract authority. | Any compliance-support field work |
| Runtime truth | Current proven runtime means the tracked Python services plus the validated Aurora worker intake module only where separately tested. | Local Worker/TypeScript files may be described as provisional future-state scaffolds. | Any claim of Worker parity, readiness, or replacement |
| Deployment truth | `aurorai/wrangler.toml` is not deployment authority while bindings remain unresolved or commented; the former CompassAI worker config is retired. | None. | Any deployability claim or configuration-driven readiness claim |

## Non-authoritative during freeze

The following files or file groups must not act as silent authority while the freeze is active:

| Path | Status during freeze | Override source |
|---|---|---|
| `shared/constants/product-names.ts` | provisional scaffold | modules `01` and `02`, plus this document |
| `shared/types/governance-foundation.ts` | provisional scaffold | modules `01`, `06`, and `07`, plus this document |
| `shared/types/handoff-contract.ts` | provisional scaffold | modules `04`, `05`, and `08`, plus this document |
| `shared/types/lineage.ts` | provisional scaffold | module `08`, plus this document |
| `shared/types/regulatory.ts` | provisional scaffold | module `09`, plus this document |
| `aurorai/src/index.ts` | experimental scaffold | tracked Python runtime plus module `03` |
| `aurorai/src/modules/extraction/*` | experimental scaffold | module `04` |
| `aurorai/src/modules/handoff/*` | experimental scaffold | module `05` |
| `compassai/src/modules/governance-engine/*` | experimental scaffold | module `06` |
| `compassai/src/modules/policy-deliverables/*` | experimental scaffold | module `07` |
| `compassai/src/modules/approval/*` | experimental scaffold | module `07` |
| `compassai/src/modules/handoff/*` | experimental scaffold | module `05` |
| `aurorai/wrangler.toml` | non-authoritative deployment draft | module `10` plus explicit binding confirmation |
| retired `compassai` worker entrypoint | removed from live surface during post-consolidation repair | tracked Python runtime plus PHAROS shell boundary docs |
| `progress.md` | historical evidence only | direct git state, direct file inspection, this pack |

## Implementation reopen gate

Coding may reopen only in this order:

1. Authority documents exist and remain easy to find from [README.md](./README.md).
2. Shared naming, route, state, metadata, and envelope decisions are treated as binding inputs rather than inferred from scaffold code.
3. Aurora intake work may resume only to align local intake code with the frozen authority surface.
4. Aurora extraction, cross-system handoff, CompassAI governance, policy, approval, lineage expansion, and deployment/config work remain blocked until their canonical contracts are normalized against modules `04` through `10`.

## Progress-language rule

Progress files and session notes:

- may report what files were created or changed
- may report what was tested or not tested
- may report what remains blocked
- may not redefine canonical names, routes, states, schemas, or deployment truth
- may not treat file existence as executable capability
- must distinguish `current proven runtime` from `local scaffold`
- must cite this pack when summarizing implementation authority

## Decision effect

Until a future tracked change explicitly promotes an aligned Worker/TypeScript surface, this pack governs design authority and the tracked Python services govern current runtime truth.
