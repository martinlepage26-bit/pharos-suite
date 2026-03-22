import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const SurfaceBoundary = ({
  eyebrow = 'Boundary update',
  title,
  body,
}) => (
  <div data-testid="surface-boundary-page">
    <div className="page-hero">
      <div className="container">
        <div className="section-header">
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p className="body-lg" style={{ marginTop: '16px', maxWidth: '46rem' }}>
            {body}
          </p>
          <div className="btn-row" style={{ marginTop: '28px' }}>
            <Link to="/" className="btn-dark">
              Return to PHAROS
              <ArrowRight />
            </Link>
            <Link to="/contact" className="btn-outline">
              Contact PHAROS
            </Link>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default SurfaceBoundary;
