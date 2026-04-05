# Tier 0 Forging — Quick Start Guide

**Use this:** When you want to build, design, or launch something.  
**Don't use this:** For refinement, review, or decision-making alone (use Governance + right-arms).

---

## The Pattern

Every build request follows this flow:

```
1. YOU: "I want to build/design/launch..."
2. FORGING SKILL: Defines scope, artifact type, audience, evidence needed
3. GOVERNANCE: Receives Forging input + Philosopher + Power-Analyst input
4. GOVERNANCE: Makes final decision on constraints and controls
5. DIAMOND-EYES: "Does this serve genuine flourishing?"
6. OUTPUT: Promotion or escalation
```

---

## Decision Tree — Which Tier 0 Skill?

### "I want to build an AI agent"

**Skills:**
- `ai-agents-architect` — design the agent system (architecture, reasoning loops, tools)
- `agent-development` — implement/build/debug the agent code
- `ai-product` — move agent to production (deployment, scaling, monitoring)

**Flow:**
```
1. Architect designs agent → feeds to Governance + right-arms
2. Governance decides constraints (safety, auditability, resource limits)
3. Development builds within those constraints
4. Product moves to deployment
5. Diamond-Eyes validates: Does this agent serve users genuinely?
```

---

### "I want to design a system"

**Skills:**
- `architecture` — design the system structure (components, integration, data flow)
- `database-schema-designer` — design the data model and schema

**Flow:**
```
1. Architecture defines system scope/structure → feeds to Governance + right-arms
2. Database-schema-designer defines data model in parallel
3. Governance decides constraints (scalability, resilience, governance controls)
4. Right-arms inform: Is this conceptually sound? Structurally robust?
5. Diamond-Eyes validates: Does this system serve its users and purpose?
```

---

### "I want to launch a research project"

**Skills:**
- `lead-research-assistant` — define research scope, strategy, prioritization
- `qualitative` — (Tier 3) select research method based on scope
- `deep-research-notebooklm` — (Tier 3) execute the research

**Flow:**
```
1. Research lead defines project scope/strategy → feeds to Governance + right-arms
2. Governance decides constraints (timeline, resources, publication requirements)
3. Right-arms frame: Is this question worth asking? Structurally feasible?
4. Qualitative selects method within governance bounds
5. Research executes study
6. Diamond-Eyes validates: Does this research serve understanding and wisdom?
```

---

## What Happens Next (After Forging)

Once a Forging skill defines the scope:

1. **Governance (center) receives:**
   - Forging's scope definition
   - Philosopher's conceptual framing (Is this wise? What values are at stake?)
   - Power-Analyst's structural analysis (Who benefits? What leverage exists?)

2. **Governance synthesizes all inputs and decides:**
   - What controls are needed?
   - What evidence thresholds apply?
   - What risks must be managed?

3. **Diamond-Eyes validates:**
   - Is the final decision wise and caring?
   - Does it serve genuine flourishing?
   - If not → escalate or revise

4. **Output is promoted** (artifact, constraints, next steps)

---

## Key Principle: Diamond-Eyes

All Tier 0 (Forging) work must serve genuine flourishing. A technically correct artifact scope
that doesn't serve wisdom or care fails the Diamond-Eyes test and is escalated.

**Question:** Does what we're building serve genuine flourishing?
- Yes + Governance constraints ✓ → Proceed
- Yes + Governance says no → Escalate (conflict on evidence/control grounds)
- No → Escalate (wisdom constraint)

---

## Don't Do This

- ❌ Skip Forging and go straight to Governance (Governance needs scope definition first)
- ❌ Let Forging define constraints (Governance defines constraints, Forging defines scope)
- ❌ Treat Forging scope as final (Governance + right-arms may reshape it based on feasibility/wisdom)
- ❌ Promote an artifact that passes Governance but fails Diamond-Eyes (wisdom is non-negotiable)

---

## Examples

**Example 1: Build an agent**
```
→ "I want to build an agent for X"
→ ai-agents-architect defines: single vs multi-agent? Reasoning loop? Tools? Observability?
→ Governance + right-arms receive this scope definition
→ Governance adds constraints: Must be auditable, error-bounded, human-controlled
→ Development builds within those bounds
→ Diamond-Eyes: Does this agent serve users genuinely or just automate harm?
```

**Example 2: Design a system**
```
→ "I want a system that does X"
→ architecture defines: components, data flow, scalability targets
→ database-schema-designer defines: data model, constraints
→ Governance + right-arms receive both
→ Governance adds constraints: Must be resilient, scalable to 10x load, auditable
→ Philosopher: Is this system aligned with our values?
→ Power-Analyst: Who has power in this system? Are power asymmetries intentional?
→ Diamond-Eyes: Does this system serve its users and purpose, or just consolidate control?
```

**Example 3: Research project**
```
→ "I want to research X"
→ lead-research-assistant defines: research question, scope, timeline, audience
→ Governance + right-arms receive this scope
→ Governance adds constraints: Must follow ethics approval, transparent methods, accessible findings
→ Philosopher: What is worth knowing? What values govern this inquiry?
→ Power-Analyst: Whose knowledge is centered? Whose is marginalized in this framing?
→ Diamond-Eyes: Does this research serve understanding and wisdom for genuine flourishing?
```

---

## When to Escalate

Escalate (pause and ask for help) when:

- Forging scope definition is unclear or ambiguous
- Governance and Forging disagree on feasibility
- Right-arms flag serious concerns (wisdom, power asymmetry)
- Diamond-Eyes fails (technically correct but unwise)
- You're unsure which Tier 0 skill to invoke

---

## Documentation

- **SKILL-MAP.md Tier 0** — Full skill definitions
- **ORCHESTRATION.md** — Composition patterns and routing rules
- **HEPHAISTOS.md** — Authority structure and decision model
- **DIAMOND-EYES.md** — Final validation principle
- **PHASE-1-PLAN.md** — Implementation timeline

---

**Quick reference:** Forging defines scope → Governance + right-arms decide constraints → Diamond-Eyes validates wisdom.
