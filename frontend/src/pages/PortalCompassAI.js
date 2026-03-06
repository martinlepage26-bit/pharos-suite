import { Link } from 'react-router-dom';

const PortalCompassAI = () => {
  return (
    <div data-testid="portal-compassai-page">
      <div className="page-hero">
        <div className="container">
          <div className="section-header">
            <p className="eyebrow">Client Portal</p>
            <h1>CompassAI</h1>
            <p className="body-lg" style={{ marginTop: '16px' }}>
              Governance intake, evidence ingestion, risk tiering, and deliverable generation will live here.
            </p>
          </div>
        </div>
      </div>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="reveal" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '32px' }}>
            <p className="eyebrow" style={{ marginBottom: '14px' }}>Current scope</p>
            <p className="body-sm" style={{ maxWidth: '60ch' }}>
              First release will focus on the use-case registry, evidence intake from AurorAI, initial risk tiering, and the earliest compliance deliverable surfaces.
            </p>
            <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ padding: '16px', background: 'var(--color-bg-alt)', borderRadius: 'var(--radius-md)' }}>
                <p style={{ fontWeight: 500, color: 'var(--color-dark)', marginBottom: '4px' }}>Governance layer</p>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-muted)' }}>Use-case records, evidence chain, risk logic, and approval-ready outputs.</p>
              </div>
              <div style={{ padding: '16px', background: 'var(--color-bg-alt)', borderRadius: 'var(--radius-md)' }}>
                <p style={{ fontWeight: 500, color: 'var(--color-dark)', marginBottom: '4px' }}>Next</p>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-muted)' }}>We will define the exact portal surfaces and workflow steps in the next pass.</p>
              </div>
            </div>
            <Link to="/connect" className="btn-dark" style={{ marginTop: '24px', display: 'inline-flex' }}>
              Back to Connect
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PortalCompassAI;
