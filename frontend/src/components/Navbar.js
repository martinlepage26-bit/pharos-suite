import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const NAV = {
  en: {
    links: [
      { to: '/', label: 'Home', match: ['/'] },
      { to: '/services', label: 'Services', match: ['/services', '/governance', '/services/menu'] },
      { to: '/methods', label: 'Method', match: ['/methods', '/about/conceptual-method'] },
      { to: '/research', label: 'Research', match: ['/research', '/observatory', '/library', '/cases'] },
      { to: '/about', label: 'About', match: ['/about'] }
    ],
    book: 'Book Review',
    brandSub: 'Legible AI governance'
  },
  fr: {
    links: [
      { to: '/', label: 'Accueil', match: ['/'] },
      { to: '/services', label: 'Services', match: ['/services', '/governance', '/services/menu'] },
      { to: '/methods', label: 'Methode', match: ['/methods', '/about/conceptual-method'] },
      { to: '/research', label: 'Recherche', match: ['/research', '/observatory', '/library', '/cases'] },
      { to: '/about', label: 'A propos', match: ['/about'] }
    ],
    book: 'Reserver',
    brandSub: 'Gouvernance IA lisible'
  }
};

const isActive = (pathname, matches) => matches.some((path) => {
  if (path === '/') {
    return pathname === '/';
  }

  return pathname === path || pathname.startsWith(`${path}/`);
});

const Navbar = () => {
  const { language, toggleLanguage } = useLanguage();
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const copy = NAV[language];

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header className="site-header">
      <div className="container topbar">
        <Link to="/" className="brand-link" aria-label="PHAROS home">
          <span className="brand-mark" aria-hidden="true" />
          <span className="brand-text">
            <span className="brand-name">PHAROS</span>
            <span className="brand-sub">{copy.brandSub}</span>
          </span>
        </Link>

        <div className="nav-actions">
          <nav className="nav-links" aria-label={language === 'fr' ? 'Navigation principale' : 'Primary navigation'}>
            {copy.links.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`nav-link${isActive(pathname, item.match) ? ' active' : ''}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Link to="/contact" className="btn-primary" style={{ paddingInline: '0.82rem' }}>
            {copy.book}
          </Link>

          <button
            type="button"
            className="lang-toggle"
            onClick={toggleLanguage}
            title={language === 'fr' ? 'Switch to English' : 'Passer en francais'}
          >
            {language === 'fr' ? 'EN' : 'FR'}
          </button>

          <button
            type="button"
            className="menu-toggle"
            onClick={() => setMobileOpen((open) => !open)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X /> : <Menu />}
          </button>
        </div>

        {mobileOpen ? (
          <div className="mobile-menu" role="dialog" aria-label="Site menu">
            {copy.links.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`mobile-link${isActive(pathname, item.match) ? ' active' : ''}`}
              >
                {item.label}
              </Link>
            ))}
            <Link to="/contact" className="mobile-link">
              {copy.book}
            </Link>
          </div>
        ) : null}
      </div>
    </header>
  );
};

export default Navbar;
