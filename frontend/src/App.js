import './App.css';
import './site.css';
import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { localizePath, stripLocaleFromPath } from './lib/i18nRouting';

import Footer from './components/Footer';
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';
import TypographyPolish from './components/TypographyPolish';

import Admin from './pages/Admin';
import Game from './pages/Game';
import Home from './pages/Home';
import PortalArchitectureReference from './pages/PortalArchitectureReference';
import Privacy from './pages/Privacy';
import SealedCard from './pages/SealedCard';
import SurfaceBoundary from './pages/SurfaceBoundary';
import Terms from './pages/Terms';
import Tool from './pages/Tool';

// PHAROS-NEWLOOK is the canonical public informational shell for pharos-ai.ca.
const HOME_SURFACE_SECTIONS = {
  '/about': 'about',
  '/governance': 'governance',
  '/services': 'services',
  '/services/menu': 'services',
  '/observatory': 'governance',
  '/research': 'governance',
  '/methods': 'methods',
  '/about/conceptual-method': 'methods',
  '/faq': 'faq',
  '/contact': 'contact',
  '/connect': 'contact',
  '/assurance': 'governance',
  '/transparency': 'governance',
  '/trust': 'governance',
  '/auditability': 'governance',
  '/cases': 'services',
  '/library': 'methods'
};

const HOME_SURFACE_PATHS = new Set(['/', ...Object.keys(HOME_SURFACE_SECTIONS)]);

function scrollToSection(sectionId) {
  const target = document.getElementById(sectionId);
  if (!target) {
    return false;
  }

  target.scrollIntoView({ block: 'start' });
  return true;
}

function HomeSurfaceRoute({ sectionId }) {
  const location = useLocation();

  useEffect(() => {
    let rafOne = 0;
    let rafTwo = 0;
    let timeout = 0;

    const attemptScroll = () => {
      if (!scrollToSection(sectionId)) {
        timeout = window.setTimeout(attemptScroll, 120);
      }
    };

    rafOne = window.requestAnimationFrame(() => {
      rafTwo = window.requestAnimationFrame(attemptScroll);
    });

    return () => {
      window.cancelAnimationFrame(rafOne);
      window.cancelAnimationFrame(rafTwo);
      window.clearTimeout(timeout);
    };
  }, [location.pathname, sectionId]);

  return <Home />;
}

function AppRoutes() {
  const location = useLocation();
  const basePath = stripLocaleFromPath(location.pathname);
  const isHomeRoute = HOME_SURFACE_PATHS.has(basePath);
  const localized = (path, language) => localizePath(path, language, { force: true });
  const languages = ['en', 'fr'];

  return (
    <>
      <ScrollToTop />
      <TypographyPolish />
      <Navbar />
      <main className={`site-main ${isHomeRoute ? 'route-home' : 'route-interior'}`}>
        <Routes>
          {languages.map((language) => (
            <Route key={`home-${language}`} path={localized('/', language)} element={<Home />} />
          ))}
          <Route path="/game" element={<Game />} />
          {languages.map((language) => (
            <Route key={`services-${language}`} path={localized('/services', language)} element={<HomeSurfaceRoute sectionId="services" />} />
          ))}
          {languages.map((language) => (
            <Route key={`governance-${language}`} path={localized('/governance', language)} element={<HomeSurfaceRoute sectionId="governance" />} />
          ))}
          {languages.map((language) => (
            <Route key={`services-menu-${language}`} path={localized('/services/menu', language)} element={<HomeSurfaceRoute sectionId="services" />} />
          ))}
          {languages.map((language) => (
            <Route key={`tool-${language}`} path={localized('/tool', language)} element={<Tool />} />
          ))}
          {languages.map((language) => (
            <Route key={`assurance-${language}`} path={localized('/assurance', language)} element={<HomeSurfaceRoute sectionId="governance" />} />
          ))}
          {languages.map((language) => (
            <Route key={`transparency-${language}`} path={localized('/transparency', language)} element={<HomeSurfaceRoute sectionId="governance" />} />
          ))}
          {languages.map((language) => (
            <Route key={`faq-${language}`} path={localized('/faq', language)} element={<HomeSurfaceRoute sectionId="faq" />} />
          ))}
          {languages.map((language) => (
            <Route key={`privacy-${language}`} path={localized('/privacy', language)} element={<Privacy />} />
          ))}
          {languages.map((language) => (
            <Route key={`terms-${language}`} path={localized('/terms', language)} element={<Terms />} />
          ))}
          {languages.map((language) => (
            <Route key={`research-${language}`} path={localized('/research', language)} element={<HomeSurfaceRoute sectionId="governance" />} />
          ))}
          {languages.map((language) => (
            <Route key={`observatory-${language}`} path={localized('/observatory', language)} element={<HomeSurfaceRoute sectionId="governance" />} />
          ))}
          {languages.map((language) => (
            <Route key={`cases-${language}`} path={localized('/cases', language)} element={<HomeSurfaceRoute sectionId="services" />} />
          ))}
          {languages.map((language) => (
            <Route key={`about-${language}`} path={localized('/about', language)} element={<HomeSurfaceRoute sectionId="about" />} />
          ))}
          {languages.map((language) => (
            <Route
              key={`conceptual-method-${language}`}
              path={localized('/about/conceptual-method', language)}
              element={<HomeSurfaceRoute sectionId="methods" />}
            />
          ))}
          {languages.map((language) => (
            <Route key={`methods-${language}`} path={localized('/methods', language)} element={<HomeSurfaceRoute sectionId="methods" />} />
          ))}
          {languages.map((language) => (
            <Route key={`connect-${language}`} path={localized('/connect', language)} element={<HomeSurfaceRoute sectionId="contact" />} />
          ))}
          {languages.map((language) => (
            <Route key={`contact-${language}`} path={localized('/contact', language)} element={<HomeSurfaceRoute sectionId="contact" />} />
          ))}
          {languages.map((language) => (
            <Route key={`library-${language}`} path={localized('/library', language)} element={<HomeSurfaceRoute sectionId="methods" />} />
          ))}
          {languages.map((language) => (
            <Route
              key={`portal-aurora-${language}`}
              path={localized('/portal/compassai/aurora', language)}
              element={<PortalArchitectureReference routePath={localized('/portal/compassai/aurora', language)} testId="portal-aurorai-page" />}
            />
          ))}
          {languages.map((language) => (
            <Route
              key={`portal-legacy-aurora-${language}`}
              path={localized('/portal/aurorai', language)}
              element={<Navigate to={localized('/portal/compassai/aurora', language)} replace />}
            />
          ))}
          {languages.map((language) => (
            <Route
              key={`portal-compass-${language}`}
              path={localized('/portal/compassai', language)}
              element={<PortalArchitectureReference routePath={localized('/portal/compassai', language)} testId="portal-compassai-page" />}
            />
          ))}
          <Route path="/sealed-card" element={<SealedCard />} />
          {languages.map((language) => (
            <Route
              key={`portfolio-${language}`}
              path={localized('/portfolio', language)}
              element={(
                <SurfaceBoundary
                  eyebrow={language === 'fr' ? 'Mise a jour de perimetre' : 'Boundary update'}
                  title={language === 'fr' ? 'Le contenu portfolio a ete retire de la surface PHAROS.' : 'Portfolio material has moved off the PHAROS surface.'}
                  body={language === 'fr'
                    ? 'Le profil de Martin Lepage, son CV, son portfolio et les autres travaux hors PHAROS appartiennent a une surface Martin distincte, et non a pharos-ai.ca. Cette route demeure hors de la coquille publique PHAROS pendant la migration.'
                    : 'Martin Lepage profile, resume, portfolio, and other non-PHAROS work belong on an external Martin-owned surface, not on pharos-ai.ca. This route remains out of the PHAROS public shell during the migration.'}
                />
              )}
            />
          ))}
          {languages.map((language) => (
            <Route key={`trust-${language}`} path={localized('/trust', language)} element={<HomeSurfaceRoute sectionId="governance" />} />
          ))}
          {languages.map((language) => (
            <Route key={`auditability-${language}`} path={localized('/auditability', language)} element={<HomeSurfaceRoute sectionId="governance" />} />
          ))}
          <Route path="/admin" element={<Admin />} />
          {languages.map((language) => (
            <Route
              key={`publication-boundary-${language}`}
              path={localized('/publications/trust-advantage-analysis', language)}
              element={(
                <SurfaceBoundary
                  eyebrow={language === 'fr' ? 'Mise a jour de perimetre' : 'Boundary update'}
                  title={language === 'fr' ? 'Les routes de publication sont hors du perimetre du site PHAROS.' : 'Publication routes are outside the PHAROS site boundary.'}
                  body={language === 'fr'
                    ? 'Ce depot ne traite plus les pages de publication comme faisant partie de la surface publique PHAROS. Le travail editorial et centre sur Martin doit vivre sur une surface Martin distincte.'
                    : 'This repo no longer treats publication pages as part of the PHAROS public surface. Editorial and Martin-centered publication work should live on an external Martin-owned surface instead.'}
                />
              )}
            />
          ))}
        </Routes>
      </main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <div className="App min-h-screen">
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <LanguageProvider>
          <AppRoutes />
        </LanguageProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
