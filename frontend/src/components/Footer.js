import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="py-3 px-6 md:px-12 bg-white border-t border-[#0B0F1A]/5" data-testid="footer">
      <div className="max-w-6xl mx-auto flex items-center">
        <p className="text-sm text-[#0B0F1A]/40">
          {t.footer.copyright}
        </p>
        <Link 
          to="/admin" 
          className="ml-4 w-1.5 h-1.5 rounded-full bg-[#0B0F1A]/10 hover:bg-[#1A1050] transition-colors"
          title=""
          data-testid="admin-link"
        />
      </div>
    </footer>
  );
};

export default Footer;
