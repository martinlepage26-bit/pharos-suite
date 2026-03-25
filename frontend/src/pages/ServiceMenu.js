import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BriefcaseBusiness, Radar, Scale, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const API_URL = process.env.REACT_APP_BACKEND_URL || '';

const normalizeListValue = (value) => {
  if (Array.isArray(value)) {
    return value.filter(Boolean).map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === 'string') {
    return value
      .split(/\r?\n|;/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

const getLocalizedValue = (pkg, field, language, fallbackValue) => {
  const primary = language === 'fr' ? pkg[`${field}_fr`] : pkg[`${field}_en`];
  const secondary = language === 'fr' ? pkg[`${field}_en`] : pkg[`${field}_fr`];
  return primary || secondary || fallbackValue;
};

const getLocalizedList = (pkg, field, language, fallbackValue) => {
  const primary = language === 'fr' ? pkg[`${field}_fr`] : pkg[`${field}_en`];
  const secondary = language === 'fr' ? pkg[`${field}_en`] : pkg[`${field}_fr`];

  const primaryList = normalizeListValue(primary);
  if (primaryList.length > 0) return primaryList;

  const secondaryList = normalizeListValue(secondary);
  if (secondaryList.length > 0) return secondaryList;

  return fallbackValue;
};

const COPY = {
  en: {
    eyebrow: 'Service menu',
    title: 'Choose the governance route by pressure source',
    body:
      'Select the route that matches the review condition you are facing now. The goal is deterministic progression, not oversized scope.',
    packageTitle: 'Service routes',
    packageBody: 'Each route has a best-fit context, concrete outputs, and bounded outcomes.',
    bestFor: 'Best for',
    deliverables: 'Deliverables',
    outcomes: 'Outcomes',
    discuss: 'Discuss this route',
    driversTitle: 'What changes engagement scope',
    driversBody:
      'Scope and intensity shift with system volume, review burden, and failure consequence. Governance design should follow those realities.',
    drivers: [
      {
        icon: BriefcaseBusiness,
        title: 'System landscape',
        body: 'How many systems, vendors, and dependencies are in scope.'
      },
      {
        icon: Scale,
        title: 'Review burden',
        body: 'How demanding procurement, audit, or oversight review requirements are.'
      },
      {
        icon: Radar,
        title: 'Consequence level',
        body: 'What happens if decisions, controls, or evidence pathways fail.'
      }
    ],
    ctaTitle: 'Need help choosing the right route?',
    ctaBody: 'A short review call is enough to pick route, scope, and first deliverables.',
    ctaPrimary: 'Book review',
    ctaSecondary: 'Run readiness snapshot'
  },
  fr: {
    eyebrow: 'Menu des services',
    title: 'Choisir le parcours de gouvernance selon la source de pression',
    body:
      'Selectionnez le parcours qui correspond a la condition de revue presente. L objectif est une progression deterministe, pas une portee excessive.',
    packageTitle: 'Parcours de service',
    packageBody: 'Chaque parcours presente son meilleur contexte, ses sorties concretes et ses resultats bornes.',
    bestFor: 'Ideal pour',
    deliverables: 'Livrables',
    outcomes: 'Resultats',
    discuss: 'Discuter ce parcours',
    driversTitle: 'Ce qui change la portee du mandat',
    driversBody:
      'La portee varie selon volume de systemes, charge de revue et consequence d echec. La conception de gouvernance doit suivre ces contraintes.',
    drivers: [
      {
        icon: BriefcaseBusiness,
        title: 'Paysage systeme',
        body: 'Combien de systemes, fournisseurs et dependances sont en portee.'
      },
      {
        icon: Scale,
        title: 'Charge de revue',
        body: 'Niveau d exigence des revues approvisionnement, audit ou supervision.'
      },
      {
        icon: Radar,
        title: 'Niveau de consequence',
        body: 'Impact potentiel si decisions, controles ou preuve ne tiennent pas.'
      }
    ],
    ctaTitle: 'Besoin d aide pour choisir le bon parcours?',
    ctaBody: 'Un appel de revue court suffit pour choisir parcours, portee et premiers livrables.',
    ctaPrimary: 'Reserver une revue',
    ctaSecondary: 'Faire l instantane'
  }
};

const ServiceMenu = () => {
  const { language } = useLanguage();
  const copy = COPY[language];
  const [remotePackages, setRemotePackages] = useState([]);

  const fallbackPackages = useMemo(() => {
    if (language === 'fr') {
      return [
        {
          id: 'deterministic-governance',
          icon: ShieldCheck,
          title: 'Gouvernance deterministe',
          bestFor: 'Equipes qui doivent stabiliser seuils, droits de decision et cadence avant pression accrue.',
          deliverables: [
            'Inventaire systemes et fournisseurs avec limites de portee',
            'Modele de seuils et escalation',
            'Matrice des droits de decision et responsabilites'
          ],
          outcomes: [
            'Moins d ambiguite sous revue',
            'Responsabilites de preuve plus claires',
            'Parcours decisionnel reconstructible'
          ]
        },
        {
          id: 'pre-mortem-review',
          icon: Radar,
          title: 'Revue pre-mortem',
          bestFor: 'Equipes qui veulent tester un lancement ou une integration avant exposition forte.',
          deliverables: [
            'Cartographie des modes d echec et dependances',
            'Conditions go / no-go liees a la preuve',
            'Questions ciblees de diligence fournisseur'
          ],
          outcomes: [
            'Risques identifies plus tot',
            'Conditions de lancement deterministes',
            'Ecarts ouverts avec owners assignes'
          ]
        },
        {
          id: 'post-mortem-review',
          icon: BriefcaseBusiness,
          title: 'Revue post-mortem',
          bestFor: 'Equipes qui repondent a incident, echec de revue ou derive de controle.',
          deliverables: [
            'Reconstruction evenement et chemin de decision',
            'Analyse des ecarts de controle et consequence',
            'Plan de remediation avec seuils mis a jour'
          ],
          outcomes: [
            'Dossier defendable de ce qui s est passe',
            'Priorites de remediation sequencees',
            'Posture renforcee apres correction'
          ]
        }
      ];
    }

    return [
      {
        id: 'deterministic-governance',
        icon: ShieldCheck,
        title: 'Deterministic Governance',
        bestFor: 'Teams needing stable thresholds, decision rights, and governance cadence before pressure compounds.',
        deliverables: [
          'System and vendor inventory with scope boundaries',
          'Deterministic threshold and escalation model',
          'Decision-rights matrix with named ownership'
        ],
        outcomes: [
          'Less ambiguity under review',
          'Clearer evidence ownership',
          'Reconstructible decision pathway'
        ]
      },
      {
        id: 'pre-mortem-review',
        icon: Radar,
        title: 'Pre-mortem Review',
        bestFor: 'Teams pressure-testing launch or onboarding before consequence rises.',
        deliverables: [
          'Failure-mode and dependency map',
          'Go / no-go conditions tied to evidence',
          'Targeted vendor diligence prompts'
        ],
        outcomes: [
          'Risks surfaced early',
          'Deterministic launch conditions',
          'Open gaps with assigned owners'
        ]
      },
      {
        id: 'post-mortem-review',
        icon: BriefcaseBusiness,
        title: 'Post-mortem Review',
        bestFor: 'Teams responding to incidents, failed review, or control drift.',
        deliverables: [
          'Event and decision-path reconstruction',
          'Control-gap and consequence analysis',
          'Remediation path with threshold updates'
        ],
        outcomes: [
          'Defensible record of what happened',
          'Sequenced remediation ownership',
          'Stronger posture after correction'
        ]
      }
    ];
  }, [language]);

  useEffect(() => {
    let cancelled = false;

    const loadPackages = async () => {
      try {
        const response = await fetch(`${API_URL}/api/services/active`);
        if (!response.ok) return;
        const payload = await response.json();
        if (!cancelled && Array.isArray(payload)) {
          setRemotePackages(payload);
        }
      } catch (_error) {
        if (!cancelled) {
          setRemotePackages([]);
        }
      }
    };

    loadPackages();

    return () => {
      cancelled = true;
    };
  }, []);

  const packages = useMemo(() => {
    if (remotePackages.length === 0) return fallbackPackages;

    return remotePackages.map((pkg, index) => {
      const fallback = fallbackPackages[index] || fallbackPackages[0];

      return {
        ...fallback,
        id: pkg.id || fallback.id,
        icon: fallback.icon,
        title: getLocalizedValue(pkg, 'title', language, fallback.title),
        bestFor: getLocalizedValue(pkg, 'best_for', language, fallback.bestFor),
        deliverables: getLocalizedList(pkg, 'deliverables', language, fallback.deliverables),
        outcomes: getLocalizedList(pkg, 'produces', language, fallback.outcomes)
      };
    });
  }, [fallbackPackages, language, remotePackages]);

  return (
    <div data-testid="service-menu-page">
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
            <h2>{copy.packageTitle}</h2>
            <p className="body-sm">{copy.packageBody}</p>
          </div>

          <div style={{ display: 'grid', gap: '1rem' }}>
            {packages.map((pkg, index) => (
              <article key={pkg.id} className={`surface reveal-up delay-${Math.min(index, 3)}`} data-testid={`package-${pkg.id}`}>
                <span className="icon-pill" aria-hidden="true">
                  <pkg.icon size={16} />
                </span>
                <h3 style={{ marginTop: '0.7rem' }}>{pkg.title}</h3>
                <p className="body-sm" style={{ marginTop: '0.5rem' }}><strong>{copy.bestFor}:</strong> {pkg.bestFor}</p>

                <div className="grid-2" style={{ marginTop: '0.85rem', alignItems: 'start' }}>
                  <div>
                    <p className="kicker">{copy.deliverables}</p>
                    <ul className="check-list" style={{ marginTop: '0.55rem' }}>
                      {pkg.deliverables.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="kicker">{copy.outcomes}</p>
                    <ul className="check-list" style={{ marginTop: '0.55rem' }}>
                      {pkg.outcomes.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="btn-row" style={{ marginTop: '0.9rem' }}>
                  <Link to="/contact" className="btn-secondary">
                    {copy.discuss}
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-tight">
        <div className="container grid-3">
          {copy.drivers.map((driver, index) => (
            <article key={driver.title} className={`surface reveal-up delay-${Math.min(index, 3)}`}>
              <span className="icon-pill" aria-hidden="true">
                <driver.icon size={16} />
              </span>
              <h3 className="surface-title" style={{ marginTop: '0.7rem' }}>{driver.title}</h3>
              <p className="body-sm">{driver.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section section-tight">
        <div className="container">
          <div className="surface surface-muted reveal-up" style={{ marginBottom: '1rem' }}>
            <h2>{copy.driversTitle}</h2>
            <p className="body-lead" style={{ marginTop: '0.65rem' }}>{copy.driversBody}</p>
          </div>

          <div className="final-cta reveal-up delay-1">
            <h2>{copy.ctaTitle}</h2>
            <p className="body-lead" style={{ marginTop: '0.7rem' }}>{copy.ctaBody}</p>
            <div className="btn-row" style={{ marginTop: '0.95rem' }}>
              <Link className="btn-primary" to="/contact">
                {copy.ctaPrimary}
                <ArrowRight size={14} />
              </Link>
              <Link className="btn-secondary" to="/tool">
                {copy.ctaSecondary}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServiceMenu;
