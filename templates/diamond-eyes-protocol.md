# Diamond Eyes Protocol — Operationalizing Wisdom Validation

**Purpose:** Embed Diamond Eyes (wisdom/care validation) into skill execution and governance handoffs as a non-negotiable gate before output promotion.

**Scope:** All skills, all handoffs, all tiers.

**Status:** Validation gate — not optional, not ceremonial.

---

## Core Question

**Before promoting any output, ask: Does this serve genuine flourishing, or does it serve the appearance of something good while enabling harm?**

This is the single Diamond Eyes question. All others are refinements.

---

## Four-Step Operationalization

### 1. Clarity Gate (What is being decided?)

Before validating, ensure the output is clear:
- What is actually being decided or delivered?
- Who will be affected?
- What does success look like for them, not just the system?

### 2. Wisdom Assessment (Does it serve flourishing?)

Apply this rubric:

| Dimension | Serves Flourishing | Creates Theater |
| - | - | - |
| **Autonomy** | Preserves human choice and agency | Hides constraint behind process; removes discretion |
| **Transparency** | Makes tradeoffs visible; names what's sacrificed | Claims neutrality; hides value choices |
| **Accountability** | Someone can be held responsible | Distributed accountability = no accountability |
| **Dignification** | Treats people as ends; preserves dignity | Treats people as inputs to a system |
| **Care** | Shows concern for those affected | Optimizes metrics while ignoring human cost |

**Verdict:** If any dimension fails, assess why. Is it:
- A tradeoff that was *disclosed*? (Theater prevented by transparency)
- A genuine necessity? (Accept, document, escalate)
- A design choice that could be different? (Revise)

### 3. Care Requirement (What must be preserved?)

Name explicitly: **What aspect of human flourishing must this decision preserve, protect, or enable?**

Examples:
- "This decision preserves human oversight over X"
- "This constraint protects vulnerable group Y from Z"
- "This design maintains Z's ability to opt out"

If no care requirement can be named, the decision serves theater.

### 4. Escalation or Promotion

**If all four gates pass:**
- Output is wise + correct
- Promote with Diamond Eyes assessment included

**If wisdom gate fails but it's a necessary tradeoff:**
- Escalate with explicit statement of what is being sacrificed
- Governance/escalation authority decides if tradeoff is acceptable
- Include the care requirement and why it could not be met

**If wisdom gate fails and it's a design choice:**
- Revise before promotion
- Reframe through care

---

## Tier-Specific Application

### Tier 0 (Forging) — Diamond Eyes on Scope

**Question:** Does this scope serve genuine flourishing or frame a problem in a way that enables harm?

**Wisdom check:**
- Is the vulnerable population identified and centered?
- Are we defining the problem in a way that preserves their agency?
- Does this scope acknowledge what we're NOT solving?

**Care requirement:** Name who the scope protects and how.

---

### Tier 1 (Governance) — Diamond Eyes on Constraints

**Question:** Do these constraints serve genuine flourishing or create the appearance of control while enabling capture?

**Wisdom check:**
- Do constraints have exceptions? Who can invoke them?
- Are constraints transparent to those affected?
- Can someone appeal or disagree with a constraint?

**Care requirement:** Name what the constraints protect and for whom.

---

### Tier 2 (Right-Arms) — Diamond Eyes on Analysis

**Philosopher:** Does this philosophical frame enable genuine flourishing or rationalize something already decided?

**Power-Analyst:** Does this power map expose real structure or distribute blame to obscure accountability?

**Care requirement:** Name what analysis protects and who it serves.

---

### Tier 3 (Research) — Diamond Eyes on Evidence

**Question:** Does this research methodology generate wisdom or just data that will be interpreted to justify power?

**Wisdom check:**
- Can results be interpreted multiple ways?
- Does research design account for the researchers' own biases?
- Are vulnerable populations treated as subjects or partners?

**Care requirement:** Name how research preserves research subjects' dignity and agency.

---

### Tier 4 (Writing) — Diamond Eyes on Communication

**Question:** Does this writing illuminate or obscure? Does it empower readers or manipulate them?

**Wisdom check:**
- Are limitations named?
- Are tradeoffs visible?
- Can the reader disagree based on the information given?

**Care requirement:** Name what clear communication protects (reader autonomy, informed choice, etc.).

---

### Tier 5 (Meta) — Diamond Eyes on Architecture

**Question:** Does this system design enable genuine flourishing or embed power asymmetries while claiming neutrality?

**Wisdom check:**
- Can the system be gamed?
- Who benefits if it is gamed?
- Are there circuit-breakers or reversals?

**Care requirement:** Name what system design protects and for whom.

---

## Handoff Integration

Diamond Eyes assessment must be included in all three handoff types:

### In HEPHAISTOS → Queen Keyport (Scope)

```yaml
diamond_eyes_assessment:
  does_this_serve_flourishing: [yes|conditional|no]
  wisdom_assessment: [brief statement of flourishing risk]
  care_requirement: [what must be preserved]
  escalation_if_needed: [true|false]
```

### In Queen Keyport → Hermes (Governance Decision)

```yaml
diamond_eyes_validation:
  serves_flourishing: [yes|conditional|no]
  wisdom_assessment: [what makes this wise or theater]
  care_requirement: [what the constraints protect]
  conditional_triggers: [if conditional: what must change to say yes?]
```

### In Hermes → Queen Keyport (Status/Warning/Escalation)

```yaml
diamond_eyes_concern:
  category: [wisdom|care|accountability|transparency|autonomy]
  what_changed: [what was assumed to be true that is no longer true]
  impact_on_flourishing: [how does implementation differ from intention?]
  escalation_needed: [true|false]
```

---

## Escalation Trigger: Diamond Eyes Override

**If Diamond Eyes and other criteria diverge:**

| Scenario | Verdict |
| - | - |
| Technically correct + wise | **PROMOTE** |
| Technically correct + theater | **ESCALATE** for governance decision |
| Technically incorrect + wise intent | **REVISE** before promotion |
| Technically incorrect + theater | **REJECT** |

When escalated: Governance or veto authority must decide if the wisdom sacrifice is acceptable and why. Decision is recorded as explicit tradeoff.

---

## What Diamond Eyes Is NOT

- Not a blocker for every decision
- Not a requirement that all decisions make everyone happy
- Not a claim that perfect wisdom exists
- Not a new skill or lane
- Not a ceremony that adds no value

## What Diamond Eyes IS

- A final validation gate on every output
- A way to catch when we optimize metrics while enabling harm
- A principle that "technically correct" is not enough
- A non-negotiable requirement that wisdom and care flow through all structures

---

## Audit Trail

Every promotion must include:

1. **What was assessed?** (Scope/decision/analysis/writing/system)
2. **What is it designed to serve?** (The care requirement)
3. **Did it pass Diamond Eyes?** (Yes/conditional/escalated)
4. **If conditional or escalated, why?** (Explicit tradeoff statement)

This creates an auditable record of where wisdom was preserved and where it was traded off.
