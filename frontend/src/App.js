import './App.css';
import './site.css';
import './game.css';
import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';

import Footer from './components/Footer';
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';
import TypographyPolish from './components/TypographyPolish';

import Admin from './pages/Admin';
import Game from './pages/Game';
import Home from './pages/Home';
import PortalAurorAI from './pages/PortalAurorAI';
import PortalCompassAI from './pages/PortalCompassAI';
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
  const isHomeRoute = HOME_SURFACE_PATHS.has(location.pathname);

  return (
    <>
      <ScrollToTop />
      <TypographyPolish />
      <Navbar />
      <main className={`site-main ${isHomeRoute ? 'route-home' : 'route-interior'}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/game" element={<Game />} />
          <Route path="/services" element={<HomeSurfaceRoute sectionId="services" />} />
          <Route path="/governance" element={<HomeSurfaceRoute sectionId="governance" />} />
          <Route path="/services/menu" element={<HomeSurfaceRoute sectionId="services" />} />
          <Route path="/tool" element={<Tool />} />
          <Route path="/assurance" element={<HomeSurfaceRoute sectionId="governance" />} />
          <Route path="/transparency" element={<HomeSurfaceRoute sectionId="governance" />} />
          <Route path="/faq" element={<HomeSurfaceRoute sectionId="faq" />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/research" element={<HomeSurfaceRoute sectionId="governance" />} />
          <Route path="/observatory" element={<HomeSurfaceRoute sectionId="governance" />} />
          <Route path="/cases" element={<HomeSurfaceRoute sectionId="services" />} />
          <Route path="/about" element={<HomeSurfaceRoute sectionId="about" />} />
          <Route path="/about/conceptual-method" element={<HomeSurfaceRoute sectionId="methods" />} />
          <Route path="/methods" element={<HomeSurfaceRoute sectionId="methods" />} />
          <Route path="/connect" element={<HomeSurfaceRoute sectionId="contact" />} />
          <Route path="/contact" element={<HomeSurfaceRoute sectionId="contact" />} />
          <Route path="/library" element={<HomeSurfaceRoute sectionId="methods" />} />
          <Route path="/portal/compassai/aurora" element={<PortalAurorAI />} />
          <Route path="/portal/aurorai" element={<Navigate to="/portal/compassai/aurora" replace />} />
          <Route path="/portal/compassai" element={<PortalCompassAI />} />
          <Route path="/sealed-card" element={<SealedCard />} />
          <Route
            path="/portfolio"
            element={(
              <SurfaceBoundary
                eyebrow="Boundary update"
                title="Portfolio material has moved off the PHAROS surface."
                body="Martin Lepage profile, resume, portfolio, and other non-PHAROS work belong on pharossuite.ca, not on pharos-ai.ca. This route remains out of the PHAROS public shell during the migration."
              />
            )}
          />
          <Route path="/trust" element={<HomeSurfaceRoute sectionId="governance" />} />
          <Route path="/auditability" element={<HomeSurfaceRoute sectionId="governance" />} />
          <Route path="/admin" element={<Admin />} />
          <Route
            path="/publications/trust-advantage-analysis"
            element={(
              <SurfaceBoundary
                eyebrow="Boundary update"
                title="Publication routes are outside the PHAROS site boundary."
                body="This repo no longer treats publication pages as part of the PHAROS public surface. Editorial and Martin-centered publication work should live on pharossuite.ca instead."
              />
            )}
          />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <LanguageProvider>
      <div className="App min-h-screen">
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <AppRoutes />
        </BrowserRouter>
      </div>
    </LanguageProvider>
  );
}

export default App;
