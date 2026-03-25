import { Link } from 'react-router-dom';
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
    eyebrow: 'Methode',
    title: 'Gouvernance deterministe recursive en forme pratique',
    body:
      'La methode transforme la pression de gouvernance en controles inspectables: entree bornee, intention explicite, seuils deterministes, decisions attribuees et preuve reconstructible.',
    stagesTitle: 'Etapes de la methode',
    stages: [
      {
        title: '1. Borner la source',
        body: 'Definir ce qui entre dans l analyse et ce qui reste hors parcours de decision.'
      },
      {
        title: '2. Declarer l intention',
        body: 'Nommer la fonction de chaque passe pour eviter les glissements implicites.'
      },
      {
        title: '3. Comparer et tester',
        body: 'Tester les sorties contre la source et le contexte pour voir derive et contradictions.'
      },
      {
        title: '4. Extraire les controles',
        body: 'Traduire les patterns en seuils, escalation, responsabilites et exigences de preuve.'
      },
      {
        title: '5. Lier au workflow',
        body: 'Attacher les controles aux interfaces ou les decisions reelles ont lieu.'
      },
      {
        title: '6. Preserver la reconstruction',
        body: 'Garder les traces de decision et de suivi pour verification ulterieure.'
      }
    ],
    doctrineTitle: 'Doctrine',
    doctrine: [
      'La hierarchie des artefacts prime sur la fluidite du langage.',
      'Les artefacts generes sont des preuves de processus, pas des preuves factuelles automatiques.',
      'La recursion doit justifier une nouvelle passe.',
      'Un controle reste incomplet sans proprietaire, declencheur et cadence de revue.'
    ],
    ctaTitle: 'Pret a appliquer la methode a un systeme reel?',
    ctaBody: 'Commencez par une revue cadree et cartographiez le premier point de controle.',
    ctaPrimary: 'Reserver',
    ctaSecondary: 'Voir services'
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
              <Link className="btn-primary" to="/contact">
                {copy.ctaPrimary}
                <ArrowRight size={14} />
              </Link>
              <Link className="btn-secondary" to="/services">
                {copy.ctaSecondary}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ConceptualMethod;
