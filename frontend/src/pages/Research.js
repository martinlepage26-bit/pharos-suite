import { useState } from 'react';
import { researchPapers, contexts } from '../data/researchPapers';
import { X, FileText, Calendar, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Research = () => {
  const [selectedContext, setSelectedContext] = useState('all');
  const [selectedPaper, setSelectedPaper] = useState(null);
  const { t, language } = useLanguage();

  const filteredPapers = selectedContext === 'all' 
    ? researchPapers 
    : researchPapers.filter(p => p.context === selectedContext);

  const dateLocale = language === 'fr' ? 'fr-CA' : 'en-US';

  return (
    <div className="min-h-screen bg-[#F6F7FB] py-12 px-6 md:px-12" data-testid="research-page">
      <div className="max-w-5xl mx-auto">
        <h1 className="font-serif text-6xl md:text-6xl font-semibold text-[#0B0F1A] mb-4">{t.research.title}</h1>
        <p className="text-gray-600 mb-8 max-w-2xl">{t.research.description}</p>

        <div className="mb-12">
          <h2 className="font-serif text-6xl font-semibold text-[#0B0F1A] mb-4">{t.research.howItWorks}</h2>
          <div className="flex items-center justify-center gap-4 text-sm mb-6">
            {[t.research.signal, t.research.pressure, t.research.control, t.research.artifact, t.research.evidence].map((label, i, arr) => (
              <span key={i}>
                <span className="text-[#2A206B] font-medium">{label}</span>
                {i < arr.length - 1 && <span className="text-gray-400 ml-4">&rarr;</span>}
              </span>
            ))}
          </div>
          <p className="text-gray-600 mb-4">{t.research.howP1}</p>
          <p className="text-gray-600 mb-8">{t.research.howP2}</p>
        </div>

        <div className="mb-12 p-6 bg-[linear-gradient(135deg,#2A206B_0%,#2A206B_40%,#4A3D8F_70%,#7B6DB5_100%)] rounded-2xl shadow-[0_8px_32px_rgba(42,32,107,0.4)] relative overflow-hidden">
          {/* Shine effect */}
          <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_30%,rgba(255,255,255,0.1)_50%,transparent_70%)] pointer-events-none"></div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <h2 className="font-serif text-6xl font-semibold text-white">{t.research.featuredFramework}</h2>
            <p className="text-white/80 text-sm">{t.research.featuredFrameworkSubtitle}</p>
          </div>
          <p className="text-white/90 mb-4">{t.research.featuredFrameworkDesc}</p>
          <p className="text-white/70 text-sm italic">
            <span className="font-medium text-white">{t.research.professionalNote}</span> {t.research.professionalNoteText}
          </p>
        </div>

        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h2 className="font-serif text-6xl font-semibold text-[#0B0F1A]">{t.research.operationalContexts}</h2>
            <p className="text-gray-500 text-sm">{t.research.filterByContext}</p>
          </div>
          <div className="flex flex-wrap gap-2 mb-8">
            <button onClick={() => setSelectedContext('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedContext === 'all' ? 'bg-[#2A206B] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-[#2A206B] hover:text-[#2A206B]'}`}>
              {t.research.all}
            </button>
            {contexts.map((context) => (
              <button key={context.id} onClick={() => setSelectedContext(context.id)} data-testid={`context-${context.id}`}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedContext === context.id ? 'bg-[#2A206B] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-[#2A206B] hover:text-[#2A206B]'}`}>
                {context.title}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-serif text-6xl font-semibold text-[#0B0F1A] mb-4">{t.research.briefings} ({filteredPapers.length})</h3>
          {filteredPapers.map((paper) => (
            <button key={paper.id} onClick={() => setSelectedPaper(paper)} className="w-full text-left card paper-card hover:shadow-md transition-all group" data-testid={`paper-${paper.id}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-[#2A206B]" />
                    <span className="text-xs font-medium text-[#2A206B] uppercase tracking-wide">{paper.type}</span>
                    <span className="text-gray-300">·</span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(paper.date).toLocaleDateString(dateLocale, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <h4 className="font-serif text-6xl font-semibold text-[#0B0F1A] mb-2 group-hover:text-[#2A206B] transition-colors">{paper.title}</h4>
                  <p className="text-gray-600 text-sm line-clamp-2">{paper.abstract}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-[#2A206B] group-hover:translate-x-1 transition-all flex-shrink-0 mt-2" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {selectedPaper && (
        <>
          <div className="fixed inset-0 bg-black/30 z-[4000]" onClick={() => setSelectedPaper(null)} />
          <div className="fixed top-0 right-0 h-screen w-full md:w-[600px] bg-white border-l border-gray-200 shadow-2xl z-[4500] flex flex-col overflow-hidden">
            <div className="flex items-start justify-between gap-4 p-6 border-b border-gray-100 bg-white">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium text-[#2A206B] uppercase tracking-wide">{selectedPaper.type}</span>
                  <span className="text-gray-300">·</span>
                  <span className="text-xs text-gray-500">{new Date(selectedPaper.date).toLocaleDateString(dateLocale, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <h2 className="font-serif text-6xl font-semibold text-[#0B0F1A]">{selectedPaper.title}</h2>
              </div>
              <button onClick={() => setSelectedPaper(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="flex-1 overflow-auto p-6">
              <div className="prose prose-gray max-w-none">
                <p className="text-6xl text-gray-700 font-medium mb-6 pb-6 border-b border-gray-100">{selectedPaper.abstract}</p>
                {selectedPaper.content.split('\n\n').map((paragraph, i) => (
                  <p key={i} className="text-gray-600 leading-relaxed mb-4">{paragraph}</p>
                ))}
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 bg-gray-50">
              <p className="text-xs text-gray-500 text-center">{t.research.context}: {contexts.find(c => c.id === selectedPaper.context)?.title || 'General'}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Research;
