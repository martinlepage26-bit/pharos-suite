import { ExternalLink, BookOpen, Scale, Shield, TrendingUp } from 'lucide-react';
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

  return (
    <div className="min-h-screen bg-[#F6F7FB] py-12 px-6 md:px-12" data-testid="library-page">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-serif text-4xl md:text-5xl font-semibold text-[#0B0F1A] mb-4">{t.library.title}</h1>
        <p className="text-gray-600 mb-8 max-w-2xl">{t.library.description}</p>
        <p className="text-xs tracking-widest text-gray-400 uppercase mb-12">{t.library.keywords}</p>

        <div className="space-y-6">
          {sectionKeys.map((key, idx) => {
            const Icon = sectionIcons[idx];
            return (
              <div key={key} className="card p-4" data-testid={`library-section-${idx}`}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-[#1A1050]/10 flex items-center justify-center"><Icon className="w-4 h-4 text-[#1A1050]" /></div>
                  <h2 className="font-serif text-lg font-semibold text-[#0B0F1A]">{t.library.sections[key]}</h2>
                </div>
                <div className="space-y-2">
                  {sectionItems[idx].map((item, i) => (
                    <a key={i} href={item.url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-between p-2 rounded-lg bg-[#F6F7FB] hover:bg-[#1A1050]/5 transition-colors group" data-testid={`library-item-${idx}-${i}`}>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-700 group-hover:text-[#1A1050] transition-colors">{item.name}</span>
                        <span className="text-xs px-1.5 py-0.5 rounded-full bg-white border border-gray-200 text-gray-500">{item.tag}</span>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#1A1050] transition-colors" />
                    </a>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 p-4 bg-[#1A1050]/5 rounded-xl border border-[#1A1050]/20">
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-[#0B0F1A]">{t.library.note}</span> {t.library.noteText}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Library;
