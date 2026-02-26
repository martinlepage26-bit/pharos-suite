import { useLocation } from 'react-router-dom';

const PageMonogram = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  if (isHomePage) return null;

  return (
    <div className="fixed top-14 right-6 z-40 pointer-events-none">
      <img 
        src="/images/mono-corner-nobg.png" 
        alt="" 
        className="w-16 h-auto opacity-60"
      />
    </div>
  );
};

export default PageMonogram;
