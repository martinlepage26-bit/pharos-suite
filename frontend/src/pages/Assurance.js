import { Link } from 'react-router-dom';
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
    title: 'Surface publique d assurance PHAROS',
    body:
      'Cette page definit ce que le site public soutient, ce qu il ne revendique pas, qui reste responsable et par ou un examinateur externe devrait commencer.',
    summary: [
      {
        label: 'Responsable humain',
        value: PUBLIC_ASSURANCE_META.accountableHuman,
        body: 'La decision finale de publication et les limites de revendication restent sous controle humain nomme.'
      },
      {
        label: 'Derniere revue',
        value: PUBLIC_ASSURANCE_META.reviewedOnLabelFr,
        body: 'La portee de surface, les limites de route et la posture de divulgation ont ete revues a cette date.'
      },
      {
        label: 'Prochaine revue',
        value: PUBLIC_ASSURANCE_META.nextReviewDueLabelFr,
        body: 'Revoir plus tot si les revendications, routes ou expositions changent de facon materielle.'
      }
    ],
    supportedTitle: 'Lectures soutenues',
    supported: [
      'PHAROS decrit publiquement ses services, sa methode et ses parcours de revue.',
      'Le site identifie responsable, dates de revue et references de transparence.',
      'L outil de preparation est une calibration, pas une certification ni un avis juridique.',
      'Une assurance propre a un deploiement exige une revue humaine cadree au-dela du texte public.'
    ],
    limitsTitle: 'Limites dures et non-revendications',
    limits: [
      'Ce site ne constitue pas un avis juridique.',
      'Ce site n est ni une opinion d audit ni un depot reglementaire.',
      'Le texte du site ne prouve pas a lui seul la conformite d un deploiement.',
      'La redaction assistee par IA ne transforme jamais une affirmation non soutenue en fait soutenu.'
    ],
    reviewTitle: 'Par ou commencer une revue',
    reviewSteps: [
      'Verifier d abord le registre de transparence pour responsable, dates, portee et alias.',
      'Lire methodes et references pour inspecter logique de controle et sources citees.',
      'Utiliser FAQ et outil de preparation pour evaluer limites et posture probante.',
      'Demander une revue humaine cadree pour la preuve propre au deploiement.'
    ],
    routesTitle: 'Routes publiques par fonction',
    routes: [
      {
        to: '/methods',
        title: 'Methodes',
        body: 'Logique conceptuelle et operationnelle de la gouvernance deterministe.'
      },
      {
        to: '/library',
        title: 'Bibliotheque',
        body: 'Normes, droit et references utiles en contexte de revue.'
      },
      {
        to: '/faq',
        title: 'FAQ',
        body: 'Reponses bornees aux questions de scrutiny recurrentes.'
      },
      {
        to: '/tool',
        title: 'Outil de preparation',
        body: 'Signal de calibration rapide avant engagement approfondi.'
      },
      {
        to: '/contact',
        title: 'Contact',
        body: 'Escalader vers une revue humaine cadree quand les details comptent.'
      }
    ],
    disclosureTitle: 'Divulgation et metadonnees',
    disclosureBody:
      'L IA generative peut assister la redaction et la revision. Le choix des sources, les limites de revendication, les dates de revue et les decisions de publication restent humains.',
    disclosureRows: [
      ['Version de surface publique', PUBLIC_ASSURANCE_META.publicSurfaceVersion],
      ['URL canonique', PUBLIC_ASSURANCE_META.canonicalUrl],
      ['Localisation responsable', PUBLIC_ASSURANCE_META.accountableLocation],
      ['Racine juridictionnelle', PUBLIC_ASSURANCE_META.jurisdictionalRoot]
    ],
    transparencyAction: 'Ouvrir le JSON de transparence',
    ctaTitle: 'Besoin de preuve propre a un deploiement?',
    ctaBody: 'Passez de la posture publique a une revue cadree. PHAROS peut fournir une discussion bornee et orientee revue pour les systemes critiques.',
    ctaPrimary: 'Reserver une revue',
    ctaSecondary: 'Lire la methode'
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
              <Link key={route.to} to={route.to} className={`surface reveal-up delay-${Math.min(index, 3)}`}>
                <h3>{route.title}</h3>
                <p className="body-sm" style={{ marginTop: '0.5rem' }}>{route.body}</p>
              </Link>
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
              <Link className="btn-primary" to="/contact">
                {copy.ctaPrimary}
                <ArrowRight size={14} />
              </Link>
              <Link className="btn-secondary" to="/methods">
                {copy.ctaSecondary}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Assurance;
