import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
  const { language } = useLanguage();

  const copy = language === 'fr'
    ? {
        brandTitle: 'PHAROS footer mark',
        founderLine: 'Une pratique de Martin Lepage, PhD',
        tagline: 'Un observatoire decentralise pour la gouvernance de l IA.',
        proofLine: 'Observer, structurer et evaluer la gouvernance a travers les modeles, les institutions, les normes et les revendications.',
        navigation: 'Navigation',
        home: 'Accueil',
        about: 'A propos',
        observatory: 'Observatoire',
        governance: 'Gouvernance',
        methods: 'Methodes',
        connect: 'Contact',
        book: 'Demandes de recherche et de collaboration',
        location: 'Montréal, Québec, Canada'
      }
    : {
        brandTitle: 'PHAROS footer mark',
        founderLine: 'A practice by Martin Lepage, PhD',
        tagline: 'A decentralized observatory for AI governance.',
        proofLine: 'Observing, structuring, and evaluating governance across models, institutions, standards, and claims.',
        navigation: 'Navigation',
        home: 'Home',
        about: 'About',
        observatory: 'Observatory',
        governance: 'Governance',
        methods: 'Methods',
        connect: 'Contact',
        book: 'Research and collaboration inquiries',
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
            <Link to="/">{copy.home}</Link>
            <Link to="/about">{copy.about}</Link>
            <Link to="/observatory">{copy.observatory}</Link>
            <Link to="/governance">{copy.governance}</Link>
            <Link to="/methods">{copy.methods}</Link>
          </div>

          <div className="footer-col">
            <h4>{copy.connect}</h4>
            <Link to="/contact">{copy.book}</Link>
            <a href="mailto:pharos@govern-ai.ca">pharos@govern-ai.ca</a>
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
