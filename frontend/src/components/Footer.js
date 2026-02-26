import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

// Small compass NE for footer
const FooterCompass = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 40 40" className={className}>
    <circle cx="20" cy="20" r="15" fill="none" stroke="currentColor" strokeWidth="1"/>
    <line x1="20" y1="20" x2="32" y2="8" stroke="#6366f1" strokeWidth="2"/>
    <polygon points="32,8 25,10 30,15" fill="#6366f1"/>
    <circle cx="20" cy="20" r="2" fill="currentColor"/>
  </svg>
);

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="py-6 px-6 md:px-12 bg-white border-t border-black/5" data-testid="footer">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <p className="text-sm text-[#0a0a0a]/50">
            {t.footer.copyright}
          </p>
          <Link 
            to="/admin" 
            className="w-1.5 h-1.5 rounded-full bg-black/10 hover:bg-[#6366f1] transition-colors"
            title=""
            data-testid="admin-link"
          />
        </div>
        <div className="flex items-center gap-3">
          <span className="font-serif text-sm text-[#0a0a0a]/40 tracking-tight">ML</span>
          <FooterCompass className="w-5 h-5 text-[#0a0a0a]/30" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
