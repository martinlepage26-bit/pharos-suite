import { Link } from 'react-router-dom';
import { ArrowRight, BriefcaseBusiness, Building2, FileCheck2, FolderSearch, Radar, Scale, ShieldCheck, Waypoints } from 'lucide-react';
import LighthouseGlyph from '../components/LighthouseGlyph';
import SignalStrip from '../components/SignalStrip';

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
    to: '/services#deterministic-governance'
  },
  {
    icon: Building2,
    title: 'Run a pre-mortem review',
    description: 'For teams that want to pressure-test systems before launch, procurement, or major expansion.',
    cta: 'View service',
    to: '/services#pre-mortem-review'
  },
  {
    icon: Scale,
    title: 'Run a post-mortem review',
    description: 'For teams responding to incidents, failed reviews, audit findings, or governance drift.',
    cta: 'View service',
    to: '/services#post-mortem-review'
  }
];

const reviewNeeds = [
  {
    title: 'Deterministic decision rights',
    description: 'Clear approvers, escalation logic, and recorded decisions.'
  },
  {
    title: 'Thresholds that do not drift by reviewer',
    description: 'Review conditions that stay stable across teams and over time.'
  },
  {
    title: 'Evidence packet ready',
    description: 'Materials a buyer, auditor, or committee can actually follow.'
  },
  {
    title: 'Reconstructible post-mortem path',
    description: 'A record that shows what happened, why, and what changes next.'
  }
];

const heroSignals = [
  {
    label: 'Best for',
    title: 'Teams facing live review pressure',
    description: 'Built for procurement, audit, vendor diligence, and executive oversight that need a governance answer now.'
  },
  {
    label: 'What PHAROS does',
    title: 'Turns pressure into control logic',
    description: 'PHAROS clarifies thresholds, decision rights, and evidence paths so governance can be inspected instead of narrated.'
  },
  {
    label: 'Start with',
    title: 'A short review',
    description: 'The first review identifies what can already be evidenced, what is missing, and which service route fits.'
  }
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
            When procurement, audit, or a board asks how AI is governed, PHAROS helps teams answer with evidence, deterministic decision rights, and review-ready documentation.
          </p>
          <div className="hero-cta-row">
            <Link to="/connect" className="btn-primary">
              Book a review
              <ArrowRight />
            </Link>
            <Link to="/services" className="btn-secondary">View services</Link>
          </div>
          <div className="jump-links">
            <a href="#review-needs" className="jump-pill">Review posture</a>
            <a href="#pressure-points" className="jump-pill">Pressure points</a>
            <a href="#method" className="jump-pill">Method</a>
            <a href="#service-routes" className="jump-pill">Service routes</a>
          </div>
          <SignalStrip items={heroSignals} className="signal-grid-hero" />
        </div>
      </div>
    </section>

    <section className="section" id="review-needs" style={{ scrollMarginTop: '108px' }}>
      <div className="container">
        <div className="section-header reveal">
          <p className="eyebrow">What review bodies need to see</p>
          <h2>A deterministic governance posture that stays legible under pressure</h2>
          <p className="body-sm">
            Decision rights, thresholds, controls, and evidence should remain easy to follow when scrutiny arrives.
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
              <div key={item.title} className="scope-note">
                <strong>{item.title}</strong>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    <section className="section" id="pressure-points" style={{ scrollMarginTop: '108px' }}>
      <div className="container">
        <div className="section-header reveal">
          <p className="eyebrow">Pressure points</p>
          <h2>Scrutiny creates friction at four points</h2>
          <p className="body-sm">
            Governance work rarely starts in the abstract. It starts when a deal, review, or oversight request exposes non-determinism in decisions, thresholds, or documentation.
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

    <section className="section" id="method" style={{ background: 'var(--color-bg-alt)', scrollMarginTop: '108px' }}>
      <div className="container">
        <div className="section-header reveal">
          <p className="eyebrow">Method</p>
          <h2>Four steps to deterministic governance</h2>
          <p className="body-sm">
            Read the system, set the thresholds, route the work, and keep the resulting posture reconstructable.
          </p>
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

    <section className="section" id="service-routes" style={{ background: 'var(--color-bg-alt)', scrollMarginTop: '108px' }}>
      <div className="container">
        <div className="section-header reveal">
          <p className="eyebrow">Start here</p>
          <h2>Choose the route that matches the pressure</h2>
          <p className="body-sm">
            Start with the source of scrutiny, then follow the service path that fits the pressure and the state of the evidence.
          </p>
        </div>

        <div className="grid-3 stagger">
          {routes.map((item) => (
            <Link key={item.title} to={item.to} className="card card-dark reveal">
              <div className="card-icon">
                <item.icon />
              </div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <div className="card-link-row">
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
