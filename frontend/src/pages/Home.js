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
      <div className="max-w-5xl mx-auto px-6 py-16">
        
        {/* Hero Section - Two columns */}
        <div className="flex flex-col md:flex-row md:items-center md:gap-12 mb-16">
          
          {/* Left: Logo with AI GOVERNANCE treatment */}
          <div className="flex-1 flex flex-col items-center">
            {/* AI GOVERNANCE title at top */}
            <h1 
              className="text-3xl md:text-4xl font-semibold text-[#1a1a1a] leading-none tracking-tight text-center" 
              style={{
                fontFamily: "'IBM Plex Sans', system-ui, sans-serif", 
                fontVariant: 'small-caps', 
                letterSpacing: '-0.01em'
              }}
            >
              {t.home.title}
            </h1>
            
            {/* Top decorative line */}
            <div className="flex items-center my-2" style={{width: '220px'}}>
              <svg viewBox="0 0 100 3" className="flex-1" style={{height: '3px'}} preserveAspectRatio="none">
                <polygon points="0,1.5 100,0 100,3" fill="#0B0F1A" />
              </svg>
              <div style={{
                width: '6px',
                height: '12px',
                background: 'linear-gradient(180deg, #2D2380 0%, #1a1555 100%)',
                clipPath: 'polygon(50% 100%, 100% 30%, 50% 0%, 0% 30%)',
                flexShrink: 0,
                marginTop: '-1px'
              }}></div>
              <svg viewBox="0 0 100 3" className="flex-1" style={{height: '3px'}} preserveAspectRatio="none">
                <polygon points="0,0 100,1.5 0,3" fill="#0B0F1A" />
              </svg>
            </div>
            
            {/* Logo Eye image */}
            <div className="my-6">
              <img 
                src="/images/logo-eye.png" 
                alt="AI Governance Logo" 
                className="w-36 md:w-44 h-auto"
              />
            </div>
            
            {/* Bottom: Strategies ◆ Oversight ◆ Research */}
            <div className="flex items-center gap-2 text-[#1a1a1a]/50 text-sm mb-2" style={{fontFamily: "'Source Serif 4', Georgia, serif", fontStyle: 'italic'}}>
              <span>{language === 'fr' ? 'Stratégies' : 'Strategies'}</span>
              <span className="text-[#2D2380]">◆</span>
              <span>{language === 'fr' ? 'Supervision' : 'Oversight'}</span>
              <span className="text-[#2D2380]">◆</span>
              <span>{language === 'fr' ? 'Recherche' : 'Research'}</span>
            </div>
            
            {/* Bottom decorative line */}
            <div className="flex items-center mb-2" style={{width: '200px'}}>
              <svg viewBox="0 0 100 2" className="flex-1" style={{height: '2px'}} preserveAspectRatio="none">
                <polygon points="0,1 100,0 100,2" fill="#0B0F1A" opacity="0.3" />
              </svg>
              <div style={{
                width: '4px',
                height: '8px',
                background: 'linear-gradient(180deg, #2D2380 0%, #1a1555 100%)',
                clipPath: 'polygon(50% 100%, 100% 30%, 50% 0%, 0% 30%)',
                flexShrink: 0
              }}></div>
              <svg viewBox="0 0 100 2" className="flex-1" style={{height: '2px'}} preserveAspectRatio="none">
                <polygon points="0,0 100,1 0,2" fill="#0B0F1A" opacity="0.3" />
              </svg>
            </div>
            
            {/* Martin Lepage PhD */}
            <p className="text-[#1a1a1a]/40 text-xs tracking-wider uppercase" style={{fontFamily: "'Lato', sans-serif"}}>
              Martin Lepage PhD
            </p>
          </div>

          {/* Right: Tagline + Bullets + Buttons - centered, stacked */}
          <div className="flex-1 flex flex-col items-center text-center mt-10 md:mt-0">
            {/* Main tagline - bigger, stacked */}
            <div className="mb-8">
              <p 
                className="text-2xl md:text-3xl font-semibold text-[#0B0F1A]/70 mb-3"
                style={{fontFamily: "'Source Serif 4', Georgia, serif", fontStyle: 'italic'}}
              >
                {language === 'fr' ? 'Pouvoir lisible' : 'Legible Power'}
              </p>
              <p className="text-[#2D2380] text-xl mb-3">◆</p>
              <p 
                className="text-2xl md:text-3xl font-semibold text-[#0B0F1A]/70 mb-3"
                style={{fontFamily: "'Source Serif 4', Georgia, serif", fontStyle: 'italic'}}
              >
                {language === 'fr' ? 'Décisions révisables' : 'Reviewable Decisions'}
              </p>
              <p className="text-[#2D2380] text-xl mb-3">◆</p>
              <p 
                className="text-2xl md:text-3xl font-semibold text-[#0B0F1A]/70"
                style={{fontFamily: "'Source Serif 4', Georgia, serif", fontStyle: 'italic'}}
              >
                {language === 'fr' ? 'Avenirs vivables' : 'Livable Futures'}
              </p>
            </div>
            
            {/* Bullet points - aligned */}
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[#0B0F1A]/60 mb-8">
              <span className="inline-flex items-center text-sm" style={{fontFamily: "'Lato', sans-serif"}}>
                <span className="text-[#2D2380] mr-2">◆</span>
                {language === 'fr' ? 'Directives du Conseil du Trésor' : 'Treasury Board directives'}
              </span>
              <span className="inline-flex items-center text-sm" style={{fontFamily: "'Lato', sans-serif"}}>
                <span className="text-[#2D2380] mr-2">◆</span>
                {language === 'fr' ? 'Loi 25 du Québec' : "Quebec's Law 25"}
              </span>
              <span className="inline-flex items-center text-sm" style={{fontFamily: "'Lato', sans-serif"}}>
                <span className="text-[#2D2380] mr-2">◆</span>
                {language === 'fr' ? 'Obligations LIAD émergentes' : 'Emerging AIDA obligations'}
              </span>
            </div>
            
            {/* Stylish Buttons */}
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                to="/services" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#0D0A2E] to-[#2D2380] text-white text-sm font-medium rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300" 
                data-testid="view-services-btn"
                style={{fontFamily: "'Lato', sans-serif"}}
              >
                {t.home.viewServices} <ArrowRight className="w-4 h-4" />
              </Link>
              <Link 
                to="/connect" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-[#0D0A2E]/20 text-[#0D0A2E] text-sm font-medium rounded-full shadow-md hover:border-[#2D2380] hover:shadow-lg hover:scale-105 transition-all duration-300" 
                data-testid="book-consultation-btn"
                style={{fontFamily: "'Lato', sans-serif"}}
              >
                {t.home.bookDebrief}
              </Link>
            </div>
          </div>
        </div>

        {/* Three Feature Boxes - Separate cards in horizontal row */}
        <div className="grid md:grid-cols-3 gap-4 mb-16">
          {capabilities.map((cap, i) => (
            <div 
              key={i} 
              className="flex items-start gap-3 p-4 bg-[#F6F7FB] rounded-lg border border-transparent hover:border-[#0D0A2E]/10 hover:bg-white hover:shadow-sm transition-all duration-300"
            >
              <div className="w-8 h-8 rounded-md bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
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
