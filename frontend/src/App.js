import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

// Pages
import Home from "./pages/Home";
import Services from "./pages/Services";
import ServiceMenu from "./pages/ServiceMenu";
import Tool from "./pages/Tool";
import FAQ from "./pages/FAQ";
import Research from "./pages/Research";
import About from "./pages/About";
import Connect from "./pages/Connect";
import SealedCard from "./pages/SealedCard";
import Portfolio from "./pages/Portfolio";
import Library from "./pages/Library";
import Admin from "./pages/Admin";
import Cases from "./pages/Cases";

function App() {
  return (
    <div className="App min-h-screen bg-[#f8f9fc]">
      <BrowserRouter>
        <Navbar />
        <main>
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
  );
}

export default App;
