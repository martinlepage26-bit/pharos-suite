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
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section - Two columns */}
        <div className="grid md:grid-cols-2 gap-8 items-start mb-8">
          {/* Left: Hero Text */}
          <div>
            <h1 
              className="text-5xl md:text-6xl font-semibold text-[#1a1a1a] leading-none tracking-tight" 
              style={{
                fontFamily: "'IBM Plex Sans', system-ui, sans-serif", 
                fontVariant: 'small-caps', 
                letterSpacing: '-0.01em', 
                lineHeight: '1.05'
              }}
            >
              {t.home.title}
            </h1>
            
            {/* Decorative line with diamond */}
            <div className="flex items-center mt-2 mb-1" style={{width: '100%', maxWidth: '320px'}}>
              <svg viewBox="0 0 100 4" className="flex-1 h-1" preserveAspectRatio="none">
                <polygon points="0,2 100,0 100,4" fill="#0B0F1A" />
              </svg>
              <div className="mx-0" style={{
                width: '8px',
                height: '16px',
                background: 'linear-gradient(180deg, #2D2380 0%, #1a1555 100%)',
                clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
                flexShrink: 0
              }}></div>
              <svg viewBox="0 0 100 4" className="flex-1 h-1" preserveAspectRatio="none">
                <polygon points="0,0 100,2 0,4" fill="#0B0F1A" />
              </svg>
            </div>
            
            <p 
              className="text-2xl md:text-3xl text-[#1a1a1a]/50" 
              style={{
                fontFamily: "'Source Serif 4', 'IBM Plex Sans', serif", 
                fontStyle: 'italic', 
                fontWeight: 400, 
                letterSpacing: '-0.01em', 
                lineHeight: '1.2'
              }}
            >
              {t.home.subtitle}
            </p>
            
            {/* Bullet points */}
            <div className="mt-6 mb-4">
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[#0B0F1A]/70">
                <span className="inline-flex items-center text-sm" style={{fontFamily: "'Lato', sans-serif"}}>
                  <span className="w-2 h-2 mr-2 bg-gradient-to-br from-[#7b2cbf] to-[#2D2380] rotate-45"></span>
                  Treasury Board directives
                </span>
                <span className="inline-flex items-center text-sm" style={{fontFamily: "'Lato', sans-serif"}}>
                  <span className="w-2 h-2 mr-2 bg-gradient-to-br from-[#7b2cbf] to-[#2D2380] rotate-45"></span>
                  Quebec's Law&nbsp;25
                </span>
                <span className="inline-flex items-center text-sm" style={{fontFamily: "'Lato', sans-serif"}}>
                  <span className="w-2 h-2 mr-2 bg-gradient-to-br from-[#7b2cbf] to-[#2D2380] rotate-45"></span>
                  Emerging AIDA obligations
                </span>
              </div>
              
              {/* PRODUCT line */}
              <div className="flex items-center gap-3 pt-4">
                <span 
                  className="text-sm font-semibold tracking-wide text-[#0B0F1A] uppercase"
                  style={{fontFamily: "'Lato', sans-serif"}}
                >
                  Product
                </span>
                <span className="w-8 h-px bg-gradient-to-r from-[#7b2cbf] to-[#7b2cbf]/30"></span>
                <span 
                  className="text-[#0B0F1A]/60 text-sm"
                  style={{fontFamily: "'Lato', sans-serif"}}
                >
                  AI decisions that are documented, reviewable, and defensible.
                </span>
              </div>
            </div>
            
            {/* Keywords */}
            <p 
              className="text-xs tracking-widest text-[#7b2cbf] uppercase mb-6"
              style={{fontFamily: "'Lato', sans-serif"}}
            >
              {t.home.keywords}
            </p>
            
            {/* Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link 
                to="/services" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#1a1a1a] text-white text-sm font-medium rounded-sm hover:bg-[#333] transition-colors" 
                data-testid="view-services-btn"
                style={{fontFamily: "'Lato', sans-serif"}}
              >
                {t.home.viewServices} <ArrowRight className="w-4 h-4" />
              </Link>
              <Link 
                to="/connect" 
                className="inline-flex items-center gap-2 px-6 py-3 border border-[#1a1a1a]/20 text-[#1a1a1a] text-sm font-medium rounded-sm hover:border-[#1a1a1a]/40 hover:bg-[#f5f5f5] transition-colors" 
                data-testid="book-consultation-btn"
                style={{fontFamily: "'Lato', sans-serif"}}
              >
                {t.home.bookDebrief}
              </Link>
            </div>
          </div>

          {/* Right: Logo - centered */}
          <div className="flex items-center justify-center">
            <img 
              src="/images/logo-home-new.png" 
              alt="AI Governance: Practice & Research by Martin Lepage PhD" 
              className="w-72 md:w-80 lg:w-[22rem] h-auto"
            />
          </div>
        </div>

        {/* Three Feature Boxes - Centered and aligned */}
        <div className="bg-[#F6F7FB] py-8 px-6 -mx-6 mt-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6">
              {capabilities.map((cap, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white/80 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <cap.icon className="w-5 h-5 text-[#0D0A2E]" />
                  </div>
                  <div>
                    <p 
                      className="font-semibold text-[#0B0F1A] leading-tight text-base"
                      style={{fontFamily: "'IBM Plex Sans', sans-serif"}}
                    >
                      {cap.title}
                    </p>
                    <p 
                      className="text-sm text-[#0B0F1A]/60 leading-relaxed mt-1"
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
        <div className="mt-16"><StarterKitCTA /></div>

        {/* Bottom Navigation Cards */}
        <div className="mt-16 pt-12 border-t border-[#0B0F1A]/5">
          <div className="grid md:grid-cols-4 gap-10">
            <Link to="/tool" className="group">
              <p 
                className="text-xs tracking-widest text-[#0D0A2E] uppercase mb-2"
                style={{fontFamily: "'Lato', sans-serif"}}
              >
                {t.home.sections.assessment}
              </p>
              <h3 
                className="text-lg font-semibold text-[#0B0F1A] group-hover:text-[#0D0A2E] transition-colors mb-1"
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
                className="text-xs tracking-widest text-[#0D0A2E] uppercase mb-2"
                style={{fontFamily: "'Lato', sans-serif"}}
              >
                {t.home.sections.portfolio}
              </p>
              <h3 
                className="text-lg font-semibold text-[#0B0F1A] group-hover:text-[#0D0A2E] transition-colors mb-1"
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
                className="text-xs tracking-widest text-[#0D0A2E] uppercase mb-2"
                style={{fontFamily: "'Lato', sans-serif"}}
              >
                {t.home.sections.research}
              </p>
              <h3 
                className="text-lg font-semibold text-[#0B0F1A] group-hover:text-[#0D0A2E] transition-colors mb-1"
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
                className="text-xs tracking-widest text-[#0D0A2E] uppercase mb-2"
                style={{fontFamily: "'Lato', sans-serif"}}
              >
                {t.home.sections.resources}
              </p>
              <h3 
                className="text-lg font-semibold text-[#0B0F1A] group-hover:text-[#0D0A2E] transition-colors mb-1"
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
