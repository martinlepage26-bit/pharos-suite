import { Link } from 'react-router-dom';
import LighthouseGlyph from './LighthouseGlyph';

const Footer = () => (
  <footer className="footer" data-testid="footer">
    <div className="container">
      <div className="footer-top">
        <div className="footer-brand">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <LighthouseGlyph className="nav-logo" title="Govern AI footer mark" />
            <span style={{ fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', fontSize: '0.75rem', color: 'var(--glow-primary)' }}>
              Govern AI
            </span>
          </div>
          <p>Legible governance for real review.</p>
        </div>

        <div className="footer-col">
          <h4>Practice</h4>
          <Link to="/services">Services</Link>
          <Link to="/showcase">Showcase</Link>
          <Link to="/research">Research</Link>
          <Link to="/about">About</Link>
        </div>

        <div className="footer-col">
          <h4>Connect</h4>
          <Link to="/connect">Book a debrief</Link>
          <a href="mailto:consult@govern-ai.ca">consult@govern-ai.ca</a>
          <a href="https://www.linkedin.com/in/martin-lepage-ai/" target="_blank" rel="noreferrer">LinkedIn</a>
        </div>
      </div>

      <div className="footer-bottom">
        <span>&copy; 2026 Martin Lepage, PhD &middot; Govern AI</span>
        <div className="footer-bottom-links">
          <span>Montreal, Quebec, Canada</span>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
