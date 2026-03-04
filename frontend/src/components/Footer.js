import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
  const { language } = useLanguage();

  return (
    <footer className="mt-12 border-t border-[#0B0F1A]/10 bg-white" data-testid="footer">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-10">
        <div className="rounded-2xl bg-gradient-to-r from-[#0D0A2E] via-[#1A1457] to-[#302186] p-6 md:p-8 text-white mb-8">
          <p
            className="text-2xl md:text-3xl leading-tight mb-2"
            style={{ fontFamily: "'Source Serif 4', serif", fontWeight: 600 }}
          >
            {language === 'fr' ? 'Besoin d’un cadre gouvernable?' : 'Need a governable AI posture?'}
          </p>
          <p className="text-white/80 text-sm mb-4" style={{ fontFamily: "'Lato', sans-serif" }}>
            {language === 'fr'
              ? 'Réservez un débrief de 20 minutes pour prioriser vos contrôles.'
              : 'Book a 20-minute debrief to prioritize controls and evidence.'}
          </p>
          <Link
            to="/connect"
            className="inline-flex items-center rounded-full bg-white text-[#0D0A2E] px-5 py-2 text-sm font-medium"
            style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
          >
            {language === 'fr' ? 'Réserver' : 'Book a debrief'}
          </Link>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-sm text-[#0B0F1A]/70">
          <p style={{ fontFamily: "'Lato', sans-serif" }}>© 2026 Martin Lepage PhD · Govern AI</p>
          <div className="flex items-center gap-4" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
            <a href="mailto:consult@govern-ai.ca" className="hover:text-[#0D0A2E]">consult@govern-ai.ca</a>
            <a href="https://www.linkedin.com/in/martinlepage/" target="_blank" rel="noreferrer" className="hover:text-[#0D0A2E]">LinkedIn</a>
            <Link to="/about" className="hover:text-[#0D0A2E]">{language === 'fr' ? 'À propos' : 'About'}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
