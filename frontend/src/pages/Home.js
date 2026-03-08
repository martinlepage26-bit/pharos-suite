import { Link } from 'react-router-dom';
import { ArrowRight, BriefcaseBusiness, Building2, FileCheck2, FolderSearch, Radar, Scale, ShieldCheck, Waypoints } from 'lucide-react';
import LighthouseGlyph from '../components/LighthouseGlyph';

const pressurePoints = [
  {
    icon: BriefcaseBusiness,
    title: 'Procurement',
    description: 'When a buyer asks for controls, questionnaires, and a credible governance answer.'
  },
  {
    icon: Radar,
    title: 'Audit',
    description: 'When a review asks who decides, what packet exists, and what can be reconstructed.'
  },
  {
    icon: ShieldCheck,
    title: 'Vendor review',
    description: 'When models, partners, and dependencies need structured review instead of improvisation.'
  },
  {
    icon: Building2,
    title: 'Executive oversight',
    description: 'When leadership wants escalation logic that stays simple and maintainable.'
  }
];

const methods = [
  {
    step: '01',
    title: 'Read the situation',
    description: 'Map the system, dependencies, actors, and the source of scrutiny.'
  },
  {
    step: '02',
    title: 'Name the risk',
    description: 'Make thresholds, stakes, and review expectations explicit.'
  },
  {
    step: '03',
    title: 'Structure the response',
    description: 'Assign decisions, controls, and documentation.'
  },
  {
    step: '04',
    title: 'Maintain legibility',
    description: 'Set a light cadence so the posture stays operable.'
  }
];

const artifacts = [
  {
    icon: FileCheck2,
    title: 'Decision matrix',
    description: 'Shows who approves, who escalates, and what gets recorded.'
  },
  {
    icon: Radar,
    title: 'Tiering logic',
    description: 'Defines which cases require deeper review and why.'
  },
  {
    icon: FolderSearch,
    title: 'Review packet',
    description: 'Assembles the materials an auditor, customer, or committee can follow.'
  },
  {
    icon: Waypoints,
    title: 'Operating model',
    description: 'Sets the cadence for reviews, updates, and evidence upkeep.'
  }
];

const routes = [
  {
    icon: BriefcaseBusiness,
    title: 'Calm the questionnaire',
    description: 'For teams that need defensible responses to procurement or customer review.',
    cta: 'Get started',
    to: '/connect'
  },
  {
    icon: Building2,
    title: 'Build the foundation',
    description: 'For teams that need clear controls without slowing delivery.',
    cta: 'View services',
    to: '/services'
  },
  {
    icon: Scale,
    title: 'Support ongoing review',
    description: 'For executives and risk bodies that need evidence ready for scrutiny.',
    cta: 'Read the approach',
    to: '/about'
  }
];

const reviewNeeds = [
  'Clear decision rights',
  'Risk tiers with thresholds',
  'Evidence packet ready',
  'Escalation cadence noted'
];

const Home = () => (
  <div data-testid="home-page">
    <section className="hero">
      <LighthouseGlyph className="hero-watermark" title="" />

      <div className="container">
        <div className="hero-content">
          <p className="eyebrow" style={{ marginBottom: '20px', opacity: 0, transform: 'translateY(30px)', animation: 'fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.05s forwards' }}>
            Martin Lepage, PhD
          </p>
          <h1>Legible AI governance under pressure</h1>
          <p className="body-lg">
            When procurement, audit, or the board asks how AI is governed, Govern AI helps your team answer with evidence, clear decision rights, and review-ready documentation.
          </p>
          <div className="hero-cta-row">
            <Link to="/connect" className="btn-primary">
              Book a debrief
              <ArrowRight />
            </Link>
            <Link to="/services" className="btn-secondary">View services</Link>
          </div>
        </div>
      </div>
    </section>

    <section className="section">
      <div className="container">
        <div className="section-header reveal">
          <p className="eyebrow">What review bodies need to see</p>
          <h2>A governance posture that stays legible under pressure</h2>
          <p className="body-sm">
            Decision rights, risk tiers, controls, and evidence should stay easy to follow when scrutiny arrives.
          </p>
        </div>

        <div className="editorial-panel reveal">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
            <div className="card-icon" style={{ width: '56px', height: '56px', marginBottom: 0 }}>
              <LighthouseGlyph className="nav-logo" title="Govern AI review mark" />
            </div>
            <div>
              <p className="eyebrow" style={{ marginBottom: '8px' }}>Govern AI</p>
              <h3 style={{ marginBottom: 0 }}>Legibility before pressure</h3>
            </div>
          </div>
          <div className="grid-2">
            {reviewNeeds.map((item) => (
              <div key={item} className="scope-note">
                <strong>{item}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    <section className="section">
      <div className="container">
        <div className="section-header reveal">
          <p className="eyebrow">Pressure points</p>
          <h2>Scrutiny creates friction at four points</h2>
          <p className="body-sm">
            Governance work rarely starts in the abstract. It starts when a deal, review, or oversight request exposes gaps in decisions and documentation.
          </p>
        </div>

        <div className="grid-4 stagger">
          {pressurePoints.map((item) => (
            <div key={item.title} className="card reveal">
              <div className="card-icon">
                <item.icon />
              </div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="section" style={{ background: 'var(--color-bg-alt)' }}>
      <div className="container">
        <div className="section-header reveal">
          <p className="eyebrow">Method</p>
          <h2>Four steps to legible governance</h2>
        </div>

        <div className="steps stagger">
          {methods.map((item) => (
            <div key={item.step} className="step reveal">
              <div className="step-number">{item.step}</div>
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
          <p className="eyebrow">Deliverables</p>
          <h2>Artifacts that make governance credible</h2>
          <p className="body-sm">
            What persuades is not trust language. It is a document set that makes governance legible, testable, and easy to review.
          </p>
        </div>

        <div className="grid-4 stagger">
          {artifacts.map((item) => (
            <div key={item.title} className="card reveal">
              <div className="card-icon">
                <item.icon />
              </div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="section" style={{ background: 'var(--color-bg-alt)' }}>
      <div className="container">
        <div className="section-header reveal">
          <p className="eyebrow">Start here</p>
          <h2>Choose the route that matches the pressure</h2>
        </div>

        <div className="grid-3 stagger">
          {routes.map((item) => (
            <Link key={item.title} to={item.to} className="card card-dark reveal">
              <div className="card-icon">
                <item.icon />
              </div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <div style={{ marginTop: '20px', fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-accent)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                {item.cta}
                <ArrowRight size={14} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>

    <section className="section">
      <div className="container">
        <div className="cta-banner reveal">
          <h2>Make governance legible before it gets tested</h2>
          <p className="body-sm">The first engagement identifies what can already be evidenced, what is missing, and what should stay narrow for now.</p>
          <div className="btn-row">
            <Link to="/connect" className="btn-primary">
              Book a debrief
              <ArrowRight />
            </Link>
            <Link to="/services" className="btn-secondary">View services</Link>
          </div>
        </div>
      </div>
    </section>
  </div>
);

export default Home;
