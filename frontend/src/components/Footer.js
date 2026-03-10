import { Link } from 'react-router-dom';
import LighthouseGlyph from './LighthouseGlyph';
import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
  const { language } = useLanguage();

  const copy = language === 'fr'
    ? {
        brandTitle: 'PHAROS footer mark',
        tagline: 'Une gouvernance lisible quand vient le vrai examen.',
        practice: 'Pratique',
        services: 'Services',
        research: 'Recherche',
        about: 'À propos',
        connect: 'Nous joindre',
        book: 'Réserver un échange',
        location: 'Montréal, Québec, Canada'
      }
    : {
        brandTitle: 'PHAROS footer mark',
        tagline: 'Legible governance for real review.',
        practice: 'Practice',
        services: 'Services',
        research: 'Research',
        about: 'About',
        connect: 'Connect',
        book: 'Book a debrief',
        location: 'Montreal, Quebec, Canada'
      };

  return (
    <footer className="footer" data-testid="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
              <LighthouseGlyph className="nav-logo" title={copy.brandTitle} />
              <span style={{ fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', fontSize: '0.75rem', color: 'var(--glow-primary)' }}>
                PHAROS
              </span>
            </div>
            <p>{copy.tagline}</p>
          </div>

          <div className="footer-col">
            <h4>{copy.practice}</h4>
            <Link to="/services">{copy.services}</Link>
            <Link to="/research">{copy.research}</Link>
            <Link to="/about">{copy.about}</Link>
          </div>

          <div className="footer-col">
            <h4>{copy.connect}</h4>
            <Link to="/connect">{copy.book}</Link>
            <a href="mailto:consult@govern-ai.ca">consult@govern-ai.ca</a>
            <a href="https://www.linkedin.com/in/martin-lepage-ai/" target="_blank" rel="noreferrer">LinkedIn</a>
          </div>
        </div>

        <div className="footer-bottom">
          <span>&copy; 2026 Martin Lepage, PhD &middot; PHAROS</span>
          <div className="footer-bottom-links">
            <span>{copy.location}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
