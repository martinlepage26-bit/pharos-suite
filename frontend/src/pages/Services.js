import { Link } from 'react-router-dom';
import { Shield, FileText, RefreshCw, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Services = () => {
  const { t } = useLanguage();

  const offerKeys = ['foundation', 'controls', 'oversight'];
  const icons = [Shield, FileText, RefreshCw];

  const pricingKeys = ['scope', 'sector', 'timeline'];

  return (
    <div className="min-h-screen bg-[#f8f9fc] py-12 px-6 md:px-12" data-testid="services-page">
      <div className="max-w-5xl mx-auto">
        <h1 className="font-serif text-4xl md:text-5xl font-semibold text-[#1a2744] mb-4">{t.services.title}</h1>
        <p className="text-gray-600 mb-2 max-w-2xl">{t.services.description}</p>
        <p className="text-xs tracking-widest text-gray-400 uppercase mb-12">{t.services.keywords}</p>

        <div className="card mb-12">
          <h2 className="font-serif text-2xl font-semibold text-[#1a2744] mb-4">{t.services.whatIDeliver}</h2>
          <p className="text-gray-600 mb-4">
            {t.services.deliverP1} <span className="text-[#1a2744] font-medium">{t.services.riskClassification}</span> {t.services.deliverP1b} <span className="text-[#1a2744] font-medium">{t.services.controls}</span> {t.services.deliverP1c} <span className="text-[#1a2744] font-medium">{t.services.documentation}</span> {t.services.deliverP1d}
          </p>
          <p className="text-gray-600 mb-6">{t.services.deliverP2}</p>
          <div className="flex flex-wrap gap-4">
            <Link to="/services/menu" className="btn-primary inline-flex items-center gap-2" data-testid="view-service-menu-btn">
              {t.services.viewServiceMenu} <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/connect" className="btn-ghost">{t.services.bookConsultation}</Link>
          </div>
        </div>

        <h2 className="font-serif text-2xl font-semibold text-[#1a2744] mb-6">{t.services.coreOffers}</h2>
        <div className="space-y-6 mb-12">
          {offerKeys.map((key, index) => {
            const Icon = icons[index];
            const offer = t.services.offers[key];
            return (
              <div key={key} className="card card-hover" data-testid={`core-offer-${index}`}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#6366f1]/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-[#6366f1]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-serif text-xl font-semibold text-[#1a2744] mb-2">{offer.title}</h3>
                    <p className="text-gray-600 mb-3">{offer.description}</p>
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="bg-[#f8f9fc] rounded-lg p-3">
                        <p className="text-xs text-[#6366f1] uppercase tracking-wide font-medium mb-1">{t.services.outputs}</p>
                        <p className="text-gray-600 text-sm">{offer.outputs}</p>
                      </div>
                      <div className="bg-[#f8f9fc] rounded-lg p-3">
                        <p className="text-xs text-[#6366f1] uppercase tracking-wide font-medium mb-1">{t.services.idealFor}</p>
                        <p className="text-gray-600 text-sm">{offer.ideal}</p>
                      </div>
                    </div>
                    <Link to="/services/menu" className="text-[#6366f1] text-sm font-medium hover:underline inline-flex items-center gap-1">
                      {t.services.seeDetails} <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <h2 className="font-serif text-2xl font-semibold text-[#1a2744] mb-4">{t.services.pricingTitle}</h2>
        <p className="text-gray-600 mb-6">{t.services.pricingDescription}</p>
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {pricingKeys.map((key, index) => (
            <div key={key} className="card" data-testid={`pricing-factor-${index}`}>
              <h3 className="font-serif text-lg font-semibold text-[#1a2744] mb-3">{t.services.pricing[key].title}</h3>
              <p className="text-gray-600 text-sm">{t.services.pricing[key].description}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-4">
          <Link to="/tool" className="btn-primary inline-flex items-center gap-2" data-testid="assess-readiness-btn">
            {t.services.assessReadiness} <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/connect" className="btn-ghost">{t.services.book30Min}</Link>
        </div>
      </div>
    </div>
  );
};

export default Services;
