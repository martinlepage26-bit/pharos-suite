const About = () => {
  const practiceSteps = [
    {
      number: 1,
      title: "Classify risk",
      description: "Build a use-case and vendor inventory, then tier by impact, sensitivity, autonomy, and exposure."
    },
    {
      number: 2,
      title: "Design controls",
      description: "Define decision rights, approvals, testing expectations, monitoring, and ownership (RACI)."
    },
    {
      number: 3,
      title: "Maintain evidence",
      description: "Keep documentation current as models, prompts, data, and vendors change."
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fc] py-12 px-6 md:px-12" data-testid="about-page">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <h1 className="font-serif text-4xl md:text-5xl font-semibold text-[#1a2744] mb-4">
          About Me
        </h1>
        <p className="text-gray-600 mb-2 max-w-2xl">
          Governance that is usable under real constraints: decision rights, controls, and documentation that holds under review.
        </p>
        <p className="text-xs tracking-widest text-gray-400 uppercase mb-12">
          PRACTICE · APPROACH · BACKGROUND
        </p>

        {/* What AI Governance Practice means */}
        <div className="card mb-8">
          <h2 className="font-serif text-2xl font-semibold text-[#1a2744] mb-4">
            What AI Governance Practice means
          </h2>
          <p className="text-gray-600 mb-4">
            <span className="font-semibold text-[#1a2744]">AI governance isn't a policy PDF.</span> It is a system people can actually use: a way to classify risk, apply the right controls, define who owns decisions, and keep a record of what was decided, why, and by whom.
          </p>
          <p className="text-gray-600 mb-8">
            <span className="font-semibold text-[#1a2744]">My work</span> is to help you build that system in your organization: map AI use cases, define practical risk tiers, set approvals and decision rights, and deliver templates and documentation buyers and auditors expect.
          </p>

          {/* Practice Steps */}
          <div className="grid md:grid-cols-3 gap-6">
            {practiceSteps.map((step) => (
              <div key={step.number} className="bg-[#f8f9fc] rounded-lg p-5" data-testid={`practice-step-${step.number}`}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#1a2744] font-semibold text-sm border border-gray-200">
                    {step.number}
                  </span>
                  <h3 className="font-serif font-semibold text-[#1a2744] underline">
                    {step.title}
                  </h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* About me */}
        <div className="card">
          <h2 className="font-serif text-2xl font-semibold text-[#1a2744] mb-4">
            About me
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Martin Lepage (PhD) is a Montreal-based AI systems and risk mapping consultant who helps organizations make AI use legible, governable, and defensible. He builds minimum-viable governance that survives real constraints: use-case inventories, risk maps, decision traceability, evaluation criteria, and executive-ready documentation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
