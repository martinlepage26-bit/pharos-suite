import LocalizedLink from '../components/LocalizedLink';
import { ArrowRight, FileCheck2, Scale, ShieldAlert } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const COPY = {
  en: {
    eyebrow: 'Terms',
    title: 'Terms for using the PHAROS public website',
    body:
      'These terms define the public website boundary, non-claims, and expected use conditions for PHAROS content, tools, and contact routes.',
    updated: 'Last updated March 25, 2026',
    highlights: [
      {
        icon: Scale,
        title: 'Informational boundary',
        body: 'Public website material is informational and does not replace legal, audit, or regulatory decisions.'
      },
      {
        icon: FileCheck2,
        title: 'Readiness non-certification',
        body: 'Readiness outputs are calibration signals only and are not certificates, legal opinions, or compliance determinations.'
      },
      {
        icon: ShieldAlert,
        title: 'Scoped-review requirement',
        body: 'Deployment-specific assurance requires a separate human-scoped review and evidence evaluation.'
      }
    ],
    sections: [
      {
        title: 'Use of website content',
        points: [
          'You may read and reference public PHAROS content for internal planning and governance understanding.',
          'Do not misrepresent website text as PHAROS certification, legal advice, audit opinion, or regulator approval.',
          'Website references to standards and laws are contextual guidance, not jurisdiction-specific legal determinations.'
        ]
      },
      {
        title: 'Tool and intake boundaries',
        points: [
          'Public assessment and intake routes are provided for scoping and early calibration.',
          'Outputs should be reviewed by accountable humans before operational or legal decisions are made.',
          'Do not upload unlawful, abusive, or unauthorized data through public forms.'
        ]
      },
      {
        title: 'Links and external sources',
        points: [
          'PHAROS may reference external standards, policy texts, and research sources for context.',
          'External websites are governed by their own terms and privacy practices.',
          'Public references do not imply endorsement of every external claim or interpretation.'
        ]
      },
      {
        title: 'Changes and updates',
        points: [
          'PHAROS may update website content, route structure, and terms as services evolve.',
          'Material claim or boundary changes should be reflected in assurance and transparency records.',
          'Continued website use after updates constitutes acceptance of the current terms.'
        ]
      }
    ],
    ctaTitle: 'Need terms aligned to a specific deployment context?',
    ctaBody:
      'When a buyer, auditor, or regulator needs deployment-level evidence, use a scoped review so claims, thresholds, and records stay bounded and explicit.',
    ctaPrimary: 'Book scoped review',
    ctaSecondary: 'Read assurance'
  },
  fr: {
    eyebrow: 'Conditions',
    title: 'Conditions d utilisation du site public PHAROS',
    body:
      'Ces conditions definissent la frontiere du site public, les non-revendications et les conditions d usage attendues pour le contenu, les outils et les routes de contact PHAROS.',
    updated: 'Derniere mise a jour 25 mars 2026',
    highlights: [
      {
        icon: Scale,
        title: 'Frontiere informationnelle',
        body: 'Le contenu public est informatif et ne remplace pas les decisions juridiques, d audit ou reglementaires.'
      },
      {
        icon: FileCheck2,
        title: 'Non-certification',
        body: 'Les sorties de preparation sont des signaux de calibration et non des certificats, avis juridiques ou determinations de conformite.'
      },
      {
        icon: ShieldAlert,
        title: 'Revue cadree requise',
        body: 'Une assurance propre a un deploiement exige une revue humaine distincte et une evaluation de preuve.'
      }
    ],
    sections: [
      {
        title: 'Usage du contenu du site',
        points: [
          'Vous pouvez consulter et citer le contenu public PHAROS pour la planification interne et la comprehension de gouvernance.',
          'Ne presentez pas le texte du site comme certification PHAROS, avis juridique, opinion d audit ou approbation reglementaire.',
          'Les references a des normes et lois servent de contexte et non de determination juridique propre a une juridiction.'
        ]
      },
      {
        title: 'Limites des outils et de l intake',
        points: [
          'Les routes publiques d evaluation et d intake servent au cadrage initial et a la calibration.',
          'Les resultats doivent etre revus par des responsables humains avant toute decision operationnelle ou juridique.',
          'Ne televersez pas de donnees illicites, abusives ou non autorisees via les formulaires publics.'
        ]
      },
      {
        title: 'Liens et sources externes',
        points: [
          'PHAROS peut referencer des normes, textes de politique et sources de recherche externes.',
          'Les sites externes sont regis par leurs propres conditions et politiques de confidentialite.',
          'Une reference publique ne signifie pas approbation de chaque revendication externe.'
        ]
      },
      {
        title: 'Modifications et mises a jour',
        points: [
          'PHAROS peut mettre a jour le contenu, les routes et les conditions du site selon l evolution des services.',
          'Les changements materiels de limites ou revendications doivent apparaitre dans les registres d assurance et de transparence.',
          'L usage continu du site apres mise a jour constitue acceptation des conditions courantes.'
        ]
      }
    ],
    ctaTitle: 'Besoin de conditions alignees sur un contexte de deploiement precis?',
    ctaBody:
      'Quand un acheteur, auditeur ou regulateur exige une preuve de niveau deploiement, utilisez une revue cadree pour garder revendications, seuils et dossiers explicites.',
    ctaPrimary: 'Reserver une revue',
    ctaSecondary: 'Lire assurance'
  }
};

const Terms = () => {
  const { language } = useLanguage();
  const copy = COPY[language];

  return (
    <div data-testid="terms-page">
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
          <h2>{copy.ctaTitle}</h2>
          <p className="body-lead" style={{ marginTop: '0.65rem' }}>{copy.ctaBody}</p>
          <div className="btn-row" style={{ marginTop: '1rem' }}>
            <LocalizedLink className="btn-primary" to="/contact">
              {copy.ctaPrimary}
              <ArrowRight size={14} />
            </LocalizedLink>
            <LocalizedLink className="btn-secondary" to="/assurance">
              {copy.ctaSecondary}
            </LocalizedLink>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Terms;
