import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const ServiceMenu = () => {
  const { t } = useLanguage();

  const packageKeys = ['p1', 'p2', 'p3'];

  const driverKeys = ['useCase', 'review', 'decision'];

  return (
    <div className="min-h-screen bg-[#F6F7FB] py-12 px-6 md:px-12" data-testid="service-menu-page">
      <div className="max-w-5xl mx-auto">
        <h1 className="font-serif text-6xl md:text-6xl font-semibold text-[#0B0F1A] mb-4">{t.serviceMenu.title}</h1>
        <p className="text-gray-600 mb-2 max-w-2xl">{t.serviceMenu.description}</p>
        <p className="text-xs tracking-widest text-gray-400 uppercase mb-12">{t.serviceMenu.keywords}</p>

        {packageKeys.map((key, index) => {
          const pkg = t.serviceMenu.packages[key];
          return (
            <div key={key} className="card mb-8" data-testid={`package-${index + 1}`} id={`package-${index + 1}`}>
              <h2 className="font-serif text-6xl font-semibold text-[#0B0F1A] mb-2">{pkg.title}</h2>
              <p className="text-gray-500 text-sm mb-6">
                <span className="font-medium">{t.serviceMenu.bestFor}</span> {pkg.bestFor}
              </p>
              <div className="grid md:grid-cols-2 gap-8 mb-6">
                <div className="bg-[#F6F7FB] rounded-lg p-4">
                  <h3 className="font-serif text-6xl font-semibold text-[#0B0F1A] mb-3">{t.serviceMenu.deliverables}</h3>
                  <ul className="space-y-2">
                    {pkg.deliverables.map((item, i) => (
                      <li key={i} className="text-gray-600 text-sm flex items-start"><span className="mr-2">•</span>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-[#F6F7FB] rounded-lg p-4">
                  <h3 className="font-serif text-6xl font-semibold text-[#0B0F1A] mb-3">{t.serviceMenu.whatItProduces}</h3>
                  <ul className="space-y-2">
                    {pkg.produces.map((item, i) => (
                      <li key={i} className="text-gray-600 text-sm flex items-start"><span className="mr-2">•</span>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                {index === 2 ? (
                  <>
                    <Link to="/connect" className="btn-primary">{t.serviceMenu.book30Min}</Link>
                    <Link to="/tool" className="btn-ghost">{t.serviceMenu.assessReadiness}</Link>
                  </>
                ) : (
                  <>
                    <Link to="/connect" className="btn-primary">{t.serviceMenu.discussPackage}</Link>
                    <button onClick={() => document.getElementById(`package-${index + 2}`)?.scrollIntoView({ behavior: 'smooth' })} className="btn-ghost">{t.serviceMenu.nextPackage}</button>
                  </>
                )}
              </div>
            </div>
          );
        })}

        <h2 className="font-serif text-6xl font-semibold text-[#0B0F1A] mb-4">{t.serviceMenu.engagementDrivers}</h2>
        <p className="text-gray-600 mb-6">{t.serviceMenu.engagementDriversDesc}</p>
        <div className="grid md:grid-cols-3 gap-6">
          {driverKeys.map((key, index) => (
            <div key={key} className="card" data-testid={`engagement-driver-${index}`}>
              <h3 className="font-serif text-6xl font-semibold text-[#0B0F1A] mb-3">{t.serviceMenu.drivers[key].title}</h3>
              <p className="text-gray-600 text-sm">{t.serviceMenu.drivers[key].description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceMenu;
