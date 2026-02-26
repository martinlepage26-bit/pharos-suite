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
    <div className="min-h-screen bg-white" data-testid="home-page">
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Hero Section - Two columns */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          {/* Left: Hero Text - all left aligned */}
          <div>
            <h1 className="text-5xl md:text-6xl font-semibold text-[#0B0F1A] leading-none tracking-tight whitespace-nowrap" style={{fontFamily: "'IBM Plex Sans', system-ui, sans-serif", fontVariant: 'small-caps'}}>
              {t.home.title}
            </h1>
            <div className="flex items-center mt-2 mb-1" style={{width: '100%', maxWidth: '420px'}}>
              <div className="h-[2px] flex-1 bg-gradient-to-r from-[#0B0F1A] via-[#0B0F1A]/80 to-[#0B0F1A]"></div>
              <div className="mx-1" style={{
                width: '6px',
                height: '18px',
                background: 'linear-gradient(180deg, #2D2380 0%, #1a1555 100%)',
                clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'
              }}></div>
              <div className="h-[2px] flex-1 bg-gradient-to-l from-[#0B0F1A] via-[#0B0F1A]/80 to-[#0B0F1A]"></div>
            </div>
            <p className="text-2xl md:text-3xl text-[#0B0F1A]/60" style={{fontFamily: "'IBM Plex Sans', system-ui, sans-serif", fontStyle: 'italic', fontWeight: 600}}>
              {t.home.subtitle}
            </p>
            
            <div className="mt-8 mb-4">
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[#0B0F1A]/80">
                <span className="inline-flex items-center text-sm">
                  <span className="w-2 h-2 mr-2 bg-gradient-to-br from-[#7b2cbf] to-[#2D2380] rotate-45"></span>
                  Treasury Board directives
                </span>
                <span className="inline-flex items-center text-sm">
                  <span className="w-2 h-2 mr-2 bg-gradient-to-br from-[#7b2cbf] to-[#2D2380] rotate-45"></span>
                  Quebec's Law&nbsp;25
                </span>
                <span className="inline-flex items-center text-sm">
                  <span className="w-2 h-2 mr-2 bg-gradient-to-br from-[#7b2cbf] to-[#2D2380] rotate-45"></span>
                  Emerging AIDA obligations
                </span>
              </div>
              
              <div className="flex items-center gap-3 pt-3">
                <span className="text-sm font-semibold tracking-wide text-[#0B0F1A] uppercase">Product</span>
                <span className="w-8 h-px bg-gradient-to-r from-[#7b2cbf] to-[#7b2cbf]/30"></span>
                <span className="text-[#0B0F1A]/70 text-sm">AI decisions that are documented, reviewable, and defensible.</span>
              </div>
            </div>
            
            <p className="text-xs tracking-widest text-[#0B0F1A]/35 uppercase mb-8">{t.home.keywords}</p>
            
            <div className="flex flex-wrap gap-4 mb-12">
              <Link to="/services" className="btn-primary inline-flex items-center gap-2" data-testid="view-services-btn">
                {t.home.viewServices} <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/connect" className="btn-ghost inline-flex items-center gap-2" data-testid="book-consultation-btn">
                {t.home.bookDebrief}
              </Link>
            </div>

            <div className="bg-[#F6F7FB]/70 border border-gray-200/50 rounded-xl p-6">
              {capabilities.map((cap, i) => (
                <div key={i} className={i < capabilities.length - 1 ? "mb-8" : ""}>
                  <div className="flex items-start gap-4">
                    <div className="w-9 h-9 rounded-lg bg-[#0D0A2E]/10 flex items-center justify-center flex-shrink-0">
                      <cap.icon className="w-4 h-4 text-[#0D0A2E]" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#0B0F1A] leading-tight">{cap.title}</p>
                      <p className="text-sm text-[#0B0F1A]/60 leading-relaxed mt-1">{cap.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Logo - centered vertically */}
          <div className="flex items-center justify-center">
            <img 
              src="/images/logo-home-new.png" 
              alt="AI Governance: Practice & Research by Martin Lepage PhD" 
              className="w-80 md:w-[24rem] h-auto"
            />
          </div>
        </div>

        <div className="mt-20"><StarterKitCTA /></div>

        <div className="mt-20 pt-12 border-t border-[#0B0F1A]/5">
          <div className="grid md:grid-cols-4 gap-10">
            <Link to="/tool" className="group">
              <p className="text-xs tracking-widest text-[#0D0A2E] uppercase mb-2">{t.home.sections.assessment}</p>
              <h3 className="font-serif text-lg font-semibold text-[#0B0F1A] group-hover:text-[#0D0A2E] transition-colors mb-1">{t.home.sections.readinessSnapshot}</h3>
              <p className="text-[#0B0F1A]/60 text-sm">{t.home.sections.assessMaturity}</p>
            </Link>
            <Link to="/cases" className="group">
              <p className="text-xs tracking-widest text-[#0D0A2E] uppercase mb-2">{t.home.sections.portfolio}</p>
              <h3 className="font-serif text-lg font-semibold text-[#0B0F1A] group-hover:text-[#0D0A2E] transition-colors mb-1">{t.home.sections.caseStudies}</h3>
              <p className="text-[#0B0F1A]/60 text-sm">{t.home.sections.seeExamples}</p>
            </Link>
            <Link to="/research" className="group">
              <p className="text-xs tracking-widest text-[#0D0A2E] uppercase mb-2">{t.home.sections.research}</p>
              <h3 className="font-serif text-lg font-semibold text-[#0B0F1A] group-hover:text-[#0D0A2E] transition-colors mb-1">{t.home.sections.briefings}</h3>
              <p className="text-[#0B0F1A]/60 text-sm">{t.home.sections.incidentsToControls}</p>
            </Link>
            <Link to="/library" className="group">
              <p className="text-xs tracking-widest text-[#0D0A2E] uppercase mb-2">{t.home.sections.resources}</p>
              <h3 className="font-serif text-lg font-semibold text-[#0B0F1A] group-hover:text-[#0D0A2E] transition-colors mb-1">{t.home.sections.library}</h3>
              <p className="text-[#0B0F1A]/60 text-sm">{t.home.sections.frameworksStandards}</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
