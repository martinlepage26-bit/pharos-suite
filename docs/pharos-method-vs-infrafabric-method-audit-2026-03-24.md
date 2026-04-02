# PHAROS Method vs InfraFabric Method

Date: 2026-03-24
Status: synthesized from read-only repo audit notes
Scope: method comparison + implementation-fit mapping

## Purpose

Convert the working audit notes into a structured, reusable comparison between:

- PHAROS conceptual/practice method
- InfraFabric control-architecture method (as represented in this repository)

## Governing Object

This packet is centered on a **control design comparison problem**:

- PHAROS defines the public/practice-facing method language
- InfraFabric defines the evidentiary and claim-boundary substrate

The question is not "which method is better"; the question is whether PHAROS is compatible with InfraFabric and where implementation deltas remain.

## Packet Audited

- `docs/COM-AUR-specs-v3-infrafabric-implemented-2026-03-06.md`
- `docs/infrafabric-d1-r2-recursive-schema.md`
- `docs/d1-r2-endpoint-mapping.md`
- `docs/public-backend-plan.md`
- `docs/free-first-architecture.md`
- `infra/d1/README.md`
- `infra/d1/001_init_govern_suite.sql`
- `docs/principles-alignment-2026-03-06.md`
- `docs/pharos-site-messaging-architecture-2026-03-11.md`
- PHAROS method baseline: `frontend/src/pages/About.js`
- PHAROS method framing: `frontend/src/pages/Home.js`

## Executive Summary

PHAROS Method is mostly a **layered translation** of InfraFabric method logic, not a separate philosophical system.

- Shared core: evidence-first claims, fail-closed posture, recursion with lineage, bounded public claims
- Layer difference: PHAROS emphasizes public/practice diagnostics; InfraFabric emphasizes admissibility, module-status floors, and runtime claim boundaries
- Main delta: PHAROS names comparative and failure artifacts more explicitly than the current D1 schema makes first-class

## Direct Alignment

| Domain | PHAROS signal | InfraFabric signal | Result |
|---|---|---|---|
| Evidence-first claim discipline | Claims tied to evidence and explicit thresholds (`frontend/src/pages/About.js:610`) | Capability claims constrained by registry/evidence floor (`docs/COM-AUR-specs-v3-infrafabric-implemented-2026-03-06.md:25`, `:131`) | aligned |
| Fail-closed posture | Missing lineage/evidence narrows state (`frontend/src/pages/About.js:625`) | Missing lineage/evidence keeps state provisional (`docs/infrafabric-d1-r2-recursive-schema.md:18`) | aligned |
| Recursive governance | Recursive return pass and control extraction (`frontend/src/pages/About.js:68`, `:75`) | Parent-linked runs/cycles/assessments and reopen loops (`docs/infrafabric-d1-r2-recursive-schema.md:313`, `docs/d1-r2-endpoint-mapping.md:413`) | aligned |
| Public overclaim prevention | Method language emphasizes inspectable controls over rhetoric (`frontend/src/pages/Home.js:49`) | Registry floor and non-claim discipline enforce boundaries (`docs/COM-AUR-specs-v3-infrafabric-implemented-2026-03-06.md:141`, `:145`) | aligned |

## Main Differences

| Layer | PHAROS method emphasis | InfraFabric method emphasis |
|---|---|---|
| Primary orientation | Governance practice under scrutiny (pressure -> thresholds -> decisions -> evidence path) | Governance infrastructure and claim admissibility (status floors, evidence hierarchy, module boundaries) |
| Public language | Legibility, review pressure, control response, reconstructibility (`docs/pharos-site-messaging-architecture-2026-03-11.md`) | Registry-anchored claim taxonomy (`proven` / `bounded` / `non-claim`) and strict deployment-state boundaries (`docs/COM-AUR-specs-v3-infrafabric-implemented-2026-03-06.md:131`) |
| Diagnostic depth | Cultural probes, semantic drift, failure harvesting (`frontend/src/pages/About.js:109`, `:211`) | Runtime admissibility, policy gate discipline, and module-status non-upgrade rules (`docs/COM-AUR-specs-v3-infrafabric-implemented-2026-03-06.md:141`, `:748`) |

## PHAROS 10-Stage Crosswalk to Current InfraFabric Implementation

| PHAROS stage | Coverage in current packet | Evidence |
|---|---|---|
| 1. Corpus formation | strong | `frontend/src/pages/About.js:39`; `infra/d1/001_init_govern_suite.sql:6`; `docs/d1-r2-endpoint-mapping.md:28` |
| 2. Intent embedding | strong | `frontend/src/pages/About.js:46`; `infra/d1/001_init_govern_suite.sql:133`; `docs/COM-AUR-specs-v3-infrafabric-implemented-2026-03-06.md:727` |
| 3. Multi-model rendering | partial | `frontend/src/pages/About.js:53`; `infra/d1/001_init_govern_suite.sql:60` |
| 4. Triangulation of detached meaning | partial | `frontend/src/pages/About.js:61`; `frontend/src/pages/About.js:64`; `infra/d1/001_init_govern_suite.sql:167` |
| 5. Recursive return pass | strong | `frontend/src/pages/About.js:68`; `docs/infrafabric-d1-r2-recursive-schema.md:313`; `docs/d1-r2-endpoint-mapping.md:377` |
| 6. Control extraction | strong | `frontend/src/pages/About.js:75`; `infra/d1/001_init_govern_suite.sql:85`; `infra/d1/001_init_govern_suite.sql:187` |
| 7. Determinism hardening | strong in doctrine, partial in hard enforcement | `frontend/src/pages/About.js:82`; `docs/infrafabric-d1-r2-recursive-schema.md:38`; `infra/d1/001_init_govern_suite.sql:222` |
| 8. Deployment binding | strong | `frontend/src/pages/About.js:89`; `docs/COM-AUR-specs-v3-infrafabric-implemented-2026-03-06.md:768`; `docs/public-backend-plan.md:54` |
| 9. Failure harvesting | partial | `frontend/src/pages/About.js:96`; `frontend/src/pages/About.js:99`; `infra/d1/001_init_govern_suite.sql` |
| 10. Public articulation | strong | `frontend/src/pages/About.js:103`; `docs/COM-AUR-specs-v3-infrafabric-implemented-2026-03-06.md:131`; `:211` |

## Material Findings

### P1 — Lineage integrity schema gap

Claimed target schema language expects cycle-to-use-case linkage as explicit and non-null in the canonical model (`docs/infrafabric-d1-r2-recursive-schema.md:320`), but current SQL bootstrap allows nullable `use_case_id` on `governance_cycles` and does not add a foreign key to `use_cases` (`infra/d1/001_init_govern_suite.sql:37`).

Consequence domain: recursive governance lineage integrity.

### P1 — Append-only posture is documented more strongly than DB-enforced

InfraFabric docs and README describe append-only and fail-closed discipline (`infra/d1/README.md:19`, `docs/infrafabric-d1-r2-recursive-schema.md:401`), but current SQL contains no explicit immutable-event trigger/constraint layer preventing destructive mutation in `audit_events`/lineage tables (`infra/d1/001_init_govern_suite.sql`).

Consequence domain: enforcement credibility under hostile or accidental mutation.

### P2 — Comparative/failure artifact model gap

PHAROS method calls out first-class comparative and failure artifacts (comparison matrix, contradiction register, near-miss/asymmetry artifacts) (`frontend/src/pages/About.js:64`, `:99`), but current D1 schema does not explicitly model these as dedicated first-class record families.

Consequence domain: method fidelity at implementation layer.

## Net Assessment

Best-fit framing:

- PHAROS Method = public/operator method layer
- InfraFabric Method = evidentiary/control substrate layer

These are compatible and mutually reinforcing, not competing frameworks.

Primary unresolved delta is implementation completeness for certain PHAROS comparative/failure artifacts, not philosophical misalignment.

## Claim Boundary

This memo supports:

- structural comparison between PHAROS and InfraFabric method layers in this repository
- bounded findings about documented-vs-implemented deltas in the current D1 model

This memo does not support:

- certification or legal-compliance conclusions
- claims about external InfraFabric runtime state beyond what is represented in this repository packet
