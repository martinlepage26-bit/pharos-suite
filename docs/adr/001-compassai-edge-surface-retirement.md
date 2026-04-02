# ADR 001 — retire CompassAI standalone edge surface

Status: accepted
Date: 2026-03-30

## Context

CompassAI previously carried a standalone Cloudflare Worker edge surface through `compassai/wrangler.toml` and `compassai/src/index.ts`. That path made sense when the product boundary was unsettled and the team was still testing whether CompassAI should expose its own browser-facing or edge-facing entrypoint. The post-consolidation repair pass resolved that ambiguity. The binding authority now says the PHAROS shell is the only validated browser surface, while CompassAI remains a contained governance product layer behind the PHAROS surface plus its backend API. Keeping the Worker scaffold in place after that decision would preserve a false deployability signal, invite drift between shell behavior and a dead edge surface, and mislead operators into treating unresolved TODO files as a valid runtime path.

## Decision

Retire the standalone CompassAI edge surface completely. The consolidation repair removed `compassai/wrangler.toml` and `compassai/src/index.ts` and documented the resulting authority state in `compassai/README.md` and `docs/specs/com-aur/00a-authority-and-transition-status.md`. CompassAI is now treated as:

- a live backend runtime in `compassai/backend/server.py`
- a governed product layer presented publicly only through PHAROS shell routes and architecture-reference pages

No separate Worker or browser deployment path is currently authoritative.

## Consequences

This closes off accidental redeployment of an incomplete edge surface and reduces ambiguity for operators, reviewers, and future implementation work. It also forces future re-introduction of any standalone CompassAI edge/runtime path to happen explicitly through a new tracked authority decision rather than by reviving stale files. The trade-off is that quick edge experiments now require a new design and governance checkpoint instead of reusing old scaffolding, but that is preferable to shipping from a misleading, non-authoritative surface.
