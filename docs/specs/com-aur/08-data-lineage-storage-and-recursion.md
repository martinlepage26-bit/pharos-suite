# Data Lineage, Storage, And Recursion

## Purpose

Preserve the recursive governance method in storage and status exposure. The core rule is simple: never flatten a recursive process into one mutable record.

## Current persistence truth

- Aurora and CompassAI currently rely on Mongo-backed state
- Aurora also relies on local uploads storage
- the D1/R2 model is a target migration pattern, not the current runtime proof

## Required linked records

| Record family | Why it exists |
|---|---|
| `artifacts` / source objects | stable artifact identity |
| `artifact_versions` | source lineage when content changes |
| `processing_runs` | one record per classification/extraction/summary/citation pass |
| `control_checks` | explicit record of gate decisions |
| `review_decisions` | human intervention history |
| `evidence_packages` | append-only handoff envelopes |
| `handoff_history` | attempt, success, failure states |
| `use_cases` | canonical governance subject |
| `governance_cycles` | lifecycle/reopen lineage |
| `assessments` | tiering and control outputs |
| `feedback_actions` | reassessment pressure and reopen signals |
| `audit_events` | readable event stream across the system |

## Recursive rules

- reclassification creates a new processing run
- re-extraction creates a new processing run
- new evidence package creates a new package row and may supersede the prior package
- new evidence after assessment may open a new governance cycle
- reassessment creates a child assessment or linked next assessment

## Status exposure rule

If the supporting linked records are missing:

- expose the narrower state
- do not infer readiness
- do not smooth over gaps with narrative language

Examples:

- file uploaded but preview missing -> still `ingested`, not review-ready
- package received but hash not verified -> received, not governance-accepted
- assessment exists but uncertainty fields empty -> incomplete, not publishable

## Target storage direction

- object payloads in `R2`
- metadata and recursive state in `D1`

This improves clarity, but the method matters more than the platform.

## Acceptance criteria

- every status shown to an operator is backed by persistent lineage
- no new pass silently deletes the old one
- no governance state is stronger than the stored evidence chain

## Source anchors

- `docs/d1-r2-endpoint-mapping.md`
- `docs/infrafabric-d1-r2-recursive-schema.md`
- `aurorai/docs/infrafabric-alignment-v2.md`
- `compassai/docs/infrafabric-alignment-v2.md`

