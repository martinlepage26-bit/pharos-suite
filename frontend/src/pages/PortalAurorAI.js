import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const PORTAL_COPY = {
  en: {
    eyebrow: 'Client Portal',
    body: 'Document processing, extraction quality gates, and evidence package preparation will live here.',
    scope: 'Current scope',
    scopeBody: 'First release will focus on document intake, structured extraction, review triggers, and evidence package generation for downstream governance review.',
    layer: 'Execution layer',
    layerBody: 'Classification, extraction, confidence scoring, and quality controls.',
    next: 'Next',
    nextBody: 'We will define the exact portal surfaces and user flows in the next pass.',
    back: 'Back to Connect'
  },
  fr: {
    eyebrow: 'Portail client',
    body: 'Le traitement documentaire, les portes qualité d’extraction et la préparation des dossiers de preuve vivront ici.',
    scope: 'Portée actuelle',
    scopeBody: 'La première version se concentrera sur l’accueil documentaire, l’extraction structurée, les déclencheurs de revue et la génération de dossiers de preuve pour les revues de gouvernance en aval.',
    layer: 'Couche d’exécution',
    layerBody: 'Classification, extraction, notation de confiance et contrôles de qualité.',
    next: 'Prochaine étape',
    nextBody: 'Nous définirons les surfaces exactes du portail et les parcours utilisateurs dans le prochain passage.',
    back: 'Retour au contact'
  }
};

const PortalAurorAI = () => {
  const { language } = useLanguage();
  const copy = PORTAL_COPY[language];

  return (
    <div data-testid="portal-aurorai-page">
      <div className="page-hero">
        <div className="container">
          <div className="section-header">
            <p className="eyebrow">{copy.eyebrow}</p>
            <h1>AurorAI</h1>
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

export default PortalAurorAI;
