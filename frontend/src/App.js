import './App.css';
import './site.css';
import './game.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';

import Footer from './components/Footer';
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';
import TypographyPolish from './components/TypographyPolish';

import About from './pages/About';
import Admin from './pages/Admin';
import Assurance from './pages/Assurance';
import Cases from './pages/Cases';
import Connect from './pages/Connect';
import ConceptualMethod from './pages/ConceptualMethod';
import FAQ from './pages/FAQ';
import Game from './pages/Game';
import Home from './pages/Home';
import Library from './pages/Library';
import PortalAurorAI from './pages/PortalAurorAI';
import PortalCompassAI from './pages/PortalCompassAI';
import Research from './pages/Research';
import SealedCard from './pages/SealedCard';
import ServiceMenu from './pages/ServiceMenu';
import Services from './pages/Services';
import SurfaceBoundary from './pages/SurfaceBoundary';
import Tool from './pages/Tool';

function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <TypographyPolish />
      <Navbar />
      <main className="site-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/game" element={<Game />} />
          <Route path="/services" element={<Services />} />
          <Route path="/governance" element={<Services />} />
          <Route path="/services/menu" element={<ServiceMenu />} />
          <Route path="/tool" element={<Tool />} />
          <Route path="/assurance" element={<Assurance />} />
          <Route path="/transparency" element={<Assurance />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/research" element={<Research />} />
          <Route path="/observatory" element={<Research />} />
          <Route path="/cases" element={<Cases />} />
          <Route path="/about" element={<About />} />
          <Route path="/about/conceptual-method" element={<ConceptualMethod />} />
          <Route path="/methods" element={<ConceptualMethod />} />
          <Route path="/connect" element={<Connect />} />
          <Route path="/contact" element={<Connect />} />
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
                body="Martin Lepage profile, resume, portfolio, and other non-PHAROS work belong on governai.ca, not on pharos-ai.ca. This route remains out of the PHAROS public shell during the migration."
              />
            )}
          />
          <Route path="/library" element={<Library />} />
          <Route path="/trust" element={<Assurance />} />
          <Route path="/auditability" element={<Assurance />} />
          <Route path="/admin" element={<Admin />} />
          <Route
            path="/publications/trust-advantage-analysis"
            element={(
              <SurfaceBoundary
                eyebrow="Boundary update"
                title="Publication routes are outside the PHAROS site boundary."
                body="This repo no longer treats publication pages as part of the PHAROS public surface. Editorial and Martin-centered publication work should live on governai.ca instead."
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
