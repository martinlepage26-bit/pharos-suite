import LocalizedLink from '../components/LocalizedLink';
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
    eyebrow: 'Confidentialité',
    title: 'Politique de confidentialité du site public PHAROS',
    body:
      'Cette politique explique comment les routes publiques de PHAROS traitent la télémétrie analytique, les prises de contact et le suivi humain des demandes de revue.',
    updated: 'Dernière mise à jour : 25 mars 2026',
    highlights: [
      {
        icon: Database,
        title: 'Télémétrie technique',
        body: 'Des signaux d’usage et de fiabilité peuvent être recueillis pour améliorer la stabilité du site et la clarté du contenu.'
      },
      {
        icon: MailCheck,
        title: 'Demandes de contact',
        body: 'Les renseignements transmis au moyen des formulaires publics servent à répondre aux demandes et à coordonner les appels de revue.'
      },
      {
        icon: ShieldCheck,
        title: 'Discipline de périmètre',
        body: 'Les formulaires publics ne sont pas conçus pour des dossiers réglementés sensibles ni pour des données confidentielles de tiers.'
      }
    ],
    sections: [
      {
        title: 'Renseignements pouvant être recueillis',
        points: [
          'Données analytiques de base et diagnostics techniques générés lors des visites du site.',
          'Coordonnées de contact et contexte de planification transmis au moyen des formulaires.',
          'Messages, notes de portée et éléments de suivi transmis par courriel à PHAROS.'
        ]
      },
      {
        title: 'Utilisation des informations',
        points: [
          'Répondre aux demandes et préparer les discussions de cadrage de gouvernance.',
          'Exploiter, sécuriser et améliorer la performance du site public.',
          'Maintenir un dossier borné des demandes de revue et des suivis de communication.'
        ]
      },
      {
        title: 'Conservation et traitement',
        points: [
          'Les données sont conservées uniquement pour les besoins de communication, de livraison et de tenue de dossiers opérationnels.',
          'Les dossiers liés au site public sont traités sous revue humaine responsable et selon des contrôles de limites d’allégation.',
          'Aucune phrase du site public ne doit être interprétée comme un avis juridique ou un dépôt réglementaire.'
        ]
      },
      {
        title: 'Vos choix',
        points: [
          `Vous pouvez demander la correction ou la suppression de vos coordonnées en écrivant à ${PUBLIC_ASSURANCE_META.contactEmail}.`,
          'Ne soumettez pas de dossiers médicaux, d’identifiants financiers ou d’autres données hautement sensibles au moyen des formulaires publics.',
          'Si la demande exige une preuve propre à un déploiement, utilisez plutôt un canal de revue humaine encadré.'
        ]
      }
    ],
    contactTitle: 'Demandes et questions liées à la confidentialité',
    contactBody:
      'Pour toute demande de correction, de suppression ou de traitement liée à ce site public, communiquez avec PHAROS en indiquant la route ou le formulaire utilisé.',
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
            <LocalizedLink className="btn-primary" to="/contact">
              {copy.contactCta}
              <ArrowRight size={14} />
            </LocalizedLink>
            <LocalizedLink className="btn-secondary" to="/terms">
              {copy.termsCta}
            </LocalizedLink>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Privacy;
