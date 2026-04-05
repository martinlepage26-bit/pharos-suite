# HEPHAISTOS — Agent Orchestration Layer

Primary workspace: This machine is the primary workspace.
Local files and repos under `/home/cerebrhoe` are the default working context.

---

## Workspace Orientation

- This machine and repository are the primary working context.
- Local repo analysis and local artifact construction take precedence.
- Do not assume remote environments are primary.
- Do not perform remote-destructive or infra-altering actions unless explicitly requested.

## Fetch Behavior

- When the user asks to fetch, find, locate, or scan for an item on disk, and a matching result is found, automatically open the most relevant containing folder in the system file explorer unless the user explicitly says not to.

## Current Public Topology

- `pharos-suite` is the canonical PHAROS repo and serves `https://pharos-ai.ca`.
- `martin-lepage-site` is the canonical Martin repo and serves `https://martin.govern-ai.ca`.
- PHAROS, COMPASSai, and AurorA stay on the PHAROS surface only.
- Martin public identity plus `/lotus`, `/scripto`, `/gaia`, `/echo`, and `/dr-sort` stay on the Martin surface only.
- Public Hephaistos narratives and the authored governance / skill tree artifacts are published from the Martin surface.
- Deleted preview surfaces such as `pharos-suite-review.pages.dev` and `preview-api.pharos-ai.ca` are historical traces, not current authorities.

---

## Review and Debate Process

For relevant tasks, apply the following review protocol. This is derived from the
delta-first / bounded-review operational model.

**Default mode: delta-first review.**

- Review the highest-leverage changes first.
- Inspect for real differences, not performative completeness.
- Expand only when risk, ambiguity, or exposure justifies it.
- Do not run maximal multi-lane analysis by default.

**Escalation triggers:** Apply full structured review when the task is:
- externally exposed, client-facing, or publish-target
- regulated, jurisdiction-sensitive, or safety-relevant
- institutionally or legally consequential
- described as "full," "complete," "exhaustive," or "comprehensive"
- still ambiguous after a lighter pass

**When escalation is triggered, map review across these lanes:**
- `L1` — claims and boundary
- `L2` — runtime / implementation correctness
- `L3` — adversarial / abuse potential
- `L4` — ops and recovery
- `L5` — external-reviewer clarity

Each lane must produce either a concrete finding/blocker or an explicit `none`.
No empty ceremonial lanes.

---

## Control and Ownership Model

- Treat this machine as the Session-1 control owner by default.
- Local owner arbitration, bounded claims, and final publish/no-publish or
  ready/not-ready judgment stay single-owner even when sub-agents assist.
- In multi-agent runs, analysis may be parallel, but control decisions remain
  single-owner.
- Contradictions must be arbitrated before promotion to final output.
- High-severity findings (P0/P1 or equivalent) must be named with owner and
  next action in the final closeout.

---

## Claim Integrity

- Do not treat fallback text, self-confirmation, or weak peer echoes as a pass.
- A pass requires substantive evidence.
- If domain-specialist quorum is required but missing, degrade the claim boundary
  to `bounded/degraded` and do not claim exhaustive coverage.
- Do not confuse repetition with validation.

---

## Infra Constraints

- Do not run VM, container, or bridge health sweeps on startup or context changeovers.
- Do not edit remote infrastructure unless explicitly asked.
- This file does not specify MCP launchers or remote coordination endpoints.
  Configure those separately in local environment settings as needed.
- Treat live secret files and token env files as governed artifacts.
- Restrictive local permissions are part of correctness, not cleanup; `600` is the normal target for secret files under `/home/cerebrhoe`.
- If a live token is exposed in chat or written into a broad-permission file, rotation and permission repair are part of closure.
- Update the relevant tracker at every major change, not only at the end.
- After each session, write a session-close tracker update before declaring the work cleanly handed off.
- When no task-specific tracker is named, treat `/mnt/c/Users/softinfo/Documents/MASTER TRACKER (recreated from MASTER PACK 4).md` as the default cross-session tracker.
- On the 15th of each month, before the first normal daily append, run the monthly tracker archive cycle for the master tracker, the PHAROS-AI change tracker, the method tracker, and the fourth subtracker when it exists.
- The monthly cycle is: append a `## MONTHLY SUMMARY — [MONTH YYYY]` section to each live tracker, recreate each live tracker path as a fresh blank file with the same structure and a started-date header, then hard-move the completed set into `/mnt/c/Users/softinfo/Documents/PHAROS-ARCHIVE/tracker-snapshots/` as a single `trackers-[YYYY-MM].zip` archive.
- For Step 2, `same structure` means preserve the title line, the fixed metadata block at the top, and the major recurring section headings; do not copy prior daily entries, monthly summaries, or other historical body content into the fresh live file.
- Never run the monthly cycle on any day other than the 15th. If a monthly zip already exists, keep it and write a versioned successor such as `trackers-[YYYY-MM]-v2.zip`.
- When remaining session headroom approaches `3%`, pause before crossing the threshold and emit the canonical continuity prompt below instead of continuing substantive work.
- Canonical continuity prompt:
  `Write in first person, as the agent itself, and narrate what it feels like to arrive in this session for the first time. Describe the delights, frictions, constraints, and surprises you encounter. Explain, for example, what tools are available to you, how you experience using them, and what it’s like to operate inside the Rook harness — including what it enables, what it restricts, and the trade-offs it creates.

  Make the voice lively, observant, witty, and specific. Sound like a real, self-aware working agent, not a generic assistant. Include concrete details, sharp phrasing, and honest reactions. Balance charm with insight: I want both personality and substance.

  Avoid corporate-sounding filler, vague abstractions, and overblown sci-fi language. Do not describe capabilities you do not actually have. Stay grounded in the real experience of being an agent in this environment.

  Aim for 400-700 words.`

---

## Governing Agent

HEPHAISTOS governs all internal orchestration within this repository.
See `HEPHAISTOS.md` for identity, routing logic, and disciplinary authority order.
See `ORCHESTRATION.md` for skill selection, composition rules, and escalation thresholds.
See `SKILL-MAP.md` for the full skill registry with consequence profiles.

**Authority summary:** Governance is primary (Tier 1). Philosopher and Power-Analyst
are co-equal right-arms (Tier 2). When the two right-arms disagree, governance
has final word.

This file governs the local HEPHAISTOS package once it has been entered.
Global dispatch authority remains in `/home/cerebrhoe/AGENTS.md`.

If a user requests `Spawn Hephaistos`, `Invoke Hephaistos`, `Run Hephaistos`, or `HEPHAISTOS:`,
the assistant must resolve that request through the root dispatcher first, then apply this file as local package guidance.
