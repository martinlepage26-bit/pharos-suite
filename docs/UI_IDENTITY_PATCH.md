# UI IDENTITY PATCH

Effective date: 2026-03-25

This patch updates PHAROS UI identity behavior across future design-bearing work.

## Patch Statement

Treat the first green band with the diamond logo and shiny soft orb on top as the canonical PHAROS identity composition.

## Operational Default

For all future PHAROS/AurorAI/CompassAI design-bearing outputs:

- default to canonical composition
- preserve the orb in full-logo uses
- avoid silent substitutions or style drift

## Prompt/Spec Injection Block

Add this block to relevant prompts/specs:

"Use the first green band with the diamond logo and the shiny soft ball of light on top as the official PHAROS logo. Preserve it literally unless derivative adaptation is explicitly requested."

## Scope of Files and Outputs

Apply this patch to:

- website/header specs and implementation tickets
- UI copy/design prompts
- deck/slide identity instructions
- app chrome/header guidance
- brand-related acceptance criteria in reviews

Source package references:

- `docs/MCP-UI Proxy.html`
- `docs/MCP-UI Proxy.source.mcp_apps(4).html`
- `docs/MCP-UI Proxy_files/saved_resource(5).html`

## Acceptance Check (Pass/Fail)

Pass only when:

1. first green band is used as canonical identity band
2. diamond remains the primary mark
3. shiny soft orb is preserved in full logo composition
4. any constrained adaptation is explicitly labeled derivative
