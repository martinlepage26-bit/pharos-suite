import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { PUBLIC_ASSURANCE_META } from '../data/publicAssurance';

const COPY = {
  en: {
    summary:
      'PHAROS turns procurement, audit, vendor, and executive pressure into deterministic governance decisions teams can defend and reconstruct.',
    nav: 'Navigate',
    trust: 'Trust',
    legal: 'Legal',
    contact: 'Contact',
    home: 'Home',
    services: 'Services',
    method: 'Method',
    research: 'Research',
    about: 'About',
    faq: 'FAQ',
    assurance: 'Assurance',
    transparency: 'Transparency record',
    privacy: 'Privacy',
    terms: 'Terms',
    reviewed: `Last reviewed ${PUBLIC_ASSURANCE_META.reviewedOnLabelEn}`,
    location: PUBLIC_ASSURANCE_META.accountableLocation
  },
  fr: {
    summary:
      'PHAROS transforme la pression d approvisionnement, d audit, de revue fournisseur et de supervision en decisions de gouvernance deterministes et defendables.',
    nav: 'Navigation',
    trust: 'Confiance',
    legal: 'Juridique',
    contact: 'Contact',
    home: 'Accueil',
    services: 'Services',
    method: 'Methode',
    research: 'Recherche',
    about: 'A propos',
    faq: 'FAQ',
    assurance: 'Assurance',
    transparency: 'Registre de transparence',
    privacy: 'Confidentialite',
    terms: 'Conditions',
    reviewed: `Derniere revue ${PUBLIC_ASSURANCE_META.reviewedOnLabelFr}`,
    location: PUBLIC_ASSURANCE_META.accountableLocation
  }
};

const Footer = () => {
  const { language } = useLanguage();
  const copy = COPY[language];

  return (
    <footer className="site-footer" data-testid="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <p className="eyebrow">PHAROS AI Governance</p>
            <h3>Governance that survives scrutiny.</h3>
            <p>{copy.summary}</p>
          </div>

          <div className="footer-columns">
            <div className="footer-col">
              <h4>{copy.nav}</h4>
              <Link to="/">{copy.home}</Link>
              <Link to="/services">{copy.services}</Link>
              <Link to="/methods">{copy.method}</Link>
              <Link to="/research">{copy.research}</Link>
              <Link to="/about">{copy.about}</Link>
            </div>

            <div className="footer-col">
              <h4>{copy.trust}</h4>
              <Link to="/faq">{copy.faq}</Link>
              <Link to="/assurance">{copy.assurance}</Link>
              <a href={PUBLIC_ASSURANCE_META.transparencyRecordPath} target="_blank" rel="noreferrer">
                {copy.transparency}
              </a>
              <h4 style={{ marginTop: '0.85rem' }}>{copy.legal}</h4>
              <Link to="/privacy">{copy.privacy}</Link>
              <Link to="/terms">{copy.terms}</Link>
              <h4 style={{ marginTop: '0.85rem' }}>{copy.contact}</h4>
              <Link to="/contact">{PUBLIC_ASSURANCE_META.contactEmail}</Link>
            </div>
          </div>
        </div>

        <div className="footer-meta">
          <span>&copy; {new Date().getFullYear()} PHAROS AI Governance</span>
          <span>{copy.reviewed}</span>
          <span>{copy.location}</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
