import { Link } from 'react-router-dom';
import { FileText, ExternalLink, BookOpen, Sparkles, Eye, Layers } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const PDF_URL = process.env.REACT_APP_SEALED_CARD_PDF_URL || "https://customer-assets.emergentagent.com/job_site-resurrection-1/artifacts/3mzbuwbb_Sealed_Card_Protocol_FINAL.pdf";

const SealedCard = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#f8f9fc] py-12 px-6 md:px-12" data-testid="sealed-card-page">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <p className="text-xs tracking-widest text-[#6366f1] uppercase mb-3">{t.sealedCard.researchProtocol}</p>
          <h1 className="font-serif text-4xl md:text-5xl font-semibold text-[#1a2744] mb-4">{t.sealedCard.title}</h1>
          <p className="text-xl text-gray-600 mb-6">{t.sealedCard.subtitle}</p>
          <p className="text-xs tracking-widest text-gray-400 uppercase">{t.sealedCard.keywords}</p>
        </div>

        <a href={PDF_URL} target="_blank" rel="noopener noreferrer" className="block mb-8 p-6 bg-gradient-to-r from-[#1a2744] to-[#6366f1] rounded-2xl text-white hover:shadow-xl transition-all group" data-testid="pdf-download">
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
          <h2 className="font-serif text-2xl font-semibold text-[#1a2744] mb-4 flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-[#6366f1]" />{t.sealedCard.introduction}
          </h2>
          <p className="text-gray-600 mb-4">
            {t.sealedCard.introP1} <span className="font-semibold text-[#1a2744]">{t.sealedCard.glitch}</span>{t.sealedCard.introP1b}
          </p>
          <p className="text-gray-600 mb-4">
            {t.sealedCard.introP2} <span className="font-semibold text-[#1a2744]">{t.sealedCard.accountability}</span> {t.sealedCard.introP2b}
          </p>
          <p className="text-gray-600">
            {t.sealedCard.introP3} <span className="italic">{t.sealedCard.introP3quote}</span> {t.sealedCard.introP3b}
          </p>
        </div>

        <div className="card mb-8">
          <h2 className="font-serif text-2xl font-semibold text-[#1a2744] mb-6 flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-[#6366f1]" />{t.sealedCard.keyConcepts}
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {t.sealedCard.concepts.map((item, i) => (
              <div key={i} className="p-4 bg-[#f8f9fc] rounded-xl border-l-3 border-[#6366f1]">
                <p className="font-semibold text-[#1a2744] mb-1">{item.term}</p>
                <p className="text-gray-600 text-sm">{item.definition}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card mb-8">
          <h2 className="font-serif text-2xl font-semibold text-[#1a2744] mb-6 flex items-center gap-3">
            <Layers className="w-6 h-6 text-[#6366f1]" />{t.sealedCard.methodology}
          </h2>
          <p className="text-gray-600 mb-6">{t.sealedCard.methodologyDesc}</p>
          <div className="space-y-4">
            {['artistic', 'academic', 'ritual'].map((key, i) => {
              const colors = ['#6366f1', '#8b5cf6', '#a78bfa'];
              return (
                <div key={key} className={`p-5 bg-gradient-to-r from-[${colors[i]}]/5 to-transparent rounded-xl border border-[${colors[i]}]/20`}>
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`w-8 h-8 rounded-full bg-[${colors[i]}] text-white flex items-center justify-center font-bold`}>{i + 1}</span>
                    <h3 className="font-serif text-lg font-semibold text-[#1a2744]">{t.sealedCard.arms[key].title}</h3>
                  </div>
                  <p className="text-gray-600 text-sm ml-11">{t.sealedCard.arms[key].description}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card mb-8">
          <h2 className="font-serif text-2xl font-semibold text-[#1a2744] mb-6 flex items-center gap-3">
            <Eye className="w-6 h-6 text-[#6366f1]" />{t.sealedCard.governancePrinciples}
          </h2>
          <div className="space-y-4">
            {t.sealedCard.principles.map((p, i) => (
              <div key={i} className="p-4 bg-[#f8f9fc] rounded-xl">
                <p className="font-semibold text-[#1a2744] mb-2">{p.title}</p>
                <p className="text-gray-600 text-sm">{p.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card mb-8 border-l-4 border-[#6366f1]">
          <h2 className="font-serif text-xl font-semibold text-[#1a2744] mb-4">{t.sealedCard.conclusion}</h2>
          <p className="text-gray-600 mb-4">{t.sealedCard.conclusionP1}</p>
          <ul className="text-gray-600 space-y-2 ml-4">
            {t.sealedCard.conclusionItems.map((item, i) => (
              <li key={i} className="flex items-start gap-2"><span className="text-[#6366f1] mt-1">•</span>{item}</li>
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
