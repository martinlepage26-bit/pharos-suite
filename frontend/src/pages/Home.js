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
            <h1 className="font-serif text-5xl md:text-6xl font-semibold text-[#0B0F1A] leading-none tracking-tight whitespace-nowrap">
              <span className="border-b-2 border-[#0B0F1A] pb-1">{t.home.title}</span>
            </h1>
            <p className="font-serif text-2xl md:text-3xl text-[#0B0F1A]/60 mt-4">
              {t.home.subtitle}
            </p>
            
            <p className="text-[#0B0F1A]/70 text-lg leading-relaxed mt-8 mb-3">
              {t.home.requirementsIntro}
            </p>
            
            <p className="text-[#0B0F1A]/70 text-lg leading-relaxed mb-3">
              <span style={{color: '#7b2cbf', fontWeight: 700}}>◆</span>{t.home.requirement1} <span style={{color: '#7b2cbf', fontWeight: 700}}>◆</span>{t.home.requirement2}<span style={{color: '#7b2cbf', fontWeight: 700}}>◆</span><br/>
              <span style={{color: '#7b2cbf', fontWeight: 700}}>◆</span>{t.home.requirement3}<span style={{color: '#7b2cbf', fontWeight: 700}}>◆</span>
            </p>
            
            <p className="text-[#0B0F1A]/70 text-lg leading-relaxed mb-4">
              <span className="font-bold">{t.home.productLabel}</span>
              <span className="text-[#7b2cbf] font-bold mx-2">➜</span>
              {t.home.productDesc}
            </p>
            
            <p className="text-xs tracking-widest text-[#0B0F1A]/35 uppercase mb-8">{t.home.keywords}</p>
            
            <div className="flex flex-wrap gap-4 mb-12">
              <Link to="/services" className="btn-primary inline-flex items-center gap-2" data-testid="view-services-btn">
                {t.home.viewServices} <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/connect" className="btn-ghost inline-flex items-center gap-2" data-testid="book-consultation-btn">
                {t.home.bookDebrief}
              </Link>
            </div>

            <div className="space-y-6">
              {capabilities.map((cap, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-lg bg-[#0D0A2E]/10 flex items-center justify-center flex-shrink-0">
                    <cap.icon className="w-4 h-4 text-[#0D0A2E]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#0B0F1A] mb-1">{cap.title}</p>
                    <p className="text-sm text-[#0B0F1A]/60 leading-relaxed">{cap.description}</p>
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
