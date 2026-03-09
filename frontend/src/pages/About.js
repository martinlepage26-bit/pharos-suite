import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink } from 'lucide-react';
import LighthouseGlyph from '../components/LighthouseGlyph';
import RichTextContent from '../components/RichTextContent';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const infraFabricCards = [
  {
    title: 'Claim discipline',
    description: 'InfraFabric keeps capability claims tied to what the evidence and infrastructure can actually support right now.'
  },
  {
    title: 'Evidence lineage',
    description: 'Artifacts, processing runs, review decisions, evidence packages, assessments, and audit events stay explicit instead of collapsing into vague status.'
  },
  {
    title: 'Fail-closed posture',
    description: 'If lineage is missing or review evidence is incomplete, the claim narrows and the state stays provisional.'
  }
];

const moduleCards = [
  {
    title: 'AurorAI',
    description: 'An in-house evidence and document engine developed by Martin Lepage in accordance with Deterministic AI governance models by InfraFabric, with permission.',
    portalPath: '/portal/aurorai'
  },
  {
    title: 'CompassAI',
    description: 'An in-house governance engine developed by Martin Lepage in accordance with Deterministic AI governance models by InfraFabric, with permission.',
    portalPath: '/portal/compassai'
  }
];

const sortPublications = (left, right) => {
  const rightYear = Number.parseInt(right.year, 10) || 0;
  const leftYear = Number.parseInt(left.year, 10) || 0;
  const yearDelta = rightYear - leftYear;
  if (yearDelta !== 0) return yearDelta;

  return String(right.created_at || '').localeCompare(String(left.created_at || ''));
};

const About = () => {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/publications`)
      .then((response) => response.json())
      .then((data) => {
        const aboutPublications = data
          .filter((publication) => (
            publication.status === 'published' &&
            (!publication.site_section || publication.site_section === 'about_publications')
          ))
          .sort(sortPublications);

        setPublications(aboutPublications);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div data-testid="about-page">
      <div className="page-hero">
        <div className="container">
          <div className="about-hero-split">
            <div>
              <p className="eyebrow" style={{ marginBottom: '16px' }}>About</p>
              <div className="brand-kicker brand-kicker-static">
                <LighthouseGlyph className="brand-kicker-mark" title="" />
                <span>PHAROS AI GOVERNANCE</span>
              </div>
              <h1>PHAROS AI Governance</h1>
              <p className="body-lg" style={{ marginTop: '20px' }}>
                PHAROS is the public-facing AI governance practice led by Martin Lepage: a Montreal-based advisory centered on evidence, deterministic decision rights, controls, and review-ready documentation.
              </p>
              <div className="divider" />
              <p className="body-sm">
                The work is built for organizations facing procurement pressure, audit review, vendor diligence, or committee oversight and needing governance that remains legible under scrutiny.
              </p>
              <p style={{ fontSize: '0.75rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-muted-light)', marginTop: '12px', fontWeight: 500 }}>
                Montreal · Quebec · Canada
              </p>
              <div style={{ marginTop: '32px', display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                <Link to="/connect" className="btn-dark">
                  Book a debrief
                  <ArrowRight />
                </Link>
                <Link to="/research" className="btn-outline">View research</Link>
              </div>
            </div>

            <div className="reveal visible">
              <div className="editorial-panel">
                <p className="eyebrow" style={{ marginBottom: '16px' }}>Practice posture</p>
                <h2 style={{ fontSize: '1.75rem', marginBottom: '16px' }}>Legible governance under pressure</h2>
                <p className="body-sm">
                  The standard is simple: governance documentation should derive from evidence, decision rights and thresholds should stay explicit, and public claims should not outrun what the underlying architecture can support.
                </p>
                <div className="divider" />
                <p className="body-sm" style={{ marginTop: '16px' }}>
                  That posture carries through the advisory work, the documentation structure, and the in-house systems supporting evidence handling and governance assessment behind the scenes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="section" style={{ background: 'var(--color-bg-alt)' }}>
        <div className="container">
          <div className="section-header reveal">
            <p className="eyebrow">InfraFabric</p>
            <h2>The structural framework under the deeper architecture work</h2>
            <p className="body-sm">
              InfraFabric is the governance framework that preserves provenance, review gates, evidence lineage, and auditability so no capability claim outruns the state of the underlying infrastructure.
            </p>
          </div>

          <div className="grid-3 stagger">
            {infraFabricCards.map((item) => (
              <div key={item.title} className="card reveal">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header reveal">
            <p className="eyebrow">Internal modules</p>
            <h2>AurorAI & CompassAI</h2>
            <p className="body-sm">
              AurorAI and CompassAI are in-house systems developed by Martin Lepage in accordance with Deterministic AI governance models by InfraFabric, with permission. AurorAI handles evidence and document processing. CompassAI handles governance intake, assessment, and output generation. Portal access is available below, and the shared admin surface remains separate.
            </p>
          </div>

          <div className="grid-2 stagger">
            {moduleCards.map((item) => (
              <div key={item.title} className="card reveal">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <div style={{ marginTop: '22px', display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                  <Link to={item.portalPath} className="btn-dark">
                    Client portal
                    <ArrowRight />
                  </Link>
                  <Link to="/admin" className="btn-outline">Admin</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--color-bg-alt)' }} id="publications">
        <div className="container">
          <div className="section-header reveal">
            <h2>New Publications Every Week</h2>
          </div>

          {loading ? <p className="body-sm">Loading publications</p> : null}

          {!loading && publications.length > 0 ? (
            <div className="stagger" style={{ display: 'grid', gap: '20px' }}>
              {publications.map((publication) => {
                const previewText = publication.abstract || publication.description;
                const meta = (
                  <div className="publication-card-meta">
                    {publication.type ? <span className="eyebrow" style={{ marginBottom: 0 }}>{publication.type}</span> : null}
                    {publication.year ? <span className="research-date">{publication.year}</span> : null}
                    {publication.venue ? <span className="research-date">{publication.venue}</span> : null}
                  </div>
                );

                const content = (
                  <>
                    {meta}
                    <h3 style={{ marginBottom: '12px' }}>{publication.title}</h3>
                    {previewText ? <RichTextContent text={previewText} /> : null}
                  </>
                );

                if (!publication.link) {
                  return (
                    <div key={publication.id} className="card reveal">
                      {content}
                    </div>
                  );
                }

                if (publication.internal) {
                  return (
                    <Link key={publication.id} to={publication.link} className="card reveal">
                      {content}
                    </Link>
                  );
                }

                return (
                  <a key={publication.id} href={publication.link} target="_blank" rel="noreferrer" className="card reveal">
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '14px' }}>
                      <div style={{ flex: 1 }}>{content}</div>
                      <ExternalLink size={18} style={{ flexShrink: 0, color: 'var(--color-accent)' }} />
                    </div>
                  </a>
                );
              })}
            </div>
          ) : null}

          {!loading && publications.length === 0 ? (
            <div className="editorial-panel reveal">
              <p className="body-sm" style={{ marginBottom: 0 }}>
                No publications are assigned to the About page yet. Publish them from the Admin publisher and they will appear here.
              </p>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
};

export default About;
