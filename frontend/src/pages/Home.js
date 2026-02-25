import { Link } from 'react-router-dom';
import { ArrowRight, Shield, FileText, Scale } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import StarterKitCTA from '../components/StarterKitCTA';

const LOGO_URL = process.env.REACT_APP_LOGO_URL || "https://customer-assets.emergentagent.com/job_site-resurrection-1/artifacts/98548zap_logo.png";

const Home = () => {
  const { t } = useLanguage();

  const capabilities = [
    { icon: Shield, title: t.home.capabilities.riskClassification, description: t.home.capabilities.riskClassificationDesc },
    { icon: FileText, title: t.home.capabilities.evidenceArchitecture, description: t.home.capabilities.evidenceArchitectureDesc },
    { icon: Scale, title: t.home.capabilities.controlDesign, description: t.home.capabilities.controlDesignDesc }
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fc]" data-testid="home-page">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="font-serif text-4xl md:text-5xl font-semibold text-[#1a2744] mb-6 leading-tight">
              {t.home.title}<br />
              {t.home.subtitle}
            </h1>
            <p className="text-gray-600 text-lg mb-6">{t.home.description}</p>
            <p className="text-xs tracking-widest text-gray-400 uppercase mb-8">{t.home.keywords}</p>
            <div className="flex flex-wrap gap-4 mb-12">
              <Link to="/services" className="btn-primary inline-flex items-center gap-2" data-testid="view-services-btn">
                {t.home.viewServices} <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/connect" className="btn-ghost inline-flex items-center gap-2" data-testid="book-consultation-btn">
                {t.home.bookDebrief}
              </Link>
            </div>
            <div className="space-y-4">
              {capabilities.map((cap, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#6366f1]/10 flex items-center justify-center flex-shrink-0">
                    <cap.icon className="w-4 h-4 text-[#6366f1]" />
                  </div>
                  <div>
                    <p className="font-medium text-[#1a2744]">{cap.title}</p>
                    <p className="text-sm text-gray-500">{cap.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center md:justify-end">
            <img src={LOGO_URL} alt="AI Governance Symbol" className="w-64 md:w-80 object-contain" data-testid="home-hero-image" />
          </div>
        </div>

        <div className="mt-16"><StarterKitCTA /></div>

        <div className="mt-16 pt-12 border-t border-gray-200">
          <div className="grid md:grid-cols-4 gap-8">
            <Link to="/tool" className="group">
              <p className="text-xs tracking-widest text-[#6366f1] uppercase mb-2">{t.home.sections.assessment}</p>
              <h3 className="font-serif text-lg font-semibold text-[#1a2744] group-hover:text-[#6366f1] transition-colors mb-1">{t.home.sections.readinessSnapshot}</h3>
              <p className="text-gray-600 text-sm">{t.home.sections.assessMaturity}</p>
            </Link>
            <Link to="/cases" className="group">
              <p className="text-xs tracking-widest text-[#6366f1] uppercase mb-2">{t.home.sections.portfolio}</p>
              <h3 className="font-serif text-lg font-semibold text-[#1a2744] group-hover:text-[#6366f1] transition-colors mb-1">{t.home.sections.caseStudies}</h3>
              <p className="text-gray-600 text-sm">{t.home.sections.seeExamples}</p>
            </Link>
            <Link to="/research" className="group">
              <p className="text-xs tracking-widest text-[#6366f1] uppercase mb-2">{t.home.sections.research}</p>
              <h3 className="font-serif text-lg font-semibold text-[#1a2744] group-hover:text-[#6366f1] transition-colors mb-1">{t.home.sections.briefings}</h3>
              <p className="text-gray-600 text-sm">{t.home.sections.incidentsToControls}</p>
            </Link>
            <Link to="/library" className="group">
              <p className="text-xs tracking-widest text-[#6366f1] uppercase mb-2">{t.home.sections.resources}</p>
              <h3 className="font-serif text-lg font-semibold text-[#1a2744] group-hover:text-[#6366f1] transition-colors mb-1">{t.home.sections.library}</h3>
              <p className="text-gray-600 text-sm">{t.home.sections.frameworksStandards}</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
