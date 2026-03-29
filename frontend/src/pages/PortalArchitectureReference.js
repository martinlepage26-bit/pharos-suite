import '../portalArchitecture.css';

const stackLayers = [
  {
    number: '01',
    name: 'Method Layer',
    title: 'PHAROS Governance Method',
    titleClassName: 'portal-architecture-title-gold',
    description:
      'The upstream research and governance framework. It defines the P→H→A→R loop, T0–T3 risk tiering, evidence package schema, and the 10XTHINK evidence ceiling. Neither COMPASSai nor AurorA invent governance rules; they operationalize this layer.',
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
      "Application surfaces translating PHAROS method outputs into operational product form. COMPASSai handles the portal routing core and preview operations; AurorA is the document intake surface nested within COMPASSai's namespace. Both remain in development.",
    tags: [
      { label: 'COMPASSai · ~69 routes · :9202', tone: 'compass' },
      { label: 'AurorA · ~21 routes · nested', tone: 'aurora' },
      { label: 'FastAPI + MongoDB' },
      { label: 'Cerebrhoe' }
    ]
  },
  {
    number: '03',
    name: 'Frontend Shell',
    title: 'PHAROS public shell · pharos-ai.ca',
    description:
      'The public-facing website and presentation layer. pharos-ai.ca currently publishes architecture context for these routes while the operational portal surfaces are still under construction.',
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
      'The larger of the two surfaces. It handles portal routing and preview operations, connecting governance method outputs to a client-facing presentation layer. AurorA resolves into this namespace.',
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
      'Smaller application surface in development. AurorA handles document intake, classification, extraction, and evidence packaging while remaining architecturally nested under COMPASSai.',
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
    label: 'Source File 01',
    name: 'After Reboot Checklist',
    body:
      'Operational continuity document capturing system state, restart sequence, and dependency verification steps after a Cerebrhoe reboot.',
    status: 'Active Evidence',
    statusClassName: 'badge-active'
  },
  {
    label: 'Source File 02',
    name: 'One-Page Markdown Version',
    body:
      'Condensed architecture summary capturing the essential routing topology and the COMPASSai/AurorA relationship in minimal form.',
    status: 'Active Evidence',
    statusClassName: 'badge-active'
  },
  {
    label: 'Source File 03',
    name: 'Moving Parts',
    body:
      'Component inventory tracking active services, interdependencies, and integration points across COMPASSai, AurorA, and the PHAROS frontend shell.',
    status: 'Preview Linkage',
    statusClassName: 'badge-preview'
  }
];

function PortalArchitectureReference({ routePath, testId }) {
  return (
    <div
      className="portal-architecture-page"
      data-testid={testId}
      data-portal-state="under-construction"
      data-portal-reference="pharos-stack-architecture"
    >
      <div className="portal-architecture-shell">
        <header className="portal-architecture-masthead">
          <p className="portal-architecture-kicker">PHAROS · Architecture Reference · Martin Lepage</p>
          <h1 className="portal-architecture-title">
            PHAROS STACK
            <span className="portal-architecture-title-sub">
              COMPASSai &amp; AurorA · Architecture Reference
            </span>
          </h1>
          <p className="portal-architecture-subtitle">
            Application surface layer · architecture-only public reference · 2026
          </p>
        </header>

        <div className="portal-architecture-byline">
          <span>pharos@pharos-ai.ca · PHAROS</span>
          <span>{routePath} · public architecture route</span>
          <span>Status: /portal under construction</span>
        </div>

        <section className="portal-architecture-construction" aria-labelledby="portal-construction-title">
          <p className="portal-architecture-section-head">Portal Status</p>
          <div className="portal-architecture-construction-box">
            <p className="portal-architecture-construction-kicker">Under construction</p>
            <h2 id="portal-construction-title" className="portal-architecture-construction-title">
              /portal is under construction
            </h2>
            <p className="portal-architecture-construction-body">
              COMPASSai and AurorA are still in development. These public routes currently publish the architecture
              reference, route relationship, and bounded status only, rather than live operational portal surfaces.
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
            <div className="rt-root">/portal <span className="rt-comment">← under construction</span></div>
            <div className="rt-indent1 rt-compass">├── /compassai <span className="rt-count">← COMPASSai namespace (~69 routes)</span></div>
            <div className="rt-indent2 rt-compass">├── /compassai/dashboard</div>
            <div className="rt-indent2 rt-compass">├── /compassai/governance</div>
            <div className="rt-indent2 rt-compass">├── /compassai/reports <span className="rt-comment">← client-report presentation surface</span></div>
            <div className="rt-indent2 rt-aurora">├── /compassai/aurora <span className="rt-comment">← AurorA nested namespace (~21 routes)</span></div>
            <div className="rt-indent2 rt-aurora">│   ├── /compassai/aurora/intake</div>
            <div className="rt-indent2 rt-aurora">│   ├── /compassai/aurora/evidence</div>
            <div className="rt-indent2 rt-aurora">│   └── /compassai/aurora/preview</div>
            <div className="rt-indent2 rt-compass">└── /compassai/gates <span className="rt-comment">← G1–G4 approval workflow</span></div>
            <div>&nbsp;</div>
            <div className="rt-indent1 rt-aurora">└── /aurorai <span className="rt-redirect">→ 301 redirect → /portal/compassai/aurora</span></div>
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
            <h2 className="portal-architecture-gap-title">Dependency Graph Fragility · Unresolved</h2>
            <p className="portal-architecture-gap-body">
              Integration logic was generated across multiple sessions with prompts referencing components in other
              repositories without verifying their current state. The result is a dependency graph that cannot be fully
              reconstructed. This remains a known bounded gap, not a resolved one.
            </p>
            <div className="portal-architecture-gap-items">
              <div>⚠ Routes reference components that may or may not exist at expected locations</div>
              <div>⚠ Import paths assume directory structures that may have been reorganized later</div>
              <div>⚠ Cross-repository references were not verified at time of generation</div>
              <div>⚠ Resolution requires session-by-session route audit and live import-path verification</div>
            </div>
          </div>
        </section>

        <footer className="portal-architecture-footer">
          <span>PHAROS Stack · COMPASSai &amp; AurorA Architecture Reference · Martin Lepage</span>
          <span>pharos-ai.ca · /portal under construction · 2026</span>
        </footer>
      </div>
    </div>
  );
}

export default PortalArchitectureReference;
