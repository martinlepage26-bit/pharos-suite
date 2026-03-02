import { useState } from 'react';
import { Link } from 'react-router-dom';
import { caseStudies } from '../data/caseStudies';
import { Building2, Clock, ChevronRight, Quote, CheckCircle, FileText, X, HardHat, Shield, Server, ShoppingCart, Landmark, DollarSign, Settings } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Cases = () => {
  const [selectedCase, setSelectedCase] = useState(null);
  const { t } = useLanguage();

  // Sector icons mapping
  const sectorIcons = {
    regulated: Shield,
    enterpriseSaas: Server,
    procurement: ShoppingCart,
    publicSector: Landmark,
    financial: DollarSign,
    construction: HardHat,
    governance: Settings
  };

  const sectorKeys = ['regulated', 'enterpriseSaas', 'procurement', 'publicSector', 'financial', 'construction', 'governance'];
  const sectorIds = ['regulated', 'enterprise-saas', 'procurement', 'public-sector', 'financial', 'construction', 'governance'];

  return (
    <div className="min-h-screen bg-[#F6F7FB] py-12 px-6 md:px-12" data-testid="cases-page">
      <div className="max-w-5xl mx-auto">
        <h1 className="page-title mb-4">{t.cases.title}</h1>
        <p className="text-gray-600 mb-2 max-w-2xl">{t.cases.description}</p>
        <p className="text-xs tracking-widest text-[#7b2cbf] uppercase mb-10">{t.cases.keywords}</p>

        {/* Sector Cards Grid - 2 rows of 3, then 1 row of 1 centered */}
        <div className="mb-12">
          <h2 className="font-serif text-xl font-semibold text-[#0B0F1A] mb-5">{t.cases.sectorsWeServe}</h2>
          
          {/* First row: 3 cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {sectorKeys.slice(0, 3).map((key, i) => {
              const Icon = sectorIcons[key];
              const sector = t.cases.sectorCards[key];
              return (
                <div key={key} className="card p-4 flex flex-col h-full border-l-3 border-[#0D0A2E]/30 hover:border-[#0D0A2E] transition-colors card-hover-lift" data-testid={`sector-card-${sectorIds[i]}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-[#0D0A2E]/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-[#0D0A2E]" />
                    </div>
                    <h3 className="font-serif text-base font-semibold text-[#0B0F1A] leading-tight">{sector.title}</h3>
                  </div>
                  <p className="text-xs text-[#0D0A2E] mb-2">{sector.subtitle}</p>
                  <p className="text-sm text-gray-600 mb-3 flex-1">{sector.body}</p>
                  <div className="p-2 bg-[#F6F7FB] rounded text-xs text-gray-600 mb-3">
                    <span className="font-medium text-[#0B0F1A]">{t.cases.outputs}:</span> {sector.deliverable}
                  </div>
                  <Link to="/tool" className="text-xs text-[#0D0A2E] hover:underline inline-flex items-center gap-1 mt-auto">
                    {t.cases.assessReadiness} <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Second row: 3 cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {sectorKeys.slice(3, 6).map((key, i) => {
              const Icon = sectorIcons[key];
              const sector = t.cases.sectorCards[key];
              return (
                <div key={key} className="card p-4 flex flex-col h-full border-l-3 border-[#0D0A2E]/30 hover:border-[#0D0A2E] transition-colors" data-testid={`sector-card-${sectorIds[i + 3]}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-[#0D0A2E]/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-[#0D0A2E]" />
                    </div>
                    <h3 className="font-serif text-base font-semibold text-[#0B0F1A] leading-tight">{sector.title}</h3>
                  </div>
                  <p className="text-xs text-[#0D0A2E] mb-2">{sector.subtitle}</p>
                  <p className="text-sm text-gray-600 mb-3 flex-1">{sector.body}</p>
                  <div className="p-2 bg-[#F6F7FB] rounded text-xs text-gray-600 mb-3">
                    <span className="font-medium text-[#0B0F1A]">{t.cases.outputs}:</span> {sector.deliverable}
                  </div>
                  <Link to="/tool" className="text-xs text-[#0D0A2E] hover:underline inline-flex items-center gap-1 mt-auto">
                    {t.cases.assessReadiness} <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Third row: 1 card centered */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-start-2">
              {sectorKeys.slice(6, 7).map((key) => {
                const Icon = sectorIcons[key];
                const sector = t.cases.sectorCards[key];
                return (
                  <div key={key} className="card p-4 flex flex-col h-full border-l-3 border-[#0D0A2E]/30 hover:border-[#0D0A2E] transition-colors" data-testid={`sector-card-${sectorIds[6]}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-[#0D0A2E]/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-[#0D0A2E]" />
                      </div>
                      <h3 className="font-serif text-base font-semibold text-[#0B0F1A] leading-tight">{sector.title}</h3>
                    </div>
                    <p className="text-xs text-[#0D0A2E] mb-2">{sector.subtitle}</p>
                    <p className="text-sm text-gray-600 mb-3 flex-1">{sector.body}</p>
                    <div className="p-2 bg-[#F6F7FB] rounded text-xs text-gray-600 mb-3">
                      <span className="font-medium text-[#0B0F1A]">{t.cases.outputs}:</span> {sector.deliverable}
                    </div>
                    <Link to="/tool" className="text-xs text-[#0D0A2E] hover:underline inline-flex items-center gap-1 mt-auto">
                      {t.cases.assessReadiness} <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Case Studies */}
        <h2 className="font-serif text-xl font-semibold text-[#0B0F1A] mb-4">Case Studies</h2>
        <div className="space-y-6">
          {caseStudies.map((study) => (
            <button key={study.id} onClick={() => setSelectedCase(study)} className="w-full text-left card card-hover card-hover-lift group" data-testid={`case-${study.id}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-medium text-[#0D0A2E] uppercase tracking-wide">{study.sector}</span>
                    <span className="text-gray-300">·</span>
                    <span className="text-xs text-gray-500 flex items-center gap-1"><Clock className="w-3 h-3" />{study.duration}</span>
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-[#0B0F1A] mb-2 group-hover:text-[#0D0A2E] transition-colors">{study.title}</h3>
                  <p className="text-gray-500 text-sm flex items-center gap-2 mb-3"><Building2 className="w-4 h-4" />{study.client}</p>
                  <p className="text-gray-600 text-sm line-clamp-2">{study.challenge}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#0D0A2E] group-hover:translate-x-1 transition-all flex-shrink-0 mt-2" />
              </div>
            </button>
          ))}
        </div>

        <div className="mt-12 p-6 bg-[linear-gradient(135deg,#0D0A2E_0%,#0D0A2E_40%,#1A1555_70%,#2D2380_100%)] rounded-2xl shadow-[0_8px_32px_rgba(42,32,107,0.4)] relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_30%,rgba(255,255,255,0.1)_50%,transparent_70%)] pointer-events-none"></div>
          <h3 className="font-serif text-xl font-semibold mb-2 text-white">{t.cases.facingChallenge}</h3>
          <p className="text-white/80 mb-4">{t.cases.facingChallengeDesc}</p>
          <Link to="/connect" className="inline-block bg-white text-[#0B0F1A] px-5 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">{t.cases.bookDebrief}</Link>
        </div>
      </div>

      {selectedCase && (
        <>
          <div className="fixed inset-0 bg-black/30 z-[4000]" onClick={() => setSelectedCase(null)} />
          <div className="fixed top-0 right-0 h-screen w-full md:w-[640px] bg-white border-l border-gray-200 shadow-2xl z-[4500] flex flex-col overflow-hidden">
            <div className="flex items-start justify-between gap-4 p-6 border-b border-gray-100 bg-white">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium text-[#0D0A2E] uppercase tracking-wide">{selectedCase.sector}</span>
                  <span className="text-gray-300">·</span>
                  <span className="text-xs text-gray-500">{selectedCase.duration}</span>
                </div>
                <h2 className="font-serif text-2xl font-semibold text-[#0B0F1A]">{selectedCase.title}</h2>
                <p className="text-gray-500 text-sm mt-1">{selectedCase.client}</p>
              </div>
              <button onClick={() => setSelectedCase(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="flex-1 overflow-auto p-6">
              <div className="mb-6">
                <h3 className="font-semibold text-[#0B0F1A] mb-2">{t.cases.challenge}</h3>
                <p className="text-gray-600">{selectedCase.challenge}</p>
              </div>
              <div className="mb-6">
                <h3 className="font-semibold text-[#0B0F1A] mb-3">{t.cases.approach}</h3>
                <ul className="space-y-2">
                  {selectedCase.approach.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-600 text-sm">
                      <span className="w-5 h-5 rounded-full bg-[#0D0A2E]/10 flex items-center justify-center flex-shrink-0 mt-0.5"><span className="text-[#0D0A2E] text-xs font-bold">{i + 1}</span></span>{item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mb-6">
                <h3 className="font-semibold text-[#0B0F1A] mb-3">{t.cases.outcomes}</h3>
                <ul className="space-y-2">
                  {selectedCase.outcomes.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-600 text-sm"><CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />{item}</li>
                  ))}
                </ul>
              </div>
              {selectedCase.quote && (
                <div className="mb-6 p-4 bg-[#0D0A2E]/5 rounded-xl border-l-4 border-[#0D0A2E]">
                  <Quote className="w-5 h-5 text-[#0D0A2E] mb-2" />
                  <p className="text-gray-700 italic">"{selectedCase.quote}"</p>
                </div>
              )}
              <div>
                <h3 className="font-semibold text-[#0B0F1A] mb-3">{t.cases.deliverables}</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedCase.deliverables.map((item, i) => (
                    <span key={i} className="px-3 py-1.5 bg-[#F6F7FB] border border-gray-200 rounded-full text-sm text-gray-600 flex items-center gap-2">
                      <FileText className="w-3 h-3 text-[#0D0A2E]" />{item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 bg-gray-50">
              <Link to="/connect" className="btn-primary w-full text-center block" onClick={() => setSelectedCase(null)}>{t.cases.discussChallenge}</Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cases;

