import { Link } from 'react-router-dom';
import { ArrowRight, Shield, FileText, Scale } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import StarterKitCTA from '../components/StarterKitCTA';

// Professional Compass Rose - classical, restrained
const CompassLogo = ({ className = "w-48 h-48" }) => (
  <svg viewBox="0 0 200 200" className={className}>
    {/* Outer circle */}
    <circle cx="100" cy="100" r="80" fill="none" stroke="#0B0F1A" strokeWidth="1"/>
    <circle cx="100" cy="100" r="65" fill="none" stroke="#0B0F1A" strokeWidth="0.75"/>
    
    {/* Cardinal lines */}
    <line x1="100" y1="15" x2="100" y2="35" stroke="#0B0F1A" strokeWidth="1.5"/>
    <line x1="185" y1="100" x2="165" y2="100" stroke="#0B0F1A" strokeWidth="1.5"/>
    <line x1="100" y1="185" x2="100" y2="165" stroke="#0B0F1A" strokeWidth="1.5"/>
    <line x1="15" y1="100" x2="35" y2="100" stroke="#0B0F1A" strokeWidth="1.5"/>
    
    {/* Ordinal ticks */}
    <line x1="155" y1="45" x2="145" y2="55" stroke="#0B0F1A" strokeWidth="1"/>
    <line x1="155" y1="155" x2="145" y2="145" stroke="#0B0F1A" strokeWidth="1"/>
    <line x1="45" y1="155" x2="55" y2="145" stroke="#0B0F1A" strokeWidth="1"/>
    <line x1="45" y1="45" x2="55" y2="55" stroke="#0B0F1A" strokeWidth="1"/>
    
    {/* Inner compass star */}
    <polygon points="100,50 110,80 140,80 115,100 125,130 100,110 75,130 85,100 60,80 90,80" 
             fill="none" stroke="#0B0F1A" strokeWidth="1.25"/>
    
    {/* NE Arrow - primary purple accent */}
    <line x1="100" y1="100" x2="150" y2="50" stroke="#4B2ABF" strokeWidth="2.5" strokeLinecap="round"/>
    <polygon points="150,50 138,54 146,62" fill="#4B2ABF"/>
    
    {/* Center */}
    <circle cx="100" cy="100" r="5" fill="#0B0F1A"/>
    <circle cx="100" cy="100" r="2" fill="white"/>
  </svg>
);

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
          {/* Left: Wordmark Stack */}
          <div>
            {/* Logo Wordmark Stack */}
            <div className="mb-10">
              {/* AI GOVERNANCE - small caps, big, black */}
              <h1 className="font-serif text-5xl md:text-6xl font-semibold text-[#0B0F1A] leading-tight" 
                  style={{ fontVariant: 'small-caps', letterSpacing: '0.04em' }}>
                AI Governance
              </h1>
              {/* Practice & Research - with stylish em dashes */}
              <p className="font-serif text-xl md:text-2xl text-[#0B0F1A]/60 mt-2 tracking-tight">
                <span className="text-[#0B0F1A]/30">—</span> Practice <span className="text-[#0B0F1A]/30">&</span> Research <span className="text-[#0B0F1A]/30">—</span>
              </p>
              {/* Martin Lepage, PhD - author line */}
              <p className="mt-4 text-sm text-[#0B0F1A]/40 tracking-wide font-medium">
                Martin Lepage<span className="text-[#0B0F1A]/25">,</span> <span className="text-xs text-[#0B0F1A]/30">PhD</span>
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

          {/* Right: Compass Logo */}
          <div className="flex justify-center md:justify-end">
            <CompassLogo className="w-64 md:w-80" />
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
