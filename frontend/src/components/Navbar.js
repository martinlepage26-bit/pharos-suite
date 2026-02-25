import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'HOME' },
    { path: '/services', label: 'SERVICES' },
    { path: '/tool', label: 'TOOL' },
    { path: '/faq', label: 'FAQ' },
    { path: '/research', label: 'RESEARCH' },
    { path: '/about', label: 'ABOUT' },
    { path: '/connect', label: 'CONNECT' },
  ];

  return (
    <nav className="w-full py-4 px-6 md:px-12 flex justify-end items-center bg-white/80 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-100" data-testid="navbar">
      <div className="flex gap-6 md:gap-8">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            data-testid={`nav-${item.label.toLowerCase()}`}
            className={`text-xs md:text-sm font-medium tracking-wide transition-colors hover:text-[#6366f1] ${
              location.pathname === item.path
                ? 'text-[#1a2744] border-b-2 border-[#6366f1] pb-1'
                : 'text-gray-500'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
