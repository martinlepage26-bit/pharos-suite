import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { METHODS_COPY } from './About';
import { useLanguage } from '../context/LanguageContext';

const PAGE_COPY = {
  en: {
    integrationLabel: 'Ethics integration',
    integrationTitle: 'From ethical concern to workflow control',
    integrationBody: 'This page frames the method as a practical way to integrate ethics into AI models by turning ethical concerns into bounded inputs, comparative tests, control extraction, and deployment-time safeguards.',
    heroBody2: 'Instead of treating ethics as an after-the-fact statement, the method embeds ethics through corpus design, declared intent, recursive comparison, failure analysis, and interface-bound controls.',
    frameworkLabel: 'Framework mapping',
    frameworkTitle: 'How PHAROS maps to named standards and review duties',
    frameworkBody: 'PHAROS is not a shortcut around formal standards. It is a mechanism-first governance method that can be mapped to named frameworks when procurement, audit, or regulatory review requires those touchpoints.',
    frameworkMappingLabel: 'PHAROS mapping',
    frameworkCards: [
      {
        title: 'NIST AI RMF',
        description: 'Useful when a review needs a Govern, Map, Measure, Manage structure rather than ad hoc governance language.',
        mapping: 'Pressure reading and threshold setting support Govern and Map, while evidence paths, review packets, and follow-through cadence support Measure and Manage.'
      },
      {
        title: 'ISO/IEC 42001',
        description: 'Useful when an organization needs management-system style discipline around scope, roles, documented controls, and review cadence.',
        mapping: 'PHAROS surfaces scope boundaries, decision rights, evidence artifacts, and review intervals in a way that can plug into a broader AI management system.'
      },
      {
        title: 'EU AI Act and comparable high-stakes review',
        description: 'Useful when teams need named obligations around risk tiering, human oversight, technical documentation, and post-incident follow-through.',
        mapping: 'PHAROS makes thresholds explicit, names human escalation, structures documentation burdens, and turns incidents or failed reviews into post-mortem control updates.'
      }
    ],
    backToAbout: 'Back to About',
    bookDebrief: 'Book a debrief'
  },
  fr: {
    integrationLabel: 'Integration de l’ethique',
    integrationTitle: 'De la question ethique au controle de workflow',
    integrationBody: 'Cette page presente la methode comme une maniere pratique d’integrer l’ethique aux modeles d’IA en transformant les enjeux ethiques en entrees bornees, tests comparatifs, extraction de controles et sauvegardes au moment du deploiement.',
    heroBody2: 'Au lieu de traiter l’ethique comme une declaration apres coup, la methode l’integre par la conception du corpus, l’intention declaree, la comparaison recursive, l’analyse des echecs et des controles attaches aux interfaces.',
    frameworkLabel: 'Cartographie des cadres',
    frameworkTitle: 'Comment PHAROS se relie aux normes et obligations nommees',
    frameworkBody: 'PHAROS n est pas un raccourci autour des normes formelles. C est une methode de gouvernance orientee mecanisme qui peut etre reliee a des cadres nommes lorsque l approvisionnement, l audit ou la revue reglementaire exige ces points d ancrage.',
    frameworkMappingLabel: 'Cartographie PHAROS',
    frameworkCards: [
      {
        title: 'NIST AI RMF',
        description: 'Utile lorsqu une revue demande une structure Govern, Map, Measure, Manage plutot qu un langage de gouvernance ad hoc.',
        mapping: 'La lecture de la pression et la fixation des seuils soutiennent Govern et Map, tandis que les parcours de preuve, les dossiers de revue et la cadence de suivi soutiennent Measure et Manage.'
      },
      {
        title: 'ISO/IEC 42001',
        description: 'Utile lorsqu une organisation a besoin d une discipline de type systeme de management autour de la portee, des roles, des controles documentes et de la cadence de revue.',
        mapping: 'PHAROS rend visibles les limites de portee, les droits decisionnels, les artefacts de preuve et les intervalles de revue de facon a pouvoir s inserer dans un systeme de management IA plus large.'
      },
      {
        title: 'EU AI Act et revues comparables a forts enjeux',
        description: 'Utile lorsque des equipes ont besoin d obligations nommees autour du tiering de risque, de la supervision humaine, de la documentation technique et du suivi post-incident.',
        mapping: 'PHAROS rend les seuils explicites, nomme l escalation humaine, structure la charge documentaire et transforme les incidents ou revues echouees en mises a jour post-mortem des controles.'
      }
    ],
    backToAbout: 'Retour a propos',
    bookDebrief: 'Reserver un echange'
  }
};

function ConceptualMethod() {
  const { language } = useLanguage();
  const methods = METHODS_COPY[language];
  const page = PAGE_COPY[language];

  return (
    <div data-testid="conceptual-method-page">
      <div className="page-hero">
        <div className="container">
          <div className="about-hero-split">
            <div>
              <p className="eyebrow" style={{ marginBottom: '16px' }}>{methods.label}</p>
              <div className="brand-kicker brand-kicker-static">
                <span>PHAROS AI GOVERNANCE</span>
              </div>
              <h1>{methods.title}</h1>
              <p className="body-lg" style={{ marginTop: '20px' }}>
                {methods.body}
              </p>
              <div className="divider" />
              <p className="body-sm">
                {page.heroBody2}
              </p>
              <div style={{ marginTop: '32px', display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                <Link to="/connect" className="btn-dark">
                  {page.bookDebrief}
                  <ArrowRight />
                </Link>
                <Link to="/about" className="btn-outline">{page.backToAbout}</Link>
              </div>
            </div>

            <div className="reveal visible">
              <div className="editorial-panel">
                <p className="eyebrow" style={{ marginBottom: '16px' }}>{page.integrationLabel}</p>
                <h2 style={{ fontSize: '1.75rem', marginBottom: '16px' }}>{page.integrationTitle}</h2>
                <p className="body-sm">
                  {page.integrationBody}
                </p>
                <div className="divider" />
                <p className="body-sm" style={{ marginTop: '16px' }}>
                  {methods.definition}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="section" style={{ background: 'var(--color-bg-alt)' }}>
        <div className="container">
          <div className="section-header reveal">
            <h2>{methods.overviewTitle}</h2>
            <p className="body-sm">{methods.overviewBody}</p>
          </div>

          <div className="editorial-panel reveal visible" style={{ maxWidth: '960px', margin: '0 auto 28px' }}>
            <p className="body-sm">{methods.definition}</p>
            <div className="divider" />
            <p className="body-sm" style={{ marginTop: '16px', marginBottom: 0 }}>{methods.origin}</p>
          </div>

          <div className="grid-3 stagger">
            {methods.coreTerms.map((item) => (
              <div key={item.title} className="card reveal">
                <p className="eyebrow" style={{ marginBottom: '12px' }}>{item.num}</p>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>

          <div className="section-header reveal" style={{ marginTop: '72px' }}>
            <p className="eyebrow">{page.frameworkLabel}</p>
            <h2>{page.frameworkTitle}</h2>
            <p className="body-sm">{page.frameworkBody}</p>
          </div>

          <div className="grid-3 stagger">
            {page.frameworkCards.map((item) => (
              <div key={item.title} className="card reveal">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <p className="body-sm page-inline-note" style={{ marginBottom: 0 }}>
                  <strong>{page.frameworkMappingLabel}:</strong> {item.mapping}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header reveal">
            <h2>{methods.pipelineTitle}</h2>
            <p className="body-sm">{methods.pipelineBody}</p>
          </div>

          <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {methods.pipeline.map((item) => (
              <div key={item.num} className="card reveal">
                <p className="eyebrow" style={{ marginBottom: '12px' }}>{item.num}</p>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <div className="divider" />
                <p className="body-sm" style={{ marginTop: '16px', marginBottom: '10px' }}>
                  <strong>{methods.questionLabel}:</strong> {item.question}
                </p>
                <p className="body-sm" style={{ marginBottom: 0 }}>
                  <strong>{methods.controlLabel}:</strong> {item.control}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--color-bg-alt)' }}>
        <div className="container">
          <div className="section-header reveal">
            <h2>{methods.probeTitle}</h2>
            <p className="body-sm">{methods.probeBody}</p>
          </div>

          <div className="grid-2 stagger">
            {methods.probeCards.map((item) => (
              <div key={item.title} className="card reveal">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>

          <div className="editorial-panel-dark reveal visible" style={{ marginTop: '24px' }}>
            <p className="eyebrow" style={{ marginBottom: '16px' }}>{methods.probeSequenceLabel}</p>
            <p className="body-sm">{methods.probeSequenceBody}</p>
            <p className="body-sm" style={{ marginBottom: 0 }}>{methods.probeSequenceNote}</p>
          </div>

          <div className="section-header reveal" style={{ marginTop: '72px' }}>
            <h2>{methods.formulaTitle}</h2>
            <p className="body-sm">{methods.formulaBody}</p>
          </div>

          <div className="grid-3 stagger">
            {methods.formulaSteps.map((item) => (
              <div key={item.tag} className="card reveal">
                <p className="eyebrow" style={{ marginBottom: '12px' }}>{item.tag}</p>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>

          <div className="editorial-panel reveal visible" style={{ marginTop: '24px' }}>
            <p className="body-sm" style={{ marginBottom: 0 }}>{methods.formulaDefinition}</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header reveal">
            <h2>{methods.featuresTitle}</h2>
            <p className="body-sm">{methods.featuresBody}</p>
          </div>

          <div className="stagger" style={{ display: 'grid', gap: '20px' }}>
            {methods.features.map((item) => (
              <div key={item.num} className="card reveal">
                <p className="eyebrow" style={{ marginBottom: '12px' }}>{item.num}</p>
                <h3>{item.title}</h3>
                <p style={{ marginBottom: 0 }}>{item.description}</p>
              </div>
            ))}
          </div>

          <div className="section-header reveal" style={{ marginTop: '72px' }}>
            <h2>{methods.failureTitle}</h2>
            <p className="body-sm">{methods.failureBody}</p>
          </div>

          <div className="grid-2 stagger">
            {methods.failureCards.map((item) => (
              <div key={item.title} className="card reveal">
                <p className="eyebrow" style={{ marginBottom: '12px' }}>{item.tag}</p>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>

          <div className="editorial-panel-dark reveal visible" style={{ marginTop: '24px' }}>
            <p className="eyebrow" style={{ marginBottom: '16px' }}>{methods.failureSequenceLabel}</p>
            <p className="body-sm">{methods.failureSequenceBody}</p>
            <p className="body-sm" style={{ marginBottom: 0 }}>{methods.failureSequenceNote}</p>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--color-bg-alt)' }}>
        <div className="container">
          <div className="section-header reveal">
            <h2>{methods.glossaryTitle}</h2>
            <p className="body-sm">{methods.glossaryBody}</p>
          </div>

          <div className="grid-2 stagger">
            {methods.glossary.map((item) => (
              <div key={item.term} className="card reveal">
                <h3>{item.term}</h3>
                <p style={{ marginBottom: 0 }}>{item.definition}</p>
              </div>
            ))}
          </div>

          <div className="section-header reveal" style={{ marginTop: '28px', marginBottom: 0 }}>
            <a
              href="/normalized-results"
              className="body-sm"
              style={{ fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', textDecoration: 'underline' }}
            >
              SEE NORMALIZED RESULTS
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ConceptualMethod;
