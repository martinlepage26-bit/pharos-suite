import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

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
    <nav className="w-full py-3 px-6 md:px-12 flex justify-between items-center bg-white sticky top-0 z-50 border-b border-[#0B0F1A]/5" data-testid="navbar">
      {/* Logo - ML Monogram with Compass - 200% bigger */}
      <Link to="/" className="flex items-center" data-testid="logo-link">
        <img 
          src="/images/ml-mono-final.png" 
          alt="ML" 
          className="h-12 w-auto"
        />
      </Link>

      {/* Navigation */}
      <div className="flex gap-4 md:gap-6 items-center">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            data-testid={`nav-${item.path.replace('/', '') || 'home'}`}
            className={`text-xs md:text-sm font-medium tracking-wide transition-colors hover:text-[#4B2ABF] ${
              location.pathname === item.path
                ? 'text-[#0B0F1A]'
                : 'text-[#0B0F1A]/50'
            }`}
          >
            {item.label}
          </Link>
        ))}
        <button
          onClick={toggleLanguage}
          data-testid="lang-toggle"
          className="ml-2 px-2.5 py-1 text-xs font-medium tracking-wide text-[#0B0F1A]/60 hover:text-[#4B2ABF] transition-colors"
        >
          {language === 'en' ? 'FR' : 'EN'}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
