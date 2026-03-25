import { Link } from 'react-router-dom';
import { ArrowUpRight, BookOpen, Shield, Waypoints } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const COPY = {
  en: {
    eyebrow: 'Research',
    title: 'An observatory for governance signals that shape AI review decisions',
    body:
      'This page tracks standards, policy pressure, and workflow-level governance patterns relevant to procurement, audit, and executive oversight.',
    streams: [
      {
        icon: Shield,
        title: 'Regulatory and standards movement',
        body: 'Track changes in frameworks and obligations that alter evidence burden and review expectations.'
      },
      {
        icon: Waypoints,
        title: 'Operational governance patterns',
        body: 'Monitor recurring failure patterns in threshold design, escalation ownership, and documentation quality.'
      },
      {
        icon: BookOpen,
        title: 'Method and interpretation layer',
        body: 'Maintain conceptual clarity so governance language maps to real controls instead of generic assurance claims.'
      }
    ],
    referencesTitle: 'Core external references',
    references: [
      {
        label: 'NIST AI RMF',
        href: 'https://www.nist.gov/itl/ai-risk-management-framework',
        desc: 'Risk and governance scaffolding used for control mapping and review structure.'
      },
      {
        label: 'ISO/IEC 42001',
        href: 'https://www.iso.org/standard/81230.html',
        desc: 'AI management-system standard for governance process and accountability design.'
      },
      {
        label: 'EU AI Act',
        href: 'https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai',
        desc: 'Binding risk-based regulatory architecture shaping global vendor and procurement expectations.'
      },
      {
        label: 'OECD AI Principles',
        href: 'https://oecd.ai/en/ai-principles',
        desc: 'Intergovernmental principles used for policy framing and governance language alignment.'
      }
    ],
    noteTitle: 'How PHAROS uses this layer',
    noteBody:
      'Research signals are converted into review-facing controls, not treated as abstract content. The output is a tighter decision pathway under pressure.',
    ctaPrimary: 'Open full library',
    ctaSecondary: 'Book review'
  },
  fr: {
    eyebrow: 'Recherche',
    title: 'Un observatoire des signaux qui structurent la revue IA',
    body:
      'Cette page suit les standards, les pressions reglementaires et les patterns de gouvernance pertinents pour l approvisionnement, l audit et la supervision executive.',
    streams: [
      {
        icon: Shield,
        title: 'Mouvements reglementaires et standards',
        body: 'Suivre les changements qui modifient la charge de preuve et les attentes de revue.'
      },
      {
        icon: Waypoints,
        title: 'Patterns operationnels',
        body: 'Observer les echecs recurrents dans les seuils, l escalation et la documentation.'
      },
      {
        icon: BookOpen,
        title: 'Couche methode et interpretation',
        body: 'Garder une clarte conceptuelle entre langage de gouvernance et controles reels.'
      }
    ],
    referencesTitle: 'References externes de base',
    references: [
      {
        label: 'NIST AI RMF',
        href: 'https://www.nist.gov/itl/ai-risk-management-framework',
        desc: 'Cadre de risque et de gouvernance pour cartographier les controles.'
      },
      {
        label: 'ISO/IEC 42001',
        href: 'https://www.iso.org/standard/81230.html',
        desc: 'Standard de systeme de management IA pour processus et responsabilite.'
      },
      {
        label: 'EU AI Act',
        href: 'https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai',
        desc: 'Architecture reglementaire contraignante qui influence les revues fournisseurs.'
      },
      {
        label: 'OECD AI Principles',
        href: 'https://oecd.ai/en/ai-principles',
        desc: 'Principes intergouvernementaux utilises pour le cadrage politique.'
      }
    ],
    noteTitle: 'Usage PHAROS',
    noteBody:
      'Les signaux de recherche sont convertis en controles orientés revue. Le resultat est un parcours decisionnel plus solide sous pression.',
    ctaPrimary: 'Ouvrir la bibliotheque',
    ctaSecondary: 'Reserver'
  }
};

const Research = () => {
  const { language } = useLanguage();
  const copy = COPY[language];

  return (
    <div data-testid="research-page">
      <section className="section">
        <div className="container section-shell reveal-up">
          <p className="kicker">{copy.eyebrow}</p>
          <h1 style={{ marginTop: '0.7rem' }}>{copy.title}</h1>
          <p className="body-lead" style={{ marginTop: '0.8rem' }}>{copy.body}</p>
        </div>
      </section>

      <section className="section section-tight">
        <div className="container grid-3">
          {copy.streams.map((stream, index) => (
            <article className={`surface reveal-up delay-${Math.min(index, 3)}`} key={stream.title}>
              <span className="icon-pill" aria-hidden="true">
                <stream.icon size={16} />
              </span>
              <h2 style={{ fontSize: '1.3rem', marginTop: '0.7rem' }}>{stream.title}</h2>
              <p style={{ marginTop: '0.5rem' }}>{stream.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section section-tight">
        <div className="container grid-2" style={{ alignItems: 'start' }}>
          <article className="surface reveal-up">
            <h2>{copy.referencesTitle}</h2>
            <div style={{ marginTop: '0.85rem', display: 'grid', gap: '0.65rem' }}>
              {copy.references.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="surface"
                  style={{ display: 'block', padding: '0.85rem', borderRadius: '0.95rem' }}
                >
                  <span className="kicker" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                    {item.label}
                    <ArrowUpRight size={12} />
                  </span>
                  <p style={{ marginTop: '0.45rem' }}>{item.desc}</p>
                </a>
              ))}
            </div>
          </article>

          <article className="final-cta reveal-up delay-1">
            <h2>{copy.noteTitle}</h2>
            <p className="body-lead" style={{ marginTop: '0.7rem' }}>{copy.noteBody}</p>
            <div className="btn-row" style={{ marginTop: '0.95rem' }}>
              <Link className="btn-primary" to="/library">
                {copy.ctaPrimary}
              </Link>
              <Link className="btn-secondary" to="/contact">
                {copy.ctaSecondary}
              </Link>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
};

export default Research;
