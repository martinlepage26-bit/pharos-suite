import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Clock3,
  FileCheck2,
  FolderSearch,
  Radar,
  Scale,
  ShieldCheck,
  Waypoints
} from 'lucide-react';
import SignalStrip from '../components/SignalStrip';
import { useLanguage } from '../context/LanguageContext';
import { PUBLIC_ASSURANCE_META } from '../data/publicAssurance';

const ASSURANCE_COPY = {
  en: {
    eyebrow: 'Public assurance',
    title: 'A bounded public assurance surface for PHAROS',
    body: 'This page is the audit-start surface for the PHAROS website. It states what the public site covers, what it does not claim, who is accountable, when the surface was reviewed, and where a reviewer should look next.',
    summary: [
      {
        label: 'Accountable human',
        title: PUBLIC_ASSURANCE_META.accountableHuman,
        description: 'Human review, claim boundaries, and final publication judgment stay under named human control.'
      },
      {
        label: 'Current review',
        title: PUBLIC_ASSURANCE_META.reviewedOnLabelEn,
        description: 'The public surface was reviewed for boundary clarity, public routing, and disclosure signals on this date.'
      },
      {
        label: 'Next review due',
        title: PUBLIC_ASSURANCE_META.nextReviewDueLabelEn,
        description: 'The surface should be reviewed sooner if claims, routes, or public product posture change materially.'
      }
    ],
    boundaryLabel: 'Current posture',
    boundaryTitle: 'What this public surface is designed to make legible',
    boundaryBody: 'The website is meant to help procurement, audit, and oversight readers understand PHAROS without turning website copy into an implied certification packet.',
    boundaryCards: [
      {
        icon: ShieldCheck,
        title: 'Named accountability',
        body: 'The site names an accountable human reviewer instead of treating the website as anonymous marketing output.'
      },
      {
        icon: Scale,
        title: 'Bounded public claims',
        body: 'The surface describes services, methods, and review posture. It does not claim that client deployments are compliant by default.'
      },
      {
        icon: Clock3,
        title: 'Review cadence',
        body: 'The surface carries explicit review dates so readers can tell whether they are looking at a current or stale public posture.'
      },
      {
        icon: Waypoints,
        title: 'Boundary discipline',
        body: 'Routes outside the current PHAROS public surface stay closed rather than being left half-live with ambiguous status.'
      }
    ],
    controlsLabel: 'Auditability controls',
    controlsTitle: 'How the public assurance surface stays reviewable',
    controlsBody: 'Auditability improves when the website carries explicit control logic, not only polished language. These controls make the public surface easier to inspect and harder to overread.',
    controlsCards: [
      {
        icon: FileCheck2,
        title: 'Machine-readable transparency record',
        body: 'The JSON record carries owner, dates, public-route inventory, aliases, and claim boundaries in a retrievable format.'
      },
      {
        icon: FolderSearch,
        title: 'Evidence ladder',
        body: 'Reviewers can move from record to methods, library, FAQ, tool, and human escalation without guessing the order.'
      },
      {
        icon: Scale,
        title: 'Explicit public non-claims',
        body: 'The site stays clear about what it is not: legal advice, certification, or deployment-specific proof.'
      },
      {
        icon: Radar,
        title: 'Named review triggers',
        body: 'Material changes to claims, routes, domains, or public product posture should trigger a fresh review of the assurance surface.'
      }
    ],
    claimsLabel: 'Claim boundary',
    claimsTitle: 'What the site supports now, and what it does not support',
    claimsBody: 'This distinction matters because a polished website can otherwise sound more certain than the evidence underneath it.',
    supportsTitle: 'Supported public readings',
    supports: [
      'PHAROS provides public descriptions of its services, methods, and review posture.',
      'The site discloses accountable human review, public claim boundaries, and review dates.',
      'The readiness tool is a calibration aid. It is not a certification, legal determination, or audit opinion.',
      'AurorA and CompassAI remain under the PHAROS surface until their hosting, lineage, and review paths are ready for standalone public presentation.'
    ],
    limitsTitle: 'Non-claims and hard limits',
    limits: [
      'This site is not legal advice and should not be treated as one.',
      'This site is not a certification packet, regulator filing, or third-party audit opinion.',
      'Public website copy does not by itself prove that a client deployment is compliant.',
      'AI-assisted drafting does not upgrade an unsupported claim into a supported claim.'
    ],
    reviewLabel: 'How to review',
    reviewTitle: 'Where an external reviewer should start',
    reviewBody: 'A reviewer should not have to infer the control posture from branding alone. These are the shortest useful starting points.',
    reviewSteps: [
      {
        icon: FileCheck2,
        title: 'Start with the transparency record',
        body: 'Use the machine-readable record for owner, dates, scope boundaries, and route inventory before reading interpretive pages.'
      },
      {
        icon: FolderSearch,
        title: 'Read the method and references',
        body: 'Use Methods for control logic and Library for the external references that underpin the public framing.'
      },
      {
        icon: Radar,
        title: 'Check the bounded answers',
        body: 'Use FAQ and the readiness tool to see where PHAROS is careful about non-claims, provisional status, and evidence gaps.'
      },
      {
        icon: Waypoints,
        title: 'Escalate to a human for specifics',
        body: 'If a review needs deployment-specific evidence, request a redacted packet or scoped discussion rather than treating website copy as sufficient proof.'
      }
    ],
    recordEyebrow: 'Machine-readable record',
    recordTitle: 'Public transparency record',
    recordBody: 'The JSON record carries the current owner, accountable location, canonical domain, review dates, alias routes, auditability controls, and change history in a form reviewers can retrieve directly.',
    openRecord: 'Open transparency JSON',
    evidenceLabel: 'Evidence surfaces',
    evidenceTitle: 'Public routes that do different governance work',
    evidenceBody: 'These routes are not interchangeable. Each one exists so a reviewer can locate the right layer of evidence or explanation quickly.',
    evidenceCards: [
      {
        title: 'Methods',
        body: 'Shows the conceptual method, control extraction logic, and reconstructibility posture.',
        to: '/methods'
      },
      {
        title: 'Library',
        body: 'Collects public frameworks, law, and documentation references that reviewers recognize.',
        to: '/library'
      },
      {
        title: 'FAQ',
        body: 'Answers the recurring scrutiny questions in bounded language instead of expanding the claims surface.',
        to: '/faq'
      },
      {
        title: 'Tool',
        body: 'Provides a non-certifying readiness snapshot so the first signal stays narrower than a formal assessment.',
        to: '/tool'
      },
      {
        title: 'Contact',
        body: 'Moves a reviewer from public surface reading to a scoped human discussion when deployment-specific evidence is required.',
        to: '/contact'
      }
    ],
    disclosureLabel: 'Disclosure',
    disclosureTitle: 'Human control, AI assistance, and review triggers',
    disclosureBody: 'Generative AI may be used for structural drafting and language revision on this public site. It is not treated as an evidentiary authority. Source selection, claim boundaries, review dates, and final publication judgment remain under human control.',
    disclosurePoints: [
      {
        label: 'Public surface version',
        value: PUBLIC_ASSURANCE_META.publicSurfaceVersion
      },
      {
        label: 'Reviewed on',
        value: PUBLIC_ASSURANCE_META.reviewedOnLabelEn
      },
      {
        label: 'Next review due',
        value: PUBLIC_ASSURANCE_META.nextReviewDueLabelEn
      },
      {
        label: 'Canonical URL',
        value: PUBLIC_ASSURANCE_META.canonicalUrl
      },
      {
        label: 'Accountable location',
        value: PUBLIC_ASSURANCE_META.accountableLocation
      },
      {
        label: 'Jurisdictional root',
        value: PUBLIC_ASSURANCE_META.jurisdictionalRoot
      }
    ],
    triggerTitle: 'Review this surface again when any of these change',
    triggers: [
      'A material public claim changes.',
      'A route opens, closes, or changes boundary status.',
      'A product surface moves from internal or bounded status to public standalone presentation.',
      'A domain, canonical URL, or machine-readable public record changes.'
    ],
    ctaTitle: 'Need a redacted packet or a deployment-specific discussion?',
    ctaBody: 'The website can show public posture and claim discipline. When a reviewer needs system-specific evidence, the next step should be a scoped human exchange.',
    ctaPrimary: 'Book a review',
    ctaSecondary: 'View methods'
  },
  fr: {
    eyebrow: 'Assurance publique',
    title: 'Une surface publique bornee d assurance pour PHAROS',
    body: 'Cette page est le point de depart d audit pour le site PHAROS. Elle indique ce que la surface publique couvre, ce qu elle ne revendique pas, qui est responsable, quand la surface a ete revue, et ou un examinateur devrait regarder ensuite.',
    summary: [
      {
        label: 'Responsable humain',
        title: PUBLIC_ASSURANCE_META.accountableHuman,
        description: 'La revue humaine, les limites de revendication et la decision finale de publication restent sous controle humain nomme.'
      },
      {
        label: 'Revue actuelle',
        title: PUBLIC_ASSURANCE_META.reviewedOnLabelFr,
        description: 'La surface publique a ete revue pour la clarte des limites, les routes publiques et les signaux de divulgation a cette date.'
      },
      {
        label: 'Prochaine revue',
        title: PUBLIC_ASSURANCE_META.nextReviewDueLabelFr,
        description: 'La surface doit etre revue plus tot si les revendications, les routes ou la posture publique des produits changent de facon materielle.'
      }
    ],
    boundaryLabel: 'Posture actuelle',
    boundaryTitle: 'Ce que cette surface publique cherche a rendre lisible',
    boundaryBody: 'Le site aide les lecteurs en approvisionnement, audit et supervision a comprendre PHAROS sans transformer le texte du site en dossier implicite de certification.',
    boundaryCards: [
      {
        icon: ShieldCheck,
        title: 'Responsabilite nommee',
        body: 'Le site nomme un responsable humain plutot que de traiter le site comme une sortie marketing anonyme.'
      },
      {
        icon: Scale,
        title: 'Revendications bornees',
        body: 'La surface decrit les services, les methodes et la posture de revue. Elle ne pretend pas que les deploiements clients sont conformes par defaut.'
      },
      {
        icon: Clock3,
        title: 'Cadence de revue',
        body: 'La surface affiche des dates explicites afin qu un lecteur puisse voir si la posture publique est actuelle ou stale.'
      },
      {
        icon: Waypoints,
        title: 'Discipline de frontiere',
        body: 'Les routes hors de la surface publique actuelle de PHAROS restent fermees plutot que laissees a moitie actives avec un statut ambigu.'
      }
    ],
    controlsLabel: 'Controles d auditabilite',
    controlsTitle: 'Comment la surface publique d assurance reste verifiable',
    controlsBody: 'L auditabilite s ameliore lorsque le site porte une logique de controle explicite et pas seulement un langage soigne. Ces controles rendent la surface publique plus facile a inspecter et plus difficile a surevaluer.',
    controlsCards: [
      {
        icon: FileCheck2,
        title: 'Registre de transparence lisible par machine',
        body: 'Le JSON porte le responsable, les dates, l inventaire des routes publiques, les alias et les limites de revendication dans un format recuperable.'
      },
      {
        icon: FolderSearch,
        title: 'Echelle de preuve',
        body: 'Les reveurs peuvent passer du registre aux methodes, a la bibliotheque, a la FAQ, a l outil et a l escalation humaine sans deviner l ordre utile.'
      },
      {
        icon: Scale,
        title: 'Non-revendications explicites',
        body: 'Le site reste clair sur ce qu il n est pas: un avis juridique, une certification, ou une preuve propre a un deploiement.'
      },
      {
        icon: Radar,
        title: 'Declencheurs de revue nommes',
        body: 'Les changements materiels aux revendications, aux routes, aux domaines ou a la posture publique des produits doivent declencher une nouvelle revue de la surface d assurance.'
      }
    ],
    claimsLabel: 'Limite de revendication',
    claimsTitle: 'Ce que le site soutient maintenant, et ce qu il ne soutient pas',
    claimsBody: 'Cette distinction compte parce qu un site bien ecrit peut autrement sembler plus certain que la preuve sous-jacente.',
    supportsTitle: 'Lectures publiques soutenues',
    supports: [
      'PHAROS fournit des descriptions publiques de ses services, de sa methode et de sa posture de revue.',
      'Le site divulgue la revue humaine responsable, les limites de revendication publiques et les dates de revue.',
      'L outil de preparation est une aide de calibration. Ce n est ni une certification, ni une determination juridique, ni une opinion d audit.',
      'AurorA et CompassAI restent sous la surface PHAROS tant que leur hebergement, leur lignage et leurs parcours de revue ne sont pas prets pour une presentation publique autonome.'
    ],
    limitsTitle: 'Non-revendications et limites dures',
    limits: [
      'Ce site ne constitue pas un avis juridique et ne doit pas etre traite comme tel.',
      'Ce site n est ni un dossier de certification, ni un depot reglementaire, ni une opinion d audit tierce partie.',
      'Le texte public du site ne prouve pas a lui seul qu un deploiement client est conforme.',
      'La redaction assistee par IA ne transforme pas une revendication non soutenue en revendication soutenue.'
    ],
    reviewLabel: 'Comment revoir',
    reviewTitle: 'Par ou un examinateur externe devrait commencer',
    reviewBody: 'Un examinateur ne devrait pas avoir a deduire la posture de controle a partir du branding seul. Voici les points de depart les plus utiles.',
    reviewSteps: [
      {
        icon: FileCheck2,
        title: 'Commencer par le registre de transparence',
        body: 'Utilisez le registre lisible par machine pour le responsable, les dates, les limites de portee et l inventaire des routes avant de lire les pages interpretatives.'
      },
      {
        icon: FolderSearch,
        title: 'Lire la methode et les references',
        body: 'Utilisez Methodes pour la logique de controle et Bibliotheque pour les references externes qui soutiennent le cadrage public.'
      },
      {
        icon: Radar,
        title: 'Verifier les reponses bornees',
        body: 'Utilisez la FAQ et l outil pour voir ou PHAROS reste prudent sur les non-revendications, le statut provisoire et les ecarts de preuve.'
      },
      {
        icon: Waypoints,
        title: 'Passer a un humain pour les specifics',
        body: 'Si une revue demande une preuve propre au deploiement, demandez un dossier caviarde ou un echange cadre plutot que de traiter le site comme une preuve suffisante.'
      }
    ],
    recordEyebrow: 'Registre lisible par machine',
    recordTitle: 'Registre public de transparence',
    recordBody: 'Le fichier JSON contient le responsable actuel, le lieu responsable, le domaine canonique, les dates de revue, les routes alias, les controles d auditabilite et l historique de changement dans une forme recuperable directement.',
    openRecord: 'Ouvrir le JSON de transparence',
    evidenceLabel: 'Surfaces de preuve',
    evidenceTitle: 'Des routes publiques qui font un travail de gouvernance different',
    evidenceBody: 'Ces routes ne sont pas interchangeables. Chacune existe pour qu un examinateur trouve rapidement la bonne couche de preuve ou d explication.',
    evidenceCards: [
      {
        title: 'Methodes',
        body: 'Montre la methode conceptuelle, la logique d extraction de controle et la posture de reconstructibilite.',
        to: '/methods'
      },
      {
        title: 'Bibliotheque',
        body: 'Rassemble les cadres, lois et references documentaires publiques que les examinateurs reconnaissent.',
        to: '/library'
      },
      {
        title: 'FAQ',
        body: 'Repond aux questions recurrentes de revue dans un langage borne au lieu d elargir la surface de revendication.',
        to: '/faq'
      },
      {
        title: 'Outil',
        body: 'Fournit un instantane de preparation non certifiant afin que le premier signal reste plus etroit qu une evaluation formelle.',
        to: '/tool'
      },
      {
        title: 'Contact',
        body: 'Fait passer un examinateur de la lecture publique a un echange humain cadre quand une preuve propre au systeme est necessaire.',
        to: '/contact'
      }
    ],
    disclosureLabel: 'Divulgation',
    disclosureTitle: 'Controle humain, assistance IA et declencheurs de revue',
    disclosureBody: 'L IA generative peut etre utilisee pour la structuration de texte et la revision de langage sur ce site public. Elle n est pas traitee comme une autorite de preuve. La selection des sources, les limites de revendication, les dates de revue et le jugement final de publication restent sous controle humain.',
    disclosurePoints: [
      {
        label: 'Version de la surface publique',
        value: PUBLIC_ASSURANCE_META.publicSurfaceVersion
      },
      {
        label: 'Revu le',
        value: PUBLIC_ASSURANCE_META.reviewedOnLabelFr
      },
      {
        label: 'Prochaine revue',
        value: PUBLIC_ASSURANCE_META.nextReviewDueLabelFr
      },
      {
        label: 'URL canonique',
        value: PUBLIC_ASSURANCE_META.canonicalUrl
      },
      {
        label: 'Lieu responsable',
        value: PUBLIC_ASSURANCE_META.accountableLocation
      },
      {
        label: 'Ancrage juridictionnel',
        value: PUBLIC_ASSURANCE_META.jurisdictionalRoot
      }
    ],
    triggerTitle: 'Revoir cette surface a nouveau si un de ces elements change',
    triggers: [
      'Une revendication publique importante change.',
      'Une route ouvre, ferme ou change de statut de frontiere.',
      'Une surface produit passe d un statut interne ou borne a une presentation publique autonome.',
      'Un domaine, une URL canonique ou un registre public lisible par machine change.'
    ],
    ctaTitle: 'Besoin d un dossier caviarde ou d un echange propre a un deploiement?',
    ctaBody: 'Le site peut montrer la posture publique et la discipline de revendication. Quand un examinateur a besoin d une preuve specifique a un systeme, la prochaine etape doit etre un echange humain cadre.',
    ctaPrimary: 'Reserver une revue',
    ctaSecondary: 'Voir la methode'
  }
};

const Assurance = () => {
  const { language } = useLanguage();
  const copy = ASSURANCE_COPY[language];

  return (
    <div data-testid="assurance-page">
      <div className="page-hero">
        <div className="container">
          <div className="section-header">
            <p className="eyebrow">{copy.eyebrow}</p>
            <h1>{copy.title}</h1>
            <p className="body-lg" style={{ marginTop: '16px' }}>
              {copy.body}
            </p>
            <SignalStrip items={copy.summary} className="signal-grid-page" />
          </div>
        </div>
      </div>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-header reveal">
            <p className="eyebrow">{copy.boundaryLabel}</p>
            <h2>{copy.boundaryTitle}</h2>
            <p className="body-sm">{copy.boundaryBody}</p>
          </div>

          <div className="assurance-grid stagger">
            {copy.boundaryCards.map((item) => (
              <div key={item.title} className="card reveal">
                <div className="card-icon">
                  <item.icon />
                </div>
                <h3>{item.title}</h3>
                <p style={{ marginBottom: 0 }}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--color-bg-alt)' }}>
        <div className="container">
          <div className="section-header reveal">
            <p className="eyebrow">{copy.controlsLabel}</p>
            <h2>{copy.controlsTitle}</h2>
            <p className="body-sm">{copy.controlsBody}</p>
          </div>

          <div className="assurance-grid stagger">
            {copy.controlsCards.map((item) => (
              <div key={item.title} className="card reveal">
                <div className="card-icon">
                  <item.icon />
                </div>
                <h3>{item.title}</h3>
                <p style={{ marginBottom: 0 }}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header reveal">
            <p className="eyebrow">{copy.claimsLabel}</p>
            <h2>{copy.claimsTitle}</h2>
            <p className="body-sm">{copy.claimsBody}</p>
          </div>

          <div className="grid-2 stagger">
            <div className="editorial-panel reveal visible">
              <h3>{copy.supportsTitle}</h3>
              <ul className="assurance-list">
                {copy.supports.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="editorial-panel-dark reveal visible">
              <h3>{copy.limitsTitle}</h3>
              <ul className="assurance-list assurance-list-dark">
                {copy.limits.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header reveal">
            <p className="eyebrow">{copy.reviewLabel}</p>
            <h2>{copy.reviewTitle}</h2>
            <p className="body-sm">{copy.reviewBody}</p>
          </div>

          <div className="grid-2 stagger">
            {copy.reviewSteps.map((item) => (
              <div key={item.title} className="card reveal">
                <div className="card-icon">
                  <item.icon />
                </div>
                <h3>{item.title}</h3>
                <p style={{ marginBottom: 0 }}>{item.body}</p>
              </div>
            ))}
          </div>

          <div className="assurance-record-card editorial-panel reveal visible">
            <div>
              <p className="eyebrow" style={{ marginBottom: '12px' }}>{copy.recordEyebrow}</p>
              <h3>{copy.recordTitle}</h3>
              <p style={{ marginBottom: 0 }}>{copy.recordBody}</p>
            </div>
            <a
              href={PUBLIC_ASSURANCE_META.transparencyRecordPath}
              className="btn-outline"
              target="_blank"
              rel="noreferrer"
            >
              {copy.openRecord}
              <ArrowRight />
            </a>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--color-bg-alt)' }}>
        <div className="container">
          <div className="section-header reveal">
            <p className="eyebrow">{copy.evidenceLabel}</p>
            <h2>{copy.evidenceTitle}</h2>
            <p className="body-sm">{copy.evidenceBody}</p>
          </div>

          <div className="assurance-grid stagger">
            {copy.evidenceCards.map((item) => (
              <div key={item.title} className="card reveal">
                <div className="card-icon">
                  <FolderSearch />
                </div>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
                <Link to={item.to} className="card-link-row">
                  <span>{item.to}</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="editorial-panel reveal visible">
            <p className="eyebrow" style={{ marginBottom: '12px' }}>{copy.disclosureLabel}</p>
            <h2 style={{ marginBottom: '16px' }}>{copy.disclosureTitle}</h2>
            <p className="body-sm">{copy.disclosureBody}</p>

            <div className="assurance-meta-grid">
              {copy.disclosurePoints.map((item) => (
                <div key={item.label} className="assurance-meta-item">
                  <span className="assurance-meta-label">{item.label}</span>
                  <span className="assurance-meta-value">{item.value}</span>
                </div>
              ))}
            </div>

            <div className="divider" />

            <h3>{copy.triggerTitle}</h3>
            <ul className="assurance-list">
              {copy.triggers.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="cta-banner reveal" style={{ marginTop: '24px' }}>
            <h2>{copy.ctaTitle}</h2>
            <p className="body-sm">{copy.ctaBody}</p>
            <div className="btn-row">
              <Link to="/contact" className="btn-dark">
                {copy.ctaPrimary}
                <ArrowRight />
              </Link>
              <Link to="/methods" className="btn-outline">
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
