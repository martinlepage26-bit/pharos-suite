import LocalizedLink from '../components/LocalizedLink';
import { ArrowRight, Building2, FileCheck2, ShieldCheck, Waypoints } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const COPY = {
  en: {
    eyebrow: 'Review contexts',
    title: 'Representative governance contexts under scrutiny',
    body:
      'PHAROS does not publish client-identifying case narratives on the public site. This page shows the recurring pressure patterns and outputs teams usually need.',
    sectorsTitle: 'Where review pressure shows up',
    sectors: [
      {
        id: 'regulated',
        title: 'Regulated operations',
        body: 'Financial, healthcare, and public-interest environments with formal oversight requirements.',
        pressure: 'Evidence traceability and threshold discipline under external review.'
      },
      {
        id: 'enterprise-saas',
        title: 'Enterprise AI products',
        body: 'Teams shipping AI features into customer-facing platforms and procurement-heavy sales cycles.',
        pressure: 'Questionnaires, security reviews, and repeated trust due diligence.'
      },
      {
        id: 'public-sector',
        title: 'Public sector and institutional systems',
        body: 'Programs facing accountability requirements around explainability, escalation, and record integrity.',
        pressure: 'Governance clarity before broad deployment or policy exposure.'
      }
    ],
    scenariosTitle: 'Typical engagement scenarios',
    scenarios: [
      {
        id: 'baseline-build',
        title: 'Deterministic baseline build',
        situation: 'Governance exists informally but cannot yet support procurement or audit review.',
        outputs: [
          'Named decision-rights matrix',
          'Threshold and escalation model',
          'Review packet structure for recurring scrutiny'
        ]
      },
      {
        id: 'pre-launch',
        title: 'Pre-launch pressure test',
        situation: 'A launch or onboarding milestone increases consequence if controls fail.',
        outputs: [
          'Failure-mode mapping across system and vendor dependencies',
          'Go / no-go conditions linked to evidence requirements',
          'Clear owners for unresolved gaps before release'
        ]
      },
      {
        id: 'post-incident',
        title: 'Post-incident correction path',
        situation: 'An incident, failed review, or control drift requires reconstruction and remediation.',
        outputs: [
          'Event and decision-path reconstruction',
          'Control-gap register with priority sequencing',
          'Updated thresholds and follow-through cadence'
        ]
      }
    ],
    noteTitle: 'Why no public client dossier claims?',
    noteBody:
      'Public trust improves when website language stays proportional. Deployment-specific claims belong in scoped review artifacts, not on a general marketing surface.',
    ctaTitle: 'Have a specific scenario that needs bounded review?',
    ctaBody: 'Book a short review to map your pressure source and define the right deterministic route.',
    ctaPrimary: 'Book review',
    ctaSecondary: 'View service routes',
    outputsLabel: 'Typical outputs'
  },
  fr: {
    eyebrow: 'Contextes de revue',
    title: 'Contextes representatifs de gouvernance sous scrutiny',
    body:
      'PHAROS ne publie pas de dossiers clients identifiables sur la surface publique. Cette page montre les patterns de pression recurrents et les sorties habituellement necessaires.',
    sectorsTitle: 'Ou la pression de revue apparait',
    sectors: [
      {
        id: 'regulated',
        title: 'Operations reglementees',
        body: 'Secteurs financiers, sante, et environnements a forte supervision formelle.',
        pressure: 'Traçabilite de preuve et discipline des seuils sous revue externe.'
      },
      {
        id: 'enterprise-saas',
        title: 'Produits IA enterprise',
        body: 'Equipes qui livrent des fonctions IA dans des plateformes exposees a l achat enterprise.',
        pressure: 'Questionnaires, revues securite, et diligence de confiance repetee.'
      },
      {
        id: 'public-sector',
        title: 'Secteur public et institutions',
        body: 'Programmes soumis a des exigences de responsabilite, escalation et integrite des traces.',
        pressure: 'Clarte de gouvernance avant deploiement large ou exposition politique.'
      }
    ],
    scenariosTitle: 'Scenarios de mandat typiques',
    scenarios: [
      {
        id: 'baseline-build',
        title: 'Construction d une base deterministe',
        situation: 'La gouvernance existe de facon informelle mais ne soutient pas encore la revue achat ou audit.',
        outputs: [
          'Matrice des droits de decision nommes',
          'Modele de seuils et d escalation',
          'Structure de dossier pour scrutiny recurrent'
        ]
      },
      {
        id: 'pre-launch',
        title: 'Test pre-lancement',
        situation: 'Un lancement ou une integration augmente fortement les consequences d un echec de controle.',
        outputs: [
          'Cartographie des modes d echec systeme et fournisseur',
          'Conditions go / no-go liees a la preuve',
          'Responsables explicites des ecarts avant diffusion'
        ]
      },
      {
        id: 'post-incident',
        title: 'Parcours post-incident',
        situation: 'Un incident, une revue ratee ou une derive de controle exige reconstruction et remediation.',
        outputs: [
          'Reconstruction de l evenement et du parcours decisionnel',
          'Registre des ecarts de controle avec priorites',
          'Mise a jour des seuils et cadence de suivi'
        ]
      }
    ],
    noteTitle: 'Pourquoi ne pas publier des dossiers clients publics?',
    noteBody:
      'La confiance publique augmente quand le langage du site reste proportionne. Les revendications propres au deploiement doivent rester dans des artefacts de revue cadres.',
    ctaTitle: 'Vous avez un scenario specifique a revoir?',
    ctaBody: 'Reservez une revue courte pour cartographier la source de pression et choisir le bon parcours deterministe.',
    ctaPrimary: 'Reserver une revue',
    ctaSecondary: 'Voir les services',
    outputsLabel: 'Sorties typiques'
  }
};

const Cases = () => {
  const { language } = useLanguage();
  const copy = COPY[language];

  return (
    <div data-testid="cases-page">
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
            <h2>{copy.sectorsTitle}</h2>
          </div>
          <div className="grid-3">
            {copy.sectors.map((sector, index) => (
              <article
                key={sector.id}
                className={`surface reveal-up delay-${Math.min(index, 3)}`}
                data-testid={`sector-card-${sector.id}`}
              >
                <span className="icon-pill" aria-hidden="true">
                  <Building2 size={16} />
                </span>
                <h3 className="surface-title" style={{ marginTop: '0.7rem' }}>{sector.title}</h3>
                <p className="body-sm">{sector.body}</p>
                <p className="body-sm" style={{ marginTop: '0.6rem' }}><strong>{sector.pressure}</strong></p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-tight">
        <div className="container">
          <div className="section-header reveal-up">
            <h2>{copy.scenariosTitle}</h2>
          </div>
          <div className="grid-3">
            {copy.scenarios.map((scenario, index) => (
              <article
                key={scenario.id}
                className={`surface reveal-up delay-${Math.min(index, 3)}`}
                data-testid={`case-${scenario.id}`}
              >
                <span className="icon-pill" aria-hidden="true">
                  {index === 0 ? <ShieldCheck size={16} /> : index === 1 ? <Waypoints size={16} /> : <FileCheck2 size={16} />}
                </span>
                <h3 className="surface-title" style={{ marginTop: '0.7rem' }}>{scenario.title}</h3>
                <p className="body-sm">{scenario.situation}</p>
                <p className="kicker" style={{ marginTop: '0.8rem' }}>{copy.outputsLabel}</p>
                <ul className="check-list" style={{ marginTop: '0.5rem' }}>
                  {scenario.outputs.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-tight">
        <div className="container">
          <div className="surface surface-muted reveal-up">
            <h2>{copy.noteTitle}</h2>
            <p className="body-lead" style={{ marginTop: '0.65rem' }}>{copy.noteBody}</p>
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
              <LocalizedLink className="btn-secondary" to="/services">
                {copy.ctaSecondary}
              </LocalizedLink>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Cases;
