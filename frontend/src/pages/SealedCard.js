import { Link } from 'react-router-dom';
import { FileText, ExternalLink, BookOpen, Sparkles, Eye, Layers } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const PDF_URL = process.env.REACT_APP_SEALED_CARD_PDF_URL || "https://customer-assets.emergentagent.com/job_site-resurrection-1/artifacts/3mzbuwbb_Sealed_Card_Protocol_FINAL.pdf";

const SealedCard = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#F6F7FB] py-12 px-6 md:px-12" data-testid="sealed-card-page">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <p className="text-xs tracking-widest text-[#2A206B] uppercase mb-3">{t.sealedCard.researchProtocol}</p>
          <h1 className="font-serif text-4xl md:text-5xl font-semibold text-[#0B0F1A] mb-4">{t.sealedCard.title}</h1>
          <p className="text-xl text-gray-600 mb-6">{t.sealedCard.subtitle}</p>
          <p className="text-xs tracking-widest text-gray-400 uppercase">{t.sealedCard.keywords}</p>
        </div>

        <a href={PDF_URL} target="_blank" rel="noopener noreferrer" className="block mb-8 p-6 bg-[linear-gradient(135deg,#2A206B_0%,#2A206B_40%,#4A3D8F_70%,#7B6DB5_100%)] rounded-2xl text-white shadow-[0_8px_32px_rgba(42,32,107,0.4)] hover:shadow-[0_12px_40px_rgba(42,32,107,0.5)] transition-all group relative overflow-hidden" data-testid="pdf-download">
          <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_30%,rgba(255,255,255,0.1)_50%,transparent_70%)] pointer-events-none"></div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center"><FileText className="w-6 h-6" /></div>
              <div>
                <p className="font-semibold text-lg">{t.sealedCard.fullDocument}</p>
                <p className="text-white/70 text-sm">{t.sealedCard.fullDocumentDesc}</p>
              </div>
            </div>
            <ExternalLink className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </div>
        </a>

        <div className="card mb-8">
          <h2 className="font-serif text-2xl font-semibold text-[#0B0F1A] mb-4 flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-[#2A206B]" />{t.sealedCard.introduction}
          </h2>
          <p className="text-gray-600 mb-4">
            {t.sealedCard.introP1} <span className="font-semibold text-[#0B0F1A]">{t.sealedCard.glitch}</span>{t.sealedCard.introP1b}
          </p>
          <p className="text-gray-600 mb-4">
            {t.sealedCard.introP2} <span className="font-semibold text-[#0B0F1A]">{t.sealedCard.accountability}</span> {t.sealedCard.introP2b}
          </p>
          <p className="text-gray-600">
            {t.sealedCard.introP3} <span className="italic">{t.sealedCard.introP3quote}</span> {t.sealedCard.introP3b}
          </p>
        </div>

        <div className="card mb-8">
          <h2 className="font-serif text-2xl font-semibold text-[#0B0F1A] mb-6 flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-[#2A206B]" />{t.sealedCard.keyConcepts}
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {t.sealedCard.concepts.map((item, i) => (
              <div key={i} className="p-4 bg-[#F6F7FB] rounded-xl border-l-3 border-[#2A206B]">
                <p className="font-semibold text-[#0B0F1A] mb-1">{item.term}</p>
                <p className="text-gray-600 text-sm">{item.definition}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card mb-8">
          <h2 className="font-serif text-2xl font-semibold text-[#0B0F1A] mb-6 flex items-center gap-3">
            <Layers className="w-6 h-6 text-[#2A206B]" />{t.sealedCard.methodology}
          </h2>
          <p className="text-gray-600 mb-6">{t.sealedCard.methodologyDesc}</p>
          <div className="space-y-4">
            {['artistic', 'academic', 'ritual'].map((key, i) => {
              const colors = ['#2A206B', '#3A1FA0', '#2D1A5E'];
              return (
                <div key={key} className={`p-5 bg-gradient-to-r from-[${colors[i]}]/5 to-transparent rounded-xl border border-[${colors[i]}]/20`}>
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`w-8 h-8 rounded-full bg-[${colors[i]}] text-white flex items-center justify-center font-bold`}>{i + 1}</span>
                    <h3 className="font-serif text-lg font-semibold text-[#0B0F1A]">{t.sealedCard.arms[key].title}</h3>
                  </div>
                  <p className="text-gray-600 text-sm ml-11">{t.sealedCard.arms[key].description}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card mb-8">
          <h2 className="font-serif text-2xl font-semibold text-[#0B0F1A] mb-6 flex items-center gap-3">
            <Eye className="w-6 h-6 text-[#2A206B]" />{t.sealedCard.governancePrinciples}
          </h2>
          <div className="space-y-4">
            {t.sealedCard.principles.map((p, i) => (
              <div key={i} className="p-4 bg-[#F6F7FB] rounded-xl">
                <p className="font-semibold text-[#0B0F1A] mb-2">{p.title}</p>
                <p className="text-gray-600 text-sm">{p.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card mb-8 border-l-4 border-[#2A206B]">
          <h2 className="font-serif text-xl font-semibold text-[#0B0F1A] mb-4">{t.sealedCard.conclusion}</h2>
          <p className="text-gray-600 mb-4">{t.sealedCard.conclusionP1}</p>
          <ul className="text-gray-600 space-y-2 ml-4">
            {t.sealedCard.conclusionItems.map((item, i) => (
              <li key={i} className="flex items-start gap-2"><span className="text-[#2A206B] mt-1">•</span>{item}</li>
            ))}
          </ul>
        </div>

        <div className="flex flex-wrap gap-4">
          <Link to="/research" className="btn-primary">{t.sealedCard.backToResearch}</Link>
          <Link to="/about" className="btn-ghost">{t.sealedCard.aboutAuthor}</Link>
        </div>
      </div>
    </div>
  );
};

export default SealedCard;
