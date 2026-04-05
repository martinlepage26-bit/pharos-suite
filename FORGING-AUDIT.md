# HEPHAISTOS Forging Capability — Audit and Integration Report

**Date:** 2026-04-05  
**Objective:** Audit HEPHAISTOS against Forging skill list, identify gaps, resolve consolidation issues, and plan integration.

---

## Executive Summary

HEPHAISTOS currently implements **16 skills** across 5 authority tiers. The Forging capability requires **39 skills**, of which **23 are missing** from the current registry. This audit maps:

1. **Gap analysis**: Which Forging skills are implemented, partial, or missing
2. **Tier reorg**: How to restructure authority tiers for Forging
3. **Consolidation issues**: Overlaps, conflicts, and resolution strategies
4. **Integration plan**: Roadmap to add missing skills to the tool registry

---

## Part 1: Gap Analysis

### Implemented Skills (16) ✓

These skills are FULLY registered in `SKILL-MAP.md` and have SKILL.md files:

1. `brand-identity-system` — Tier 5, Meta & Composition
2. `fully-rounded-power-analyst` — Tier 2, Right-Arm
3. `humanize` — Tier 1, Governance-Critical
4. `ma-degree-guide` — Tier 2, Right-Arm sub-capacity
5. `novelist` — Tier 4, Writing & Publishing
6. `peer-reviewed-paper-writer` — Tier 4, Writing & Publishing
7. `philosopher` — Tier 2, Right-Arm
8. `publisher` — Tier 4, Writing & Publishing
9. `qualitative` — Tier 3, Research & Methodological
10. `recursive-governance-method` — Tier 1, Governance-Critical
11. `red-team` — Tier 1, Governance-Critical
12. `skill-architect` — Tier 1, Governance-Critical
13. `skill-pairing` — Tier 5, Meta & Composition
14. `speech` — Tier 4, Writing & Publishing
15. `trace-investigator` — Tier 1, Governance-Critical
16. `triangulation` — Tier 5, Meta & Composition

### Missing Skills (23) ✗

These skills are listed in Forging but are NOT in current SKILL-MAP.md or /skills/:

**Agent Development (6)**
- `agent-development` — builds, designs, orchestrates multi-agent systems
- `agent-evaluation` — benchmarks and tests agent performance
- `agent-management` — monitors, routes, and coordinates live agents
- `agent-manager-skill` — operational management layer for agents
- `ai-agents-architect` — designs agent systems and coordination patterns
- `ai-product` — turns research/prototype into production AI products

**Research & Analysis (7)**
- `deep-research-notebooklm` — conducts deep research with structured output
- `exploratory-data-analysis` — systematic data exploration and discovery
- `lead-research-assistant` — research leadership, hypothesis formation, prioritization
- `literature-review` — comprehensive literature survey and synthesis
- `research-engineer` — research systems design, pipeline building
- `research-grants` — grant writing, research funding strategy
- `senior-data-scientist` — senior-level data science strategy and execution

**Design & Architecture (5)**
- `architecture` — system architecture design and trade-off analysis
- `database-schema-designer` — designs robust, scalable database schemas
- `gepetto` — creates detailed, publication-ready technical content
- `skill-architect` — **ALREADY IMPLEMENTED** (conflict: listed twice)
- `ux-researcher-designer` — UX research and design strategy

**Evaluation & Publishing (5)**
- `codex-review` — professional code review and quality assessment
- `peer-review` — systematic peer review process (academic/technical)
- `scholar-evaluation` — evaluates research quality and rigor
- `scientific-brainstorming` — research ideation and hypothesis generation
- `scientific-critical-thinking` — evaluates research rigor and assumptions

**Writing & Communication (4)**
- `naming-analyzer` — analyzes naming conventions and semantics
- `prompt-engineer` — expert prompt design and optimization
- `prompt-engineering` — comprehensive prompt engineering workflows
- `prompt-engineering-instructor` — teaches prompt engineering methodology
- `scientific-writing` — core skill for technical and scientific writing
- `scientific-visualization` — publication-ready scientific visuals
- `statistical-analysis` — statistical analysis, hypothesis testing
- `test-detect` — detects test quality issues and gaps
- `writing-skills` — writing quality and craft improvement
- (9 total writing/communication skills, but listed separately)

---

## Part 2: Tier Reorganization for Forging

The current 5-tier structure can accommodate Forging if we add a new Authority Tier 0:

```
TIER 0 — FORGING (New) ← **Defines what is built, by whom, under what constraints**
├─ Agent Development (3 skills)
├─ Research Leadership (2 skills)
└─ Production Engineering (2 skills)

TIER 1 — GOVERNANCE-CRITICAL (existing)
├─ Governance Authority (4 skills)
└─ Control Extraction (1 skill)

TIER 2 — RIGHT-ARMS (existing, co-equal)
├─ Philosopher (1 skill + MA sub-capacity)
└─ Power-Analyst (1 skill)

TIER 3 — RESEARCH & METHODOLOGICAL (existing)
├─ Qualitative Research (1 skill)
├─ Data Analysis (2 new skills)
└─ Research Leadership (2 new skills)

TIER 4 — WRITING, PUBLISHING, OUTPUT (existing)
├─ Academic Writing (1 skill)
├─ Book Publishing (1 skill)
├─ Narrative & Fiction (1 skill)
├─ Scientific Communication (4 new skills)
└─ Audio & Visual (1 skill)

TIER 5 — META & COMPOSITION (existing)
├─ Skill Composition (2 skills)
├─ Brand & Identity (1 skill)
├─ Geometry (1 skill)
└─ Code Quality (1 new skill)
```

### Forging as Tier 0 — The Foundational Layer

**Definition:** Forging determines **WHAT** is being built, **BY WHOM**, under **WHAT CONSTRAINTS**, with **WHAT EVIDENCE OR STRUCTURE** it requires.

Forging skills are **upstream of governance** — they ask the first questions:

- Is this being built for research, production, internal use, or publication?
- What kind of artifact is it (system, dataset, narrative, agent, visualization)?
- Who is the audience and what level of rigor do they require?
- What evidence or structure grounds this build?
- What failure modes are unacceptable?
- When does this transition from building to governance review?

Once Forging establishes the artifact type and consequence domain, **Governance becomes primary** for that artifact.

---

## Part 3: Consolidation Issues

### Issue 1: `skill-architect` Listed in Both Forging and Current Registry

**Problem:**  
`skill-architect` appears in the Forging list but is already in `SKILL-MAP.md` as a Tier 1 governance-critical skill.

**Resolution:**  
- Keep `skill-architect` in Tier 1 (it governs constraints and controls on skill design).
- Add a **cross-tier link** in Forging that notes: "Skill design (Tier 1) is constrained by the artifact type and consequence domain established in Forging."
- Do NOT duplicate the registration.

### Issue 2: Agent/Research/Writing Skills Span Multiple Tiers

**Problem:**  
Skills like `agent-development`, `research-engineer`, `scientific-writing` don't fit cleanly into one tier because they involve:
- **Forging** decisions (what kind of agent, what research scope, what genre?)
- **Governance** constraints (what controls does it need?)
- **Methodology** (how do you build it?)
- **Writing/Output** (how is it packaged?)

**Resolution:**  
- Register these as **primary skills in Tier 0 (Forging)**.
- Cross-link to secondary skills in other tiers.
- Example: `agent-development` (Tier 0 primary) + `agent-evaluation` (Tier 3 secondary) + `recursive-governance-method` (Tier 1 secondary for control design).

### Issue 3: Research Skills Scattered Across Tiers

**Problem:**  
Current registry has `qualitative` (Tier 3) but is missing `deep-research-notebooklm`, `literature-review`, `senior-data-scientist`, `exploratory-data-analysis`, etc.

**Resolution:**  
- Consolidate research skills in Tier 3.
- Establish clear authority order: **Research Leadership** (Forging/Tier 0) → **Research Design** (Tier 3 qualitative) → **Research Execution** (specialty tools).
- Example: `lead-research-assistant` (Tier 0, asks what to research) + `qualitative` (Tier 3, designs the study) + `deep-research-notebooklm` (Tier 3, executes the research).

### Issue 4: Writing Skills Are Under-Registered

**Problem:**  
Only 3 writing skills in current registry (`peer-reviewed-paper-writer`, `publisher`, `novelist`). Forging includes 9+ writing-related skills:
- `scientific-writing`, `scientific-visualization`, `prompt-engineer`, `writing-skills`, `naming-analyzer`, `scientific-brainstorming`, etc.

**Resolution:**  
- Add missing writing skills to Tier 4.
- Establish clear **writing skill routing**:
  - **Governance + narrative** → `humanize` (Tier 1) + `publisher` (Tier 4)
  - **Research + publication** → `qualitative` (Tier 3) + `peer-reviewed-paper-writer` (Tier 4)
  - **Prompt/instruction** → `prompt-engineer` (Tier 4) + `philosopher` (Tier 2) for framing
  - **Visualization** → `scientific-visualization` (Tier 4) + domain skill
  - **Brand/narrative** → `brand-identity-system` (Tier 5) + `publisher` (Tier 4)

### Issue 5: Agent Skills Need Coordination Authority

**Problem:**  
Forging includes `agent-development`, `agent-evaluation`, `agent-management`, `ai-agents-architect`, and `ai-product`, but these have no explicit **composition rules** in ORCHESTRATION.md.

**Resolution:**  
- Add a **new composition pattern** to ORCHESTRATION.md:
  ```
  AGENT DEVELOPMENT STACK:
  - Primary: ai-agents-architect (Tier 0 Forging) — designs agent architecture
  - Secondary: agent-development (Tier 0 Forging) — implements the agent
  - Tertiary: agent-evaluation (Tier 3) — benchmarks performance
  - Governance: recursive-governance-method (Tier 1) — validates safety/auditability
  - Output: ai-product (Tier 0) — productionizes for deployment
  ```

### Issue 6: Architecture/Infrastructure Skills Missing

**Problem:**  
Forging includes `architecture` (system design) and `database-schema-designer`, but these have no current registry entries. They sit **between Tier 0 Forging and Tier 1 Governance**.

**Resolution:**  
- Add `architecture` to Tier 0 Forging (asks what needs to be built, at what scale, with what constraints).
- Add `database-schema-designer` to Tier 0 Forging (asks what data structure is required before governance review).
- Cross-link to governance for production readiness validation.

---

## Part 4: Integration Roadmap

### Phase 1: Tier 0 Forging Foundation (Priority: Critical)

**Objective:** Define Forging as the entrypoint layer that determines artifact type and consequence domain.

**Skills to register:**
1. `agent-development` — primary forge skill for agent building
2. `agent-architect` (alias for `ai-agents-architect`) — Tier 0 agent architecture design
3. `ai-product` — turns prototype into production
4. `architecture` — system architecture forge skill
5. `database-schema-designer` — data schema forge skill
6. `lead-research-assistant` — research leadership and scope

**Documentation updates:**
- Create `FORGING-TIER.md` explaining Tier 0 role
- Add Tier 0 routing section to `ORCHESTRATION.md`
- Update HEPHAISTOS.md to include Forging in authority order

**Timeline:** Week 1

### Phase 2: Research Skills Consolidation (Priority: High)

**Objective:** Register all research-domain skills under Tier 3 with clear routing.

**Skills to register:**
1. `deep-research-notebooklm` — systematic deep research
2. `exploratory-data-analysis` — data exploration
3. `literature-review` — comprehensive survey
4. `research-engineer` — research infrastructure
5. `senior-data-scientist` — DS strategy and execution
6. `statistical-analysis` — hypothesis testing and analysis

**Composition patterns:**
- `lead-research-assistant` (Tier 0) → `qualitative` (Tier 3) → `deep-research-notebooklm` (Tier 3)
- `exploratory-data-analysis` (Tier 3) + `statistical-analysis` (Tier 3) for data-heavy research

**Documentation updates:**
- Add research-skills section to SKILL-MAP.md
- Create research routing patterns in ORCHESTRATION.md

**Timeline:** Week 1-2

### Phase 3: Writing Skills Expansion (Priority: High)

**Objective:** Register all writing/communication skills under Tier 4 with routing rules.

**Skills to register:**
1. `scientific-writing` — technical/scientific prose
2. `scientific-visualization` — publication-ready visuals
3. `prompt-engineer` — prompt design and optimization
4. `prompt-engineering` — comprehensive workflows
5. `writing-skills` — writing quality and craft
6. `naming-analyzer` — semantics and naming
7. `scientific-critical-thinking` — research rigor evaluation
8. `scientific-brainstorming` — hypothesis ideation

**Composition patterns:**
- `prompt-engineer` + `philosopher` (Tier 2) for instruction design
- `scientific-writing` + `peer-reviewed-paper-writer` for academic output
- `scientific-visualization` + domain skill for publication

**Documentation updates:**
- Expand Tier 4 section of SKILL-MAP.md
- Create writing-skill routing patterns in ORCHESTRATION.md

**Timeline:** Week 2

### Phase 4: Code Quality & Evaluation Skills (Priority: Medium)

**Objective:** Register code review and quality assessment skills.

**Skills to register:**
1. `codex-review` — professional code review
2. `peer-review` — systematic review process
3. `scholar-evaluation` — research quality assessment
4. `test-detect` — test gap detection

**Placement:**
- `codex-review` → Tier 5 (Meta & Composition, code-level)
- `peer-review` → Tier 4 (Publishing lane)
- `scholar-evaluation` → Tier 3 (Research quality)
- `test-detect` → Tier 5 (Meta & Composition)

**Documentation updates:**
- Expand Tier 3 and Tier 5 sections

**Timeline:** Week 2

### Phase 5: Production & Deployment (Priority: Medium)

**Objective:** Register skills for moving artifacts from development to deployment.

**Skills to register:**
1. `ai-product` — ✓ (should already be in Forging)
2. `agent-evaluation` — performance benchmarking
3. `agent-management` — operational orchestration
4. `gepetto` — technical content for deployment docs

**Composition patterns:**
- `agent-development` + `agent-evaluation` + `ai-product` + `agent-management`
- Forms a complete agent lifecycle

**Documentation updates:**
- Add deployment/lifecycle section to ORCHESTRATION.md

**Timeline:** Week 3

### Phase 6: Remaining Gaps (Priority: Low)

**Skills to evaluate:**
- `research-grants` — funding/grant writing (specialized, niche)
- `naming-analyzer` — can this fold into `philosopher` + `writing-skills`?
- `free-tool-strategy` — is this a Tier 0 artifact-framing skill?
- `gepetto` — overlaps with `scientific-writing`, `publisher`?

**Decision:** Audit each for true uniqueness vs. composite use. If composite, link in ORCHESTRATION.md rather than register separately.

**Timeline:** Week 3-4

---

## Part 5: Revised Authority Order for Forging

### New HEPHAISTOS Disciplinary Authority Order (with Forging)

**Tier 0 — Forging (NEW) — PRIMARY UPSTREAM**

Forging is **primary upstream** of governance. It defines scope and feeds into the governance decision:
- What is being built?
- What kind of artifact is it?
- What evidence or structure is required?
- Who is the audience and what do they require?
- What failure modes are unacceptable?

**Forging-primary skills:**
- `agent-development`, `ai-agents-architect`, `ai-product`
- `architecture`, `database-schema-designer`
- `lead-research-assistant`

**When governance and forging diverge:** Forging defines scope; governance may constrain or reject the scope on grounds of evidence, control feasibility, or consequence. If irreconcilable, escalate to operator.

**Tier 1 — Governance Authority (CENTER)**

Governance is the center. It:
- Receives scope definition from Forging (Tier 0)
- Receives conceptual/normative input from Philosopher (right-arm)
- Receives structural/power input from Power-Analyst (right-arm)
- Synthesizes these inputs and makes the final decision

Governance governs controls, constraints, evidence thresholds, validation, and auditability for the artifact Forging defined.

**Tier 2 — Right-Arms to Governance: Philosopher + Power-Analyst (existing, restructured)**

Both are right-arms *to governance*, not co-equal to each other.

**Philosopher (right-arm):**
- Provides conceptual framing, normative analysis, philosophical reasoning
- Feeds into governance decision but does not arbitrate
- If diverges from Power-Analyst, both inputs go to governance; governance decides

**Power-Analyst (right-arm):**
- Provides structural power analysis, actor mapping, leverage assessment
- Feeds into governance decision but does not arbitrate
- If diverges from Philosopher, both inputs go to governance; governance decides

**Neither right-arm overrides the other. Both inform Governance. Governance decides.**

**Tier 3 — Research & Methodological (expanded)**

Now includes agent evaluation, deep research, data analysis.

**Tier 4 — Writing, Publishing, Output (expanded)**

Now includes all writing and communication skills.

**Tier 5 — Meta & Composition (expanded)**

Now includes code review, evaluation, meta-level tasks.

---

## Part 6: Reconciliation Checklist

- [ ] **HEPHAISTOS.md** — Add Tier 0 Forging to the disciplinary authority order
- [ ] **SKILL-MAP.md** — Add Tier 0 Forging section with 6+ base skills
- [ ] **SKILL-MAP.md** — Reorganize Tiers 1-5 to accommodate 23 new skills
- [ ] **ORCHESTRATION.md** — Add Tier 0 routing and Forging decision model
- [ ] **ORCHESTRATION.md** — Add composition patterns for Forging + other tiers
- [ ] **FORGING-TIER.md** — Create new documentation for Tier 0 role and responsibilities
- [ ] **Skills directory** — Create SKILL.md files for each of 23 missing skills (or consolidate overlaps)
- [ ] **AGENTS.md** — Update review lanes and escalation criteria for Forging-touched tasks
- [ ] **Conflict resolution** — Update rules for when Forging and Governance disagree
- [ ] **Validation** — Audit all skills for proper tier placement and routing clarity

---

## Part 7: Key Recommendations

### Recommendation 1: Create Forging as Tier 0 (CRITICAL)

Forging is not a support layer. It is **foundational**. It should sit above governance in the authority hierarchy because it answers the question "What are we building?" before governance can ask "What controls does it need?"

**Action:** Update HEPHAISTOS.md to promote Forging to Tier 0, primary authority.

### Recommendation 2: Consolidate Overlapping Skills

Skills like `prompt-engineer`, `prompt-engineering`, and `prompt-engineering-instructor` appear to be levels of the same discipline. Before registering all three, audit for:
- True functional difference vs. level-of-explanation difference
- Whether they should be one skill with multiple modes or separate skills
- Same for `scientific-writing` vs `writing-skills`, etc.

**Action:** Create a consolidation matrix and dedup before registration.

### Recommendation 3: Establish Clear Agent Skill Orchestration

Agent development currently has no formal composition pattern. Without it, agent-related skills will be ambiguous to route.

**Action:** Add a complete "Agent Lifecycle Composition" pattern to ORCHESTRATION.md:
```
TIER 0: ai-agents-architect (design) + agent-development (build)
TIER 1: recursive-governance-method (audit for safety/control)
TIER 3: agent-evaluation (benchmark performance)
TIER 0: ai-product (productionize)
TIER 2: agent-management (operate)
```

### Recommendation 4: Create Forging Routing Tables

Add explicit routing tables to ORCHESTRATION.md for common Forging use cases:

- "I want to build an agent" → Tier 0 agent stack
- "I want to design a system" → Tier 0 architecture stack
- "I want to run a research project" → Tier 0 research leadership stack
- "I want to publish a paper" → Tier 0 research + Tier 4 writing stack
- Etc.

**Action:** Expand ORCHESTRATION.md with "Forging Quickstart" routing table.

### Recommendation 5: Deprecate or Clarify Niche Skills

Skills like `research-grants`, `free-tool-strategy`, `naming-analyzer` are niche. Before registering:
- Confirm they are truly distinct from existing skills
- Consider whether they are best served as **composite routes** rather than registered skills
- Example: `research-grants` might be "Tier 0 lead-research-assistant + Tier 4 publisher" rather than a standalone skill

**Action:** Create a "Niche Skills Review" document to audit before Phase 6.

---

## Part 8: Open Questions for User Clarification

1. **Tier 0 Authority:** Do you want Forging to be **primary** over governance, or **co-equal** with governance?

2. **Skill Consolidation:** Should multi-level writing/prompt skills be consolidated into single skills with multiple modes, or kept separate?

3. **Registry Scope:** Should ALL 39 Forging skills be registered in SKILL-MAP, or should some be documented as "composite routes" rather than standalone entries?

4. **Timeline:** What is the release timeline? Phase 1 (Tier 0 + research) can ship in 1 week. Phase 2-3 (full expansion) takes 3-4 weeks.

5. **Deprecation:** Should any existing skills be deprecated or consolidated as part of this consolidation?

---

## Conclusion

HEPHAISTOS is well-structured but is missing ~59% of the Forging skill corpus. Integrating these skills requires:

1. **Creating Tier 0 Forging as the foundational layer** (1 week)
2. **Reorganizing existing tiers to accommodate 23 new skills** (2-3 weeks)
3. **Establishing clear composition patterns across tiers** (1 week)
4. **Resolving overlaps and consolidating niche skills** (1 week)

**Total estimated effort:** 3-5 weeks for full integration.

**Critical path:** Phase 1 (Tier 0) is a blocker for everything else. Once Tier 0 is established, phases 2-6 can proceed in parallel.

**Next step:** Clarify the 5 open questions above, then begin Phase 1.

---

**Report prepared by:** HEPHAISTOS Audit Agent  
**Status:** Ready for user review and decision
