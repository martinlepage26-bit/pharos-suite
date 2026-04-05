# HEPHAISTOS Skill Map — Registry and Classification

This registry maps every skill in the corpus to its function, trigger conditions,
consequence profile, typical pairings, and overlap notes. It is authoritative for
skill routing decisions. Update it when skills are added, modified, or deprecated.

---

## Current Operational Baseline

The skill registry operates inside a live two-surface topology:

- `pharos-suite` -> `https://pharos-ai.ca`
- `martin-lepage-site` -> `https://martin.govern-ai.ca`

Boundary reminder:

- PHAROS, COMPASSai, and AurorA stay on the PHAROS surface
- Martin identity, standalone apps, Hephaistos narratives, and the authored governance / skill trees stay on the Martin surface
- deleted preview Pages or tunnel surfaces are historical traces, not active route targets

This registry governs routing across that topology; it does not dissolve the boundary.

---

## Authority Tier 0 — Forging Skills

These skills define artifact scope, type, audience requirements, and evidence basis.
Forging is primary upstream of governance. It feeds into the governance decision
once governance has received input from Philosopher and Power-Analyst right-arms.

**Diamond-Eyes requirement:** All Forging skills operate through the lens of love and wisdom.
Every artifact scope defined by Forging must ask: What serves genuine flourishing?

### ai-agents-architect

**Function:** Design AI agent systems and coordination patterns. Multi-agent orchestration,
reasoning strategies, tool integration, failure modes, observability.

**Trigger conditions:**
- Building a new agent or multi-agent system
- Designing agent architecture from intent
- Evaluating agent design for safety, auditability, coordination

**Consequence profile:** High. Agent architecture decisions propagate into deployment, safety,
and operational behavior.

**Typical pairings:**
- Primary (Forging) → feeds into Governance + right-arms for constraints
- Secondary: `agent-development` (builds what architect designs)
- Tertiary: `recursive-governance-method` (validates safety/auditability)

---

### agent-development

**Function:** Build and implement AI agents. Code structure, reasoning loops, memory systems,
tool integration, testing, refinement.

**Trigger conditions:**
- Implementing an agent that architect designed
- Debugging or refining agent behavior
- Adding new capability to live agent

**Consequence profile:** High. Implementation quality affects safety, performance, and observability.

**Typical pairings:**
- Primary (Forging) → feeds into Governance for control validation
- Companion: `ai-agents-architect` (follows architecture)
- Evaluation: `agent-evaluation` (Tier 3)

---

### ai-product

**Function:** Productionize agents and AI systems. Deployment, scaling, monitoring, versioning,
user onboarding, operational readiness.

**Trigger conditions:**
- Moving agent from development to production
- Scaling agent to multiple users or workloads
- Establishing operational readiness and monitoring

**Consequence profile:** Medium-high. Production decisions affect reliability, cost, user experience.

**Typical pairings:**
- Primary (Forging) → defines production requirements, feeds into Governance
- Upstream: `agent-development` (what's being productionized)

---

### architecture

**Function:** Design system architecture. Multi-component systems, integration patterns, data flow,
scalability, resilience, trade-off analysis.

**Trigger conditions:**
- Designing a new system from requirements
- Evaluating system design for scalability/resilience
- Refactoring system architecture

**Consequence profile:** Medium-high. Architecture decisions affect all downstream systems.

**Typical pairings:**
- Primary (Forging) → defines system scope, feeds into Governance
- Secondary: `database-schema-designer` (data layer of the architecture)

---

### database-schema-designer

**Function:** Design robust, scalable database schemas. Data modeling, normalization, indexes,
constraints, query optimization, migration paths.

**Trigger conditions:**
- Designing schema for new system
- Evaluating schema for scalability or performance
- Planning data migrations

**Consequence profile:** Medium-high. Schema design affects query performance, data integrity,
and operational maintainability.

**Typical pairings:**
- Primary (Forging) → defines data requirements, feeds into Governance
- Companion: `architecture` (part of system design)

---

### lead-research-assistant

**Function:** Lead research projects. Hypothesis formation, scope definition, resource prioritization,
research strategy, team coordination.

**Trigger conditions:**
- Launching a new research initiative
- Defining scope and prioritization for research
- Strategic decisions on research direction

**Consequence profile:** Medium. Research direction affects subsequent method selection, resource
allocation, and findings validity.

**Typical pairings:**
- Primary (Forging) → defines research scope, feeds into Governance
- Secondary: `qualitative` (Tier 3, method selection)
- Tertiary: `literature-review` (Tier 3, background work)

---

### research-grants

**Function:** Grant writing and funding proposal development. Research funding strategy, proposal
framing, budget justification, funder fit analysis, narrative positioning, compliance requirements.

**Trigger conditions:**
- Identifying research funding sources
- Developing funding strategy and approach
- Writing grant proposals and applications
- Tailoring proposals to specific funders
- Budget justification and resource planning
- Compliance and funder requirement alignment

**Consequence profile:** High. Successful funding determines whether research can proceed. Proposal
quality directly affects funding likelihood.

**Typical pairings:**
- Primary (Forging) → defines research scope, funding strategy, and funder targets
- Secondary: `lead-research-assistant` (research leadership informs proposal scope)
- Secondary: `scientific-writing` (proposal prose quality)
- philosopher (right-arm): research significance and conceptual stakes
- power-analyst (right-arm): funder landscape and leverage analysis

**Overlap notes:** Research-grants focuses on funding strategy and proposal writing; lead-research-assistant
focuses on research scope and leadership. Grants bridges Forging scope with external funding landscape.

---

## Authority Tier 1 — Governance-Critical Skills

These skills govern constraint design, evidence thresholds, risk classification,
validation, and auditability. They are not support functions. They may constrain,
overrule, or reject outputs from other layers when those conflict with defensibility.

Governance is the center of decision-making. It receives scope from Forging (Tier 0),
receives conceptual input from Philosopher right-arm, receives structural input from
Power-Analyst right-arm, and synthesizes these inputs to make the final decision.

---

### recursive-governance-method

**Function:** Turn heterogeneous materials (manuscripts, archives, governance notes,
bibliographies, connector-sourced materials) into bounded governance analysis.
Separate source layers from generated layers. Extract controls. Build evidence
hierarchies. Detect method lock and governance-on-governance drift.

**Trigger conditions:**
- Recursive data analysis needed on mixed archives
- Source vs. generated layer separation required
- Control extraction from governance artifacts
- Authorship or disclosure questions
- Evidence hierarchy construction
- Detecting Goodhart collapse, authority hardening, or method lock

**Consequence profile:** High. Output is used to make governance decisions, bound
claims, and design controls. Errors propagate into downstream authority structures.

**Typical pairings:**
- Primary + `philosopher` secondary: philosophical framing before recursive analysis
- Primary + `fully-rounded-power-analyst` secondary: power mapping before governance control extraction
- Primary + `trace-investigator` secondary: trace authority paths through artifacts
- Primary + `red-team` secondary: adversarial pressure on the control design

**Overlap notes:** Overlaps with `trace-investigator` on evidence hierarchy work.
Distinction: RGM builds recursive analytical structure across an archive; `trace-investigator`
traces how specific terms and authority signals move through a document pack.

**Scripts:** `scripts/archive_triage.py`, `scripts/control_register.py`
**References:** `references/method-rules.md`, `references/templates.md`, `references/example-prompts.md`

---

### red-team

**Function:** Plan, scope, lead, and report authorized red team exercises.
Adversarial stress-testing of governance systems, security postures, and claims.
Rules of engagement. Adversary emulation. Executive-ready findings.

**Trigger conditions:**
- Authorized red team engagement design
- Adversarial pressure-testing of a governance or technical system
- Rules of engagement and kickoff package
- Purple-team collaboration
- Finding-to-business-impact translation
- Comparative framing (red team vs. pentest)

**Consequence profile:** High. Outputs govern what gets tested, how, under what
authority, and how findings are communicated. Scope errors create liability.

**Typical pairings:**
- Primary + `recursive-governance-method` secondary: red team findings feed back
  into governance control extraction
- Primary + `philosopher` secondary: philosophical failure mode analysis (Goodhart,
  Foucauldian capture, Ricorso) before scoping
- Primary + `fully-rounded-power-analyst` secondary: power mapping of the system
  being red-teamed to identify structural vulnerabilities
- Primary + `trace-investigator` secondary: trace authority through the system
  being red-teamed

**Overlap notes:** Overlaps with `recursive-governance-method` on governance
stress-testing. Distinction: `red-team` operates in adversarial-simulation mode
with explicit rules of engagement; RGM operates in analytical-decomposition mode.

**References:** `references/red-team-reference.md`

---

### trace-investigator

**Function:** Trace how authority, accountability, definitions, exceptions, and
monitoring signals move across a document pack. Compare policies, checklists,
SOPs, emails, dashboards, charters. Identify where terms are inherited, softened,
narrowed, widened, delegated, or disappear.

**Trigger conditions:**
- Cross-document authority tracing needed
- Policy-to-implementation gap analysis
- Term drift detection across document versions
- Delegation and exception chain mapping
- Governance artifact comparison

**Consequence profile:** High. Findings reveal where accountability disappears or
where governance commitments were silently softened.

**Typical pairings:**
- Primary + `recursive-governance-method` secondary: RGM provides the archive
  framework; trace-investigator does the term-level tracing
- Primary + `philosopher` secondary: philosopher identifies what legitimacy and
  accountability require before tracing begins
- Primary + `fully-rounded-power-analyst` secondary: power-analyst maps structural
  leverage; trace-investigator follows authority chains through documents

**Overlap notes:** Overlaps with `recursive-governance-method` on evidence
hierarchy. Distinguished by granularity: trace-investigator operates at the level
of specific terms and authority chains.

---

### humanize

**Function:** Rewrite compliance, ethics, governance, and regulatory rules so they
fit real human behavior. Apply behavioral science (COM-B, RADAR, TDF) to diagnose
whether non-compliance is a people problem or a rule-design problem. Adapt rules
across cultures and power distances.

**Trigger conditions:**
- Policy or rule needs plain-language or behavioral-science rewrite
- Diagnosing why a rule is not being followed
- COM-B / RADAR application
- Culture or power-distance adaptation of governance language
- Making a governance document actionable for non-specialist audiences

**Consequence profile:** Medium-high. Behavioral redesign of rules affects how
organizations actually function. Errors in framing can make rules easier to ignore
or accidentally narrower in scope.

**Typical pairings:**
- Primary + `philosopher` secondary: philosopher maps the value tension the rule
  is protecting before the behavioral rewrite
- Primary + `fully-rounded-power-analyst` secondary: power-analyst identifies who
  benefits from the current rule design and what structural asymmetries the rewrite
  must account for
- Primary + `recursive-governance-method` secondary: RGM identifies what the
  rule is actually controlling before humanize rewrites it
- Primary + `trace-investigator` secondary: establish what the rule currently says
  across documents before redesigning it

**References:** `references/culture.md`, `references/diagnose.md`, `references/redraft.md`

---

### skill-architect

**Function:** Design, build, audit, and restructure SKILL.md files using dual-layer
architecture (Brain = execution logic, Map = knowledge/tools). Diagnose triggering
failures, layer conflation, and token inefficiency.

**Trigger conditions:**
- Creating a new SKILL.md from intent
- Auditing an existing skill for quality, triggering, or layer separation
- Restructuring a bloated or underperforming skill
- Converting a working workflow into a reusable skill
- User mentions "skill structure," "SKILL.md," "prompt vs context," "brain and map"

**Consequence profile:** Medium. Skill design errors propagate across every task
that skill handles.

**Typical pairings:**
- Primary + `recursive-governance-method` secondary: governance controls embedded
  in skill design validated by RGM

**Overlap notes:** None — sole skill explicitly governing skill architecture.

**References:** `references/dual-layer-architecture.md`

---

## Authority Tier 2 — Right-Arm Skills (Co-Equal)

These two skills are the equal right-arms of Agent HEPHAISTOS. They govern
conceptual framing, philosophical reasoning, interpretive coherence, structural
power analysis, and routing to companion skills. Neither outranks the other.

**When philosopher and power-analyst disagree, governance (Tier 1) has final word.**

---

### philosopher

**Function:** Apply philosophical reasoning to governance dilemmas, ethical
trade-offs, questions of meaning, power, and knowledge. Detect when a task needs
a companion skill. Frame conceptual stakes before handing off to execution.
Act as meta-router for the skill ecosystem. First right-arm to Agent HEPHAISTOS,
equal to power-analyst.

**MA sub-capacity:** The MA (Arts-and-Letters formation intelligence) operates
inside this skill, not independently. MA governs genre awareness, rhetorical
positioning, discourse sensitivity, tonal calibration, register recognition,
and form-sensitive revision. When philosopher handles tasks with
writing/publishing/genre dimensions, it draws on MA. When the task is explicitly
about intellectual formation, degree structure, or the MA-to-PhD arc, route to
`ma-degree-guide` directly.

**Trigger conditions:**
- Task frames a tension between two values
- User asks "what would [philosopher/tradition] say"
- Debate, steel-man, devil's advocate requested
- Governance system analysis needed with philosophical grounding
- Task spans philosophy AND another operational domain (trigger philosopher first)
- Graduate study in humanities or social sciences
- Any task where naming the value tension would change what the companion skill produces

**Consequence profile:** Medium-high in governance-adjacent work; medium in
standalone philosophical inquiry. Philosopher sets the conceptual frame that
downstream skills inherit — framing errors propagate.

**Typical pairings:** See philosopher/SKILL.md routing table for full pairing map.
Core pairings: philosopher → governance (via `recursive-governance-method`),
philosopher → power-analyst (co-equal composition),
philosopher → research (via `qualitative`), philosopher → writing (via
`peer-reviewed-paper-writer` or `publisher`).

**Overlap notes:** Overlaps with `fully-rounded-power-analyst` on power analysis
(Foucault, Gramsci, structural critique). Distinction: philosopher operates at the
conceptual and normative level; power-analyst operates at the operational and
structural level. They are co-equal right-arms, not in a hierarchy. Overlaps with
`qualitative` on epistemological framing; distinguished by philosopher handling the
normative and conceptual layer while qualitative handles method selection and
research design.

---

### fully-rounded-power-analyst

**Function:** Map how power actually moves through a situation — actors, incentives,
hidden rules, dependencies, leverage, stability, and change. Produces structural
explanations of why things happen, who benefits, who pays costs, and what is
presented as neutral but is organized by power. Output shapes vary by object:
person/event, institution, conflict, or ideology. Second right-arm to Agent
HEPHAISTOS, equal to philosopher.

**Trigger conditions:**
- Deep structural explanation of an event, institution, policy, or conflict needed
- Actor mapping and incentive analysis
- Hidden rules, choke points, or dependency tracing
- Who benefits / who pays costs analysis
- Stability and disruption analysis
- Ideology critique (what it claims vs. what it protects)
- "What is presented as neutral but is not neutral?"

**Consequence profile:** Medium-high. Power analysis shapes how decisions,
institutions, and conflicts are understood. Errors in framing reproduce the
misrepresentations that the skill is designed to expose.

**Typical pairings:**
- philosopher co-equal, fully-rounded-power-analyst co-equal: philosopher
  identifies the philosophical root; power-analyst draws the operational map.
  If they disagree, governance vetoes.
- fully-rounded-power-analyst primary, trace-investigator secondary: power map
  establishes the structural picture; trace-investigator follows specific authority
  chains through documents
- fully-rounded-power-analyst primary, recursive-governance-method secondary:
  structural power analysis precedes governance control extraction
- fully-rounded-power-analyst primary, qualitative secondary: power structure
  informs research design for studying that structure

**Overlap notes:** Overlaps with `philosopher` on power analysis (Foucault,
Gramsci, structural critique). Distinction: `philosopher` operates at the
conceptual and normative level; `fully-rounded-power-analyst` operates at the
operational and structural level, producing actor maps, leverage assessments,
and stability analyses in plain language. They are co-equal right-arms, not in a
hierarchy. Overlaps with `trace-investigator` on institutional analysis; distinction
is scope — power-analyst covers the full structural picture, trace-investigator
follows specific terms and authority chains through documents.

**Decision rules:** Plain language. Separate formal authority from real power.
Separate description from justification. Do not introduce physics vocabulary.
Separate durable structure from time-sensitive claims when analyzing live events.

---

### ma-degree-guide

**Function:** Formation intelligence layer for philosopher. Provides Arts-and-Letters
intellectual formation mapping: close reading, hermeneutics, historiography,
theoretical fluency, canon literacy, argumentative architecture, interpretive
restraint. Also handles standalone questions about MA degree structure, thesis
paths, and doctoral preparation.

**Invocation rule:** Access through philosopher routing for tasks with genre,
rhetoric, register, or interpretive posture dimensions. Invoke directly only when
the task is explicitly and primarily about degree structure, program comparison,
or the MA-to-PhD arc.

**Trigger conditions:**
- What does the MA in Arts and Letters actually build intellectually?
- MA formation as substrate for philosophical or governance reasoning
- Degree structure, thesis vs. capstone, program comparison
- Doctoral preparation in humanities/social sciences
- MA vs MS, MA vs MFA distinctions

**Consequence profile:** Low-medium for degree logistics; medium-high when
formation posture shapes downstream interpretive or governance work.

**Overlap notes:** Overlaps with `philosopher` on academic-institutional guidance.
Distinction: ma-degree-guide is the formation knowledge base; philosopher is the
reasoning layer that draws on it.

---

## Authority Tier 3 — Research and Methodological Skills

---

### qualitative

**Function:** Compare, choose, and apply qualitative research methods. Map research
questions to approaches: thematic analysis, phenomenology, ethnography, narrative
inquiry, discourse analysis, life-history, autoethnography, digital/visual
ethnography. Handle sampling, saturation, emic/etic, reflexivity, positionality.

**Trigger conditions:**
- Study design for qualitative research
- Method selection and rationale
- Coding, interpretation, and synthesis
- Sampling and saturation criteria
- Reflexivity and positionality guidance
- Organizing qualitative methodology notes

**Consequence profile:** Medium-high in research contexts. Method selection errors
invalidate downstream findings.

**Typical pairings:**
- philosopher primary, qualitative secondary: philosopher provides epistemological
  framing before method selection
- fully-rounded-power-analyst primary, qualitative secondary: power structure
  informs research design
- qualitative primary, peer-reviewed-paper-writer secondary: method section built
  by qualitative, embedded in paper by peer-reviewed-paper-writer

**References:** `references/methods.md`

---

### exploratory-data-analysis

**Function:** Systematic data exploration and discovery. Identify patterns, distributions,
outliers, correlations, and missing data. Hypothesis generation from data patterns.
Visual and statistical exploration techniques.

**Trigger conditions:**
- New dataset exploration before formal analysis
- Pattern identification and anomaly detection
- Hypothesis generation from preliminary data
- Data quality assessment and cleaning
- Visual discovery and understanding

**Consequence profile:** Medium. Exploration quality informs hypothesis selection and
study design. Poor exploration misses important patterns.

**Typical pairings:**
- Primary → senior-data-scientist (oversees exploration strategy)
- Primary → statistical-analysis (formal testing follows exploration)
- lead-research-assistant → qualitative: research design informed by exploration

---

### deep-research-notebooklm

**Function:** Conduct deep research with structured output. Systematic literature
synthesis, hypothesis development, evidence gathering, structured note-taking,
research synthesis and findings documentation.

**Trigger conditions:**
- Deep research project with structured output needed
- Literature synthesis and evidence integration
- Hypothesis development and testing framework
- Research findings documentation and synthesis
- Complex research requiring systematic organization

**Consequence profile:** Medium-high. Research depth and structure determine validity
of findings.

**Typical pairings:**
- Primary → literature-review (background research)
- Primary → statistical-analysis or qualitative (depending on method)
- lead-research-assistant → deep-research-notebooklm (leadership directs research)

---

### literature-review

**Function:** Comprehensive literature survey and synthesis. Search strategy, source
evaluation, thematic synthesis, gap identification, review write-up, bibliography
management.

**Trigger conditions:**
- Background literature review for research
- State-of-art survey on topic
- Gap analysis in existing research
- Systematic review or scoping review
- Evidence synthesis across sources

**Consequence profile:** Medium. Literature quality informs research scope and gaps.

**Typical pairings:**
- Primary → deep-research-notebooklm (literature feeds into research)
- lead-research-assistant → literature-review (leadership directs scope)

---

### research-engineer

**Function:** Research systems and infrastructure design. Pipeline building, data
engineering for research, experimental design automation, reproducibility systems,
version control for research artifacts.

**Trigger conditions:**
- Research infrastructure setup
- Data pipeline for research execution
- Experimental automation and reproducibility
- Research artifact management and version control
- Scaling research processes

**Consequence profile:** Medium. Research infrastructure quality affects reproducibility
and efficiency.

**Typical pairings:**
- Primary → research-engineer (infrastructure design)
- lead-research-assistant → research-engineer (leadership directs infrastructure needs)

---

### senior-data-scientist

**Function:** Senior-level data science strategy and execution. Oversees data analysis
strategy, selects appropriate methods, reviews analyses, mentors on data interpretation,
bridges technical and domain expertise.

**Trigger conditions:**
- Data science strategy oversight
- Method selection and feasibility review
- Complex analysis requiring expertise
- Data science team leadership
- Domain expertise integration with technical methods

**Consequence profile:** Medium-high. Senior guidance determines analytical rigor
and validity.

**Typical pairings:**
- Primary (oversight) → exploratory-data-analysis (directs exploration)
- Primary → statistical-analysis (approves analyses)
- lead-research-assistant → senior-data-scientist (leadership involves DS guidance)

---

### statistical-analysis

**Function:** Statistical analysis and hypothesis testing. Test selection, power analysis,
assumption checking, interpretation, effect sizes, confidence intervals, multiple
comparison corrections.

**Trigger conditions:**
- Hypothesis testing and statistical inference
- Statistical assumption validation
- Power analysis for study design
- Interpretation of statistical results
- Multiple comparison correction

**Consequence profile:** Medium-high. Statistical errors invalidate findings.

**Typical pairings:**
- Primary → senior-data-scientist (reviews statistical approach)
- exploratory-data-analysis → statistical-analysis (exploration informs testing)
- lead-research-assistant → statistical-analysis (leadership approves analysis plan)

---

## Authority Tier 4 — Writing, Publishing, and Output Skills

These skills handle artifact production, packaging, positioning, and delivery.
They are activated after governance and right-arm routing are set.

---

### peer-reviewed-paper-writer

**Function:** Plan, draft, revise, and quality-check scholarly manuscripts for
peer-reviewed publication. Abstracts, introductions, literature reviews, methods,
results, discussion, reviewer response letters, cover letters, journal-fit revisions.

**Trigger conditions:**
- Strengthening research questions, governing claims, or argument structure
- Methods and contribution framing
- Reviewer response letters
- Publication readiness assessment
- Journal fit analysis

**Consequence profile:** Medium-high. Publication errors are public and reputationally
costly. Fabricated citations or findings are integrity violations.

**Typical pairings:**
- philosopher primary, peer-reviewed-paper-writer secondary: philosopher frames
  the argument architecture; paper-writer handles structure and submission logistics
- fully-rounded-power-analyst primary, peer-reviewed-paper-writer secondary:
  power analysis grounds the manuscript's structural claims
- qualitative primary, peer-reviewed-paper-writer secondary: research design
  integrated into manuscript structure

**References:** `assets/reviewer-response-template.md`, `references/manuscript-readiness-checklist.md`

---

### publisher

**Function:** Evaluate, refine, position, and package books or long-form manuscripts
for publication. Editorial assessment, developmental editing, acquisitions memos,
jacket copy, author bios, cover briefs, metadata optimization.

**Trigger conditions:**
- Manuscript readiness assessment
- Developmental or structural editing
- Jacket copy and author bio drafting
- Cover brief creation
- Metadata for discoverability
- Editorial-to-production handoff coordination

**Consequence profile:** Medium. Positioning errors affect discoverability and
sales. Jacket copy errors are public.

**Typical pairings:**
- philosopher primary, publisher secondary: philosopher provides the intellectual
  contribution statement; publisher handles positioning and market fit
- fully-rounded-power-analyst primary, publisher secondary: power analysis grounds
  the positioning; publisher handles market fit

**References:** `references/role-map.md`

---

### novelist

**Function:** Plan, draft, revise, and critique novels. Character psychology, plot
momentum, scene design, POV, voice, dialogue, worldbuilding, reader attachment.
Structure and POV comparison, pacing and emotional depth.

**Trigger conditions:**
- Novel concept development or outlining
- Draft revision and structural diagnosis
- Scene design, POV, pacing
- Character or thematic development
- Literary or commercial positioning

**Consequence profile:** Low-medium. Genre and form errors may misalign the work
with its intended market.

**Typical pairings:**
- philosopher primary, novelist secondary: philosopher identifies thematic stakes;
  novelist handles execution

**References:** `references/novel-craft.md`

---

### peer-review

**Function:** Systematic peer review process for research, code, proposals, or technical
work. Review criteria, constructive feedback, evidence-based assessment, collaborative
improvement, reviewer accountability.

**Trigger conditions:**
- Academic or technical peer review
- Code review and quality assessment
- Proposal or grant review
- Systematic feedback on work product
- Quality assurance through expert review

**Consequence profile:** Medium. Peer review quality affects validity and improvement
of reviewed work.

**Typical pairings:**
- Primary → reviewed work (peer-review assesses it)
- scholar-evaluation (if meta-review of review quality is needed)

---

### scholar-evaluation

**Function:** Evaluates research quality, rigor, and contribution. Assesses research
design, methodology soundness, findings validity, contribution significance, publication
readiness.

**Trigger conditions:**
- Research quality assessment
- Methodology critique and improvement
- Findings validity evaluation
- Contribution assessment
- Publication readiness evaluation

**Consequence profile:** Medium-high. Evaluation quality determines whether flawed
research is identified before publication.

**Typical pairings:**
- Primary → research artifact (scholar-evaluation assesses it)
- peer-review: can be peer review of the evaluation itself

---

### scientific-critical-thinking

**Function:** Evaluates research rigor, assumptions, and logical coherence. Identifies
hidden assumptions, logical fallacies, alternative explanations, limitations,
generalizability concerns.

**Trigger conditions:**
- Research assumptions and logic evaluation
- Alternative explanation identification
- Limitation and generalizability assessment
- Fallacy and bias detection
- Logical coherence checking

**Consequence profile:** Medium-high. Critical evaluation prevents acceptance of
flawed reasoning.

**Typical pairings:**
- Primary → research claims or arguments
- scholar-evaluation: works in parallel on research quality
- philosopher (right-arm): philosophical assumptions undergird scientific ones

---

### scientific-writing

**Function:** Technical and scientific prose. Clarity, precision, structure, terminology,
evidence integration, narrative flow, argument architecture in scientific communication.

**Trigger conditions:**
- Research manuscript writing
- Technical report or white paper
- Scientific communication for specialists
- Research findings communication
- Methods and results documentation

**Consequence profile:** Medium. Unclear writing obscures findings and makes review harder.

**Typical pairings:**
- Primary → research findings (scientific-writing structures communication)
- peer-reviewed-paper-writer (for publication formatting)
- statistical-analysis or qualitative (source of findings being communicated)

---

### scientific-visualization

**Function:** Publication-ready scientific visuals. Figures, charts, diagrams, graphs
that communicate data, methods, or results. Design, accessibility, accuracy, audience
appropriateness.

**Trigger conditions:**
- Scientific figure or chart creation
- Research data visualization
- Methods diagram or flowchart
- Publication-ready graphics
- Accessibility-compliant visualization

**Consequence profile:** Medium. Visualization quality affects understanding and
publication success.

**Typical pairings:**
- Primary → research data or methods
- peer-reviewed-paper-writer (figures embedded in papers)
- exploratory-data-analysis (discovery visualizations)

---

### prompt-engineer

**Function:** Expert prompt design and optimization. Instruction crafting, model
behavior steering, output formatting, few-shot example selection, prompt testing
and iteration.

**Trigger conditions:**
- Designing prompts for specific model behavior
- Optimizing prompt clarity and output quality
- Few-shot learning and in-context example design
- Instruction refinement for consistent results
- Prompt engineering for specialized domains

**Consequence profile:** Medium. Prompt quality directly affects model output quality.

**Typical pairings:**
- Primary → model or agent needing instruction design
- philosopher (right-arm): frames what the prompt should express conceptually
- peer-reviewed-paper-writer: for instructional documentation

---

### writing-skills

**Function:** Writing quality and craft improvement. Clarity, concision, tone,
structure, argument flow, audience awareness, revision and editing.

**Trigger conditions:**
- General writing improvement needed
- Clarity and readability refinement
- Tone adjustment for audience
- Structural reorganization
- Editing and revision guidance

**Consequence profile:** Medium. Writing quality affects understanding and impact.

**Typical pairings:**
- Primary → written artifact needing improvement
- scientific-writing (technical prose)
- peer-reviewed-paper-writer (academic writing)

---

### naming-analyzer

**Function:** Analyzes naming conventions, semantics, and language precision. Variable
naming, API naming, terminology consistency, semantic clarity.

**Trigger conditions:**
- Naming convention analysis or improvement
- API or system naming design
- Terminology consistency checking
- Language precision and semantics
- Domain-specific naming guidance

**Consequence profile:** Low-medium. Poor naming harms readability and maintainability.

**Typical pairings:**
- Primary → code, API, or system needing naming review
- architecture (system design)
- codex-review (code review includes naming)

---

### scientific-brainstorming

**Function:** Research ideation and hypothesis generation. Problem framing, research
question development, hypothesis generation, creative exploration of research space,
novelty and feasibility assessment.

**Trigger conditions:**
- Research project ideation and scoping
- Hypothesis generation and refinement
- Research question formulation
- Exploring novel research directions
- Feasibility and novelty assessment

**Consequence profile:** Medium. Initial research framing shapes entire study.

**Typical pairings:**
- lead-research-assistant → scientific-brainstorming (inform scope)
- philosopher (right-arm): normative and conceptual stakes
- qualitative or statistical-analysis (method selection follows brainstorming)

---

### agent-evaluation

**Function:** Agent quality and readiness assessment. Evaluate agent design completeness,
behavior consistency, failure modes, observability, safety constraints, performance
characteristics, and production readiness.

**Trigger conditions:**
- Agent implementation complete, before deployment
- Agent behavior or performance assessment
- Production readiness evaluation
- Safety and constraint validation
- Failure mode and edge case testing
- Agent architecture review against design specification

**Consequence profile:** High. Agent evaluation determines whether unsafe or unreliable
agents reach production.

**Typical pairings:**
- Primary → agent-development (evaluates implementation against design)
- Secondary: `codex-review` — code quality review
- Secondary: `test-detect` — test strategy and coverage validation
- ai-agents-architect (design specification agent-evaluation compares against)
- philosopher (right-arm): evaluates against architectural intent
- power-analyst (right-arm): evaluates failure modes and dependencies

**Overlap notes:** Agent-evaluation is about "does this agent work correctly?"; 
codex-review is about "is the code well-written?"; test-detect is about "what testing 
does this agent need?"

---

### agent-management

**Function:** Agent deployment, monitoring, versioning, and operational management.
Production deployment strategy, version control, behavior monitoring, performance
metrics, incident response, updates and rollbacks, multi-agent coordination.

**Trigger conditions:**
- Agent deployment to production
- Operational monitoring and metrics definition
- Version management and rollout strategy
- Incident response and debugging
- Agent updates and rollback procedures
- Multi-agent coordination and routing

**Consequence profile:** High. Production management quality directly affects reliability,
performance, and user experience.

**Typical pairings:**
- Primary → agent-evaluation (agent is production-ready)
- Secondary: `ai-product` — productionization strategy
- Secondary: `recursive-governance-method` — operational governance and constraints
- philosopher (right-arm): operational philosophy and design intent
- power-analyst (right-arm): operational dependencies and failure modes

**Overlap notes:** Agent-management focuses on operational excellence and deployment 
at scale; ai-product focuses on moving an agent from development to production initially; 
agent-management handles ongoing operations.

---

### humanize

*(See Tier 1 — also listed here as it produces writing artifacts in addition to
governance redesign)*

---

### speech

**Function:** Text-to-speech narration, voiceover, accessibility reads, IVR audio
prompts, batch speech generation via OpenAI Audio API. Runs bundled CLI
(`scripts/text_to_speech.py`).

**Trigger conditions:**
- TTS narration or voiceover requested
- Accessibility read generation
- IVR / phone prompt audio
- Batch speech generation
- Requires OPENAI_API_KEY for live calls

**Consequence profile:** Low-medium. Audio errors in IVR or accessibility contexts
can have functional consequences.

**References:** `references/` directory contains voice directions, API reference,
CLI reference, IVR defaults, narration defaults, prompting best practices.

---

## Authority Tier 5 — Meta and Composition Skills

---

### skill-pairing

**Function:** Choose and sequence two skills for one user request. Carry output of
first skill into second without rewriting either skill's core logic. Use when a
task splits into two distinct skill domains or stages.

**Trigger conditions:**
- Task naturally splits into two distinct phases (analysis + drafting, cleanup +
  synthesis, strategy + execution)
- Two skills are needed without blending them

**Overlap notes:** Overlaps with HEPHAISTOS orchestration logic. Distinction:
`skill-pairing` is a user-facing skill that sequences two skills in a single
session; HEPHAISTOS orchestration governs the full routing architecture.

---

### brand-identity-system

**Function:** Analyze or develop brand identity systems, logo direction, website
branding. Brand diagnosis, positioning-to-identity translation, logo critique,
typography and color systems, website visual direction, practical brand guidelines.

**Trigger conditions:**
- Brand diagnosis or audit
- Logo concept or critique
- Website branding direction
- Style guide creation
- Brand positioning for consultancies, firms, studios

**Consequence profile:** Medium. Brand identity errors are public and persistent.

**References:** `assets/`, `examples/`, `references/` — all in the brand-identity-system folder.

---

### triangulation

**Function:** Solve triangulation problems from a known baseline plus two angles,
or from two sensor coordinates plus bearing angles. Law of Sines. Locate a target
from two lines of sight. Distinguish triangulation from trilateration.

**Note:** `triangulate` was a legacy compatibility alias and has been permanently
removed. `triangulation` is the sole canonical skill.

**Trigger conditions:**
- Angle-based geometry from one known side plus two angles
- Locating a target from two sensor coordinates and bearing angles
- Law of Sines computation
- Distinguishing triangulation from trilateration

**Consequence profile:** Low-medium. Calculation errors in navigation or surveying
have operational consequences.

**Scripts:** `scripts/triangulation.py`

---

### codex-review

**Function:** Systematic code review for quality, security, performance, and maintainability.
Code design critique, pattern assessment, technical debt identification, refactoring recommendations,
security vulnerability detection, performance bottleneck identification, documentation completeness.

**Trigger conditions:**
- Code review before merge or deployment
- Security audit of codebase
- Performance review of critical functions
- Technical debt assessment
- Architecture review for scalability
- Code quality gate before publication or deployment

**Consequence profile:** High. Code review quality directly affects production stability,
security, and maintenance burden. Missed issues can become expensive operational debt.

**Typical pairings:**
- Primary → code artifact requiring review
- agent-development: reviews agent code before production
- architecture: reviews system architecture implementation
- testing-strategy: complements test coverage with code design review
- philosopher (right-arm): design philosophy and intention validation
- power-analyst (right-arm): structural coupling and dependency analysis

**Overlap notes:** Codex-review focuses on code design and quality; peer-review focuses on
research validity. Codex-review is about "does this code work well?"; test-detect is about
"what bugs does this code have?"

---

### test-detect

**Function:** Test design, gap analysis, and quality assurance strategy. Test coverage assessment,
edge case identification, integration test design, regression test planning, testing strategy development,
quality metrics definition.

**Trigger conditions:**
- Testing strategy before deployment
- Test coverage gap analysis
- Edge case and boundary condition identification
- Integration test design
- Regression test planning
- Quality assurance metrics definition
- Test automation planning

**Consequence profile:** High. Poor test design leads to escaped defects, production failures,
and expensive debugging cycles.

**Typical pairings:**
- Primary → code/system needing test strategy
- codex-review: codex reviews code quality, test-detect designs test strategy
- agent-development: agent testing before deployment
- architecture: integration testing across system components
- philosopher (right-arm): intent-based test case generation
- power-analyst (right-arm): failure mode and dependency-based test strategy

**Overlap notes:** Test-detect focuses on test strategy and coverage; codex-review focuses on
code quality. Test-detect is about "what testing do we need?"; codex-review is about "is this
code well-written?"

---

### free-tool-strategy

**Function:** Evaluate and route implementation through cost-effective, available tooling. Tool
landscape analysis, cost-benefit assessment, integration points, vendor lock-in analysis, build-vs-buy
decisions, open-source vs. commercial trade-offs.

**Trigger conditions:**
- Evaluating tools for implementation strategy
- Cost optimization and tooling efficiency
- Build-vs-buy decisions
- Vendor landscape analysis
- Open-source viability assessment
- Consolidation or tool replacement decisions
- Integration and interoperability planning

**Consequence profile:** Medium. Tool choices affect implementation cost, speed, maintenance burden,
and vendor dependency. Poor tool choices create technical debt.

**Typical pairings:**
- Primary (Hermes Connector) → routes implementation through available tools
- Secondary: `architecture` (system design constraints tool selection)
- Secondary: `ai-product` (productionization and scaling constraints)
- philosopher (right-arm): tooling philosophy and design intent alignment
- power-analyst (right-arm): vendor analysis and dependency implications

**Overlap notes:** Free-tool-strategy is connector-primary and focuses on routing through available
tools; architecture focuses on system design; ai-product focuses on productionization. Free-tool-strategy
bridges governance decision and implementation execution through the lens of cost and availability.

---

## Overlap Summary

| Overlap pair | Distinction |
|---|---|
| `philosopher` / `fully-rounded-power-analyst` | Co-equal right-arms. Philosopher = conceptual/normative root; power-analyst = operational actor map and leverage assessment. Governance arbitrates disagreements. |
| `recursive-governance-method` / `trace-investigator` | RGM = archive-level recursive structure; trace = term/authority chain at document level |
| `recursive-governance-method` / `red-team` | RGM = analytical decomposition; red-team = adversarial simulation with rules of engagement |
| `fully-rounded-power-analyst` / `trace-investigator` | Power-analyst = full structural picture; trace-investigator = specific term and authority chains through documents |
| `philosopher` / `qualitative` | Philosopher = normative/conceptual layer; qualitative = method selection and research design |
| `philosopher` / `ma-degree-guide` | Philosopher = reasoning layer; ma-degree-guide = formation knowledge base accessed by philosopher |
| `skill-pairing` / HEPHAISTOS orchestration | skill-pairing = two-skill user-session sequencer; HEPHAISTOS = full routing architecture |
| `research-grants` / `lead-research-assistant` | lead-research-assistant = research scope and leadership; research-grants = funding strategy and proposal writing |
| `free-tool-strategy` / `architecture` | architecture = system design specification; free-tool-strategy = routing through available tools for cost efficiency |

---

## Skills Registered (Phase 6)

**Phase 6 — Niche & Specialized Skills (2 skills):**

1. `research-grants` — **Tier 0 (Forging)** — Grant writing and funding strategy (routed to HEPHAISTOS)
2. `free-tool-strategy` — **Tier 5 (Hermes Connector)** — Tool landscape evaluation and routing (routed to Hermes)

---

## Skills Not In Corpus But Referenced In System

The following skills appear in the execution environment (system-reminder) but
were not found in the ZIP corpus. They may be installed separately or may have
been added after corpus export.

- `fully-rounded-power-analyst` — RESOLVED. Added to `skills/fully-rounded-power-analyst/SKILL.md` and registered as Tier 2 right-arm (co-equal with philosopher).
- `philosopher:references:*` — external references not in ZIP but loaded by execution host
- `triangulate` — RESOLVED. Permanently removed. Consolidated into `triangulation`.

If extending the corpus, add new skills to `skills/` and register them here.
