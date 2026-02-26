import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="py-6 px-6 md:px-12 bg-white border-t border-[#0B0F1A]/5" data-testid="footer">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Left: Copyright */}
        <div className="flex items-center gap-4">
          <p className="text-sm text-[#0B0F1A]/40">
            {t.footer.copyright}
          </p>
          <Link 
            to="/admin" 
            className="w-1.5 h-1.5 rounded-full bg-[#0B0F1A]/10 hover:bg-[#180E66] transition-colors"
            title=""
            data-testid="admin-link"
          />
        </div>
        
        {/* Right: Monogram - halfway to middle from right */}
        <div className="flex-1 flex justify-center mr-[25%]">
          <img 
            src="/images/ml-joined-nobg.png" 
            alt="ML" 
            className="h-8 w-auto opacity-30"
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
