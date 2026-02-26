import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

// ML Monogram with merged letters - black only
const MLMonogram = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 100 100" className={className} fill="currentColor">
    {/* M shape */}
    <path d="M15 80 L15 25 L35 55 L50 30 L65 55 L85 25 L85 80 L75 80 L75 45 L60 70 L50 55 L40 70 L25 45 L25 80 Z" 
          fill="none" stroke="currentColor" strokeWidth="4" strokeLinejoin="round"/>
    {/* L integrated as the right leg emphasized */}
    <line x1="75" y1="50" x2="75" y2="80" stroke="currentColor" strokeWidth="5"/>
    <line x1="75" y1="80" x2="90" y2="80" stroke="currentColor" strokeWidth="5"/>
  </svg>
);

// Compass NE symbol - simplified
const CompassNE = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 40 40" className={className}>
    {/* NE Arrow */}
    <path d="M8 32 L32 8" stroke="currentColor" strokeWidth="2.5" fill="none"/>
    <polygon points="32,8 24,10 30,16" fill="currentColor"/>
    {/* Small compass circle */}
    <circle cx="20" cy="20" r="3" fill="none" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

const Navbar = () => {
  const location = useLocation();
  const { t, language, toggleLanguage } = useLanguage();
  
  const navItems = [
    { path: '/', label: t.nav.home },
    { path: '/services', label: t.nav.services },
    { path: '/cases', label: t.nav.cases },
    { path: '/tool', label: t.nav.tool },
    { path: '/research', label: t.nav.research },
    { path: '/library', label: t.nav.library },
    { path: '/about', label: t.nav.about },
    { path: '/connect', label: t.nav.connect },
  ];

  return (
    <nav className="w-full py-4 px-6 md:px-12 flex justify-between items-center bg-white sticky top-0 z-50 border-b border-black/5" data-testid="navbar">
      {/* Logo - ML Monogram */}
      <Link to="/" className="flex items-center gap-2 group" data-testid="logo-link">
        <span className="font-serif text-2xl font-semibold text-[#0a0a0a] tracking-tight group-hover:text-[#6366f1] transition-colors">ML</span>
        <CompassNE className="w-5 h-5 text-[#6366f1] opacity-80" />
      </Link>

      {/* Navigation */}
      <div className="flex gap-4 md:gap-6 items-center">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            data-testid={`nav-${item.path.replace('/', '') || 'home'}`}
            className={`text-xs md:text-sm font-medium tracking-wide transition-colors hover:text-[#6366f1] ${
              location.pathname === item.path
                ? 'text-[#0a0a0a]'
                : 'text-[#0a0a0a]/50'
            }`}
          >
            {item.label}
          </Link>
        ))}
        <button
          onClick={toggleLanguage}
          data-testid="lang-toggle"
          className="ml-2 px-2.5 py-1 text-xs font-medium tracking-wide text-[#0a0a0a]/60 hover:text-[#6366f1] transition-colors"
        >
          {language === 'en' ? 'FR' : 'EN'}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
