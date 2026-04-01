import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { PUBLIC_ASSURANCE_META } from '../data/publicAssurance';

const Footer = () => {
  const { language, localizedPath } = useLanguage();
  const contactHref = `mailto:${PUBLIC_ASSURANCE_META.contactEmail}`;

  const copy = language === 'fr'
    ? {
        founderLine: 'Surface publique PHAROS',
        tagline: 'Gouvernance IA pour les conditions de revue reelles.',
        proofLine: 'Seuils explicites, droits de decision nommes et chemins de preuve qui restent lisibles sous audit, approvisionnement et supervision.',
        navigation: 'Navigation',
        home: 'Accueil',
        about: 'A propos',
        observatory: 'Observatoire',
        governance: 'Gouvernance',
        methods: 'Methodes',
        assurance: 'Assurance',
        connect: 'Contact',
        book: 'Demandes de recherche et de collaboration',
        record: 'Registre de transparence',
        reviewed: `Derniere revue ${PUBLIC_ASSURANCE_META.reviewedOnLabelFr}`,
        location: 'Montreal, Quebec, Canada'
      }
    : {
        founderLine: 'PHAROS public surface',
        tagline: 'AI governance for live review conditions.',
        proofLine: 'Explicit thresholds, named decision rights, and evidence paths that stay legible under procurement, audit, and oversight.',
        navigation: 'Navigation',
        home: 'Home',
        about: 'About',
        observatory: 'Observatory',
        governance: 'Governance',
        methods: 'Methods',
        assurance: 'Assurance',
        connect: 'Contact',
        book: 'Research and collaboration inquiries',
        record: 'Transparency record',
        reviewed: `Last reviewed ${PUBLIC_ASSURANCE_META.reviewedOnLabelEn}`,
        location: 'Montreal, Quebec, Canada'
      };

  return (
    <footer className="footer" data-testid="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-lockup">
              <span className="footer-wordmark">
                PHAROS
              </span>
            </div>
            <p className="footer-founder">{copy.founderLine}</p>
            <p>{copy.tagline}</p>
            <p className="footer-proof">{copy.proofLine}</p>
          </div>

          <div className="footer-col">
            <h4>{copy.navigation}</h4>
            <Link to={localizedPath('/')}>{copy.home}</Link>
            <Link to={localizedPath('/about')}>{copy.about}</Link>
            <Link to={localizedPath('/observatory')}>{copy.observatory}</Link>
            <Link to={localizedPath('/governance')}>{copy.governance}</Link>
            <Link to={localizedPath('/methods')}>{copy.methods}</Link>
            <Link to={localizedPath('/assurance')}>{copy.assurance}</Link>
          </div>

          <div className="footer-col">
            <h4>{copy.connect}</h4>
            <Link to={localizedPath('/contact')}>{copy.book}</Link>
            <a href={contactHref}>{PUBLIC_ASSURANCE_META.contactEmail}</a>
          </div>
        </div>

        <div className="footer-bottom">
          <span>&copy; 2026 PHAROS AI&nbsp;Governance</span>
          <div className="footer-bottom-links">
            <Link to={localizedPath('/assurance')}>{copy.assurance}</Link>
            <a href={PUBLIC_ASSURANCE_META.transparencyRecordPath} target="_blank" rel="noreferrer">
              {copy.record}
            </a>
            <span>{copy.reviewed}</span>
            <span>{copy.location}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
