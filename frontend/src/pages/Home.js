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
            {/* ai governance - lowercase small caps, increased weight */}
            <h1 
              className="text-2xl md:text-3xl text-[#2a2a2a] leading-none tracking-widest text-center lowercase" 
              style={{
                fontFamily: "'IBM Plex Sans', system-ui, sans-serif", 
                fontVariant: 'small-caps',
                fontWeight: 600,
                letterSpacing: '0.15em'
              }}
            >
              ai governance
            </h1>
            
            {/* Top decorative line - more elegant */}
            <div className="flex items-center my-3" style={{width: '240px'}}>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#2a2a2a]/40 to-[#2a2a2a]"></div>
              <div 
                className="mx-2"
                style={{
                  width: '8px',
                  height: '8px',
                  background: 'linear-gradient(135deg, #2D2380 0%, #7b2cbf 100%)',
                  transform: 'rotate(45deg)',
                  flexShrink: 0
                }}
              ></div>
              <div className="flex-1 h-px bg-gradient-to-l from-transparent via-[#2a2a2a]/40 to-[#2a2a2a]"></div>
            </div>
            
            {/* Logo Eye image */}
            <div className="my-5">
              <img 
                src="/images/logo-eye.png" 
                alt="AI Governance Logo" 
                className="w-32 md:w-40 h-auto"
              />
            </div>
            
            {/* Bottom: Strategies ◆ Oversight ◆ Research - increased weight */}
            <div 
              className="flex items-center gap-3 text-[#2a2a2a]/60 text-xs tracking-wider mb-2" 
              style={{fontFamily: "'IBM Plex Sans', system-ui, sans-serif", fontWeight: 500}}
            >
              <span>{language === 'fr' ? 'Stratégies' : 'Strategies'}</span>
              <span className="text-[#7b2cbf]/60 text-[8px]">◆</span>
              <span>{language === 'fr' ? 'Supervision' : 'Oversight'}</span>
              <span className="text-[#7b2cbf]/60 text-[8px]">◆</span>
              <span>{language === 'fr' ? 'Recherche' : 'Research'}</span>
            </div>
            
            {/* Bottom decorative line - elegant */}
            <div className="flex items-center mb-2" style={{width: '180px'}}>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#2a2a2a]/20"></div>
              <div 
                className="mx-1.5"
                style={{
                  width: '5px',
                  height: '5px',
                  background: 'linear-gradient(135deg, #2D2380 0%, #7b2cbf 100%)',
                  transform: 'rotate(45deg)',
                  flexShrink: 0,
                  opacity: 0.5
                }}
              ></div>
              <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#2a2a2a]/20"></div>
            </div>
            
            {/* Martin Lepage PhD - increased weight */}
            <p 
              className="text-[#2a2a2a]/45 text-xs tracking-wide mb-4" 
              style={{fontFamily: "'IBM Plex Sans', system-ui, sans-serif", fontWeight: 500}}
            >
              Martin Lepage PhD
            </p>
            
            {/* Compliant with regulations */}
            <div 
              className="flex flex-wrap items-center justify-center gap-x-2 text-[#2a2a2a]/45 text-xs tracking-wide" 
              style={{fontFamily: "'IBM Plex Sans', system-ui, sans-serif", fontWeight: 500}}
            >
              <span>{language === 'fr' ? 'Conforme aux' : 'Compliant with'}</span>
              <span className="text-[#7b2cbf]/50 text-[8px]">◆</span>
              <span>{language === 'fr' ? 'Directives du Conseil du Trésor' : 'Treasury Board directives'}</span>
              <span className="text-[#7b2cbf]/50 text-[8px]">◆</span>
              <span>{language === 'fr' ? 'Loi 25 du Québec' : "Quebec's Law 25"}</span>
              <span className="text-[#7b2cbf]/50 text-[8px]">◆</span>
              <span>{language === 'fr' ? 'Obligations LIAD émergentes' : 'Emerging AIDA obligations'}</span>
            </div>
          </div>

          {/* Right: Tagline + Buttons - centered, stacked */}
          <div className="flex-1 flex flex-col items-center text-center mt-10 md:mt-0">
            {/* Main tagline - no diamonds */}
            <div className="mb-8">
              <p 
                className="text-lg md:text-xl text-[#2a2a2a]/70 mb-3"
                style={{fontFamily: "'IBM Plex Sans', system-ui, sans-serif", fontWeight: 500, fontStyle: 'italic'}}
              >
                {language === 'fr' ? 'Pouvoir lisible' : 'Legible Power'}
              </p>
              <p 
                className="text-lg md:text-xl text-[#2a2a2a]/70 mb-3"
                style={{fontFamily: "'IBM Plex Sans', system-ui, sans-serif", fontWeight: 500, fontStyle: 'italic'}}
              >
                {language === 'fr' ? 'Décisions révisables' : 'Reviewable Decisions'}
              </p>
              <p 
                className="text-lg md:text-xl text-[#2a2a2a]/70"
                style={{fontFamily: "'IBM Plex Sans', system-ui, sans-serif", fontWeight: 500, fontStyle: 'italic'}}
              >
                {language === 'fr' ? 'Avenirs vivables' : 'Livable Futures'}
              </p>
            </div>
            
            {/* Smaller Buttons */}
            <div className="flex flex-wrap justify-center gap-3">
              <Link 
                to="/services" 
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#2a2a2a] to-[#3d3d3d] text-white text-xs font-medium rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300" 
                data-testid="view-services-btn"
                style={{fontFamily: "'IBM Plex Sans', system-ui, sans-serif"}}
              >
                {t.home.viewServices} <ArrowRight className="w-3 h-3" />
              </Link>
              <Link 
                to="/connect" 
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-[#2a2a2a]/15 text-[#2a2a2a] text-xs font-medium rounded-full shadow-sm hover:border-[#2a2a2a]/40 hover:shadow-md hover:scale-105 transition-all duration-300" 
                data-testid="book-consultation-btn"
                style={{fontFamily: "'IBM Plex Sans', system-ui, sans-serif"}}
              >
                {t.home.bookDebrief}
              </Link>
            </div>
          </div>
        </div>

        {/* Three Feature Boxes - Separate cards in horizontal row with hover raise */}
        <div className="grid md:grid-cols-3 gap-4 mb-16">
          {capabilities.map((cap, i) => (
            <div 
              key={i} 
              className="flex items-start gap-3 p-4 bg-[#F6F7FB] rounded-lg border border-transparent hover:border-[#2a2a2a]/10 hover:bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-8 h-8 rounded-md bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                <cap.icon className="w-4 h-4 text-[#2a2a2a]" />
              </div>
              <div>
                <p 
                  className="font-semibold text-[#2a2a2a] leading-tight text-sm"
                  style={{fontFamily: "'IBM Plex Sans', sans-serif"}}
                >
                  {cap.title}
                </p>
                <p 
                  className="text-xs text-[#2a2a2a]/60 leading-relaxed mt-0.5"
                  style={{fontFamily: "'IBM Plex Sans', sans-serif"}}
                >
                  {cap.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Starter Kit CTA */}
        <div className="mt-12"><StarterKitCTA /></div>

        {/* Bottom Navigation Cards - with hover raise */}
        <div className="mt-12 pt-10 border-t border-[#2a2a2a]/5">
          <div className="grid md:grid-cols-4 gap-6">
            <Link to="/tool" className="group p-4 rounded-lg hover:bg-[#F6F7FB] hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <p 
                className="text-xs tracking-widest text-[#2a2a2a]/50 uppercase mb-1"
                style={{fontFamily: "'IBM Plex Sans', sans-serif"}}
              >
                {t.home.sections.assessment}
              </p>
              <h3 
                className="text-base font-semibold text-[#2a2a2a] group-hover:text-[#2a2a2a] transition-colors mb-0.5"
                style={{fontFamily: "'IBM Plex Sans', serif"}}
              >
                {t.home.sections.readinessSnapshot}
              </h3>
              <p 
                className="text-[#2a2a2a]/60 text-sm"
                style={{fontFamily: "'IBM Plex Sans', sans-serif"}}
              >
                {t.home.sections.assessMaturity}
              </p>
            </Link>
            <Link to="/cases" className="group p-4 rounded-lg hover:bg-[#F6F7FB] hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <p 
                className="text-xs tracking-widest text-[#2a2a2a]/50 uppercase mb-1"
                style={{fontFamily: "'IBM Plex Sans', sans-serif"}}
              >
                {t.home.sections.portfolio}
              </p>
              <h3 
                className="text-base font-semibold text-[#2a2a2a] group-hover:text-[#2a2a2a] transition-colors mb-0.5"
                style={{fontFamily: "'IBM Plex Sans', serif"}}
              >
                {t.home.sections.caseStudies}
              </h3>
              <p 
                className="text-[#2a2a2a]/60 text-sm"
                style={{fontFamily: "'IBM Plex Sans', sans-serif"}}
              >
                {t.home.sections.seeExamples}
              </p>
            </Link>
            <Link to="/research" className="group p-4 rounded-lg hover:bg-[#F6F7FB] hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <p 
                className="text-xs tracking-widest text-[#2a2a2a]/50 uppercase mb-1"
                style={{fontFamily: "'IBM Plex Sans', sans-serif"}}
              >
                {t.home.sections.research}
              </p>
              <h3 
                className="text-base font-semibold text-[#2a2a2a] group-hover:text-[#2a2a2a] transition-colors mb-0.5"
                style={{fontFamily: "'IBM Plex Sans', serif"}}
              >
                {t.home.sections.briefings}
              </h3>
              <p 
                className="text-[#2a2a2a]/60 text-sm"
                style={{fontFamily: "'IBM Plex Sans', sans-serif"}}
              >
                {t.home.sections.incidentsToControls}
              </p>
            </Link>
            <Link to="/library" className="group p-4 rounded-lg hover:bg-[#F6F7FB] hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <p 
                className="text-xs tracking-widest text-[#2a2a2a]/50 uppercase mb-1"
                style={{fontFamily: "'IBM Plex Sans', sans-serif"}}
              >
                {t.home.sections.resources}
              </p>
              <h3 
                className="text-base font-semibold text-[#2a2a2a] group-hover:text-[#2a2a2a] transition-colors mb-0.5"
                style={{fontFamily: "'IBM Plex Sans', serif"}}
              >
                {t.home.sections.library}
              </h3>
              <p 
                className="text-[#2a2a2a]/60 text-sm"
                style={{fontFamily: "'IBM Plex Sans', sans-serif"}}
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
