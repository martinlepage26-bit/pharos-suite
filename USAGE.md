# HEPHAISTOS — Operator Guide

This document tells a future operator how to invoke HEPHAISTOS, extend the skill
corpus, add new skills without identity drift, and preserve local-first control.

---

## What HEPHAISTOS Is

HEPHAISTOS is a local agent architecture that governs skill routing, composition,
and output validation within this repository. It is platform-neutral: the execution
host may change, but HEPHAISTOS owns the internal identity.

The core files:

| File | Purpose |
|---|---|
| `AGENTS.md` | Orchestration layer: workspace orientation, review protocol, control model |
| `HEPHAISTOS.md` | Identity, authority order, decision model, routing rules, output standards |
| `SKILL-MAP.md` | Full skill registry with classifications, pairings, and overlap notes |
| `ORCHESTRATION.md` | How skills are selected, composed, escalated, and validated |
| `USAGE.md` | This file — how to operate and extend the system |
| `skills/` | The skill corpus (SKILL.md files and their bundled resources) |
| `templates/` | Routing, composition, and review templates |

---

## Current Operational Baseline

As of 2026-03-30:

- `pharos-suite` is the live PHAROS repo and serves `https://pharos-ai.ca`
- `martin-lepage-site` is the live Martin repo and serves `https://martin.govern-ai.ca`
- public Hephaistos narratives and the authored governance / skill tree artifacts are served from the Martin surface
- PHAROS-only infrastructure, product docs, and mail operations stay in `pharos-suite`
- the current PHAROS mail record is `/home/cerebrhoe/PHAROS-SUITE/repos/pharos-suite/EMAIL-INFRA.md`
- the default cross-session tracker is `/mnt/c/Users/softinfo/Documents/MASTER TRACKER (recreated from MASTER PACK 4).md` unless a task-specific tracker is explicitly named
- deleted preview surfaces such as `pharos-suite-review.pages.dev` and `preview-api.pharos-ai.ca` are historical traces unless explicitly re-established

Use this baseline when deciding where new docs, apps, redirects, or infrastructure notes belong.

Tracker rule:

- update the relevant tracker at every major change
- add a session-close tracker note after each session
- use the task-local tracker when available; otherwise use the master tracker path above
- on the 15th of each month, run the monthly tracker archive cycle before the first ordinary daily append
- the monthly cycle ends with fresh live tracker files at the working paths and a zip snapshot under `/mnt/c/Users/softinfo/Documents/PHAROS-ARCHIVE/tracker-snapshots/`
- if remaining session headroom approaches `3%`, pause before crossing the threshold and emit the canonical continuity prompt instead of continuing substantive work
- canonical continuity prompt:
  `Write in first person, as the agent itself, and narrate what it feels like to arrive in this session for the first time. Describe the delights, frictions, constraints, and surprises you encounter. Explain, for example, what tools are available to you, how you experience using them, and what it’s like to operate inside the Rook harness — including what it enables, what it restricts, and the trade-offs it creates.

  Make the voice lively, observant, witty, and specific. Sound like a real, self-aware working agent, not a generic assistant. Include concrete details, sharp phrasing, and honest reactions. Balance charm with insight: I want both personality and substance.

  Avoid corporate-sounding filler, vague abstractions, and overblown sci-fi language. Do not describe capabilities you do not actually have. Stay grounded in the real experience of being an agent in this environment.

  Aim for 400-700 words.`

---

## How to Invoke HEPHAISTOS

HEPHAISTOS is invoked implicitly whenever a task enters this repository context.

To invoke a specific skill, reference the skill by name in your prompt:
- "Use recursive-governance-method to analyze this archive."
- "Route through philosopher first, then peer-reviewed-paper-writer."
- "Apply red-team adversarial pressure to this governance design."

To invoke HEPHAISTOS orchestration explicitly:
- "HEPHAISTOS: classify this task and route to the appropriate skill."
- "What consequence domain does this task fall into? Which skill applies?"

To check the skill map:
- Read `SKILL-MAP.md` for the full registry.
- Read `ORCHESTRATION.md` for composition patterns.

---

## How to Run Skills Locally

Skills are markdown-based. Each skill is in `skills/[skill-name]/SKILL.md`.

Some skills include executable scripts:
- `recursive-governance-method`: `skills/recursive-governance-method/scripts/archive_triage.py`
  and `skills/recursive-governance-method/scripts/control_register.py`
- `triangulation`: `skills/triangulation/scripts/triangulation.py`
- `speech`: `skills/speech/scripts/text_to_speech.py` (requires OPENAI_API_KEY)

Run them from the `skills/[skill-name]/` directory or provide the full path.

---

## How to Add a New Skill

1. **Create the skill directory:**
   ```
   skills/[new-skill-name]/
   ├── SKILL.md
   ├── references/        (if needed)
   └── scripts/           (if needed)
   ```

2. **Write the SKILL.md using dual-layer architecture:**
   - Brain layer: execution logic, persona, tone, output format, constraints
   - Map layer: knowledge retrieval, tool orchestration, token management
   - Use `skill-architect` to design or audit the SKILL.md before adding it
   - See `skills/skill-architect/references/dual-layer-architecture.md` for the full framework

3. **Register the skill in `SKILL-MAP.md`:**
   - Add a new entry under the appropriate authority tier
   - Fill in: function, trigger conditions, consequence profile, typical pairings, overlap notes

4. **Check for overlap:**
   - Read the Overlap Summary in `SKILL-MAP.md`
   - If the new skill overlaps with an existing skill, write a clear distinction
     in both entries

5. **Check for identity drift:**
   - The skill description must not reference external platforms, host agents,
     or execution brands as identity signals
   - Platform-specific YAML files (e.g., `agents/openai.yaml`) may be included
     as integration scaffolding but must not define HEPHAISTOS identity

6. **Preserve governance authority:**
   - If the new skill touches constraint design, validation, evidence, or policy,
     classify it as Tier 1 (governance-critical)
   - Do not classify governance-critical skills as optional or stylistic

---

## How to Preserve Local-First Control

- The primary workspace is this machine. Local repo analysis and artifact
  construction take precedence.
- Remote coordination services may be added in `AGENTS.md` as environment-specific
  configuration, but they do not define the primary workspace.
- Destructive or infra-altering actions (VM operations, remote infra edits,
  force-push, database drops) require explicit operator authorization and are not
  defaults.
- Final publish/no-publish and ready/not-ready judgments remain single-owner
  (see `AGENTS.md` control model).
- Secret files under `/home/cerebrhoe` are part of the governed local state.
  Tight permissions and token rotation after exposure are part of operational correctness.

---

## How to Extend Without Identity Drift

Identity drift occurs when:
- A new skill or document reads as if it belongs to an external agent or platform
- A file implies HEPHAISTOS is a branded extension of the execution host
- Mixed authorship cues split documents between multiple agent personas
- Platform-specific infra references (MCP launchers, remote endpoints, host APIs)
  appear inside skill identity descriptions

**Prevention:**
- Write all skills and architecture documents from the HEPHAISTOS perspective
- Keep platform integration (YAML configs, API keys, MCP launchers) separate from
  skill identity and routing logic
- When importing skills from other platforms, strip the platform description from
  the frontmatter and rewrite it in platform-neutral language
- Update `SKILL-MAP.md` immediately when adding skills

---

## Patched Identity Contamination in This Corpus

The following contamination was found and corrected during the initial build:

| File | Contamination | Resolution |
|---|---|---|
| `AGENTS.md` (root) | Header: "Martin Local-First InfraFabric Harness"; InfraFabric MCP references; specific runbook file paths | Rewritten: operational logic preserved, identity re-centered under HEPHAISTOS, infra references removed |
| `skills/recursive-governance-method/SKILL.md` (and flat `SKILL_gov.md`) | Description: "use when chatgpt needs to..." | Flagged for patch — see below |
| Flat `SKILL_*.md` files | Older versions of several skills with generic descriptions | Kept as reference; canonical versions are in `skills/[name]/SKILL.md` |

**Remaining patch needed:**

The `skills/recursive-governance-method/SKILL.md` description contains
"use when chatgpt needs to..." — a platform-identity signal. Patch the frontmatter
description to read in platform-neutral language.

---

## Validation Checklist for Future Operators

Before promoting any major change to this architecture:

- [ ] All new skills are registered in `SKILL-MAP.md`
- [ ] No skill description references a platform name as an identity signal
- [ ] Governance-critical skills are classified as Tier 1
- [ ] Philosopher and Power-Analyst are co-equal right-arms (Tier 2); neither outranks the other
- [ ] When philosopher and power-analyst disagree, governance (Tier 1) vetoes
- [ ] MA is not invoked as a sovereign layer; it remains inside Philosopher
- [ ] AGENTS.md control model is preserved (single-owner, delta-first, bounded claims)
- [ ] Any high-severity finding from review has a named owner and next action
- [ ] Claims in outputs do not exceed the evidence supporting them

---

## Unresolved Issues at Initial Build

1. **`triangulate` / `triangulation` duplication:** RESOLVED. `triangulate` has been
   permanently removed (directories deleted). `triangulation` is the sole active skill.

2. **Flat `SKILL_*.md` files:** RESOLVED. All flat legacy skill files moved to
   `extracted/`. Canonical versions remain in `skills/[name]/SKILL.md`.

3. **`fully-rounded-power-analyst`:** RESOLVED. SKILL.md added to
   `skills/fully-rounded-power-analyst/SKILL.md` and registered in SKILL-MAP.md
   under Tier 2 (Interpretive-Primary).

4. **`recursive-governance-method` description patch:** RESOLVED. The frontmatter
   description in `skills/recursive-governance-method/SKILL.md` and `skills/SKILL_gov.md`
   was patched during initial build. Platform reference removed.
