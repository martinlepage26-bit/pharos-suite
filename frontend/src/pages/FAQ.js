import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const FAQ = () => {
  const { t, language } = useLanguage();
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (section, index) => {
    const key = `${section}-${index}`;
    setOpenItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const definitionsFAQ = [
    {
      q: "What is AI governance?",
      a: "AI governance refers to the frameworks, policies, and practices that guide the responsible development, deployment, and oversight of artificial intelligence systems. It ensures AI decisions are documented, reviewable, and defensible."
    },
    {
      q: "What is a risk tier?",
      a: "A risk tier categorizes AI use cases by their potential impact. Higher tiers require more scrutiny, documentation, and approval. Canada's Algorithmic Impact Assessment uses four levels based on rights impact and reversibility."
    },
    {
      q: "What is an evidence trail?",
      a: "An evidence trail is the documented history of decisions, tests, and reviews that support an AI system's deployment. It demonstrates due diligence to auditors, regulators, and stakeholders."
    },
    {
      q: "What is the difference between AI ethics and AI governance?",
      a: "AI ethics focuses on principles and values (fairness, transparency, accountability). AI governance operationalizes these principles through policies, controls, and documentation that can be audited and enforced."
    },
    {
      q: "What is algorithmic accountability?",
      a: "Algorithmic accountability means organizations can explain how their AI systems work, why decisions were made, and who is responsible. It requires documentation, testing, and clear decision rights."
    },
    {
      q: "What is model risk management?",
      a: "Model risk management is the practice of identifying, measuring, and controlling risks from AI/ML models. It includes validation, monitoring, and governance throughout the model lifecycle."
    },
    {
      q: "What is a governance operating model?",
      a: "A governance operating model defines who makes decisions, how they're made, and how they're documented. It includes roles (RACI), approval flows, meeting cadences, and escalation paths."
    },
    {
      q: "What is contestability in AI?",
      a: "Contestability means affected individuals can challenge AI-assisted decisions. Public sector AI often requires appeal pathways and human review options for consequential decisions."
    },
    {
      q: "What is human oversight in AI?",
      a: "Human oversight ensures humans remain in control of AI systems, especially for high-risk decisions. It ranges from human-in-the-loop (approval required) to human-on-the-loop (monitoring with intervention capability)."
    },
    {
      q: "What is a control register?",
      a: "A control register documents all governance controls, their owners, testing frequency, and evidence requirements. It's the operational backbone of AI governance and audit readiness."
    }
  ];

  const evidenceFAQ = [
    {
      q: "What documentation do I need for AI governance?",
      a: <>Start with a use case inventory, risk classifications, and decision logs. See our <Link to="/library" className="text-[#7b2cbf] hover:underline">Library</Link> for frameworks and templates.</>
    },
    {
      q: "How do I prepare for an AI audit?",
      a: <>Build an evidence trail: document decisions, test results, and approvals. Our <Link to="/services/menu" className="text-[#7b2cbf] hover:underline">Controls and Evidence Pack</Link> helps organizations prepare for audit scrutiny.</>
    },
    {
      q: "What is procurement asking about AI?",
      a: "Procurement teams increasingly ask about AI risk management, bias testing, data governance, and incident response. Having documented controls demonstrates governance maturity."
    },
    {
      q: "How often should I review AI systems?",
      a: "High-risk systems need quarterly reviews minimum. Lower-risk systems can be annual. Changes in data, model performance, or business context should trigger ad-hoc reviews."
    },
    {
      q: "What evidence do regulators expect?",
      a: "Regulators expect documentation of: risk assessment, testing and validation, human oversight mechanisms, incident response procedures, and ongoing monitoring results."
    },
    {
      q: "How do I document AI decisions?",
      a: "Maintain a decision log capturing: what was decided, who decided, what evidence supported it, what alternatives were considered, and what approval was obtained."
    },
    {
      q: "What is a model card?",
      a: "A model card is standardized documentation describing a model's intended use, performance characteristics, limitations, and ethical considerations. It supports transparency and accountability."
    },
    {
      q: "How do I demonstrate fairness in AI?",
      a: "Document your fairness criteria, test across demographic groups, monitor for drift, and maintain records of bias assessments and mitigation steps taken."
    },
    {
      q: "What records should I keep and for how long?",
      a: "Keep decision logs, test results, and approval records for at least 7 years for high-risk systems. Align retention policies with your sector's regulatory requirements."
    },
    {
      q: "How do I handle AI incidents?",
      a: "Document incidents promptly: what happened, impact assessment, root cause analysis, remediation steps, and lessons learned. Report serious incidents per regulatory requirements."
    }
  ];

  const engagementsFAQ = [
    {
      q: "What does a governance engagement include?",
      a: <>Engagements typically include discovery, framework development, control design, and documentation. See our <Link to="/services/menu" className="text-[#7b2cbf] hover:underline">Service Offers</Link> for package details.</>
    },
    {
      q: "How long does it take to establish AI governance?",
      a: "Initial governance foundation takes 4-8 weeks. Full controls and evidence packs take 8-12 weeks. Timelines depend on organizational complexity and existing maturity."
    },
    {
      q: "Do I need AI governance if I only use vendor AI?",
      a: "Yes. Vendor AI still requires governance: due diligence, contract requirements, monitoring, and incident response. You're accountable for AI decisions even when using third-party systems."
    },
    {
      q: "What's the difference between advisory and assessment?",
      a: <>Advisory provides guidance and recommendations. Assessment evaluates current state against standards. Our <Link to="/tool" className="text-[#7b2cbf] hover:underline">Readiness Snapshot</Link> offers a preliminary self-assessment.</>
    },
    {
      q: "How do I know which package I need?",
      a: <>Start with the <Link to="/tool" className="text-[#7b2cbf] hover:underline">Readiness Snapshot</Link>, then book a <Link to="/connect" className="text-[#7b2cbf] hover:underline">debrief</Link> to discuss your specific situation and requirements.</>
    },
    {
      q: "Can governance work with agile delivery?",
      a: "Yes. Good governance integrates with delivery cadences. Our approach emphasizes lightweight controls that prevent drift without blocking deployment velocity."
    },
    {
      q: "What if I'm already in production?",
      a: "Most organizations are. We help establish governance for existing systems while building sustainable practices for new deployments. Prioritize highest-risk systems first."
    },
    {
      q: "Do you work with specific sectors?",
      a: <>Yes. We serve regulated systems, financial services, public sector, healthcare, construction, and enterprise SaaS. See <Link to="/cases" className="text-[#7b2cbf] hover:underline">Portfolio</Link> for sector examples.</>
    },
    {
      q: "What Canadian requirements should I know about?",
      a: <>Key frameworks include: Quebec's Law 25, Treasury Board Directive on Automated Decision-Making, and the proposed AIDA. See our <Link to="/library" className="text-[#7b2cbf] hover:underline">Library</Link> for resources.</>
    },
    {
      q: "How do I get started?",
      a: <>Take the <Link to="/tool" className="text-[#7b2cbf] hover:underline">Readiness Snapshot</Link> for a preliminary assessment, then <Link to="/connect" className="text-[#7b2cbf] hover:underline">book a debrief</Link> to discuss next steps.</>
    }
  ];

  const renderFAQSection = (title, items, sectionKey) => (
    <div className="mb-12">
      <h2 className="font-serif text-2xl font-semibold text-[#0B0F1A] mb-6">{title}</h2>
      <div className="space-y-3">
        {items.map((item, index) => {
          const isOpen = openItems[`${sectionKey}-${index}`];
          return (
            <div key={index} className="bg-white rounded-xl border border-gray-100 shadow-[0_2px_8px_rgba(11,15,26,0.04)] overflow-hidden card-hover-lift">
              <button
                onClick={() => toggleItem(sectionKey, index)}
                className="w-full text-left p-4 flex items-center justify-between gap-4 hover:bg-[#7b2cbf]/5 transition-colors"
                data-testid={`faq-${sectionKey}-${index}`}
              >
                <span className="font-medium text-[#0B0F1A]">{item.q}</span>
                {isOpen ? (
                  <ChevronUp className="w-5 h-5 text-[#7b2cbf] flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                )}
              </button>
              {isOpen && (
                <div className="px-4 pb-4 text-gray-600 border-t border-gray-100 pt-3">
                  {item.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F6F7FB] py-12 px-6 md:px-12" data-testid="faq-page">
      <div className="max-w-4xl mx-auto">
        <h1 className="page-title mb-4">Frequently Asked Questions</h1>
        <p className="text-gray-600 mb-2 max-w-2xl">
          Common questions about AI governance, evidence requirements, and working together.
        </p>
        <p className="text-xs tracking-widest text-[#7b2cbf] uppercase mb-12">
          DEFINITIONS · EVIDENCE · ENGAGEMENTS
        </p>

        {renderFAQSection('Definitions', definitionsFAQ, 'definitions')}
        {renderFAQSection('Evidence', evidenceFAQ, 'evidence')}
        {renderFAQSection('Engagements', engagementsFAQ, 'engagements')}

        <div className="bg-[linear-gradient(135deg,#0D0A2E_0%,#0D0A2E_40%,#1A1555_70%,#2D2380_100%)] rounded-xl p-6 shadow-[0_8px_32px_rgba(42,32,107,0.4)] relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_30%,rgba(255,255,255,0.1)_50%,transparent_70%)] pointer-events-none"></div>
          <h3 className="font-serif text-xl font-semibold mb-2 text-white">Still have questions?</h3>
          <p className="text-white/80 mb-4">Book a debrief to discuss your specific governance challenges.</p>
          <Link to="/connect" className="inline-block bg-white text-[#0B0F1A] px-5 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
            Book a Debrief
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FAQ;

