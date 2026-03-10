import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, FileCheck2, Target } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const RESEARCH_COPY = {
  en: {
    eyebrow: 'Research',
    heroTitle: 'Briefings for scrutiny, review, and control design',
    heroBody: 'Each briefing starts with a real signal, names the governance pressure it creates, and turns it into control logic, claim boundaries, and evidence questions teams can actually use.',
    method: 'Method',
    methodTitle: 'Start with the pressure, end with a reviewable control response',
    briefingsLabel: 'Briefings',
    briefingsTitle: 'Browse by context',
    briefingsBody: 'Filter by the operating context behind the review demand.',
    briefingTag: 'Briefing',
    ctaTitle: 'Facing a similar challenge?',
    ctaBody: 'A debrief can help translate the signal into control logic, evidence needs, and a proportionate next step.',
    bookDebrief: 'Book a debrief',
    filters: [
      { key: 'all', label: 'All' },
      { key: 'regulated', label: 'Regulated Systems' },
      { key: 'enterprise', label: 'Enterprise SaaS' },
      { key: 'procurement', label: 'Procurement & Vendor Risk' },
      { key: 'public', label: 'Public Sector' },
      { key: 'financial', label: 'Financial Systems' }
    ],
    methods: [
      {
        icon: Target,
        title: 'Spot the signal',
        description: 'Identify the incident, risk, or institutional constraint that requires a governance response.'
      },
      {
        icon: FileCheck2,
        title: 'Translate to a control',
        description: 'Turn the problem into a review expectation, threshold, evidence need, or documentation requirement.'
      },
      {
        icon: BookOpen,
        title: 'Make it legible',
        description: 'Produce something a customer, auditor, or committee can follow, including what remains uncertain.'
      }
    ],
    briefings: [
      {
        context: 'regulated',
        date: 'Nov 14, 2024',
        title: 'Hiring Automation as Gatekeeping Infrastructure',
        description: 'An AI system that filters candidates is not a productivity feature. It is gatekeeping infrastructure that allocates opportunity and produces institutional liability.'
      },
      {
        context: 'procurement',
        date: 'Oct 27, 2024',
        title: 'Training Data as Legal Act: The Clearview Problem',
        description: 'Training data provenance is not a technical footnote. It is a legal act with institutional consequences and cross-jurisdiction enforcement risk.'
      },
      {
        context: 'financial',
        date: 'Oct 11, 2024',
        title: 'Zillow and the $500M Lesson in Model Risk',
        description: 'Model failure is not the scandal. The scandal is letting model failure become balance-sheet failure.'
      },
      {
        context: 'public',
        date: 'Sep 24, 2024',
        title: 'The Dutch Scandal: Algorithmic Suspicion and State Collapse',
        description: 'The archetype of what happens when the state operationalizes suspicion through opaque scoring.'
      },
      {
        context: 'regulated',
        date: 'Sep 7, 2024',
        title: 'COMPAS and the Black Box Defense',
        description: 'If a score shapes sentencing outcomes, transparency is not a bonus feature. It is a legitimacy requirement.'
      },
      {
        context: 'enterprise',
        date: 'Aug 21, 2024',
        title: 'Samsung, ChatGPT, and the Prompt as Leak Vector',
        description: 'Shadow AI risk is what happens when institutional policy lags institutional behavior.'
      },
      {
        context: 'enterprise',
        date: 'Aug 4, 2024',
        title: 'Air Canada and the Chatbot That Became Policy',
        description: 'Customer-facing AI does not dilute accountability. It concentrates it.'
      }
    ]
  },
  fr: {
    eyebrow: 'Recherche',
    heroTitle: 'Notes d’analyse pour l’examen, la revue et la conception de contrôles',
    heroBody: 'Chaque note part d’un signal réel, nomme la pression de gouvernance qu’il crée, puis le traduit en logique de contrôle, en limites de revendication et en questions probantes réellement utiles.',
    method: 'Méthode',
    methodTitle: 'Partir de la pression, finir avec une réponse de contrôle révisable',
    briefingsLabel: 'Notes d’analyse',
    briefingsTitle: 'Parcourir par contexte',
    briefingsBody: 'Filtrer selon le contexte opérationnel qui génère la demande d’examen.',
    briefingTag: 'Note',
    ctaTitle: 'Vous faites face à un défi semblable ?',
    ctaBody: 'Un échange peut aider à traduire le signal en logique de contrôle, en besoins probants et en prochaine étape proportionnée.',
    bookDebrief: 'Réserver un échange',
    filters: [
      { key: 'all', label: 'Tous' },
      { key: 'regulated', label: 'Systèmes réglementés' },
      { key: 'enterprise', label: 'SaaS d’entreprise' },
      { key: 'procurement', label: 'Approvisionnement et risque fournisseur' },
      { key: 'public', label: 'Secteur public' },
      { key: 'financial', label: 'Systèmes financiers' }
    ],
    methods: [
      {
        icon: Target,
        title: 'Repérer le signal',
        description: 'Identifier l’incident, le risque ou la contrainte institutionnelle qui exige une réponse de gouvernance.'
      },
      {
        icon: FileCheck2,
        title: 'Le traduire en contrôle',
        description: 'Transformer le problème en attente de revue, en seuil, en besoin probant ou en exigence documentaire.'
      },
      {
        icon: BookOpen,
        title: 'Le rendre lisible',
        description: 'Produire quelque chose qu’un client, un auditeur ou un comité peut suivre, y compris ce qui demeure incertain.'
      }
    ],
    briefings: [
      {
        context: 'regulated',
        date: '14 nov. 2024',
        title: 'Automatisation de l’embauche comme infrastructure de filtrage',
        description: 'Un système d’IA qui filtre les candidatures n’est pas un simple outil de productivité. C’est une infrastructure de tri qui répartit les possibilités et crée une responsabilité institutionnelle.'
      },
      {
        context: 'procurement',
        date: '27 oct. 2024',
        title: 'Les données d’entraînement comme acte juridique : le problème Clearview',
        description: 'La provenance des données d’entraînement n’est pas une note de bas de page technique. C’est un acte juridique avec des conséquences institutionnelles et un risque d’application transfrontalière.'
      },
      {
        context: 'financial',
        date: '11 oct. 2024',
        title: 'Zillow et la leçon de 500 M$ sur le risque de modèle',
        description: 'La défaillance du modèle n’est pas le scandale. Le scandale, c’est de laisser une défaillance de modèle devenir une défaillance de bilan.'
      },
      {
        context: 'public',
        date: '24 sept. 2024',
        title: 'Le scandale néerlandais : suspicion algorithmique et effondrement de l’État',
        description: 'L’archétype de ce qui arrive quand l’État opérationnalise la suspicion à l’aide d’un pointage opaque.'
      },
      {
        context: 'regulated',
        date: '7 sept. 2024',
        title: 'COMPAS et la défense de la boîte noire',
        description: 'Si un score influence les peines, la transparence n’est pas un bonus. C’est une condition de légitimité.'
      },
      {
        context: 'enterprise',
        date: '21 août 2024',
        title: 'Samsung, ChatGPT et l’invite comme vecteur de fuite',
        description: 'Le risque d’IA fantôme apparaît lorsque la politique institutionnelle prend du retard sur les comportements institutionnels.'
      },
      {
        context: 'enterprise',
        date: '4 août 2024',
        title: 'Air Canada et le clavardeur devenu politique',
        description: 'L’IA en contact avec la clientèle ne dilue pas la responsabilité. Elle la concentre.'
      }
    ]
  }
};

const Research = () => {
  const { language } = useLanguage();
  const [activeFilter, setActiveFilter] = useState('all');
  const copy = useMemo(() => RESEARCH_COPY[language], [language]);

  const visibleBriefings = useMemo(() => {
    if (activeFilter === 'all') return copy.briefings;
    return copy.briefings.filter((item) => item.context === activeFilter);
  }, [activeFilter, copy.briefings]);

  return (
    <div data-testid="research-page">
      <div className="page-hero">
        <div className="container">
          <div className="section-header">
            <p className="eyebrow">{copy.eyebrow}</p>
            <h1>{copy.heroTitle}</h1>
            <p className="body-lg" style={{ marginTop: '16px' }}>
              {copy.heroBody}
            </p>
          </div>
        </div>
      </div>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-header reveal">
            <p className="eyebrow">{copy.method}</p>
            <h2>{copy.methodTitle}</h2>
          </div>

          <div className="grid-3 stagger">
            {copy.methods.map((item) => (
              <div key={item.title} className="card reveal">
                <div className="card-icon">
                  <item.icon />
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--color-bg-alt)' }}>
        <div className="container">
          <div className="section-header reveal">
            <p className="eyebrow">{copy.briefingsLabel}</p>
            <h2>{copy.briefingsTitle}</h2>
            <p className="body-sm">{copy.briefingsBody}</p>
          </div>

          <div className="filters reveal">
            {copy.filters.map((item) => (
              <button
                key={item.key}
                type="button"
                className={`filter-pill${activeFilter === item.key ? ' active' : ''}`}
                onClick={() => setActiveFilter(item.key)}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="grid-2 stagger">
            {visibleBriefings.map((item) => (
              <article key={item.title} className="research-card reveal visible">
                <div className="research-meta">
                  <span className="research-tag">{copy.briefingTag}</span>
                  <span className="research-date">{item.date}</span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cta-banner reveal">
            <h2>{copy.ctaTitle}</h2>
            <p className="body-sm">{copy.ctaBody}</p>
            <div className="btn-row">
              <Link to="/connect" className="btn-primary">
                {copy.bookDebrief}
                <ArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Research;
