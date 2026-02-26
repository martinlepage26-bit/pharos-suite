import { useLocation } from 'react-router-dom';

const PageMonogram = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  if (isHomePage) return null;

  return (
    <div className="fixed top-12 right-6 z-40 pointer-events-none">
      <img 
        src="/images/mono3-transparent.png" 
        alt="" 
        className="w-14 h-auto opacity-70"
      />
    </div>
  );
};

export default PageMonogram;
