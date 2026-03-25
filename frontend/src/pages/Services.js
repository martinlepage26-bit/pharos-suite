import { Link } from 'react-router-dom';
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
    title: 'Services de gouvernance deterministe sous pression de revue',
    body:
      'Choisissez selon la source de pression. Chaque parcours est cadre autour de ce que les reviseurs demanderont a verifier.',
    cards: [
      {
        id: 'deterministic-governance',
        icon: ShieldCheck,
        title: 'Gouvernance deterministe',
        bestFor: 'Pour les equipes qui doivent etablir une base stable avant que la pression n amplifie l ambiguite.',
        deliverables: [
          'Inventaire des systemes et fournisseurs',
          'Seuils deterministes et logique d escalation',
          'Matrice de decision et cadence de gouvernance'
        ],
        outcomes: [
          'Moins de derive decisionnelle sous revue',
          'Responsabilites et preuve plus claires',
          'Revendications bornees par la preuve'
        ]
      },
      {
        id: 'pre-mortem-review',
        icon: Radar,
        title: 'Revue pre-mortem',
        bestFor: 'Pour les equipes qui testent un lancement ou une expansion avant exposition.',
        deliverables: [
          'Stress test des modes d echec et dependances',
          'Conditions go/no-go avec exigences de preuve',
          'Questions ciblees de diligence fournisseur'
        ],
        outcomes: [
          'Risques identifies avant exposition',
          'Conditions de lancement deterministes',
          'Ecarts de preuve avec responsables'
        ]
      },
      {
        id: 'post-mortem-review',
        icon: BriefcaseBusiness,
        title: 'Revue post-mortem',
        bestFor: 'Pour les equipes qui repondent a un incident ou un echec de revue.',
        deliverables: [
          'Reconstruction de l evenement et du parcours de preuve',
          'Analyse des ecarts de controle',
          'Plan de remediation avec mise a jour des seuils'
        ],
        outcomes: [
          'Dossier defendable de ce qui s est passe',
          'Remediation claire et sequencee',
          'Posture renforcee apres echec'
        ]
      }
    ],
    scopeTitle: 'Ce qui change la portee',
    scopeItems: [
      'Nombre de systemes et de fournisseurs en portee',
      'Niveau de charge de revue',
      'Consequence d un echec de controle'
    ],
    ctaTitle: 'Besoin d aide pour choisir le bon parcours?',
    ctaBody: 'Un court appel suffit pour fixer le parcours, la portee et les premiers livrables.',
    ctaPrimary: 'Reserver',
    ctaSecondary: 'Retour accueil',
    deliverablesLabel: 'Livrables',
    outcomesLabel: 'Resultats'
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
              <Link className="btn-primary" to="/contact">
                {copy.ctaPrimary}
                <ArrowRight size={14} />
              </Link>
              <Link className="btn-secondary" to="/">
                {copy.ctaSecondary}
              </Link>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
};

export default Services;
