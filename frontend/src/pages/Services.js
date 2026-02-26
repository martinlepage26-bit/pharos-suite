import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Services = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#F6F7FB] py-12 px-6 md:px-12" data-testid="services-page">
      <div className="max-w-5xl mx-auto">
        <h1 className="page-title mb-4">{t.services.title}</h1>
        <p className="text-gray-600 mb-2 max-w-2xl">{t.services.description}</p>
        <p className="text-xs tracking-widest text-[#7b2cbf] uppercase mb-12">{t.services.keywords}</p>

        <div className="bg-white rounded-xl shadow-[0_4px_16px_rgba(11,15,26,0.06)] border border-gray-100 p-6 mb-8 card-hover-lift">
          <h2 className="font-serif text-2xl font-semibold text-[#0B0F1A] mb-4">{t.services.whatIDeliver}</h2>
          <p className="text-gray-600 mb-4">
            {t.services.deliverP1} <span className="text-[#0B0F1A] font-medium">{t.services.riskClassification}</span> {t.services.deliverP1b} <span className="text-[#0B0F1A] font-medium">{t.services.controls}</span> {t.services.deliverP1c} <span className="text-[#0B0F1A] font-medium">{t.services.documentation}</span> {t.services.deliverP1d}
          </p>
          <p className="text-gray-600 mb-6">{t.services.deliverP2}</p>
          <div className="flex flex-wrap gap-4">
            <Link to="/services/menu" className="btn-primary inline-flex items-center gap-2" data-testid="view-service-menu-btn">
              {t.services.viewServiceMenu} <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/connect" className="btn-ghost">{t.services.bookConsultation}</Link>
          </div>
        </div>

        <h2 className="font-serif text-2xl font-semibold text-[#0B0F1A] mb-6">{t.services.coreOffers}</h2>
        <p className="text-gray-600 mb-6">Three engagement models designed for Canadian organizations at different stages of AI governance maturity.</p>
        
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Link to="/services/menu" className="bg-white rounded-xl shadow-[0_4px_16px_rgba(11,15,26,0.06)] border border-gray-100 p-5 card-hover-lift group">
            <p className="text-xs text-[#7b2cbf] font-semibold uppercase tracking-wide mb-2">Package 1</p>
            <h3 className="font-semibold text-[#0B0F1A] mb-2 group-hover:text-[#0D0A2E]">Governance Foundation</h3>
            <p className="text-sm text-gray-600 mb-3">Establish governance for the first time or consolidate across teams.</p>
            <span className="text-sm text-[#0D0A2E] font-medium">View details →</span>
          </Link>
          <Link to="/services/menu" className="bg-white rounded-xl shadow-[0_4px_16px_rgba(11,15,26,0.06)] border border-gray-100 p-5 card-hover-lift group">
            <p className="text-xs text-[#7b2cbf] font-semibold uppercase tracking-wide mb-2">Package 2</p>
            <h3 className="font-semibold text-[#0B0F1A] mb-2 group-hover:text-[#0D0A2E]">Controls and Evidence Pack</h3>
            <p className="text-sm text-gray-600 mb-3">Prepare for procurement scrutiny and audit review.</p>
            <span className="text-sm text-[#0D0A2E] font-medium">View details →</span>
          </Link>
          <Link to="/services/menu" className="bg-white rounded-xl shadow-[0_4px_16px_rgba(11,15,26,0.06)] border border-gray-100 p-5 card-hover-lift group">
            <p className="text-xs text-[#7b2cbf] font-semibold uppercase tracking-wide mb-2">Package 3</p>
            <h3 className="font-semibold text-[#0B0F1A] mb-2 group-hover:text-[#0D0A2E]">Oversight Retainer</h3>
            <p className="text-sm text-gray-600 mb-3">Stable oversight for active AI delivery.</p>
            <span className="text-sm text-[#0D0A2E] font-medium">View details →</span>
          </Link>
        </div>

        <div className="bg-[linear-gradient(135deg,#0D0A2E_0%,#0D0A2E_40%,#1A1555_70%,#2D2380_100%)] rounded-xl p-6 shadow-[0_8px_32px_rgba(42,32,107,0.4)] relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_30%,rgba(255,255,255,0.1)_50%,transparent_70%)] pointer-events-none"></div>
          <h3 className="font-serif text-xl font-semibold mb-2 text-white">Ready to assess your governance readiness?</h3>
          <p className="text-white/80 mb-4">Take the preliminary assessment to understand where you stand.</p>
          <Link to="/tool" className="inline-block bg-white text-[#0B0F1A] px-5 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
            Start Assessment
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Services;
