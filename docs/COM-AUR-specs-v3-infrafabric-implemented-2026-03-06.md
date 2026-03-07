# AurorAI + ComPassAI — Specification Sheets (InfraFabric-Implemented, Bible-Compliant)

Martin Lepage | consult@govern-ai.ca | Govern AI — AI Governance Practice and Research | 2026-03-06

**Status:** `review`
**Last review date:** 2026-03-06
**Next checkpoint date:** 2026-04-06
**Accountable and responsible approver:** Martin Lepage | consult@govern-ai.ca
**InfraFabric framework contributor and designated reviewer:** Danny Stocker | ds@infrafabric.io | InfraFabric Research
**Provenance note:** AurorAI and ComPassAI are original products of Martin Lepage, developed under GovernAI. Their governance architecture and claim-boundary discipline are built on InfraFabric's structural framework with explicit permission from Danny Stocker, owner of InfraFabric.
**Backup reviewer/operator:** TBD — open continuity risk; must be named before next checkpoint or this risk remains explicitly unresolved.
**LLM-assist disclosure:** Synthesized and revised with Claude Sonnet assistance on 2026-03-06; accountable human author remains Martin Lepage.
**Alignment basis:** InfraFabric module registry `if.registry.json` rechecked live on `2026-03-06`, supplemented by module-specific explainers in the local InfraFabric source corpus (`C:\Users\softinfo\Documents\InfraFabric`) and blackboard-confirmed posture from `2026-03-06T08:04:14Z` (IF-2348 evidence bundle).
**Style guide:** if.whitepapers.bible v4.23
**agent_surface:** none (human-operator document; typed payload requirement waived per bible Section 5.1)

**Version lineage:** This document supersedes `COM-AUR-specs-v2-final (2).md` and `COM-AUR-specs-aligned.md` (2026-03-06 alignment baseline). This revision implements module-specific InfraFabric source explainers, corrects live registry posture for `if.knowledge`, and adds an explicit source-to-processing annex so external reviewers can trace each product claim back to a canonical module explainer and a no-login verification surface.

## Governance Architecture

AurorAI and ComPassAI are built on a single constraint: governance documentation is only as credible as the evidence it derives from, and no capability claim in either product exceeds what the underlying infrastructure currently supports.

Both products are original creations of Martin Lepage, developed under GovernAI. Their technical architecture and claim-boundary discipline are built on InfraFabric's governance framework, used with permission from Danny Stocker, InfraFabric's owner.

InfraFabric's framework does specific structural work here. It supplies the registry-pinned module status system that prevents capability claims from outrunning deployment reality, the evidence hierarchy that distinguishes what is publicly verifiable from what requires operator configuration, and the fail-closed posture that treats uncertainty as a reason to downgrade claims rather than smooth them over.

Where InfraFabric modules are integrated into AurorAI or ComPassAI, each is described at its actual registry status: `shipped`, `preview`, or `roadmap`. That status is the floor of what can be claimed, not a starting point for negotiation.

The implication is deliberate and non-optional: an AI governance platform that overstates its own capabilities cannot credibly govern the AI systems of others. GovernAI therefore holds itself to the same evidentiary standard it asks of every system it governs.

This is not an incidental design preference. It reflects a shared conviction: AI governance platforms must hold themselves to the same standard of honesty, auditability, and claim discipline that they ask of the systems they govern.

**Canonical publication boundary:**
- Published canonical surface: `docs/` repo and reviewer distribution copies of `COM-AUR-specs-v3-infrafabric-implemented-2026-03-06.md`
- Draft/internal surface: `/home/claude/` working directory
- Reviewer interpretation rule: outputs directory version is authoritative for current claims.

**Complexity budget justification (bible Section 7.2):** This document exceeds 5,000 words and 15 top-level sections because AurorAI and ComPassAI are two interdependent products sharing a claim boundary framework, a regulatory compliance annex spanning five jurisdictions, and a governance philosophy that must be explained once and applied consistently. Splitting now would require duplicating the claim boundary framework and registry status table in each part, creating cross-reference maintenance debt greater than the complexity of the merged document.

---

## Document Navigation by Audience

Register mode default: `domain-native`. Every section uses literal product, control, and regulatory terms. Analogy is allowed only in the Problem Statement and narrative sections; when any section header contains a control, gate, or compliance term, register switches immediately to literal domain language.

**Executives / Business Leaders** — Sections: Problem Statement, Decision Table, Options Ladder, 30/60/90 Plan. Purpose: understand what the products do, why the architecture is correct, what is not yet proven, and what the path to stronger claims looks like. Register: `abstract-first` for problem framing, `domain-native` for all gate and approval language. Switch trigger: any sentence containing `tier`, `gate`, `DPIA`, or `EU AI Act`.

**Power Users / Operators** — Sections: Core Architecture, Quality Controls Matrix, Implementation Guide, Operating Procedures, Open Findings. Purpose: configure extraction pipelines, set confidence thresholds, run the approval workflow, respond to incidents. Register: `domain-native` throughout. Literal zone starts at Core Architecture.

**Engineers / Implementers** — Sections: Evidence Package Format, InfraFabric Integration, Policy Engine, Deliverable Generation, Approval Workflow. Purpose: integrate AurorAI with source systems, build ComPassAI policy rules, wire if.trace binding. Register: `domain-native` throughout.

**LLM Runtime Developers / Compliance Reviewers** — Sections: Claim Boundary, Registry Status Table, Regulatory Alignment Matrix, Annex A. Purpose: verify claim strength against module registry, confirm what is and is not certified, audit evidence hierarchy. Register: `domain-native` throughout; abstraction is a publish blocker in these sections.

---

## Who | Why | What | Where | When | How

**Who:** Governance administrators, risk owners, extraction engineers, compliance reviewers, external auditors, and executives approving AI system deployments across multiple jurisdictions.

**Why:** AI document processing pipelines that produce no chain-of-custody evidence create unresolvable audit gaps. Governance documentation that is composed by hand rather than derived from structured evidence is inconsistent, unrepeatable, and breaks down whenever the underlying system changes faster than the documentation cycle. This specification exists because both failure modes are preventable.

**What:** The designed architecture for AurorAI (intelligent document extraction with evidence packages) and ComPassAI (governance workflow engine consuming those packages), including all claim boundaries, InfraFabric integration points, and multi-jurisdiction regulatory alignment posture.

**Where:** AurorAI and ComPassAI deployments; InfraFabric module registry at `https://infrafabric.io/llm/if.registry.json.txt`; blackboard at `https://infrafabric.io/llm/blackboard/index.md.txt`.

**When:** Drafting and review in LLM/operator windows (`30/60/90 minutes | 3/6/9 hours`). Deployment decisions and regulatory compliance determinations are day-scale decisions requiring human legal review. Do not conflate LLM drafting windows with compliance determination timelines.

**How:** Registry-pinned claim boundaries per module, evidence hierarchy table with promotion paths, per-cell coverage markers on all controls matrices, blocked phrases list with bash enforcement, jurisdiction-specific regulatory annex with explicit freshness gates, and operator verification commands including negative-path tests.

---

## Problem Statement

Every organization that deploys AI document processing eventually faces the same audit moment: a regulator, a procurement officer, or an incident investigator asks for the chain of custody on a decision that was made using AI-extracted data, and nobody can produce it. Not because the data was wrong — but because the pipeline that produced it generated no evidence of its own behavior. The logs record that processing happened. They do not record whether the confidence threshold was met, whether PII was detected, whether a human reviewed the low-confidence fields, or why the extraction result was trusted.

This is the structural failure AurorAI and ComPassAI are designed to prevent. AurorAI makes chain of custody the primary output — structured data is the secondary output. ComPassAI turns that chain of custody into auditable governance documentation. Together, they close the gap between "we processed a document" and "we can prove, to a skeptical external reviewer, exactly how that document was processed and who approved the result."

The risk of ignoring this problem is not theoretical. The EU AI Act's high-risk system obligations begin applying to relevant deployment categories between August 2026 and August 2027. Canada's Quebec Law 25 is already in force. US state AI laws — Colorado, California, Illinois, New York City — are in effect or imminent. Organizations that cannot produce governance documentation on demand will face not just regulatory exposure but operational vulnerability: when something goes wrong with an AI-assisted decision, the inability to reconstruct the decision trail is its own liability, independent of whether the decision itself was correct.

The assumption most likely to be wrong in this problem framing: that the governance documentation problem is primarily a compliance problem. It is also an operational problem. Teams that cannot reconstruct why a configuration exists will eventually "improve" it into failure. The AI copilot that suggests cleaning up the rate-limit logic does not know about the Black Friday incident — and without a narrative trail, neither will the next engineer. AurorAI and ComPassAI solve both problems simultaneously.

Invalidation test: if an operator can produce a complete, auditable governance trail for an AI-assisted decision without AurorAI and ComPassAI — using only their existing tooling — then these products add no value for that operator. The correct response to that scenario is not to reframe the products; it is to document it as a scope boundary.

---

## Decision Table

| Decision question | Current answer | Evidence state | Risk if ignored |
|---|---|---|---|
| Does AurorAI produce a chain-of-custody evidence package on every extraction? | Yes, with operator configuration | Evidence package schema is a defined interface contract | Without it, audit trail is narrative, not cryptographic |
| Is ComPassAI governance documentation derived from evidence, not hand-composed? | Yes | Policy engine + deliverable generator consume evidence package fields | Hand-composed docs diverge from actual system behavior |
| Is if.trace binding automatic on every evidence package? | No — operator-triggered for high-risk use cases | `if_trace_receipt: null` in default schema; explicit configuration required | High-risk use cases may lack cryptographic integrity proof |
| Is if.gov.council automated voting deployed? | No — roadmap | `if.gov.council` is `roadmap`; council/triage scripts run locally only | Claiming automated council voting in proposals is an overclaim |
| Is ComPassAI compliance documentation sufficient for regulatory submission? | No — it supports compliance review | Every regulatory alignment row is `preview`, not `certified` | Submitting ComPassAI output as sole compliance evidence is a misrepresentation |
| Are the performance metrics (48h cycle, 15min generation) audited benchmarks? | No — design targets | Design targets on curated test sets; no independent audit | Presenting targets as benchmarks to procurement is a claim boundary violation |

---

## Options Ladder

The governance documentation problem can be addressed three ways. The first is manual documentation: governance teams compose risk assessments, DPIAs, and model cards by hand for each AI use case. This produces high-quality documentation when done well, but it is slow, inconsistent across teams, and breaks down when systems change faster than documentation cycles. It also has no machine-readable audit trail and no cryptographic integrity proof.

The second is template automation: structured templates that operators fill in. This is faster than pure manual documentation but still requires human knowledge of what to enter; the documentation is not derived from the actual system behavior, so it can diverge from reality without detection. When a system configuration changes, the template documentation may not be updated.

The third is evidence-derived documentation, which is what AurorAI and ComPassAI implement: governance documents are generated from the structured evidence that the extraction pipeline produces. The documentation cannot claim more than the evidence supports. Gaps produce gaps, not fabricated content. The audit trail is the evidence chain, not a separate artifact maintained in parallel.

The chosen path is the third. The first two remain available to operators as supplementary approaches — particularly in areas where AurorAI and ComPassAI are not yet deployed, or where legal determinations (legal basis for processing, DPIA necessity, EU AI Act high-risk classification) require human analysis that no automated system should substitute for.

**Psychology friction:** The most common shortcut behavior in governance documentation is completing the intake form with whatever information is already at hand, rather than going back to verify what the system actually does. The form gets filled; the fields get populated; the checkbox gets checked. The documentation exists. It does not match the system. This happens not because operators are careless but because the incentive structure rewards documentation existence, not documentation accuracy. AurorAI and ComPassAI address this structurally — if the evidence package does not contain a field value, the generated deliverable cannot fabricate one. The guardrail is architectural, not procedural. Operators who find themselves wanting to manually edit generated deliverables to fill in missing fields should treat that impulse as a signal that their evidence configuration is incomplete, not as a reason to override the system.

---

## 30/60/90 Plan

**30 days:** Confirm module registry alignment. Verify that all integration points described in this specification match the current registry status. Confirm that no downstream marketing materials claim capabilities that exceed the `preview` status of integrated modules. Run the blocked phrases scan (see Release Language Guardrails section) against any derivative documents produced from this spec.

**60 days:** Complete confidence threshold calibration for at least one production document type per deployment. Establish operator-specific baselines for the success metrics listed in this document before reporting against them. Name the backup reviewer/operator and close the open continuity risk in front matter.

**90 days:** Reassess module registry status for `if.switchboard`, `if.context`, and `if.gov` against the `2026-04-06` checkpoint date. If any module has promoted from `preview` to `shipped`, update this specification's integration claims with supporting evidence before updating release language. Possible valid outcome: no status changes, no language updates required.

---

## Required Posture Block

Black/white:

Verified claims in this document are limited to publicly retrievable bytes and byte-reproducible behaviors. This document does not claim correctness of decisions, completeness of detection, or compliance guarantees. Every InfraFabric module is described at its actual registry status; no module inherits a stronger status from its dependencies.

---

## Claim Boundary — How to Read This Document

Every statement in this document is classified as one of three tiers, which map to the InfraFabric registry hierarchy and the bible's claim taxonomy.

**Proven (verified):** Directly verifiable against public no-login surfaces or operator-local artifacts with known checksums. A skeptical reviewer can reproduce the check without calling anyone, logging in, or accepting any oral claim.

**Bounded (operator-assisted):** The capability exists but with explicit constraints on scope, coverage, or deployment context. The boundary is stated inline, not footnoted. Bounded claims require operator configuration to be realized.

**Non-claim (proposed / intent-only):** The feature is described as a design intent, roadmap item, or property of a dependency module that carries its own `preview` or `roadmap` status. Non-claims are as prominent as claims in this document. Burying them in footnotes is a publish blocker.

The InfraFabric module registry status is the floor of what can be claimed. A `preview` module cannot be described as providing production-grade guarantees. A `roadmap` module cannot be described as currently implemented. This rule is not overridable by business case language, executive approval, or customer pressure.

Registry status reference (`if.registry.json`, last updated `2026-01-20T18:22:23Z`):

| Module | Registry Status | Posture | Claim floor |
|---|---|---|---|
| if.trace | `shipped` | Public no-login surfaces, receipt verification available | Full production claim permitted with evidence |
| if.emotion | `shipped` | Emo-social pipeline live at emo-social.infrafabric.io | Full production claim for emo-social pipeline |
| if.bus | `preview` | Spec published, runtime sandbox internal only | No SLA or exactly-once delivery claims |
| if.blackboard | `preview` | Active internal use, `/llm/blackboard/**` surfaces live | Single-host claims only; fleet deployment non-claim |
| if.api | `preview` | Adapters in development, no production runtime claimed | Adapter design intent only; GA runtime non-claim |
| if.story | `preview` | Protocol/demo artifacts published, no runtime service | Protocol mechanics claim only; deployed service non-claim |
| if.gov | `preview` | Framework documented; council/triage are `roadmap` | Governance philosophy claim; council automation non-claim |
| if.gov.triage | `roadmap` | Concept/spec exists, no public demo | No implementation claims |
| if.gov.council | `roadmap` | Concept/spec exists, no public demo | No implementation claims |
| if.switchboard | `preview` | Active development, first live handshake 2026-03-02T02:43:15Z | Routing design intent; real-time SLA non-claim |
| if.context | `preview` | Staged pipeline documented, no production runtime | Pipeline protocol claim; deployed service non-claim |
| if.knowledge | `preview` | Preview runtime retrieval and graph surfaces exist with strict scope and audit boundaries | Preview runtime-control claims permitted; GA/SLO/truth claims remain non-claims |
| Agent Rook | `preview` | Autonomous operation with air-gap controls, `pass_with_risk` | Conditional autonomous claim; certified operation non-claim |
| if.intelligence / Skydrone | `preview` | Live endpoints at skydrone.infrafabric.io, bounded freshness | Endpoint liveness claim; freshness guarantees non-claim |

Cross-module status inheritance is explicitly forbidden. A module does not inherit `shipped` status from `if.trace` simply because it uses `if.trace` receipts. Each module carries its own evidence boundary.

*If a table entry looks more confident than the registry evidence supports, the table is wrong — not the registry.*

---

## Evidence Hierarchy

| Evidence tier | Current artifact examples | Reviewer reproducibility | Promotion path |
|---|---|---|---|
| Independent (public no-login) | Registry mirror at `/llm/if.registry.json.txt`; blackboard at `/llm/blackboard/index.md.txt`; if.trace receipts at `/if/trace/` | High — curl or browser, no credentials, no operator contact required | Already public; maintain liveness |
| Operator-assisted | AurorAI evidence package schema; confidence threshold calibration outputs; ComPassAI policy rule JSON; deployment-specific baselines | Medium — requires host access or operator-supplied artifact | Publish immutable summary JSON at `/llm/products/com-aur/evidence/weekly-YYYY-MM-DD.json` + `.sha256`; minimum fields: `generated_utc`, `doc_sha256`, `checks`, `source_urls` |
| Intent-only | if.gov.council automated voting; compass_cli binary; multi-host deployment; certified regulatory compliance | Not reproducible — design intent only; no artifact exists | Registry promotion requires: shipped runtime, sustained public evidence, and explicit gate approval |

Freshness rule: operator-assisted evidence older than 7 days must be marked `A-stale` and must not be cited to support promotion-level claims. Independent evidence should be spot-checked for liveness at each 30-day cadence review. Any canonical URL returning `4xx/5xx` is a release blocker for this document until the endpoint or content is fixed.

*If the promotion path column is empty, the claim is not promotable — it is a design intent until evidence exists.*

---

## Reviewer Conclusion Boundary Block

**What reviewers can conclude from this document:**
AurorAI and ComPassAI form a two-layer evidence-and-governance architecture. The evidence package schema is a defined interface contract. The quality controls (HITL, PII masking, confidence thresholds, RBAC, audit logging, hash verification) are designed and configurable. `if.trace` integrity binding is available for critical artifacts. The InfraFabric module integration points are described at accurate registry status. The regulatory alignment posture describes what ComPassAI provides toward compliance, not what it certifies.

**What reviewers cannot conclude from this document:**
That any `preview` module integration provides production-grade reliability guarantees. That ComPassAI governance documentation constitutes regulatory compliance. That the performance metrics (48-hour cycle, 15-minute generation, 90%+ coverage) are independently audited benchmarks. That `if.gov.council` automated voting is a current capability. That `compass_cli` is a shipped binary. That this document is a certification packet, legal submission, or procurement-complete evidence bundle.

---

## Trap

**Risk:** This specification is detailed and structurally rigorous. A reader who absorbs the governance philosophy and claim discipline may conclude the products are more mature than the registry supports. Narrative quality does not equal deployment readiness.

**Do not conclude:**
- That `preview` modules described as integrations are production-ready components.
- That the regulatory annex constitutes legal advice or replaces jurisdiction-specific legal review.
- That evidence packages generated by AurorAI constitute compliance certification by themselves.
- That this document can be excerpted into a sales proposal without running the blocked phrases scan.

**Safe path:** Keep claim language strictly within the registry status of each module. When a client asks "is this compliant with [regulation]?" the answer is "ComPassAI produces governance documentation that supports compliance review; whether your specific deployment satisfies [regulation] requires legal analysis of your use case, data categories, and decision types." Bind any derivative artifacts to if.trace receipts so integrity can be verified independently.

**Evidence links:**
https://infrafabric.io/llm/if.registry.json.txt
https://infrafabric.io/llm/blackboard/index.md.txt
https://infrafabric.io/if/trace/

---

## Release Language Guardrails

**Approved wording:**
- "AurorAI produces structured evidence packages with chain-of-custody records for each document extraction."
- "ComPassAI generates governance documentation from evidence; it supports compliance review and does not constitute certification."
- "if.trace receipts provide cryptographic integrity verification for designated artifacts; binding is operator-configured."
- "The InfraFabric module integrations are described at their current preview or roadmap registry status."

**Blocked wording — enforce with scan below:**
- "AurorAI is HIPAA/GDPR/EU AI Act compliant."
- "ComPassAI certifies regulatory compliance."
- "if.gov council provides automated multi-voice governance."
- "if.switchboard enforces real-time deployment gates."
- "if.knowledge analytics drive impact analysis in real time."
- "compass_cli is available for installation."
- "Metrics are independently audited benchmarks."
- "This specification is a certification packet."

**Bash enforcement (run before publishing any derivative document):**

```bash
rg -n -i "(hipaa compliant|gdpr compliant|eu ai act compliant|certifies regulatory compliance|automated multi-voice governance|enforces real-time deployment gates|knowledge analytics drive|compass_cli is available|independently audited benchmark|certification packet)" <draft.md> \
  && { echo "BLOCKER: blocked phrase hit — fix before publish"; exit 1; } || echo "Phrase scan: PASS"
```

**Escalation wording when uncertain:** "Current evidence supports `preview`-stage claims only; production-grade guarantees and regulatory certification are out of scope in this revision."

*If this document is excerpted without running the phrase scan, the claim discipline it describes will not survive the first sales conversation.*

---
---

# Part One: AurorAI

## Intelligent Document Processing — Specification Sheet

**Status:** `review` — preview-stage specification.
**Not-for line:** This specification is not a certification packet and must not be used as sole evidence for legal, compliance, or procurement approval. It documents designed behavior, implemented controls where evidenced, and explicit non-claims.

---

## Who | Why | What | Where | When | How

**Who:** Extraction engineers configuring pipelines, compliance operators reviewing evidence packages, executives authorizing AI document processing deployments, and external auditors verifying chain-of-custody claims.

**Why:** Generic OCR and document processing tools produce output without governance evidence. When an extraction pipeline has no chain of custody, every downstream automated decision built on its output is unauditable. AurorAI exists to make the evidence trail the primary output.

**What:** An intelligent document processing platform that classifies documents, extracts structured fields with per-field confidence scores, applies configurable quality controls (HITL, PII masking, confidence thresholds), and emits evidence packages that ComPassAI consumes for governance documentation.

**Where:** Operator-deployed extraction infrastructure; evidence packages at the `POST /v1/evidence` interface boundary with ComPassAI; public registry at `https://infrafabric.io/llm/if.registry.json.txt`.

**When:** Extraction processing is near-real-time (design target: under 30 seconds per document). Confidence threshold calibration is a deployment-time activity that must be completed before production processing begins. Governance decisions downstream are day-scale.

**How:** Staged pipeline with deterministic gate evaluation; SHA-256 hashing on inputs and outputs; configurable HITL triggers; PII pattern detection; if.trace binding for critical artifacts; ComPassAI integration via evidence package schema contract.

---

## Problem Statement

An invoice processed without a confidence score is a number someone typed. An invoice processed by an extraction pipeline that recorded a 0.94 confidence score, passed the mandatory-field check, did not trigger HITL, and produced a SHA-256-hashed evidence package with an operator-signed approval record is auditable evidence. The difference between those two things is not the quality of the extraction — it is the existence of the trail.

AurorAI exists because the default behavior of document processing pipelines is to discard the trail. The output matters; the metadata about how the output was produced does not make it into the ticket, the database, or the audit log. When something goes wrong with an AI-assisted financial, medical, or legal decision three months later, the organization cannot reconstruct the processing chain. It cannot answer the question "was this field extracted at 94% confidence or 51%?" It cannot show that PII was detected and masked before the record was passed downstream. It cannot prove that a human reviewed the low-confidence fields before the decision was made.

The system that rewards teams for shipping fast rather than documenting carefully is not a people problem. It is a structural incentive problem. AurorAI addresses it structurally: the evidence package is a required output of the processing pipeline, not an optional artifact that someone might add later.

*If the chain of custody is not generated at extraction time, it cannot be reconstructed from audit logs after the fact.*

---

## Core Architecture

AurorAI operates as a staged, deterministic processing pipeline. Each stage produces intermediate artifacts. The exit artifact — the evidence package — is not a summary of the processing; it is a structured record of every gate decision made during processing, including gates that fired and gates that did not.

```
Document Input → Classification → Extraction → Quality Gates → Evidence Package → ComPassAI
```

Understanding the staging matters because it determines where claim strength is highest and lowest. The strongest claims are at the schema-validated fields with per-field confidence scores. The weakest claims are at downstream automated decisions that consume extracted fields without additional human review.

**Proven (verified) components:**

The evidence package schema — including `usecase_id`, `producer`, `artifact_type`, `payload`, `hash`, and `control_checks` fields — is a defined interface contract. The schema drives the `POST /v1/evidence` endpoint that ComPassAI consumes. SHA-256 hashing on both input documents and output packages is implemented and provides integrity proof for the specific artifact at the time of processing. This does not prove the document was unmodified before ingestion — that requires upstream chain-of-custody controls outside AurorAI's scope. HITL triggering logic (configurable rules that fire on confidence below threshold, PII detection, or domain-specific markers) is a configurable gate; the gate design is proven. HITL correctness for a specific domain depends on operator threshold calibration, which is not a default guarantee.

**Bounded (operator-assisted) components:**

Extraction accuracy above 95% represents design targets measured on curated test sets with calibrated thresholds, not independently audited performance guarantees. Accuracy on novel document types or non-standard formats will vary. Drift detection is a designed capability; whether it is active depends on operator configuration. PII detection coverage is bounded strictly to configured patterns — PII that does not match a configured pattern will not be flagged.

**Non-claims (intent-only):**

AurorAI is not certification-complete for regulated domains (HIPAA, GDPR, EU AI Act) by itself. It produces evidence that feeds compliance documentation workflows. PII masking reduces exposure; it does not substitute for a DPIA, retention policy, or data minimization review. Confidence scores are the explicit acknowledgment that extraction quality is probabilistic, not a claim that extracted values are correct.

*If the evidence package is treated as proof of correctness rather than proof of process, it will fail exactly when correctness is most disputed.*


## Quality Controls Matrix

Each control is described with its implementation posture, the evidence it generates, its coverage classification (tested / inferred / N/A per cell), and a negative-path check. Coverage classifications follow the bible Section 6 requirement: row-level blanket labels are not sufficient.

**HITL Validation**

Human review is triggered when confidence falls below a configured threshold, when PII is detected in fields requiring human handling, or when domain rules (e.g., high-value transaction markers) fire.

Evidence generated: validation decision record with reviewer ID, timestamp, outcome, and the specific trigger that fired.

| Coverage cell | Classification | Notes |
|---|---|---|
| Trigger logic fires on confidence threshold breach | `tested` | Configurable threshold; fires on values below minimum |
| Trigger logic fires on PII detection | `tested` | Fires when any configured PII pattern is matched |
| Trigger logic fires on domain rules | `inferred` | Domain rule set must be configured per deployment; default set is minimal |
| Reviewer decision is recorded with ID and timestamp | `tested` | Audit log captures reviewer identity, not just decision |
| Override without reason is blocked | `tested` | Override requires explicit `override_reason` field; absent = rejected |

Negative-path check (expected: HITL trigger fires, auto-approval is blocked):
```bash
# Submit a document with total_amount > 10000 with hitl_required_when configured — expect hitl_triggered: true
curl -X POST http://localhost:8080/v1/extract \
  -H "Content-Type: application/json" \
  -d '{"document_type":"invoice","fields":{"total_amount":"15000"},"hitl_required_when":["total_amount > 10000"]}' \
| jq '.quality_controls.hitl_triggered'
# Expected output: true
# If output is false, HITL gate has failed — document control failure, open incident
```

Claim posture: the gate design is tested. Whether HITL adds governance value depends on reviewer competence and SLA — both are operational concerns, not product defaults.

*If HITL is configured but no one monitors the review queue, the gate exists on paper and nowhere else.*

---

**PII Masking**

Pattern-based automatic detection and redaction using configurable mask patterns. Redaction method is hash replacement (not deletion), preserving the structural position of the field while removing the value.

Evidence generated: PII flag list attached to each evidence package; masking log with redaction audit.

| Coverage cell | Classification | Notes |
|---|---|---|
| Standard patterns (ssn, credit_card, email, phone) detected | `tested` | Pattern set validated against standard format examples |
| Custom patterns detected after configuration | `inferred` | Custom patterns fire when correctly specified; coverage depends on pattern quality |
| Hash replacement preserves field structure | `tested` | Field position and type are retained; value is hash-replaced |
| Unmatched PII patterns produce no flag | `tested` (boundary confirmed) | This is a coverage limit, not a defect; must be stated in model card |

Negative-path check (expected: non-configured pattern is not flagged):
```bash
# Submit a document with a medical record number (MRN) not in the default pattern set
curl -X POST http://localhost:8080/v1/extract \
  -H "Content-Type: application/json" \
  -d '{"document_type":"medical_record","fields":{"mrn":"MRN-2847362"}}' \
| jq '.quality_controls.pii_detected'
# Expected output: [] (empty — MRN not in default patterns)
# This is correct behavior; document it in the model card as a known coverage gap
# If output includes mrn, verify custom pattern was added — do not claim universal PII coverage
```

Claim posture: coverage is bounded strictly to configured patterns. Universal PII detection is a non-claim.

*If the model card omits the unconfigured-pattern coverage boundary, the next audit will find it.*

---

**Confidence Thresholds**

Per-field, per-document-type configurable minimums. Extractions below threshold are flagged for HITL or rejected based on operator configuration.

Evidence generated: per-field confidence scores in extraction results; threshold compliance flag in the evidence package.

| Coverage cell | Classification | Notes |
|---|---|---|
| Per-field threshold enforcement | `tested` | Each field can have an independent threshold |
| Below-threshold fields trigger HITL when configured | `tested` | Requires HITL trigger to be connected to threshold check |
| Default threshold values are starting points | `tested` (boundary confirmed) | Defaults require domain calibration; presenting defaults as production-ready is a claim boundary violation |
| Calibration drift is detected | `inferred` | Requires active drift monitoring to be configured |

Negative-path check (expected: below-threshold field is flagged, not silently accepted):
```bash
# Submit a field with confidence 0.60 against a threshold of 0.85
curl -X POST http://localhost:8080/v1/extract \
  -H "Content-Type: application/json" \
  -d '{"document_type":"invoice","fields":{"invoice_number":{"value":"INV-001","confidence":0.60}},"threshold":0.85}' \
| jq '.quality_controls.confidence_check'
# Expected output: "failed" or similar below-threshold indicator
# If output is "passed", threshold enforcement has a defect — open incident
```

Claim posture: threshold values require calibration per domain. Default values are starting points, not production-ready configurations.

*Thresholds that have never been calibrated against real documents are guesses with a JSON wrapper.*

---

**RBAC (Role-Based Access Control)**

Role separation distinguishes extractors (read + extract), validators (validate + trigger HITL), and approvers (approve outputs + override controls with logged reason).

Evidence generated: access logs; permission check records per action.

| Coverage cell | Classification | Notes |
|---|---|---|
| Extractor cannot approve without validator review | `tested` | Role boundary enforced at API level |
| Override requires `override_reason` field | `tested` | Absent field returns 400; override without reason is blocked |
| Enterprise IAM integration (Okta, AAD, SSO) | `N/A` — P1 roadmap | Current authentication is AurorAI-internal; enterprise SSO is a known gap |

Negative-path check (expected: override without reason is rejected):
```bash
# Attempt override without providing override_reason
curl -X POST http://localhost:8080/v1/approve \
  -H "Content-Type: application/json" \
  -d '{"extraction_id":"EXT-2026-0001","action":"override"}' \
| jq '.error'
# Expected output: error message referencing missing override_reason
# If output is null (approved without reason), RBAC has a defect — open incident immediately
```

Claim posture: RBAC is enforced within AurorAI's own access layer. Enterprise IAM integration is a P1 roadmap item; claiming SSO support in a proposal is a non-claim.

*Role boundaries enforced only in the application layer and not at the infrastructure layer will be circumvented by any sufficiently motivated database administrator.*

---

**Audit Logging**

Complete processing history from input document to output package. Append-only by design; entries cannot be silently deleted or modified.

Evidence generated: processing logs; decision trails; validation chain records.

| Coverage cell | Classification | Notes |
|---|---|---|
| Local append-only behavior | `tested` | Log entries are append-only within AurorAI's local log store |
| External immutability (cryptographic proof) | `inferred` — requires if.trace binding | Local append-only does not prevent infrastructure-level log deletion; cryptographic immutability requires if.trace |
| Log export for audit | `tested` | Export API exists; format is human-readable JSONL |

Claim posture: logs are local and append-only within AurorAI's scope. External, cryptographic immutability requires binding to `if.trace` (shipped). Operators who require proof that logs were not modified at the infrastructure level must configure if.trace binding.

*An append-only log that lives on a single host proves nothing to an auditor who suspects the host was compromised.*

---

**Hash Verification**

SHA-256 on both input documents and output packages. Hash values are embedded in the evidence package and verifiable by downstream consumers.

| Coverage cell | Classification | Notes |
|---|---|---|
| SHA-256 on input document at ingestion | `tested` | Hash computed and stored at intake |
| SHA-256 on output evidence package | `tested` | Hash computed on final package before emission |
| Hash proves document not modified after hash computed | `tested` (boundary confirmed) | This is what the hash proves; it does not prove extraction was correct |
| if.trace receipt binding | `inferred` — operator-triggered | Receipt binding is available; automatic binding per package is not the default |

Claim posture: the hash proves the artifact was not modified after the hash was computed. It does not prove the extraction was correct, that the confidence threshold was correctly set, or that PII masking covered all relevant fields.

*Hash integrity and extraction correctness are orthogonal claims. Passing a hash check does not mean the extracted value is accurate.*

---

## Evidence Package Format

This is the primary interface contract between AurorAI and ComPassAI. The format is fixed at schema version `2026-03-01`. Breaking changes require version negotiation and migration notes.

```json
{
  "evidence_package": {
    "extraction_id": "EXT-2026-NNNN",
    "schema_version": "2026-03-01",
    "document_metadata": {
      "source_hash": "sha256:...",
      "document_type": "invoice",
      "processing_timestamp": "2026-03-06T00:00:00Z"
    },
    "extraction_results": {
      "fields": {
        "invoice_number": {"value": "INV-8832", "confidence": 0.98},
        "total_amount": {"value": "1249.22", "confidence": 0.93},
        "vendor_name": {"value": "Acme Corp", "confidence": 0.97}
      },
      "mandatory_fields_present": true,
      "below_threshold_fields": []
    },
    "quality_controls": {
      "pii_detected": ["vendor_address"],
      "pii_masking_applied": true,
      "hitl_triggered": false,
      "hitl_trigger_reason": null,
      "confidence_check": "passed",
      "validation_status": "auto_approved"
    },
    "metrics": {
      "processing_time_ms": 2847,
      "model_version": "aurora-v2.1",
      "accuracy_score_benchmark": 0.94,
      "benchmark_dataset": "invoice_validation_set_2026_q1",
      "benchmark_date": "2026-02-15"
    },
    "audit_trail": {
      "processor_id": "aurora-worker-03",
      "validation_chain": ["auto_extract", "confidence_check", "pii_scan"],
      "approver": null,
      "override_applied": false
    },
    "if_trace_receipt": null,
    "if_trace_binding_note": "if.trace binding available via operator-initiated receipt generation; not automatic on every package in current implementation. Configure explicit binding for high-risk use cases."
  }
}
```

The `if_trace_receipt: null` field is not a placeholder — it is the honest default state. Operators who require cryptographic receipt binding on every evidence package must configure explicit binding triggers. This is a deployment decision with governance implications that must be documented in the use case record before production processing begins.

*A schema field set to null is not a completed control. It is a documented gap with a known resolution path.*

---

## InfraFabric Integration (AurorAI)

Each integration point states the module, its registry status, what AurorAI uses it for, and what cannot be claimed at current status.

**if.trace (shipped):** AurorAI can bind evidence packages to `if.trace` receipts for cryptographic integrity verification. This is the strongest integration claim because `if.trace` is the only shipped module in the stack. Receipt binding is available; automatic binding on all packages is not the current default. What the receipt proves: the artifact was not modified after the receipt was generated. What the receipt does not prove: the extraction was correct, the confidence threshold was appropriate, or the PII scan covered all relevant patterns.

Why if.trace is included in this section: it is the integrity anchor for the whole evidence chain. If.trace receipts allow external reviewers to verify specific artifacts without logging in or contacting anyone.

**if.bus (preview):** Evidence packages can be transported over `if.bus` envelopes with HMAC-SHA256 integrity and replay guards. Because `if.bus` is `preview`, production-grade exactly-once delivery and multi-region HA are non-claims. The transport path exists in design; it does not carry an SLA.

**if.api (preview):** AurorAI integrates through `if.api` normalized adapters for external system connectivity. Eighty-three LLM adapters and structured extraction output adapters are active development targets. Production deployment of all adapters is not claimed.

**if.blackboard (preview):** Extraction events and HITL decisions can be logged to `if.blackboard`. The `/llm/blackboard/**` surfaces are publicly readable without login, providing independent evidence that coordination is happening. Single-host deployment only; multi-host fleet deployment is not claimed.

**if.context (preview):** Evidence provenance management through `if.context`'s staged pipeline (ingest → summarize → index → publish) provides structured retrieval context for evidence artifacts. The pipeline exists as a documented protocol; runtime service deployment is not a current claim.

**if.knowledge (preview):** The knowledge graph and related runtime retrieval surfaces are now best described as `preview` with strict scope and audit boundaries. AurorAI can use the graph as an advisory extraction-context substrate and reviewer evidence source, but it must not present `if.knowledge` as a GA retrieval service or as a semantic-truth engine. Dynamic extraction guidance remains bounded, operator-reviewed, and non-authoritative unless explicitly promoted by later evidence.

*An integration list that omits registry status for each item is not a technical specification; it is a wish list formatted as a table.*

---

## Implementation Guide

**Phase 1: Core Extraction Setup (Weeks 1–2)**

The most critical decision in this phase is confidence threshold calibration. Default thresholds are starting points; operators must run validation sets against their actual document corpus before setting production thresholds. A threshold calibrated on the vendor's demo dataset is not calibrated for the operator's production documents.

Document type configuration requires defining the field list, confidence minimum per field, mandatory fields (those whose absence blocks auto-approval), HITL trigger conditions, and PII check requirements. Minimal invoice configuration:

```json
{
  "document_types": {
    "invoice": {
      "fields": ["invoice_number", "total_amount", "vendor_name", "date"],
      "confidence_threshold": 0.85,
      "mandatory_fields": ["invoice_number", "total_amount"],
      "hitl_required_when": ["total_amount > 10000", "confidence < 0.75"],
      "pii_check": true
    }
  }
}
```

Audit trail setup in this phase — enabling hash generation, configuring append-only logs, deciding which artifacts will trigger if.trace binding — is not reversible. Document these decisions in the use case record before production processing begins.

**Phase 2: Controls and Monitoring (Weeks 3–4)**

RBAC configuration must map to actual organizational roles, not the default template. Every override capability must be assigned to a named role, and every use of the override must log the override reason. Monitoring that exists but does not alert anyone is operationally equivalent to no monitoring. Confirm alert routing before declaring monitoring active.

**Phase 3: Evidence Generation and ComPassAI Integration (Weeks 5–6)**

This phase validates the full evidence path end-to-end. Run both the happy path (high confidence, no PII, no HITL trigger) and the critical paths (HITL triggered, PII detected, mandatory field missing) before claiming production readiness. The integration test is the first time the evidence package schema contract is validated against a live ComPassAI instance — surface schema drift here, not in production.

---

## Success Metrics (Design Targets — Not Audited Benchmarks)

These figures are design targets measured on curated internal test sets. They are not independently audited benchmarks. Before reporting against these numbers in any external communication, operators must establish their own baselines against their actual document corpus.

Extraction accuracy target: greater than 95% on configured document types with calibrated confidence thresholds. The benchmark dataset, date, and known failure categories must be recorded in the model card for each deployment. Reporting 95% accuracy without these fields is a claim boundary violation.

Processing time target: under 30 seconds per document for standard extractions. Complex documents, HITL-triggered review, and high-volume batch conditions will vary and are not bound by this target.

HITL engagement: 100% of configured triggers must fire when conditions are met. This is a control correctness requirement, not an aspirational target. Any condition where a trigger should have fired and did not is a control failure requiring incident documentation.

PII detection: greater than 99% for configured patterns. For patterns not configured, detection rate is 0% by definition. Both figures must appear together in any PII coverage claim.

Evidence completeness: greater than 95% of processed documents produce a complete, schema-valid evidence package with all required fields present.

---

## Open Findings and Known Gaps

These are explicit boundary statements. Hiding them creates false confidence in downstream governance assessments.

IAM integration (Okta, AAD, SSO) is a P1 roadmap item. Current authentication is AurorAI-internal. Enterprise environments requiring SSO must plan for this gap in their deployment timeline.

`if.trace` automatic binding per evidence package is not the current default. High-risk use cases requiring cryptographic receipt on every artifact must configure explicit binding triggers.

`if.knowledge` runtime query integration should now be treated as `preview` advisory context only. It is useful for bounded retrieval and graph-backed review support, but it must not be treated as a guaranteed production dependency or an autonomous decision engine.

Multi-region or multi-host AurorAI deployment is not claimed. Current deployment model is single-host. Availability and redundancy requirements must be addressed in the infrastructure layer.

*The gaps that are documented here are not the dangerous ones. The dangerous gaps are the ones nobody has named yet.*

---
---

# Part Two: ComPassAI

## AI Governance — Specification Sheet

**Status:** `review` — preview-stage specification.
**Not-for line:** This specification is not a regulatory submission and must not be used as sole evidence for EU AI Act, GDPR, HIPAA, or other compliance declarations. ComPassAI produces documentation in support of compliance; human review and approval remain mandatory gates that no software can substitute for.

---

## Who | Why | What | Where | When | How

**Who:** Governance administrators configuring policy, risk owners evaluating use cases, compliance teams generating documentation, approvers signing off on deployments, and external auditors reviewing evidence bundles across multiple jurisdictions.

**Why:** The gap between AI system execution and governance documentation is the most common audit failure mode in AI deployments. Manual documentation is slow, inconsistent, and breaks down whenever the system changes faster than the documentation cycle. ComPassAI closes this gap by deriving governance artifacts from structured evidence rather than composing them in parallel.

**What:** A workflow-first governance engine that maintains a use case registry, runs risk tiering on ingested AurorAI evidence, enforces policy-defined controls, generates compliance deliverables (model cards, DPIAs, risk assessments, audit trail exports), and manages approval workflows with RBAC and signature collection.

**Where:** ComPassAI governance workflows; `if.blackboard` at `https://infrafabric.io/llm/blackboard/index.md.txt`; evidence store at operator-deployed infrastructure; public registry at `https://infrafabric.io/llm/if.registry.json.txt`.

**When:** Evidence ingestion and risk tiering operate in near-real-time. Approval workflows are day-scale. Regulatory compliance determinations require human legal analysis and cannot be accelerated by system automation.

**How:** Evidence-derived deliverable generation; T0–T3 risk tiering with mandatory uncertainty fields; RBAC-enforced approval gates; if.trace receipt embedding for deliverable integrity; jurisdiction-aware policy rules.

---

## Problem Statement

The governance documentation problem for AI systems has two failure modes that look different but share a root cause. The first is the team that documents nothing: governance artifacts are missing at audit time, there is no record of who approved the deployment or on what evidence, and the organization cannot demonstrate due diligence. The second failure mode is more insidious: the team that documents extensively — risk assessments written by hand, DPIAs composed from memory, model cards filled in from product marketing — but whose documentation does not match the actual system behavior. The system changed; the documentation did not.

Both failure modes share a root cause: governance documentation that is maintained in parallel with the system, rather than derived from it, will eventually diverge from it. The question is not whether divergence will happen but when.

ComPassAI addresses this structurally. Every deliverable is generated from the structured evidence that AurorAI produces. The model card's performance section is populated from the benchmark fields in the evidence package, not typed in from a vendor spec sheet. The DPIA's data categories are drawn from the PII detection records in the extraction audit trail, not assembled from memory. The risk assessment's confidence section reflects the actual per-field confidence scores and HITL trigger history, not a general description of the system's capabilities.

The system that produces accurate governance documentation today but cannot maintain accuracy as the system evolves is not solving the problem — it is postponing it. ComPassAI's evidence-derived architecture means that when AurorAI's configuration changes, the governance documentation reflects the change on the next evidence ingestion cycle.

The assumption most likely to be wrong in this framing: that governance documentation accuracy is the primary stakeholder concern. For many organizations, the primary concern is governance documentation existence — they need any documentation, produced quickly, that passes a surface review. ComPassAI serves both concerns, but operators should be explicit about which one they are optimizing for: a generated document that is accurate but incomplete is better governance than a polished document that is inaccurate, but it may not pass a procurement checklist that expects completeness.

Invalidation test: if an organization can produce accurate, auditable, evidence-linked governance documentation for all its AI use cases using only its existing manual processes — and can sustain that accuracy as systems evolve — then ComPassAI adds no value for that organization. Document this as a scope boundary, not a product failure.

*If governance documentation is accurate today but has no mechanism to stay accurate tomorrow, it is a liability dressed as a control.*

---

## Core Architecture

ComPassAI operates as a two-layer system built on the AurorAI evidence foundation.

```
AurorAI (execution) → Evidence Package → ComPassAI (governance) → Deliverables → Audit Trail
```

The architecture is intentionally asymmetric: AurorAI generates evidence without requiring governance awareness; ComPassAI consumes evidence without requiring execution awareness. The interface between them — the evidence package schema — is the coupling point. Changes to the schema require version negotiation. Neither product can make claims that exceed what the evidence package contains.

**Core modules at P0 (minimum viable governance):**

The use-case registry is the single source of truth for every AI system under governance. It has a mandatory `known_unknowns` field that cannot be empty — if a risk dimension is uncertain, the record must state what is unknown and what the conservative assumption is in the interim.

The evidence store is immutable and versioned: new evidence is appended, not substituted for prior evidence. The append-only discipline means the governance history is not rewritable.

The risk engine applies rules-based T0–T3 tiering with mandatory justification for every dimension and mandatory uncertainty fields for any dimension that is not fully characterized. The tier assigned is the ceiling of the risk level, not the average.

The policy engine maps risk tier and deployment context to required controls and deliverables. Its rules are versioned; changing a policy rule does not retroactively alter prior-approved use cases, but it triggers re-assessment at the next review cycle.

The deliverable generator produces compliance artifacts from evidence store references. All fields in generated deliverables cite the specific evidence package and field that populated them. Manual additions to generated deliverables are tracked as operator notes with a timestamp and approver identity — they cannot be made to appear as evidence-derived content.

The workflow engine enforces RBAC-based approval through four mandatory sequential gates, none of which can be bypassed without an override that is visible to auditors.

The audit trail is exportable, immutable, and human-readable. Every governance state transition is a record with a timestamp, actor identity, action taken, and any override reason applied.

---

## Risk Tiering (T0–T3)

Tier assignment is not permanent. Re-tiering is triggered automatically when new evidence changes a risk dimension. Re-tiering to a higher tier requires re-approval through all four gates. Re-tiering to a lower tier requires explicit human confirmation — it is not automatic.

Fail-closed behavior: when a risk dimension is uncertain, the tier defaults to the higher adjacent tier until the uncertainty is resolved. The governance documentation must state which dimensions are uncertain and why. Tier assessment with empty uncertainty fields is a publish blocker.

**T0 (Low Risk):** No PII, PHI, financial, or biometric data; informative-only output; no regulated domain; limited deployment scale. Required: registry entry, basic logging, named owner, periodic review schedule. Deliverable: use-case record.

**T1 (Moderate Risk):** Limited PII, assistive decision impact, light regulatory exposure. Required: model card, basic controls (RBAC, audit logging), monitoring with monthly review. Deliverables: use-case record, model card, monitoring plan.

**T2 (High Risk):** Significant PII/PHI/financial data, automated or high-impact decision potential, regulated domain. Required: risk assessment, DPIA when personal data processing meets GDPR Article 35 threshold, HITL for low-confidence outputs, enhanced monitoring with alerting. Deliverables: use-case record, model card, risk assessment, DPIA, monitoring plan with alert thresholds, approval record.

**T3 (Critical Risk):** Biometric or highly sensitive data, consequential automated decisions, strict regulatory requirements such as EU AI Act high-risk system classification. Required: independent review, red-team assessment, strict deployment gates with named approvers by role, frequent re-certification schedule. Deliverables: all T2 deliverables plus independent review report, red-team findings, and re-certification schedule.

Tier assignment is not a legal determination. Whether a specific deployment constitutes a high-risk AI system under the EU AI Act Annex III, or whether processing meets the GDPR Article 35 DPIA threshold, requires legal analysis. ComPassAI's T2/T3 tiering flags deployments that likely warrant legal review — it does not substitute for it.

---

## InfraFabric Integration (ComPassAI)

**if.trace (shipped):** ComPassAI embeds `if.trace` receipt IDs in governance deliverables. External reviewers can verify artifact integrity without logging in or contacting anyone. What this proves: the artifact was not modified after the receipt was generated. What this does not prove: the content is correct, complete, or compliant. If.trace is included here because it is the only shipped module and the integrity anchor for the entire deliverable chain.

**if.blackboard (preview):** Governance tasks, approval workflow states, and coordination events are logged to `if.blackboard`. The `/llm/blackboard/**` surfaces are publicly readable — this provides independent, no-login-required evidence that governance activity is actually occurring, not just claimed. Append-only discipline means the governance event log cannot be silently modified. Single-host deployment only.

**if.gov (preview; council/triage roadmap):** The `if.gov` framework defines the governance decision structure ComPassAI implements. ComPassAI's T0–T3 tiering logic and multi-voice review patterns embody the governance philosophy `if.gov` describes. However, `if.gov.triage` and `if.gov.council` are `roadmap` — the triage and council scripts run locally and produce schema-valid artifacts, but no deployed runtime service exists. The governance philosophy is implemented; the automated council voting runtime is not. Claiming automated council deliberation in current deployments is a claim boundary violation.

**if.story (preview):** Compliance deliverables use `if.story`'s narrative structure — bitmap (point-in-time state) and vector (decision trajectory with rationale). Deliverables record not just the current assessment but the reasoning path that produced it. The `if.story` protocol and demo artifacts are published; no deployed `if.story` runtime service is claimed. The deliverable format follows the spec; automatic narrative generation via a running `if.story` service is not the current implementation.

**if.bus (preview):** Evidence transport from AurorAI to ComPassAI can route over `if.bus` envelopes with HMAC-SHA256 integrity and replay guards. Exactly-once delivery and multi-region HA are non-claims at `preview` status.

**if.api (preview):** ComPassAI receives evidence from external systems through `if.api` normalized adapters. Adapter coverage is active development; not all integrations are production-deployed.

**if.switchboard (preview):** Monitoring signal routing and alert coordination can use `if.switchboard`'s SIP-based coordination model. The first live inter-agent handshake was recorded 2026-03-02T02:43:15Z. Real-time alert routing through `if.switchboard` is a designed integration, not a currently production-deployed capability.

**if.context (preview):** Evidence environment management — staged processing of evidence artifacts with provenance tracking — uses `if.context`'s pipeline. The protocol is implemented as a specification; runtime service deployment is not claimed.

**if.knowledge (preview):** The knowledge graph and query surfaces are `preview` and can support bounded impact analysis, dependency tracing, and reviewer-visible context retrieval. ComPassAI may use that preview substrate to inform impact analysis and evidence navigation, but it must not describe the graph as a GA dependency oracle or as a complete runtime truth layer. Impact-analysis conclusions still require human review and policy interpretation.

**Agent Rook (preview, pass_with_risk):** Autonomous governance workflow execution requires air-gap controls: `IF_ROOK_AIRGAP_MODE=1`, mandatory attestation tuple at closeout (`airgap_mode_confirmed`, `airgap_attestation_path`, `timestamp_utc`, `sha256`, `verify_command`). Tasks without the complete attestation tuple cannot reach `status=done`. Open P1 finding: compliance PASS lacks blackboard ledger signature hard gates. Autonomous operation is `pass_with_risk`, not certified.

**if.emotion (shipped):** Stakeholder communication in governance workflows can use `if.emotion` for empathetic, culturally-sensitive messaging. `if.emotion` is shipped at emo-social.infrafabric.io, validated by two external reviewers across 5 frameworks and 8+ cultural contexts. The shipped pipeline is the emo-social consumer application; governance notification template integration is a designed use case built on that foundation.

*An integration table that lists modules without registry status is not a technical specification; it is a capabilities roadmap formatted as if it were current.*

---

## Policy Engine

Policies map risk tier and deployment context to required controls and deliverables. Every policy rule has four components: `when` conditions, required controls, required deliverables, and regulatory receipt markers. The `gaps_if_unmet` field is mandatory. Controls not met block the `controls_satisfied` gate. The block does not disappear through override without an explicit `--override-reason` in the audit trail. This is fail-closed behavior — not a configurable option.

```json
{
  "policy_id": "POL-PII-T2-001",
  "version": "2026-03-01",
  "when": {
    "risk_tier_in": ["T2", "T3"],
    "data_categories_any": ["PII", "PHI"]
  },
  "require": {
    "controls": ["RBAC", "AuditTrail", "HITL_LowConfidence", "PII_Masking"],
    "deliverables": ["risk_assessment", "dpia", "monitoring_plan"],
    "receipt_markers": ["GDPR_Art35_check", "EU_AI_Act_Art17_check"]
  },
  "gaps_if_unmet": "block_approval"
}
```

Policy rules cannot reference module capabilities beyond their current registry status. A policy rule that requires `if.gov.council` automated vote as a mandatory control gate is invoking a `roadmap` feature. Policy rules must reference implemented governance patterns, not roadmap architecture.

*A policy that references a roadmap capability as a required control will block every approval it touches, which is not governance discipline — it is accidental denial of service.*

---

## Deliverable Generation

Deliverables are generated from evidence, not composed by hand. This distinction matters: a hand-composed risk assessment can contain claims that have no corresponding evidence. A generated deliverable can only contain what the evidence supports. Gaps in evidence produce gaps in deliverables — not fabricated content.

The **model card** is generated from extraction engine metadata, performance benchmarks, and governance records. Evidence references are by ID, pointing back to the evidence store. Known failure categories and bias assessment records are mandatory fields. A model card that is missing them is incomplete and blocks the `controls_satisfied` gate.

The **DPIA** is generated when a T2 or T3 use case involves personal data processing meeting GDPR Article 35 criteria. It is populated from data categories, processing purposes, PII masking controls, and retention policies in the use case record and evidence packages. The legal basis for processing is a mandatory human-supplied field — it is not inferred from evidence, because legal basis is a legal determination, not a data characteristic.

The **risk assessment** is generated from risk engine output with full dimension rationale, uncertainty fields, and required control list. Uncertainty fields cannot be empty. If a dimension is unknown, the assessment must state what is unknown and what the conservative assumption is.

The **audit trail export** is a complete, ordered record of every governance state transition for a use case, from intake to current status. The export is human-readable and machine-parseable. `if.trace` receipt IDs are embedded in each entry for external integrity verification.

---

## Approval Workflow

Four sequential, blocking gates. No gate can be bypassed silently. Any bypass is recorded in the audit trail with the override reason, the approver identity, and the timestamp. Override-only paths are visible to auditors — the audit trail does not present them as standard approvals.

**Gate 1 — intake_complete:** Use case record is populated with all required fields including `known_unknowns`. Evidence packages have been ingested and hash-verified.

**Gate 2 — risk_assessed:** Risk tier has been assigned with full dimension justification and uncertainty fields populated. Risk engine output has been reviewed by the designated `risk_owner` role.

**Gate 3 — controls_satisfied:** All controls required by the risk tier's policy rules are confirmed active. Required deliverables (model card, DPIA, risk assessment) are present, complete, and schema-valid. Gaps block this gate. The block cannot be cleared by declaring the gap acceptable — it requires either resolving the gap or applying an explicit override with documented reason.

**Gate 4 — approved_for_deploy:** Named approver in the `approver` role has formally signed off on the deployment. For T3 use cases, the independent reviewer's sign-off is also required at this gate.

*A workflow with four gates that can all be bypassed by the same administrator is a single gate with extra paperwork.*

---

## Regulatory Alignment Matrix

This table describes what ComPassAI provides toward each regulatory framework and what it explicitly does not provide. Every row is `preview` status because certification requires an independent audit of a production-deployed system — which is not the current state. No row shows full compliance confidence.

| Regulation | What ComPassAI provides | What it does not provide | Status |
|---|---|---|---|
| EU AI Act Art 9 (Risk Management) | Structured risk assessment workflow; T0–T3 tiering with documented rationale; continuous re-assessment on evidence change | Legal determination of high-risk status under Annex III (requires legal analysis of use case and decision type) | `preview` — governance infrastructure implemented; not externally audited |
| EU AI Act Art 11 (Technical Documentation) | Automated model card and system documentation generated from evidence | Legal sufficiency review of documentation against Art 11 requirements; external audit | `preview` |
| EU AI Act Art 14 (Human Oversight) | HITL gate enforcement; approval workflow with mandatory human sign-off at every gate | Guarantee that human reviewers are exercising meaningful oversight rather than rubber-stamping (auditable but not enforceable by software) | `preview` |
| GDPR Art 35 (DPIA) | Automated DPIA template generation from evidence when T2/T3 threshold is met | Determination of whether a DPIA is legally required in the specific jurisdiction and context (requires DPO review) | `preview` |
| GDPR Art 25 (Data Protection by Design) | PII masking controls documentation; retention policy enforcement hooks | Legal determination that the design satisfies Art 25 in the specific deployment context | `preview` |
| Quebec Law 25 (algorithmic explanation right) | Disclosure template generation with explanation-ready fields | Legal determination that the template satisfies the individual's right to explanation; French-language output (operator must configure locale) | `preview` — operator must configure locale; English-only default is a known gap for Quebec deployments |
| ISO 42001 (AI Management System) | AI management system documentation and audit trail structure aligned with ISO 42001 management system requirements | ISO 42001 certification (requires external certification body) | `roadmap` — pattern described; full implementation and certification process pending |
| SOC 2 Type II | Continuous monitoring records structure; audit trail export | SOC 2 Type II attestation (requires external auditor) | `roadmap` |
| NIST AI RMF | T0–T3 tiering and governance workflow structurally aligned with Govern, Map, Measure, Manage functions | NIST AI RMF conformance report; independent assessment | `preview` — alignment is documented; conformance is not assessed |

*A compliance table with checkmarks in every row is a marketing artifact. A compliance table with honest gaps is a governance artifact.*

---

## Operating Procedures

**Daily:** Check `if.blackboard` for active governance tasks and pending approvals. Review any approvals that have exceeded their SLA. Review evidence ingestion failures — a package that failed to ingest is a gap in the evidence chain, not a background process error.

**Weekly:** Review risk tier distribution across the use case portfolio. Identify any use cases that have had evidence changes without triggering a re-assessment. Review policy rule effectiveness: are controls blocking legitimate approvals that should be resolved through policy adjustment rather than override?

**Monthly:** Complete portfolio review — a full inventory of every registered use case, its current tier, its last evidence update date, and its next scheduled review. Calibrate risk model assumptions against any new regulatory guidance published during the month. Update deliverable templates when regulatory guidance changes.

**Incident Response:** Detection (evidence anomaly or control failure identified) → Triage (severity and affected use cases) → Response (containment, control restoration) → Evidence capture (all incident actions logged to `if.blackboard`) → Recovery (governance documentation updated to reflect incident and resolution) → Learning (policy rules updated if the incident reveals a gap in the rule set). All steps use `if.blackboard` append-only task logging; incident records cannot be retroactively modified.

Note on `compass_cli`: References in prior documentation to a `compass_cli` binary (`compass_cli approval list`, `compass_cli risk monitor`) describe planned operator tooling. No such binary is currently shipped. Current operations use `if.blackboard` task review and direct API calls.

---

## Success Metrics (Design Targets — Not Audited Benchmarks)

These figures are directional targets. Each deployment must establish its own baselines against its actual use case portfolio before reporting against these numbers in any external communication. Reporting these figures as benchmarks without an established deployment baseline is a claim boundary violation.

Use case coverage target: greater than 90% of AI systems in the operator's portfolio registered in ComPassAI within 90 days of deployment. This target is meaningless without a complete inventory of AI systems — the denominator is as important as the numerator.

Intake-to-approval cycle time target: under 48 hours for T0/T1 use cases with complete evidence. This target is not appropriate for T2/T3 use cases, which require independent review, legal analysis, and multi-party approval that cannot be accelerated without reducing governance quality.

Deliverable generation time target: under 15 minutes for automated generation from a complete evidence bundle. Incomplete evidence bundles produce incomplete deliverables; the time target is conditioned on evidence completeness.

Audit bundle completeness target: greater than 80% of use cases produce audit-ready bundles without manual intervention. The 20% requiring manual intervention should be audited for systematic gaps — recurring manual interventions on the same fields indicate a missing policy rule or evidence schema gap.

Evidence completeness target: greater than 90% of evidence packages are schema-valid with all required fields present.

---

## Open Findings and Known Gaps

`if.gov.triage` and `if.gov.council` are `roadmap`. The multi-voice governance council described in the v3.0 `if.gov` specification is a designed architecture that is not currently deployed as an automated runtime. ComPassAI implements the governance philosophy; the automated council is a future state.

`compass_cli` is not a shipped binary. References in derivative documents to a ComPassAI CLI describe planned operator tooling. Current operations use `if.blackboard` task review and direct API calls.

`if.switchboard` enforcement of deployment gates is `preview`. The architecture calls for `if.switchboard` to enforce that AI systems cannot receive traffic without ComPassAI approval. This enforcement is currently an organizational control, not a hard technical gate.

Quebec Law 25 requires French-language disclosure templates with explanation-ready fields for the algorithmic explanation right. ComPassAI's default disclosure templates are English-only. Quebec deployments must configure locale settings; failure to do so is a known compliance gap.

Performance metrics are design targets, not benchmarks. Each deployment must establish its own baselines before reporting against these figures.

Regulatory compliance declarations are not automatic. Generating a DPIA does not mean GDPR Article 35 compliance is satisfied. Generating a model card does not mean EU AI Act documentation requirements are met. Generated documentation supports compliance review; it does not substitute for it.

*The open findings listed here are the ones we can name. Treat unnamed gaps with proportionally more caution.*

---
---

# Annex A: Jurisdiction-by-Jurisdiction Regulatory Compliance Framework

**Annex purpose:** This annex maps AurorAI and ComPassAI obligations and alignment posture against actual laws, regulations, and binding guidance in force or imminently effective across five client jurisdictions: EU/France, Canada, United States, United Kingdom, and cross-jurisdiction intersections. It follows the same claim discipline as the main specification — every statement is classified as proven alignment, bounded alignment, or non-claim/gap. Jurisdiction entries do not borrow status from each other: a compliance posture in France does not inherit from Canada simply because both apply GDPR-family obligations.

**This annex is not legal advice.** Determining actual compliance in any jurisdiction requires review by qualified legal counsel familiar with the specific deployment context, data categories, decision types, and organizational structure. This annex identifies what questions operators must ask and what controls to configure — it does not answer those questions on their behalf. Treating it as a substitute for legal review is itself a compliance failure.

**Annex freshness boundary:** Regulatory information reflects the state of law and guidance as of 2026-03-06T00:00:00Z. AI regulation in all five jurisdictions is moving at high velocity. Each section carries an explicit `⚠ Review by:` date. Any section whose `Review by:` date has passed must be treated as `A-stale` — claims derived from it should not be used to support promotion-level compliance language until the section is refreshed against current law.

**Inversion checkpoint (annex-level):** The assumption most likely to be wrong in this annex is that law at the time of writing will remain substantially in force at the time of deployment. The EU AI Act enforcement timeline is confirmed; every other regulatory development in this annex is subject to political, legislative, or judicial change. An operator who relies on this annex without monitoring for changes is relying on a snapshot, not a posture.

*If an operator reads this annex as a compliance guarantee rather than a planning tool, the annex has already failed its own purpose.*

---

## A.1 European Union — EU AI Act + GDPR

**Jurisdictional scope:** The EU AI Act (Regulation 2024/1689) and GDPR (Regulation 2016/679) apply to AurorAI and ComPassAI deployments where the system is placed on the EU market, used within the EU, or where outputs affect persons located in the EU — regardless of where the provider is based. The extraterritorial reach is explicit and mirrors the GDPR model established since 2018. Operators based in Canada, the US, or UK who serve EU clients or process data about EU persons are subject to both instruments.

**Primary instruments in force — as of 2026-03-06:**

The EU AI Act entered into force on 1 August 2024. Its enforcement is phased: prohibited AI practices have been banned since February 2025; general-purpose AI model obligations apply from August 2025; obligations for high-risk AI systems under Annex III become applicable between August 2026 and August 2027 depending on system category. GDPR applies in full and simultaneously — neither instrument suspends the other.

**Risk classification analysis for AurorAI and ComPassAI:**

Document processing systems that extract structured data from documents containing personal information are candidates for Annex III high-risk classification in specific deployment contexts. The relevant Annex III categories include employment and workers management (category 4, covering AI used to influence employment, recruitment, or task allocation decisions); access to essential private services (category 5, covering AI in creditworthiness assessment, insurance risk scoring, or similar consequential financial decisions); and administration of justice (category 8). Whether a specific AurorAI deployment falls within these categories depends on the use case, not on the technology. Invoice processing in accounts payable does not trigger high-risk classification. The same extraction engine used to process loan applications likely does. ComPassAI's T2 or T3 tier assignment for a use case involving personal data and consequential automated decisions should always trigger a parallel EU AI Act Annex III check by legal counsel — the tier is a signal, not a legal determination.

**What AurorAI and ComPassAI provide toward EU AI Act obligations:**

For high-risk systems, the EU AI Act requires a risk management system (Article 9), technical documentation (Article 11), data governance (Article 10), logging for traceability (Article 12), transparency to deployers (Article 13), human oversight measures (Article 14), and accuracy and robustness requirements (Article 15). ComPassAI's risk engine addresses Article 9 structurally, providing documented tiering rationale, uncertainty handling, and re-assessment triggers. AurorAI's evidence packages with confidence scores and control check records address Article 10 and Article 12 logging. The HITL gate addresses Article 14. The model card addresses Article 11. These are genuine contributions — and they are not sufficient alone. Article 9 requires a risk management system that is implemented, monitored, reviewed, and updated throughout the lifecycle; ComPassAI provides documentation and monitoring infrastructure, not the complete risk management system. The distinction matters for an auditor.

**What AurorAI and ComPassAI do not provide toward EU AI Act obligations:**

Legal determination of whether a deployment constitutes a high-risk system under Annex III. Registration of high-risk systems in the EU database (a regulatory filing obligation). Conformity assessment (required for certain high-risk categories before deployment). Post-market monitoring reports to the relevant national supervisory authority. Legal basis for processing personal data — this must be established by the operator before ingestion begins.

**GDPR obligations at the intersection with document processing:**

When AurorAI processes documents containing personal data, GDPR applies to that processing in full. Legal basis must be established before ingestion — the evidence package schema includes a `legal_basis` field that must be populated by the operator. Data minimization under Article 5(1)(c) applies to what fields are extracted and retained, not only to what is in the source document. The PII masking controls reduce exposure but do not discharge the data minimization obligation — operators must configure what is extracted, not only what is masked after extraction.

For automated decision-making under Article 22, if AurorAI extraction results feed into decisions producing legal or similarly significant effects on individuals without meaningful human review, the deployment may require explicit safeguards: information to the data subject, the right to human review, and the right to contest. The HITL gate addresses this partially — it triggers review for low-confidence extractions. Whether it satisfies Article 22 for a specific use case requires assessment of whether the downstream decision qualifies as legally significant.

GDPR Article 35 DPIA requirements apply when processing is likely to result in high risk, including systematic automated processing for profiling, large-scale processing of special categories of data, and systematic monitoring of publicly accessible areas. ComPassAI's DPIA generation module produces the documentation template; whether a DPIA is legally required is a human legal assessment that ComPassAI cannot make automatically.

**France-specific layer:**

France's CNIL is designated as national supervisory authority for both GDPR and EU AI Act market surveillance. The CNIL published comprehensive AI-GDPR guidance in July 2025 covering training data annotation, security during AI system development, and the GDPR status of AI models. The CNIL's 2025–2028 strategic plan provides sector-specific guidance for health, education, and HR deployments. The Loi Informatique et Libertés (French GDPR implementing legislation) is in certain respects stricter than baseline GDPR. Article L.311-3-1 of the Code of Relations between the Public and the Administration (CRPA) imposes a specific algorithmic transparency obligation on administrative decisions — if any ComPassAI governance output feeds into a public authority's individual administrative decision, the individual must be informed of the algorithm's role, data sources, parameters, and operational logic. This is a separate French administrative law requirement, not a GDPR obligation, and it has no direct equivalent in other jurisdictions in this annex.

**Inversion checkpoint:** The assumption most likely to be wrong in this section is that the Annex III high-risk category thresholds will remain stable through August 2026. The EU Commission has authority to update Annex III; operators who complete their Annex III assessment today should reconfirm classification within 60 days of planned deployment, not only at initial assessment.

**`⚠ Review by: 2026-08-01`** — Annex III high-risk obligations begin applying for the first tranche of categories. Deployments in employment, credit, insurance, and essential services contexts must confirm EU AI Act high-risk classification and complete conformity assessment obligations before this date. After this date, this section must be refreshed against confirmed enforcement guidance.

*If this section is read in September 2026 without being refreshed, it is citing obligations that may now be in active enforcement against unaware operators.*

---

## A.2 Canada

**Jurisdictional scope:** Canada's federal private-sector privacy regime covers organizations and their contractors processing personal data about Canadians in commercial contexts. Provincial laws apply in provinces with substantially similar legislation — Quebec, Alberta, and British Columbia each maintain separate privacy regimes. Federal institutions are separately governed by the Treasury Board's Directive on Automated Decision-Making. The scope for AurorAI and ComPassAI depends on whether the operator is a federal institution, a federally regulated industry, or a private-sector organization in a province with its own law.

**Current state of AI-specific law — as of 2026-03-06:**

Canada does not have a general federal AI law. The Artificial Intelligence and Data Act (AIDA), introduced as Bill C-27, died on the order paper in January 2025 when Parliament was prorogued following Prime Minister Trudeau's resignation. The Liberal Party returned to power after the April 28, 2025 election under Prime Minister Mark Carney, whose government has indicated intent to regulate AI through privacy legislation and investment rather than standalone AI legislation. An AI Strategy Task Force was in consultation in late 2025. As of March 2026, no replacement AI legislation has passed. AI deployments in Canada are governed by privacy law, sector-specific regulation, and voluntary frameworks — not by a horizontal AI law.

**Applicable privacy law:**

PIPEDA governs private-sector personal data processing at the federal level. When AurorAI processes documents containing personal information about identifiable individuals in a commercial context, PIPEDA applies: meaningful consent or a legitimate non-consent ground must be established before collection; purpose must be identified at or before collection; collection must be limited to what is necessary. The Consumer Privacy Protection Act (CPPA), signalled by the government as a replacement for PIPEDA with penalties up to C$25 million or 5% of global revenue, had not been confirmed as passed as of this annex's freshness date. Operators must confirm current PIPEDA/CPPA status before deployment.

Quebec's Law 25 (fully in force since September 2023) is Canada's strictest provincial privacy law and applies broadly to organizations processing personal data about Quebec residents. It requires mandatory privacy impact assessments for certain high-risk processing, grants individuals an explicit algorithmic explanation right (the right to request explanation of any decision made exclusively by automated processing that affects them), and imposes stricter breach notification than federal PIPEDA. For ComPassAI, the algorithmic explanation right directly affects deliverable template design: disclosure templates for Quebec deployments must include explanation-ready outputs that satisfy the Law 25 requirement, not merely the federal PIPEDA minimum. The right belongs to the individual, not the organization — it cannot be waived in a contract. ComPassAI's default English-language disclosure templates do not satisfy this requirement without locale configuration and template extension.

**Federal institution automated decision-making:**

The Treasury Board Directive on Automated Decision-Making requires algorithmic impact assessments (AIAs) before deploying automated decision systems in federal institutions and establishes tiered requirements at impact Levels I–IV. The AIA process is analogous to ComPassAI's risk tiering but is a separate legal obligation using a different assessment tool (the Government of Canada's online AIA tool). If ComPassAI is deployed to support federal government AI governance, both a ComPassAI internal risk assessment and a Treasury Board AIA are required — for different audiences and under different legal authority. They are not substitutes for each other.

**Provincial and voluntary frameworks:**

Ontario's Enhancing Digital Security and Trust Act (passed late 2024, regulations pending as of early 2026) establishes accountability requirements for public-sector AI use in Ontario. The Ontario IPC and Ontario Human Rights Commission jointly released six responsible AI principles in January 2026 that are relevant compliance guidance for Ontario public-sector deployments even before formal regulations take effect. The Government of Canada's Voluntary Code of Conduct on the Responsible Development and Management of Advanced Generative AI Systems (September 2023) is not mandatory but is material evidence of responsible practice — ComPassAI governance records should document the operator's posture against the Code's principles.

**What AurorAI and ComPassAI provide toward Canadian obligations:**

The evidence package schema supports the `legal_basis` and `purpose` fields required by PIPEDA. The PII masking controls reduce exposure of personal information in extracted fields. The HITL gate supports human review for automated decisions affecting individuals. ComPassAI's governance documentation, including model cards and risk assessments, provides the accountability evidence required by the Voluntary Code of Conduct. For Quebec Law 25, ComPassAI's disclosure template structure is the right architectural approach — the current gap is the default English-only template content and the absence of Law 25-specific explanation-ready fields.

**What AurorAI and ComPassAI do not provide:**

Determination of whether a specific processing activity requires a privacy impact assessment under Law 25. Legal basis assessment for PIPEDA consent grounds. The Government of Canada AIA for federal institution deployments. CPPA compliance confirmation (since CPPA status is not confirmed as of this writing).

**Inversion checkpoint:** The assumption most likely to be wrong in this section is that the CPPA will pass with the same penalty structure and obligation framework that was signalled. If the CPPA passes with materially different terms, or if a separate AI law is introduced in the second half of 2026, the compliance planning in this section may need substantial revision.

**`⚠ Review by: 2026-06-30`** — CPPA status, national AI strategy outcomes, and Ontario AI regulation finalization should all be confirmed before this date. Quebec Law 25 algorithmic transparency template gap should be resolved before any Quebec deployment regardless of this review date.

*If a Quebec deployment goes live with English-only disclosure templates and no explanation-ready fields, it is non-compliant with Law 25 on day one — not at the next review cycle.*

---

## A.3 United States

**Jurisdictional scope:** The US regulatory environment for AI is the most fragmented of any major jurisdiction in this annex. No comprehensive federal AI law has passed. Compliance obligations arise from federal sector-specific regulators applying existing law to AI contexts, a growing patchwork of state AI laws that are currently enforceable, and federal executive policy that is actively attempting to challenge that patchwork. The compliance planning challenge is real: state laws that are currently in force may be challenged, but until courts rule or Congress acts, those state laws remain in effect and organizations must comply with them.

**Federal landscape — as of 2026-03-06:**

President Trump signed EO 14179 in January 2025 revoking the Biden administration's AI safety testing and reporting requirements. EO 14319 (July 2025) directed federal agencies on AI use. EO 14365 (December 11, 2025) directed the Attorney General to establish an AI Litigation Task Force to challenge state AI laws deemed inconsistent with federal policy and directed the Secretary of Commerce to publish by March 11, 2026 an evaluation identifying burdensome state laws. The federal government's stated posture is "minimally burdensome" and "innovation-first." No comprehensive federal AI law has passed Congress. Federal agency enforcement through existing frameworks — FTC consumer protection, EEOC employment discrimination, OCC/CFPB/Fed financial services, HIPAA for healthcare — remains active and is not suspended by executive orders.

**State law obligations currently in effect or imminent:**

Colorado's AI Act — the most comprehensive US state AI law — applies to developers and deployers of high-risk AI systems making or substantially influencing consequential decisions in categories including education, employment, housing, credit, healthcare, insurance, and legal services. Its original February 2026 effective date was delayed to June 30, 2026. For ComPassAI risk assessments feeding into consequential decisions for Colorado residents, this law requires impact assessments, disclosure obligations, and the right to contest automated decisions. Operators must verify the current Colorado Act status and amendment history before the June 30, 2026 date.

California enacted three AI laws effective January 1, 2026: the Transparency in Frontier AI Act (critical safety incident reporting), the GAI Training Data Transparency Act (AB 2013, requiring disclosure of training datasets for covered systems), and the AI Transparency Act (SB 942, requiring disclosure when content is AI-generated). Training data transparency obligations under AB 2013 may apply to AurorAI's extraction models if they qualify as covered AI systems under California's definitions — operators should obtain legal confirmation before making California deployment claims.

Illinois's Artificial Intelligence Video Interview Act (effective 2026) requires notification to candidates before AI-based evaluation of video interviews and sets data retention requirements. New York City Local Law 144 (effective July 2023) requires third-party bias audits of automated employment decision tools used in hiring or promotion affecting NYC residents. Both apply to narrow use cases but directly govern those use cases; they are not general AI laws and should not be confused with the broader Colorado/California frameworks.

**Sector-specific federal frameworks:**

For healthcare deployments, HIPAA applies in full to any PHI processed by AurorAI. The HIPAA de-identification requirements (Safe Harbor method or Expert Determination method) are more specific than general PII pattern matching — AurorAI's PII masking controls must be explicitly configured to meet HIPAA standards, not merely general privacy standards. For financial services, the OCC/FDIC/Fed joint guidance on AI in financial services and FTC consumer protection enforcement apply. The NIST AI Risk Management Framework (AI RMF 1.0, January 2023) is voluntary but widely referenced in US government contracting and financial regulation; ComPassAI's T0–T3 tiering is conceptually aligned with the AI RMF's Govern, Map, Measure, Manage functions, and documenting that alignment strengthens defensibility.

**What AurorAI and ComPassAI provide toward US obligations:**

The evidence package chain of custody addresses Colorado AI Act impact assessment documentation requirements. The HITL gate and human approval workflow address contestability obligations where required. The model card addresses transparency disclosure requirements. NIST AI RMF alignment documentation can be generated from ComPassAI governance records for US federal and financial services contexts.

**What AurorAI and ComPassAI do not provide:**

Colorado AI Act legal compliance determination for specific use cases. California training data transparency disclosures (depends on model provenance, not governance workflow). Third-party bias audit required by NYC Local Law 144 (requires independent auditor). HIPAA Safe Harbor de-identification certification. Legal basis assessment for any sector-specific regulatory obligation.

**Inversion checkpoint:** The assumption most likely to be wrong in this section is that the state law patchwork will remain stable through the second half of 2026. EO 14365's AI Litigation Task Force could successfully invalidate specific state laws, or Congress could pass preemptive federal legislation. Either outcome would require material revision to this section. Operators who have built compliance programs around Colorado or California obligations should monitor court developments closely.

**`⚠ Review by: 2026-07-01`** — Colorado AI Act effective June 30, 2026. Commerce Department evaluation of state AI laws was due March 11, 2026 — review outcomes and any resulting federal litigation. FTC AI policy statement due March 11, 2026 — review enforcement implications.

*If the federal preemption challenge succeeds for one state law and not another, the compliance map for US deployments will need to be redrawn jurisdiction by jurisdiction — not updated with a single edit.*

---

## A.4 United Kingdom

**Jurisdictional scope:** The UK post-Brexit has a distinct regulatory framework from the EU. UK GDPR applies to processing of UK residents' personal data. The EU AI Act does not apply in the UK — but UK-based organizations that place AI systems on the EU market or affect EU persons are separately subject to the EU AI Act, in addition to UK GDPR. Both section A.1 and this section may apply simultaneously for UK operators serving EU clients.

**Current state of AI-specific law — as of 2026-03-06:**

The UK has no standalone horizontal AI legislation in force. The government's approach is pro-innovation, principles-based, and sector-specific. The DSIT 2023 White Paper established five cross-sectoral principles — Safety, Security and Robustness; Appropriate Transparency and Explainability; Fairness; Accountability and Governance; Contestability and Redress — that existing sectoral regulators are expected to apply. These principles are non-statutory guidance. They are not backed by specific legislation creating enforceable obligations for private-sector organizations in the way the EU AI Act does. A comprehensive AI Bill is anticipated in 2026; until it passes, the UK operates on a principles-first basis.

The Data (Use and Access) Act received Royal Assent on June 19, 2025. It relaxes some constraints on automated decision-making relative to UK GDPR Article 22 and expands lawful bases for data use in research and public services contexts. For AurorAI deployments processing data for research or public service purposes, the updated lawful bases may expand what is permissible — operators should obtain legal confirmation before relying on these provisions. The AI Safety Institute was renamed the AI Security Institute in February 2025, reflecting a pivot toward security-focused risks (weapons development, cyber threats) rather than broad safety concerns like bias and discrimination.

**UK GDPR obligations:**

UK GDPR is substantively equivalent to EU GDPR for most purposes but is administered by the ICO independently of EU data protection authorities. All GDPR obligations described in section A.1 apply under UK GDPR with the ICO as supervisory authority. Cross-border data transfers from the UK to non-adequate third countries — including the US in most contexts — require Standard Contractual Clauses (International Data Transfer Agreements in UK terminology) or other transfer mechanisms. The ICO committed in March 2025 to producing a statutory Code of Practice for AI and automated decision-making; that Code is under development as of March 2026 and will materially affect AurorAI/ComPassAI obligations once published.

**Sector-specific UK regulators:**

For financial services, the FCA's model risk management guidance (SS1/23) applies to algorithmic and AI-driven models in regulated firms. ComPassAI governance records address the documentation and monitoring aspects of model risk management, but FCA compliance is not automatic — the FCA expects firms to demonstrate independent validation, explainability, and ongoing monitoring in ways that go beyond governance documentation. For healthcare, the MHRA regulates AI as a medical device where the system is intended to support clinical decisions. AurorAI processing clinical documents for administrative purposes is unlikely to trigger MHRA regulation; AurorAI supporting diagnostic or treatment decisions likely does. The distinction is the intended purpose, not the technology.

**ISO/IEC 42001 relevance:**

ISO/IEC 42001 (AI Management Systems, published December 2023) is referenced in UK DSIT guidance and by the AI Security Institute. ComPassAI's governance architecture is conceptually aligned with ISO 42001's management system requirements — governance, risk assessment, policy, operational controls, performance evaluation, and improvement. ISO 42001 certification requires an external certification body and is currently listed as `roadmap` in the main specification's regulatory alignment table. UK clients requesting ISO 42001 alignment as a procurement requirement should receive an honest roadmap timeline, not a current capability claim.

**What AurorAI and ComPassAI provide toward UK obligations:**

UK GDPR controls (legal basis, PII masking, HITL for significant decisions, audit trail, DPIA generation) map directly from section A.1 guidance above. The governance documentation structure supports the DSIT five principles in an auditable way. FCA model risk management documentation requirements are partially addressed by ComPassAI model cards and risk assessments — the gap is independent validation, which requires a separate engagement.

**What AurorAI and ComPassAI do not provide:**

Determination of whether the Data (Use and Access) Act 2025 relaxations apply to a specific use case. ICO Code of Practice compliance (the Code is not yet published). FCA independent model validation. MHRA medical device conformity assessment. ISO 42001 certification.

**Inversion checkpoint:** The assumption most likely to be wrong in this section is that the UK comprehensive AI Bill, when passed, will be substantially similar to the EU AI Act in its obligations. If the UK takes a materially different approach — lighter-touch, sector-specific rather than horizontal — operators who prepared for EU AI Act-equivalent obligations in the UK will have over-built for UK requirements. This is a better failure mode than the reverse, but operators should recalibrate when the Bill is published.

**`⚠ Review by: 2026-09-30`** — UK comprehensive AI Bill expected to be introduced or advanced in 2026. ICO statutory AI Code of Practice expected during 2026. Both require annex updates when published.

*A regulatory framework that has not yet been legislated cannot be treated as a compliance obligation — but it should be treated as a planning obligation, because the direction of travel is clear even when the arrival date is not.*

---

## A.5 Cross-Jurisdiction Obligations

**EU AI Act extraterritoriality** applies to operators in any other jurisdiction who place AurorAI or ComPassAI on the EU market or whose systems affect EU persons. Section A.1 applies in addition to the home jurisdiction section for any such deployment. This is not optional and cannot be contracted around.

**GDPR and UK GDPR data transfer rules.** Processing data about EU or UK persons using infrastructure hosted outside the EU or UK requires adequate transfer mechanisms. Canada currently benefits from an EU adequacy decision for PIPEDA-covered transfers, but this is under periodic review and does not extend to all Quebec Law 25 contexts. The US has no general EU adequacy decision; Data Privacy Framework certification is the primary EU-US transfer mechanism but has been challenged and should not be relied upon without current legal confirmation. Operators must confirm transfer mechanism status before deploying cross-border evidence infrastructure.

**Multi-jurisdiction evidence packages.** The evidence package schema must be configured to record the jurisdictional context of the processed document. A document processed for a French client may require CNIL-specific PII handling; the same document type processed for a UK client has different lawful basis requirements under UK GDPR. Per-extraction-id context fields in the evidence package support this differentiation — operators must populate them and configure jurisdiction-specific processing rules. A single processing configuration applied globally is unlikely to satisfy all five jurisdictions simultaneously.

**The Canada-France language and cultural context.** Quebec governance discourse anchors AI accountability in `gouvernabilité` — a concept that carries distinct weight in French-Canadian institutional culture, closer to "governability discipline" than the English "governance." For Quebec clients, ComPassAI governance documentation should use French as the primary working language and address Law 25's algorithmic transparency rights specifically in its templates — not only PIPEDA requirements. The Law 25 right to explanation applies to any decision made exclusively by automated processing; it belongs to the individual and is not waivable. Disclosure templates that do not include explanation-ready fields are non-compliant with this right on day one of any Quebec deployment.

---

## A.6 Minimum Compliance Configuration Checklist by Jurisdiction

This checklist is not a substitute for legal review. It identifies the minimum configuration decisions that must be confirmed before a production deployment. Unchecked items are blocking conditions for the `controls_satisfied` gate in ComPassAI's approval workflow — they are not aspirational targets.

**All jurisdictions — required before any production deployment:**

Establish the legal basis for processing personal data for each document type processed. Populate the `legal_basis` field in the evidence package schema before ingestion begins. Confirm that data subject rights obligations (access, rectification, erasure, objection) are operationally addressable for all personal data categories being processed. Document the data retention policy and configure AurorAI to enforce it. Confirm that cross-border data transfer mechanisms are in place if evidence infrastructure is hosted outside the country where data subjects are located.

**EU/France additions — blocking for EU deployments:**

Confirm EU AI Act Annex III risk classification against the specific use case and decision types with legal counsel. Complete DPIA if Article 35 threshold is met. Configure disclosure templates to include EU AI Act Article 13 transparency information for deployers. For France: confirm CNIL sector-specific guidance for the deployment domain; address Article L.311-3-1 CRPA algorithmic transparency if any output feeds into a public authority's individual administrative decision.

**Canada additions — blocking for Canadian deployments:**

Confirm PIPEDA lawful basis and, for Quebec deployments, Law 25 compliance independently of federal PIPEDA. Configure French-language disclosure templates with explanation-ready fields for any Quebec deployment. For federal institution deployments, complete the Government of Canada AIA before deployment and publish the result as required by the Treasury Board Directive. Document alignment with the Voluntary Code of Conduct in governance records.

**US additions — blocking before June 30, 2026 deployments:**

Confirm Colorado AI Act applicability and compliance requirements for consequential decision use cases before June 30, 2026 effective date. For California deployments, confirm training data transparency obligations under AB 2013. For HIPAA-covered processing, configure AurorAI de-identification controls to meet Safe Harbor or Expert Determination standards specifically — not general PII masking. For NYC employment decision tools, confirm third-party bias audit requirement before deployment.

**UK additions — blocking for UK deployments:**

Confirm UK GDPR transfer mechanism for any EU data processed in UK infrastructure or vice versa. For FCA-regulated entities, confirm that FCA model risk management requirements are addressed alongside — not substituted by — ComPassAI governance. Monitor ICO Code of Practice development and implement required controls when published. Confirm MHRA medical device regulation does not apply to the specific use case before healthcare deployment.

---

## A.7 Regulatory Change Monitoring

AI regulation is not stable in any of the five jurisdictions in this annex. Treating this document as permanently current is not a compliance posture — it is the absence of one. The following monitoring commitments are required.

ComPassAI's policy engine supports policy rule versioning. When a new regulation takes effect or new guidance is published, a new policy version should be created and affected use cases flagged for re-assessment. Policy version changes do not retroactively invalidate prior approvals but trigger re-assessment at the next review cycle.

The following events require annex updates and likely require policy engine updates when they occur: EU AI Act Annex III high-risk obligations taking effect (August 2026 and August 2027 tranches); Canadian CPPA passage and commencement; UK comprehensive AI Bill passage and commencement; Colorado AI Act full implementation and any federal legal challenge outcomes; FTC AI policy statement publication; ICO statutory AI Code of Practice publication; and any EU adequacy decision review affecting Canada-EU or UK-EU data transfers.

Regulatory monitoring is assigned to the `governance_admin` role in ComPassAI's RBAC structure. Monitoring events are logged as governance tasks in `if.blackboard` with an assigned owner and review date. Any monitoring event without an assigned owner in `if.blackboard` is a governance gap — not a background activity.

**Annex self-check:** If this annex is read more than 90 days after the freshness date of 2026-03-06T00:00:00Z without a recorded refresh event in `if.blackboard`, it should be treated as `A-stale` for all jurisdictions. A stale annex does not block operations, but it blocks promotion-level compliance language in client-facing materials until the annex is refreshed.

*If this annex is not updated when material regulatory changes occur, the compliance posture it describes will become inaccurate. An outdated annex is worse than no annex — it creates false confidence in operators who are doing the right thing by following it.*

---

## Annex Reviewer Conclusion Boundary Block

**What reviewers can conclude from this annex:** That AurorAI and ComPassAI's governance architecture addresses real, current regulatory obligations across five jurisdictions. That the specific obligations described are accurately characterized against law in force as of March 2026. That the checklist items in section A.6 represent genuine minimum configuration requirements. That the freshness gates and review dates are honest.

**What reviewers cannot conclude from this annex:** That deploying AurorAI and ComPassAI with the configuration checklist completed constitutes regulatory compliance in any jurisdiction. That this annex is a substitute for legal advice. That the regulatory landscape described will remain unchanged through the operator's deployment timeline. That any `preview`-status module integration provides the production-grade control reliability that regulatory compliance requires.


---

# Annex B: InfraFabric Source Implementation Matrix

This annex is the explicit bridge between the InfraFabric source corpus in `C:\Users\softinfo\Documents\InfraFabric` and the specification claims made above.

Its purpose is simple: a reviewer should be able to trace every integration claim in AurorAI and ComPassAI back to (1) a canonical module explainer and (2) at least one no-login verification surface.

## B.1 Structural Role Map

| Module | Registry floor used in this spec | Structural role in COM-AUR | Immediate product effect | Explicit non-upgrade rule |
|---|---|---|---|---|
| if.trace | `shipped` | Receipt and byte-integrity anchor | Evidence packages and deliverables can carry externally reviewable integrity markers | Does not upgrade extraction correctness, governance correctness, or compliance posture |
| if.bus | `preview` | Handoff discipline and envelope transport | AurorAI-to-ComPassAI evidence transfer can be structured and replay-guarded | Does not justify SLA, exactly-once, or HA claims |
| if.api | `preview` | Contract and adapter substrate | External system inputs can be normalized before governance handling | Does not create a public runtime endpoint guarantee |
| if.blackboard | `preview` | Append-only coordination evidence | Task, debt, and workflow visibility can be made reviewable | Does not prove message delivery, cryptographic immutability, or certification readiness |
| if.context | `preview` | Provenance and staged context environment | Evidence can move through explicit ingest -> summarize -> index -> publish stages | Does not justify GA retrieval/runtime claims |
| if.knowledge | `preview` | Graph-backed retrieval and dependency context | Advisory extraction guidance and bounded impact-analysis context become possible | Does not justify GA query, semantic-truth, or autonomous decision claims |
| if.gov | `preview` | Governance spine and decision-rights structure | Tiering, stop conditions, uncertainty capture, and review patterns gain a disciplined frame | Does not justify automated council-runtime claims |
| if.story | `preview` | Narrative trajectory protocol | Deliverables can record bitmap state and vector rationale without pretending the narrative is the policy | Does not create a deployed runtime service claim |
| if.switchboard | `preview` | Alert-routing and coordination design lane | Monitoring and escalation signals can be modeled as routed events | Does not justify real-time control-plane or routing-SLA claims |
| Agent Rook | `preview`, `pass_with_risk` | Autonomous execution persona with air-gap controls | Autonomous closeout can be bounded by explicit attestation requirements | Does not justify certified autonomy or procurement-safe automation claims |
| if.emotion | `shipped` | Tone and stakeholder-calibration substrate | Governance communications can stay empathic without abandoning rigor | Does not substitute for evidence, policy, or approval controls |

## B.2 Canonical Module Evidence Matrix

| Module | Canonical local source file | Public no-login surfaces used here | Safe current claim | Explicit non-claim |
|---|---|---|---|---|
| if.trace | `2302-if-trace-full-explainer-v1.2-2026-03-03T004910Z.md` | `https://infrafabric.io/if/trace/`, `https://infrafabric.io/static/trace/6qRgcR01kw_qNo63Dbs_ob9n`, `https://infrafabric.io/static/hosted/iftrace.py` | Byte-integrity receipt verification is real and externally reviewable | Receipt presence does not prove content truth, correctness, or compliance readiness |
| if.bus | `2308-if-bus-full-explainer-v1.5-2026-03-03T124500Z.md` | `https://infrafabric.io/if/bus/`, `https://infrafabric.io/llm/products/if-bus/index.md.txt` | Preview envelope transport and control-auth surfaces exist | No exactly-once, GA, or universal signed-event claims |
| if.api | `690-if-api-full-explainer-v1.1-2026-02-23T050800Z.md` | `https://infrafabric.io/if/api/`, `https://infrafabric.io/llm/products/if-api/`, `https://infrafabric.io/static/hosted/review/if-api-integrations-inventory/2026-01-10/index.html` | Preview adapter and contract surfaces are inspectable | No public runtime endpoint contract or GA claim |
| if.blackboard | `2346-if-blackboard-full-explainer-v1.3-2026-03-06T080636Z.md` | `https://infrafabric.io/llm/blackboard/index.md.txt`, `https://infrafabric.io/llm/blackboard/tasks.open.md.txt`, `https://infrafabric.io/llm/signals/index.md.txt` | Append-only coordination evidence and visible debt queues are reviewable | No message-delivery, SLA, or certification claim |
| if.context | `2313-if-context-full-explainer-v1.3-2026-03-03T145500Z.md` | `https://infrafabric.io/static/hosted/review/if-context-architecture/2026-01-25/index.md.txt`, `https://infrafabric.io/static/hosted/review/if-context-full-auto/2026-01-27/index.md.txt` | Preview staged-control and provenance mechanics are documented and reviewable | No GA runtime retrieval claim |
| if.knowledge | `2315-if-knowledge-full-explainer-v1.1-2026-03-03T150500Z.md` | `https://infrafabric.io/if/knowledge/`, `https://infrafabric.io/chat/capabilities`, `https://infrafabric.io/chat/healthz`, `https://infrafabric.io/llm/switchboard/knowledge-scope/latest.json` | Preview runtime retrieval with enforced scope and audit boundaries is now a valid bounded claim | No GA query, SLO, or semantic-truth claim |
| if.gov | `643-if-gov-full-explainer-v1.1-2026-02-21T023500Z.md` | `https://infrafabric.io/if/gov/`, `https://infrafabric.io/llm/products/if-gov/CANONICAL_CURRENT.md.txt` | Governance framing, stop conditions, and preview reference runs are valid claims | No deployed council-runtime or legal-certification claim |
| if.story | `611-if-story-full-explainer-v1.1-2026-02-19T205546Z.md` | `https://infrafabric.io/if/story/`, `https://infrafabric.io/llm/products/if-story/demo/narrative_log.v1.md`, `https://infrafabric.io/if/story/lint-rules/` | Preview narrative protocol and lintable trajectory artifacts are real | No deployed runtime service or SLA claim |
| if.switchboard | `714-if-switchboard-full-explainer-v1.4-2026-03-02T090000Z.md` | `https://infrafabric.io/llm/products/if-switchboard/index.md.txt`, `https://infrafabric.io/llm/signals/recent.md.txt` | Preview routing/control-plane evidence exists | No GA routing guarantee or certification language |
| Agent Rook | `2312-agent-rook-full-explainer-v1.4-2026-03-03T141200Z.md` | local explainer plus referenced control artifacts | Air-gap autonomous operation can be described only as `pass_with_risk` with required attestation tuple | No certified autonomy or blackboard-ledger hard-gate claim |
| if.emotion | `2343-if-infrafabric-miniseries-v1.0-2026-03-05T150000Z.md` plus `00_combined_whitepaper.md` | `https://www.emo-social.com/` and shipped `if.emotion` registry posture | Shipped emo-social communication substrate can inform stakeholder messaging style | No substitution for governance evidence or approval logic |

## B.3 Processing Logic Map

| Stage | AurorAI responsibility | InfraFabric logic carried into the stage | ComPassAI responsibility | Recursive state that must persist |
|---|---|---|---|---|
| Artifact intake | Store file, hash, preview, source identity | `if.trace` reconstructability discipline begins at byte identity | None yet, but later use-case linkage depends on stable hashes | Artifact version lineage |
| Classification pass | Assign category and document type with confidence | `if.api` contract discipline, `if.context` staged handling | None yet | Processing run history per stage |
| Extraction pass | Produce field set plus control signals | `if.context` provenance, `if.knowledge` advisory graph context, `if.trace`-ready hashes | None yet | Re-extraction must produce a new run, not mutate the old one |
| Review gate | Trigger HITL on low confidence or bad controls | `if.gov` stop-condition logic, `if.blackboard` debt visibility | Later consumes review outcomes as evidence quality context | Review decisions and reopen actions |
| Evidence packaging | Build append-only evidence package | `if.story` structure for trajectory, `if.trace` optional receipt boundary | Ingests only what the package proves | Package supersession history |
| Evidence handoff | Post package into governance intake | `if.bus` transfer discipline, `if.api` normalized contract | Verify hash, version, and schema before governance use | Handoff attempts and outcomes |
| Use-case assessment | N/A | `if.gov` tiering logic and uncertainty discipline | Risk-tier the use case and derive required controls/deliverables | Assessment lineage and cycle lineage |
| Governance reopen | N/A | `if.blackboard` visible debt, `if.gov` challenge/reopen logic | New evidence can force reassessment instead of silent overwrite | Feedback actions and child cycles |
| Deliverable generation | N/A | `if.story` bitmap + vector structure, `if.trace` optional integrity receipts | Emit evidence-derived documents only | Deliverable-to-evidence traceability |

## B.4 Implementation Consequence

The practical consequence of this annex is that AurorAI and ComPassAI must preserve recursive state explicitly.

That means:

- new extraction pass -> new processing run
- new review outcome -> new review decision
- regenerated evidence package -> new package version with supersession reference
- new governance assessment -> new assessment record with parent linkage
- new evidence after assessment -> feedback action plus reassessment path

Any implementation that collapses these events into one mutable "latest state" record is no longer following the InfraFabric processing logic described in this specification.
