import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
  const { t, language } = useLanguage();

  return (
    <footer className="py-6 px-6 md:px-12 bg-white border-t border-[#1a1a1a]/5 relative overflow-hidden" data-testid="footer">
      {/* Geometric accent - bottom left */}
      <div className="absolute bottom-0 left-0 w-24 h-24 pointer-events-none">
        <svg viewBox="0 0 100 100" className="w-full h-full opacity-10">
          <polygon points="0,100 0,60 40,100" fill="#2D2380" />
          <polygon points="0,100 0,80 20,100" fill="#7b2cbf" />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
        {/* Left: Copyright */}
        <p 
          className="text-sm text-[#1a1a1a]/50"
          style={{fontFamily: "'Lato', sans-serif", fontWeight: 400}}
        >
          {t.footer.copyright}
        </p>

        {/* Center/Right: Contact info with pipes */}
        <div 
          className="flex items-center gap-3 text-sm"
          style={{fontFamily: "'Lato', sans-serif", fontWeight: 400}}
        >
          <a 
            href="mailto:martinlepage.ai@gmail.com" 
            className="text-[#1a1a1a]/60 hover:text-[#7b2cbf] transition-colors"
          >
            {language === 'fr' ? 'Courriel' : 'Email'}
          </a>
          <span className="text-[#1a1a1a]/30">|</span>
          <a 
            href="https://www.linkedin.com/in/martinlepage/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[#1a1a1a]/60 hover:text-[#7b2cbf] transition-colors"
          >
            LinkedIn
          </a>
          <span className="text-[#1a1a1a]/30">|</span>
          <Link 
            to="/about" 
            className="text-[#1a1a1a]/60 hover:text-[#7b2cbf] transition-colors"
          >
            {language === 'fr' ? 'À propos' : 'About'}
          </Link>
          
          {/* Hidden admin link */}
          <Link 
            to="/admin" 
            className="ml-4 w-1.5 h-1.5 rounded-full bg-[#1a1a1a]/10 hover:bg-[#7b2cbf] transition-colors"
            title=""
            data-testid="admin-link"
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
