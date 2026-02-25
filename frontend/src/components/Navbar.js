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
    <nav className="w-full py-4 px-6 md:px-12 flex justify-end items-center bg-white/80 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-100" data-testid="navbar">
      <div className="flex gap-5 md:gap-6 items-center">
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
