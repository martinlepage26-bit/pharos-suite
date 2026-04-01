import LocalizedLink from '../components/LocalizedLink';
import { ArrowRight, Workflow } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const COPY = {
  en: {
    eyebrow: 'Method',
    title: 'Recursive deterministic governance in practical form',
    body:
      'The method is built to turn governance pressure into inspectable controls: bounded input, explicit intent, deterministic thresholds, assigned decisions, and reconstructible evidence.',
    stagesTitle: 'Method stages',
    stages: [
      {
        title: '1. Bound the source set',
        body: 'Define what enters the analysis and what remains outside the decision pathway.'
      },
      {
        title: '2. Declare intent',
        body: 'State the function of each pass so analysis, generation, and governance are not mixed implicitly.'
      },
      {
        title: '3. Compare and stress',
        body: 'Test outputs against source and context to find drift, contradiction, and missing controls.'
      },
      {
        title: '4. Extract controls',
        body: 'Translate recurring issues into thresholds, escalation rules, ownership, and evidence duties.'
      },
      {
        title: '5. Bind to workflow',
        body: 'Attach controls to concrete interfaces where decisions happen.'
      },
      {
        title: '6. Preserve reconstruction',
        body: 'Keep decision records and follow-through so future reviewers can verify choices.'
      }
    ],
    doctrineTitle: 'Method doctrine',
    doctrine: [
      'Artifact hierarchy outranks fluent summary language.',
      'Generated artifacts are process evidence, not automatic factual authority.',
      'Recursion must earn another pass through new explanatory value.',
      'Controls are incomplete until owner, trigger, and review cadence are explicit.'
    ],
    ctaTitle: 'Ready to apply this to a live system?',
    ctaBody: 'Start with a scoped review and map your first governance control surface.',
    ctaPrimary: 'Book review',
    ctaSecondary: 'View services'
  },
  fr: {
    eyebrow: 'Méthode',
    title: 'La gouvernance déterministe récursive en pratique',
    body:
      'La méthode transforme la pression de gouvernance en contrôles inspectables : entrée bornée, intention explicite, seuils déterministes, décisions attribuées et preuve reconstructible.',
    stagesTitle: 'Étapes de la méthode',
    stages: [
      {
        title: '1. Borner l’ensemble de sources',
        body: 'Définir ce qui entre dans l’analyse et ce qui reste à l’extérieur du parcours décisionnel.'
      },
      {
        title: '2. Déclarer l’intention',
        body: 'Nommer la fonction de chaque passage afin d’éviter les glissements implicites.'
      },
      {
        title: '3. Comparer et mettre sous tension',
        body: 'Comparer les sorties à la source et au contexte pour faire ressortir la dérive, les contradictions et les manques.'
      },
      {
        title: '4. Extraire les contrôles',
        body: 'Traduire les schémas récurrents en seuils, règles d’escalade, responsabilités et exigences de preuve.'
      },
      {
        title: '5. Lier au flux de travail',
        body: 'Attacher les contrôles aux interfaces où les décisions réelles se prennent.'
      },
      {
        title: '6. Préserver la reconstruction',
        body: 'Conserver les traces de décision et de suivi pour une vérification ultérieure.'
      }
    ],
    doctrineTitle: 'Doctrine',
    doctrine: [
      'La hiérarchie des artefacts prime sur la fluidité du langage.',
      'Les artefacts générés sont des preuves de processus, pas une autorité factuelle automatique.',
      'La récursivité doit justifier une nouvelle passe par une valeur explicative réelle.',
      'Un contrôle demeure incomplet tant que le responsable, le déclencheur et la cadence de revue ne sont pas explicites.'
    ],
    ctaTitle: 'Prêt à appliquer la méthode à un système réel?',
    ctaBody: 'Commencez par une revue encadrée et cartographiez votre première surface de contrôle.',
    ctaPrimary: 'Planifier une revue',
    ctaSecondary: 'Voir les services'
  }
};

const ConceptualMethod = () => {
  const { language } = useLanguage();
  const copy = COPY[language];

  return (
    <div data-testid="conceptual-method-page">
      <section className="section">
        <div className="container section-shell reveal-up">
          <p className="kicker">{copy.eyebrow}</p>
          <h1 style={{ marginTop: '0.7rem' }}>{copy.title}</h1>
          <p className="body-lead" style={{ marginTop: '0.8rem' }}>{copy.body}</p>
        </div>
      </section>

      <section className="section section-tight">
        <div className="container grid-2" style={{ alignItems: 'start' }}>
          <article className="surface reveal-up">
            <p className="kicker">{copy.stagesTitle}</p>
            <div className="timeline" style={{ marginTop: '0.8rem' }}>
              {copy.stages.map((stage) => (
                <article className="timeline-item" key={stage.title}>
                  <h3 style={{ marginBottom: '0.35rem' }}>{stage.title}</h3>
                  <p>{stage.body}</p>
                </article>
              ))}
            </div>
          </article>

          <article className="surface reveal-up delay-1">
            <span className="icon-pill" aria-hidden="true">
              <Workflow size={16} />
            </span>
            <h2 style={{ marginTop: '0.7rem' }}>{copy.doctrineTitle}</h2>
            <ul className="check-list" style={{ marginTop: '0.75rem' }}>
              {copy.doctrine.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="section section-tight">
        <div className="container">
          <div className="final-cta reveal-up">
            <h2>{copy.ctaTitle}</h2>
            <p className="body-lead" style={{ marginTop: '0.7rem' }}>{copy.ctaBody}</p>
            <div className="btn-row" style={{ marginTop: '0.95rem' }}>
              <LocalizedLink className="btn-primary" to="/contact">
                {copy.ctaPrimary}
                <ArrowRight size={14} />
              </LocalizedLink>
              <LocalizedLink className="btn-secondary" to="/services">
                {copy.ctaSecondary}
              </LocalizedLink>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ConceptualMethod;
