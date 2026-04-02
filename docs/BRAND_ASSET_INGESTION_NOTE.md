# BRAND ASSET INGESTION NOTE

Date: 2026-03-25

## Ingestion Record

- Canonical source label: `MCP-UI Proxy.html`
- User-provided source path: `C:\\Users\\softinfo\\Downloads\\MCP-UI Proxy.html`
- Local ingested file path: `/home/cerebrhoe/PHAROS-SUITE/repos/pharos-ai/docs/MCP-UI Proxy.html`
- Additional source file ingested: `/home/cerebrhoe/PHAROS-SUITE/repos/pharos-ai/docs/MCP-UI Proxy.source.mcp_apps(4).html`
- Companion payload directory ingested: `/home/cerebrhoe/PHAROS-SUITE/repos/pharos-ai/docs/MCP-UI Proxy_files/`
- Ingestion type in this session: governance/policy ingestion with preservation lock

## What Was Ingested as Canonical

The following was accepted as binding identity instruction:

- first green band is canonical
- diamond logo is canonical primary mark
- shiny soft orb above the diamond is part of canonical composition

## Extraction Boundary and Honesty Note

The local wrapper and companion payload are now readable.

Directly observed in source:

- In `MCP-UI Proxy.source.mcp_apps(4).html`:
  - line 7: `<title>MCP-UI Proxy</title>`
  - line 130: iframe source points to `./saved_resource(5).html`
- In `MCP-UI Proxy_files/saved_resource(5).html`:
  - line 1047: primary PHAROS mark SVG block begins
  - lines 1107-1109: outer diamond geometry is defined via rotated square/diamond forms
  - lines 1155-1157: top luminous beacon/orb circles are explicitly defined above the mark
  - line 1251 onward: site-header context sample appears in the same payload

Therefore:

- direct structural extraction of diamond + orb composition is now source-backed
- no redraw/rebuild was attempted
- preservation governance was still applied as canonical based on explicit user authority

Additional honesty boundary:

- the payload does not include an explicit semantic label like `first-green-band` for the canonical band object
- canonical mapping of the "first green band" remains user-authoritative and binding, with implementation references enforced by policy docs

## Additional Render Evidence (DevTools Capture)

The following rendered/computed values were captured from the canonical payload context and ingested as preservation evidence:

- layout alignment includes centered composition (`display: flex`, `flex-direction: column`, center-aligned hero composition)
- background image is radial gradient:
  - `radial-gradient(at 50% 45%, rgb(21, 32, 40) 0%, rgb(12, 20, 24) 55%, rgb(8, 14, 18) 100%)`
- border radius values:
  - top-left/right `12px`
  - bottom-left/right `12px`
- hero spacing and sizing snapshot:
  - `padding-top: 60px`
  - `padding-right: 20px`
  - `padding-bottom: 40px`
  - `padding-left: 20px`
  - `width: 796px`
  - `height: 560px`
- rendered font evidence:
  - `Anthropic Sans Text` (`AnthropicSansText-Regular`)
  - `Anthropic Sans Text Medium` (`AnthropicSansText-Medium`)

These values are recorded as extraction evidence only. They do not weaken or replace the binding canonical identity rule set by user instruction.

## Extended Computed-Style Snapshot (User-Supplied)

An extended computed-style dump was supplied and ingested as provenance evidence for the rendered hero/container context.

Key markers from that dump:

- `display: flex`
- `align-items: center`
- `background-image: radial-gradient(at 50% 45%, rgb(21, 32, 40) 0%, rgb(12, 20, 24) 55%, rgb(8, 14, 18) 100%)`
- `border-*-radius: 12px`
- `width: 796px`
- `height: 560px`
- `padding-top: 60px`, `padding-right: 20px`, `padding-bottom: 40px`, `padding-left: 20px`
- rendered fonts:
  - `Anthropic Sans Text` / `AnthropicSansText-Regular`
  - `Anthropic Sans Text Medium` / `AnthropicSansText-Medium`

Interpretation boundary:

- this appears to describe the current rendered hero/container state rather than a semantically labeled `first-green-band` node
- canonical selection of the official first green band remains user-authoritative and binding

## Extended Computed-Style Snapshot B (User-Supplied)

A second computed-style dump was supplied and ingested as a distinct render-context sample.

Key markers from this second dump:

- `display: block`
- `background-image: none`
- `border-radius: 0px` on all corners
- `width: 796px`
- `height: 1313px`
- `padding: 0px`
- rendered font evidence remains `Anthropic Sans Text` / `AnthropicSansText-Regular` (higher glyph count observed)

Interpretation boundary:

- this snapshot likely corresponds to a broader wrapper/content region, not the canonical hero-band node
- it should not be used to override canonical band/glow composition constraints
- working interpretation: this layer is likely ECHO runtime/widget CSS rather than PHAROS canonical mark CSS

## Runtime Iframe Evidence (User-Supplied DOM Inspection)

Live localhost DOM inspection was supplied for the proxy iframe in:

- `http://localhost:8088/docs/MCP-UI%20Proxy.html`

Directly observed runtime facts:

- iframe `outerHTML` includes:
  - `sandbox="allow-scripts allow-same-origin allow-forms"`
  - `allow="clipboard-write *"`
  - `src="./MCP-UI Proxy_files/saved_resource(5).html"`
- resolved runtime `src`:
  - `http://localhost:8088/docs/MCP-UI%20Proxy_files/saved_resource(5).html`
- `contentDocument` and `contentWindow` are present and connected
- `sandbox` token list confirms exactly three sandbox permissions:
  - `allow-scripts`
  - `allow-same-origin`
  - `allow-forms`

Interpretation:

- this confirms the operational proxy -> payload handoff at runtime
- canonical visual extraction should continue to anchor on `saved_resource(5).html` for direct logo composition evidence

## Integrity Position

This ingestion is preservation-first, not redesign.
Future extraction or exports must remain additive and must not change the canonical composition rules already defined.
