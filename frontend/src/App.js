import './App.css';
import './claude-v01.css';
import './game.css';
import './showcase.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';

import Footer from './components/Footer';
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';

import About from './pages/About';
import Admin from './pages/Admin';
import Cases from './pages/Cases';
import Connect from './pages/Connect';
import FAQ from './pages/FAQ';
import Game from './pages/Game';
import Home from './pages/Home';
import Library from './pages/Library';
import Portfolio from './pages/Portfolio';
import Research from './pages/Research';
import SealedCard from './pages/SealedCard';
import ServiceMenu from './pages/ServiceMenu';
import ShowcaseIndex from './pages/ShowcaseIndex';
import ShowcaseVariant from './pages/ShowcaseVariant';
import Services from './pages/Services';
import Tool from './pages/Tool';

function AppRoutes() {
  const location = useLocation();
  const isShowcase = location.pathname.startsWith('/showcase');

  return (
    <>
      <ScrollToTop />
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
          <Route path="/sealed-card" element={<SealedCard />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/library" element={<Library />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/showcase" element={<ShowcaseIndex />} />
          <Route path="/showcase/:slug" element={<ShowcaseVariant />} />
        </Routes>
      </main>
      {!isShowcase && <Footer />}
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
