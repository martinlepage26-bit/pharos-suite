import { Link } from 'react-router-dom';
import { ArrowRight, Eye, Scale, Users, Zap } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const HEADSHOT_URL = process.env.REACT_APP_HEADSHOT_URL || "https://customer-assets.emergentagent.com/job_site-resurrection-1/artifacts/x8mls9m1_realistic_male_headshot_with_hair_1.jpg";

const About = () => {
  const { language } = useLanguage();

  const fourAxes = [
    {
      icon: Eye,
      title_en: 'Readability',
      title_fr: 'Lisibilité',
      desc_en: 'Making systems understandable, auditable, explainable',
      desc_fr: 'Rendre les systèmes compréhensibles, auditables, explicables'
    },
    {
      icon: Scale,
      title_en: 'Legitimacy',
      title_fr: 'Légitimité',
      desc_en: 'How organizations can justify the use of AI',
      desc_fr: "Comment les organisations peuvent justifier l'usage de l'IA"
    },
    {
      icon: Users,
      title_en: 'Accountability',
      title_fr: 'Responsabilité',
      desc_en: 'Who answers for what, how, to whom',
      desc_fr: 'Qui répond de quoi, comment, devant qui'
    },
    {
      icon: Zap,
      title_en: 'Power',
      title_fr: 'Pouvoir',
      desc_en: 'How AI redistributes authority, decision, visibility',
      desc_fr: "Comment l'IA redistribue l'autorité, la décision, la visibilité"
    }
  ];

  const expertise_en = [
    { label: 'When called', items: ['A company fears a misstep', 'A leader wants to understand risks', 'A technical team needs a framework', 'A public body wants to reassure the population'] },
    { label: 'Strategic vision', items: ['Anticipate political and social risks', 'Advise leaders', 'Define guiding principles', 'Frame issues of power'] },
    { label: 'Practical capacity', items: ['Read internal documents', 'Examine workflows', 'Evaluate models', 'Identify areas of opacity', 'Propose control mechanisms'] }
  ];

  const expertise_fr = [
    { label: 'On m\'appelle quand', items: ['Une entreprise craint un faux pas', 'Un dirigeant veut comprendre les risques', 'Une équipe technique a besoin d\'un cadre', 'Un organisme public veut rassurer la population'] },
    { label: 'Vision stratégique', items: ['Anticiper les risques politiques et sociaux', 'Conseiller les dirigeants', 'Définir des principes directeurs', 'Cadrer les enjeux de pouvoir'] },
    { label: 'Capacité pratique', items: ['Lire les documents internes', 'Examiner les workflows', 'Évaluer les modèles', 'Identifier les zones d\'opacité', 'Proposer des mécanismes de contrôle'] }
  ];

  const expertise = language === 'fr' ? expertise_fr : expertise_en;

  return (
    <div className="min-h-screen bg-white" data-testid="about-page">
      <div className="max-w-4xl mx-auto px-6 py-12">
        
        {/* Header */}
        <div className="mb-12">
          <h1 
            className="text-3xl md:text-4xl font-semibold text-[#0B0F1A] mb-4"
            style={{fontFamily: "'IBM Plex Sans', sans-serif"}}
          >
            {language === 'fr' ? 'À propos' : 'About'}
          </h1>
          <p 
            className="text-lg text-[#0B0F1A]/70 max-w-3xl leading-relaxed"
            style={{fontFamily: "'Source Serif 4', serif", fontStyle: 'italic'}}
          >
            {language === 'fr' 
              ? "La gouvernance de l'IA comme science du pouvoir, de la transparence et de la responsabilité."
              : "AI governance as a science of power, transparency, and accountability."}
          </p>
        </div>

        {/* Four Axes - Core Framework */}
        <div className="mb-12">
          <p 
            className="text-xs tracking-widest text-[#7b2cbf] uppercase mb-4"
            style={{fontFamily: "'Lato', sans-serif"}}
          >
            {language === 'fr' ? 'Cadre intellectuel' : 'Intellectual Framework'}
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {fourAxes.map((axis, i) => (
              <div 
                key={i} 
                className="flex items-start gap-4 p-5 bg-[#F6F7FB] rounded-lg border-l-3 border-[#0D0A2E] hover:shadow-sm transition-shadow"
              >
                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm flex-shrink-0">
                  <axis.icon className="w-5 h-5 text-[#0D0A2E]" />
                </div>
                <div>
                  <h3 
                    className="font-semibold text-[#0B0F1A] mb-1"
                    style={{fontFamily: "'IBM Plex Sans', sans-serif"}}
                  >
                    {language === 'fr' ? axis.title_fr : axis.title_en}
                  </h3>
                  <p 
                    className="text-sm text-[#0B0F1A]/60 leading-relaxed"
                    style={{fontFamily: "'Lato', sans-serif"}}
                  >
                    {language === 'fr' ? axis.desc_fr : axis.desc_en}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Promise Statement */}
        <div className="mb-12 p-6 bg-[#0D0A2E] rounded-lg text-white">
          <p 
            className="text-lg md:text-xl leading-relaxed text-center"
            style={{fontFamily: "'Source Serif 4', serif"}}
          >
            {language === 'fr' 
              ? '"Je rends les systèmes lisibles, responsables et légitimes."'
              : '"I make systems readable, accountable, and legitimate."'}
          </p>
        </div>

        {/* Profile Section */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-shrink-0">
              <img 
                src={HEADSHOT_URL} 
                alt="Martin Lepage" 
                className="w-40 h-40 object-cover rounded-xl shadow-lg" 
                data-testid="headshot" 
              />
            </div>
            <div className="flex-1">
              <h2 
                className="text-2xl font-semibold text-[#0B0F1A] mb-3"
                style={{fontFamily: "'IBM Plex Sans', sans-serif"}}
              >
                Martin Lepage, PhD
              </h2>
              <p 
                className="text-[#0B0F1A]/70 leading-relaxed mb-4"
                style={{fontFamily: "'Lato', sans-serif"}}
              >
                {language === 'fr' 
                  ? "Consultant en gouvernance de l'IA, spécialisé dans la lisibilité des systèmes, la responsabilité organisationnelle, la légitimité publique et l'éthique appliquée à l'IA. Mon passé en recherche clinique et en sciences sociales me donne une crédibilité méthodologique et une profondeur conceptuelle que peu de consultants possèdent."
                  : "AI governance consultant, specialized in system readability, organizational accountability, public legitimacy, and applied AI ethics. My background in clinical research and social sciences gives me methodological credibility and conceptual depth that few consultants possess."}
              </p>
              <p 
                className="text-sm text-[#0B0F1A]/60 leading-relaxed"
                style={{fontFamily: "'Lato', sans-serif"}}
              >
                {language === 'fr' 
                  ? "Je ne suis pas seulement un 'philosophe de l'IA' : je suis quelqu'un qui peut auditer, structurer, documenter, rendre lisible. Je comprends la documentation, la preuve, la conformité. Je comprends la légitimité, la responsabilité, la perception publique. Je comprends la politique du regard : qui peut inspecter, qui peut décider, qui peut rendre des comptes."
                  : "I'm not just an 'AI philosopher': I'm someone who can audit, structure, document, make legible. I understand documentation, evidence, compliance. I understand legitimacy, accountability, public perception. I understand the politics of visibility: who can inspect, who can decide, who is answerable."}
              </p>
            </div>
          </div>
        </div>

        {/* Expertise Columns */}
        <div className="mb-12">
          <p 
            className="text-xs tracking-widest text-[#7b2cbf] uppercase mb-4"
            style={{fontFamily: "'Lato', sans-serif"}}
          >
            {language === 'fr' ? 'Expertise' : 'Expertise'}
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {expertise.map((col, i) => (
              <div key={i} className="bg-[#F6F7FB] rounded-lg p-5">
                <h3 
                  className="font-semibold text-[#0B0F1A] mb-3 text-sm uppercase tracking-wide"
                  style={{fontFamily: "'IBM Plex Sans', sans-serif"}}
                >
                  {col.label}
                </h3>
                <ul className="space-y-2">
                  {col.items.map((item, j) => (
                    <li 
                      key={j} 
                      className="text-sm text-[#0B0F1A]/70 flex items-start gap-2"
                      style={{fontFamily: "'Lato', sans-serif"}}
                    >
                      <span className="w-1 h-1 bg-[#7b2cbf] rounded-full mt-2 flex-shrink-0"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Research */}
        <div className="p-6 bg-[#F6F7FB] rounded-lg border-l-4 border-[#0D0A2E]">
          <p 
            className="text-xs tracking-widest text-[#0D0A2E] uppercase mb-2"
            style={{fontFamily: "'Lato', sans-serif"}}
          >
            {language === 'fr' ? 'Recherche en vedette' : 'Featured Research'}
          </p>
          <h3 
            className="text-xl font-semibold text-[#0B0F1A] mb-2"
            style={{fontFamily: "'Source Serif 4', serif"}}
          >
            {language === 'fr' ? 'Le Protocole Carte Scellée' : 'The Sealed Card Protocol'}
          </h3>
          <p 
            className="text-sm text-[#0B0F1A]/60 mb-4"
            style={{fontFamily: "'Lato', sans-serif"}}
          >
            {language === 'fr' 
              ? "Un protocole pratique pour évaluer la capacité de supervision humaine dans les systèmes d'IA."
              : "A practical protocol for evaluating human oversight capability in AI systems."}
          </p>
          <Link 
            to="/sealed-card" 
            className="inline-flex items-center gap-2 text-[#0D0A2E] font-medium text-sm hover:gap-3 transition-all"
            style={{fontFamily: "'Lato', sans-serif"}}
          >
            {language === 'fr' ? 'Lire le protocole' : 'Read the protocol'} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link 
            to="/connect" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#1a1a1a] text-white text-sm font-medium rounded-sm hover:bg-[#333] transition-colors"
            style={{fontFamily: "'Lato', sans-serif"}}
          >
            {language === 'fr' ? 'Réserver un appel' : 'Book a call'} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;
