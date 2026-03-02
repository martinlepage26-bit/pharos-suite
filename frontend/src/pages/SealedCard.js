import { Link } from 'react-router-dom';
import { FileText, BookOpen, Sparkles, Eye, Layers, Lock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const SealedCard = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F6F7FB] via-[#F6F7FB] to-[#0D0A2E]/5 py-12 px-6 md:px-12" data-testid="sealed-card-page">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="mb-12 relative">
          <div className="absolute -top-4 -left-4 w-24 h-24 bg-[#7b2cbf]/5 rounded-full blur-2xl"></div>
          <div className="absolute top-10 right-10 w-32 h-32 bg-[#0D0A2E]/5 rounded-full blur-3xl"></div>
          <p className="text-xs tracking-widest text-[#7b2cbf] uppercase mb-3 font-semibold">{t.sealedCard.researchProtocol}</p>
          <h1 className="page-title text-4xl md:text-5xl mb-4 relative">
            <span className="bg-gradient-to-r from-[#0B0F1A] via-[#2D2380] to-[#0B0F1A] bg-clip-text" style={{WebkitBackgroundClip: 'text'}}>
              {t.sealedCard.title}
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-6 max-w-2xl">{t.sealedCard.subtitle}</p>
          <p className="text-xs tracking-widest text-[#7b2cbf] uppercase">{t.sealedCard.keywords}</p>
        </div>

        {/* PDF Block - Coming Soon */}
        <div className="mb-8 p-6 bg-gradient-to-br from-[#0D0A2E]/10 via-[#2D2380]/5 to-[#7b2cbf]/5 rounded-2xl border border-[#0D0A2E]/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_30%,rgba(45,35,128,0.05)_50%,transparent_70%)]"></div>
          <div className="flex items-center justify-between relative">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#0D0A2E]/20 to-[#7b2cbf]/10 flex items-center justify-center">
                <FileText className="w-7 h-7 text-[#0D0A2E]" />
              </div>
              <div>
                <p className="font-semibold text-lg text-[#0B0F1A]">{t.sealedCard.fullDocument}</p>
                <p className="text-gray-500 text-sm">{t.sealedCard.fullDocumentDesc}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-100 rounded-full">
              <Lock className="w-4 h-4 text-amber-700" />
              <span className="text-xs font-semibold text-amber-700">Coming soon</span>
            </div>
          </div>
        </div>

        {/* Introduction */}
        <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(11,15,26,0.06)] border border-gray-100 p-6 mb-6 card-hover-lift">
          <h2 className="font-serif text-2xl font-semibold text-[#0B0F1A] mb-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0D0A2E]/15 to-[#7b2cbf]/10 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-[#0D0A2E]" />
            </div>
            {t.sealedCard.introduction}
          </h2>
          <p className="text-gray-600 mb-4">
            {t.sealedCard.introP1} <span className="font-semibold text-[#0D0A2E]">{t.sealedCard.glitch}</span>{t.sealedCard.introP1b}
          </p>
          <p className="text-gray-600 mb-4">
            {t.sealedCard.introP2} <span className="font-semibold text-[#0D0A2E]">{t.sealedCard.accountability}</span> {t.sealedCard.introP2b}
          </p>
          <p className="text-gray-600">
            {t.sealedCard.introP3} <span className="italic text-[#7b2cbf]">{t.sealedCard.introP3quote}</span> {t.sealedCard.introP3b}
          </p>
        </div>

        {/* Key Concepts */}
        <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(11,15,26,0.06)] border border-gray-100 p-6 mb-6 card-hover-lift">
          <h2 className="font-serif text-2xl font-semibold text-[#0B0F1A] mb-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7b2cbf]/15 to-[#2D2380]/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#7b2cbf]" />
            </div>
            {t.sealedCard.keyConcepts}
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {t.sealedCard.concepts.map((item, i) => (
              <div key={i} className="p-4 bg-gradient-to-r from-[#F6F7FB] to-white rounded-xl border-l-4 border-[#7b2cbf]">
                <p className="font-semibold text-[#0B0F1A] mb-1">{item.term}</p>
                <p className="text-gray-600 text-sm">{item.definition}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Methodology */}
        <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(11,15,26,0.06)] border border-gray-100 p-6 mb-6 card-hover-lift">
          <h2 className="font-serif text-2xl font-semibold text-[#0B0F1A] mb-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0D0A2E]/15 to-[#2D2380]/10 flex items-center justify-center">
              <Layers className="w-5 h-5 text-[#0D0A2E]" />
            </div>
            {t.sealedCard.methodology}
          </h2>
          <p className="text-gray-600 mb-6">{t.sealedCard.methodologyDesc}</p>
          <div className="space-y-4">
            {['artistic', 'academic', 'ritual'].map((key, i) => {
              const gradients = [
                'from-[#0D0A2E]/8 via-[#0D0A2E]/3 to-transparent',
                'from-[#2D2380]/8 via-[#2D2380]/3 to-transparent',
                'from-[#7b2cbf]/8 via-[#7b2cbf]/3 to-transparent'
              ];
              const colors = ['#0D0A2E', '#2D2380', '#7b2cbf'];
              return (
                <div key={key} className={`p-5 bg-gradient-to-r ${gradients[i]} rounded-xl border border-gray-100`}>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-sm" style={{backgroundColor: colors[i]}}>{i + 1}</span>
                    <h3 className="font-serif text-lg font-semibold text-[#0B0F1A]">{t.sealedCard.arms[key].title}</h3>
                  </div>
                  <p className="text-gray-600 text-sm ml-12">{t.sealedCard.arms[key].description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Governance Principles */}
        <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(11,15,26,0.06)] border border-gray-100 p-6 mb-6 card-hover-lift">
          <h2 className="font-serif text-2xl font-semibold text-[#0B0F1A] mb-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0D0A2E]/15 to-[#7b2cbf]/10 flex items-center justify-center">
              <Eye className="w-5 h-5 text-[#0D0A2E]" />
            </div>
            {t.sealedCard.governancePrinciples}
          </h2>
          <div className="space-y-4">
            {t.sealedCard.principles.map((p, i) => (
              <div key={i} className="p-4 bg-[#F6F7FB] rounded-xl hover:bg-[#0D0A2E]/5 transition-colors">
                <p className="font-semibold text-[#0B0F1A] mb-2">{p.title}</p>
                <p className="text-gray-600 text-sm">{p.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Conclusion */}
        <div className="bg-gradient-to-r from-[#0D0A2E]/5 via-white to-[#7b2cbf]/5 rounded-2xl shadow-[0_4px_20px_rgba(11,15,26,0.06)] border-l-4 border-[#0D0A2E] p-6 mb-8">
          <h2 className="font-serif text-xl font-semibold text-[#0B0F1A] mb-4">{t.sealedCard.conclusion}</h2>
          <p className="text-gray-600 mb-4">{t.sealedCard.conclusionP1}</p>
          <ul className="text-gray-600 space-y-2 ml-4">
            {t.sealedCard.conclusionItems.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-[#7b2cbf] rounded-full mt-2 flex-shrink-0"></span>
                {item}
              </li>
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

