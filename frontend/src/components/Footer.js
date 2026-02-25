const LOGO_URL = "https://customer-assets.emergentagent.com/job_site-resurrection-1/artifacts/98548zap_logo.png";

const Footer = () => {
  return (
    <footer className="py-6 px-6 md:px-12 bg-[#f8f9fc] border-t border-gray-200" data-testid="footer">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <p className="text-sm text-gray-500">
          &copy; 2026 Martin Lepage, PhD. AI Governance Practice & Research
        </p>
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
