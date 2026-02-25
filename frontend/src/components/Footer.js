import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const LOGO_URL = process.env.REACT_APP_LOGO_URL || "https://customer-assets.emergentagent.com/job_site-resurrection-1/artifacts/98548zap_logo.png";

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
        <img 
          src={LOGO_URL} 
          alt="AI Governance" 
          className="w-10 h-10 object-contain opacity-80"
          data-testid="footer-logo"
        />
      </div>
    </footer>
  );
};

export default Footer;
