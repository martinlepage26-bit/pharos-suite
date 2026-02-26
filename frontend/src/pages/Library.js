import { ExternalLink, BookOpen, Scale, Shield, TrendingUp, Wrench } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Library = () => {
  const { t } = useLanguage();

  const sectionKeys = ['foundational', 'regulatory', 'standards', 'ongoing'];
  const sectionIcons = [BookOpen, Scale, Shield, TrendingUp];
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
      { name: 'Datasheets for Datasets', url: 'https://arxiv.org/abs/1803.09010', tag: 'Documentation' },
      { name: 'AI Incident Database', url: 'https://incidentdatabase.ai/', tag: 'Research' }
    ],
    [
      { name: 'Stanford HAI Policy Updates', url: 'https://hai.stanford.edu/policy', tag: 'Research' },
      { name: 'AI Now Institute Reports', url: 'https://ainowinstitute.org/', tag: 'Research' },
      { name: 'Partnership on AI', url: 'https://partnershiponai.org/', tag: 'Industry' },
      { name: 'Future of Life Institute', url: 'https://futureoflife.org/ai/', tag: 'Policy' }
    ]
  ];

  const onlineTools = [
    { name: 'DocSort', url: '#', tag: 'Documentation', description: 'AI-powered document classification and organization' },
    { name: 'Scriptorium', url: '#', tag: 'Writing', description: 'Governance policy drafting assistant' },
    { name: 'Compass AI', url: '#', tag: 'Assessment', description: 'AI readiness and risk assessment tool' }
  ];

  return (
    <div className="min-h-screen bg-[#F6F7FB] py-12 px-6 md:px-12" data-testid="library-page">
      <div className="max-w-4xl mx-auto">
        <h1 className="page-title mb-4">{t.library.title}</h1>
        <p className="text-gray-600 mb-8 max-w-2xl">{t.library.description}</p>
        <p className="text-xs tracking-widest text-gray-400 uppercase mb-12">{t.library.keywords}</p>

        <div className="space-y-6">
          {sectionKeys.map((key, idx) => {
            const Icon = sectionIcons[idx];
            return (
              <div key={key} className="bg-white border-l-4 border-[#0D0A2E] rounded-xl shadow-[0_4px_16px_rgba(11,15,26,0.06)] p-5" data-testid={`library-section-${idx}`}>
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
          <div className="bg-white border-l-4 border-[#7b2cbf] rounded-xl shadow-[0_4px_16px_rgba(11,15,26,0.06)] p-5" data-testid="library-section-tools">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7b2cbf]/15 to-[#2D2380]/10 flex items-center justify-center"><Wrench className="w-5 h-5 text-[#7b2cbf]" /></div>
              <h2 className="font-semibold text-xl text-[#0B0F1A]" style={{fontFamily: "'IBM Plex Sans', system-ui, sans-serif"}}>Online Tools</h2>
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
