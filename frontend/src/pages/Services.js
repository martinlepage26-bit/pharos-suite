import LocalizedLink from '../components/LocalizedLink';
import { ArrowRight, BriefcaseBusiness, Radar, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const COPY = {
  en: {
    eyebrow: 'Services',
    title: 'Deterministic governance services for live review pressure',
    body:
      'Choose by pressure source, not by governance vocabulary. Each route is scoped around what reviewers will ask you to prove.',
    cards: [
      {
        id: 'deterministic-governance',
        icon: ShieldCheck,
        title: 'Deterministic Governance',
        bestFor: 'Best for teams that need a stable governance baseline before pressure compounds ambiguity.',
        deliverables: [
          'System and vendor inventory with scope boundaries',
          'Deterministic threshold and escalation model',
          'Decision-rights matrix and governance cadence'
        ],
        outcomes: [
          'Less decision drift under procurement or audit pressure',
          'Clearer ownership and evidence obligations',
          'Claims that stay bounded to available proof'
        ]
      },
      {
        id: 'pre-mortem-review',
        icon: Radar,
        title: 'Pre-mortem Review',
        bestFor: 'Best for teams pressure-testing a launch, onboarding flow, or major system expansion.',
        deliverables: [
          'Failure-mode and dependency stress test',
          'Go or no-go conditions with evidence requirements',
          'Targeted vendor and third-party diligence prompts'
        ],
        outcomes: [
          'Risks surfaced before external exposure',
          'Deterministic launch conditions',
          'Known evidence gaps with owners assigned'
        ]
      },
      {
        id: 'post-mortem-review',
        icon: BriefcaseBusiness,
        title: 'Post-mortem Review',
        bestFor: 'Best for teams responding to incidents, failed reviews, or governance drift.',
        deliverables: [
          'Event reconstruction with decision and evidence trail',
          'Control-gap analysis with consequence mapping',
          'Remediation path with threshold updates'
        ],
        outcomes: [
          'A defensible record of what happened and why',
          'Clear remediation ownership and sequencing',
          'A stronger governance posture after failure'
        ]
      }
    ],
    scopeTitle: 'What changes engagement scope',
    scopeItems: [
      'How many systems and vendors are in scope',
      'How demanding the review burden is (procurement, audit, committee, or regulator)',
      'How high the consequence is if controls fail'
    ],
    ctaTitle: 'Need help selecting the right route?',
    ctaBody: 'A short call is enough to set route, scope, and first deliverables.',
    ctaPrimary: 'Book review',
    ctaSecondary: 'Start from home',
    deliverablesLabel: 'Deliverables',
    outcomesLabel: 'Outcomes'
  },
  fr: {
    eyebrow: 'Services',
    title: 'Services de gouvernance déterministe pour des contextes de revue active',
    body:
      'Choisissez selon la source de pression, pas selon le vocabulaire. Chaque parcours est structuré autour de ce que les réviseurs voudront voir, comprendre et vérifier.',
    cards: [
      {
        id: 'deterministic-governance',
        icon: ShieldCheck,
        title: 'Gouvernance déterministe',
        bestFor: 'Convient aux équipes qui ont besoin d’une base de gouvernance stable avant que la pression de revue n’amplifie l’ambiguïté.',
        deliverables: [
          'Inventaire des systèmes et des fournisseurs avec limites de portée',
          'Seuils déterministes et logique d’escalade',
          'Matrice décisionnelle et cadence de gouvernance'
        ],
        outcomes: [
          'Moins de dérive décisionnelle sous pression d’approvisionnement ou d’audit',
          'Responsabilités et obligations de preuve mieux définies',
          'Allégations bornées par la preuve disponible'
        ]
      },
      {
        id: 'pre-mortem-review',
        icon: Radar,
        title: 'Revue pré-mortem',
        bestFor: 'Convient aux équipes qui veulent mettre un lancement, un parcours d’intégration ou une expansion majeure à l’épreuve avant exposition.',
        deliverables: [
          'Mise sous tension des modes de défaillance et des dépendances',
          'Conditions go / no-go liées à des exigences de preuve',
          'Questions ciblées pour la diligence fournisseur'
        ],
        outcomes: [
          'Risques relevés avant l’exposition externe',
          'Conditions de lancement déterministes',
          'Écarts de preuve connus avec responsables assignés'
        ]
      },
      {
        id: 'post-mortem-review',
        icon: BriefcaseBusiness,
        title: 'Revue post-mortem',
        bestFor: 'Convient aux équipes qui répondent à un incident, à une revue échouée ou à une dérive de gouvernance.',
        deliverables: [
          'Reconstitution de l’événement et de la chaîne de preuve',
          'Analyse des écarts de contrôle avec cartographie des conséquences',
          'Plan de remédiation avec mise à jour des seuils'
        ],
        outcomes: [
          'Dossier défendable de ce qui s’est passé et pourquoi',
          'Remédiation claire, nommée et séquencée',
          'Posture de gouvernance renforcée après la défaillance'
        ]
      }
    ],
    scopeTitle: 'Ce qui fait varier la portée',
    scopeItems: [
      'Le nombre de systèmes et de fournisseurs réellement dans la portée',
      'L’intensité de la charge de revue : approvisionnement, audit, comité ou autorité réglementaire',
      'Le niveau de conséquence si un contrôle échoue'
    ],
    ctaTitle: 'Besoin d’aide pour choisir le bon parcours?',
    ctaBody: 'Un court appel suffit pour fixer le parcours, la portée et les premiers livrables.',
    ctaPrimary: 'Planifier une revue',
    ctaSecondary: 'Retour à l’accueil',
    deliverablesLabel: 'Livrables',
    outcomesLabel: 'Résultats'
  }
};

const Services = () => {
  const { language } = useLanguage();
  const copy = COPY[language];

  return (
    <div data-testid="services-page">
      <section className="section">
        <div className="container section-shell reveal-up">
          <p className="kicker">{copy.eyebrow}</p>
          <h1 style={{ marginTop: '0.7rem' }}>{copy.title}</h1>
          <p className="body-lead" style={{ marginTop: '0.8rem' }}>{copy.body}</p>
        </div>
      </section>

      <section className="section section-tight">
        <div className="container grid-3">
          {copy.cards.map((card, index) => (
            <article id={card.id} key={card.title} className={`surface reveal-up delay-${Math.min(index, 3)}`}>
              <span className="icon-pill" aria-hidden="true">
                <card.icon size={16} />
              </span>
              <h2 style={{ fontSize: '1.3rem', marginTop: '0.7rem' }}>{card.title}</h2>
              <p className="body-sm" style={{ marginTop: '0.5rem' }}>{card.bestFor}</p>

              <p className="kicker" style={{ marginTop: '0.9rem' }}>{copy.deliverablesLabel}</p>
              <ul className="check-list" style={{ marginTop: '0.45rem' }}>
                {card.deliverables.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              <p className="kicker" style={{ marginTop: '0.9rem' }}>{copy.outcomesLabel}</p>
              <ul className="check-list" style={{ marginTop: '0.45rem' }}>
                {card.outcomes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="section section-tight">
        <div className="container grid-2" style={{ alignItems: 'start' }}>
          <article className="surface reveal-up">
            <h2>{copy.scopeTitle}</h2>
            <ul className="check-list" style={{ marginTop: '0.85rem' }}>
              {copy.scopeItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article className="final-cta reveal-up delay-1">
            <h2>{copy.ctaTitle}</h2>
            <p className="body-lead" style={{ marginTop: '0.6rem' }}>{copy.ctaBody}</p>
            <div className="btn-row" style={{ marginTop: '0.95rem' }}>
              <LocalizedLink className="btn-primary" to="/contact">
                {copy.ctaPrimary}
                <ArrowRight size={14} />
              </LocalizedLink>
              <LocalizedLink className="btn-secondary" to="/">
                {copy.ctaSecondary}
              </LocalizedLink>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
};

export default Services;
