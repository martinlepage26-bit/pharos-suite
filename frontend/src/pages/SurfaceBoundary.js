import { ArrowRight } from 'lucide-react';
import LocalizedLink from '../components/LocalizedLink';
import { useLanguage } from '../context/LanguageContext';

const SurfaceBoundary = ({
  eyebrow = 'Boundary update',
  title,
  body,
}) => {
  const { language } = useLanguage();

  return (
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
              <LocalizedLink to="/" className="btn-dark">
                {language === 'fr' ? 'Retour à PHAROS' : 'Return to PHAROS'}
                <ArrowRight />
              </LocalizedLink>
              <LocalizedLink to="/contact" className="btn-outline">
                {language === 'fr' ? 'Contacter PHAROS' : 'Contact PHAROS'}
              </LocalizedLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurfaceBoundary;
