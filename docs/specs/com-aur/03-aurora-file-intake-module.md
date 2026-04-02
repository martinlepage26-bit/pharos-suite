# Aurora File Intake Module

## Module purpose

The file intake module is the governed entrypoint for source artifacts entering Aurora. Its job is to create a stable artifact identity and a reviewable first state before extraction begins.

## Responsibilities

- accept file uploads from approved channels
- create artifact identity
- compute source hash at intake
- store source file and derived preview text
- record source channel and source identity
- capture minimum legal and operational metadata needed before downstream processing
- move the artifact into a reviewable `ingested` state

## Current interface

- `POST /api/documents/upload`

## Recommended input channels

- browser upload through the CompassAI/Aurora route
- authenticated API upload
- mailbox/drop-folder/API adapters as future channels

## Required intake metadata

Minimum fields for the spec:

- `artifact_id`
- `received_at`
- `source_channel`
- `source_filename`
- `source_mime_type`
- `source_hash`
- `operator_or_service_identity`
- `document_type_hint` if known
- `jurisdiction_context` if known
- `legal_basis` when personal data processing is in scope
- `purpose_of_processing`
- `retention_profile`

If legal basis or jurisdiction is unknown at intake, the artifact may still be stored, but the unknown must be recorded explicitly and carried forward.

## State model

| State | Meaning |
|---|---|
| `received` | bytes accepted but validation not yet complete |
| `ingested` | file stored, hash computed, preview captured, audit event written |
| `quarantined` | stored but blocked from normal processing pending security, format, or legal clarification |
| `classified_ready` | minimum intake requirements satisfied and ready for classification |
| `rejected` | upload rejected with explicit reason |

## Control rules

- upload success does not imply classification success
- intake success does not imply compliance sufficiency
- a missing legal basis for personal data is a recorded gap, not silent acceptance
- source hash must be computed before the artifact can be treated as `ingested`
- every intake event writes an audit event

## Storage rule

Current local truth:

- local uploads directory and Mongo-backed metadata remain the live implementation

Target architecture direction:

- object payload in `R2`
- state and lineage in `D1`

This spec does not claim the target storage model is already live.

## Acceptance criteria

- every accepted artifact has a stable `artifact_id`
- every accepted artifact has a `source_hash`
- every accepted artifact has a first audit event
- ambiguous intake context is recorded as `known_unknowns`
- the artifact cannot present itself as governance-ready at intake alone

## Open gaps

- current local uploads dependency remains operational debt
- richer pre-ingest jurisdiction and retention validation is not yet proven as a hard gate
- standalone browser intake surface is not currently proven outside PHAROS

## Source anchors

- `docs/COM-AUR-specs-v3-infrafabric-implemented-2026-03-06.md`
- `docs/d1-r2-endpoint-mapping.md`
- `docs/govern-suite-operations-runbook.md`
- `aurorai/README.md`
- `aurorai/docs/infrafabric-alignment-v2.md`

