import { Link } from 'react-router-dom';
import { ArrowRight, Shield, FileText, Scale, ScanText } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import StarterKitCTA from '../components/StarterKitCTA';

const Home = () => {
  const { t, language } = useLanguage();

  const methodology = [
    {
      icon: Shield,
      title: language === 'fr' ? 'Auditer' : 'Auditing',
      description:
        language === 'fr'
          ? "Cartographier les systèmes, évaluer les risques, identifier les écarts de conformité."
          : 'Map existing systems, assess risks according to AIA, identify compliance gaps.'
    },
    {
      icon: FileText,
      title: language === 'fr' ? 'Structurer & documenter' : 'Structuring & Documenting',
      description:
        language === 'fr'
          ? 'Construire les cadres de conformité, établir les droits de décision, créer des preuves.'
          : 'Build compliance frameworks, establish decision rights, create evidence.'
    },
    {
      icon: Scale,
      title: language === 'fr' ? 'Politque de la Visibilité' : 'Politics of Visibility',
      description:
        language === 'fr'
          ? 'Qui a le pouvoir d’inspecter? Qui décide? Qui rend des comptes?'
          : 'Who has the power to inspect? Who can decide? Who is answerable?'
    }
  ];

  const capabilityCards = [
    { icon: Shield, title: t.home.capabilities.riskClassification, description: t.home.capabilities.riskClassificationDesc },
    { icon: FileText, title: t.home.capabilities.evidenceArchitecture, description: t.home.capabilities.evidenceArchitectureDesc },
    { icon: Scale, title: t.home.capabilities.controlDesign, description: t.home.capabilities.controlDesignDesc }
  ];

  return (
    <div className="min-h-screen bg-[#F6F7FB]" data-testid="home-page">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <section className="grid md:grid-cols-2 gap-10 mb-10 items-center">
          <div className="flex flex-col items-center text-center">
            <h1
              className="text-[34px] md:text-[42px] tracking-[0.3em] uppercase text-[#111827]"
              style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 600 }}
            >
              {language === 'fr' ? 'GOUVERNANCE IA' : 'AI GOVERNANCE'}
            </h1>
            <div className="h-px w-44 bg-[#111827]/30 my-3" />
            <img src="/images/logo-eye.png" alt="AI Governance" className="w-40 md:w-48" />
            <p className="mt-5 text-sm text-[#111827]/70" style={{ fontFamily: "'Lato', sans-serif" }}>
              {language === 'fr' ? 'Stratégies  •  Supervision  •  Recherche' : 'Strategies  •  Oversight  •  Research'}
            </p>
          </div>

          <div className="text-center md:text-left">
            <p
              className="text-[44px] leading-[1.05] italic text-[#2D2380]"
              style={{ fontFamily: "'Source Serif 4', serif" }}
            >
              {language === 'fr' ? 'Pouvoir lisible' : 'Legible Power'}
            </p>
            <p className="text-[44px] leading-[1.05] italic text-[#111827]" style={{ fontFamily: "'Source Serif 4', serif" }}>
              {language === 'fr' ? 'Décisions révisables' : 'Reviewable Decisions'}
            </p>
            <p
              className="text-[44px] leading-[1.05] italic text-[#2D2380]"
              style={{ fontFamily: "'Source Serif 4', serif" }}
            >
              {language === 'fr' ? 'Avenirs viables' : 'Livable Futures'}
            </p>

            <p className="mt-5 text-lg text-[#111827]/80" style={{ fontFamily: "'Lato', sans-serif" }}>
              {language === 'fr'
                ? 'Rendre les systèmes d’IA lisibles, responsables et légitimes.'
                : 'Make AI systems readable, accountable, and legitimate.'}
            </p>

            <div className="mt-6 flex flex-wrap gap-3 justify-center md:justify-start">
              <Link
                to="/services"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0D0A2E] text-white text-sm"
                style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 600 }}
              >
                {t.home.viewServices} <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/connect"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#0B0F1A]/30 text-[#111827] text-sm"
                style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 600 }}
              >
                {t.home.bookDebrief}
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden mb-8">
          <div className="px-5 py-4 border-b border-[#E5E7EB]">
            <h2 className="text-3xl text-[#111827]" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
              {language === 'fr' ? 'Méthodologie' : 'Methodology'}
            </h2>
            <p className="text-[#111827]/60 mt-1" style={{ fontFamily: "'Lato', sans-serif" }}>
              {language === 'fr'
                ? 'Une approche structurée ancrée dans la rigueur académique et la pratique terrain.'
                : 'A structured approach grounded in academic rigor and practical experience.'}
            </p>
          </div>

          <div className="grid md:grid-cols-3">
            {methodology.map((item, i) => (
              <article key={item.title} className={`p-5 ${i < 2 ? 'md:border-r border-[#E5E7EB]' : ''}`}>
                <div className="w-9 h-9 rounded-md bg-[#EEF0FF] flex items-center justify-center mb-3">
                  <item.icon className="w-4 h-4 text-[#2D2380]" />
                </div>
                <h3 className="text-2xl text-[#111827] mb-2" style={{ fontFamily: "'Source Serif 4', serif", fontWeight: 600 }}>
                  {item.title}
                </h3>
                <p className="text-sm text-[#111827]/70" style={{ fontFamily: "'Lato', sans-serif" }}>
                  {item.description}
                </p>
              </article>
            ))}
          </div>

          <p
            className="bg-[#F7F7FA] px-5 py-4 text-sm text-[#111827]/60 italic"
            style={{ fontFamily: "'Source Serif 4', serif" }}
          >
            {language === 'fr'
              ? '« La gouvernance de l’IA n’est pas seulement technique : c’est une question de pouvoir, de visibilité et de légitimité. »'
              : '“AI governance is not just technical — it is about power, visibility, and legitimacy.”'}
          </p>
        </section>

        <section className="grid md:grid-cols-3 gap-4 mb-10">
          {capabilityCards.map((item) => (
            <div key={item.title} className="bg-white rounded-xl border border-[#E5E7EB] p-4">
              <div className="w-8 h-8 rounded-md bg-[#F6F7FB] flex items-center justify-center mb-2">
                <item.icon className="w-4 h-4 text-[#2D2380]" />
              </div>
              <p className="text-sm font-semibold text-[#111827]" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>{item.title}</p>
              <p className="text-xs text-[#111827]/70 mt-1" style={{ fontFamily: "'Lato', sans-serif" }}>{item.description}</p>
            </div>
          ))}
        </section>

        <StarterKitCTA />

        <section className="mt-10 grid md:grid-cols-4 gap-4">
          <Link to="/tool" className="bg-white rounded-xl border border-[#E5E7EB] p-4 hover:border-[#2D2380]/30 transition-colors">
            <ScanText className="w-4 h-4 text-[#2D2380] mb-2" />
            <p className="text-xs uppercase tracking-widest text-[#111827]/50">{t.home.sections.assessment}</p>
            <h3 className="text-lg mt-1" style={{ fontFamily: "'Source Serif 4', serif" }}>{t.home.sections.readinessSnapshot}</h3>
          </Link>
          <Link to="/cases" className="bg-white rounded-xl border border-[#E5E7EB] p-4 hover:border-[#2D2380]/30 transition-colors">
            <p className="text-xs uppercase tracking-widest text-[#111827]/50">{t.home.sections.portfolio}</p>
            <h3 className="text-lg mt-1" style={{ fontFamily: "'Source Serif 4', serif" }}>{t.home.sections.caseStudies}</h3>
          </Link>
          <Link to="/research" className="bg-white rounded-xl border border-[#E5E7EB] p-4 hover:border-[#2D2380]/30 transition-colors">
            <p className="text-xs uppercase tracking-widest text-[#111827]/50">{t.home.sections.research}</p>
            <h3 className="text-lg mt-1" style={{ fontFamily: "'Source Serif 4', serif" }}>{t.home.sections.briefings}</h3>
          </Link>
          <Link to="/library" className="bg-white rounded-xl border border-[#E5E7EB] p-4 hover:border-[#2D2380]/30 transition-colors">
            <p className="text-xs uppercase tracking-widest text-[#111827]/50">{t.home.sections.resources}</p>
            <h3 className="text-lg mt-1" style={{ fontFamily: "'Source Serif 4', serif" }}>{t.home.sections.library}</h3>
          </Link>
        </section>
      </div>
    </div>
  );
};

export default Home;
