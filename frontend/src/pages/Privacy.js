import { Link } from 'react-router-dom';
import { ArrowRight, Database, MailCheck, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { PUBLIC_ASSURANCE_META } from '../data/publicAssurance';

const COPY = {
  en: {
    eyebrow: 'Privacy',
    title: 'Privacy policy for the PHAROS public website',
    body:
      'This policy explains how public PHAROS routes handle analytics telemetry, contact submissions, and human follow-up for review requests.',
    updated: 'Last updated March 25, 2026',
    highlights: [
      {
        icon: Database,
        title: 'Technical telemetry',
        body: 'Usage and reliability signals may be captured to improve website stability and content clarity.'
      },
      {
        icon: MailCheck,
        title: 'Contact submissions',
        body: 'Details submitted through public forms are used to respond to requests and coordinate review calls.'
      },
      {
        icon: ShieldCheck,
        title: 'Boundary discipline',
        body: 'Public forms are not designed for sensitive regulated records or confidential third-party datasets.'
      }
    ],
    sections: [
      {
        title: 'Information that may be collected',
        points: [
          'Basic analytics and technical diagnostics generated during site visits.',
          'Contact details and scheduling context submitted through booking or intake forms.',
          'Messages, scope notes, and follow-up details sent by email to PHAROS.'
        ]
      },
      {
        title: 'How information is used',
        points: [
          'To respond to inbound requests and prepare governance scoping discussions.',
          'To operate, secure, and improve public website performance.',
          'To maintain a bounded record of review requests and follow-up communication.'
        ]
      },
      {
        title: 'Retention and handling',
        points: [
          'Data is retained only as needed for communication, delivery, and operational records.',
          'Public website records are handled under accountable human review and claim-boundary controls.',
          'No public website statement should be interpreted as legal advice or regulatory filing.'
        ]
      },
      {
        title: 'Your choices',
        points: [
          `You may request correction or deletion of contact records by emailing ${PUBLIC_ASSURANCE_META.contactEmail}.`,
          'Do not submit health records, financial account identifiers, or other high-sensitivity data through public forms.',
          'If a request requires deployment-specific evidence, move to a scoped human review channel.'
        ]
      }
    ],
    contactTitle: 'Privacy requests and questions',
    contactBody:
      'For correction, deletion, or handling questions tied to this public site, contact PHAROS directly and include the route or form used.',
    contactCta: 'Contact PHAROS',
    termsCta: 'Read terms'
  },
  fr: {
    eyebrow: 'Confidentialite',
    title: 'Politique de confidentialite du site public PHAROS',
    body:
      'Cette politique explique comment les routes publiques PHAROS traitent la telemetrie analytique, les soumissions de contact et le suivi humain des demandes de revue.',
    updated: 'Derniere mise a jour 25 mars 2026',
    highlights: [
      {
        icon: Database,
        title: 'Telemetrie technique',
        body: 'Des signaux d usage et de fiabilite peuvent etre captes pour ameliorer la stabilite du site et la clarte du contenu.'
      },
      {
        icon: MailCheck,
        title: 'Soumissions de contact',
        body: 'Les details soumis via les formulaires publics servent a repondre aux demandes et coordonner les appels de revue.'
      },
      {
        icon: ShieldCheck,
        title: 'Discipline de frontiere',
        body: 'Les formulaires publics ne sont pas concus pour des dossiers reglementes sensibles ni des donnees confidentielles de tiers.'
      }
    ],
    sections: [
      {
        title: 'Informations pouvant etre collecte',
        points: [
          'Analytique de base et diagnostics techniques generes lors des visites du site.',
          'Coordonnees de contact et contexte de planification soumis via les formulaires.',
          'Messages, notes de portee et suivi transmis par courriel a PHAROS.'
        ]
      },
      {
        title: 'Utilisation des informations',
        points: [
          'Repondre aux demandes et preparer les discussions de cadrage de gouvernance.',
          'Exploiter, securiser et ameliorer la performance du site public.',
          'Maintenir un dossier borne des demandes de revue et des suivis de communication.'
        ]
      },
      {
        title: 'Retention et traitement',
        points: [
          'Les donnees sont conservees seulement selon les besoins de communication, de livraison et de dossiers operationnels.',
          'Les dossiers du site public sont traites sous revue humaine responsable et controles de limites de revendication.',
          'Aucune phrase du site public ne doit etre interpretee comme un avis juridique ou un depot reglementaire.'
        ]
      },
      {
        title: 'Vos choix',
        points: [
          `Vous pouvez demander correction ou suppression des coordonnees en ecrivant a ${PUBLIC_ASSURANCE_META.contactEmail}.`,
          'Ne soumettez pas de dossiers medicaux, identifiants financiers ou autres donnees a haute sensibilite via les formulaires publics.',
          'Si la demande exige une preuve propre a un deploiement, utilisez un canal de revue humaine cadree.'
        ]
      }
    ],
    contactTitle: 'Demandes et questions de confidentialite',
    contactBody:
      'Pour une demande de correction, suppression ou traitement liee a ce site public, contactez PHAROS et indiquez la route ou le formulaire utilise.',
    contactCta: 'Contacter PHAROS',
    termsCta: 'Lire les conditions'
  }
};

const Privacy = () => {
  const { language } = useLanguage();
  const copy = COPY[language];

  return (
    <div data-testid="privacy-page">
      <section className="section">
        <div className="container section-shell reveal-up">
          <p className="kicker">{copy.eyebrow}</p>
          <h1 style={{ marginTop: '0.7rem' }}>{copy.title}</h1>
          <p className="body-lead" style={{ marginTop: '0.8rem' }}>{copy.body}</p>
          <div className="badge-row" style={{ marginTop: '0.9rem' }}>
            <span className="badge-chip">{copy.updated}</span>
          </div>
        </div>
      </section>

      <section className="section section-tight">
        <div className="container grid-3">
          {copy.highlights.map((item, index) => (
            <article className={`surface reveal-up delay-${Math.min(index, 3)}`} key={item.title}>
              <span className="icon-pill" aria-hidden="true">
                <item.icon size={16} />
              </span>
              <h2 style={{ fontSize: '1.2rem', marginTop: '0.7rem' }}>{item.title}</h2>
              <p style={{ marginTop: '0.45rem' }}>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section section-tight">
        <div className="container grid-2" style={{ alignItems: 'start' }}>
          {copy.sections.map((section, index) => (
            <article className={`surface reveal-up delay-${Math.min(index, 3)}`} key={section.title}>
              <h2 style={{ fontSize: '1.22rem' }}>{section.title}</h2>
              <ul className="check-list" style={{ marginTop: '0.75rem' }}>
                {section.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="section section-tight">
        <div className="container final-cta reveal-up">
          <h2>{copy.contactTitle}</h2>
          <p className="body-lead" style={{ marginTop: '0.65rem' }}>{copy.contactBody}</p>
          <div className="btn-row" style={{ marginTop: '1rem' }}>
            <Link className="btn-primary" to="/contact">
              {copy.contactCta}
              <ArrowRight size={14} />
            </Link>
            <Link className="btn-secondary" to="/terms">
              {copy.termsCta}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Privacy;
