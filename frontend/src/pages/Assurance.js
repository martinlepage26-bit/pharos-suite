import LocalizedLink from '../components/LocalizedLink';
import { ArrowRight, ExternalLink, FileCheck2, ShieldCheck, Waypoints } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { PUBLIC_ASSURANCE_META } from '../data/publicAssurance';

const COPY = {
  en: {
    eyebrow: 'Assurance',
    title: 'Public assurance surface for PHAROS',
    body:
      'This page defines what the public site supports, what it does not claim, who remains accountable, and where external reviewers should start.',
    summary: [
      {
        label: 'Accountable human',
        value: PUBLIC_ASSURANCE_META.accountableHuman,
        body: 'Final publication judgment and claim boundaries remain under named human control.'
      },
      {
        label: 'Last review',
        value: PUBLIC_ASSURANCE_META.reviewedOnLabelEn,
        body: 'Surface scope, route boundaries, and disclosure posture were reviewed on this date.'
      },
      {
        label: 'Next review due',
        value: PUBLIC_ASSURANCE_META.nextReviewDueLabelEn,
        body: 'Review sooner when claims, routes, or product exposure change materially.'
      }
    ],
    supportedTitle: 'Supported readings',
    supported: [
      'PHAROS publicly describes governance services, method posture, and review pathways.',
      'The site identifies accountable ownership, review dates, and transparency references.',
      'Readiness tooling is a calibration aid, not certification or legal determination.',
      'Deployment-specific assurance requires scoped human review beyond public website copy.'
    ],
    limitsTitle: 'Hard limits and non-claims',
    limits: [
      'This website is not legal advice.',
      'This website is not an audit opinion or regulatory filing.',
      'Website text alone does not prove a deployment is compliant.',
      'AI-assisted drafting never upgrades unsupported claims into supported facts.'
    ],
    reviewTitle: 'Where reviewers should begin',
    reviewSteps: [
      'Check the transparency record first for owner, dates, scope, and aliases.',
      'Read methods and references to inspect control logic and cited sources.',
      'Use FAQ and readiness pages to assess boundary discipline and evidence posture.',
      'Request scoped human review for deployment-specific evidence.'
    ],
    routesTitle: 'Public routes by function',
    routes: [
      {
        to: '/methods',
        title: 'Methods',
        body: 'Conceptual and operational logic behind deterministic governance.'
      },
      {
        to: '/library',
        title: 'Library',
        body: 'Standards, law, and reference material used for review context.'
      },
      {
        to: '/faq',
        title: 'FAQ',
        body: 'Bounded answers to recurring scrutiny questions.'
      },
      {
        to: '/tool',
        title: 'Readiness tool',
        body: 'Quick calibration signal before deeper engagement.'
      },
      {
        to: '/contact',
        title: 'Contact',
        body: 'Escalate to a scoped human review when specifics matter.'
      }
    ],
    disclosureTitle: 'Disclosure and metadata',
    disclosureBody:
      'Generative AI may assist drafting and editing. Source selection, boundaries, review dates, and release decisions remain under human control.',
    disclosureRows: [
      ['Public surface version', PUBLIC_ASSURANCE_META.publicSurfaceVersion],
      ['Canonical URL', PUBLIC_ASSURANCE_META.canonicalUrl],
      ['Accountable location', PUBLIC_ASSURANCE_META.accountableLocation],
      ['Jurisdictional root', PUBLIC_ASSURANCE_META.jurisdictionalRoot]
    ],
    transparencyAction: 'Open transparency JSON',
    ctaTitle: 'Need deployment-specific evidence?',
    ctaBody: 'Move from public posture to scoped review. PHAROS can provide bounded, review-ready discussion for the systems that matter.',
    ctaPrimary: 'Book review',
    ctaSecondary: 'Read methods'
  },
  fr: {
    eyebrow: 'Assurance',
    title: 'Surface publique d’assurance de PHAROS',
    body:
      'Cette page définit ce que le site public soutient, ce qu’il ne prétend pas démontrer, qui demeure responsable et par où un examinateur externe devrait commencer.',
    summary: [
      {
        label: 'Responsable humain',
        value: PUBLIC_ASSURANCE_META.accountableHuman,
        body: 'Le jugement final de publication et les limites d’allégation demeurent sous contrôle humain nommé.'
      },
      {
        label: 'Dernière revue',
        value: PUBLIC_ASSURANCE_META.reviewedOnLabelFr,
        body: 'La portée de la surface, les limites de route et la posture de divulgation ont été revues à cette date.'
      },
      {
        label: 'Prochaine revue',
        value: PUBLIC_ASSURANCE_META.nextReviewDueLabelFr,
        body: 'Réviser plus tôt si les allégations, les routes ou le niveau d’exposition changent de façon importante.'
      }
    ],
    supportedTitle: 'Lectures soutenues',
    supported: [
      'PHAROS décrit publiquement ses services, sa méthode et ses parcours de revue.',
      'Le site identifie le responsable, les dates de revue et les références de transparence.',
      'L’outil de préparation sert à la calibration; il ne constitue ni une certification ni un avis juridique.',
      'Toute assurance propre à un déploiement exige une revue humaine encadrée, au-delà du texte public.'
    ],
    limitsTitle: 'Limites fermes et non-allégations',
    limits: [
      'Ce site ne constitue pas un avis juridique.',
      'Ce site n’est ni une opinion d’audit ni un dépôt réglementaire.',
      'Le texte du site ne prouve pas à lui seul la conformité d’un déploiement.',
      'La rédaction assistée par l’IA ne transforme jamais une affirmation non étayée en fait établi.'
    ],
    reviewTitle: 'Par où commencer une revue',
    reviewSteps: [
      'Vérifier d’abord le registre de transparence pour le responsable, les dates, la portée et les alias.',
      'Lire les méthodes et les références pour inspecter la logique de contrôle et les sources citées.',
      'Utiliser la FAQ et l’outil de préparation pour évaluer les limites et la posture de preuve.',
      'Demander une revue humaine encadrée lorsqu’une preuve propre au déploiement est requise.'
    ],
    routesTitle: 'Routes publiques par fonction',
    routes: [
      {
        to: '/methods',
        title: 'Méthodes',
        body: 'Logique conceptuelle et opérationnelle de la gouvernance déterministe.'
      },
      {
        to: '/library',
        title: 'Bibliothèque',
        body: 'Normes, droit et références utiles en contexte de revue.'
      },
      {
        to: '/faq',
        title: 'FAQ',
        body: 'Réponses bornées aux questions récurrentes sous pression de revue.'
      },
      {
        to: '/tool',
        title: 'Outil de préparation',
        body: 'Signal de calibration rapide avant un échange plus approfondi.'
      },
      {
        to: '/contact',
        title: 'Contact',
        body: 'Passer à une revue humaine encadrée quand les détails comptent.'
      }
    ],
    disclosureTitle: 'Divulgation et métadonnées',
    disclosureBody:
      'L’IA générative peut aider à la rédaction et à la révision. Le choix des sources, les limites d’allégation, les dates de revue et les décisions de publication demeurent sous contrôle humain.',
    disclosureRows: [
      ['Version de surface publique', PUBLIC_ASSURANCE_META.publicSurfaceVersion],
      ['URL canonique', PUBLIC_ASSURANCE_META.canonicalUrl],
      ['Localisation responsable', PUBLIC_ASSURANCE_META.accountableLocation],
      ['Racine juridictionnelle', PUBLIC_ASSURANCE_META.jurisdictionalRoot]
    ],
    transparencyAction: 'Ouvrir le JSON de transparence',
    ctaTitle: 'Besoin d’une preuve propre à un déploiement?',
    ctaBody: 'Passez de la posture publique à une revue encadrée. PHAROS peut fournir une discussion bornée et orientée vers la revue pour les systèmes qui comptent réellement.',
    ctaPrimary: 'Planifier une revue',
    ctaSecondary: 'Lire la méthode'
  }
};

const Assurance = () => {
  const { language } = useLanguage();
  const copy = COPY[language];

  return (
    <div data-testid="assurance-page">
      <section className="section">
        <div className="container section-shell reveal-up">
          <p className="kicker">{copy.eyebrow}</p>
          <h1 style={{ marginTop: '0.7rem' }}>{copy.title}</h1>
          <p className="body-lead" style={{ marginTop: '0.8rem' }}>{copy.body}</p>
        </div>
      </section>

      <section className="section section-tight">
        <div className="container grid-3">
          {copy.summary.map((item, index) => (
            <article className={`surface reveal-up delay-${Math.min(index, 3)}`} key={item.label}>
              <p className="kicker">{item.label}</p>
              <h2 style={{ fontSize: '1.22rem', marginTop: '0.5rem' }}>{item.value}</h2>
              <p className="body-sm" style={{ marginTop: '0.45rem' }}>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section section-tight">
        <div className="container grid-2" style={{ alignItems: 'start' }}>
          <article className="surface reveal-up">
            <span className="icon-pill" aria-hidden="true">
              <ShieldCheck size={16} />
            </span>
            <h2 style={{ marginTop: '0.7rem' }}>{copy.supportedTitle}</h2>
            <ul className="check-list" style={{ marginTop: '0.75rem' }}>
              {copy.supported.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article className="surface reveal-up delay-1">
            <span className="icon-pill" aria-hidden="true">
              <FileCheck2 size={16} />
            </span>
            <h2 style={{ marginTop: '0.7rem' }}>{copy.limitsTitle}</h2>
            <ul className="check-list" style={{ marginTop: '0.75rem' }}>
              {copy.limits.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="section section-tight">
        <div className="container grid-2" style={{ alignItems: 'start' }}>
          <article className="surface reveal-up">
            <span className="icon-pill" aria-hidden="true">
              <Waypoints size={16} />
            </span>
            <h2 style={{ marginTop: '0.7rem' }}>{copy.reviewTitle}</h2>
            <div className="timeline" style={{ marginTop: '0.75rem' }}>
              {copy.reviewSteps.map((step) => (
                <article className="timeline-item" key={step}>
                  <p>{step}</p>
                </article>
              ))}
            </div>
          </article>

          <article className="surface reveal-up delay-1">
            <h2>{copy.disclosureTitle}</h2>
            <p className="body-sm" style={{ marginTop: '0.6rem' }}>{copy.disclosureBody}</p>
            <ul className="check-list" style={{ marginTop: '0.75rem' }}>
              {copy.disclosureRows.map(([label, value]) => (
                <li key={label}><strong>{label}:</strong> {value}</li>
              ))}
            </ul>
            <a
              href={PUBLIC_ASSURANCE_META.transparencyRecordPath}
              className="btn-secondary"
              style={{ marginTop: '0.95rem', display: 'inline-flex' }}
              target="_blank"
              rel="noreferrer"
            >
              {copy.transparencyAction}
              <ExternalLink size={14} />
            </a>
          </article>
        </div>
      </section>

      <section className="section section-tight">
        <div className="container">
          <div className="section-header reveal-up">
            <h2>{copy.routesTitle}</h2>
          </div>
          <div className="grid-3">
            {copy.routes.map((route, index) => (
              <LocalizedLink key={route.to} to={route.to} className={`surface reveal-up delay-${Math.min(index, 3)}`}>
                <h3>{route.title}</h3>
                <p className="body-sm" style={{ marginTop: '0.5rem' }}>{route.body}</p>
              </LocalizedLink>
            ))}
          </div>
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
              <LocalizedLink className="btn-secondary" to="/methods">
                {copy.ctaSecondary}
              </LocalizedLink>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Assurance;
