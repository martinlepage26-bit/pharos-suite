import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const NAV_COPY = {
  en: {
    navItems: [
      { path: '/', label: 'HOME', matchPaths: ['/'] },
      { path: '/about', label: 'ABOUT', matchPaths: ['/about'] },
      { path: '/observatory', label: 'OBSERVATORY', matchPaths: ['/observatory', '/research'] },
      { path: '/governance', label: 'GOVERNANCE', matchPaths: ['/governance', '/services'] },
      { path: '/methods', label: 'METHODS', matchPaths: ['/methods', '/about/conceptual-method'] },
      { path: '/contact', label: 'CONTACT', matchPaths: ['/contact', '/connect'] }
    ],
    sitemapLabel: 'Site map',
    sitemapIntro: 'Public PHAROS surfaces and observatory working layers',
    sitemapSections: [
      {
        title: 'Primary',
        links: [
          { path: '/', label: 'HOME', note: 'Entrance and overview' },
          { path: '/about', label: 'ABOUT', note: 'System brief' },
          { path: '/observatory', label: 'OBSERVATORY', note: 'Models, institutions, standards, and claims' },
          { path: '/governance', label: 'GOVERNANCE', note: 'Comparison, review, and legibility' },
          { path: '/methods', label: 'METHODS', note: 'Evidence, analysis, and oversight' },
          { path: '/contact', label: 'CONTACT', note: 'Research and collaboration inquiries' }
        ]
      },
      {
        title: 'Secondary',
        links: [
          { path: '/tool', label: 'TOOL', note: 'Quick readiness signal', featured: true },
          { path: '/faq', label: 'FAQ', note: 'Fast answers' },
          { path: '/library', label: 'LIBRARY', note: 'Frameworks and sources' },
          { path: '/cases', label: 'CASES', note: 'Case readings' }
        ]
      }
    ],
    mobileContact: 'CONTACT',
    meetingCta: 'BOOK A MEETING'
  },
  fr: {
    navItems: [
      { path: '/', label: 'ACCUEIL', matchPaths: ['/'] },
      { path: '/about', label: 'A PROPOS', matchPaths: ['/about'] },
      { path: '/observatory', label: 'OBSERVATOIRE', matchPaths: ['/observatory', '/research'] },
      { path: '/governance', label: 'GOUVERNANCE', matchPaths: ['/governance', '/services'] },
      { path: '/methods', label: 'METHODES', matchPaths: ['/methods', '/about/conceptual-method'] },
      { path: '/contact', label: 'CONTACT', matchPaths: ['/contact', '/connect'] }
    ],
    sitemapLabel: 'Plan du site',
    sitemapIntro: 'Surfaces publiques de PHAROS et couches de travail de l observatoire',
    sitemapSections: [
      {
        title: 'Principales',
        links: [
          { path: '/', label: 'ACCUEIL', note: 'Entree et vue d ensemble' },
          { path: '/about', label: 'A PROPOS', note: 'Presentation du systeme' },
          { path: '/observatory', label: 'OBSERVATOIRE', note: 'Modeles, institutions, normes et revendications' },
          { path: '/governance', label: 'GOUVERNANCE', note: 'Comparaison, revue et lisibilite' },
          { path: '/methods', label: 'METHODES', note: 'Preuve, analyse et supervision' },
          { path: '/contact', label: 'CONTACT', note: 'Demandes de recherche et collaboration' }
        ]
      },
      {
        title: 'Secondaires',
        links: [
          { path: '/tool', label: 'OUTIL', note: 'Signal rapide de preparation', featured: true },
          { path: '/faq', label: 'FAQ', note: 'Reponses rapides' },
          { path: '/library', label: 'BIBLIOTHEQUE', note: 'Cadres et sources' },
          { path: '/cases', label: 'CAS', note: 'Lectures de cas' }
        ]
      }
    ],
    mobileContact: 'CONTACT',
    meetingCta: 'RESERVER UN ECHANGE'
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

  return (
    <>
      <nav className={navClass} data-testid="navbar">
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
              <span className="nav-sitemap-label">{copy.sitemapLabel}</span>
            </button>

              <Link to="/" className="nav-brand" aria-label={language === 'fr' ? 'Accueil PHAROS' : 'PHAROS home'}>
                <span className="nav-wordmark">PHAROS</span>
              </Link>
            </div>

          <div className="nav-right">
            <div className="nav-links">
              {copy.navItems.map((item) => {
                const isActive = item.matchPaths.some((path) => (
                  path === '/'
                    ? location.pathname === '/'
                    : location.pathname === path || location.pathname.startsWith(`${path}/`)
                ));

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
            <Link to="/contact" className="nav-meeting">
              {copy.meetingCta}
            </Link>
          </div>
        </div>
      </nav>

      <button
        type="button"
        className={`sitemap-backdrop${sitemapOpen ? ' open' : ''}`}
        aria-label={language === 'fr' ? 'Fermer le plan du site' : 'Close site map'}
        onClick={() => setSitemapOpen(false)}
      />

      <aside className={`sitemap-panel${sitemapOpen ? ' open' : ''}`} aria-hidden={!sitemapOpen}>
        <div className="sitemap-panel-inner">
          <div className="sitemap-header">
            <p className="eyebrow">{copy.sitemapLabel}</p>
            <p className="sitemap-intro">{copy.sitemapIntro}</p>
          </div>

          <div className="sitemap-grid">
            {copy.sitemapSections.map((section) => (
              <div key={section.title} className="sitemap-section">
                <p className="sitemap-section-title">{section.title}</p>
                <div className="sitemap-links">
                  {section.links.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`sitemap-link${item.featured ? ' featured' : ''}`}
                      onClick={() => setSitemapOpen(false)}
                    >
                      <span className="sitemap-link-title">{item.label}</span>
                      <span className="sitemap-link-meta">{item.note}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="sitemap-actions">
            <Link to="/contact" className="nav-cta-mobile" onClick={() => setSitemapOpen(false)}>
              {copy.meetingCta}
            </Link>
            <Link to="/contact" className="nav-cta-mobile" onClick={() => setSitemapOpen(false)}>
              {copy.mobileContact}
            </Link>
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
