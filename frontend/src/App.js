import './App.css';
import './claude-v01.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';

import Footer from './components/Footer';
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';

import About from './pages/About';
import Admin from './pages/Admin';
import Cases from './pages/Cases';
import Connect from './pages/Connect';
import FAQ from './pages/FAQ';
import Home from './pages/Home';
import Library from './pages/Library';
import Portfolio from './pages/Portfolio';
import Research from './pages/Research';
import SealedCard from './pages/SealedCard';
import ServiceMenu from './pages/ServiceMenu';
import Services from './pages/Services';
import Tool from './pages/Tool';

function App() {
  return (
    <LanguageProvider>
      <div className="App min-h-screen">
        <BrowserRouter>
          <ScrollToTop />
          <Navbar />
          <main className="relative">
            <Routes>
              <Route path="/" element={<Home />} />
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
            </Routes>
          </main>
          <Footer />
        </BrowserRouter>
      </div>
    </LanguageProvider>
  );
}

export default App;
