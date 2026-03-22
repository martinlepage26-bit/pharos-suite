import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BriefcaseBusiness, Building2, Clock3, HeartPulse, Landmark, Radar } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import SignalStrip from '../components/SignalStrip';

const SERVICES_COPY = {
  en: {
    eyebrow: 'Services',
    heroTitle: 'Services for deterministic governance under pressure',
    heroBody: 'Choose by pressure source, not vocabulary. The right service produces deterministic decision paths, explicit thresholds, and the materials a real review will ask for.',
    coreOffers: 'Core offers',
    coreTitle: 'Three services for deterministic governance',
    coreBody: 'Start with the pressure condition. The deliverables differ, but all three services create clearer thresholds, decision rights, and evidence for review.',
    verticals: 'By operating context',
    verticalsTitle: 'How the work changes by sector',
    verticalsBody: 'The service route stays consistent, but the pressure source, evidence burden, and review packet shift by operating context.',
    verticalPressureLabel: 'Typical pressure',
    verticalOutputsLabel: 'What usually changes',
    scoping: 'Scoping',
    scopingTitle: 'What changes the scope',
    scopingBody: 'Scope shifts with the number of systems, the level of review expected, the sensitivity of the decisions, and the strength of the evidence already in hand.',
    pricing: 'Pricing',
    pricingTitle: 'How engagements are priced',
    pricingBody: 'Every engagement is scoped and priced after an initial review. Pricing reflects system count, review depth, evidence condition, and remediation complexity.',
    commonQuestions: 'Common questions',
    faqTitle: 'What clients ask first',
    deliverables: 'Deliverables',
    outcomes: 'What it produces',
    ctaTitle: 'Need help choosing the right entry point?',
    ctaBody: 'A short review is enough to choose whether the work belongs in deterministic governance, a pre-mortem, or a post-mortem.',
    bookReview: 'Book a review',
    assessReadiness: 'Assess readiness',
    summary: [
      {
        label: 'Best for',
        title: 'Teams under real review pressure',
        description: 'Use this page when procurement, audit, launch, or incident response is forcing governance choices into the open.'
      },
      {
        label: 'What it changes',
        title: 'Thresholds, decision rights, and evidence burden',
        description: 'Each service clarifies who decides, what proof is needed, and where escalation starts.'
      },
      {
        label: 'How it starts',
        title: 'A short scoped review',
        description: 'The first review sets the route, the deliverables, and the level of scrutiny the work must withstand.'
      }
    ],
    packages: [
      {
        id: 'deterministic-governance',
        eyebrow: 'Package 1',
        title: 'Deterministic Governance',
        description: 'For organizations that need explicit thresholds, decision rights, and a stable governance baseline before scrutiny compounds ambiguity.',
        deliverables: [
          'System and vendor inventory with scope boundaries',
          'Deterministic tiering logic and thresholds',
          'Decision rights, escalation rules, and approval flow',
          'Governance cadence with named upkeep owners'
        ],
        outcomes: [
          'A governance baseline teams can execute consistently',
          'Less ambiguity during procurement, audit, and internal review',
          'Claims that stay inside what the evidence can support'
        ]
      },
      {
        id: 'pre-mortem-review',
        eyebrow: 'Package 2',
        title: 'Pre-mortem Review',
        description: 'For organizations pressure-testing an AI system before launch, procurement, onboarding, or major expansion.',
        deliverables: [
          'Failure-mode review across system, process, and vendor dependencies',
          'Launch or approval conditions with evidence requirements',
          'Vendor and third-party review questions',
          'Go / no-go summary with open issues and escalation triggers'
        ],
        outcomes: [
          'Risks surfaced before they become incidents',
          'Deterministic approval conditions for launch or expansion',
          'Clear evidence gaps and ownership before scrutiny arrives'
        ]
      },
      {
        id: 'post-mortem-review',
        eyebrow: 'Package 3',
        title: 'Post-mortem Review',
        description: 'For organizations responding to incidents, failed reviews, audit findings, or governance drift.',
        deliverables: [
          'Reconstruction of the event, decision path, and evidence trail',
          'Gap review across controls, documentation, and accountability',
          'Remediation priorities with threshold and control updates',
          'Executive summary and follow-up governance actions'
        ],
        outcomes: [
          'A defensible record of what happened and why',
          'Clear remediation ownership and sequencing',
          'A stronger deterministic governance posture after failure'
        ]
      }
    ],
    verticalsList: [
      {
        icon: HeartPulse,
        title: 'Healthcare and clinical settings',
        pressure: 'Vendor validation, clinical oversight, human review, and patient-safety escalation.',
        description: 'The work tightens approval conditions, evidence expectations, and escalation logic around systems that may influence care, triage, or operational clinical workflows.',
        outputs: 'Validation question sets, oversight rules, escalation thresholds, and review packets for clinical or procurement review.'
      },
      {
        icon: BriefcaseBusiness,
        title: 'Financial services and lending',
        pressure: 'Model risk, audit examination, decision explainability, and adverse-impact scrutiny.',
        description: 'The work clarifies risk tiering, decision rights, and documentation so governance can withstand internal audit, regulator, or customer review without post-hoc reconstruction.',
        outputs: 'Tiering logic, decision matrices, evidence trails, and audit response materials.'
      },
      {
        icon: Landmark,
        title: 'Public sector and benefits administration',
        pressure: 'Due process, contestability, citizen data handling, and fairness review.',
        description: 'The work focuses on high-stakes thresholds, human escalation, retention discipline, and the ability to explain how an AI-assisted process affected a public decision.',
        outputs: 'Contestability paths, retention rules, fairness monitoring requirements, and documented escalation points.'
      },
      {
        icon: Building2,
        title: 'Enterprise software and AI procurement',
        pressure: 'Customer questionnaires, vendor diligence, enterprise deal review, and board-level assurance requests.',
        description: 'The work aligns public claims, control documentation, and evidence collection so revenue pressure does not force governance language beyond what the underlying system can support.',
        outputs: 'Control registers, customer documentation packs, evidence playbooks, and procurement response templates.'
      }
    ],
    scopingCards: [
      {
        title: 'System portfolio',
        description: 'How many systems, vendors, and data pathways are in scope, and how quickly they change.'
      },
      {
        title: 'Review burden',
        description: 'Questionnaires, audits, contractual obligations, and leadership requests determine how much proof the service must produce.'
      },
      {
        title: 'Failure consequence',
        description: 'The stakes of a wrong decision, broken evidence trail, or weak escalation path determine how deterministic the governance model must be.'
      }
    ],
    pricingCards: [
      {
        icon: BriefcaseBusiness,
        title: 'Targeted review',
        description: 'A defined deterministic governance, pre-mortem, or post-mortem scope with explicit outputs and a clear end date.'
      },
      {
        icon: Radar,
        title: 'Multi-system cycle',
        description: 'A phased review path when several systems, vendors, or business units need structured work in sequence.'
      },
      {
        icon: Clock3,
        title: 'Follow-through',
        description: 'A lighter continuation when remediation, threshold updates, or a second review cycle is needed after the first service.'
      }
    ],
    faqs: [
      {
        question: 'What is the first engagement like?',
        answer: 'A 30-minute review to understand the pressure, the system context, and whether the work belongs in deterministic governance, a pre-mortem, or a post-mortem. From there, the scope is set with explicit deliverables and a timeline.'
      },
      {
        question: 'Do you replace legal counsel or audit firms?',
        answer: 'No. PHAROS builds the governance structures, documentation, and evidence layers that legal and audit teams review. The work complements counsel; it does not replace it.'
      },
      {
        question: 'How long does a typical engagement take?',
        answer: 'Deterministic governance usually runs 3 to 6 weeks. Pre-mortem reviews often run 2 to 4 weeks. Post-mortem reviews vary with the incident or finding, but usually run 2 to 6 weeks.'
      },
      {
        question: 'Can you support teams outside Canada?',
        answer: 'Yes. The frameworks are jurisdiction-aware. The practice is rooted in Canadian requirements, but the logic of tiering, decision rights, and evidence architecture travels well.'
      }
    ]
  },
  fr: {
    eyebrow: 'Services',
    heroTitle: 'Gouvernance sous pression',
    heroBody: 'Choisissez selon la pression réelle, pas selon le vocabulaire. Le bon service produit des parcours décisionnels déterministes, des seuils explicites et les éléments qu’un vrai examen demandera.',
    coreOffers: 'Offres principales',
    coreTitle: 'Trois services pour une gouvernance déterministe',
    coreBody: 'Commencez par la condition de pression. Les livrables changent, mais les trois services clarifient les seuils, les droits décisionnels et la preuve pour l’examen.',
    verticals: 'Par contexte d exploitation',
    verticalsTitle: 'Comment le travail change selon le secteur',
    verticalsBody: 'Le parcours de service reste stable, mais la source de pression, la charge de preuve et le dossier de revue changent selon le contexte d exploitation.',
    verticalPressureLabel: 'Pression typique',
    verticalOutputsLabel: 'Ce qui change le plus',
    scoping: 'Cadrage',
    scopingTitle: 'Ce qui fait varier la portée',
    scopingBody: 'La portée varie selon le nombre de systèmes, le niveau d’examen attendu, la sensibilité des décisions et la solidité de la preuve déjà disponible.',
    pricing: 'Tarification',
    pricingTitle: 'Comment les mandats sont tarifés',
    pricingBody: 'Chaque mandat est cadré et tarifé après une première revue. La tarification reflète le nombre de systèmes, la profondeur de l’examen, l’état de la preuve et la complexité de la remédiation.',
    commonQuestions: 'Questions fréquentes',
    faqTitle: 'Les premières questions des clients',
    deliverables: 'Livrables',
    outcomes: 'Ce que cela produit',
    ctaTitle: 'Besoin d’aide pour choisir le bon point d’entrée ?',
    ctaBody: 'Un court échange suffit pour déterminer si le travail relève d’une gouvernance déterministe, d’une revue pré-mortem ou d’une revue post-mortem.',
    bookReview: 'Réserver une revue',
    assessReadiness: 'Évaluer la préparation',
    summary: [
      {
        label: 'Pour qui',
        title: 'Les equipes sous vraie pression de revue',
        description: 'Utilisez cette page quand l approvisionnement, l audit, le lancement ou la reponse a incident force deja des choix de gouvernance.'
      },
      {
        label: 'Ce que cela clarifie',
        title: 'Seuils, droits decisionnels et charge de preuve',
        description: 'Chaque service precise qui decide, quelle preuve doit exister et ou l escalation commence.'
      },
      {
        label: 'Point de depart',
        title: 'Une courte revue cadree',
        description: 'Le premier echange fixe le bon parcours, les livrables et le niveau d examen que le travail devra supporter.'
      }
    ],
    packages: [
      {
        id: 'deterministic-governance',
        eyebrow: 'Forfait 1',
        title: 'Gouvernance déterministe',
        description: 'Pour les organisations qui ont besoin de seuils explicites, de droits décisionnels clairs et d’une base de gouvernance stable avant que l’examen n’amplifie l’ambiguïté.',
        deliverables: [
          'Inventaire des systèmes et fournisseurs avec limites de portée',
          'Logique de hiérarchisation déterministe et seuils explicites',
          'Droits décisionnels, règles d’escalade et parcours d’approbation',
          'Cadence de gouvernance avec responsables nommés pour le maintien'
        ],
        outcomes: [
          'Une base de gouvernance que les équipes peuvent exécuter de façon constante',
          'Moins d’ambiguïté en approvisionnement, en audit et en revue interne',
          'Des revendications qui demeurent à l’intérieur de ce que la preuve permet'
        ]
      },
      {
        id: 'pre-mortem-review',
        eyebrow: 'Forfait 2',
        title: 'Revue pré-mortem',
        description: 'Pour les organisations qui veulent éprouver un système d’IA avant un lancement, un achat, une intégration ou une expansion majeure.',
        deliverables: [
          'Revue des modes de défaillance à travers le système, les processus et les dépendances fournisseurs',
          'Conditions de lancement ou d’approbation avec exigences probantes',
          'Questions de revue fournisseur et tierces parties',
          'Sommaire feu vert / feu rouge avec enjeux ouverts et déclencheurs d’escalade'
        ],
        outcomes: [
          'Des risques révélés avant qu’ils ne deviennent des incidents',
          'Des conditions d’approbation déterministes pour un lancement ou une expansion',
          'Des écarts de preuve et des responsabilités clarifiés avant l’examen'
        ]
      },
      {
        id: 'post-mortem-review',
        eyebrow: 'Forfait 3',
        title: 'Revue post-mortem',
        description: 'Pour les organisations qui répondent à un incident, à un examen raté, à des constats d’audit ou à une dérive de gouvernance.',
        deliverables: [
          'Reconstruction de l’événement, du parcours décisionnel et de la piste de preuve',
          'Revue des écarts dans les contrôles, la documentation et la reddition de comptes',
          'Priorités de remédiation avec mises à jour des seuils et des contrôles',
          'Sommaire exécutif et actions de gouvernance de suivi'
        ],
        outcomes: [
          'Un dossier défendable de ce qui s’est passé et pourquoi',
          'Une responsabilité claire pour la remédiation et son séquencement',
          'Une posture de gouvernance déterministe plus forte après l’échec'
        ]
      }
    ],
    verticalsList: [
      {
        icon: HeartPulse,
        title: 'Sante et milieux cliniques',
        pressure: 'Validation fournisseur, supervision clinique, revue humaine et escalation liee a la securite des patients.',
        description: 'Le travail resserre les conditions d approbation, les attentes de preuve et la logique d escalation autour des systemes qui peuvent influencer les soins, le triage ou les workflows cliniques.',
        outputs: 'Jeux de questions de validation, regles de supervision, seuils d escalation et dossiers de revue pour la clinique ou l approvisionnement.'
      },
      {
        icon: BriefcaseBusiness,
        title: 'Services financiers et credit',
        pressure: 'Risque modele, examen d audit, explicabilite des decisions et scrutiny sur les impacts defavorables.',
        description: 'Le travail clarifie la hierarchisation du risque, les droits decisionnels et la documentation afin que la gouvernance tienne sous audit interne, revue reglementaire ou diligence client.',
        outputs: 'Logique de tiering, matrices de decision, traces de preuve et materiaux de reponse a l audit.'
      },
      {
        icon: Landmark,
        title: 'Secteur public et administration des prestations',
        pressure: 'Due process, contestabilite, gestion des donnees citoyennes et revue d equite.',
        description: 'Le travail se concentre sur les seuils a forts enjeux, l escalation humaine, la discipline de retention et la capacite d expliquer comment un processus assiste par IA a influence une decision publique.',
        outputs: 'Parcours de contestation, regles de retention, exigences de suivi d equite et points d escalation documentes.'
      },
      {
        icon: Building2,
        title: 'Logiciels d entreprise et approvisionnement IA',
        pressure: 'Questionnaires clients, diligence fournisseur, revue de deals enterprise et demandes d assurance au niveau de la direction.',
        description: 'Le travail aligne les revendications publiques, la documentation de controle et la collecte de preuve afin que la pression commerciale n oblige pas le langage de gouvernance a depasser ce que le systeme peut reellement soutenir.',
        outputs: 'Registres de controle, dossiers documentaires clients, playbooks de preuve et modeles de reponse a l approvisionnement.'
      }
    ],
    scopingCards: [
      {
        title: 'Portefeuille de systèmes',
        description: 'Combien de systèmes, de fournisseurs et de voies de données sont en portée, et à quelle vitesse ils changent.'
      },
      {
        title: 'Charge d’examen',
        description: 'Questionnaires, audits, obligations contractuelles et demandes de la direction déterminent la quantité de preuve que le service doit produire.'
      },
      {
        title: 'Conséquence de défaillance',
        description: 'L’importance d’une mauvaise décision, d’une piste de preuve brisée ou d’une escalade faible détermine jusqu’où le modèle doit être déterministe.'
      }
    ],
    pricingCards: [
      {
        icon: BriefcaseBusiness,
        title: 'Revue ciblée',
        description: 'Un mandat défini de gouvernance déterministe, de pré-mortem ou de post-mortem avec livrables explicites et date de fin claire.'
      },
      {
        icon: Radar,
        title: 'Cycle multi-systèmes',
        description: 'Un parcours de revue par phases lorsque plusieurs systèmes, fournisseurs ou unités d’affaires nécessitent un travail structuré en séquence.'
      },
      {
        icon: Clock3,
        title: 'Suivi',
        description: 'Une continuité plus légère lorsqu’une remédiation, une mise à jour des seuils ou un second cycle de revue est requis après le premier mandat.'
      }
    ],
    faqs: [
      {
        question: 'À quoi ressemble le premier mandat ?',
        answer: 'Un échange de 30 minutes pour comprendre la pression, le contexte du système et déterminer si le travail relève d’une gouvernance déterministe, d’un pré-mortem ou d’un post-mortem. Ensuite, la portée est fixée avec des livrables explicites et un calendrier.'
      },
      {
        question: 'Remplacez-vous les conseillers juridiques ou les cabinets d’audit ?',
        answer: 'Non. PHAROS bâtit les structures de gouvernance, la documentation et les couches de preuve que les équipes juridiques et d’audit examinent. Le travail complète ces équipes; il ne les remplace pas.'
      },
      {
        question: 'Combien de temps dure un mandat type ?',
        answer: 'La gouvernance déterministe s’étend généralement sur 3 à 6 semaines. Les revues pré-mortem durent souvent 2 à 4 semaines. Les post-mortem varient selon l’incident ou le constat, mais durent habituellement 2 à 6 semaines.'
      },
      {
        question: 'Pouvez-vous accompagner des équipes hors du Canada ?',
        answer: 'Oui. Les cadres sont sensibles au contexte réglementaire. La pratique est enracinée dans les exigences canadiennes, mais la logique de hiérarchisation, de droits décisionnels et d’architecture probante se transpose bien.'
      }
    ]
  }
};

const Services = () => {
  const { language } = useLanguage();
  const [openFaq, setOpenFaq] = useState(0);
  const copy = useMemo(() => SERVICES_COPY[language], [language]);

  return (
    <div data-testid="services-page">
      <div className="page-hero">
        <div className="container">
          <div className="section-header">
            <p className="eyebrow">{copy.eyebrow}</p>
            <h1>{copy.heroTitle}</h1>
            <p className="body-lg page-hero-copy">
              {copy.heroBody}
            </p>
            <div className="jump-links">
              <a href="#deterministic-governance" className="jump-pill">{copy.packages[0].title}</a>
              <a href="#pre-mortem-review" className="jump-pill">{copy.packages[1].title}</a>
              <a href="#post-mortem-review" className="jump-pill">{copy.packages[2].title}</a>
            </div>
            <SignalStrip items={copy.summary} className="signal-grid-page" />
          </div>
        </div>
      </div>

      <section className="section section-topless">
        <div className="container">
          <div className="section-header reveal">
            <p className="eyebrow">{copy.coreOffers}</p>
            <h2>{copy.coreTitle}</h2>
            <p className="body-sm">
              {copy.coreBody}
            </p>
          </div>

          <div className="grid-3 stagger">
            {copy.packages.map((item) => (
              <div key={item.title} id={item.id} className="package reveal anchor-offset">
                <div className="package-header">
                  <p className="eyebrow">{item.eyebrow}</p>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
                <div className="package-body">
                  <p className="package-label">{copy.deliverables}</p>
                  <ul className="package-list">
                    {item.deliverables.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                  <p className="package-label">{copy.outcomes}</p>
                  <ul className="package-list">
                    {item.outcomes.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                  <div className="package-actions">
                    <Link to="/connect" className="package-link">
                      {copy.bookReview}
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-muted">
        <div className="container">
          <div className="section-header reveal">
            <p className="eyebrow">{copy.verticals}</p>
            <h2>{copy.verticalsTitle}</h2>
            <p className="body-sm">
              {copy.verticalsBody}
            </p>
          </div>

          <div className="grid-2 stagger">
            {copy.verticalsList.map((item) => (
              <div key={item.title} className="card reveal">
                <div className="card-icon">
                  <item.icon />
                </div>
                <h3>{item.title}</h3>
                <p className="body-sm page-inline-note">
                  <strong>{copy.verticalPressureLabel}:</strong> {item.pressure}
                </p>
                <p>{item.description}</p>
                <p className="body-sm page-inline-note">
                  <strong>{copy.verticalOutputsLabel}:</strong> {item.outputs}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-muted">
        <div className="container">
          <div className="section-header reveal">
            <p className="eyebrow">{copy.scoping}</p>
            <h2>{copy.scopingTitle}</h2>
            <p className="body-sm">
              {copy.scopingBody}
            </p>
          </div>

          <div className="grid-3 stagger">
            {copy.scopingCards.map((item) => (
              <div key={item.title} className="card reveal">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header reveal">
            <p className="eyebrow">{copy.pricing}</p>
            <h2>{copy.pricingTitle}</h2>
            <p className="body-sm">
              {copy.pricingBody}
            </p>
          </div>

          <div className="grid-3 stagger">
            {copy.pricingCards.map((item) => (
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
            <p className="eyebrow">{copy.commonQuestions}</p>
            <h2>{copy.faqTitle}</h2>
          </div>

          <div className="reveal section-narrow">
            {copy.faqs.map((item, index) => {
              const isOpen = index === openFaq;
              return (
                <div key={item.question} className={`faq-item${isOpen ? ' open' : ''}`}>
                  <button className="faq-trigger" type="button" onClick={() => setOpenFaq(isOpen ? -1 : index)}>
                    {item.question}
                    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                      <path d="M10 4v12M4 10h12" strokeLinecap="round" />
                    </svg>
                  </button>
                  <div className="faq-content" style={{ maxHeight: isOpen ? '240px' : '0' }}>
                    <div className="faq-content-inner">{item.answer}</div>
                  </div>
                </div>
              );
            })}
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
                {copy.bookReview}
                <ArrowRight />
              </Link>
              <Link to="/tool" className="btn-secondary">{copy.assessReadiness}</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
