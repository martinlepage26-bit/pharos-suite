import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import LighthouseGlyph from './LighthouseGlyph';
import { useLanguage } from '../context/LanguageContext';

const Navbar = () => {
  const { language, toggleLanguage, t } = useLanguage();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navItems = [
    { path: '/', label: t.nav.home },
    { path: '/services', label: t.nav.services },
    { path: '/research', label: t.nav.research },
    { path: '/about', label: t.nav.about }
  ];
  const reviewCta = language === 'fr' ? 'Reserver un echange' : 'Book a review';

  const languageButtonLabel = language === 'fr' ? 'EN' : 'FR';
  const languageButtonTitle = language === 'fr'
    ? 'Switch to English'
    : 'Passer en français';

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 20);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    document.body.style.overflow = '';
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const homeHeroVisible = location.pathname === '/' && !scrolled;
  const navClass = ['nav', scrolled ? 'scrolled' : '', homeHeroVisible ? 'hero-visible' : '']
    .filter(Boolean)
    .join(' ');

  return (
    <>
      <nav className={navClass} data-testid="navbar">
        <div className="nav-inner">
          <Link to="/" className="nav-brand" aria-label={language === 'fr' ? 'Accueil PHAROS' : 'PHAROS home'}>
            <LighthouseGlyph className="nav-logo" />
            <span className="nav-wordmark">PHAROS</span>
          </Link>

          <div className="nav-right">
            <div className="nav-links">
              {navItems.map((item) => {
                const isActive = item.path === '/'
                  ? location.pathname === '/'
                  : location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
                return (
                  <Link key={item.path} to={item.path} className={`nav-link${isActive ? ' active' : ''}`}>
                    {item.label}
                  </Link>
                );
              })}
              <Link to="/connect" className="nav-cta">
                {reviewCta}
              </Link>
              <button className="nav-lang" type="button" onClick={toggleLanguage} title={languageButtonTitle}>
                {languageButtonLabel}
              </button>
            </div>
            <button
              className={`nav-hamburger${menuOpen ? ' open' : ''}`}
              aria-label={menuOpen ? (language === 'fr' ? 'Fermer le menu' : 'Close menu') : (language === 'fr' ? 'Ouvrir le menu' : 'Open menu')}
              aria-expanded={menuOpen}
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </nav>

      <div className={`mobile-menu${menuOpen ? ' open' : ''}`}>
        {navItems.map((item) => (
          <Link key={item.path} to={item.path} onClick={() => setMenuOpen(false)}>
            {item.label}
          </Link>
        ))}
        <Link to="/connect" className="nav-cta-mobile" onClick={() => setMenuOpen(false)}>
          {reviewCta}
        </Link>
        <button
          type="button"
          className="nav-lang mobile-lang-toggle"
          onClick={() => {
            toggleLanguage();
            setMenuOpen(false);
          }}
          title={languageButtonTitle}
        >
          {languageButtonLabel}
        </button>
      </div>
    </>
  );
};

export default Navbar;
