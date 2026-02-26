import { Link } from 'react-router-dom';
import { ArrowRight, Shield, FileText, Scale } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import StarterKitCTA from '../components/StarterKitCTA';

// SVG Logo Icon - Diamond with eye
const LogoIcon = ({ className = "w-64 h-64" }) => (
  <svg viewBox="0 0 200 200" className={className}>
    <defs>
      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6366f1" />
        <stop offset="100%" stopColor="#8b5cf6" />
      </linearGradient>
    </defs>
    <g transform="translate(100, 100)">
      {/* Outer diamond frame */}
      <g transform="rotate(45)">
        <rect x="-70" y="-70" width="140" height="140" fill="none" stroke="#1a2744" strokeWidth="4"/>
        <rect x="-55" y="-55" width="110" height="110" fill="none" stroke="#1a2744" strokeWidth="2"/>
      </g>
      {/* Compass points */}
      <polygon points="0,-90 8,-70 0,-75 -8,-70" fill="#1a2744"/>
      <polygon points="90,0 70,8 75,0 70,-8" fill="#1a2744"/>
      <polygon points="0,90 -8,70 0,75 8,70" fill="#1a2744"/>
      <polygon points="-90,0 -70,-8 -75,0 -70,8" fill="#1a2744"/>
      {/* Inner star/compass rose */}
      <polygon points="0,-45 12,-12 45,0 12,12 0,45 -12,12 -45,0 -12,-12" fill="none" stroke="#1a2744" strokeWidth="2"/>
      {/* Eye in center */}
      <ellipse cx="0" cy="0" rx="22" ry="14" fill="none" stroke="url(#logoGradient)" strokeWidth="3"/>
      <circle cx="0" cy="0" r="8" fill="url(#logoGradient)"/>
      <circle cx="0" cy="0" r="3" fill="white"/>
    </g>
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
    <div className="min-h-screen bg-[#f8f9fc]" data-testid="home-page">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            {/* Logo Wordmark */}
            <div className="mb-8">
              <h1 className="font-serif text-4xl md:text-5xl font-semibold leading-tight">
                <span className="text-gradient-purple">{t.home.title}</span>
              </h1>
              <p className="font-serif text-2xl md:text-3xl text-[#1a2744] mt-1">{t.home.subtitle}</p>
              <p className="text-sm text-gray-500 mt-2 tracking-wide">Martin Lepage, PhD</p>
            </div>
            
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
            <LogoIcon className="w-64 md:w-80" />
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
