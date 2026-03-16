import { useState } from 'react';
import { BookOpen, Scale, CircleDot, ExternalLink, Wrench, ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Library = () => {
  const { language } = useLanguage();
  const [openEntry, setOpenEntry] = useState(null);

  const sectionIcons = [BookOpen, Scale, CircleDot];

  const sectionItems = [
    [
      { name: 'NIST AI Risk Management Framework', url: 'https://www.nist.gov/itl/ai-risk-management-framework', tag: 'Framework' },
      { name: 'ISO/IEC 42001 AI Management System', url: 'https://www.iso.org/standard/81230.html', tag: 'Standard' },
      { name: 'IEEE Ethically Aligned Design', url: 'https://ethicsinaction.ieee.org/', tag: 'Guidelines' },
      { name: 'OECD AI Principles', url: 'https://oecd.ai/en/ai-principles', tag: 'Policy' }
    ],
    [
      { name: 'EU AI Act', url: 'https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai', tag: 'Regulation' },
      { name: 'Directive on Automated Decision-Making (Canada)', url: 'https://www.canada.ca/en/government/system/digital-government/digital-government-innovations/responsible-use-ai/guide-scope-directive-automated-decision-making.html', tag: 'Directive' },
      { name: 'OMB Memorandum M-25-21', url: 'https://www.whitehouse.gov/wp-content/uploads/2025/02/M-25-21-Accelerating-Federal-Use-of-AI-through-Innovation-Governance-and-Public-Trust.pdf', tag: 'Federal Policy' },
      { name: 'UK AI Security Institute', url: 'https://www.aisi.gov.uk/', tag: 'Government' }
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
      description: 'The NIST AI Risk Management Framework (AI RMF) provides a voluntary, consensus-driven structure for identifying, assessing, and managing AI risks across the lifecycle. Organized around four core functions-Govern, Map, Measure, and Manage-the framework emphasizes trustworthiness characteristics such as validity, safety, security, accountability, and fairness. Unlike prescriptive regulation, the AI RMF is flexible and sector-agnostic, designed for integration into existing enterprise risk management systems. It is complemented by implementation playbooks and crosswalks to other standards.'
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
      description: 'The OECD AI Principles are the first intergovernmental AI policy framework adopted by 40+ countries. They articulate five value-based principles-beneficial AI, human-centered values, transparency, robustness, and accountability-alongside five policy recommendations for governments. The Principles emphasize sustainable development, democratic values, and rule of law. They influenced the G20 AI Principles and national strategies worldwide.'
    },
    {
      title: 'EU AI Act',
      org: 'European Union',
      year: '2024',
      type: 'Regulation',
      description: 'The EU AI Act is the European Union\'s binding AI regulation. It entered into force in 2024 and applies on a phased timeline, with early prohibitions already in effect and broader obligations for general-purpose and high-risk systems arriving in later phases. It uses a risk-based model and is the clearest current reference point for formal AI compliance architecture.'
    },
    {
      title: 'Artificial Intelligence and Data Act (AIDA) - historical proposal',
      org: 'Government of Canada',
      year: 'Bill C-27',
      type: 'Historical Proposal',
      description: 'AIDA was proposed as part of Bill C-27 and would have created a federal private-sector framework for high-impact AI systems. It did not become law during the 44th Parliament, so it should be treated as a historical policy proposal rather than a current legal obligation. It remains useful for understanding the direction Canada was considering for private-sector AI regulation.'
    },
    {
      title: 'Executive Order 14110 (revoked in 2025)',
      org: 'United States Executive Branch',
      year: '2023-2025',
      type: 'Historical Federal Policy',
      description: 'Executive Order 14110 was a major early U.S. federal AI order focused on safety testing, reporting, standards, and agency coordination. It was revoked in January 2025, so it should not be cited as current U.S. governing policy. It remains relevant as a historical marker of the first federal frontier-model policy phase.'
    },
    {
      title: 'UK AI Security Institute (formerly AI Safety Institute)',
      org: 'UK Government',
      year: '2023-2025',
      type: 'Government Initiative',
      description: 'Established by the UK government to evaluate advanced AI models for systemic risk, the institute was renamed the AI Security Institute in 2025. It remains a live official reference point for model evaluations, safety and security testing, and UK government AI risk work.'
    },
    {
      title: 'NIST Special Publication 800-53',
      org: 'National Institute of Standards and Technology',
      year: '2020',
      type: 'Security Controls',
      description: 'NIST SP 800-53 provides a comprehensive catalog of security and privacy controls for federal information systems and organizations. Although not AI-specific, it is foundational for AI system deployment within regulated environments. Controls address access control, incident response, system integrity, and risk assessment-critical for AI infrastructure security.'
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
    { name: 'Guide to Peer Review of Automated Decision Systems', url: 'https://www.canada.ca/en/government/system/digital-government/digital-government-innovations/responsible-use-ai/guide-peer-review-automated-decision-systems.html', tag: 'Guidance', description: 'Canadian federal guidance on peer review for automated decision systems' }
  ];

  const copy = language === 'fr'
    ? {
        eyebrow: 'Bibliotheque',
        title: 'Normes, droit et references de travail pour une gouvernance sous examen.',
        body: 'Quand un questionnaire, un audit ou une revue demande une norme, une loi ou une source credible, il faut pouvoir partir de references reconnues rapidement et dont le statut peut etre verifie.',
        primaryLabel: 'References essentielles',
        primaryTitle: 'Commencer par des references qui tiennent en revue',
        primaryBody: 'Cette selection privilegie les cadres, textes et formats documentaires les plus utiles quand il faut justifier un controle, une decision, ou expliquer pourquoi une affirmation doit rester plus etroite que le langage marketing autour d elle.',
        noteLabel: 'Usage',
        noteTitle: 'Faire entrer les references dans un travail verifiable.',
        noteBody: 'Une bonne bibliotheque aide a soutenir une decision, une reponse ou un controle avec des sources actuelles, citables, et proportionnees a l affirmation avancee.',
        notePills: ['Reconnu', 'Citable', 'Actionnable'],
        sections: [
          {
            title: 'Cadres et systemes de management',
            body: 'A utiliser quand il faut poser la structure de risque, d oversight, de responsabilite et de gestion de la preuve.'
          },
          {
            title: 'Droit et orientations reglementaires',
            body: 'A utiliser quand la question porte sur l exposition juridique, les obligations, ou les attentes du secteur public qu il faut nommer avec precision.'
          },
          {
            title: 'Documentation et references de controle',
            body: 'A utiliser quand il faut choisir le format d une preuve, d une fiche technique ou d une trace de gouvernance que d autres pourront inspecter.'
          }
        ],
        toolsLabel: 'Execution',
        toolsTitle: 'Outils pour transformer des references en preuve de travail',
        toolsBody: 'Des points d appui pratiques pour transformer une reference en evaluation, modele ou processus de travail sans exagerer ce qui existe deja.',
        bibliographyLabel: 'Lectures longues',
        bibliographyTitle: 'Bibliographie annotee',
        bibliographyBody: 'Des notes plus longues pour les references qui meritent davantage qu un simple lien et demandent un minimum de contexte avant revue.',
        finalNote: 'Portee',
        finalBody: 'Cette bibliotheque est volontairement selective. Elle privilegie les references les plus utiles quand la pression est immediate et signale explicitement les elements historiques pour qu ils ne soient pas confondus avec des obligations actuelles.'
      }
    : {
        eyebrow: 'Library',
        title: 'Standards, law, and references for scrutiny',
        body: 'When a questionnaire, audit, or review asks for a standard, statute, or credible source, start with references reviewers recognize quickly and whose status can be verified.',
        primaryLabel: 'Core references',
        primaryTitle: 'Start with references that hold up in review',
        primaryBody: 'This selection prioritizes the frameworks, texts, and documentation formats most useful when a team has to justify a control, a decision, or explain why a claim should stay narrower than the surrounding marketing language.',
        noteLabel: 'Use',
        noteTitle: 'Pull references into reviewable work',
        noteBody: 'A useful library should help support a decision, an answer, or a control with sources that are current, citable, and proportionate to the claim being made.',
        notePills: ['Recognized', 'Citable', 'Operational'],
        sections: [
          {
            title: 'Frameworks and management systems',
            body: 'Use these when you need the structural model for risk, oversight, accountability, and evidence stewardship.'
          },
          {
            title: 'Law and regulatory direction',
            body: 'Use these when the question is legal exposure, mandatory obligations, or public-sector expectations that need to be stated precisely.'
          },
          {
            title: 'Documentation and control references',
            body: 'Use these when you need a concrete format for records, technical evidence, or governance artifacts that others can inspect.'
          }
        ],
        toolsLabel: 'Execution',
        toolsTitle: 'Tools for turning references into working evidence',
        toolsBody: 'Practical starting points for turning a reference into an assessment, template, or working process without overstating what is already in place.',
        bibliographyLabel: 'Long-form references',
        bibliographyTitle: 'Annotated bibliography',
        bibliographyBody: 'Longer notes for the references that deserve more than a link and need brief context before review.',
        finalNote: 'Scope',
        finalBody: 'This library is intentionally selective. It prioritizes references that are recognizable, practical, and useful when the pressure is immediate. Historical items are labeled so older policy signals are not mistaken for current obligations.'
      };

  const referenceSections = copy.sections.map((section, idx) => ({
    ...section,
    icon: sectionIcons[idx],
    items: sectionItems[idx]
  }));

  return (
    <div className="min-h-screen bg-transparent px-6 py-10 md:px-10" data-testid="library-page">
      <div className="mx-auto max-w-[1240px]">
        <section className="brand-panel-dark brand-top-rule relative mb-8 overflow-hidden rounded-[34px] px-6 py-8 text-white md:px-8 md:py-10">
          <div className="absolute right-[-22px] top-[-18px] h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(184,155,94,0.18)_0%,rgba(184,155,94,0)_72%)]" />
          <div className="absolute bottom-[-56px] left-[-18px] h-40 w-40 rotate-45 rounded-[20px] border border-[#B89B5E]/12" />
          <div className="relative grid gap-8 lg:grid-cols-[1fr_0.96fr] lg:items-start">
            <div>
              <p className="mb-4 text-[11px] uppercase tracking-[0.22em] text-[#D8C08A]" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontWeight: 600 }}>
                {copy.eyebrow}
              </p>
              <h1 className="max-w-[17ch] text-[28px] leading-[1.05] tracking-[-0.05em] text-[#F6F0E4] sm:text-[31px] md:max-w-[12ch] md:text-[56px]" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontWeight: 600 }}>
                {copy.title}
              </h1>
              <p className="mt-4 max-w-[52ch] text-[13px] leading-[1.68] text-white/82 md:mt-5 md:max-w-[62ch] md:text-[17px] md:leading-[1.78]" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
                {copy.body}
              </p>
            </div>

            <div className="rounded-[30px] border border-[#B89B5E]/18 bg-[#FBF7EF] p-5 shadow-[0_22px_42px_rgba(8,20,40,0.18)]">
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#6F5626]" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontWeight: 600 }}>
                {copy.noteLabel}
              </p>
              <div className="mt-4 rounded-[24px] border border-[#13254C]/12 bg-white/84 p-5">
                <h2 className="text-[25px] leading-[1.06] text-[#081428] md:text-[28px]" style={{ fontFamily: "'Crimson Text', Georgia, serif", fontWeight: 600 }}>
                  {copy.noteTitle}
                </h2>
                <p className="mt-3 text-sm leading-[1.78]" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", color: 'rgba(32, 49, 79, 0.76)' }}>
                  {copy.noteBody}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {copy.notePills.map((pill) => (
                    <span
                      key={pill}
                      className="inline-flex items-center rounded-full border border-[#D6CCBB] bg-[#FBF7EF] px-3 py-1.5 text-[11px] uppercase tracking-[0.12em] text-[#13254C]"
                      style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontWeight: 600 }}
                    >
                      {pill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <div className="mb-5 max-w-[820px]">
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#6F5626]" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontWeight: 600 }}>
              {copy.primaryLabel}
            </p>
            <h2 className="mt-2 text-[30px] text-[#10162A] md:text-[38px]" style={{ fontFamily: "'Crimson Text', Georgia, serif", fontWeight: 600 }}>
              {copy.primaryTitle}
            </h2>
            <p className="mt-3 text-sm leading-[1.8] text-[#20314F]/72" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
              {copy.primaryBody}
            </p>
          </div>

          <div className="space-y-6">
            {referenceSections.map((section, idx) => {
              const Icon = section.icon;
              return (
                <div key={section.title} className="rounded-[28px] border border-[#D6CCBB] bg-[#FFFDF8] p-5 shadow-[0_16px_30px_rgba(8,20,40,0.05)]" data-testid={`library-section-${idx}`}>
                  <div className="mb-4 flex items-start gap-3">
                    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl border border-[#B89B5E]/18 bg-[#F2E8D8]">
                      <Icon className="h-5 w-5 text-[#13254C]" />
                    </div>
                    <div>
                      <h2 className="text-[26px] text-[#10162A]" style={{ fontFamily: "'Crimson Text', Georgia, serif", fontWeight: 600 }}>
                        {section.title}
                      </h2>
                      <p className="mt-2 text-sm leading-[1.72] text-[#20314F]/68" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
                        {section.body}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {section.items.map((item, index) => (
                      <a
                        key={index}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-between gap-4 rounded-[20px] border border-[#E6DDCD] bg-[#FBF7EF] p-4 transition-colors hover:border-[#B89B5E]/34"
                        data-testid={`library-item-${idx}-${index}`}
                      >
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm text-[#10162A]" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontWeight: 600 }}>
                              {item.name}
                            </span>
                            <span className="rounded-full border border-[#D6CCBB] bg-white px-2 py-0.5 text-xs text-[#13254C]" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontWeight: 600 }}>
                              {item.tag}
                            </span>
                          </div>
                        </div>
                        <ExternalLink className="h-4 w-4 flex-shrink-0 text-[#20314F]/44 transition-colors group-hover:text-[#13254C]" />
                      </a>
                    ))}
                  </div>
                </div>
              );
            })}

            <div className="rounded-[28px] border border-[#D6CCBB] bg-[#FFFDF8] p-5 shadow-[0_16px_30px_rgba(8,20,40,0.05)]" data-testid="library-section-tools">
              <div className="mb-4 flex items-start gap-3">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl border border-[#B89B5E]/18 bg-[#F2E8D8]">
                  <Wrench className="h-5 w-5 text-[#13254C]" />
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[#6F5626]" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontWeight: 600 }}>
                    {copy.toolsLabel}
                  </p>
                  <h2 className="mt-2 text-[26px] text-[#10162A]" style={{ fontFamily: "'Crimson Text', Georgia, serif", fontWeight: 600 }}>
                    {copy.toolsTitle}
                  </h2>
                  <p className="mt-2 text-sm text-[#20314F]/68" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
                    {copy.toolsBody}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                {onlineTools.map((tool, index) => (
                  <a
                    key={index}
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-4 rounded-[20px] border border-[#E6DDCD] bg-[#FBF7EF] p-4 transition-colors hover:border-[#B89B5E]/34"
                    data-testid={`library-tool-${index}`}
                  >
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm text-[#10162A]" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontWeight: 600 }}>
                          {tool.name}
                        </span>
                        <span className="rounded-full border border-[#D6CCBB] bg-white px-2 py-0.5 text-xs text-[#13254C]" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontWeight: 600 }}>
                          {tool.tag}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-[#20314F]/64" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
                        {tool.description}
                      </p>
                    </div>
                    <ExternalLink className="h-4 w-4 flex-shrink-0 text-[#20314F]/44 transition-colors group-hover:text-[#13254C]" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="brand-panel rounded-[32px] px-6 py-7 md:px-8 md:py-8">
          <div className="mb-6 max-w-[820px]">
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#6F5626]" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontWeight: 600 }}>
              {copy.bibliographyLabel}
            </p>
            <h2 className="mt-2 text-[30px] text-[#10162A] md:text-[38px]" style={{ fontFamily: "'Crimson Text', Georgia, serif", fontWeight: 600 }}>
              {copy.bibliographyTitle}
            </h2>
            <p className="mt-3 text-sm leading-[1.8] text-[#20314F]/72" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
              {copy.bibliographyBody}
            </p>
          </div>

          <div className="space-y-3">
            {annotatedBibliography.map((entry, index) => (
              <div key={index} className="overflow-hidden rounded-[22px] border border-[#D6CCBB] bg-[#FFFDF8] shadow-[0_10px_24px_rgba(8,20,40,0.04)]">
                <button
                  onClick={() => setOpenEntry(openEntry === index ? null : index)}
                  className="flex w-full items-center justify-between gap-4 p-4 text-left transition-colors hover:bg-[#FBF7EF]"
                >
                  <div className="flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <span className="text-sm text-[#10162A]" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontWeight: 600 }}>
                        {entry.title}
                      </span>
                      <span className="rounded-full border border-[#D6CCBB] bg-white px-2 py-0.5 text-xs text-[#13254C]" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontWeight: 600 }}>
                        {entry.type}
                      </span>
                    </div>
                    <p className="text-sm text-[#20314F]/64" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
                      {entry.org} · {entry.year}
                    </p>
                  </div>
                  {openEntry === index ? (
                    <ChevronUp className="h-5 w-5 flex-shrink-0 text-[#13254C]" />
                  ) : (
                    <ChevronDown className="h-5 w-5 flex-shrink-0 text-[#20314F]/44" />
                  )}
                </button>
                {openEntry === index && (
                  <div className="border-t border-[#E6DDCD] px-4 pb-4 pt-4 text-sm leading-[1.8] text-[#20314F]/76" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
                    {entry.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <div className="mt-8 rounded-[24px] border border-[#D6CCBB] bg-[#FBF7EF] p-5 text-sm leading-[1.8] text-[#20314F]/74 shadow-[0_12px_24px_rgba(8,20,40,0.04)]" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
          <span className="font-semibold text-[#10162A]">{copy.finalNote}:</span> {copy.finalBody}
        </div>
      </div>
    </div>
  );
};

export default Library;
