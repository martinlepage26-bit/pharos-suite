# PHAROS Frontend Rebuild Plan

## Audit Snapshot
- Stack: React 18 + `react-router-dom` on CRA/CRACO.
- Styling: mixed global CSS (`App.css`, `site.css`, generated Tailwind) with duplicated theme tokens and overlapping patterns.
- Routing: broad public surface with many legacy routes; homepage copy is dense and lacks a crisp conversion-first sequence.
- Content source: mostly hardcoded per-page copy blocks; no single shared messaging system.
- Deployment: Cloudflare Pages (`npm run build` + static route generation script).
- Quality risks: oversized global styles, inconsistent hierarchy, repetitive copy, and weak first-impression conversion flow.

## Rebuild Objectives
1. Rebuild public shell and homepage into a premium, minimal, conversion-driven experience.
2. Sharpen information architecture: `hero -> value proof -> capabilities/services -> workflow -> credibility -> FAQ -> final CTA`.
3. Establish a coherent design system (typography, spacing, surfaces, buttons, forms, motion, responsive behavior).
4. Improve accessibility and performance fundamentals (focus states, contrast, reduced motion, semantic structure).
5. Remove stale/dead UI code and legacy visual artifacts, including any bottom-page builder tags.
6. Preserve truthful claims; mark content gaps explicitly.

## Implementation Steps
1. Replace global visual shell (`Navbar`, `Footer`, core CSS tokens/layout primitives).
2. Rebuild primary conversion pages (`Home`, `Services`, `About`, `Research`, `ConceptualMethod`, `FAQ`, `Connect`, `Assurance`) using the new system.
3. Keep specialized operational routes (admin, portals, tools, game) functional while aligning shell consistency.
4. Remove obsolete CSS/components no longer referenced by rebuilt pages.
5. Add `REBUILD_NOTES.md` with what changed, rationale, and open content gaps.
6. Validate with available commands (`npm run build`, `npm test -- --watch=false`) and capture results.
