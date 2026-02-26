import { Link } from 'react-router-dom';
import { ArrowRight, Shield, FileText, Scale } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import StarterKitCTA from '../components/StarterKitCTA';

// Compass Rose with NE emphasis - black + indigo only
const CompassLogo = ({ className = "w-48 h-48" }) => (
  <svg viewBox="0 0 200 200" className={className}>
    {/* Main compass circle */}
    <circle cx="100" cy="100" r="70" fill="none" stroke="#0a0a0a" strokeWidth="1.5"/>
    <circle cx="100" cy="100" r="55" fill="none" stroke="#0a0a0a" strokeWidth="1"/>
    
    {/* Compass rose - 8 points */}
    <g stroke="#0a0a0a" strokeWidth="1.5" fill="none">
      {/* Cardinal points */}
      <line x1="100" y1="25" x2="100" y2="45"/>
      <line x1="175" y1="100" x2="155" y2="100"/>
      <line x1="100" y1="175" x2="100" y2="155"/>
      <line x1="25" y1="100" x2="45" y2="100"/>
      {/* Ordinal points */}
      <line x1="147" y1="53" x2="135" y2="65"/>
      <line x1="147" y1="147" x2="135" y2="135"/>
      <line x1="53" y1="147" x2="65" y2="135"/>
      <line x1="53" y1="53" x2="65" y2="65"/>
    </g>
    
    {/* Inner star */}
    <polygon points="100,60 108,85 130,85 112,100 120,125 100,110 80,125 88,100 70,85 92,85" 
             fill="none" stroke="#0a0a0a" strokeWidth="1.5"/>
    
    {/* NE Arrow - emphasized in indigo */}
    <g fill="#6366f1" stroke="#6366f1">
      <line x1="100" y1="100" x2="145" y2="55" strokeWidth="2.5"/>
      <polygon points="145,55 130,58 142,70"/>
    </g>
    
    {/* Center dot */}
    <circle cx="100" cy="100" r="4" fill="#0a0a0a"/>
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
    <div className="min-h-screen bg-white" data-testid="home-page">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left: Wordmark Stack */}
          <div>
            {/* Logo Wordmark Stack */}
            <div className="mb-10">
              {/* AI Governance - largest, serif */}
              <h1 className="font-serif text-5xl md:text-6xl font-semibold text-[#0a0a0a] leading-tight tracking-tight">
                AI Governance
              </h1>
              {/* Practice & Research - smaller */}
              <p className="font-serif text-2xl md:text-3xl text-[#0a0a0a]/70 mt-1 tracking-tight">
                Practice & Research
              </p>
              {/* Martin Lepage, PhD - smallest, author line style */}
              <p className="mt-4 text-sm text-[#0a0a0a]/50 tracking-wide">
                Martin Lepage, <span className="text-xs">PhD</span>
              </p>
            </div>
            
            <p className="text-[#0a0a0a]/70 text-lg leading-relaxed mb-4">{t.home.description}</p>
            <p className="text-xs tracking-widest text-[#0a0a0a]/40 uppercase mb-8">{t.home.keywords}</p>
            
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
                  <div className="w-9 h-9 rounded-lg bg-[#6366f1]/10 flex items-center justify-center flex-shrink-0">
                    <cap.icon className="w-4 h-4 text-[#6366f1]" />
                  </div>
                  <div>
                    <p className="font-medium text-[#0a0a0a]">{cap.title}</p>
                    <p className="text-sm text-[#0a0a0a]/60">{cap.description}</p>
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

        <div className="mt-20 pt-12 border-t border-black/5">
          <div className="grid md:grid-cols-4 gap-10">
            <Link to="/tool" className="group">
              <p className="text-xs tracking-widest text-[#6366f1] uppercase mb-2">{t.home.sections.assessment}</p>
              <h3 className="font-serif text-lg font-semibold text-[#0a0a0a] group-hover:text-[#6366f1] transition-colors mb-1">{t.home.sections.readinessSnapshot}</h3>
              <p className="text-[#0a0a0a]/60 text-sm">{t.home.sections.assessMaturity}</p>
            </Link>
            <Link to="/cases" className="group">
              <p className="text-xs tracking-widest text-[#6366f1] uppercase mb-2">{t.home.sections.portfolio}</p>
              <h3 className="font-serif text-lg font-semibold text-[#0a0a0a] group-hover:text-[#6366f1] transition-colors mb-1">{t.home.sections.caseStudies}</h3>
              <p className="text-[#0a0a0a]/60 text-sm">{t.home.sections.seeExamples}</p>
            </Link>
            <Link to="/research" className="group">
              <p className="text-xs tracking-widest text-[#6366f1] uppercase mb-2">{t.home.sections.research}</p>
              <h3 className="font-serif text-lg font-semibold text-[#0a0a0a] group-hover:text-[#6366f1] transition-colors mb-1">{t.home.sections.briefings}</h3>
              <p className="text-[#0a0a0a]/60 text-sm">{t.home.sections.incidentsToControls}</p>
            </Link>
            <Link to="/library" className="group">
              <p className="text-xs tracking-widest text-[#6366f1] uppercase mb-2">{t.home.sections.resources}</p>
              <h3 className="font-serif text-lg font-semibold text-[#0a0a0a] group-hover:text-[#6366f1] transition-colors mb-1">{t.home.sections.library}</h3>
              <p className="text-[#0a0a0a]/60 text-sm">{t.home.sections.frameworksStandards}</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
