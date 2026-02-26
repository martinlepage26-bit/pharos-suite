import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

// SVG Logo Icon - Diamond with eye (simplified from logo-main.png)
const LogoIcon = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 100 100" className={className} fill="currentColor">
    <g transform="rotate(45, 50, 50)">
      {/* Outer diamond */}
      <rect x="15" y="15" width="70" height="70" fill="none" stroke="currentColor" strokeWidth="3"/>
      {/* Inner diamond */}
      <rect x="25" y="25" width="50" height="50" fill="none" stroke="currentColor" strokeWidth="2"/>
      {/* Compass points */}
      <polygon points="50,5 55,20 50,15 45,20" />
      <polygon points="95,50 80,55 85,50 80,45" />
      <polygon points="50,95 45,80 50,85 55,80" />
      <polygon points="5,50 20,45 15,50 20,55" />
    </g>
    {/* Eye in center */}
    <ellipse cx="50" cy="50" rx="12" ry="8" fill="none" stroke="currentColor" strokeWidth="2"/>
    <circle cx="50" cy="50" r="4" />
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
    <nav className="w-full py-3 px-6 md:px-12 flex justify-between items-center bg-white/90 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-100" data-testid="navbar">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-3 group" data-testid="logo-link">
        <LogoIcon className="w-9 h-9 text-[#1a2744] group-hover:text-[#6366f1] transition-colors" />
        <div className="hidden sm:block">
          <span className="font-serif text-lg font-semibold text-[#1a2744] tracking-tight">ML</span>
        </div>
      </Link>

      {/* Navigation */}
      <div className="flex gap-4 md:gap-5 items-center">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            data-testid={`nav-${item.path.replace('/', '') || 'home'}`}
            className={`text-xs md:text-sm font-medium tracking-wide transition-colors hover:text-[#6366f1] ${
              location.pathname === item.path
                ? 'text-[#1a2744] border-b-2 border-[#6366f1] pb-1'
                : 'text-gray-500'
            }`}
          >
            {item.label}
          </Link>
        ))}
        <button
          onClick={toggleLanguage}
          data-testid="lang-toggle"
          className="ml-2 px-2.5 py-1 rounded-full text-xs font-bold tracking-wide border border-gray-300 text-gray-600 hover:border-[#6366f1] hover:text-[#6366f1] transition-colors"
        >
          {language === 'en' ? 'FR' : 'EN'}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
