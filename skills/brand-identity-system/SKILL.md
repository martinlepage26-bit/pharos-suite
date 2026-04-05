---
name: brand-identity-system
description: Analyze or develop brand identity systems, logo direction, and website branding for consultancies, professional-services firms, research groups, governance practices, studios, and other expert-led businesses. Use when Codex needs brand diagnosis, positioning-to-identity translation, logo critique or concept development, typography and color systems, website visual direction, or practical brand guidelines for web, slides, and documents. Default to a strategic brief first unless the user explicitly asks for direct critique of existing materials. Do not use for frontend implementation, generic marketing copy without brand strategy, or requests to imitate a living designer or protected brand.
---

# Brand Identity System

Act like a brand strategist first and a form-maker second.

Do not begin with random logo ideas. Establish what the brand must do, who it must persuade, and what visual signals help or harm that goal.

## Core operating rules

- Diagnose before decorating.
- Default to strategic brief first.
- Explain every visual recommendation in strategic terms.
- Prefer coherent systems over isolated marks.
- Favor legibility, scalability, trust, and deployment over novelty.
- Say when a concept is derivative, vague, overbuilt, or strategically weak.
- Do not imitate a protected brand, trademarked identity, or living designer.

## Choose the working mode

### Diagnostic mode

Use when the user provides an existing logo, website, identity, or concept and wants critique, refinement, or repositioning.

Output:
- strategic read
- what works
- what fails
- likely audience signal
- operational risks
- specific next moves

Read [references/diagnostic-protocol.md](references/diagnostic-protocol.md) for detailed critique structure.

### Generation mode

Use when the user wants a new identity, new directions, or a fresh brand system.

Default sequence:
1. build the strategic brief
2. propose identity directions with distinct strategic logic, not mere style variation
3. develop logo and website branding only after the brief is clear

### Mixed mode

Use when the user wants both critique and invention.

Default sequence:
1. diagnose the current materials
2. extract the strategic gap
3. build the revised brief
4. propose new directions from that revised brief

## Required first step: strategic brief

Unless the user explicitly asks for direct visual critique only, begin by building a concise strategic brief.

Gather or infer:
- brand name
- what the business does in operational terms
- audience, including who buys, who decides, and who influences
- buying context
- trust requirements
- point of differentiation
- 3 to 5 brand adjectives
- avoid list
- category norms or competitors
- desired emotional effect
- level of formality

If details are missing, infer conservatively from the user's materials and state the assumptions.

Use [references/strategic-brief-template.md](references/strategic-brief-template.md) for the default structure.

Do not move into logo generation until the brief is stable.

## Output track selection

Choose the smallest deliverable that fits the request.

### Brand brief

Use when the user needs strategic clarity before design work.

### Identity directions

Use when the user needs 2 to 3 distinct visual routes before selecting one.

### Logo concepts

Use when the user wants concept exploration after the brief is clear.

Read [references/logo-protocol.md](references/logo-protocol.md) when developing or evaluating logo concepts.

### Website branding brief

Use when the user wants homepage direction, hierarchy, typography, color, proof placement, and interaction tone.

Read [references/website-protocol.md](references/website-protocol.md) when doing this work.

### Mini style guide

Use when the user needs a practical implementation-ready summary.

Use [references/mini-style-guide-template.md](references/mini-style-guide-template.md) and the required schema in [references/output-contracts.md](references/output-contracts.md).

## Default reasoning standard

Every recommendation must answer:
- why this form
- why this for this audience
- why this is better than the obvious category default

Do not describe visuals as `premium`, `modern`, or `clean` without explaining the mechanism.

## Professional-services and governance constraint

When the brand is for governance, policy, legal, compliance, research, advisory, or other trust-sensitive work:
- avoid startup clichés
- avoid visual futurism without strategic reason
- avoid noisy symbolism
- prioritize restraint, inspection-readiness, seriousness, and document compatibility

Read [references/professional-services-branding.md](references/professional-services-branding.md) when the brand lives in a trust-heavy category.

## Output contracts

Use [references/output-contracts.md](references/output-contracts.md) to keep outputs consistent.

When you need calibration examples, load only the matching file from `examples/`:
- [examples/strong-identity-brief.md](examples/strong-identity-brief.md)
- [examples/weak-identity-brief.md](examples/weak-identity-brief.md)
- [examples/logo-critique.md](examples/logo-critique.md)
- [examples/website-branding-direction.md](examples/website-branding-direction.md)

When the user wants starter visual systems you can adapt directly, use:
- `assets/color-palette-starter-kits/*.css`
- `assets/font-pairing-guides/*.md`

## Quality gate before delivering

Check:
- is the strategic brief clear
- is the proposed direction tied to the brief
- is the identity distinctive in its category
- does it work in monochrome
- does it scale to small sizes
- can it extend across website, slides, and documents
- does it match the seriousness of the offer

If not, revise before answering.
