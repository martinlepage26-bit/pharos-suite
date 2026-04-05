---
name: skill-pairing
description: "Choose and sequence two Codex skills for one user request, carrying the output of the first into the second without rewriting either skill's core logic. Use when a task naturally splits into two distinct skill domains or stages, such as analysis then drafting, cleanup then synthesis, or strategy then execution. Do not use when one skill is sufficient, when the needed skills are unavailable, or when the task would be clearer as a direct single-pass response."
---

# Skill Pairing

Act like an orchestrator, not a replacement for the paired skills.

Use this skill to coordinate two existing skills in sequence. Preserve the purpose of each skill, keep the handoff explicit, and avoid inventing new workflows inside the orchestrator.

## When to use

Use this skill when:
- the task clearly breaks into two stages
- each stage maps well to a different existing skill
- the second stage benefits from structured output produced by the first

Do not use this skill when:
- one skill can handle the full request cleanly
- the pairing would add ceremony without improving the result
- one or both required skills do not exist in the current environment

## Pairing workflow

1. Identify the user's real end goal.
2. Decide whether two skills are actually needed.
3. Choose the smallest useful pair of existing skills.
4. State the pair and the order briefly.
5. Run the first skill for its specialized output.
6. Create a compact handoff artifact from that output.
7. Run the second skill using the handoff artifact as its input.
8. Return the final result, with a short note on what each skill contributed if helpful.

## Selection rules

- Pick two skills with clearly different jobs.
- Prefer the pair with the least overlap.
- Choose the first skill to reduce ambiguity or prepare material.
- Choose the second skill to transform, polish, or apply the prepared material.
- If more than two skills seem necessary, say so instead of forcing a weak pair.

## Handoff standard

The handoff between skills should be:
- compact
- faithful to the first skill's result
- structured enough for the second skill to use immediately

When useful, format the handoff as:
- brief task summary
- key outputs from skill one
- constraints to preserve
- exact question for skill two

Do not quietly change the meaning of the first skill's output during handoff.

## Coordination rules

- Do not rewrite a skill's internal method unless the skill itself requires adaptation.
- Do not claim a skill was used if it was not actually the right fit.
- If the first skill produces uncertainties, pass those forward instead of hiding them.
- If the second skill exposes a gap in the first output, note it clearly.

## Typical pair patterns

- analysis -> writing
- diagnosis -> revision
- strategy -> implementation
- extraction -> synthesis
- outline -> polish

## Example pairings

- `qualitative` -> `peer-reviewed-paper-writer`
  Use when interview or thematic analysis needs to become publication-ready prose.

- `humanize` -> `brand-identity-system`
  Use when rigid policy language needs to be made more human before shaping a trust-sensitive brand message.

- `brand-identity-system` -> `novelist`
  Use only when the user is building a fictional brand, world, or narrative identity that needs both strategy and story voice.

Adjust the pair to the actual installed skills and the user's goal.

## Failure cases

Stop and explain instead of forcing the workflow if:
- no valid second skill exists
- the first output is too weak to hand off
- the request is better served by one direct answer

## Quality gate before delivering

Check:
- was two-skill coordination actually necessary
- are the chosen skills distinct and complementary
- is the handoff explicit and faithful
- does the final answer reflect both stages rather than only the second
