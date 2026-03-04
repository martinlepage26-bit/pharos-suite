import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const Navbar = () => {
  const location = useLocation();
  const { t, language, toggleLanguage } = useLanguage();

  const navItems = [
    { path: '/', label: t.nav.home },
    { path: '/services', label: t.nav.services },
    { path: '/research', label: t.nav.research },
    { path: '/library', label: t.nav.library },
    { path: '/about', label: t.nav.about },
    { path: '/connect', label: t.nav.connect }
  ];

  return (
    <nav className="w-full px-6 md:px-10 py-2.5 bg-white sticky top-0 z-50 border-b border-[#0B0F1A]/10" data-testid="navbar">
      <div className="max-w-[1200px] mx-auto flex items-center justify-between gap-5">
        <Link to="/" className="flex items-baseline gap-2" data-testid="nav-brand">
          <span
            className="text-[29px] md:text-[32px] font-semibold leading-none text-[#111827]"
            style={{ fontFamily: "'Source Serif 4', serif" }}
          >
            Martin Lepage PhD
          </span>
          <span
            className="hidden md:block text-[14px] leading-none text-[#111827]/45"
            style={{ fontFamily: "'Lato', sans-serif" }}
          >
            {language === 'fr' ? 'Consultant en Gouvernance IA' : 'AI Governance Consulting'}
          </span>
        </Link>

        <div className="flex items-center gap-1 md:gap-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`text-[10px] md:text-[11px] tracking-[0.12em] uppercase px-2.5 py-1 rounded-full transition-all ${
                  isActive
                    ? 'text-[#0D0A2E] bg-[#EEF0FF] border border-[#0D0A2E]/20'
                    : 'text-[#0B0F1A]/50 hover:text-[#0B0F1A]'
                }`}
                style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 500 }}
              >
                {item.label}
              </Link>
            );
          })}
          <button
            onClick={toggleLanguage}
            data-testid="lang-toggle"
            className="text-[10px] md:text-[11px] tracking-[0.12em] uppercase text-[#0B0F1A]/50 hover:text-[#0B0F1A] px-2 py-1"
            style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 500 }}
          >
            {language === 'en' ? 'FR' : 'EN'}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
