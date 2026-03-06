import { useLocation } from 'react-router-dom';
import lighthouseMark from '../assets/logos/governance-lighthouse-simplified.svg';

const PageMonogram = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  if (isHomePage) return null;

  return (
    <div className="pointer-events-none absolute right-6 top-24 z-40 hidden xl:block">
      <div className="relative flex h-20 w-20 items-center justify-center rounded-[24px] border border-[#B89B5E]/14 bg-[#FBF7EF]/58 backdrop-blur-md">
        <div className="absolute inset-[16px] rotate-45 rounded-[6px] border border-[#B89B5E]/18" />
        <img
          src={lighthouseMark}
          alt=""
          className="relative h-12 w-12 opacity-[0.28] mix-blend-multiply"
        />
      </div>
    </div>
  );
};

export default PageMonogram;
