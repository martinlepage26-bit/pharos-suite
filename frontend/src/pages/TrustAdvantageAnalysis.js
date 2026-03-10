import { Link } from 'react-router-dom';
import { ArrowRight, Download, FileText } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const TRUST_ADVANTAGE_COPY = {
  en: {
    eyebrow: 'PHAROS Insight',
    title: 'The Trust Advantage',
    subtitle: 'A shorter PHAROS reading of why expertise matters more once AI makes information abundant.',
    meta: 'LinkedIn Sales Navigator (2025) cross-read through a governance lens · March 2026',
    introTitle: 'Short reading',
    introBody: 'The LinkedIn Trust Advantage report argues that AI has changed B2B sales by making information cheap and trust scarce. Buyers now use AI before they ever speak with a seller, which means the winning edge is no longer raw access to facts. It is the ability to show up at the right moment with judgment, credibility, and proof a buyer can defend.',
    takeawaysTitle: 'Three takeaways',
    takeaways: [
      {
        title: 'AI compresses the information edge',
        body: 'If both buyers and sellers use AI across the sales cycle, information parity rises fast. PHAROS reads this as a governance problem as much as a sales problem: when everyone can generate fluent material, review shifts from surface polish to credibility under scrutiny.'
      },
      {
        title: 'Mid-funnel trust becomes decisive',
        body: 'The report shows human seller impact peaks when buyers compare vendors, test assumptions, and need reassurance. That is the same moment governance matters most: thresholds, evidence, and claims must survive challenge, not just presentation.'
      },
      {
        title: 'Defensibility matters more than persuasion',
        body: 'Buyers are not only asking whether a product works. They are asking whether they can justify the decision if it fails. PHAROS treats that as the core bridge between sales trust and governance design: confidence becomes durable only when it is documented and reviewable.'
      }
    ],
    governanceTitle: 'What PHAROS takes from it',
    governanceBody: 'Read beside the paper on algorithmic fluency and interruption, the report points to a larger pattern. AI-generated outreach tends to flatten tone, certainty, and authority into a smooth surface. Trust returns when a human can interrupt that surface with contextual knowledge, explicit trade-offs, and evidence that holds up when questions get sharper.',
    governancePoints: [
      'Expertise must be legible, not merely asserted.',
      'Trust is earned through proof, not through volume of content.',
      'Human judgment matters most where automated fluency begins to overstate certainty.'
    ],
    conclusionTitle: 'PHAROS conclusion',
    conclusionBody: 'In an AI-saturated market, expertise wins when it helps another person make a decision they can defend later. That is why PHAROS treats trust as an output of governance: clear thresholds, real evidence, and accountable judgment make expertise believable.',
    sourceTitle: 'Source document',
    sourceBody: 'The original working analysis remains available as a downloadable document.',
    download: 'Download the source .docx',
    backAbout: 'Back to About',
    backResearch: 'View research'
  },
  fr: {
    eyebrow: 'Analyse PHAROS',
    title: 'The Trust Advantage',
    subtitle: 'Une lecture plus courte de PHAROS sur la raison pour laquelle l’expertise prend encore plus de valeur lorsque l’IA rend l’information abondante.',
    meta: 'LinkedIn Sales Navigator (2025) relu à travers une lentille de gouvernance · mars 2026',
    introTitle: 'Lecture courte',
    introBody: 'Le rapport Trust Advantage de LinkedIn soutient que l’IA a transformé la vente B2B en rendant l’information facile d’accès et la confiance plus rare. Les acheteurs utilisent maintenant l’IA avant même de parler à un vendeur. L’avantage décisif ne tient donc plus à l’accès brut aux faits, mais à la capacité d’arriver au bon moment avec du jugement, de la crédibilité et une preuve qu’un acheteur peut défendre.',
    takeawaysTitle: 'Trois constats',
    takeaways: [
      {
        title: 'L’IA comprime l’avantage informationnel',
        body: 'Si acheteurs et vendeurs utilisent l’IA tout au long du cycle, la parité informationnelle monte vite. PHAROS y voit un enjeu de gouvernance autant qu’un enjeu commercial : lorsque tout le monde peut produire un contenu fluide, l’examen se déplace du vernis vers la crédibilité sous pression.'
      },
      {
        title: 'La confiance devient décisive au milieu du parcours',
        body: 'Le rapport montre que l’impact humain culmine quand les acheteurs comparent les fournisseurs, testent leurs hypothèses et cherchent à être rassurés. C’est aussi le moment où la gouvernance compte le plus : seuils, preuve et revendications doivent résister à la contestation, pas seulement à la présentation.'
      },
      {
        title: 'Le caractère défendable compte plus que la persuasion',
        body: 'Les acheteurs ne demandent pas seulement si un produit fonctionne. Ils demandent aussi s’ils pourront justifier la décision si elle tourne mal. PHAROS y voit le pont central entre confiance commerciale et conception de gouvernance : la confiance devient durable seulement lorsqu’elle est documentée et révisable.'
      }
    ],
    governanceTitle: 'Ce que PHAROS en retient',
    governanceBody: 'Lue à côté du texte sur la fluence algorithmique et l’interruption, l’étude pointe un schéma plus large. La prospection générée par l’IA tend à aplatir le ton, la certitude et l’autorité en une surface trop lisse. La confiance revient lorsqu’un humain peut interrompre cette surface par une connaissance située, des arbitrages explicites et une preuve qui tient quand les questions deviennent plus exigeantes.',
    governancePoints: [
      'L’expertise doit être lisible, et non simplement affirmée.',
      'La confiance se gagne par la preuve, non par le volume de contenu.',
      'Le jugement humain compte le plus lorsque la fluence automatisée commence à surjouer la certitude.'
    ],
    conclusionTitle: 'Conclusion PHAROS',
    conclusionBody: 'Dans un marché saturé par l’IA, l’expertise l’emporte lorsqu’elle aide quelqu’un à prendre une décision qu’il pourra encore défendre plus tard. C’est pourquoi PHAROS traite la confiance comme une sortie de gouvernance : des seuils clairs, une preuve réelle et un jugement responsable rendent l’expertise crédible.',
    sourceTitle: 'Document source',
    sourceBody: 'L’analyse de travail originale demeure disponible en téléchargement.',
    download: 'Télécharger le .docx source',
    backAbout: 'Retour à À propos',
    backResearch: 'Voir la recherche'
  }
};

const SOURCE_DOC_PATH = '/publications/trust-advantage-analysis-march-2026.docx';

const TrustAdvantageAnalysis = () => {
  const { language } = useLanguage();
  const copy = TRUST_ADVANTAGE_COPY[language];

  return (
    <div data-testid="trust-advantage-page">
      <div className="page-hero">
        <div className="container">
          <div className="section-header">
            <p className="eyebrow">{copy.eyebrow}</p>
            <h1>{copy.title}</h1>
            <p className="body-lg" style={{ marginTop: '16px' }}>{copy.subtitle}</p>
            <p className="eyebrow" style={{ marginTop: '18px' }}>{copy.meta}</p>
          </div>
        </div>
      </div>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="editorial-panel reveal visible" style={{ maxWidth: '860px', margin: '0 auto' }}>
            <p className="eyebrow" style={{ marginBottom: '14px' }}>{copy.introTitle}</p>
            <p className="body-sm" style={{ marginBottom: 0 }}>{copy.introBody}</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header reveal">
            <h2>{copy.takeawaysTitle}</h2>
          </div>
          <div className="grid-3 stagger">
            {copy.takeaways.map((item) => (
              <div key={item.title} className="card reveal">
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--color-bg-alt)' }}>
        <div className="container">
          <div className="editorial-panel reveal visible" style={{ maxWidth: '860px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '18px' }}>{copy.governanceTitle}</h2>
            <p className="body-sm">{copy.governanceBody}</p>
            <div style={{ display: 'grid', gap: '12px', marginTop: '20px' }}>
              {copy.governancePoints.map((item) => (
                <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '999px', marginTop: '8px', background: 'var(--color-accent)', flexShrink: 0 }} />
                  <p style={{ marginBottom: 0 }}>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="card reveal" style={{ maxWidth: '860px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '14px' }}>{copy.conclusionTitle}</h2>
            <p style={{ marginBottom: 0 }}>{copy.conclusionBody}</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="card reveal" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div className="card-icon" style={{ width: '56px', height: '56px', marginBottom: 0 }}>
                <FileText />
              </div>
              <div>
                <h3 style={{ marginBottom: '6px' }}>{copy.sourceTitle}</h3>
                <p style={{ marginBottom: 0 }}>{copy.sourceBody}</p>
              </div>
            </div>
            <a href={SOURCE_DOC_PATH} className="btn-dark" target="_blank" rel="noreferrer">
              {copy.download}
              <Download size={16} />
            </a>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cta-banner reveal">
            <h2>{copy.title}</h2>
            <p className="body-sm">{copy.subtitle}</p>
            <div className="btn-row">
              <Link to="/about#publications" className="btn-primary">
                {copy.backAbout}
                <ArrowRight />
              </Link>
              <Link to="/research" className="btn-secondary">{copy.backResearch}</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TrustAdvantageAnalysis;
