import { Link } from 'react-router-dom';
import { ArrowRight, FileCheck2, Search, ShieldCheck } from 'lucide-react';

const practiceCards = [
  {
    icon: Search,
    title: 'Classify risk',
    description: 'Build inventories aligned with the Algorithmic Impact Assessment, then tier by impact levels that satisfy both federal and Quebec requirements.'
  },
  {
    icon: ShieldCheck,
    title: 'Design controls',
    description: 'Define decision rights and approvals that meet Treasury Board expectations and Law 25 automated decision-making provisions.'
  },
  {
    icon: FileCheck2,
    title: 'Maintain evidence',
    description: 'Keep documentation current as Canadian AI rules, directives, and oversight expectations continue to evolve.'
  }
];

const dailyCards = [
  {
    title: 'Read systems closely',
    description: 'Examine decision flows, opaque zones, delegation points, and what the evidence layer actually allows others to reconstruct.'
  },
  {
    title: 'Structure controls',
    description: 'Define decision rights, review gates, and a maintenance cadence that fits real operational work.'
  },
  {
    title: 'Maintain proof',
    description: 'Build the documentation layer that lets teams answer pressure without improvising.'
  }
];

const expertiseAreas = [
  { title: 'Governance', items: ['AI Risk Classification', 'Decision Rights Design', 'Governance Operating Models', 'Lifecycle Gates'] },
  { title: 'Evidence', items: ['Audit Documentation', 'Evidence Architecture', 'Traceability Systems', 'Reconstruction Capability'] },
  { title: 'Controls', items: ['Control Register Design', 'Testing Expectations', 'Monitoring Frameworks', 'Threshold Management'] },
  { title: 'Procurement', items: ['Vendor Due Diligence', 'Questionnaire Design', 'Contract Requirements', 'Reassessment Protocols'] }
];

const About = () => (
  <div data-testid="about-page">
    <div className="page-hero">
      <div className="container">
        <div className="about-hero-split">
          <div>
            <p className="eyebrow" style={{ marginBottom: '16px' }}>About</p>
            <h1>A governance practice built for legibility</h1>
            <p className="body-lg" style={{ marginTop: '20px' }}>
              The work is to make systems, decisions, and evidence clear enough to hold up under scrutiny.
            </p>
            <div className="divider" />
            <p className="body-sm">
              Governance built for the Canadian context, including federal directives, Quebec&apos;s Law 25, and the distinct requirements of operating in Canada&apos;s AI ecosystem.
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
            <div style={{ background: 'var(--color-bg-alt)', borderRadius: 'var(--radius-lg)', padding: '32px' }}>
              <p className="eyebrow" style={{ marginBottom: '16px' }}>About me</p>
              <h2 style={{ fontSize: '1.75rem', marginBottom: '16px' }}>Martin Lepage, PhD</h2>
              <p className="body-sm">
                Martin Lepage is a Montreal-based AI governance consultant operating at the intersection of federal and Quebec regulatory requirements. Based in Canada&apos;s AI hub, he helps organizations build governance systems that satisfy Treasury Board directives, Law 25 obligations, and evolving public- and private-sector scrutiny while remaining practical to operate.
              </p>
              <div className="divider" />
              <p className="body-sm" style={{ marginTop: '16px' }}>
                The practice combines system reading, documentation structure, and control discipline. The goal is not to produce more theory. The goal is to help organizations answer clearly when a customer, auditor, or decision-maker asks how AI is actually governed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <section className="section">
      <div className="container">
        <div className="section-header reveal">
          <p className="eyebrow">How the practice operates</p>
          <h2>What AI governance practice means in Canada</h2>
          <p className="body-sm">
            AI governance in Canada is a system aligned with Treasury Board directives, Quebec&apos;s automated decision-making requirements under Law 25, and the evidence expectations surrounding deployed AI systems.
          </p>
        </div>

        <div className="grid-3 stagger">
          {practiceCards.map((item) => (
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
          <p className="eyebrow">In practice</p>
          <h2>What that looks like day to day</h2>
        </div>

        <div className="grid-3 stagger">
          {dailyCards.map((item) => (
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
          <p className="eyebrow">Areas of expertise</p>
          <h2>Where the work concentrates</h2>
        </div>

        <div className="expertise-grid stagger">
          {expertiseAreas.map((item) => (
            <div key={item.title} className="expertise-card reveal">
              <h4>{item.title}</h4>
              <ul>
                {item.items.map((entry) => (
                  <li key={entry}>{entry}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="section" style={{ background: 'var(--color-bg-alt)' }}>
      <div className="container">
        <div className="section-header reveal">
          <p className="eyebrow">Featured research</p>
          <h2>The Sealed Card Protocol</h2>
          <p className="body-sm">
            A framework for analyzing how legitimacy is established in the context of generative AI, examining mediation, authenticity, and accountability at the seam where evaluation shifts from artifact to pathway.
          </p>
        </div>
        <div className="reveal" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link to="/sealed-card" className="btn-dark">
            Read the protocol
            <ArrowRight />
          </Link>
          <Link to="/connect" className="btn-outline">Discuss the work</Link>
        </div>
      </div>
    </section>

    <section className="section">
      <div className="container">
        <div className="cta-banner reveal">
          <h2>Discuss your governance needs</h2>
          <p className="body-sm">Whether you&apos;re establishing governance foundations, preparing for audit, or managing vendor AI risk.</p>
          <div className="btn-row">
            <Link to="/connect" className="btn-primary">
              Book a debrief
              <ArrowRight />
            </Link>
          </div>
        </div>
      </div>
    </section>
  </div>
);

export default About;
