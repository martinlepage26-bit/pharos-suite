# Forging Integration — Phase 1 Execution Plan

**Timeline:** 1 week (concurrent execution possible)  
**Status:** Ready to execute  
**Blocker:** None — Phase 1 is self-contained and enables Phases 2-6

---

## Phase 1 Objective

Establish Tier 0 Forging as primary upstream of Governance. Register 6 base Forging skills. Make HEPHAISTOS capable of answering "What is being built?" before asking "What controls does it need?"

---

## Deliverables

### 1. ✓ SKILL-MAP.md — Tier 0 Forging Registration
**Status:** COMPLETE  
**Content:** 6 base skills registered with function, trigger conditions, consequence profile, pairings

- `ai-agents-architect` — agent architecture design
- `agent-development` — agent implementation
- `ai-product` — productionization and deployment
- `architecture` — system architecture design
- `database-schema-designer` — data schema design
- `lead-research-assistant` — research leadership and scope

---

### 2. ORCHESTRATION.md — Tier 0 Routing Rules (IN PROGRESS)

**What's needed:**
Add a new section after Step 2 (Single-Skill Routing) with Tier 0 routing shortcut:

```
**Tier 0 (Forging — defines scope):**
- Agent system being built? → `ai-agents-architect` (primary)
- Building/implementing the agent? → `agent-development` (primary)
- Moving agent to production? → `ai-product` (primary)
- New system being designed? → `architecture` (primary)
- Database/data model needed? → `database-schema-designer` (primary)
- Research project being launched? → `lead-research-assistant` (primary)

All Tier 0 outputs feed into Governance (center) + right-arms (Philosopher, Power-Analyst)
for constraints, conceptual framing, and structural analysis.
```

---

### 3. ORCHESTRATION.md — Forging → Governance Composition Pattern

**What's needed:**
Add to Step 3 (Standard Composition Patterns) — first pattern, before "Governance + Philosopher":

```
**Forging → Governance + Right-Arms (Universal Pattern)**
- Use when: Any task starts with "I want to build/design/launch..."
- Forging primary: Defines artifact scope, type, audience, evidence requirements
- Center (Governance): Receives Forging input + right-arm inputs, makes final decision
- Right-arms (both feed in):
  - Philosopher: provides conceptual framing
  - Power-Analyst: provides structural mapping
  - Both inputs shape governance's constraints and controls
- Conflict rule: Forging defines scope; Governance may constrain on evidence/control grounds;
  right-arms both inform but don't override; if Philosopher and Power-Analyst diverge,
  governance synthesizes both inputs

COMPOSITION RATIONALE: Forging asks "what is being built?" Governance asks "what controls
does it need?" Right-arms ensure the decision is wise (Philosopher) and structurally sound
(Power-Analyst). Diamond-Eyes validates the final decision serves genuine flourishing.
```

---

### 4. HEPHAISTOS.md — Update Task Routing Rules

**What's needed:**
The "If forging/artifact-scope" section is already in place (added in authority update).
Verify it reads correctly and links to Tier 0 skills by name.

**Current state:** ✓ DONE (already updated in earlier authority changes)

---

### 5. AGENTS.md — Add Escalation Criteria for Forging Tasks

**What's needed:**
Add to escalation checklist:
- Is this a Forging task (defining artifact scope for a major system, agent, research project)?
- If yes, escalate to full L1-L5 review if any high-consequence decision is at stake.

**Note:** Create this only if AGENTS.md exists and has current escalation structure. Otherwise, defer to Phase 3.

---

### 6. Create FORGING-TIER-0-QUICKSTART.md

**What's needed:**
One-page decision tree for users:

```
## Tier 0 Forging — Quick Decision Tree

**I want to build an agent**
  → `ai-agents-architect` (design) + `agent-development` (build)
  → then Governance + right-arms for constraints
  → then `ai-product` for deployment

**I want to design a system**
  → `architecture` (design) + `database-schema-designer` (data model)
  → then Governance + right-arms for constraints

**I want to launch a research project**
  → `lead-research-assistant` (scope + leadership)
  → then `qualitative` (Tier 3, method selection)
  → then `deep-research-notebooklm` (Tier 3, execution)

**All routes feed through:**
1. Forging (define scope)
2. Governance (center)
3. Right-arms (Philosopher + Power-Analyst input)
4. Diamond-Eyes (final wisdom validation)
```

---

## Execution Sequence

### Step 1: Verify SKILL-MAP.md Tier 0 (COMPLETE)
- [x] Tier 0 section created with 6 base skills
- [x] Each skill has function, triggers, consequence, pairings
- [x] Diamond-Eyes requirement noted

### Step 2: Update ORCHESTRATION.md
- [ ] Add Tier 0 routing shortcut to Step 2
- [ ] Add Forging → Governance + Right-Arms composition pattern to Step 3
- [ ] Link to SKILL-MAP.md Tier 0 section

### Step 3: Verify HEPHAISTOS.md Task Routing Rules
- [ ] Confirm "If forging/artifact-scope" section is present and correct
- [ ] Verify it links to Tier 0 skills

### Step 4: Create FORGING-TIER-0-QUICKSTART.md
- [ ] One-page decision tree for common Tier 0 use cases
- [ ] Links to Tier 0 skills
- [ ] Explains flow through Governance + right-arms + Diamond-Eyes

### Step 5: Optional — Update AGENTS.md
- [ ] Add Forging task escalation criteria if AGENTS.md has current structure
- [ ] Defer if AGENTS.md is incomplete or outdated

---

## Testing Phase 1

Before moving to Phase 2, verify:

1. **Routing clarity:** Can a user understand how to route a "build an agent" or "design a system" request through Tier 0?
2. **Skill accessibility:** Are the 6 Tier 0 skills documented clearly enough to understand when to invoke each?
3. **Governance linkage:** Is it clear that Tier 0 outputs feed into Governance + right-arms?
4. **Diamond-Eyes integration:** Does the documentation make clear that all Tier 0 outputs must pass Diamond-Eyes validation?

**Pass criteria:** A reader can follow the quickstart and understand the complete flow from Forging → Governance → Output.

---

## Blockers & Dependencies

- **None.** Phase 1 is self-contained.
- Phases 2-6 depend on Phase 1 completion.
- Can proceed to Phase 2 (Research Skills) immediately upon Phase 1 completion.

---

## Success Criteria

Phase 1 is complete when:

1. ✓ Tier 0 Forging is registered in SKILL-MAP.md with 6 base skills
2. [ ] ORCHESTRATION.md has Tier 0 routing and Forging → Governance composition pattern
3. [ ] HEPHAISTOS.md Task Routing Rules correctly reference Tier 0
4. [ ] FORGING-TIER-0-QUICKSTART.md exists and is clear
5. [ ] Diamond-Eyes is explicitly integrated into Tier 0 documentation
6. [ ] All documentation is internally consistent and links correctly

---

## Next Phase

**Phase 2: Research Skills Consolidation**
- Register ~12 research/data science skills under Tier 3
- Establish research leadership → research design → execution flow
- Timeline: Weeks 2-3

---

**Status:** Phase 1 ready for execution. Steps 2-4 can proceed immediately. Step 1 is COMPLETE.
