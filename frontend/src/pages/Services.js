import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BriefcaseBusiness, Clock3, Radar } from 'lucide-react';

const packages = [
  {
    eyebrow: 'Package 1',
    title: 'Governance Foundation',
    description: 'For organizations establishing governance for the first time or consolidating across teams.',
    deliverables: [
      'AI use-case and vendor inventory',
      'Tiering logic with examples',
      'Decision rights and approval flow',
      'Governance cadence and upkeep model'
    ],
    outcomes: [
      'A working governance model teams can use immediately',
      'Clearer roles for procurement, audit, and internal review',
      'A defensible baseline for escalation and oversight'
    ]
  },
  {
    eyebrow: 'Package 2',
    title: 'Controls & Evidence',
    description: 'For organizations preparing for procurement scrutiny, internal audit, or formal review.',
    deliverables: [
      'Control register mapped to risk tiers',
      'Testing and monitoring expectations',
      'Vendor review questions and evidence checklist',
      'Decision log template and review packet outline'
    ],
    outcomes: [
      'Documentation structure ready for procurement',
      'Legible evidence expectations for audit',
      'Named owners for controls and upkeep'
    ]
  },
  {
    eyebrow: 'Package 3',
    title: 'Oversight Retainer',
    description: 'For organizations with active AI delivery that want stable oversight as systems evolve.',
    deliverables: [
      'Recurring governance and risk review',
      'Decision log stewardship and evidence cadence',
      'Control roadmap aligned to delivery',
      'Targeted support during procurement or audit'
    ],
    outcomes: [
      'Stable oversight without slowing delivery',
      'Documentation that stays legible as systems change',
      'Usable summaries for leadership and committees'
    ]
  }
];

const scopingCards = [
  {
    title: 'System portfolio',
    description: 'How many systems, vendors, and data pathways are in scope, and how quickly they change.'
  },
  {
    title: 'Review expectations',
    description: 'Questionnaires, audits, contractual obligations, or leadership requests that shape the evidence burden.'
  },
  {
    title: 'Decision authority',
    description: 'The level of autonomy, sensitivity, and impact carried by AI-supported decisions.'
  }
];

const pricingCards = [
  {
    icon: BriefcaseBusiness,
    title: 'Fixed scope',
    description: 'One-time engagements with a defined deliverable set and a clear end date.'
  },
  {
    icon: Radar,
    title: 'Retainer',
    description: 'Ongoing advisory with a monthly cadence, adjusted as systems and review needs evolve.'
  },
  {
    icon: Clock3,
    title: 'Assessment',
    description: 'A short readiness check that produces a signal about where work should begin.'
  }
];

const faqs = [
  {
    question: 'What is the first engagement like?',
    answer: 'A 30-minute debrief to understand the pressure, the context, and what the review is actually asking for. From there, the engagement is scoped with explicit deliverables and a timeline.'
  },
  {
    question: 'Do you replace legal counsel or audit firms?',
    answer: 'No. Govern AI builds the governance structures, documentation, and evidence layers that legal and audit teams review. The work complements counsel; it does not replace it.'
  },
  {
    question: 'How long does a typical engagement take?',
    answer: 'A governance foundation can be delivered in 3 to 6 weeks. Controls and evidence packs typically run 4 to 8 weeks. Retainers are monthly. The timeline depends on the number of systems and the review expectations.'
  },
  {
    question: 'What industries do you work with?',
    answer: 'Financial services, healthcare, public sector, enterprise SaaS, and any organization deploying AI systems that face procurement, audit, or regulatory review. The governance logic adapts to the context while the deliverable standards stay consistent.'
  },
  {
    question: 'Can you support teams outside Canada?',
    answer: 'Yes. The governance frameworks are built to be jurisdiction-aware. The practice is deeply rooted in Canadian requirements, but the underlying logic of risk tiering, decision rights, and evidence architecture applies more broadly.'
  }
];

const Services = () => {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div data-testid="services-page">
      <div className="page-hero">
        <div className="container">
          <div className="section-header">
            <p className="eyebrow">Services</p>
            <h1>Packages structured to answer scrutiny</h1>
            <p className="body-lg" style={{ marginTop: '16px' }}>
              Choose by pressure source, not by vocabulary. The right package is the one that produces the materials the review will actually ask for.
            </p>
          </div>
        </div>
      </div>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-header reveal">
            <p className="eyebrow">Core offers</p>
            <h2>Three engagements for legible governance</h2>
          </div>

          <div className="grid-3 stagger">
            {packages.map((item) => (
              <div key={item.title} className="package reveal">
                <div className="package-header">
                  <p className="eyebrow">{item.eyebrow}</p>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
                <div className="package-body">
                  <p className="package-label">Deliverables</p>
                  <ul className="package-list">
                    {item.deliverables.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                  <p className="package-label">What it produces</p>
                  <ul className="package-list" style={{ marginBottom: 0 }}>
                    {item.outcomes.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--color-bg-alt)' }}>
        <div className="container">
          <div className="section-header reveal">
            <p className="eyebrow">Scoping</p>
            <h2>What changes the scope</h2>
            <p className="body-sm">
              The work shifts with the number of systems, the level of review expected, and the sensitivity of the decisions the AI supports.
            </p>
          </div>

          <div className="grid-3 stagger">
            {scopingCards.map((item) => (
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
            <p className="eyebrow">Pricing</p>
            <h2>How engagements are priced</h2>
            <p className="body-sm">
              Every engagement is scoped and priced after an initial debrief. Pricing reflects the number of systems, the depth of review expected, and the duration of the work.
            </p>
          </div>

          <div className="grid-3 stagger">
            {pricingCards.map((item) => (
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
            <p className="eyebrow">Common questions</p>
            <h2>What clients ask first</h2>
          </div>

          <div style={{ maxWidth: '720px' }} className="reveal">
            {faqs.map((item, index) => {
              const isOpen = index === openFaq;
              return (
                <div key={item.question} className={`faq-item${isOpen ? ' open' : ''}`}>
                  <button className="faq-trigger" type="button" onClick={() => setOpenFaq(isOpen ? -1 : index)}>
                    {item.question}
                    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                      <path d="M10 4v12M4 10h12" strokeLinecap="round" />
                    </svg>
                  </button>
                  <div className="faq-content" style={{ maxHeight: isOpen ? '240px' : '0' }}>
                    <div className="faq-content-inner">{item.answer}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cta-banner reveal">
            <h2>Need help choosing the right entry point?</h2>
            <p className="body-sm">A short debrief is enough to choose the package, the scope, and the first outputs that matter most.</p>
            <div className="btn-row">
              <Link to="/connect" className="btn-primary">
                Book a debrief
                <ArrowRight />
              </Link>
              <Link to="/tool" className="btn-secondary">Assess readiness</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
