import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const NAV_COPY = {
  en: {
    navItems: [
      { path: '/', label: 'HOME', matchPaths: ['/'] },
      { path: '/about', label: 'ABOUT', matchPaths: ['/about'] },
      {
        path: '/governance',
        label: 'GOVERNANCE',
        matchPaths: ['/governance', '/services', '/observatory', '/research', '/methods', '/about/conceptual-method'],
        children: [
          { path: '/observatory', label: 'OBSERVATORY', matchPaths: ['/observatory', '/research'] },
          { path: '/methods', label: 'METHODS', matchPaths: ['/methods', '/about/conceptual-method'] }
        ]
      },
      { path: '/contact', label: 'CONTACT', matchPaths: ['/contact', '/connect'] }
    ],
    sitemapLabel: 'Site map',
    sitemapLinks: [
      { path: '/', label: 'HOME', matchPaths: ['/'] },
      { path: '/about', label: 'ABOUT', matchPaths: ['/about'] },
      { path: '/governance', label: 'GOVERNANCE', matchPaths: ['/governance', '/services'] },
      { path: '/observatory', label: 'OBSERVATORY', matchPaths: ['/observatory', '/research'] },
      { path: '/methods', label: 'METHODS', matchPaths: ['/methods', '/about/conceptual-method'] },
      { path: '/contact', label: 'CONTACT', matchPaths: ['/contact', '/connect'] },
      { path: '/tool', label: 'TOOL', matchPaths: ['/tool'] },
      { path: '/assurance', label: 'ASSURANCE', matchPaths: ['/assurance', '/transparency', '/trust', '/auditability'] },
      { path: '/faq', label: 'FAQ', matchPaths: ['/faq'] }
    ],
    bookReview: 'BOOK A REVIEW'
  },
  fr: {
    navItems: [
      { path: '/', label: 'ACCUEIL', matchPaths: ['/'] },
      { path: '/about', label: 'A PROPOS', matchPaths: ['/about'] },
      {
        path: '/governance',
        label: 'GOUVERNANCE',
        matchPaths: ['/governance', '/services', '/observatory', '/research', '/methods', '/about/conceptual-method'],
        children: [
          { path: '/observatory', label: 'OBSERVATOIRE', matchPaths: ['/observatory', '/research'] },
          { path: '/methods', label: 'METHODES', matchPaths: ['/methods', '/about/conceptual-method'] }
        ]
      },
      { path: '/contact', label: 'CONTACT', matchPaths: ['/contact', '/connect'] }
    ],
    sitemapLabel: 'Plan du site',
    sitemapLinks: [
      { path: '/', label: 'ACCUEIL', matchPaths: ['/'] },
      { path: '/about', label: 'A PROPOS', matchPaths: ['/about'] },
      { path: '/governance', label: 'GOUVERNANCE', matchPaths: ['/governance', '/services'] },
      { path: '/observatory', label: 'OBSERVATOIRE', matchPaths: ['/observatory', '/research'] },
      { path: '/methods', label: 'METHODES', matchPaths: ['/methods', '/about/conceptual-method'] },
      { path: '/contact', label: 'CONTACT', matchPaths: ['/contact', '/connect'] },
      { path: '/tool', label: 'OUTIL', matchPaths: ['/tool'] },
      { path: '/assurance', label: 'ASSURANCE', matchPaths: ['/assurance', '/transparency', '/trust', '/auditability'] },
      { path: '/faq', label: 'FAQ', matchPaths: ['/faq'] }
    ],
    bookReview: 'RESERVER UNE REVUE'
  }
};

const Navbar = () => {
  const { language, toggleLanguage } = useLanguage();
  const location = useLocation();
  const [sitemapOpen, setSitemapOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const copy = NAV_COPY[language];
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
    setSitemapOpen(false);
    document.body.style.overflow = '';
  }, [location.pathname]);

  useEffect(() => {
    const lockBody = sitemapOpen && window.matchMedia('(max-width: 767px)').matches;
    document.body.style.overflow = lockBody ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [sitemapOpen]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setSitemapOpen(false);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  const homeHeroVisible = location.pathname === '/' && !scrolled;
  const navClass = ['nav', scrolled ? 'scrolled' : '', homeHeroVisible ? 'hero-visible' : '']
    .filter(Boolean)
    .join(' ');
  const isPathActive = (matchPaths) => matchPaths.some((path) => (
    path === '/'
      ? location.pathname === '/'
      : location.pathname === path || location.pathname.startsWith(`${path}/`)
  ));

  return (
    <>
      <header className="site-header">
        <nav className={navClass} data-testid="navbar" aria-label={language === 'fr' ? 'Navigation principale' : 'Primary navigation'}>
          <div className="nav-inner">
            <div className="nav-left">
              <button
                className={`nav-sitemap-toggle${sitemapOpen ? ' open' : ''}`}
                aria-label={sitemapOpen ? (language === 'fr' ? 'Fermer le plan du site' : 'Close site map') : (language === 'fr' ? 'Ouvrir le plan du site' : 'Open site map')}
                aria-expanded={sitemapOpen}
                type="button"
                onClick={() => setSitemapOpen((open) => !open)}
              >
                <span className="nav-sitemap-lines" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </span>
              </button>

              <Link to="/contact" className="nav-book-review">
                {copy.bookReview}
              </Link>
            </div>

            <div className="nav-right">
              <div className="nav-links">
                {copy.navItems.map((item) => {
                  const isActive = isPathActive(item.matchPaths);

                  if (item.children) {
                    return (
                      <div key={item.path} className={`nav-item nav-item-has-children${isActive ? ' active' : ''}`}>
                        <Link to={item.path} className={`nav-link${isActive ? ' active' : ''}`}>
                          {item.label}
                        </Link>
                        <div className="nav-dropdown" aria-label={item.label}>
                          {item.children.map((child) => {
                            const childActive = isPathActive(child.matchPaths);
                            return (
                              <Link key={child.path} to={child.path} className={`nav-dropdown-link${childActive ? ' active' : ''}`}>
                                {child.label}
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    );
                  }

                  return (
                    <Link key={item.path} to={item.path} className={`nav-link${isActive ? ' active' : ''}`}>
                      {item.label}
                    </Link>
                  );
                })}
                <button className="nav-lang" type="button" onClick={toggleLanguage} title={languageButtonTitle}>
                  {languageButtonLabel}
                </button>
              </div>
            </div>
          </div>
        </nav>
      </header>

      <button
        type="button"
        className={`sitemap-backdrop${sitemapOpen ? ' open' : ''}`}
        aria-label={language === 'fr' ? 'Fermer le plan du site' : 'Close site map'}
        onClick={() => setSitemapOpen(false)}
      />

      <aside className={`sitemap-panel${sitemapOpen ? ' open' : ''}`} aria-hidden={!sitemapOpen}>
        <div className="sitemap-panel-inner">
          <div className="sitemap-links sitemap-links-compact">
            {copy.sitemapLinks.map((item) => {
              const isActive = isPathActive(item.matchPaths);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`sitemap-link compact${isActive ? ' active' : ''}`}
                  onClick={() => setSitemapOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="sitemap-actions">
            <button
              type="button"
              className="nav-lang mobile-lang-toggle"
              onClick={() => {
                toggleLanguage();
                setSitemapOpen(false);
              }}
              title={languageButtonTitle}
            >
              {languageButtonLabel}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Navbar;
