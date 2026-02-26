import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

// Small logo icon for footer
const FooterLogo = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 100 100" className={className}>
    <defs>
      <linearGradient id="footerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6366f1" />
        <stop offset="100%" stopColor="#8b5cf6" />
      </linearGradient>
    </defs>
    <g transform="rotate(45, 50, 50)">
      <rect x="18" y="18" width="64" height="64" fill="none" stroke="#1a2744" strokeWidth="2.5"/>
      <rect x="28" y="28" width="44" height="44" fill="none" stroke="#1a2744" strokeWidth="1.5"/>
    </g>
    <polygon points="50,8 54,22 50,18 46,22" fill="#1a2744"/>
    <polygon points="92,50 78,54 82,50 78,46" fill="#1a2744"/>
    <polygon points="50,92 46,78 50,82 54,78" fill="#1a2744"/>
    <polygon points="8,50 22,46 18,50 22,54" fill="#1a2744"/>
    <ellipse cx="50" cy="50" rx="11" ry="7" fill="none" stroke="url(#footerGradient)" strokeWidth="2"/>
    <circle cx="50" cy="50" r="4" fill="url(#footerGradient)"/>
  </svg>
);

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="py-6 px-6 md:px-12 bg-[#f8f9fc] border-t border-gray-200" data-testid="footer">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <p className="text-sm text-gray-500">
            {t.footer.copyright}
          </p>
          <Link 
            to="/admin" 
            className="w-2 h-2 rounded-full bg-gray-300 hover:bg-[#6366f1] transition-colors opacity-50 hover:opacity-100"
            title=""
            data-testid="admin-link"
          />
        </div>
        <div className="flex items-center gap-2">
          <FooterLogo className="w-8 h-8 opacity-70" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
