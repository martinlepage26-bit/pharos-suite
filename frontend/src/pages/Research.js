import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, FileCheck2, Target } from 'lucide-react';

const filters = [
  { key: 'all', label: 'All' },
  { key: 'regulated', label: 'Regulated Systems' },
  { key: 'enterprise', label: 'Enterprise SaaS' },
  { key: 'procurement', label: 'Procurement & Vendor Risk' },
  { key: 'public', label: 'Public Sector' },
  { key: 'financial', label: 'Financial Systems' }
];

const briefings = [
  {
    context: 'regulated',
    date: 'Nov 14, 2024',
    title: 'Hiring Automation as Gatekeeping Infrastructure',
    description: 'An AI system that filters candidates is not a productivity feature. It is gatekeeping infrastructure that allocates opportunity and produces institutional liability.'
  },
  {
    context: 'procurement',
    date: 'Oct 27, 2024',
    title: 'Training Data as Legal Act: The Clearview Problem',
    description: 'Training data provenance is not a technical footnote. It is a legal act with institutional consequences and cross-jurisdiction enforcement risk.'
  },
  {
    context: 'financial',
    date: 'Oct 11, 2024',
    title: 'Zillow and the $500M Lesson in Model Risk',
    description: 'Model failure is not the scandal. The scandal is letting model failure become balance-sheet failure.'
  },
  {
    context: 'public',
    date: 'Sep 24, 2024',
    title: 'The Dutch Scandal: Algorithmic Suspicion and State Collapse',
    description: 'The archetype of what happens when the state operationalizes suspicion through opaque scoring.'
  },
  {
    context: 'regulated',
    date: 'Sep 7, 2024',
    title: 'COMPAS and the Black Box Defense',
    description: 'If a score shapes sentencing outcomes, transparency is not a bonus feature. It is a legitimacy requirement.'
  },
  {
    context: 'enterprise',
    date: 'Aug 21, 2024',
    title: 'Samsung, ChatGPT, and the Prompt as Leak Vector',
    description: 'Shadow AI risk is what happens when institutional policy lags institutional behavior.'
  },
  {
    context: 'enterprise',
    date: 'Aug 4, 2024',
    title: 'Air Canada and the Chatbot That Became Policy',
    description: 'Customer-facing AI does not dilute accountability. It concentrates it.'
  }
];

const methodCards = [
  {
    icon: Target,
    title: 'Spot the signal',
    description: 'Identify the incident, risk, or constraint that requires a governance response.'
  },
  {
    icon: FileCheck2,
    title: 'Translate to a control',
    description: 'Turn the problem into a review expectation, threshold, or documentation requirement.'
  },
  {
    icon: BookOpen,
    title: 'Make it legible',
    description: 'Produce something a customer, auditor, or committee can actually follow.'
  }
];

const Research = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  const visibleBriefings = useMemo(() => {
    if (activeFilter === 'all') return briefings;
    return briefings.filter((item) => item.context === activeFilter);
  }, [activeFilter]);

  return (
    <div data-testid="research-page">
      <div className="page-hero">
        <div className="container">
          <div className="section-header">
            <p className="eyebrow">Research</p>
            <h1>Briefings for scrutiny, review, and control design</h1>
            <p className="body-lg" style={{ marginTop: '16px' }}>
              Each briefing takes a real signal, names the governance pressure it creates, and turns it into control logic teams can apply.
            </p>
          </div>
        </div>
      </div>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-header reveal">
            <p className="eyebrow">Method</p>
            <h2>Start with the pressure, end with a control response</h2>
          </div>

          <div className="grid-3 stagger">
            {methodCards.map((item) => (
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
            <p className="eyebrow">Briefings</p>
            <h2>Browse by context</h2>
            <p className="body-sm">Filter by the operating context behind the request.</p>
          </div>

          <div className="filters reveal">
            {filters.map((item) => (
              <button
                key={item.key}
                type="button"
                className={`filter-pill${activeFilter === item.key ? ' active' : ''}`}
                onClick={() => setActiveFilter(item.key)}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="grid-2 stagger">
            {visibleBriefings.map((item) => (
              <article key={item.title} className="research-card reveal visible">
                <div className="research-meta">
                  <span className="research-tag">Briefing</span>
                  <span className="research-date">{item.date}</span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cta-banner reveal">
            <h2>Facing a similar challenge?</h2>
            <p className="body-sm">A debrief can help translate the signal into control logic that fits your operating context.</p>
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
};

export default Research;
