import './App.css';
import './claude-v01.css';
import './game.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';

import Footer from './components/Footer';
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';
import TypographyPolish from './components/TypographyPolish';

import About from './pages/About';
import Admin from './pages/Admin';
import Cases from './pages/Cases';
import Connect from './pages/Connect';
import FAQ from './pages/FAQ';
import Game from './pages/Game';
import Home from './pages/Home';
import Library from './pages/Library';
import Portfolio from './pages/Portfolio';
import PortalAurorAI from './pages/PortalAurorAI';
import PortalCompassAI from './pages/PortalCompassAI';
import Research from './pages/Research';
import SealedCard from './pages/SealedCard';
import ServiceMenu from './pages/ServiceMenu';
import Services from './pages/Services';
import Tool from './pages/Tool';
import TrustAdvantageAnalysis from './pages/TrustAdvantageAnalysis';

function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <TypographyPolish />
      <Navbar />
      <main className="relative">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/game" element={<Game />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/menu" element={<ServiceMenu />} />
          <Route path="/tool" element={<Tool />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/research" element={<Research />} />
          <Route path="/cases" element={<Cases />} />
          <Route path="/about" element={<About />} />
          <Route path="/connect" element={<Connect />} />
          <Route path="/portal/aurorai" element={<PortalAurorAI />} />
          <Route path="/portal/compassai" element={<PortalCompassAI />} />
          <Route path="/sealed-card" element={<SealedCard />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/library" element={<Library />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/publications/trust-advantage-analysis" element={<TrustAdvantageAnalysis />} />
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
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </div>
    </LanguageProvider>
  );
}

export default App;
