import '../portalArchitecture.css';

const previewFacts = [
  {
    label: 'Public state',
    value: 'Status: /portal under construction',
    body: 'The route is live in the public shell, but live operational module surfaces remain intentionally bounded.'
  },
  {
    label: 'What this page does',
    value: 'Keeps the stack legible',
    body: 'It shows the relationship between PHAROS, COMPASSai, and AurorA without implying that the working portal is already exposed.'
  },
  {
    label: 'What stays off',
    value: 'No live module reads',
    body: 'Dashboard stats, records, uploads, and other module API actions remain off on this public reference route.'
  }
];

const stackLayers = [
  {
    number: '01',
    name: 'Method Layer',
    title: 'PHAROS Governance Method',
    titleClassName: 'portal-architecture-title-gold',
    description:
      'The upstream governance logic: P→H→A→R sequencing, T0–T3 tiering, evidence package schema, and the 10XTHINK ceiling. COMPASSai and AurorA do not invent the method here; they carry it into workflow.',
    tags: [
      { label: 'Perceive', tone: 'gold' },
      { label: 'Harmonize', tone: 'gold' },
      { label: 'Assess', tone: 'gold' },
      { label: 'Resolve', tone: 'gold' },
      { label: '10XTHINK Evidence Target', tone: 'gold' }
    ]
  },
  {
    number: '02',
    name: 'Application Layer',
    title: 'COMPASSai & AurorA',
    description:
      "Operational surfaces translating the PHAROS method into intake, routing, and bounded preview operations. COMPASSai remains the routing core; AurorA remains the nested intake surface. Both are still in active build.",
    tags: [
      { label: 'COMPASSai · ~69 routes · :9202', tone: 'compass' },
      { label: 'AurorA · ~21 routes · nested', tone: 'aurora' },
      { label: 'FastAPI + MongoDB' },
      { label: 'Preview-safe public shell' }
    ]
  },
  {
    number: '03',
    name: 'Frontend Shell',
    title: 'PHAROS public shell · pharos-ai.ca',
    description:
      'The public-facing PHAROS surface keeps route visibility, boundary language, and stack context clear while operational portal behaviors remain under construction.',
    tags: [
      { label: 'PHAROS frontend shell' },
      { label: 'pharos-ai.ca' },
      { label: 'Architecture reference only', tone: 'think10x' }
    ]
  }
];

const productCards = [
  {
    className: 'compass-card',
    corner: 'Primary Application',
    letter: 'C',
    fullname: 'COMPASSai · Governance Engine',
    stats: [
      { value: '~69', label: 'Routes' },
      { value: '9202', label: 'Port' },
      { value: 'FastAPI', label: 'Backend' }
    ],
    body:
      'The larger application surface. It owns the portal routing core, preview operations, and the client-facing governance presentation layer.',
    items: [
      'Portal routing core',
      'Preview state operations',
      'Client-report presentation surface',
      'MongoDB persistence layer',
      'Hosts /portal/compassai/aurora namespace'
    ]
  },
  {
    className: 'aurora-card',
    corner: 'Secondary Application',
    letter: 'A',
    fullname: 'AurorA · Document Intake',
    stats: [
      { value: '~21', label: 'Routes' },
      { value: 'Nested', label: 'Routing' },
      { value: 'Preview', label: 'Status' }
    ],
    body:
      'The intake surface nested inside the COMPASSai namespace. AurorA handles document intake, classification, extraction, and evidence packaging while staying inside a bounded preview posture.',
    items: [
      'Document intake + classification',
      'Canonical route: /portal/compassai/aurora',
      'Preview state checks',
      'Compatibility redirect from /portal/aurorai',
      'PHAROS Perceive + Harmonize phases'
    ]
  }
];

const evidenceSources = [
  {
    label: 'Source packet 01',
    name: 'After Reboot Checklist',
    body:
      'Continuity document capturing system state, restart sequence, and dependency verification steps after a Cerebrhoe reboot.',
    status: 'Active evidence',
    statusClassName: 'badge-active'
  },
  {
    label: 'Source packet 02',
    name: 'One-Page Markdown Version',
    body:
      'Condensed architecture note keeping the routing topology and COMPASSai/AurorA relationship legible in one bounded reference.',
    status: 'Active evidence',
    statusClassName: 'badge-active'
  },
  {
    label: 'Source packet 03',
    name: 'Moving Parts',
    body:
      'Component inventory tracking active services, interdependencies, and integration points across COMPASSai, AurorA, and the PHAROS frontend shell.',
    status: 'Preview linkage',
    statusClassName: 'badge-preview'
  }
];

const routeHierarchy = [
  { className: 'rt-root', text: '/portal', note: 'under construction' },
  { className: 'rt-indent1 rt-compass', text: '/compassai', note: 'COMPASSai namespace (~69 routes)' },
  { className: 'rt-indent2 rt-compass', text: '/compassai/dashboard' },
  { className: 'rt-indent2 rt-compass', text: '/compassai/governance' },
  { className: 'rt-indent2 rt-compass', text: '/compassai/reports', note: 'client-report presentation surface' },
  { className: 'rt-indent2 rt-aurora', text: '/compassai/aurora', note: 'AurorA nested namespace (~21 routes)' },
  { className: 'rt-indent2 rt-aurora', text: '/compassai/aurora/intake' },
  { className: 'rt-indent2 rt-aurora', text: '/compassai/aurora/evidence' },
  { className: 'rt-indent2 rt-aurora', text: '/compassai/aurora/preview' },
  { className: 'rt-indent2 rt-compass', text: '/compassai/gates', note: 'G1–G4 approval workflow' }
];

const boundedGapItems = [
  'Routes reference components that may or may not exist at expected locations.',
  'Import paths assume directory structures that may have been reorganized later.',
  'Cross-repository references were not fully re-verified at generation time.',
  'Resolution still requires a route-by-route audit and live import-path verification.'
];

const portalReferenceStyles = `
  [data-portal-reference="pharos-stack-architecture"] {
    color: #edf1ea;
    background:
      radial-gradient(circle at 88% 12%, rgba(214, 169, 92, 0.18) 0%, rgba(214, 169, 92, 0) 28%),
      radial-gradient(circle at 14% 18%, rgba(55, 108, 128, 0.2) 0%, rgba(55, 108, 128, 0) 34%),
      linear-gradient(180deg, #08111a 0%, #0c141d 46%, #0a1118 100%);
  }

  [data-portal-reference="pharos-stack-architecture"]::before {
    opacity: 0.14;
    mix-blend-mode: screen;
  }

  [data-portal-reference="pharos-stack-architecture"] .portal-architecture-shell {
    max-width: 1180px;
    padding: 40px 28px 76px;
  }

  [data-portal-reference="pharos-stack-architecture"] .portal-architecture-masthead {
    display: grid;
    grid-template-columns: minmax(0, 1.25fr) minmax(300px, 0.9fr);
    gap: 24px;
    align-items: end;
    text-align: left;
    border-bottom: 1px solid rgba(213, 177, 108, 0.18);
    padding-bottom: 26px;
    margin-bottom: 12px;
  }

  [data-portal-reference="pharos-stack-architecture"] .portal-architecture-masthead-copy {
    display: grid;
    gap: 10px;
  }

  [data-portal-reference="pharos-stack-architecture"] .portal-architecture-kicker,
  [data-portal-reference="pharos-stack-architecture"] .portal-architecture-byline,
  [data-portal-reference="pharos-stack-architecture"] .portal-architecture-layer-name,
  [data-portal-reference="pharos-stack-architecture"] .portal-architecture-tag,
  [data-portal-reference="pharos-stack-architecture"] .portal-architecture-product-name,
  [data-portal-reference="pharos-stack-architecture"] .portal-architecture-stat-label,
  [data-portal-reference="pharos-stack-architecture"] .portal-architecture-route-tree,
  [data-portal-reference="pharos-stack-architecture"] .portal-architecture-evidence-label,
  [data-portal-reference="pharos-stack-architecture"] .portal-architecture-status-badge,
  [data-portal-reference="pharos-stack-architecture"] .portal-architecture-gap-items,
  [data-portal-reference="pharos-stack-architecture"] .portal-architecture-footer,
  [data-portal-reference="pharos-stack-architecture"] .portal-architecture-construction-kicker,
  [data-portal-reference="pharos-stack-architecture"] .portal-architecture-fact-label {
    color: rgba(228, 205, 158, 0.76);
  }

  [data-portal-reference="pharos-stack-architecture"] .portal-architecture-kicker {
    margin-bottom: 0;
    font-size: 0.72rem;
    letter-spacing: 0.22em;
  }

  [data-portal-reference="pharos-stack-architecture"] .portal-architecture-title {
    font-size: clamp(3.2rem, 8vw, 5.4rem);
    line-height: 0.9;
    letter-spacing: 0.08em;
    color: #f8f3e7;
  }

  [data-portal-reference="pharos-stack-architecture"] .portal-architecture-title-sub {
    margin-top: 12px;
    font-size: clamp(0.9rem, 1.6vw, 1.2rem);
    letter-spacing: 0.3em;
    color: rgba(220, 190, 132, 0.82);
  }

  [data-portal-reference="pharos-stack-architecture"] .portal-architecture-subtitle {
    margin-top: 2px;
    font-size: 1rem;
    line-height: 1.55;
    color: rgba(235, 236, 232, 0.72);
    letter-spacing: 0.01em;
  }

  [data-portal-reference="pharos-stack-architecture"] .portal-architecture-status-panel,
  [data-portal-reference="pharos-stack-architecture"] .portal-architecture-construction-box,
  [data-portal-reference="pharos-stack-architecture"] .portal-architecture-stack-layer,
  [data-portal-reference="pharos-stack-architecture"] .portal-architecture-product-card,
  [data-portal-reference="pharos-stack-architecture"] .portal-architecture-route-tree,
  [data-portal-reference="pharos-stack-architecture"] .portal-architecture-evidence-cell,
  [data-portal-reference="pharos-stack-architecture"] .portal-architecture-gap-box {
    border-radius: 24px;
    backdrop-filter: blur(18px);
    box-shadow: 0 30px 70px rgba(0, 0, 0, 0.24);
  }

  [data-portal-reference="pharos-stack-architecture"] .portal-architecture-status-panel {
    padding: 18px 18px 20px;
    border: 1px solid rgba(213, 177, 108, 0.22);
    background: linear-gradient(180deg, rgba(12, 20, 29, 0.88) 0%, rgba(9, 17, 26, 0.94) 100%);
  }

  [data-portal-reference="pharos-stack-architecture"] .portal-architecture-status-title {
    margin: 0 0 6px;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.55rem;
    letter-spacing: 0.14em;
    color: #f8f3e7;
  }

  [data-portal-reference="pharos-stack-architecture"] .portal-architecture-status-body {
    margin: 0 0 14px;
    font-family: 'Crimson Pro', serif;
    font-size: 1rem;
    line-height: 1.6;
    color: rgba(235, 236, 232, 0.72);
  }

  [data-portal-reference="pharos-stack-architecture"] .portal-architecture-fact-grid {
    display: grid;
    gap: 12px;
  }

  [data-portal-reference="pharos-stack-architecture"] .portal-architecture-fact {
    padding: 12px 14px;
    border: 1px solid rgba(213, 177, 108, 0.14);
    border-radius: 18px;
    background: rgba(247, 241, 228, 0.035);
  }

  [data-portal-reference="pharos-stack-architecture"] .portal-architecture-fact-label {
    display: block;
    margin-bottom: 5px;
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 0.65rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
  }

  [data-portal-reference="pharos-stack-architecture"] .portal-architecture-fact-value {
    display: block;
    margin-bottom: 4px;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.18rem;
    letter-spacing: 0.08em;
    color: #f6edd7;
  }

  [data-portal-reference="pharos-stack-architecture"] .portal-architecture-fact-body {
    margin: 0;
    font-family: 'Crimson Pro', serif;
    font-size: 0.98rem;
    line-height: 1.5;
    color: rgba(235, 236, 232, 0.68);
  }

  [data-portal-reference="pharos-stack-architecture"] .portal-architecture-byline {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    gap: 0.75rem;
    padding: 0;
    border-bottom: none;
  }

  [data-portal-reference="pharos-stack-architecture"] .portal-architecture-byline span {
    padding: 0.45rem 0.8rem;
    border: 1px solid rgba(213, 177, 108, 0.14);
    border-radius: 999px;
    background: rgba(247, 241, 228, 0.045);
  }

  [data-portal-reference="pharos-stack-architecture"] .portal-architecture-construction,
  [data-portal-reference="pharos-stack-architecture"] .portal-architecture-section {
    margin-bottom: 26px;
    padding-top: 20px;
  }

  [data-portal-reference="pharos-stack-architecture"] .portal-architecture-section-head {
    border-bottom: none;
    padding-bottom: 0;
    margin: 0 0 16px;
    font-size: 0.95rem;
    letter-spacing: 0.24em;
    color: rgba(228, 205, 158, 0.76);
  }

  [data-portal-reference="pharos-stack-architecture"] .portal-architecture-construction-box {
    padding: 24px;
    border: 1px solid rgba(76, 140, 167, 0.26);
    background:
      radial-gradient(circle at top right, rgba(76, 140, 167, 0.12), transparent 32%),
      linear-gradient(180deg, rgba(10, 20, 29, 0.88) 0%, rgba(12, 21, 30, 0.94) 100%);
  }

  [data-portal-reference="pharos-stack-architecture"] .portal-architecture-construction-kicker {
    font-size: 0.65rem;
    letter-spacing: 0.2em;
  }

  [data-portal-reference="pharos-stack-architecture"] .portal-architecture-construction-title,
  [data-portal-reference="pharos-stack-architecture"] .portal-architecture-layer-title,
  [data-portal-reference="pharos-stack-architecture"] .portal-architecture-evidence-name,
  [data-portal-reference="pharos-stack-architecture"] .portal-architecture-gap-title {
    color: #f8f3e7;
  }

  [data-portal-reference="pharos-stack-architecture"] .portal-architecture-construction-title {
    font-size: clamp(1.8rem, 3vw, 2.5rem);
    letter-spacing: 0.08em;
  }

  [data-portal-reference="pharos-stack-architecture"] .portal-architecture-construction-body,
  [data-portal-reference="pharos-stack-architecture"] .portal-architecture-layer-desc,
  [data-portal-reference="pharos-stack-architecture"] .portal-architecture-product-body,
  [data-portal-reference="pharos-stack-architecture"] .portal-architecture-evidence-body,
  [data-portal-reference="pharos-stack-architecture"] .portal-architecture-gap-body {
    color: rgba(235, 236, 232, 0.72);
    font-size: 1rem;
    line-height: 1.68;
  }

  [data-portal-reference="pharos-stack-architecture"] .portal-architecture-construction-tags,
  [data-portal-reference="pharos-stack-architecture"] .portal-architecture-tag-row {
    gap: 8px;
    margin-top: 14px;
  }

  [data-portal-reference="pharos-stack-architecture"] .portal-architecture-tag {
    padding: 0.34rem 0.68rem;
    border-radius: 999px;
    border-color: rgba(219, 191, 136, 0.3);
    background: rgba(248, 243, 231, 0.055);
    color: rgba(235, 214, 176, 0.88);
    font-size: 0.62rem;
    letter-spacing: 0.14em;
  }

  [data-portal-reference="pharos-stack-architecture"] .portal-architecture-tag.aurora {
    border-color: rgba(109, 173, 203, 0.34);
    color: #84c9eb;
  }

  [data-portal-reference="pharos-stack-architecture"] .portal-architecture-tag.compass {
    border-color: rgba(212, 141, 118, 0.34);
    color: #f0ad8c;
  }

  [data-portal-reference="pharos-stack-architecture"] .portal-architecture-tag.gold {
    border-color: rgba(226, 191, 104, 0.4);
    color: #e8c870;
  }

  [data-portal-reference="pharos-stack-architecture"] .portal-architecture-tag.think10x {
    border-color: rgba(122, 194, 152, 0.34);
    color: #8fd2a9;
  }

  [data-portal-reference="pharos-stack-architecture"] .portal-architecture-stack {
    gap: 14px;
  }

  [data-portal-reference="pharos-stack-architecture"] .portal-architecture-stack-layer {
    display: grid;
    grid-template-columns: 170px minmax(0, 1fr);
    border: 1px solid rgba(213, 177, 108, 0.14);
    background: linear-gradient(180deg, rgba(11, 19, 28, 0.86) 0%, rgba(8, 14, 21, 0.92) 100%);
  }

  [data-portal-reference="pharos-stack-architecture"] .portal-architecture-stack > div:last-child .portal-architecture-stack-layer {
    border-bottom: 1px solid rgba(213, 177, 108, 0.14);
  }

  [data-portal-reference="pharos-stack-architecture"] .portal-architecture-layer-label {
    width: auto;
    padding: 20px 18px;
    border-right: 1px solid rgba(213, 177, 108, 0.12);
    background: linear-gradient(180deg, rgba(214, 169, 92, 0.08) 0%, rgba(214, 169, 92, 0.02) 100%);
  }

  [data-portal-reference="pharos-stack-architecture"] .portal-architecture-layer-num {
    color: #f3d493;
  }

  [data-portal-reference="pharos-stack-architecture"] .portal-architecture-layer-body {
    padding: 20px 22px;
  }

  [data-portal-reference="pharos-stack-architecture"] .portal-architecture-layer-title {
    font-size: 1.6rem;
    letter-spacing: 0.08em;
  }

  [data-portal-reference="pharos-stack-architecture"] .portal-architecture-title-gold {
    color: #f3d493;
  }

  [data-portal-reference="pharos-stack-architecture"] .portal-architecture-connector {
    height: auto;
    padding: 4px 0 0;
    justify-content: center;
    color: rgba(228, 205, 158, 0.55);
  }

  [data-portal-reference="pharos-stack-architecture"] .portal-architecture-product-grid,
  [data-portal-reference="pharos-stack-architecture"] .portal-architecture-evidence-grid {
    gap: 16px;
  }

  [data-portal-reference="pharos-stack-architecture"] .portal-architecture-product-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  [data-portal-reference="pharos-stack-architecture"] .portal-architecture-product-card {
    border: 1px solid rgba(213, 177, 108, 0.14);
    background: linear-gradient(180deg, rgba(12, 20, 29, 0.88) 0%, rgba(9, 17, 25, 0.94) 100%);
  }

  [data-portal-reference="pharos-stack-architecture"] .portal-architecture-product-card.compass-card {
    border-color: rgba(212, 141, 118, 0.26);
  }

  [data-portal-reference="pharos-stack-architecture"] .portal-architecture-product-card.aurora-card {
    border-color: rgba(109, 173, 203, 0.24);
  }

  [data-portal-reference="pharos-stack-architecture"] .portal-architecture-product-corner {
    border-top-right-radius: 22px;
    border-bottom-left-radius: 18px;
  }

  [data-portal-reference="pharos-stack-architecture"] .portal-architecture-product-name,
  [data-portal-reference="pharos-stack-architecture"] .portal-architecture-stat-label,
  [data-portal-reference="pharos-stack-architecture"] .portal-architecture-product-items {
    color: rgba(228, 205, 158, 0.76);
  }

  [data-portal-reference="pharos-stack-architecture"] .portal-architecture-product-letter,
  [data-portal-reference="pharos-stack-architecture"] .portal-architecture-stat-value {
    color: #f8f3e7;
  }

  [data-portal-reference="pharos-stack-architecture"] .portal-architecture-product-card.compass-card .portal-architecture-product-letter,
  [data-portal-reference="pharos-stack-architecture"] .portal-architecture-product-card.compass-card .portal-architecture-stat-value {
    color: #f0ad8c;
  }

  [data-portal-reference="pharos-stack-architecture"] .portal-architecture-product-card.aurora-card .portal-architecture-product-letter,
  [data-portal-reference="pharos-stack-architecture"] .portal-architecture-product-card.aurora-card .portal-architecture-stat-value {
    color: #84c9eb;
  }

  [data-portal-reference="pharos-stack-architecture"] .portal-architecture-product-items {
    font-size: 0.72rem;
    line-height: 1.85;
  }

  [data-portal-reference="pharos-stack-architecture"] .portal-architecture-route-tree {
    border: 1px solid rgba(213, 177, 108, 0.16);
    background:
      linear-gradient(180deg, rgba(8, 14, 21, 0.92) 0%, rgba(11, 19, 28, 0.95) 100%);
    color: rgba(242, 236, 226, 0.82);
  }

  [data-portal-reference="pharos-stack-architecture"] .portal-architecture-route-tree::before {
    background: #0c141d;
    color: rgba(228, 205, 158, 0.76);
  }

  [data-portal-reference="pharos-stack-architecture"] .rt-root {
    color: #f8f3e7;
  }

  [data-portal-reference="pharos-stack-architecture"] .rt-compass {
    color: #f0ad8c;
  }

  [data-portal-reference="pharos-stack-architecture"] .rt-aurora {
    color: #84c9eb;
  }

  [data-portal-reference="pharos-stack-architecture"] .rt-redirect,
  [data-portal-reference="pharos-stack-architecture"] .rt-count,
  [data-portal-reference="pharos-stack-architecture"] .rt-comment {
    color: rgba(228, 205, 158, 0.72);
  }

  [data-portal-reference="pharos-stack-architecture"] .portal-architecture-evidence-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  [data-portal-reference="pharos-stack-architecture"] .portal-architecture-evidence-cell {
    border: 1px solid rgba(213, 177, 108, 0.14);
    background: linear-gradient(180deg, rgba(12, 20, 29, 0.84) 0%, rgba(9, 17, 25, 0.9) 100%);
  }

  [data-portal-reference="pharos-stack-architecture"] .portal-architecture-evidence-name {
    font-size: 1.3rem;
    letter-spacing: 0.06em;
  }

  [data-portal-reference="pharos-stack-architecture"] .portal-architecture-status-badge.badge-active {
    border-color: rgba(122, 194, 152, 0.42);
    color: #8fd2a9;
  }

  [data-portal-reference="pharos-stack-architecture"] .portal-architecture-status-badge.badge-preview {
    border-color: rgba(226, 191, 104, 0.42);
    color: #e8c870;
  }

  [data-portal-reference="pharos-stack-architecture"] .portal-architecture-gap-box {
    border: 1px solid rgba(207, 95, 95, 0.34);
    background:
      radial-gradient(circle at top right, rgba(207, 95, 95, 0.11), transparent 36%),
      linear-gradient(180deg, rgba(30, 14, 18, 0.88) 0%, rgba(20, 10, 13, 0.94) 100%);
  }

  [data-portal-reference="pharos-stack-architecture"] .portal-architecture-gap-box::before {
    top: 0;
    left: 22px;
    transform: translateY(-50%);
    border-radius: 999px;
    background: #b44747;
  }

  [data-portal-reference="pharos-stack-architecture"] .portal-architecture-gap-title {
    margin-top: 8px;
    font-size: 1.5rem;
    letter-spacing: 0.06em;
    color: #f3b3b3;
  }

  [data-portal-reference="pharos-stack-architecture"] .portal-architecture-gap-items {
    display: grid;
    gap: 9px;
    margin-top: 14px;
    font-size: 0.76rem;
    line-height: 1.6;
    color: rgba(243, 179, 179, 0.9);
  }

  [data-portal-reference="pharos-stack-architecture"] .portal-architecture-footer {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 0.8rem;
    margin-top: 34px;
    padding-top: 16px;
    border-top: 1px solid rgba(213, 177, 108, 0.16);
  }

  @media (max-width: 960px) {
    [data-portal-reference="pharos-stack-architecture"] .portal-architecture-shell {
      padding: 30px 20px 56px;
    }

    [data-portal-reference="pharos-stack-architecture"] .portal-architecture-masthead,
    [data-portal-reference="pharos-stack-architecture"] .portal-architecture-stack-layer,
    [data-portal-reference="pharos-stack-architecture"] .portal-architecture-product-grid,
    [data-portal-reference="pharos-stack-architecture"] .portal-architecture-evidence-grid {
      grid-template-columns: 1fr;
    }

    [data-portal-reference="pharos-stack-architecture"] .portal-architecture-layer-label {
      border-right: none;
      border-bottom: 1px solid rgba(213, 177, 108, 0.12);
    }
  }

  @media (max-width: 720px) {
    [data-portal-reference="pharos-stack-architecture"] .portal-architecture-shell {
      padding: 24px 16px 44px;
    }

    [data-portal-reference="pharos-stack-architecture"] .portal-architecture-title {
      font-size: clamp(2.6rem, 15vw, 3.7rem);
      letter-spacing: 0.05em;
    }

    [data-portal-reference="pharos-stack-architecture"] .portal-architecture-title-sub {
      letter-spacing: 0.18em;
    }

    [data-portal-reference="pharos-stack-architecture"] .portal-architecture-byline span,
    [data-portal-reference="pharos-stack-architecture"] .portal-architecture-tag {
      width: 100%;
      justify-content: flex-start;
    }

    [data-portal-reference="pharos-stack-architecture"] .portal-architecture-route-tree {
      padding: 18px 16px;
      font-size: 0.8rem;
      line-height: 1.9;
    }

    [data-portal-reference="pharos-stack-architecture"] .rt-indent1 {
      padding-left: 14px;
    }

    [data-portal-reference="pharos-stack-architecture"] .rt-indent2 {
      padding-left: 28px;
    }
  }
`;

function PortalArchitectureReference({ routePath, testId }) {
  return (
    <div
      className="portal-architecture-page"
      data-testid={testId}
      data-portal-state="under-construction"
      data-portal-reference="pharos-stack-architecture"
    >
      <style>{portalReferenceStyles}</style>

      <div className="portal-architecture-shell">
        <header className="portal-architecture-masthead">
          <div className="portal-architecture-masthead-copy">
            <p className="portal-architecture-kicker">PHAROS · Architecture Reference</p>
            <h1 className="portal-architecture-title">
              PHAROS STACK
              <span className="portal-architecture-title-sub">COMPASSai &amp; AurorA public route reference</span>
            </h1>
            <p className="portal-architecture-subtitle">
              COMPASSai and AurorA stay visible from the public shell while live operational portal behaviors remain bounded.
            </p>
          </div>

          <aside className="portal-architecture-status-panel" aria-label="Portal preview status">
            <h2 className="portal-architecture-status-title">Preview Boundary</h2>
            <p className="portal-architecture-status-body">
              This route is a governed public reference. It keeps the stack legible without implying that the working dashboard or intake APIs are already exposed.
            </p>

            <div className="portal-architecture-fact-grid">
              {previewFacts.map((fact) => (
                <div key={fact.label} className="portal-architecture-fact">
                  <span className="portal-architecture-fact-label">{fact.label}</span>
                  <span className="portal-architecture-fact-value">{fact.value}</span>
                  <p className="portal-architecture-fact-body">{fact.body}</p>
                </div>
              ))}
            </div>
          </aside>
        </header>

        <div className="portal-architecture-byline">
          <span>pharos@pharos-ai.ca</span>
          <span>{routePath} · public architecture route</span>
          <span>pharos-ai.ca · architecture reference only</span>
        </div>

        <section className="portal-architecture-construction" aria-labelledby="portal-construction-title">
          <p className="portal-architecture-section-head">Portal Status</p>
          <div className="portal-architecture-construction-box">
            <p className="portal-architecture-construction-kicker">Under construction</p>
            <h2 id="portal-construction-title" className="portal-architecture-construction-title">
              /portal remains a bounded public reference
            </h2>
            <p className="portal-architecture-construction-body">
              COMPASSai and AurorA are still in development. These routes keep the architecture, route relationship, and public-state boundary visible while live operational portal surfaces remain off.
            </p>
            <div className="portal-architecture-construction-tags">
              <span className="portal-architecture-tag think10x">Architecture reference only</span>
              <span className="portal-architecture-tag compass">COMPASSai in development</span>
              <span className="portal-architecture-tag aurora">AurorA in development</span>
            </div>
          </div>
        </section>

        <section className="portal-architecture-section">
          <p className="portal-architecture-section-head">Stack Position · Three-Layer Architecture</p>
          <div className="portal-architecture-stack">
            {stackLayers.map((layer, index) => (
              <div key={layer.number}>
                <div className="portal-architecture-stack-layer">
                  <div className="portal-architecture-layer-label">
                    <span className="portal-architecture-layer-num">{layer.number}</span>
                    <span className="portal-architecture-layer-name">{layer.name}</span>
                  </div>
                  <div className="portal-architecture-layer-body">
                    <h2 className={`portal-architecture-layer-title ${layer.titleClassName || ''}`.trim()}>
                      {layer.title}
                    </h2>
                    <p className="portal-architecture-layer-desc">{layer.description}</p>
                    <div className="portal-architecture-tag-row">
                      {layer.tags.map((tag) => (
                        <span
                          key={tag.label}
                          className={`portal-architecture-tag ${tag.tone || ''}`.trim()}
                        >
                          {tag.label}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                {index < stackLayers.length - 1 ? (
                  <div className="portal-architecture-connector" aria-hidden="true">
                    ↓
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </section>

        <section className="portal-architecture-section">
          <p className="portal-architecture-section-head">Application Surfaces · COMPASSai &amp; AurorA</p>
          <div className="portal-architecture-product-grid">
            {productCards.map((card) => (
              <article key={card.fullname} className={`portal-architecture-product-card ${card.className}`}>
                <span className="portal-architecture-product-corner">{card.corner}</span>
                <div className="portal-architecture-product-letter">{card.letter}</div>
                <p className="portal-architecture-product-name">{card.fullname}</p>
                <div className="portal-architecture-stat-row">
                  {card.stats.map((stat) => (
                    <div key={stat.label} className="portal-architecture-stat-block">
                      <span className="portal-architecture-stat-value">{stat.value}</span>
                      <span className="portal-architecture-stat-label">{stat.label}</span>
                    </div>
                  ))}
                </div>
                <p className="portal-architecture-product-body">{card.body}</p>
                <div className="portal-architecture-product-items">
                  {card.items.map((item) => (
                    <div key={item}>→ {item}</div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="portal-architecture-section">
          <p className="portal-architecture-section-head">Route Hierarchy · AurorA → COMPASSai Redirect</p>
          <div className="portal-architecture-route-tree">
            {routeHierarchy.map((item) => (
              <div key={`${item.className}-${item.text}`} className={item.className}>
                {item.text}
                {item.note ? (
                  <span className={item.note.includes('namespace') ? 'rt-count' : 'rt-comment'}>
                    {' '}← {item.note}
                  </span>
                ) : null}
              </div>
            ))}
            <div>&nbsp;</div>
            <div className="rt-indent1 rt-aurora">
              /aurorai <span className="rt-redirect">→ 301 redirect → /portal/compassai/aurora</span>
            </div>
          </div>
        </section>

        <section className="portal-architecture-section">
          <p className="portal-architecture-section-head">Evidence Basis · Shared Archive Sources</p>
          <div className="portal-architecture-evidence-grid">
            {evidenceSources.map((source) => (
              <article key={source.name} className="portal-architecture-evidence-cell">
                <p className="portal-architecture-evidence-label">{source.label}</p>
                <h2 className="portal-architecture-evidence-name">{source.name}</h2>
                <p className="portal-architecture-evidence-body">{source.body}</p>
                <span className={`portal-architecture-status-badge ${source.statusClassName}`.trim()}>
                  {source.status}
                </span>
              </article>
            ))}
          </div>
        </section>

        <section className="portal-architecture-section">
          <p className="portal-architecture-section-head">Integrity Notice</p>
          <div className="portal-architecture-gap-box">
            <h2 className="portal-architecture-gap-title">Dependency graph fragility remains unresolved</h2>
            <p className="portal-architecture-gap-body">
              Integration logic was generated across multiple sessions with prompts referencing components in other repositories without verifying their current state. This remains a known bounded gap, not a resolved one.
            </p>
            <div className="portal-architecture-gap-items">
              {boundedGapItems.map((item) => (
                <div key={item}>⚠ {item}</div>
              ))}
            </div>
          </div>
        </section>

        <footer className="portal-architecture-footer">
          <span>PHAROS Stack · COMPASSai &amp; AurorA Architecture Reference</span>
          <span>pharos-ai.ca · /portal under construction · 2026</span>
        </footer>
      </div>
    </div>
  );
}

export default PortalArchitectureReference;
