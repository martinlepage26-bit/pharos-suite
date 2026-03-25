import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const QUESTIONS = [
  'inventory',
  'riskTiering',
  'decisionRights',
  'controls',
  'evidence',
  'vendorReview',
  'cadence',
  'documentation'
];

const COPY = {
  en: {
    eyebrow: 'Readiness tool',
    title: 'Quick governance readiness snapshot',
    body:
      'Select your operating context, answer eight bounded questions, and get a practical signal on where governance needs reinforcement before review pressure rises.',
    sectorPrompt: 'Choose your closest operating context',
    questionPrompt: 'Answer for current reality, not target state',
    reset: 'Start over',
    next: 'Next',
    back: 'Back',
    seeResults: 'See results',
    resultsTitle: 'Readiness signal',
    scoreBreakdown: 'Score breakdown',
    recommendedSteps: 'Recommended next steps',
    total: 'Total',
    discuss: 'Book a review',
    routeAction: 'View service routes',
    retake: 'Retake snapshot',
    sectors: [
      {
        id: 'regulated',
        title: 'Regulated environment',
        description: 'Financial, healthcare, or public-facing decisions under formal oversight.'
      },
      {
        id: 'enterprise-saas',
        title: 'Enterprise product',
        description: 'AI features in customer-facing software with procurement scrutiny.'
      },
      {
        id: 'procurement',
        title: 'Procurement-heavy cycle',
        description: 'Frequent questionnaires and due diligence from buyers or partners.'
      },
      {
        id: 'public-sector',
        title: 'Public sector program',
        description: 'Institutional deployment with accountability and documentation duties.'
      }
    ],
    questions: {
      inventory: 'Do you maintain a current inventory of AI systems and vendors?',
      riskTiering: 'Do you classify systems by consequence and review intensity?',
      decisionRights: 'Are decision rights explicit for approval, escalation, and stop conditions?',
      controls: 'Do named controls exist for high-consequence usage paths?',
      evidence: 'Can you produce review-ready evidence without last-minute reconstruction?',
      vendorReview: 'Do vendor AI dependencies have structured governance checks?',
      cadence: 'Is there a recurring cadence for governance review and updates?',
      documentation: 'Is governance documentation current and usable by reviewers?'
    },
    options: [
      { value: 'none', label: 'No', score: 0 },
      { value: 'partial', label: 'Partially', score: 1 },
      { value: 'complete', label: 'Yes', score: 2 }
    ],
    profile: {
      high: {
        label: 'Strong baseline',
        summary: 'Core governance structure is in place. Focus on maintaining evidence quality and update cadence.',
        steps: [
          'Validate that high-consequence systems have current evidence packets.',
          'Stress-test escalation triggers before major launch changes.',
          'Run periodic quality checks on decision-rights ownership.'
        ]
      },
      medium: {
        label: 'Developing baseline',
        summary: 'Important components exist, but review pressure could expose gaps in consistency or evidence.',
        steps: [
          'Formalize threshold and escalation rules in one shared model.',
          'Assign explicit owners for evidence and governance upkeep.',
          'Prepare a first bounded packet for likely reviewer questions.'
        ]
      },
      low: {
        label: 'High exposure',
        summary: 'Governance structure is currently too thin for sustained scrutiny.',
        steps: [
          'Start with deterministic baseline design before expansion.',
          'Prioritize decision-rights mapping and evidence obligations.',
          'Run a scoped pre-mortem on the most exposed system path.'
        ]
      }
    }
  },
  fr: {
    eyebrow: 'Outil de preparation',
    title: 'Instantane rapide de preparation gouvernance',
    body:
      'Choisissez votre contexte operationnel, repondez a huit questions bornees, et obtenez un signal pratique sur les zones a renforcer avant escalation de revue.',
    sectorPrompt: 'Choisissez le contexte le plus proche',
    questionPrompt: 'Repondez selon l etat actuel, pas l etat cible',
    reset: 'Recommencer',
    next: 'Suivant',
    back: 'Retour',
    seeResults: 'Voir resultats',
    resultsTitle: 'Signal de preparation',
    scoreBreakdown: 'Detail des scores',
    recommendedSteps: 'Prochaines etapes recommandees',
    total: 'Total',
    discuss: 'Reserver une revue',
    routeAction: 'Voir les parcours de service',
    retake: 'Refaire instantane',
    sectors: [
      {
        id: 'regulated',
        title: 'Environnement reglemente',
        description: 'Decisions finance, sante ou public sous supervision formelle.'
      },
      {
        id: 'enterprise-saas',
        title: 'Produit enterprise',
        description: 'Fonctions IA dans logiciel client avec scrutiny achat.'
      },
      {
        id: 'procurement',
        title: 'Cycle fort achat',
        description: 'Questionnaires et diligence repetes de clients ou partenaires.'
      },
      {
        id: 'public-sector',
        title: 'Programme secteur public',
        description: 'Deploiement institutionnel avec exigences de trace et responsabilite.'
      }
    ],
    questions: {
      inventory: 'Tenez-vous un inventaire actuel des systemes IA et fournisseurs?',
      riskTiering: 'Classez-vous les systemes selon consequence et intensite de revue?',
      decisionRights: 'Les droits de decision sont-ils explicites pour approbation, escalation et arret?',
      controls: 'Des controles nommes existent-ils pour les usages a forte consequence?',
      evidence: 'Pouvez-vous produire une preuve lisible sans reconstruction de derniere minute?',
      vendorReview: 'Les dependances IA fournisseur ont-elles une revue de gouvernance structuree?',
      cadence: 'Existe-t-il une cadence recurente de revue et mise a jour de gouvernance?',
      documentation: 'La documentation de gouvernance est-elle actuelle et exploitable par reviseurs?'
    },
    options: [
      { value: 'none', label: 'Non', score: 0 },
      { value: 'partial', label: 'Partiellement', score: 1 },
      { value: 'complete', label: 'Oui', score: 2 }
    ],
    profile: {
      high: {
        label: 'Base solide',
        summary: 'La structure centrale existe. Priorite: qualite continue de preuve et cadence de mise a jour.',
        steps: [
          'Verifier que les systemes critiques ont des dossiers de preuve actuels.',
          'Tester les declencheurs d escalation avant changements de lancement.',
          'Controler periodiquement les owners de droits de decision.'
        ]
      },
      medium: {
        label: 'Base en progression',
        summary: 'Des composants importants existent, mais la pression de revue peut encore exposer des ecarts.',
        steps: [
          'Formaliser seuils et regles d escalation dans un modele partage.',
          'Nommer explicitement les responsables preuve et upkeep.',
          'Preparer un premier dossier borne pour questions de revue previsibles.'
        ]
      },
      low: {
        label: 'Exposition elevee',
        summary: 'La structure actuelle reste trop mince pour soutenir une scrutiny continue.',
        steps: [
          'Commencer par une base deterministe avant expansion.',
          'Prioriser cartographie des droits de decision et obligations de preuve.',
          'Lancer un pre-mortem cible sur le parcours systeme le plus expose.'
        ]
      }
    }
  }
};

const scoreToProfile = (percentage, profile) => {
  if (percentage >= 75) return profile.high;
  if (percentage >= 50) return profile.medium;
  return profile.low;
};

const Tool = () => {
  const { language } = useLanguage();
  const copy = COPY[language];

  const [step, setStep] = useState(1);
  const [selectedSector, setSelectedSector] = useState('');
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const questionItems = useMemo(
    () => QUESTIONS.map((id) => ({ id, question: copy.questions[id], options: copy.options })),
    [copy.options, copy.questions]
  );

  const currentItem = questionItems[currentQuestion];
  const isLastQuestion = currentQuestion === questionItems.length - 1;

  const canProceed = step === 1
    ? Boolean(selectedSector)
    : Boolean(answers[currentItem?.id]);

  const totalScore = Object.values(answers).reduce((sum, value) => sum + value.score, 0);
  const maxScore = questionItems.length * 2;
  const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

  const profile = scoreToProfile(percentage, copy.profile);
  const selectedSectorLabel = copy.sectors.find((sector) => sector.id === selectedSector)?.title || '';

  const handleSelectSector = (sectorId) => {
    setSelectedSector(sectorId);
  };

  const handleAnswer = (questionId, option) => {
    setAnswers((current) => ({
      ...current,
      [questionId]: option
    }));
  };

  const handleNext = () => {
    if (step === 1 && selectedSector) {
      setStep(2);
      setCurrentQuestion(0);
      return;
    }

    if (step === 2 && !isLastQuestion) {
      setCurrentQuestion((value) => value + 1);
      return;
    }

    if (step === 2 && isLastQuestion) {
      setDrawerOpen(true);
    }
  };

  const handleBack = () => {
    if (step === 2 && currentQuestion > 0) {
      setCurrentQuestion((value) => value - 1);
      return;
    }

    if (step === 2 && currentQuestion === 0) {
      setStep(1);
    }
  };

  const handleReset = () => {
    setStep(1);
    setSelectedSector('');
    setAnswers({});
    setCurrentQuestion(0);
    setDrawerOpen(false);
  };

  return (
    <div data-testid="tool-page">
      <section className="section">
        <div className="container section-shell reveal-up">
          <p className="kicker">{copy.eyebrow}</p>
          <h1 style={{ marginTop: '0.7rem' }}>{copy.title}</h1>
          <p className="body-lead" style={{ marginTop: '0.8rem' }}>{copy.body}</p>
        </div>
      </section>

      <section className="section section-tight">
        <div className="container">
          <article className="surface reveal-up">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p className="kicker">{step === 1 ? copy.sectorPrompt : copy.questionPrompt}</p>
                <p className="body-sm" style={{ marginTop: '0.4rem' }}>
                  1. Context  /  2. Readiness  /  3. Results
                </p>
              </div>

              <button
                type="button"
                onClick={handleReset}
                className="btn-ghost"
                data-testid="reset-btn"
              >
                {copy.reset}
              </button>
            </div>

            {step === 1 ? (
              <div style={{ marginTop: '1rem' }} data-testid="step-1-sector">
                <div className="grid-2">
                  {copy.sectors.map((sector) => {
                    const active = selectedSector === sector.id;
                    return (
                      <button
                        key={sector.id}
                        type="button"
                        className="surface"
                        data-testid={`sector-${sector.id}`}
                        onClick={() => handleSelectSector(sector.id)}
                        style={{
                          textAlign: 'left',
                          borderColor: active ? 'var(--accent-500)' : undefined,
                          background: active ? 'var(--accent-soft)' : undefined
                        }}
                      >
                        <h3>{sector.title}</h3>
                        <p className="body-sm" style={{ marginTop: '0.45rem' }}>{sector.description}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}

            {step === 2 ? (
              <div style={{ marginTop: '1rem' }} data-testid="step-2-readiness">
                <p className="kicker">Question {currentQuestion + 1} / {questionItems.length}</p>
                <h2 style={{ marginTop: '0.5rem' }} data-testid={`question-${currentItem.id}`}>{currentItem.question}</h2>
                <div style={{ display: 'grid', gap: '0.65rem', marginTop: '0.9rem' }}>
                  {currentItem.options.map((option) => {
                    const selected = answers[currentItem.id]?.value === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleAnswer(currentItem.id, option)}
                        className="surface"
                        style={{
                          textAlign: 'left',
                          borderColor: selected ? 'var(--accent-500)' : undefined,
                          background: selected ? 'var(--accent-soft)' : undefined
                        }}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}

            <div style={{ display: 'flex', gap: '0.65rem', marginTop: '1rem' }}>
              {step === 2 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="btn-secondary"
                  data-testid="back-btn"
                >
                  {copy.back}
                </button>
              ) : null}

              <button
                type="button"
                onClick={handleNext}
                disabled={!canProceed}
                className="btn-primary"
                data-testid="next-btn"
                style={{ marginLeft: 'auto', opacity: canProceed ? 1 : 0.55 }}
              >
                {step === 2 && isLastQuestion ? copy.seeResults : copy.next}
                <ArrowRight size={14} />
              </button>
            </div>
          </article>
        </div>
      </section>

      {drawerOpen ? (
        <>
          <div className="results-overlay" onClick={() => setDrawerOpen(false)} data-testid="drawer-backdrop" />
          <aside className="results-drawer" data-testid="results-drawer">
            <div className="results-header">
              <div>
                <p className="kicker" style={{ color: 'rgba(255,255,255,0.72)' }}>{copy.resultsTitle}</p>
                <h2 style={{ color: '#ffffff', marginTop: '0.45rem' }}>{percentage}%</h2>
                <p className="body-sm" style={{ color: 'rgba(255,255,255,0.8)', marginTop: '0.4rem' }}>{selectedSectorLabel}</p>
              </div>
              <button type="button" className="menu-toggle" onClick={() => setDrawerOpen(false)} data-testid="close-drawer-btn">
                <X size={16} />
              </button>
            </div>

            <div className="results-body">
              <article className="surface">
                <h3>{profile.label}</h3>
                <p className="body-sm" style={{ marginTop: '0.45rem' }}>{profile.summary}</p>
              </article>

              <article className="surface" style={{ marginTop: '0.75rem' }}>
                <h3>{copy.scoreBreakdown}</h3>
                <div style={{ display: 'grid', gap: '0.55rem', marginTop: '0.65rem' }}>
                  {questionItems.map((item) => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', gap: '0.6rem' }}>
                      <span className="body-sm">{item.question}</span>
                      <strong style={{ color: 'var(--ink-950)' }}>{answers[item.id]?.score || 0}/2</strong>
                    </div>
                  ))}
                </div>
                <p className="body-sm" style={{ marginTop: '0.7rem' }}><strong>{copy.total}: {totalScore}/{maxScore}</strong></p>
              </article>

              <article className="surface" style={{ marginTop: '0.75rem' }}>
                <h3>{copy.recommendedSteps}</h3>
                <ul className="check-list" style={{ marginTop: '0.6rem' }}>
                  {profile.steps.map((stepText) => (
                    <li key={stepText}>{stepText}</li>
                  ))}
                </ul>
              </article>

              <div className="btn-row" style={{ marginTop: '0.9rem' }}>
                <Link to="/contact" className="btn-primary" data-testid="book-debrief-btn">
                  {copy.discuss}
                  <ArrowRight size={14} />
                </Link>
                <Link to="/services" className="btn-secondary">{copy.routeAction}</Link>
                <button type="button" className="btn-ghost" onClick={handleReset}>{copy.retake}</button>
              </div>
            </div>
          </aside>
        </>
      ) : null}
    </div>
  );
};

export default Tool;
