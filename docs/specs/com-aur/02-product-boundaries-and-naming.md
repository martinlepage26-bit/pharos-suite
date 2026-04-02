# Product Boundaries And Naming

## Purpose

Resolve naming drift without requiring filesystem or runtime renames in this pass.

## Canonical naming table

| Layer | Canonical name in this pack | Compatibility names still in use | Rule |
|---|---|---|---|
| Public shell | `PHAROS` | `pharos-suite` | Public/browser shell only |
| Governance product | `CompassAI` | `ComPassAI` | Use `CompassAI` for product/runtime naming; reserve `ComPassAI` for legacy architecture references |
| Intake workflow | `Aurora` | `AurorAI`, `aurorai/` | Use `Aurora` for product/workflow naming; reserve `AurorAI` for current service/spec alias |
| Governance engine | `CompassAI governance engine` | `ComPassAI governance layer` | Same engine, different legacy labels |
| File intake module | `Aurora file intake module` | `AurorAI upload/intake`, `artifact intake` | Intake ownership stays with Aurora |

## Current browser truth

- Current browser surface lives in PHAROS.
- Current user-facing routes are `/portal/compassai` and `/portal/compassai/aurora`.
- `/portal/aurorai` is a compatibility redirect, not proof of a sibling standalone product.

## Current runtime truth

- Current proven Aurora runtime is the FastAPI backend in `aurorai/server.py`.
- Current proven CompassAI runtime is the FastAPI backend in `compassai/backend/server.py`.
- Staged frontends under `aurorai/frontend/` and `compassai/frontend/` remain incomplete unless separately proven by runnable manifests and route validation.

## Interface ownership

| Concern | Owning module |
|---|---|
| Public positioning and shared shell | PHAROS |
| File upload, preview text, document classification, extraction | Aurora |
| Evidence package generation and handoff initiation | Aurora |
| Use-case registry, evidence acceptance, risk tiering, policy mapping | CompassAI |
| Deliverable generation, approval workflow, governance audit trail | CompassAI |

## Rename hold

Do not rename in this pass:

- filesystem paths
- package names
- route mechanics
- env vars
- deploy identifiers
- storage keys

## Editorial rule

Any future spec that uses `AurorAI` or `ComPassAI` must declare whether it means:

- product/workflow layer
- service/repo layer
- architecture alias layer

If it does not, the document is ambiguous by default.

## Source anchors

- `docs/pharos-product-boundaries.md`
- `aurorai/README.md`
- `compassai/README.md`
- `memory/module-map-com-aur-v0-1.md`

