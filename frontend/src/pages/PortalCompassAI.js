import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const PORTAL_COPY = {
  en: {
    eyebrow: 'Client Portal',
    body: 'Governance intake, evidence ingestion, risk tiering, and deliverable generation will live here.',
    scope: 'Current scope',
    scopeBody: 'First release will focus on the use-case registry, evidence intake from AurorAI, initial risk tiering, and the earliest compliance deliverable surfaces.',
    layer: 'Governance layer',
    layerBody: 'Use-case records, evidence chain, risk logic, and approval-ready outputs.',
    next: 'Next',
    nextBody: 'We will define the exact portal surfaces and workflow steps in the next pass.',
    back: 'Back to Connect'
  },
  fr: {
    eyebrow: 'Portail client',
    body: 'L’accueil de gouvernance, la réception de la preuve, la hiérarchisation du risque et la génération des livrables vivront ici.',
    scope: 'Portée actuelle',
    scopeBody: 'La première version se concentrera sur le registre des cas d’usage, la réception de la preuve provenant d’AurorAI, la première hiérarchisation du risque et les premières surfaces de livrables de conformité.',
    layer: 'Couche de gouvernance',
    layerBody: 'Dossiers de cas d’usage, chaîne de preuve, logique de risque et sorties prêtes pour l’approbation.',
    next: 'Prochaine étape',
    nextBody: 'Nous définirons les surfaces exactes du portail et les étapes de travail dans le prochain passage.',
    back: 'Retour au contact'
  }
};

const PortalCompassAI = () => {
  const { language } = useLanguage();
  const copy = PORTAL_COPY[language];

  return (
    <div data-testid="portal-compassai-page">
      <div className="page-hero">
        <div className="container">
          <div className="section-header">
            <p className="eyebrow">{copy.eyebrow}</p>
            <h1>CompassAI</h1>
            <p className="body-lg" style={{ marginTop: '16px' }}>
              {copy.body}
            </p>
          </div>
        </div>
      </div>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="reveal" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '32px' }}>
            <p className="eyebrow" style={{ marginBottom: '14px' }}>{copy.scope}</p>
            <p className="body-sm" style={{ maxWidth: '60ch' }}>
              {copy.scopeBody}
            </p>
            <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ padding: '16px', background: 'var(--color-bg-alt)', borderRadius: 'var(--radius-md)' }}>
                <p style={{ fontWeight: 500, color: 'var(--color-dark)', marginBottom: '4px' }}>{copy.layer}</p>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-muted)' }}>{copy.layerBody}</p>
              </div>
              <div style={{ padding: '16px', background: 'var(--color-bg-alt)', borderRadius: 'var(--radius-md)' }}>
                <p style={{ fontWeight: 500, color: 'var(--color-dark)', marginBottom: '4px' }}>{copy.next}</p>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-muted)' }}>{copy.nextBody}</p>
              </div>
            </div>
            <Link to="/connect" className="btn-dark" style={{ marginTop: '24px', display: 'inline-flex' }}>
              {copy.back}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PortalCompassAI;
