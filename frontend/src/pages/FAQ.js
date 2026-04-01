import LocalizedLink from '../components/LocalizedLink';
import { ArrowRight, FileCheck2, ShieldCheck, Waypoints } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const COPY = {
  en: {
    eyebrow: 'FAQ',
    title: 'Straight answers for teams preparing for real review',
    body:
      'These questions come up before procurement decisions, audit checkpoints, vendor diligence, and leadership escalation. Answers stay bounded to what can be evidenced.',
    overviewTitle: 'What this page helps you clarify',
    overviewCards: [
      {
        icon: ShieldCheck,
        title: 'Governance scope',
        body: 'What governance is, and where principle language stops being enough.'
      },
      {
        icon: FileCheck2,
        title: 'Evidence baseline',
        body: 'What documents and records should exist before a review asks for them.'
      },
      {
        icon: Waypoints,
        title: 'Engagement route',
        body: 'How to choose a deterministic route without opening unnecessary project weight.'
      }
    ],
    sections: [
      {
        title: 'Starting point',
        intro: 'Use this section when your team is still defining what governance work should include.',
        items: [
          {
            q: 'What is AI governance in practical terms?',
            a: 'It is the operating structure that defines decision rights, thresholds, controls, and evidence expectations so review can be completed without improvised explanations.'
          },
          {
            q: 'How is this different from AI ethics?',
            a: 'Ethics identifies values. Governance turns those values into accountable routines: who decides, what is required, what triggers escalation, and what record must exist.'
          },
          {
            q: 'How can we tell governance is already behind?',
            a: 'If you cannot show a current system inventory, named decision owners, and a simple evidence packet for your most exposed systems, governance is trailing deployment.'
          }
        ]
      },
      {
        title: 'Evidence and review',
        intro: 'Use this section when procurement, audit, or vendor review pressure is already active.',
        items: [
          {
            q: 'What do reviewers usually ask first?',
            a: 'They start with accountability and traceability: who approved what, under which threshold, and what evidence supports that decision.'
          },
          {
            q: 'What should exist before a formal review?',
            a: 'At minimum: a system and vendor inventory, risk tier logic, decision-rights mapping, and a review packet that clearly separates verified evidence from open gaps.'
          },
          {
            q: 'Does governance always slow delivery?',
            a: 'Weak governance slows teams because decisions are renegotiated repeatedly. Deterministic governance usually speeds review cycles by reducing ambiguity.'
          }
        ]
      },
      {
        title: 'Engagement and next steps',
        intro: 'Use this section when you need to decide how to start without overcommitting scope.',
        items: [
          {
            q: 'What does a first engagement produce?',
            a: 'A scoped route: threshold model, decision ownership map, evidence expectations, and the first bounded deliverables needed for review pressure.'
          },
          {
            q: 'Do we still need governance for vendor AI?',
            a: 'Yes. Vendor tools do not transfer accountability away from your organization. Governance still needs vendor diligence, usage boundaries, and reassessment triggers.'
          },
          {
            q: 'What is the lightest entry point?',
            a: 'Run the readiness snapshot first, then book a short review call to select the right service route and avoid unnecessary scope.'
          }
        ]
      }
    ],
    ctaTitle: 'Need answers tied to your current pressure source?',
    ctaBody: 'Bring the system in scope, the review trigger, and current evidence state. PHAROS can help define the right bounded route.',
    ctaPrimary: 'Book a review',
    ctaSecondary: 'Run readiness snapshot'
  },
  fr: {
    eyebrow: 'FAQ',
    title: 'Réponses directes pour les équipes sous pression de revue',
    body:
      'Ces questions reviennent avant une revue d’approvisionnement, un audit, une diligence fournisseur ou une escalade vers la direction. Les réponses restent bornées à ce qui peut être démontré.',
    overviewTitle: 'Ce que cette page aide à clarifier',
    overviewCards: [
      {
        icon: ShieldCheck,
        title: 'Portée de gouvernance',
        body: 'Ce que la gouvernance couvre, et la limite d’un langage de principes laissé seul.'
      },
      {
        icon: FileCheck2,
        title: 'Base de preuve',
        body: 'Quels artefacts doivent exister avant qu’une revue ne les exige.'
      },
      {
        icon: Waypoints,
        title: 'Parcours de mandat',
        body: 'Comment choisir un point d’entrée déterministe sans alourdir inutilement le projet.'
      }
    ],
    sections: [
      {
        title: 'Point de départ',
        intro: 'Section utile lorsque l’équipe définit encore ce que le travail de gouvernance doit inclure.',
        items: [
          {
            q: 'Qu’est-ce que la gouvernance de l’IA en pratique?',
            a: 'C’est la structure opérationnelle qui fixe les responsabilités décisionnelles, les seuils, les contrôles et les exigences de preuve afin de permettre une revue sans improvisation.'
          },
          {
            q: 'Quelle différence avec l’éthique de l’IA?',
            a: 'L’éthique nomme des valeurs. La gouvernance transforme ces valeurs en routines responsables : qui décide, ce qui est requis, ce qui déclenche l’escalade et quelles traces doivent exister.'
          },
          {
            q: 'Comment voir que la gouvernance est déjà en retard?',
            a: 'Si vous ne pouvez pas montrer un inventaire actuel, des responsables nommés et un dossier de preuve simple pour les systèmes les plus exposés, la gouvernance est déjà en retard.'
          }
        ]
      },
      {
        title: 'Preuve et revue',
        intro: 'Section utile lorsque la pression d’approvisionnement, d’audit ou de revue fournisseur est déjà active.',
        items: [
          {
            q: 'Que demandent les réviseurs en premier?',
            a: 'Ils commencent généralement par la responsabilité et la traçabilité : qui a approuvé quoi, sous quel seuil, et quelle preuve soutient cette décision.'
          },
          {
            q: 'Que faut-il avoir avant une revue formelle?',
            a: 'Au minimum : un inventaire des systèmes et des fournisseurs, une logique de priorisation, une carte des responsabilités décisionnelles et un dossier qui sépare clairement la preuve vérifiée des écarts ouverts.'
          },
          {
            q: 'La gouvernance ralentit-elle toujours les équipes?',
            a: 'Une gouvernance faible ralentit les équipes parce que les décisions sont renégociées en continu. Une gouvernance déterministe accélère souvent les cycles de revue en réduisant l’ambiguïté.'
          }
        ]
      },
      {
        title: 'Mandat et prochaines étapes',
        intro: 'Section utile lorsqu’il faut choisir comment commencer sans ouvrir une portée excessive.',
        items: [
          {
            q: 'Que produit un premier mandat?',
            a: 'Un parcours cadré : modèle de seuils, carte des responsabilités décisionnelles, attentes de preuve et premiers livrables bornés.'
          },
          {
            q: 'Faut-il gouverner l’IA fournie par un tiers?',
            a: 'Oui. Le recours à un fournisseur ne transfère pas la responsabilité. Il faut de la diligence fournisseur, des limites d’usage et des déclencheurs de réévaluation.'
          },
          {
            q: 'Quel est le point d’entrée le plus léger?',
            a: 'Commencez par l’instantané de préparation, puis prenez un court appel de cadrage pour choisir le bon parcours.'
          }
        ]
      }
    ],
    ctaTitle: 'Besoin de réponses liées à votre situation réelle?',
    ctaBody: 'Apportez le système dans la portée, la source de pression et l’état actuel de la preuve. PHAROS peut vous aider à cadrer le bon parcours, sans excès de portée.',
    ctaPrimary: 'Planifier une revue',
    ctaSecondary: 'Faire l’instantané'
  }
};

const FAQ = () => {
  const { language } = useLanguage();
  const copy = COPY[language];

  return (
    <div data-testid="faq-page">
      <section className="section">
        <div className="container section-shell reveal-up">
          <p className="kicker">{copy.eyebrow}</p>
          <h1 style={{ marginTop: '0.7rem' }}>{copy.title}</h1>
          <p className="body-lead" style={{ marginTop: '0.8rem' }}>{copy.body}</p>
        </div>
      </section>

      <section className="section section-tight">
        <div className="container">
          <div className="section-header reveal-up">
            <h2>{copy.overviewTitle}</h2>
          </div>
          <div className="grid-3">
            {copy.overviewCards.map((card, index) => (
              <article className={`surface reveal-up delay-${Math.min(index, 3)}`} key={card.title}>
                <span className="icon-pill" aria-hidden="true">
                  <card.icon size={16} />
                </span>
                <h3 className="surface-title" style={{ marginTop: '0.7rem' }}>{card.title}</h3>
                <p>{card.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-tight">
        <div className="container grid-3" style={{ alignItems: 'start' }}>
          {copy.sections.map((section, sectionIndex) => (
            <article key={section.title} className={`surface reveal-up delay-${Math.min(sectionIndex, 3)}`}>
              <h2 style={{ fontSize: '1.28rem' }}>{section.title}</h2>
              <p className="body-sm" style={{ marginTop: '0.45rem' }}>{section.intro}</p>
              <div className="faq-list" style={{ marginTop: '0.85rem' }}>
                {section.items.map((item, itemIndex) => (
                  <details
                    key={item.q}
                    className="faq-item"
                    data-testid={`faq-${sectionIndex}-${itemIndex}`}
                  >
                    <summary>{item.q}</summary>
                    <p>{item.a}</p>
                  </details>
                ))}
              </div>
            </article>
          ))}
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
              <LocalizedLink className="btn-secondary" to="/tool">
                {copy.ctaSecondary}
              </LocalizedLink>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQ;
