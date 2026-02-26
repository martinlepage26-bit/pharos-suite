import { Link } from 'react-router-dom';
import { ArrowRight, Shield, FileText, Scale } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import StarterKitCTA from '../components/StarterKitCTA';

const Home = () => {
  const { t } = useLanguage();

  const capabilities = [
    { icon: Shield, title: t.home.capabilities.riskClassification, description: t.home.capabilities.riskClassificationDesc },
    { icon: FileText, title: t.home.capabilities.evidenceArchitecture, description: t.home.capabilities.evidenceArchitectureDesc },
    { icon: Scale, title: t.home.capabilities.controlDesign, description: t.home.capabilities.controlDesignDesc }
  ];

  return (
    <div className="min-h-screen bg-[#F6F7FB]" data-testid="home-page">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left: Text Content */}
          <div>
            {/* Hero Title - AI Governance on one line */}
            <div className="mb-10">
              <h1 className="font-serif text-5xl md:text-6xl font-semibold text-[#0B0F1A] leading-none tracking-tight whitespace-nowrap">
                AI Governance
              </h1>
              {/* Strategy & Oversight */}
              <p className="font-serif text-2xl md:text-3xl text-[#0B0F1A]/60 mt-3">
                Strategy & Oversight
              </p>
            </div>
            
            <p className="text-[#0B0F1A]/70 text-lg leading-relaxed mb-4">{t.home.description}</p>
            <p className="text-xs tracking-widest text-[#0B0F1A]/35 uppercase mb-8">{t.home.keywords}</p>
            
            <div className="flex flex-wrap gap-4 mb-12">
              <Link to="/services" className="btn-primary inline-flex items-center gap-2" data-testid="view-services-btn">
                {t.home.viewServices} <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/connect" className="btn-ghost inline-flex items-center gap-2" data-testid="book-consultation-btn">
                {t.home.bookDebrief}
              </Link>
            </div>

            <div className="space-y-5">
              {capabilities.map((cap, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-lg bg-[#4B2ABF]/10 flex items-center justify-center flex-shrink-0">
                    <cap.icon className="w-4 h-4 text-[#4B2ABF]" />
                  </div>
                  <div>
                    <p className="font-medium text-[#0B0F1A]">{cap.title}</p>
                    <p className="text-sm text-[#0B0F1A]/60">{cap.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Full Logo - no background */}
          <div className="flex justify-center md:justify-end">
            <img 
              src="/images/logo-final.png" 
              alt="AI Governance - Practice & Research by Martin Lepage PhD" 
              className="w-80 md:w-[28rem] h-auto"
            />
          </div>
        </div>

        <div className="mt-20"><StarterKitCTA /></div>

        <div className="mt-20 pt-12 border-t border-[#0B0F1A]/5">
          <div className="grid md:grid-cols-4 gap-10">
            <Link to="/tool" className="group">
              <p className="text-xs tracking-widest text-[#4B2ABF] uppercase mb-2">{t.home.sections.assessment}</p>
              <h3 className="font-serif text-lg font-semibold text-[#0B0F1A] group-hover:text-[#4B2ABF] transition-colors mb-1">{t.home.sections.readinessSnapshot}</h3>
              <p className="text-[#0B0F1A]/60 text-sm">{t.home.sections.assessMaturity}</p>
            </Link>
            <Link to="/cases" className="group">
              <p className="text-xs tracking-widest text-[#4B2ABF] uppercase mb-2">{t.home.sections.portfolio}</p>
              <h3 className="font-serif text-lg font-semibold text-[#0B0F1A] group-hover:text-[#4B2ABF] transition-colors mb-1">{t.home.sections.caseStudies}</h3>
              <p className="text-[#0B0F1A]/60 text-sm">{t.home.sections.seeExamples}</p>
            </Link>
            <Link to="/research" className="group">
              <p className="text-xs tracking-widest text-[#4B2ABF] uppercase mb-2">{t.home.sections.research}</p>
              <h3 className="font-serif text-lg font-semibold text-[#0B0F1A] group-hover:text-[#4B2ABF] transition-colors mb-1">{t.home.sections.briefings}</h3>
              <p className="text-[#0B0F1A]/60 text-sm">{t.home.sections.incidentsToControls}</p>
            </Link>
            <Link to="/library" className="group">
              <p className="text-xs tracking-widest text-[#4B2ABF] uppercase mb-2">{t.home.sections.resources}</p>
              <h3 className="font-serif text-lg font-semibold text-[#0B0F1A] group-hover:text-[#4B2ABF] transition-colors mb-1">{t.home.sections.library}</h3>
              <p className="text-[#0B0F1A]/60 text-sm">{t.home.sections.frameworksStandards}</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
