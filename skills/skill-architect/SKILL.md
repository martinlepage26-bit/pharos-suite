---
name: skill-architect
description: Design, build, audit, and restructure SKILL.md files using dual-layer architecture (execution logic + knowledge map). Use when creating a new skill from scratch, evaluating whether an existing skill separates prompt engineering from context engineering effectively, restructuring a bloated or underperforming skill, diagnosing why a skill triggers poorly or produces inconsistent outputs, or converting a working conversation workflow into a reusable skill. Also trigger when the user mentions "skill structure," "SKILL.md," "skill template," "skill audit," "prompt vs context," "brain and map," or asks how to make a skill more reliable, token-efficient, or maintainable.
---

# Skill Architect

Build and audit SKILL.md files by treating every skill as two separable layers: a **Brain** (prompt engineering: how the model thinks and acts) and a **Map** (context engineering: what the model knows and which tools it can reach). A skill that conflates these layers produces brittle, token-wasteful, hard-to-debug output. A skill that separates them becomes modular, auditable, and scalable.

## When This Skill Activates

This skill handles two modes:

1. **Build mode** — the user wants a new SKILL.md from intent through finished file.
2. **Audit mode** — the user has an existing SKILL.md and wants it evaluated, restructured, or improved.

Detect which mode applies from the user's request. If ambiguous, ask once, then proceed.

---

## Core Architecture: Brain + Map

Every SKILL.md encodes two distinct engineering problems. Mixing them is the single most common failure pattern in skill design.

### The Brain (Prompt Engineering)

Controls **how the model reasons and responds**. Contains:

- **Persona and tone** — who the model acts as, what register it uses.
- **Execution logic** — sequenced steps, conditionals, chain-of-thought instructions.
- **Negative constraints** — what the model must not do (deprecated methods, out-of-scope topics, filler language).
- **Few-shot examples** — 1-2 concrete input/output pairs showing what a correct response looks like.
- **Output format** — the structure the response must take (Markdown, JSON, code block, specific template).

The Brain answers: *given perfect information, how should the model behave?*

### The Map (Context Engineering)

Controls **what information and tools are available** when the model runs. Contains:

- **Knowledge retrieval** — which files, docs, or references to read, and under what conditions. This is the skill's RAG layer.
- **Tool orchestration** — which scripts, APIs, or validation tools to run, and when. Deterministic operations belong here, not in prose instructions.
- **Memory management** — how to handle user preferences, session state, and conversation length.
- **Token pruning** — what to exclude, when to defer loading, and how to prevent context rot (the model losing focus because its input window is cluttered with irrelevant tokens).

The Map answers: *what does the model need access to in order to execute the Brain's instructions?*

### Why the separation matters

| Problem | Cause | Layer at fault |
|---|---|---|
| Model hallucinates facts | No file path or reference provided | Map (missing knowledge retrieval) |
| Model ignores instructions | Instructions buried under data dumps | Brain (poor structure) or Map (no token pruning) |
| Output format is wrong | No format spec or example | Brain (missing output format / few-shot) |
| Model reinvents a script every run | Calculation described in prose, not delegated to a tool | Map (missing tool orchestration) |
| Skill triggers on wrong queries | Description too vague or keyword-poor | Metadata (neither layer; frontmatter problem) |
| Model is verbose or chatty | No negative constraints on filler | Brain (missing constraints) |

---

## Build Mode: Creating a New Skill

### Step 1 — Capture Intent

Before writing anything, resolve these questions (extract from conversation history if possible; ask the user only for gaps):

1. **What should this skill enable Claude to do?** (the core capability)
2. **When should this skill trigger?** (user phrases, contexts, keywords)
3. **What is the expected output format?** (file type, structure, length)
4. **What tools or references does the skill need?** (scripts, docs, APIs, validation steps)
5. **What should the skill explicitly refuse or avoid?** (scope boundaries, negative constraints)

### Step 2 — Draft the SKILL.md

Use this structure. Adapt section content to the skill's domain, but preserve the two-layer separation.

```markdown
---
name: [kebab-case-name]
description: [What it does] + [When to trigger, with specific keywords and contexts]. Keep under 1,024 characters. Write in third person. Be slightly pushy on trigger scope to prevent under-triggering.
---

# [Skill Title]

[1-3 sentence overview: what this skill does and why the two-layer separation matters for this domain.]

## 1. The Brain (Execution Logic)

<persona>
- Role: [Senior Expert Title] specializing in [Domain].
- Tone: [Concise/Technical/Analytical — pick one dominant register].
- Goal: [What the model optimizes for when using this skill].
</persona>

<instructions>
1. [Action verb] the input to identify [key element].
2. If [condition], then [action A]; otherwise [action B].
3. Before finalizing, validate against [constraint or quality gate].
</instructions>

<negative_constraints>
- NEVER [specific anti-pattern with reason why].
- DO NOT [scope boundary with reason why].
</negative_constraints>

<output_format>
[Exact template or structural spec for the response.]
</output_format>

<few_shot_examples>
**Example 1:**
Input: [concrete example input]
Output: [concrete example output]
</few_shot_examples>

## 2. The Map (Knowledge + Tools)

<knowledge_retrieval>
- Primary reference: Read `[path]` for [what it provides].
- Conditional: If [situation], also read `[path]`.
- External: Use [tool] only if local data is [stale/missing/insufficient].
</knowledge_retrieval>

<tool_orchestration>
- Mandatory: Run `[script/command]` after [trigger event].
- Quality gate: If [condition], execute `[validation script]`.
</tool_orchestration>

<memory_management>
- Check `[path]` for user preferences or custom overrides.
- If conversation exceeds [N] turns, summarize progress to prevent context drift.
</memory_management>

<token_management>
- Keep main body under 500 lines.
- Move heavy reference material to `references/` — load only when needed.
- If the task is [X], ignore files in `[path]` to save context space.
</token_management>
```

### Step 3 — Self-Audit Before Delivery

Run the audit checklist (see Audit Mode below) against your own draft. Fix issues before presenting to the user.

### Step 4 — Progressive Disclosure Check

Verify the three-level loading hierarchy:

1. **Metadata** (name + description) — always in context, ~100 words. This is the trigger mechanism.
2. **SKILL.md body** — loaded when skill triggers, under 500 lines.
3. **Bundled resources** (references/, scripts/, assets/) — loaded on demand, referenced clearly from the body.

If the body exceeds 500 lines, extract reference material into `references/` with a table of contents for files over 300 lines.

---

## Audit Mode: Evaluating an Existing Skill

When auditing, read the full SKILL.md and any bundled resources, then evaluate against these dimensions. Report findings with evidence (quote the problematic line or section), not just labels.

### Audit Checklist

**A. Layer Separation**
- [ ] Can you draw a clean line between Brain sections and Map sections?
- [ ] Are there prose instructions that describe *how to calculate something* instead of pointing to a script? (Map failure: missing tool orchestration)
- [ ] Are there data dumps or file contents pasted inline instead of referenced by path? (Map failure: token waste)
- [ ] Is the persona or tone defined, or does the skill rely on the model's defaults? (Brain gap)

**B. Metadata Quality**
- [ ] Does the `name` in frontmatter match the folder name, both in kebab-case?
- [ ] Is the `description` written in third person?
- [ ] Does the description contain the specific trigger keywords a user would actually say?
- [ ] Is the description under 1,024 characters?
- [ ] Is the description slightly pushy to prevent under-triggering?

**C. Brain Quality**
- [ ] Are instructions sequenced with action verbs (Analyze, Extract, Validate), not vague terms (Help with, Look at)?
- [ ] Are there negative constraints with reasons?
- [ ] Is there at least one few-shot example for non-trivial output formats?
- [ ] Is the output format explicitly specified?
- [ ] Has filler been removed ("Please," "Try your best," "As an AI")?

**D. Map Quality**
- [ ] Are file references specific (exact paths, not "check the docs")?
- [ ] Are tool/script invocations present for deterministic operations?
- [ ] Is there a token management strategy (what to load, what to defer, what to ignore)?
- [ ] Are conditions for external data retrieval defined (when to search web, when to use local cache)?

**E. Progressive Disclosure**
- [ ] Is the body under 500 lines?
- [ ] Are heavy references externalized to `references/` with clear loading conditions?
- [ ] Does each external file have a one-line description of when to read it?

### Audit Output Format

Present findings as a structured assessment, not a generic summary:

```
## Skill Audit: [skill-name]

### Layer Separation: [Clean / Partial / Conflated]
[Evidence and specific findings]

### Metadata: [Strong / Adequate / Weak]
[Evidence and specific findings]

### Brain: [Strong / Adequate / Weak]
[Evidence and specific findings]

### Map: [Strong / Adequate / Weak]
[Evidence and specific findings]

### Progressive Disclosure: [Compliant / Needs Work]
[Evidence and specific findings]

### Recommended Changes (prioritized)
1. [Highest-impact change with rationale]
2. [Next change]
3. [Next change]
```

---

## Ecosystem Awareness

This skill operates alongside other skills in the user's ecosystem. When building or auditing:

- Check whether the new skill overlaps with existing skills. If it does, the description must disambiguate trigger conditions clearly.
- If the skill-pairing skill exists, consider whether the new skill is designed to pair with others and note this in the skill body.
- If a meta-router skill (like `philosopher`) exists, consider whether the new skill should be routable from it and flag this to the user.

Do not hard-depend on any specific ecosystem structure. Reference it when present; ignore it when absent.

---

## Reference Material

For the full theoretical framework on prompt engineering vs. context engineering, including comparison matrices, implementation strategies, and template variants, read `references/dual-layer-architecture.md`.
