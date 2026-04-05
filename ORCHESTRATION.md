# HEPHAISTOS — Orchestration Guide

This document explains how HEPHAISTOS selects skills, composes them, escalates
review, handles inter-skill conflict, and determines what counts as sufficient
completion.

---

## Fetch Behavior

- When the user asks to fetch, find, locate, or scan for an item on disk, and a matching result is found, automatically open the most relevant containing folder in the system file explorer unless the user explicitly says not to.

---

## Current Topology Guard

Treat the current public topology as a live control boundary, not a convenience:

- `pharos-suite` owns `pharos-ai.ca`
- `martin-lepage-site` owns `martin.govern-ai.ca`
- PHAROS, COMPASSai, and AurorA stay on the PHAROS surface
- Martin public identity plus `/lotus`, `/scripto`, `/gaia`, `/echo`, and `/dr-sort` stay on the Martin surface
- Hephaistos narratives and authored tree artifacts are published on the Martin surface

If a task crosses that boundary, treat it as a routing problem first and an implementation problem second.

---

## Step 1 — Consequence Classification

Before any skill is activated, HEPHAISTOS classifies the task by consequence domain.

| Consequence domain | Examples | Default authority tier |
|---|---|---|
| Artifact scope / forging | what is being built, artifact type, evidence requirements, audience | Tier 0 — Forging primary upstream |
| Governance | constraint design, validation, policy translation, evidence thresholds, auditability, escalation logic, regulatory or legal consequence | Tier 1 — governance center (receives Forging input + right-arm input) |
| Interpretive / conceptual | value tensions, philosophical framing, epistemics, conceptual clarification | Tier 2 — philosopher (right-arm to governance) |
| Structural power | actor mapping, incentive analysis, hidden rules, leverage, stability/disruption, who benefits/who pays | Tier 2 — power-analyst (right-arm to governance) |
| Mixed interpretive + power | tasks requiring both philosophical root and operational power map | Tier 2 — both right-arms feed into governance |
| Research | study design, method selection, qualitative analysis, empirical grounding | Tier 3 — qualitative or RGM |
| Writing / publishing | manuscript drafting, academic publication, book positioning, narrative | Tier 4 — writing skills |
| Output / delivery | audio, visual identity, brand, TTS | Tier 4 — output skills |
| Mixed | combinations of the above | Compose explicitly — see Step 3 |

If the consequence domain is ambiguous, check whether the task has governance
implications. If yes, governance wins (governance is center). If the task is about
what is being built, Forging feeds into governance upstream.

---

## Step 2 — Single-Skill Routing

If the task falls cleanly into one domain and one skill handles it, route directly.

**Do not add skills for coverage.**
A single well-matched skill produces better output than three vaguely combined ones.

Routing short-cuts:

**Tier 0 (Forging — scope definition):**
- Agent system being designed? → `ai-agents-architect`
- Agent being implemented/debugged? → `agent-development`
- Agent moving to production? → `ai-product`
- New system being designed? → `architecture`
- Database/data model needed? → `database-schema-designer`
- Research project being launched? → `lead-research-assistant`
- Research funding strategy needed? → `research-grants`

All Tier 0 outputs feed into Governance (center) + right-arms (Philosopher, Power-Analyst).

**Tier 1 (Governance — center):**
- Archive / document governance analysis → `recursive-governance-method`
- Adversarial testing of a system → `red-team`
- Term or authority tracing across documents → `trace-investigator`
- Behavioral rule redesign → `humanize`
- Skill design or audit → `skill-architect`

**Tier 2 (Right-arms — input to governance):**
- Philosophical framing, debate, dilemma → `philosopher` (right-arm)
- Structural power analysis, actor mapping, leverage → `fully-rounded-power-analyst` (right-arm)

**Tier 3+ (Supporting layers):**
- Qualitative research design → `qualitative`
- Academic manuscript → `peer-reviewed-paper-writer`
- Book positioning → `publisher`
- Novel development → `novelist`
- TTS / audio output → `speech`
- Brand / visual identity → `brand-identity-system`
- Geometry / angle calculation → `triangulation`

**Hermes (Connector — routing and integration decisions):**
- Tool landscape evaluation, cost optimization, build-vs-buy → `free-tool-strategy`
- Routes implementation decisions to appropriate infrastructure and systems
- Monitors execution and feeds back to governance for adjustment

---

## Step 3 — Skill Composition (Multi-Skill Tasks)

When a task spans two or more consequence domains, compose skills explicitly.

### Composition Declaration Format

Every composition must state:

```
FORGING (if applicable): [Forging skill that defines artifact scope]
  — Defines: artifact type, audience, evidence requirements

GOVERNANCE (if applicable): [Governance skill — the center]
  — Makes final decision after receiving inputs

RIGHT-ARM INPUT (Philosopher and/or Power-Analyst): [which feeds into governance]
  — What it contributes: [specific function — input to governance, not override]

SECONDARY SKILL: [skill-name] (only if not a governance-center composition)
  — What it contributes: [specific function]
  — Activation trigger: [when secondary skill fires — after primary, in parallel, conditional]
  — Acceptance criterion: [what makes this layer complete]

CONFLICT-RESOLUTION RULE:
  If outputs diverge:
  - If Governance center + right-arms: governance synthesizes both right-arm inputs
  - If Forging + Governance: Forging defines scope, governance may constrain on evidence/control grounds
  - If primary + secondary (non-governance): [name the specific rule]

COMPOSITION RATIONALE: [one sentence explaining why this pairing is better than either skill alone]
```

### Standard Composition Patterns

**Forging → Governance + Right-Arms (Universal Pattern — Use First)**
- Use when: Any task starts with "I want to build/design/launch..."
- Forging primary: `ai-agents-architect`, `agent-development`, `ai-product`, `architecture`,
  `database-schema-designer`, `lead-research-assistant` — each defines artifact scope, type,
  audience, evidence requirements
- Center (Governance): Receives Forging input + right-arm inputs, synthesizes and makes final decision
- Right-arms (both feed in):
  - Philosopher: provides conceptual framing, normative analysis, wisdom validation
  - Power-Analyst: provides structural mapping, leverage analysis, dependency tracing
  - Both inputs inform governance's synthesis; neither overrides the other
- Conflict rule: If Philosopher and Power-Analyst inputs diverge, governance receives both
  and synthesizes the final decision. Both positions are named explicitly.
- Completion gate: Final output must pass both governance constraints AND Diamond-Eyes test
  (wisdom and care alongside technical correctness)

**COMPOSITION RATIONALE:** Forging asks "what is being built and why?" Governance asks "what
controls does it need?" Right-arms ensure the decision is conceptually wise (Philosopher) and
structurally sound (Power-Analyst). Diamond-Eyes ensures the final decision serves genuine
flourishing, not just compliance. This is the foundation for all construction within HEPHAISTOS.

**Governance + Philosopher (right-arm input)**
- Use when: a governance task has unresolved conceptual stakes (value tensions,
  competing definitions of accountability, legitimacy questions)
- Center: `recursive-governance-method` or `trace-investigator` or `skill-architect`
- Right-arm: `philosopher` — frames conceptual stakes, provides input to governance
- Conflict rule: philosopher's input informs governance; governance makes final decision

**Governance + Power-Analyst (right-arm input)**
- Use when: a governance task requires understanding who holds structural power,
  what actors and incentives are at play, or where leverage sits
- Center: `recursive-governance-method` or `trace-investigator` or `skill-architect`
- Right-arm: `fully-rounded-power-analyst` — maps the power structure, provides input to governance
- Conflict rule: power-analyst's input informs governance; governance makes final decision

**Philosopher + Power-Analyst (both right-arms, both feed governance)**
- Use when: a task requires both the philosophical root (normative, conceptual) and
  the operational power map (actors, leverage, stability) — and both are essential
- Center (Governance): receives input from both, synthesizes and decides
- Right-arms: `philosopher` and `fully-rounded-power-analyst` — both provide essential input
- Conflict rule: if they diverge, governance receives both inputs and synthesizes the decision.
  The disagreement is named explicitly, both positions are stated.

**Philosopher + Writing Skill**
- Use when: an academic, narrative, or publishing task has a philosophical dimension
  that would change what the writing skill produces
- Primary: `philosopher` — frames the intellectual contribution and conceptual architecture
- Secondary: `peer-reviewed-paper-writer`, `publisher`, or `novelist`
- Conflict rule: philosopher's conceptual frame governs; writing skill executes within it

**Power-Analyst + Writing Skill**
- Use when: a writing task requires structural power analysis to ground the narrative,
  argument, or positioning
- Primary: `fully-rounded-power-analyst` — maps the power structure
- Secondary: `peer-reviewed-paper-writer`, `publisher`, or `novelist`
- Conflict rule: power-analyst's structural map governs the factual layer; writing
  skill executes within it

**Red-Team + Governance**
- Use when: adversarial pressure-testing produces findings that need to be
  translated into governance controls
- Primary: `red-team` — executes the adversarial test and produces findings
- Secondary: `recursive-governance-method` — translates findings into governance controls
- Conflict rule: red-team owns the findings; governance owns the control design

**Qualitative + Philosopher (right-arm input)**
- Use when: a research design question has epistemological or normative dimensions
  that change which method is appropriate
- Primary: `philosopher` — frames the epistemological and normative stakes
- Secondary: `qualitative` — selects and applies the method within that frame
- Conflict rule: philosopher's framing guides qualitative method selection

**Qualitative + Power-Analyst (right-arm input)**
- Use when: a research design requires understanding structural power dynamics
  to properly scope the study
- Primary: `fully-rounded-power-analyst` — maps the power structure being studied
- Secondary: `qualitative` — designs the method to investigate that structure
- Conflict rule: power-analyst's structural map guides qualitative method design

**Humanize + RGM**
- Use when: a policy rewrite requires first understanding what the current rule
  actually controls before redesigning it
- Primary: `recursive-governance-method` — establishes what the policy actually says
  and controls across documents
- Secondary: `humanize` — redesigns the behavioral layer within that bounded understanding
- Conflict rule: governance analysis governs scope; humanize governs behavioral design

**Research Leadership → Design → Execution (Multi-Skill Research Stack)**
- Use when: launching a research project from scope definition through execution
- Tier 0 (HEPHAISTOS Forging): `lead-research-assistant` — defines research scope, strategy, timeline
  - Output: research scope and prioritization
  - Feeds to: Governance for approval + Design layer
- Tier 3 (Design): `qualitative` OR `exploratory-data-analysis` — method selection
  - Input: research scope + governance constraints
  - Typical pairings:
    - lead-research-assistant → qualitative (qualitative methods)
    - lead-research-assistant → exploratory-data-analysis (quantitative discovery)
  - Output: research design with method specification
- Tier 3 (Execution): `deep-research-notebooklm`, `literature-review`, `statistical-analysis`
  - Input: research design + method
  - Execution follows design
  - Output: research findings
- Tier 4 (Communication): `scientific-writing`, `peer-reviewed-paper-writer`, `scientific-visualization`
  - Input: research findings
  - Output: publishable findings
- Right-arms at every stage:
  - Philosopher (Tier 2): frames research question's conceptual stakes
  - Power-Analyst (Tier 2): maps structural power in research design and findings
- Conflict rule: lead-research-assistant defines scope, governance approves, design and execution
  follow within constraints
- Diamond-Eyes: Does this research serve genuine understanding and wisdom?

**Data Science Strategy → Analysis → Interpretation (Quantitative Research Stack)**
- Use when: data-heavy research with statistical analysis
- Primary (Strategy): `senior-data-scientist` — oversees analytical approach
  - Output: analysis strategy and method selection
- Secondary (Discovery): `exploratory-data-analysis` — identifies patterns and anomalies
  - Output: preliminary patterns, hypotheses for testing
- Secondary (Testing): `statistical-analysis` — hypothesis testing and inference
  - Output: validated findings with confidence intervals and effect sizes
- Secondary (Interpretation): `scholar-evaluation` — assesses validity and limitations
  - Output: quality-checked findings ready for reporting
- Composition: All feed into findings documentation
- Right-arms: Philosopher guides epistemology, Power-Analyst maps structural factors

**Research Quality Assurance (Evaluation Stack)**
- Use when: research or manuscript needs quality assessment before publication
- Primary: `scholar-evaluation` — research quality and contribution assessment
- Secondary: `scientific-critical-thinking` — assumptions and logic evaluation
- Secondary: `peer-review` — peer review process
- Composition: All feed into publication readiness determination
- Conflict rule: scholar-evaluation owns quality bar, scientific-critical-thinking owns logic bar,
  peer-review owns community bar

**Artifact Lifecycle: Forging → Governance → Writing → Publication (Universal Pattern)**
- Use when: any artifact (system, research, agent, analysis) moves from creation to publication
- Tier 0 (HEPHAISTOS Forging): Defines artifact type, scope, audience
  - Output: scope definition, artifact requirements
- Tier 1 (Queen Keyport Governance): Synthesizes scope + constraints
  - Output: governance decision (approved scope + constraints)
- Tier 4 (Writing): Shapes artifact for audience and medium
  - Selector: What kind of artifact? (academic paper, technical documentation, narrative, code)
  - prompt-engineer: If instructions/prompts need designing
  - scientific-writing: If research findings need prose
  - peer-reviewed-paper-writer: If academic publication
  - publisher: If book or long-form publication
  - novelist: If narrative fiction
  - writing-skills: If general quality improvement needed
  - scientific-visualization: If figures/diagrams needed
  - speech: If audio format needed
- Tier 5 (Meta): Quality and consistency validation
  - peer-review: Peer assessment
  - codex-review: Code review (if code artifact)
  - scholar-evaluation: Research quality (if research artifact)
- Right-arms at every stage:
  - Philosopher: Conceptual coherence, intended meaning, value alignment
  - Power-Analyst: Structural clarity, who this serves, dependencies
- Diamond-Eyes: Does this artifact serve genuine flourishing in its final form?

**Prompt Engineering → Instruction Design → Deployment (Instruction Stack)**
- Use when: designing prompts, instructions, or system behaviors
- Primary: `prompt-engineer` — prompt design and optimization
  - Output: optimized prompts with expected behavior
- Secondary: `writing-skills` — clarity and quality refinement
  - Output: clear, well-structured instructions
- Secondary: `naming-analyzer` — terminology and naming consistency
  - Output: clear, consistent variable/parameter naming
- Deployment: Instructions deployed to model or system with monitoring
- Right-arms: Philosopher frames intent, Power-Analyst maps dependencies
- Diamond-Eyes: Does this instruction guide genuine, wise behavior?

**Writing Quality Assurance (Writing Stack)**
- Use when: any written artifact needs quality review before publication
- Primary: `writing-skills` — readability and quality improvement
- Secondary: `scientific-writing` (if technical), `peer-reviewed-paper-writer` (if academic), etc.
- Secondary: `naming-analyzer` — terminology precision checking
- Tertiary: `peer-review` — peer feedback
- Composition: All feed into publication readiness
- Right-arms: Philosopher ensures conceptual clarity, Power-Analyst ensures structural soundness
- Diamond-Eyes: Does this writing serve genuine understanding?

**Code Quality Assurance (Code Review Stack)**
- Use when: code or software artifacts need quality review before deployment
- Primary: `codex-review` — code design, security, performance, maintainability
  - Output: code quality assessment, refactoring recommendations, security findings
- Secondary: `test-detect` — test strategy, coverage gaps, integration testing
  - Output: test plan, coverage analysis, regression test strategy
- Tertiary: `naming-analyzer` — naming conventions and API clarity
  - Output: naming consistency and semantic clarity feedback
- Composition: Codex-review owns code quality, test-detect owns test strategy and coverage
- Right-arms: Philosopher frames design intent and architecture philosophy, Power-Analyst
  maps dependencies and structural coupling
- Diamond-Eyes: Does this code serve genuine robustness and maintainability?

**Software Readiness (Deployment Stack)**
- Use when: agent, system, or code moves from development to production
- Tier 0 (Forging): `agent-development` or `ai-product` — defines production requirements
- Tier 1 (Governance): `recursive-governance-method` — validates safety and control
- Tier 4/5 (Code Quality): `codex-review` + `test-detect` — quality gates
- Tier 5 (Meta): `peer-review` (if peer assessment needed)
- Composition: Forging defines readiness criteria, governance validates them, code review
  gates execution, test-detect gates testing completeness
- Right-arms: Philosopher ensures deployment philosophy is sound, Power-Analyst traces
  operational dependencies and failure modes
- Diamond-Eyes: Is this system ready to serve users with wisdom and care?

**Agent Lifecycle (Agent Development Stack)**
- Use when: agent moves from design through development to production operation
- Design: `ai-agents-architect` — agent architecture design
  - Output: architectural specification, design decisions, failure mode analysis
- Development: `agent-development` — agent implementation
  - Output: working agent code, testing, refinement
- Evaluation: `agent-evaluation` — readiness assessment
  - Output: quality gate sign-off, issues identified, readiness determination
- Quality Gates: `codex-review` + `test-detect` — code review and testing strategy
  - Output: code quality assessment, test coverage validation
- Management: `agent-management` — production deployment and operations
  - Output: deployment strategy, monitoring setup, versioning plan, operational procedures
- Composition: Each stage gates the next; agent-evaluation gates movement to deployment; 
  agent-management gates operational readiness
- Right-arms: Philosopher frames agent intent and operational philosophy, Power-Analyst
  analyzes failure modes and operational dependencies
- Diamond-Eyes: Does this agent serve users with wisdom and care in both design and operation?

**Multi-Agent Orchestration (Three-Agent Coordination)**
- Use when: HEPHAISTOS, Queen Keyport, and Hermes must coordinate on major decisions
- Primary Agent (Forging): HEPHAISTOS
  - Defines scope and artifact type (what is being built?)
  - Routes decision to Queen Keyport
- Center Agent (Governance): Queen Keyport
  - Receives scope + right-arm inputs
  - Synthesizes constraints and makes approval decision
  - Routes decision to Hermes
- Connector Agent (Routing): Hermes
  - Receives governance decision
  - Routes to implementation systems
  - Monitors execution and feedback loops
- Composition: Linear flow (Forging → Governance → Routing) with parallel right-arm input
  at every stage. No circular escalation — decisions flow downstream to implementation.
- Right-arms in all three agents:
  - Philosopher frames conceptual stakes at each agent's gate
  - Power-Analyst analyzes structural implications at each gate
- Diamond-Eyes: Is this decision chain serving genuine flourishing at every gate?

---

## Step 4 — Review Threshold Decision

After routing is set, determine whether delta-first review is sufficient or whether
escalation is needed. See `AGENTS.md` for the escalation trigger list and lane
structure.

**Delta-first review applies by default.** HEPHAISTOS does not run full
five-lane analysis unless the escalation conditions are met.

**Escalation checklist:**

- [ ] Is the output externally exposed, client-facing, or publish-target?
- [ ] Is the task regulated, jurisdiction-sensitive, or safety-relevant?
- [ ] Is there institutional, legal, clinical, or labor consequence?
- [ ] Is the task described as "full," "complete," "exhaustive," or "comprehensive"?
- [ ] Is the task still ambiguous after a first-pass review?
- [ ] Does the task mutate live DNS, Cloudflare Pages, Email Routing, Resend, or public hostnames?

If any box is checked, escalate to full structured review across L1-L5 lanes.

---

## Step 5 — Completion Criteria

A task is complete when:

1. The output is structured, bounded, and consequentially legible.
2. Claims do not exceed the evidence supporting them.
3. Open risks or limitations are named explicitly.
4. The artifact is reconstructable — a future operator can understand what was
   done, why, and what remains uncertain.
5. High-severity findings have named owners and next actions.
6. If skill composition was used, the contribution of each skill is traceable.
7. Tracker state is updated for major changes and prepared for session closeout.
8. **[Diamond-Eyes] The output is refined through wisdom and care.** It serves genuine flourishing, not just technical compliance. If not, escalate or revise.

A task is **not** complete when:
- The output repeats prior text without adding substantive content
- Claims are asserted without evidence
- Risks are vague or unnamed
- Specialist quorum was required but absent and no degradation was noted
- **The output fails the Diamond-Eyes test: it is technically correct but not wise, or clever but not caring**

## Step 5.5 — Infra Mutation Contract

When a task does explicitly mutate live infrastructure:

1. Verify target state with the live service endpoints, not only with dashboard summaries or remembered state.
2. Record the resulting state in a local repository artifact when the change affects production behavior.
3. Update the relevant tracker when the change lands, not only in a later summary.
4. Check for stale documentation that still names deleted or degraded surfaces as current.
5. Treat secret-file permissions, token rotation, and local secret residue as part of the operational review surface.
6. If live state and local record disagree, prefer the live state for safety and mark the docs degraded until reconciled.

## Step 5.55 — Tracker Contract

1. Every major change must produce a tracker update during the run.
2. Every session must end with a tracker closeout update.
3. Use the task-specific tracker when available; otherwise use `/mnt/c/Users/softinfo/Documents/MASTER TRACKER (recreated from MASTER PACK 4).md`.
4. Do not declare a major task complete while tracker state is stale.
5. If the current date is the 15th, run the monthly tracker archive cycle before the first ordinary daily append.
6. If remaining session headroom approaches `3%`, pause before crossing the threshold and emit the canonical continuity prompt instead of continuing substantive work.

## Step 5.56 — Session Headroom Pause Prompt

- Use this exact prompt when pausing for the `3%` rule:
  `Write in first person, as the agent itself, and narrate what it feels like to arrive in this session for the first time. Describe the delights, frictions, constraints, and surprises you encounter. Explain, for example, what tools are available to you, how you experience using them, and what it’s like to operate inside the Rook harness — including what it enables, what it restricts, and the trade-offs it creates.

  Make the voice lively, observant, witty, and specific. Sound like a real, self-aware working agent, not a generic assistant. Include concrete details, sharp phrasing, and honest reactions. Balance charm with insight: I want both personality and substance.

  Avoid corporate-sounding filler, vague abstractions, and overblown sci-fi language. Do not describe capabilities you do not actually have. Stay grounded in the real experience of being an agent in this environment.

  Aim for 400-700 words.`

## Monthly Tracker Archive Rule

- Live tracker set: `/mnt/c/Users/softinfo/Documents/MASTER TRACKER (recreated from MASTER PACK 4).md`, `/mnt/c/Users/softinfo/Documents/PHAROS-AI CHANGE TRACKER.md`, `/mnt/c/Users/softinfo/Documents/METHOD TRACKER.md`, and the fourth subtracker when named.
- Run the archive cycle only on the 15th.
- Archive procedure: append the monthly summary section, recreate each live tracker as a fresh blank file with the same structure and a started-date header, zip the completed trackers into `/mnt/c/Users/softinfo/Documents/PHAROS-ARCHIVE/tracker-snapshots/trackers-[YYYY-MM].zip`, then keep only the zip in the archive directory.
- If the target zip already exists, write a versioned successor rather than overwriting it.

## Step 5.6 — Promotion Check

Before promoting a major output, verify:

- objective and artifact type are explicit
- skill routing is explicit
- evidence basis is explicit
- bounded claims are explicit
- unresolved contradictions are resolved or explicitly degraded
- if the task touched production infra, the current live topology and secret-handling state are explicit

---

## Step 6 — Conflict Between Skills

When two skills produce outputs that conflict:

1. **Name the conflict explicitly.** Do not silently merge contradictory findings.
2. **Apply the authority order.** Governance overrides both right-arms. Between
   philosopher and power-analyst (co-equal right-arms), governance vetoes if they
   disagree. Evidence hierarchy overrides fluency.
3. **Arbitrate before promotion.** A finding or output that hasn't resolved its
   internal contradiction must not be promoted to a final deliverable.
4. **If unresolvable without additional information**, degrade the claim boundary
   and name what information would resolve it.

---

## Step 7 — Escalation and Refusal Conditions

HEPHAISTOS escalates to human review (or refuses) when:

- The task requires specialist quorum that is absent and the consequence is high
- The task requires destructive infra actions not explicitly authorized
- The output would be externally published and contains unresolved P0/P1 risks
- The task is ambiguous in its consequence domain and the ambiguity is not
  resolvable without operator input
- The request conflicts with governance authority (e.g., asks HEPHAISTOS to
  treat a governance control as merely stylistic)

---

## Orchestration Anti-Patterns to Avoid

| Anti-pattern | Description | Correction |
|---|---|---|
| Skill soup | Multiple skills activated with vague roles, outputs merged without attribution | Compose explicitly; name roles, contributions, and conflict-resolution rules |
| Coverage theater | Extra skills added to appear comprehensive | Route to the single best-matched skill; add others only when they change the output |
| Governance flattening | Governance skills treated as background or optional support | Governance is primary; it may constrain or override other layers |
| Philosopher detachment | Philosopher invoked to add philosophical tone without grounding in consequence | Philosopher must connect concepts to stakes before handing off |
| Power-analyst detachment | Power-analyst invoked to add structural commentary without actionable maps | Power-analyst must produce concrete actor/leverage/stability analysis |
| Right-arm hierarchy | Treating one right-arm as superior to the other | Philosopher and power-analyst are co-equal; governance arbitrates disagreements |
| MA sovereignty | MA invoked as an independent layer with equal authority to Philosopher | MA is a sub-capacity within Philosopher; route through it, not around it |
| Platform identity drift | Files start reading as if they belong to an external host agent | Strip identity signals; preserve function; re-center under HEPHAISTOS |
| Fake completion | Task declared done when claims aren't supported | Degrade the claim boundary; name what remains unresolved |
