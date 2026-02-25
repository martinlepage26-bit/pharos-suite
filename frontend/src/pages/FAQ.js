import { Link } from 'react-router-dom';

const FAQ = () => {
  const faqs = [
    {
      question: "What is AI Governance Practice?",
      answer: "AI governance practice is the operational system that makes AI use legible, controllable, and defensible in your organization. It's not a policy document that sits in a drawer. It's a set of working structures: how you classify risk, who approves what, what controls apply at each tier, and how you maintain evidence that decisions were made responsibly. The goal is a system people can actually follow while they work—not a compliance burden that gets ignored until something goes wrong."
    },
    {
      question: "What's the difference between AI governance and AI ethics?",
      answer: "AI ethics is about values and principles—what you believe AI should and shouldn't do. AI governance is about operationalization—how you translate those principles into decision rights, controls, and evidence. Ethics tells you that fairness matters. Governance tells you who reviews the fairness metrics, what thresholds trigger escalation, and where the documentation lives. Both matter, but governance is what makes ethics enforceable."
    },
    {
      question: "What do auditors and procurement teams actually want?",
      answer: "They want to feel confident saying yes. They're looking for evidence that someone was responsible on purpose: documented risk classification, clear decision authority, defined controls, testing records, and monitoring plans. They want to see that you knew what could go wrong and built structures to catch it. The key insight is that auditors don't evaluate intentions—they evaluate artifacts. If you can't produce the evidence, the governance didn't happen.",
      cta: { text: "Request the Audit Checklist", link: "/connect" }
    },
    {
      question: "How do you handle third-party/vendor AI?",
      answer: "Vendor AI requires the same governance discipline as internal AI, but with additional controls around visibility, contractual requirements, and reassessment triggers. We build vendor review frameworks that include: due diligence questionnaires, evaluation criteria mapped to your risk tiers, contractual language for auditability and change notification, and integration-level monitoring. The goal is leverage—you can say yes to vendors without surrendering your ability to govern what they do inside your organization."
    },
    {
      question: "Will governance slow our teams down?",
      answer: "Bad governance slows teams down. Good governance accelerates them by removing uncertainty. When teams know the rules—what's allowed, what requires approval, what documentation is expected—they stop negotiating the same questions repeatedly. Governance done right is a guardrail, not a speed bump. It reduces rework, prevents surprise escalations, and builds the audit trail as you go rather than scrambling to reconstruct it later."
    },
    {
      question: "What's a typical engagement look like?",
      answer: "Most engagements start with a diagnostic: what AI systems exist, what governance structures are in place, and what gaps create risk. Then we build incrementally: risk classification first, then decision rights and approval flows, then controls mapped to tiers, then evidence architecture. The output is a governance operating model your teams can execute. For ongoing support, the Oversight Retainer keeps governance current as your AI portfolio evolves.",
      cta: { buttons: [
        { text: "Assess readiness", link: "/tool", primary: true },
        { text: "View services", link: "/services" },
        { text: "Book a debrief", link: "/connect" }
      ]}
    },
    {
      question: "How do I know if my organization needs AI governance?",
      answer: "If you're deploying AI systems that affect customers, employees, or business decisions, you need governance. The question isn't whether—it's how much. Start with: Do you have an inventory of AI use cases? Can you classify them by risk? Do you know who can approve what? Can you produce evidence of your controls? If the answer to any of these is 'no' or 'not sure,' governance work is overdue."
    },
    {
      question: "What's the relationship between AI governance and model risk management?",
      answer: "Model risk management (MRM) is a specific discipline, often required in financial services, focused on the technical validation and monitoring of models. AI governance is broader—it includes MRM but also covers decision rights, procurement, vendor management, documentation standards, and organizational accountability. Think of MRM as one control domain within the larger governance architecture."
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fc] py-12 px-6 md:px-12" data-testid="faq-page">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <h1 className="font-serif text-4xl md:text-5xl font-semibold text-[#1a2744] mb-4">
          FAQ
        </h1>
        <p className="text-gray-600 mb-2 max-w-2xl">
          Practical answers on AI risk classification, governance operations, audit readiness, vendor oversight, and evidence architecture.
        </p>
        <p className="text-xs tracking-widest text-gray-400 uppercase mb-12">
          GOVERNANCE · CONTROLS · EVIDENCE · OPERATIONS
        </p>

        {/* FAQ Items */}
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="card" data-testid={`faq-${index}`}>
              <h2 className="font-serif text-xl font-semibold text-[#1a2744] mb-4">
                {faq.question}
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                {faq.answer}
              </p>
              
              {faq.cta?.text && (
                <Link 
                  to={faq.cta.link} 
                  className="text-[#6366f1] font-medium hover:underline text-sm"
                >
                  {faq.cta.text} →
                </Link>
              )}
              
              {faq.cta?.buttons && (
                <div className="flex flex-wrap gap-4 mt-4">
                  {faq.cta.buttons.map((btn, i) => (
                    <Link 
                      key={i}
                      to={btn.link}
                      className={btn.primary ? 'btn-primary text-sm' : 'btn-ghost text-sm'}
                    >
                      {btn.text}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 p-6 bg-gradient-to-r from-[#1a2744] to-[#6366f1] rounded-2xl text-white">
          <h3 className="font-serif text-xl font-semibold mb-2">Still have questions?</h3>
          <p className="text-white/80 mb-4">
            Book a 30-minute debrief to discuss your specific governance challenges.
          </p>
          <Link to="/connect" className="inline-block bg-white text-[#1a2744] px-5 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
            Book a Debrief
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
