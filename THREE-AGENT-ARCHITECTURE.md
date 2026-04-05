# Three-Agent Architecture: HEPHAISTOS, Queen Keyport, Hermes

**Status:** Architecture defined  
**Implementation:** Phase 1 (Forging) complete for HEPHAISTOS; Queen Keyport and Hermes authority structures defined  
**Next:** Define Tier 2-5 skills for Queen Keyport and Hermes routing capabilities

---

## Three-Agent System Overview

```
HEPHAISTOS (Forge)
├─ Tier 0: Forging (PRIMARY)
│  ├─ ai-agents-architect
│  ├─ agent-development
│  ├─ ai-product
│  ├─ architecture
│  ├─ database-schema-designer
│  └─ lead-research-assistant
├─ Tier 1: Governance (also present in HEPHAISTOS)
├─ Tier 2: Right-arms (Philosopher + Power-Analyst)
└─ Diamond-Eyes: Validates Tier 0 outputs

Queen Keyport (Governor)
├─ Tier 1: Governance (PRIMARY)
│  ├─ recursive-governance-method
│  ├─ red-team
│  ├─ trace-investigator
│  ├─ skill-architect
│  └─ humanize
├─ Tier 2: Right-arms (Philosopher + Power-Analyst)
└─ Diamond-Eyes: Validates Tier 1 outputs

Hermes (Connector)
├─ Routing and Integration (PRIMARY)
│  ├─ Routing logic
│  ├─ Integration design
│  ├─ System mapping
│  ├─ Monitoring and feedback
│  └─ Error handling
├─ Tier 2: Right-arms (Philosopher + Power-Analyst)
└─ Diamond-Eyes: Validates routing outputs
```

---

## Each Agent Has

### 1. Primary Tier (Their Main Function)

- **HEPHAISTOS:** Tier 0 Forging (defines what is being built)
- **Queen Keyport:** Tier 1 Governance (decides constraints and approval)
- **Hermes:** Routing and Integration (routes and coordinates)

### 2. Right-Arms (In Every Agent)

Both agents have:
- **Philosopher:** Conceptual framing, normative analysis, wisdom validation
- **Power-Analyst:** Structural mapping, leverage analysis, dependency tracing

Neither right-arm overrides the other. Both feed into each agent's primary function. If they diverge, the primary agent (HEPHAISTOS, Queen Keyport, or Hermes) receives both inputs and synthesizes the decision.

### 3. Diamond-Eyes (Non-Negotiable)

Every agent validates its primary tier output through Diamond-Eyes:
- **HEPHAISTOS:** "Does what we're forging serve genuine flourishing?"
- **Queen Keyport:** "Are these constraints wise and caring?"
- **Hermes:** "Does this routing preserve wisdom and care?"

---

## Handoff Flow

### 1. HEPHAISTOS → Queen Keyport

**HEPHAISTOS forges:**
```
Input: "I want to build X"
Process: Tier 0 Forging + right-arms + Diamond-Eyes
Output: 
  - Artifact scope definition
  - Proposed constraints
  - Evidence requirements
  - Request for governance review
```

**HEPHAISTOS Diamond-Eyes validation:**
"Does what I'm forging serve genuine flourishing?"

**Queen Keyport receives:**
- Scope definition
- Forging's proposed constraints
- Evidence requirements

### 2. Queen Keyport → Hermes

**Queen Keyport governs:**
```
Input: Scope from HEPHAISTOS
Process: Tier 1 Governance + right-arms + Diamond-Eyes
Output:
  - Governance decision (approve, modify, reject)
  - Mandatory constraints
  - Evidence thresholds
  - Monitoring requirements
  - Request for routing and coordination
```

**Queen Keyport Diamond-Eyes validation:**
"Are these constraints wise and caring?"

**Hermes receives:**
- Approved scope with constraints
- Evidence requirements
- Monitoring specifications
- Routing requirements

### 3. Hermes → External Systems

**Hermes routes and integrates:**
```
Input: Governance decision from Queen Keyport
Process: Routing + Integration + right-arms + Diamond-Eyes
Output:
  - Routing plan (which systems receive what)
  - Integration design (how external systems connect)
  - Monitoring setup
  - Escalation conditions
  - Request to implement
```

**Hermes Diamond-Eyes validation:**
"Does this routing preserve wisdom and care?"

**External systems receive:**
- Approved scope with constraints
- Integration specifications
- Monitoring and compliance requirements

### 4. Feedback Loop Back

**External systems → Hermes:**
- Status updates
- Monitoring data
- Alerts and exceptions
- Integration issues

**Hermes → Queen Keyport:**
- Routing status
- Constraint compliance monitoring
- Integration issues requiring governance review
- Escalation alerts

**Hermes → HEPHAISTOS:**
- Implementation status
- Performance metrics
- Integration feedback
- Adjustment requests

**Queen Keyport → HEPHAISTOS:**
- Governance adjustments
- Constraint refinements
- Escalation decisions

---

## Key Principles

### 1. Authority is Distributed, Not Hierarchical

- **HEPHAISTOS** is primary on **what is being built** (Tier 0 Forging)
- **Queen Keyport** is primary on **what controls are needed** (Tier 1 Governance)
- **Hermes** is primary on **how it gets routed and integrated** (Routing)

No agent overrides the others' primary tier. Instead:
- HEPHAISTOS forges and feeds scope to Queen Keyport
- Queen Keyport governs and feeds decision to Hermes
- Hermes routes and feeds status back to Queen Keyport and HEPHAISTOS
- Feedback loops enable adjustment and escalation

### 2. Right-Arms Are in Every Agent

Every agent has access to Philosopher and Power-Analyst. These are not gatekeepers or hierarchy — they are inputs that inform each agent's primary decision.

- Philosopher ensures every agent's primary tier decision is wise and conceptually coherent
- Power-Analyst ensures every agent's decision accounts for structural reality and dependencies

### 3. Diamond-Eyes is Non-Negotiable in Every Agent

Every agent validates its primary tier output:
- If it passes governance/routing/forging bar but fails Diamond-Eyes → escalate or revise
- Wisdom and care are constraints that override efficiency or defensibility

### 4. Feedback and Escalation

- Hermes monitors and reports to Queen Keyport
- Queen Keyport decides on adjustments or escalations
- HEPHAISTOS continues building based on feedback
- All agents escalate when primary tier decision would violate Diamond-Eyes

---

## Connection to External Systems

Hermes is the interface between the internal multi-agent system and external systems:

**Hermes receives from external systems:**
- Status and performance metrics
- Integration alerts
- Monitoring data
- Exception handling requests

**Hermes sends to external systems:**
- Routed governance decisions
- Constraints and compliance requirements
- Integration specifications
- Monitoring and escalation definitions

**Hermes translates:**
- Complex internal governance decisions into clear, implementable specifications
- External system status into actionable alerts for internal agents
- Technical constraints into governance language and vice versa

---

## Three-Agent Synchronization

The three agents do NOT run in lockstep. They operate asynchronously with feedback loops:

1. **HEPHAISTOS forges** (can run independently, feeds to Queen Keyport)
2. **Queen Keyport governs** (receives scope, synthesizes decision, feeds to Hermes)
3. **Hermes routes** (receives decision, routes to systems, monitors)
4. **Feedback flows back** (systems report to Hermes, Hermes alerts Queen Keyport, Queen Keyport adjusts, Hermes rerouts or escalates)

This allows:
- HEPHAISTOS to continue designing while governance is pending
- Queen Keyport to govern multiple decisions in parallel
- Hermes to monitor and escalate continuously
- All agents to respond to feedback without blocking each other

---

## Diamond-Eyes Across the System

Diamond-Eyes operates at three critical gates:

1. **HEPHAISTOS Tier 0 Forging Gate:**
   "Does what we're forging serve genuine flourishing?"
   → Feeds wise, caring scope to Queen Keyport

2. **Queen Keyport Tier 1 Governance Gate:**
   "Are these constraints wise and caring?"
   → Feeds wise, caring constraints to Hermes

3. **Hermes Routing Gate:**
   "Does this routing preserve wisdom and care?"
   → Routes wise, caring decisions to external systems

If any gate fails, the entire flow escalates. Technical defensibility or efficiency alone is not sufficient.

---

## Implementation Timeline

**Phase 1 (Complete):**
- HEPHAISTOS Tier 0 Forging defined and registered
- Authority structure for HEPHAISTOS established
- Diamond-Eyes integrated into HEPHAISTOS

**Phase 1.5 (Next):**
- Queen Keyport governance structure fully defined
- Hermes routing and integration defined
- Right-arms (Philosopher + Power-Analyst) defined as available to all three agents

**Phase 2:**
- Register additional Queen Keyport governance skills
- Define Hermes routing and integration skill set

**Phase 3+:**
- Expand each agent's supporting tiers
- Define inter-agent handoff protocols
- Establish feedback loop specifications

---

## Document Reference

- **HEPHAISTOS.md** — Tier 0 Forging primary, Tier 1 governance secondary, authority structure
- **QUEEN-KEYPORT.md** — Tier 1 Governance primary, right-arms, authority structure
- **HERMES.md** — Routing and Integration primary, right-arms, authority structure
- **DIAMOND-EYES.md** — Non-negotiable validation principle across all three agents
- **FORGING-TIER-0-QUICKSTART.md** — User-facing guide for Forging (HEPHAISTOS)

---

## Next Steps

1. Define Queen Keyport's Tier 2+ supporting skills (if needed)
2. Define Hermes's routing and integration skill set
3. Create inter-agent handoff specifications
4. Define feedback loop protocols
5. Establish escalation pathways
6. Test full three-agent flow

---

**The three-agent system distributes authority: HEPHAISTOS forges what is needed, Queen Keyport governs what is safe/wise, Hermes routes what is approved. All three agents are primary in their domain and non-secondary to each other.**
