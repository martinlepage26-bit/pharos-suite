# REBUILD NOTES

## What Changed
- Rebuilt public marketing and trust pages into a unified premium shell using the new design system:
  - `Home`, `Services`, `ServiceMenu`, `About`, `ConceptualMethod`, `Research`, `FAQ`, `Connect`, `Assurance`, `Cases`, `Library`, `Tool`.
- Kept route compatibility and smoke-test expectations (`data-testid` coverage and public aliases).
- Preserved truthful boundary posture and removed inflated/fictional public proof language on the cases surface.
- Upgraded global metadata and no-JS fallback in `public/index.html` for stronger SEO/trust clarity and visual consistency.
- Added dedicated legal trust routes:
  - `/privacy` (`src/pages/Privacy.js`)
  - `/terms` (`src/pages/Terms.js`)
  - linked from the footer and included in static route generation and sitemap coverage.
- Added a reusable social preview asset and linked it in OG/Twitter metadata:
  - `public/og/pharos-social-card.svg`
  - `public/index.html` (`og:image`, `twitter:image`, and alt metadata)
- Extended global CSS primitives in `src/App.css` for:
  - coherent tokens, spacing, typography, CTAs,
  - accessible focus styles,
  - reduced motion behavior,
  - readiness results drawer,
  - compatibility styles for remaining operational portal pages.
- Removed legacy/dead artifacts and unused components:
  - `src/components/TypographyPolish.js`
  - `src/components/StarterKitCTA.js`
  - `src/components/HeroRadiantEmblem.js`
  - `src/components/MeridianField.js`
  - `src/components/RichTextContent.js`
  - `public/normalized-results.html`
  - `public/tracker_dashboard.js`
- Removed dead legacy CSS surfaces that were no longer imported anywhere in the live frontend.
- Scoped non-shell CSS more tightly so `src/game.css` is loaded only by `src/pages/Game.js` instead of by the global app shell.
- Removed legacy bottom-page/build-trail tags/artifacts (including prior rebuild trail content in public files).

## Design Principles Applied
- Mechanism-first messaging: emphasize deterministic governance, thresholds, decision rights, and evidence paths.
- Conversion-first IA: hero -> value/proof -> service routes -> workflow -> trust -> FAQ/objections -> CTA.
- Premium restraint: high contrast, sparse copy, structured whitespace, consistent visual rhythm.
- Trust discipline: explicit non-claims, accountable owner/date metadata, transparent escalation to human review.
- Accessibility baseline: semantic sections, keyboard-safe interactions, visible focus, reduced-motion support.

## Components and Areas Refactored
- Shell:
  - `src/components/Navbar.js`
  - `src/components/Footer.js`
  - `src/App.js`
  - `src/App.css`
  - `src/index.css`
- Public pages:
  - `src/pages/Home.js`
  - `src/pages/Services.js`
  - `src/pages/ServiceMenu.js`
  - `src/pages/About.js`
  - `src/pages/ConceptualMethod.js`
  - `src/pages/Research.js`
  - `src/pages/FAQ.js`
  - `src/pages/Connect.js`
  - `src/pages/Assurance.js`
  - `src/pages/Cases.js`
  - `src/pages/Library.js`
  - `src/pages/Tool.js`
- SEO/metadata:
  - `public/index.html`

## Open Content Gaps Needing Your Input
- Finalized proof artifacts you want public (if any) beyond generic route descriptions.
- Preferred public claim boundary wording for jurisdictions outside Canada.
- Confirm if any public case narratives can be safely published with anonymized but specific evidence.
- Confirm if legal counsel wants stricter jurisdiction-specific language on privacy and terms routes.

## Validation Run
- `npm run build` -> PASS
- `npm test -- --watch=false` -> PASS (all smoke tests)
- `npm run validate:boundaries` -> PASS

## Follow-Up Recommendations
- Introduce lightweight analytics event naming for CTA funnel steps (hero CTA, tool completion, booking submit).
- Add route-level `lastmod` dates in `sitemap.xml` once your publishing cadence is stable.
- Consider a PNG/WebP fallback for social cards if any platform refuses SVG Open Graph images.
