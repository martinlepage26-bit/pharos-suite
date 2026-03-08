import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import LighthouseGlyph from './LighthouseGlyph';

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/services', label: 'Services' },
  { path: '/showcase', label: 'Showcase' },
  { path: '/research', label: 'Research' },
  { path: '/about', label: 'About' },
  { path: '/connect', label: 'Connect' }
];

const Navbar = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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

  const isShowcase = location.pathname.startsWith('/showcase');
  const homeHeroVisible = location.pathname === '/' && !scrolled;
  const navClass = ['nav', scrolled || isShowcase ? 'scrolled' : '', homeHeroVisible ? 'hero-visible' : '', isShowcase ? 'showcase-nav' : '']
    .filter(Boolean)
    .join(' ');

  return (
    <>
      <nav className={navClass} data-testid="navbar">
        <div className="nav-inner">
          <Link to="/" className="nav-brand" aria-label="Govern AI home">
            <LighthouseGlyph className="nav-logo" />
            <span className="nav-wordmark">Govern AI</span>
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
              <button className="nav-lang" type="button" disabled title="French version coming soon" aria-disabled="true">
                FR
              </button>
            </div>
            <button
              className={`nav-hamburger${menuOpen ? ' open' : ''}`}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
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

      <div className={`mobile-menu${menuOpen ? ' open' : ''}${isShowcase ? ' showcase-menu' : ''}`}>
        {navItems.map((item) => (
          <Link key={item.path} to={item.path} onClick={() => setMenuOpen(false)}>
            {item.label}
          </Link>
        ))}
        <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-muted)' }}>
          FR coming soon
        </span>
      </div>
    </>
  );
};

export default Navbar;
