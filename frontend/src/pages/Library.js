import { useState } from 'react';
import { BookOpen, Scale, CircleDot, ExternalLink, Wrench, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Library = () => {
  const { t } = useLanguage();
  const [openEntry, setOpenEntry] = useState(null);

  const sectionKeys = ['frameworks', 'legislation', 'standards'];
  const sectionIcons = [BookOpen, Scale, CircleDot];

  const sectionItems = [
    [
      { name: 'NIST AI Risk Management Framework', url: 'https://www.nist.gov/itl/ai-risk-management-framework', tag: 'Framework' },
      { name: 'ISO/IEC 42001 AI Management System', url: 'https://www.iso.org/standard/81230.html', tag: 'Standard' },
      { name: 'IEEE Ethically Aligned Design', url: 'https://ethicsinaction.ieee.org/', tag: 'Guidelines' },
      { name: 'OECD AI Principles', url: 'https://oecd.ai/en/ai-principles', tag: 'Policy' }
    ],
    [
      { name: 'EU AI Act', url: 'https://artificialintelligenceact.eu/', tag: 'Regulation' },
      { name: 'Canada AIDA (Proposed)', url: 'https://ised-isde.canada.ca/site/innovation-better-canada/en/artificial-intelligence-and-data-act', tag: 'Legislation' },
      { name: 'US Executive Order on AI (2023)', url: 'https://www.whitehouse.gov/briefing-room/presidential-actions/2023/10/30/executive-order-on-the-safe-secure-and-trustworthy-development-and-use-of-artificial-intelligence/', tag: 'Executive' },
      { name: 'UK AI Safety Institute', url: 'https://www.gov.uk/government/organisations/ai-safety-institute', tag: 'Government' }
    ],
    [
      { name: 'NIST SP 800-53 (Security Controls)', url: 'https://csrc.nist.gov/publications/detail/sp/800-53/rev-5/final', tag: 'Security' },
      { name: 'Model Cards for Model Reporting', url: 'https://arxiv.org/abs/1810.03993', tag: 'Documentation' },
      { name: 'Datasheets for Datasets', url: 'https://arxiv.org/abs/1803.09010', tag: 'Documentation' }
    ]
  ];

  const annotatedBibliography = [
    {
      title: 'NIST AI Risk Management Framework (AI RMF)',
      org: 'National Institute of Standards and Technology',
      year: '2023',
      type: 'Framework',
      description: 'The NIST AI Risk Management Framework (AI RMF) provides a voluntary, consensus-driven structure for identifying, assessing, and managing AI risks across the lifecycle. Organized around four core functions—Govern, Map, Measure, and Manage—the framework emphasizes trustworthiness characteristics such as validity, safety, security, accountability, and fairness. Unlike prescriptive regulation, the AI RMF is flexible and sector-agnostic, designed for integration into existing enterprise risk management systems. It is complemented by implementation playbooks and crosswalks to other standards.'
    },
    {
      title: 'ISO/IEC 42001',
      org: 'International Organization for Standardization',
      year: '2023',
      type: 'Standard',
      description: 'ISO/IEC 42001 is the first international management system standard (MSS) specifically for AI. Modeled after ISO\'s management system structure (e.g., ISO 27001), it provides requirements for establishing, implementing, maintaining, and continually improving an AI management system (AIMS). It emphasizes risk management, transparency, human oversight, data governance, and lifecycle accountability. Certification is possible, enabling organizations to demonstrate compliance through third-party audits.'
    },
    {
      title: 'Ethically Aligned Design',
      org: 'Institute of Electrical and Electronics Engineers (IEEE)',
      year: '2019',
      type: 'Guidelines',
      description: 'IEEE\'s Ethically Aligned Design (EAD) is a comprehensive set of recommendations for embedding ethical considerations into autonomous and intelligent systems. Developed through global, multi-stakeholder collaboration, EAD addresses human rights, well-being, accountability, data agency, algorithmic bias, and transparency. It influenced subsequent IEEE 7000-series standards on ethical system design and algorithmic bias mitigation.'
    },
    {
      title: 'OECD AI Principles',
      org: 'Organisation for Economic Co-operation and Development',
      year: '2019',
      type: 'Policy',
      description: 'The OECD AI Principles are the first intergovernmental AI policy framework adopted by 40+ countries. They articulate five value-based principles—beneficial AI, human-centered values, transparency, robustness, and accountability—alongside five policy recommendations for governments. The Principles emphasize sustainable development, democratic values, and rule of law. They influenced the G20 AI Principles and national strategies worldwide.'
    },
    {
      title: 'EU AI Act',
      org: 'European Union',
      year: '2024',
      type: 'Regulation',
      description: 'The EU AI Act establishes the world\'s first comprehensive, binding AI regulatory regime. It adopts a risk-based approach categorizing AI systems as unacceptable, high-risk, limited-risk, or minimal-risk. High-risk systems (e.g., critical infrastructure, employment, law enforcement) must meet strict requirements for data governance, transparency, human oversight, conformity assessment, and post-market monitoring.'
    },
    {
      title: 'Artificial Intelligence and Data Act (AIDA)',
      org: 'Government of Canada',
      year: 'Proposed',
      type: 'Legislation',
      description: 'Canada\'s proposed Artificial Intelligence and Data Act (AIDA), introduced as part of Bill C-27, seeks to regulate high-impact AI systems through obligations on risk mitigation, transparency, and harm prevention. It would require organizations to assess and manage risks, maintain documentation, and report serious incidents. AIDA reflects Canada\'s rights-oriented and innovation-supportive approach to AI governance.'
    },
    {
      title: 'Executive Order 14110 on Safe, Secure, and Trustworthy AI',
      org: 'United States Executive Branch',
      year: '2023',
      type: 'Executive Order',
      description: 'Issued in October 2023, Executive Order 14110 directs federal agencies to advance AI safety, security, equity, and innovation. It mandates safety testing and red-teaming for frontier models, establishes reporting requirements for powerful AI systems under the Defense Production Act, and directs NIST to develop evaluation standards. The Order addresses privacy, civil rights, labor impacts, and international collaboration.'
    },
    {
      title: 'UK AI Safety Institute',
      org: 'UK Government',
      year: '2023',
      type: 'Government Initiative',
      description: 'Established by the UK government, the AI Safety Institute (formerly the Frontier AI Taskforce) focuses on evaluating advanced AI models for systemic risks, including misuse and loss-of-control scenarios. It collaborates internationally on model evaluations, safety research, and technical standards. The Institute played a central role in the 2023 UK AI Safety Summit.'
    },
    {
      title: 'NIST Special Publication 800-53',
      org: 'National Institute of Standards and Technology',
      year: '2020',
      type: 'Security Controls',
      description: 'NIST SP 800-53 provides a comprehensive catalog of security and privacy controls for federal information systems and organizations. Although not AI-specific, it is foundational for AI system deployment within regulated environments. Controls address access control, incident response, system integrity, and risk assessment—critical for AI infrastructure security.'
    },
    {
      title: 'Model Cards for Model Reporting',
      org: 'Mitchell et al.',
      year: '2019',
      type: 'Documentation Framework',
      description: 'Model Cards propose standardized documentation for machine learning models. A model card includes intended use, performance metrics across demographic groups, training data characteristics, ethical considerations, and caveats. The framework aims to improve transparency, comparability, and accountability in model deployment.'
    },
    {
      title: 'Datasheets for Datasets',
      org: 'Gebru et al.',
      year: '2018',
      type: 'Documentation Framework',
      description: 'Datasheets for Datasets propose standardized dataset documentation modeled on electronics component datasheets. The framework recommends detailed disclosure of dataset motivation, composition, collection process, preprocessing, distribution, and maintenance. It aims to surface biases, ethical risks, and representational gaps before model training.'
    },
    {
      title: 'AI Incident Database',
      org: 'Partnership on AI / Responsible AI Collaborative',
      year: 'Ongoing',
      type: 'Research Resource',
      description: 'The AI Incident Database (AIID) catalogs real-world AI failures and harms, enabling empirical study of systemic risks. Maintained by a nonprofit initiative, the database aggregates media reports, research findings, and documented case studies. It supports policy development by identifying recurring failure patterns, sociotechnical vulnerabilities, and governance gaps.'
    },
    {
      title: 'Stanford HAI Policy Updates',
      org: 'Stanford Institute for Human-Centered Artificial Intelligence',
      year: 'Annual',
      type: 'Research',
      description: 'Stanford HAI publishes annual AI Index Reports and policy trackers that synthesize global AI governance trends, funding patterns, technical advances, and regulatory developments. Its policy updates provide data-driven insights into legislative activity, model capabilities, workforce impacts, and international competition.'
    },
    {
      title: 'AI Now Institute Reports',
      org: 'AI Now Institute',
      year: 'Annual',
      type: 'Research',
      description: 'The AI Now Institute produces influential reports examining AI\'s social impacts, particularly on labor, civil rights, surveillance, and public sector use. Its scholarship emphasizes power asymmetries, corporate concentration, and structural inequities in AI deployment. AI Now advocates stronger regulatory oversight, public accountability, and participatory governance.'
    },
    {
      title: 'Partnership on AI',
      org: 'Partnership on AI Consortium',
      year: 'Ongoing',
      type: 'Industry Initiative',
      description: 'Partnership on AI (PAI) is a multi-stakeholder consortium including technology firms, civil society organizations, and academic institutions. It develops best-practice guidance on responsible AI development, content authenticity, fairness, and safety. PAI facilitates cross-sector dialogue and publishes case studies and implementation frameworks.'
    },
    {
      title: 'Future of Life Institute',
      org: 'Future of Life Institute',
      year: 'Ongoing',
      type: 'Policy Advocacy',
      description: 'The Future of Life Institute (FLI) is a nonprofit focused on mitigating existential and catastrophic risks from advanced technologies, including AI. It has organized open letters and policy advocacy campaigns calling for responsible scaling, safety research, and governance of frontier AI systems. FLI supports research on long-term AI alignment and collaborates with policymakers on safety-oriented regulation.'
    }
  ];

  const onlineTools = [
    { name: 'Treasury Board AIA Tool', url: 'https://www.canada.ca/en/government/system/digital-government/digital-government-innovations/responsible-use-ai/algorithmic-impact-assessment.html', tag: 'Assessment', description: 'Algorithmic Impact Assessment for federal systems' },
    { name: 'NIST AI RMF Playbook', url: 'https://airc.nist.gov/AI_RMF_Knowledge_Base/Playbook', tag: 'Implementation', description: 'Practical guidance for AI risk management' },
    { name: 'Model Card Toolkit', url: 'https://github.com/tensorflow/model-card-toolkit', tag: 'Documentation', description: 'Generate standardized model documentation' },
    { name: 'Compass AI', url: 'https://compass.ai/', tag: 'Platform', description: 'AI governance and compliance platform' }
  ];

  return (
    <div className="min-h-screen bg-[#F6F7FB] py-12 px-6 md:px-12" data-testid="library-page">
      <div className="max-w-5xl mx-auto">
        <h1 className="page-title mb-4">{t.library.title}</h1>
        <p className="text-gray-600 mb-2 max-w-2xl">{t.library.description}</p>
        <p className="text-xs tracking-widest text-[#7b2cbf] uppercase mb-12">{t.library.keywords}</p>

        <div className="space-y-6 mb-12">
          {sectionKeys.map((key, idx) => {
            const Icon = sectionIcons[idx];
            return (
              <div key={key} className="bg-white border-l-4 border-[#0D0A2E] rounded-xl shadow-[0_4px_16px_rgba(11,15,26,0.06)] p-5 card-hover-lift" data-testid={`library-section-${idx}`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0D0A2E]/15 to-[#2D2380]/10 flex items-center justify-center"><Icon className="w-5 h-5 text-[#0D0A2E]" /></div>
                  <h2 className="font-semibold text-xl text-[#0B0F1A]" style={{fontFamily: "'IBM Plex Sans', system-ui, sans-serif"}}>{t.library.sections[key]}</h2>
                </div>
                <div className="space-y-2">
                  {sectionItems[idx].map((item, i) => (
                    <a key={i} href={item.url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-[#F6F7FB] to-[#F6F7FB]/50 hover:from-[#0D0A2E]/8 hover:to-[#2D2380]/5 border border-transparent hover:border-[#0D0A2E]/10 transition-all group" data-testid={`library-item-${idx}-${i}`}>
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-gray-800 group-hover:text-[#0D0A2E] transition-colors">{item.name}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-[#0D0A2E]/10 text-[#0D0A2E]/70 font-medium">{item.tag}</span>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-[#0D0A2E] transition-colors" />
                    </a>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Online Tools Section */}
          <div className="bg-white border-l-4 border-[#7b2cbf] rounded-xl shadow-[0_4px_16px_rgba(11,15,26,0.06)] p-5 card-hover-lift" data-testid="library-section-tools">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7b2cbf]/15 to-[#2D2380]/10 flex items-center justify-center"><Wrench className="w-5 h-5 text-[#7b2cbf]" /></div>
              <h2 className="font-semibold text-xl text-[#1a1a1a]" style={{fontFamily: "'IBM Plex Sans', system-ui, sans-serif", letterSpacing: '-0.01em'}}>Online Tools</h2>
            </div>
            <div className="space-y-2">
              {onlineTools.map((tool, i) => (
                <a key={i} href={tool.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-[#F6F7FB] to-[#F6F7FB]/50 hover:from-[#7b2cbf]/8 hover:to-[#2D2380]/5 border border-transparent hover:border-[#7b2cbf]/10 transition-all group" data-testid={`library-tool-${i}`}>
                  <div className="flex items-center gap-3 flex-1">
                    <span className="font-medium text-gray-800 group-hover:text-[#7b2cbf] transition-colors">{tool.name}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[#7b2cbf]/10 text-[#7b2cbf]/70 font-medium">{tool.tag}</span>
                    <span className="text-sm text-gray-500 ml-2 hidden md:inline">{tool.description}</span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-[#7b2cbf] transition-colors" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Annotated Bibliography */}
        <h2 className="font-serif text-2xl font-semibold text-[#0B0F1A] mb-6">Annotated Bibliography</h2>
        <p className="text-gray-600 mb-6">Detailed descriptions of key AI governance resources. Click to expand.</p>
        <div className="space-y-3 mb-12">
          {annotatedBibliography.map((entry, index) => (
            <div key={index} className="bg-white rounded-xl border border-gray-100 shadow-[0_2px_8px_rgba(11,15,26,0.04)] overflow-hidden card-hover-lift">
              <button
                onClick={() => setOpenEntry(openEntry === index ? null : index)}
                className="w-full text-left p-4 flex items-center justify-between gap-4 hover:bg-[#7b2cbf]/5 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-[#0B0F1A]">{entry.title}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[#7b2cbf]/10 text-[#7b2cbf] font-medium">{entry.type}</span>
                  </div>
                  <p className="text-sm text-gray-500">{entry.org} · {entry.year}</p>
                </div>
                {openEntry === index ? (
                  <ChevronUp className="w-5 h-5 text-[#7b2cbf] flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                )}
              </button>
              {openEntry === index && (
                <div className="px-4 pb-4 text-gray-600 border-t border-gray-100 pt-3 text-sm leading-relaxed">
                  {entry.description}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 bg-[#0D0A2E]/5 rounded-xl border border-[#0D0A2E]/20">
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-[#0B0F1A]">{t.library.note}</span> {t.library.noteText}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Library;
