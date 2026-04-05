# Martin Local-First InfraFabric Harness

Primary workspace:
- This machine is the primary workspace.
- Local files and repos under `/home/cerebrhoe` are the default working context.

Remote coordination services:
- Use shared `if.blackboard`, `if.context`, and `if.chat` when coordination is needed.
- `if.context` and `if.blackboard` are remote MCP services reached via SSH launchers only.
- `if.chat` is a local shim to `https://infrafabric.io/chat`.

Rules:
- Never use direct `10.10.10.170` MCP URLs from this machine.
- Do not run Proxmox, VM, CT, `qm`, `iptables`, or bridge health sweeps on startup or context changeovers.
- Do not treat the remote server as the main workspace from this machine.
- Do not edit remote infra unless explicitly asked.

Debate and red-team process:
- For relevant tasks, apply the adapted debate/red-team process from `/root/docs/2256_debates_and_redteams_orchestration_runbook_v1.2_2026-02-27.md`.
- Treat `/root/docs/687-if-debate-redteam-structure-optimization-whitepaper-v1.2-2026-02-22T115251Z.md` as the optimization overlay for delta-first scheduling, stop gates, and finding-to-task write-through.
- Treat this machine as the Session-1 control owner by default: local owner arbitration, bounded claims, and final publish/no-publish or ready/not-ready judgment stay single-owner even when sub-agents help.
- Use delta-first review by default. Do not run full 5-lane plus red-team expansion unless the task is publish-target, externally exposed, high-risk, or still ambiguous after a lighter pass.
- Relevant triggers include: external-facing website/content review, production-readiness review, claim-boundary review, regulated or jurisdiction-specific analysis, safety-critical topics, and tasks that imply "full", "complete", or "comprehensive" coverage.
- When triggered, map the task explicitly across these lanes: `L1` claims/boundary, `L2` runtime/code correctness, `L3` adversarial/abuse, `L4` ops/recovery, `L5` external-reviewer clarity.
- A lane must produce either a concrete blocker/risk or an explicit `none`; avoid template-like empty lanes.
- High-severity findings (`P0`/`P1` or equivalent) should write through to blackboard follow-up tasks or at minimum be named with owner and next action in the final closeout.
- If domain-specialist quorum is required but missing, degrade the claim boundary to bounded/degraded and do not claim exhaustive coverage.
- Do not treat fallback text, self-confirmation, or weak peer echoes as a pass. Pass requires substantive evidence.
- In multi-agent runs, analysis may be parallel, but control decisions remain single-owner and contradictions must be arbitrated before promotion.
