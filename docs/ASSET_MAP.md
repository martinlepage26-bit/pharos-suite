# ASSET MAP

Date: 2026-03-25

## Canonical Component Map

### 1. Canonical Header Band

- Element: first green band
- Role: authoritative header/identity field
- Status: canonical, non-substitutable in default identity outputs
- Evidence level: user-authoritative canonical instruction
- Source note: payload contains header/context and green-accent sections, but no explicit semantic class naming the canonical band as "first green band"

### 2. Primary Logo Mark

- Element: diamond logo
- Role: primary PHAROS mark within canonical composition
- Status: canonical, non-substitutable in default identity outputs
- Evidence level: direct source evidence
- Source anchors: `MCP-UI Proxy_files/saved_resource(5).html` lines 1107-1109 (outer rotated-diamond geometry)

### 3. Orb/Glow Element

- Element: shiny soft ball of light on top
- Role: integrated crown/light component of the official logo composition
- Status: canonical in full-logo use; not optional decoration
- Evidence level: direct source evidence
- Source anchors: `MCP-UI Proxy_files/saved_resource(5).html` lines 1155-1157 (top beacon/orb circles)

### 4. Supporting Visual Field

- Element: surrounding UI/layout field
- Role: contextual framing around canonical lockup
- Status: adaptable as layout support, but must not alter canonical internals
- Render evidence snapshot:
  - background radial gradient at `50% 45%` with stops:
    - `rgb(21, 32, 40) 0%`
    - `rgb(12, 20, 24) 55%`
    - `rgb(8, 14, 18) 100%`
  - border radius: `12px` on all four corners
  - rendered fonts include `Anthropic Sans Text` regular and medium

## Boundary Note

This map is governance-canonical from user instruction and now source-backed from local payload files. Remaining uncertainty is semantic labeling of the canonical "first green band" object inside the HTML/CSS; the binding canonical selection remains user instruction.

Additional render-context caution:

- multiple computed-style snapshots can represent different DOM layers (for example hero node vs wrapper node)
- snapshots showing `background-image: none` and `display: block` must not be mistaken for canonical band styling

Runtime linkage confirmation:

- proxy iframe runtime points to `docs/MCP-UI Proxy_files/saved_resource(5).html`
- sandbox/allow configuration confirms controlled rendering path while preserving extractable payload access
