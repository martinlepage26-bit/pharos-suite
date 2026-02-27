import { Link } from 'react-router-dom';
import { ArrowRight, Shield, FileText, Scale } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import StarterKitCTA from '../components/StarterKitCTA';

const Home = () => {
  const { t, language } = useLanguage();

  const capabilities = [
    { icon: Shield, title: t.home.capabilities.riskClassification, description: t.home.capabilities.riskClassificationDesc },
    { icon: FileText, title: t.home.capabilities.evidenceArchitecture, description: t.home.capabilities.evidenceArchitectureDesc },
    { icon: Scale, title: t.home.capabilities.controlDesign, description: t.home.capabilities.controlDesignDesc }
  ];

  return (
    <div className="min-h-screen bg-white" data-testid="home-page">
      <div className="max-w-6xl mx-auto px-6 py-12">
        
        {/* Hero Section - Centered Editorial Layout */}
        <div className="text-center mb-16">
          <h1 
            className="text-4xl md:text-5xl font-semibold text-[#1a1a1a] leading-none tracking-tight mb-3" 
            style={{
              fontFamily: "'IBM Plex Sans', system-ui, sans-serif", 
              fontVariant: 'small-caps', 
              letterSpacing: '-0.01em'
            }}
          >
            {t.home.title}
          </h1>
          
          {/* Decorative line with diamond - centered */}
          <div className="flex items-center justify-center mb-2" style={{maxWidth: '280px', margin: '0 auto'}}>
            <svg viewBox="0 0 100 4" className="flex-1 h-1" preserveAspectRatio="none">
              <polygon points="0,2 100,0 100,4" fill="#0B0F1A" />
            </svg>
            <div className="mx-1" style={{
              width: '8px',
              height: '14px',
              background: 'linear-gradient(180deg, #2D2380 0%, #1a1555 100%)',
              clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
              flexShrink: 0
            }}></div>
            <svg viewBox="0 0 100 4" className="flex-1 h-1" preserveAspectRatio="none">
              <polygon points="0,0 100,2 0,4" fill="#0B0F1A" />
            </svg>
          </div>
          
          <p 
            className="text-xl md:text-2xl text-[#1a1a1a]/50 mb-6" 
            style={{
              fontFamily: "'Source Serif 4', Georgia, serif", 
              fontStyle: 'italic', 
              fontWeight: 400
            }}
          >
            {t.home.subtitle}
          </p>
          
          {/* Bullet points - single line */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[#0B0F1A]/60 mb-8">
            <span className="inline-flex items-center text-sm" style={{fontFamily: "'Lato', sans-serif"}}>
              <span className="w-1.5 h-1.5 mr-2 bg-[#2D2380] rotate-45"></span>
              {language === 'fr' ? 'Directives du Conseil du Trésor' : 'Treasury Board directives'}
            </span>
            <span className="inline-flex items-center text-sm" style={{fontFamily: "'Lato', sans-serif"}}>
              <span className="w-1.5 h-1.5 mr-2 bg-[#2D2380] rotate-45"></span>
              {language === 'fr' ? 'Loi 25 du Québec' : "Quebec's Law 25"}
            </span>
            <span className="inline-flex items-center text-sm" style={{fontFamily: "'Lato', sans-serif"}}>
              <span className="w-1.5 h-1.5 mr-2 bg-[#2D2380] rotate-45"></span>
              {language === 'fr' ? 'Obligations LIAD émergentes' : 'Emerging AIDA obligations'}
            </span>
          </div>
          
          {/* Buttons - centered */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <Link 
              to="/services" 
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1a1a1a] text-white text-sm font-medium rounded-sm hover:bg-[#333] transition-colors" 
              data-testid="view-services-btn"
              style={{fontFamily: "'Lato', sans-serif"}}
            >
              {t.home.viewServices} <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              to="/connect" 
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#1a1a1a]/20 text-[#1a1a1a] text-sm font-medium rounded-sm hover:border-[#1a1a1a]/40 transition-colors" 
              data-testid="book-consultation-btn"
              style={{fontFamily: "'Lato', sans-serif"}}
            >
              {t.home.bookDebrief}
            </Link>
          </div>

          {/* Logo - centered below */}
          <div className="flex justify-center">
            <img 
              src="/images/logo-home-new.png" 
              alt="AI Governance: Practice & Research by Martin Lepage PhD" 
              className="w-56 md:w-64 h-auto opacity-90"
            />
          </div>
        </div>

        {/* Three Feature Boxes - Tighter */}
        <div className="bg-[#F6F7FB] py-6 px-6 -mx-6 rounded-lg">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-4">
              {capabilities.map((cap, i) => (
                <div 
                  key={i} 
                  className="flex items-start gap-3 p-3 rounded-lg transition-all duration-300 ease-out hover:bg-white hover:shadow-sm"
                >
                  <div className="w-8 h-8 rounded-md bg-white/80 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <cap.icon className="w-4 h-4 text-[#0D0A2E]" />
                  </div>
                  <div>
                    <p 
                      className="font-semibold text-[#0B0F1A] leading-tight text-sm"
                      style={{fontFamily: "'IBM Plex Sans', sans-serif"}}
                    >
                      {cap.title}
                    </p>
                    <p 
                      className="text-xs text-[#0B0F1A]/60 leading-relaxed mt-0.5"
                      style={{fontFamily: "'Lato', sans-serif"}}
                    >
                      {cap.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Starter Kit CTA */}
        <div className="mt-12"><StarterKitCTA /></div>

        {/* Bottom Navigation Cards */}
        <div className="mt-12 pt-10 border-t border-[#0B0F1A]/5">
          <div className="grid md:grid-cols-4 gap-8">
            <Link to="/tool" className="group">
              <p 
                className="text-xs tracking-widest text-[#0D0A2E] uppercase mb-1"
                style={{fontFamily: "'Lato', sans-serif"}}
              >
                {t.home.sections.assessment}
              </p>
              <h3 
                className="text-base font-semibold text-[#0B0F1A] group-hover:text-[#0D0A2E] transition-colors mb-0.5"
                style={{fontFamily: "'Source Serif 4', serif"}}
              >
                {t.home.sections.readinessSnapshot}
              </h3>
              <p 
                className="text-[#0B0F1A]/60 text-sm"
                style={{fontFamily: "'Lato', sans-serif"}}
              >
                {t.home.sections.assessMaturity}
              </p>
            </Link>
            <Link to="/cases" className="group">
              <p 
                className="text-xs tracking-widest text-[#0D0A2E] uppercase mb-1"
                style={{fontFamily: "'Lato', sans-serif"}}
              >
                {t.home.sections.portfolio}
              </p>
              <h3 
                className="text-base font-semibold text-[#0B0F1A] group-hover:text-[#0D0A2E] transition-colors mb-0.5"
                style={{fontFamily: "'Source Serif 4', serif"}}
              >
                {t.home.sections.caseStudies}
              </h3>
              <p 
                className="text-[#0B0F1A]/60 text-sm"
                style={{fontFamily: "'Lato', sans-serif"}}
              >
                {t.home.sections.seeExamples}
              </p>
            </Link>
            <Link to="/research" className="group">
              <p 
                className="text-xs tracking-widest text-[#0D0A2E] uppercase mb-1"
                style={{fontFamily: "'Lato', sans-serif"}}
              >
                {t.home.sections.research}
              </p>
              <h3 
                className="text-base font-semibold text-[#0B0F1A] group-hover:text-[#0D0A2E] transition-colors mb-0.5"
                style={{fontFamily: "'Source Serif 4', serif"}}
              >
                {t.home.sections.briefings}
              </h3>
              <p 
                className="text-[#0B0F1A]/60 text-sm"
                style={{fontFamily: "'Lato', sans-serif"}}
              >
                {t.home.sections.incidentsToControls}
              </p>
            </Link>
            <Link to="/library" className="group">
              <p 
                className="text-xs tracking-widest text-[#0D0A2E] uppercase mb-1"
                style={{fontFamily: "'Lato', sans-serif"}}
              >
                {t.home.sections.resources}
              </p>
              <h3 
                className="text-base font-semibold text-[#0B0F1A] group-hover:text-[#0D0A2E] transition-colors mb-0.5"
                style={{fontFamily: "'Source Serif 4', serif"}}
              >
                {t.home.sections.library}
              </h3>
              <p 
                className="text-[#0B0F1A]/60 text-sm"
                style={{fontFamily: "'Lato', sans-serif"}}
              >
                {t.home.sections.frameworksStandards}
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
