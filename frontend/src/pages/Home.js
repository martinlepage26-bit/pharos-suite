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
    title: 'Read the system',
    description: 'Map the system, dependencies, actors, and the exact source of pressure before governance claims start to drift.'
  },
  {
    step: '02',
    title: 'Set deterministic thresholds',
    description: 'Make thresholds, stakes, and review conditions explicit enough that different reviewers land on the same logic.'
  },
  {
    step: '03',
    title: 'Assign the response path',
    description: 'Route the work into deterministic governance, a pre-mortem, or a post-mortem with named decisions and outputs.'
  },
  {
    step: '04',
    title: 'Keep it reconstructible',
    description: 'Maintain an evidence trail and operating cadence so the posture still holds when a later review asks how the decision was made.'
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
    title: 'Threshold map',
    description: 'Defines which systems require deeper review, when they escalate, and why the threshold changes.'
  },
  {
    icon: FolderSearch,
    title: 'Review packet',
    description: 'Assembles the materials an auditor, customer, or committee can follow.'
  },
  {
    icon: Waypoints,
    title: 'Post-mortem record',
    description: 'Reconstructs what happened, what failed, and which controls or thresholds need to change next.'
  }
];

const routes = [
  {
    icon: BriefcaseBusiness,
    title: 'Establish deterministic governance',
    description: 'For teams that need explicit decision rights, thresholds, and evidence paths before scrutiny arrives.',
    cta: 'View service',
    to: '/services'
  },
  {
    icon: Building2,
    title: 'Run a pre-mortem review',
    description: 'For teams that want to pressure-test systems before launch, procurement, or major expansion.',
    cta: 'View services',
    to: '/services'
  },
  {
    icon: Scale,
    title: 'Run a post-mortem review',
    description: 'For teams responding to incidents, failed reviews, audit findings, or governance drift.',
    cta: 'Book a review',
    to: '/connect'
  }
];

const reviewNeeds = [
  'Deterministic decision rights',
  'Thresholds that do not drift by reviewer',
  'Evidence packet ready',
  'Reconstructible post-mortem path'
];

const Home = () => (
  <div data-testid="home-page">
    <section className="hero">
      <LighthouseGlyph className="hero-watermark" title="" />

      <div className="container">
        <div className="hero-content">
          <div className="brand-kicker" style={{ marginBottom: '20px', opacity: 0, transform: 'translateY(30px)', animation: 'fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.05s forwards' }}>
            <LighthouseGlyph className="brand-kicker-mark" title="" />
            <span>PHAROS AI GOVERNANCE</span>
          </div>
          <h1>Deterministic AI governance under pressure</h1>
          <p className="body-lg">
            When procurement, audit, or the board asks how AI is governed, PHAROS helps your team answer with evidence, deterministic decision rights, and review-ready documentation.
          </p>
          <div className="hero-cta-row">
            <Link to="/connect" className="btn-primary">
              Book a review
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
          <h2>A deterministic governance posture that stays legible under pressure</h2>
          <p className="body-sm">
            Decision rights, thresholds, controls, and evidence should stay easy to follow when scrutiny arrives.
          </p>
        </div>

        <div className="editorial-panel reveal">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
            <div className="card-icon" style={{ width: '56px', height: '56px', marginBottom: 0 }}>
              <LighthouseGlyph className="nav-logo" title="PHAROS review mark" />
            </div>
            <div>
              <p className="eyebrow" style={{ marginBottom: '8px' }}>PHAROS</p>
              <h3 style={{ marginBottom: 0 }}>Determinism before pressure</h3>
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
            Governance work rarely starts in the abstract. It starts when a deal, review, or oversight request exposes non-determinism in decisions, thresholds, and documentation.
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
          <h2>Four steps to deterministic governance</h2>
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
            What persuades is not trust language. It is a document set that makes governance deterministic, testable, and easy to review.
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
          <h2>Make governance deterministic before it gets tested</h2>
          <p className="body-sm">The first review identifies what can already be evidenced, what is missing, and whether the work belongs in deterministic governance, a pre-mortem, or a post-mortem.</p>
          <div className="btn-row">
            <Link to="/connect" className="btn-primary">
              Book a review
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
