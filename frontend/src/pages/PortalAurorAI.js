import { Link } from 'react-router-dom';

const PortalAurorAI = () => {
  return (
    <div data-testid="portal-aurorai-page">
      <div className="page-hero">
        <div className="container">
          <div className="section-header">
            <p className="eyebrow">Client Portal</p>
            <h1>AurorAI</h1>
            <p className="body-lg" style={{ marginTop: '16px' }}>
              Document processing, extraction quality gates, and evidence package preparation will live here.
            </p>
          </div>
        </div>
      </div>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="reveal" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '32px' }}>
            <p className="eyebrow" style={{ marginBottom: '14px' }}>Current scope</p>
            <p className="body-sm" style={{ maxWidth: '60ch' }}>
              First release will focus on document intake, structured extraction, review triggers, and evidence package generation for downstream governance review.
            </p>
            <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ padding: '16px', background: 'var(--color-bg-alt)', borderRadius: 'var(--radius-md)' }}>
                <p style={{ fontWeight: 500, color: 'var(--color-dark)', marginBottom: '4px' }}>Execution layer</p>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-muted)' }}>Classification, extraction, confidence scoring, and quality controls.</p>
              </div>
              <div style={{ padding: '16px', background: 'var(--color-bg-alt)', borderRadius: 'var(--radius-md)' }}>
                <p style={{ fontWeight: 500, color: 'var(--color-dark)', marginBottom: '4px' }}>Next</p>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-muted)' }}>We will define the exact portal surfaces and user flows in the next pass.</p>
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

export default PortalAurorAI;
