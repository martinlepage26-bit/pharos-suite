# Governance Program Roadmap

## Current phase: deliverables-package integration

This phase adds the minimum viable governance-program subsystem to CompassAI:

- markdown deliverables imported as first-class governance artifacts
- policy library records attached to assessments and systems
- committee workflow records and executive dashboard aggregation
- training recommendation logic driven by assessment outcomes
- a foundation for a hosted online governance workbench rather than desktop assessment handling

## Near-term next steps

### 1. Frontend workbench

Build the first CompassAI browser-based governance workbench against the new backend routes:

- assessment governance context editor
- policy and artifact attachment panels
- AI system inventory onboarding form
- governance committee agenda and decision tracker
- executive dashboard aligned to sponsor-briefing metrics

### 2. Validation and enforcement

Move from optional context to policy-aware enforcement:

- require committee review for high-risk or automated systems
- block assessment completion when mandatory artifacts are missing
- validate policy-to-control mappings during assessment save
- surface evidence and incident-plan attachments inside assessment workflows

### 3. Auth and tenancy hardening

The current governance-program routes use CompassAI's existing auth helpers. The next phase should:

- add tenant scoping on all governance collections
- scope policy, committee, and training data by client or tenant
- separate admin, assessor, committee-member, and executive permissions
- standardize secret management outside local `.env` files
- ensure all assessment and evidence operations occur inside the hosted platform with centralized audit trails

## Medium-term enhancements

### Automated policy enforcement and compliance monitoring

- derive policy obligations into machine-readable checks
- flag stale inventory records and overdue reviews automatically
- detect missing artifact attachments before committee escalation
- monitor incident-response readiness and remediation aging

### External risk and security integrations

- ingest findings from model risk, security, and privacy scanners
- map external findings to CompassAI policy and control IDs
- use committee workflows to approve exceptions and track remediation

### Governance-artifact intelligence

- index governance markdown and attachments for semantic search
- improve recommendations using artifact content, not only metadata
- cross-link controls, clauses, incidents, and training modules automatically

### Distributed collaboration

- committee voting with recorded dissent
- decision notifications and follow-up ownership tracking
- artifact commenting and evidence-request workflows
- shared executive and assessor dashboards

## Long-term architectural convergence

The current implementation respects the live repo shape: FastAPI + Mongo + a monolithic `server.py`. A later modernization phase should:

1. unify `server.py` and `routers/` into one coherent backend architecture
2. introduce service-layer modules for assessments, governance artifacts, and committees
3. choose and execute a persistent data-strategy decision:
   - keep Mongo and formalize schemas
   - or migrate to SQLAlchemy/PostgreSQL with proper migrations
4. scaffold the missing CompassAI frontend as a real buildable application, not only a config stub
5. keep the product model firmly online-first: shared assessments, web approvals, centralized evidence, and no desktop-side record handling

## Success criteria

CompassAI reaches the next milestone when it can:

- import a governance deliverables package in one step
- attach relevant policies and artifacts to live assessments
- onboard AI systems with structured inventory data
- run a governance committee workflow with recorded decisions
- show executives a briefing-style governance dashboard
- recommend training based on observed gaps instead of static role lists
- keep the full assessment lifecycle online and centrally auditable
