import { Link } from 'react-router-dom';

const FAQ = () => {
  const faqs = [
    {
      question: "What is an AI Governance Practice?",
      answer: "It's the simple, steady way you make sure AI is used with care in your organization. Not a big scary rulebook. More like a set of habits that help people build and buy AI without panic: you decide what's low risk and what's high risk, you put a few common-sense checks in place, you're clear about who gets to say \"yes\" (and who needs to be in the loop), and you keep enough notes that you can later show you were paying attention."
    },
    {
      question: "Is this policy work or operational work?",
      answer: "It's mostly operational. Policies matter, but only if they turn into steps teams can actually follow while they work. If it doesn't fit how people already ship things, it won't happen. So we start by making it easy: a clear path, a few decision points, and lightweight documentation that doesn't feel like punishment."
    },
    {
      question: "What do auditors and procurement teams actually want?",
      answer: "They want to feel safe saying \"yes.\" They're looking for calm, boring proof that someone was responsible on purpose: who made the call, how you decided the risk level, what checks you did, how you handled edge cases, and how you keep an eye on things after launch. Think \"receipts,\" not \"trust us.\"",
      cta: { text: "Request the Audit Checklist (PDF)", type: "link" }
    },
    {
      question: "How do you handle third-party/vendor AI?",
      answer: "We take the pressure off your team by making vendor review predictable. We ask for the right info up front, set simple pass or pause thresholds, and bake it into procurement so it's the same each time. That way you're not scrambling at the last minute trying to figure out what a vendor will and won't tell you."
    },
    {
      question: "Will governance slow our teams down?",
      answer: "If it's done badly, yes, it becomes a speed bump. If it's done well, it's more like a guardrail. It reduces rework, prevents surprise escalations, and helps teams move forward with confidence because they know what's expected. The vibe is: I'll take care of you, you just keep building."
    },
    {
      question: "What's a typical engagement?",
      answer: "We usually start by getting a clear picture of what you're doing today and what could go wrong. Then we set up a simple risk \"traffic light,\" add a small set of checks that match your reality, and name who owns what. After that, we keep things warm with a light ongoing cadence so your documentation and oversight stay current as tools, vendors, and priorities change.",
      cta: { buttons: [
        { text: "Assess readiness", link: "/tool", primary: true },
        { text: "View services", link: "/services" },
        { text: "Book a debrief", link: "/connect" }
      ]}
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
          Practical answers on risk tiering, controls, evidence, procurement readiness, and vendor oversight.
        </p>
        <p className="text-xs tracking-widest text-gray-400 uppercase mb-12">
          DEFINITIONS · EVIDENCE · ENGAGEMENTS
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
              
              {faq.cta?.type === 'link' && (
                <p className="text-sm">
                  <span className="text-gray-500">Want the evidence list?</span>{' '}
                  <Link to="/connect" className="text-[#1a2744] font-medium hover:underline">
                    {faq.cta.text}
                  </Link>
                </p>
              )}
              
              {faq.cta?.buttons && (
                <div className="flex flex-wrap gap-4 mt-4">
                  {faq.cta.buttons.map((btn, i) => (
                    <Link 
                      key={i}
                      to={btn.link}
                      className={btn.primary ? 'btn-secondary' : 'btn-ghost'}
                    >
                      {btn.text}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
