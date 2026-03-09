import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Cpu, ExternalLink, FileText, Scale, Shield } from 'lucide-react';
import RichTextContent from '../components/RichTextContent';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const engagements = [
  { type: 'Governance Foundation', icon: Shield, clients: 'Enterprise organizations', scope: 'AI Governance Framework Design', description: 'Establishing minimum viable governance: use-case inventory, risk tiering, decision rights, approval flows, and operating cadence.', outcomes: ['Use-case maps', 'Risk tier criteria', 'RACI matrices', 'Governance cadence'] },
  { type: 'Controls & Evidence', icon: FileText, clients: 'Financial services, healthcare', scope: 'Audit and Procurement Readiness', description: 'Building control registers, evidence expectations, and documentation structures that satisfy internal audit, regulators, and procurement.', outcomes: ['Control registers', 'Evidence checklists', 'Vendor questionnaires', 'Decision logs'] },
  { type: 'Vendor Assessment', icon: Scale, clients: 'Public sector, enterprise', scope: 'Third-Party AI Due Diligence', description: 'Developing evaluation frameworks, questionnaires, and contractual requirements for AI procurement and vendor management.', outcomes: ['Evaluation criteria', 'Diligence protocols', 'Contract language', 'Reassessment triggers'] },
  { type: 'Oversight Retainer', icon: Cpu, clients: 'Organizations with active AI delivery', scope: 'Ongoing Governance Support', description: 'Recurring advisory to keep governance current as models, vendors, data flows, and use cases evolve.', outcomes: ['Monthly oversight', 'Decision log stewardship', 'Control updates', 'Audit support'] }
];

const expertise = [
  { category: 'Governance', skills: ['AI Risk Classification', 'Decision Rights Design', 'Governance Operating Models', 'Lifecycle Gates'] },
  { category: 'Evidence', skills: ['Audit Documentation', 'Evidence Architecture', 'Traceability Systems', 'Reconstruction Capability'] },
  { category: 'Controls', skills: ['Control Register Design', 'Testing Expectations', 'Monitoring Frameworks', 'Threshold Management'] },
  { category: 'Procurement', skills: ['Vendor Due Diligence', 'Questionnaire Design', 'Contract Requirements', 'Reassessment Protocols'] }
];

const Portfolio = () => {
  const [publications, setPublications] = useState([]);
  const [workingPapers, setWorkingPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedEngagements, setExpandedEngagements] = useState({});

  useEffect(() => {
    fetch(`${API_URL}/api/publications`)
      .then((res) => res.json())
      .then((data) => {
        setPublications(data.filter((p) => p.status === 'published'));
        setWorkingPapers(data.filter((p) => p.status === 'in_development'));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div data-testid="portfolio-page">
      <div className="page-hero">
        <div className="container">
          <div className="section-header">
            <p className="eyebrow">Portfolio</p>
            <h1>Publications and frameworks for operational governance</h1>
            <p className="body-lg" style={{ marginTop: '16px' }}>
              This work focuses on controls people can execute, evidence reviewers can verify, and documentation that survives scrutiny.
            </p>
          </div>
        </div>
      </div>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-header reveal">
            <p className="eyebrow">Publications</p>
            <h2>Published work and internal frameworks</h2>
          </div>

          {loading ? <p className="body-sm">Loading publications</p> : null}

          {!loading ? (
            <div className="stagger" style={{ display: 'grid', gap: '20px' }}>
              {publications.map((pub, index) => {
                const previewText = pub.abstract || pub.description;
                const content = (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '12px' }}>
                      <span className="eyebrow" style={{ marginBottom: 0 }}>{pub.type}</span>
                      <span className="research-date">{pub.year}</span>
                      {pub.venue ? <span className="research-date">{pub.venue}</span> : null}
                    </div>
                    <h3 style={{ marginBottom: '10px' }}>{pub.title}</h3>
                    {previewText ? <RichTextContent text={previewText} /> : null}
                  </>
                );

                if (pub.internal) {
                  return (
                    <Link key={pub.id} to={pub.link} className="card reveal" data-testid={`publication-${index}`}>
                      {content}
                    </Link>
                  );
                }

                return (
                  <a key={pub.id} href={pub.link} target="_blank" rel="noreferrer" className="card reveal" data-testid={`publication-${index}`}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '14px' }}>
                      <div style={{ flex: 1 }}>{content}</div>
                      <ExternalLink size={18} style={{ flexShrink: 0, color: 'var(--color-accent)' }} />
                    </div>
                  </a>
                );
              })}
            </div>
          ) : null}
        </div>
      </section>

      {workingPapers.length > 0 ? (
        <section className="section" style={{ background: 'var(--color-bg-alt)' }}>
          <div className="container">
            <div className="section-header reveal">
              <p className="eyebrow">Working papers</p>
              <h2>In-progress material</h2>
            </div>
            <div className="stagger" style={{ display: 'grid', gap: '20px' }}>
              {workingPapers.map((paper, index) => (
                <div key={paper.id} className="card reveal" data-testid={`working-paper-${index}`}>
                  <span className="eyebrow" style={{ marginBottom: '10px', display: 'inline-block' }}>In development</span>
                  <h3 style={{ marginBottom: '10px' }}>{paper.title}</h3>
                  <RichTextContent text={paper.abstract || paper.description} />
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="section">
        <div className="container">
          <div className="section-header reveal">
            <p className="eyebrow">Engagements</p>
            <h2>How the work is usually structured</h2>
          </div>
          <div className="grid-2 stagger">
            {engagements.map((engagement) => (
              <div key={engagement.scope} className="card reveal">
                <div className="card-icon">
                  <engagement.icon />
                </div>
                <p className="eyebrow" style={{ marginBottom: '10px' }}>{engagement.type}</p>
                <h3>{engagement.scope}</h3>
                <p style={{ marginBottom: '12px', color: 'var(--color-text)', fontWeight: 500 }}>{engagement.clients}</p>
                <p>{engagement.description}</p>
                <button
                  type="button"
                  onClick={() => setExpandedEngagements((current) => ({ ...current, [engagement.scope]: !current[engagement.scope] }))}
                  style={{ marginTop: '16px', color: 'var(--color-accent)', fontSize: '0.875rem', fontWeight: 500 }}
                >
                  {expandedEngagements[engagement.scope] ? 'Hide article fields' : 'Expand article fields'}
                </button>
                {expandedEngagements[engagement.scope] ? (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '16px' }}>
                    {engagement.outcomes.map((item) => (
                      <span key={item} style={{ display: 'inline-flex', alignItems: 'center', padding: '10px 14px', borderRadius: '999px', border: '1px solid var(--color-border)', background: 'var(--color-bg-alt)', fontSize: '0.875rem' }}>
                        {item}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--color-bg-alt)' }}>
        <div className="container">
          <div className="section-header reveal">
            <p className="eyebrow">Expertise</p>
            <h2>Where the practice concentrates</h2>
          </div>
          <div className="grid-2 stagger">
            {expertise.map((area) => (
              <div key={area.category} className="card reveal">
                <h3>{area.category}</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '14px' }}>
                  {area.skills.map((skill) => (
                    <span key={skill} style={{ display: 'inline-flex', alignItems: 'center', padding: '10px 14px', borderRadius: '999px', border: '1px solid var(--color-border)', background: 'var(--color-surface)', fontSize: '0.875rem' }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cta-banner reveal">
            <h2>Discuss your governance needs</h2>
            <p className="body-sm">Whether you&apos;re establishing governance foundations, preparing for audit, or managing vendor AI risk.</p>
            <div className="btn-row">
              <Link to="/connect" className="btn-primary">Book a debrief</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Portfolio;
