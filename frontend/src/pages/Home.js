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
      <div className="max-w-4xl mx-auto px-6 py-16">
        
        {/* Hero Section - Two columns */}
        <div className="flex flex-col md:flex-row md:items-start md:gap-12 mb-16">
          
          {/* Left: Text content */}
          <div className="flex-1">
            <h1 
              className="text-4xl md:text-5xl font-semibold text-[#1a1a1a] leading-none tracking-tight" 
              style={{
                fontFamily: "'IBM Plex Sans', system-ui, sans-serif", 
                fontVariant: 'small-caps', 
                letterSpacing: '-0.01em'
              }}
            >
              {t.home.title}
            </h1>
            
            {/* Decorative line with diamond - thinner, more elegant */}
            <div className="flex items-center my-2" style={{width: '280px'}}>
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
            
            {/* Subtitle - & aligned with diamond center */}
            <p 
              className="text-lg text-[#1a1a1a]/40 mb-4 text-center" 
              style={{
                fontFamily: "'Source Serif 4', Georgia, serif", 
                fontStyle: 'italic', 
                fontWeight: 400,
                width: '280px'
              }}
            >
              {t.home.subtitle}
            </p>
            
            {/* Bullet points - smaller font */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[#0B0F1A]/60 mb-4">
              <span className="inline-flex items-center text-xs" style={{fontFamily: "'Lato', sans-serif"}}>
                <span className="w-1.5 h-1.5 mr-1.5 bg-[#2D2380] rotate-45"></span>
                {language === 'fr' ? 'Directives du Conseil du Trésor' : 'Treasury Board directives'}
              </span>
              <span className="inline-flex items-center text-xs" style={{fontFamily: "'Lato', sans-serif"}}>
                <span className="w-1.5 h-1.5 mr-1.5 bg-[#2D2380] rotate-45"></span>
                {language === 'fr' ? 'Loi 25 du Québec' : "Quebec's Law 25"}
              </span>
              <span className="inline-flex items-center text-xs" style={{fontFamily: "'Lato', sans-serif"}}>
                <span className="w-1.5 h-1.5 mr-1.5 bg-[#2D2380] rotate-45"></span>
                {language === 'fr' ? 'Obligations LIAD émergentes' : 'Emerging AIDA obligations'}
              </span>
            </div>
            
            {/* Buttons - smaller */}
            <div className="flex flex-wrap gap-2">
              <Link 
                to="/services" 
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1a1a1a] text-white text-xs font-medium rounded-sm hover:bg-[#333] transition-colors" 
                data-testid="view-services-btn"
                style={{fontFamily: "'Lato', sans-serif"}}
              >
                {t.home.viewServices} <ArrowRight className="w-3 h-3" />
              </Link>
              <Link 
                to="/connect" 
                className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#1a1a1a]/20 text-[#1a1a1a] text-xs font-medium rounded-sm hover:border-[#1a1a1a]/40 transition-colors" 
                data-testid="book-consultation-btn"
                style={{fontFamily: "'Lato', sans-serif"}}
              >
                {t.home.bookDebrief}
              </Link>
            </div>
          </div>

          {/* Right: Logo - bigger */}
          <div className="flex-shrink-0 mt-6 md:mt-0">
            <img 
              src="/images/logo-home-new.png" 
              alt="AI Governance" 
              className="w-56 md:w-72 h-auto"
            />
          </div>
        </div>
        
        {/* Tagline - styled with lavender backdrop */}
        <div className="flex justify-center mb-16">
          <div 
            className="inline-flex items-center gap-4 px-8 py-4 rounded-full"
            style={{
              background: 'linear-gradient(135deg, rgba(123,44,191,0.06) 0%, rgba(45,35,128,0.08) 100%)',
              boxShadow: 'inset 0 0 20px rgba(123,44,191,0.05)'
            }}
          >
            <span 
              className="text-[#0B0F1A]/60 text-base font-semibold"
              style={{fontFamily: "'Source Serif 4', Georgia, serif", fontStyle: 'italic'}}
            >
              {language === 'fr' ? 'Pouvoir lisible' : 'Legible Power'}
            </span>
            <span className="text-[#7b2cbf]/30 text-lg">|</span>
            <span 
              className="text-[#0B0F1A]/60 text-base font-semibold"
              style={{fontFamily: "'Source Serif 4', Georgia, serif", fontStyle: 'italic'}}
            >
              {language === 'fr' ? 'Décisions révisables' : 'Reviewable Decisions'}
            </span>
            <span className="text-[#7b2cbf]/30 text-lg">|</span>
            <span 
              className="text-[#0B0F1A]/60 text-base font-semibold"
              style={{fontFamily: "'Source Serif 4', Georgia, serif", fontStyle: 'italic'}}
            >
              {language === 'fr' ? 'Avenirs vivables' : 'Livable Futures'}
            </span>
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
