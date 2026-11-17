import { Routes, Route, useLocation } from 'react-router-dom';

import Scene3D from './components/cine/Scene3D.jsx';
import Preloader from './components/cine/Preloader.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import ScrollReveal from './components/ScrollReveal.jsx';

import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Products from './pages/Products.jsx';
import Services from './pages/Services.jsx';
import Markets from './pages/Markets.jsx';
import HowItWorks from './pages/HowItWorks.jsx';
import Supplier from './pages/Supplier.jsx';
import Contact from './pages/Contact.jsx';
import NotFound from './pages/NotFound.jsx';
import Franchise from './pages/Franchise.jsx';

export default function App() {
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  return (
    <>
      <Preloader />
      <Scene3D />
      <ScrollToTop />
      <ScrollReveal />
      <Navbar />
      <main key={isHome ? 'home' : pathname} className={isHome ? '' : 'main--offset page-in'}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/products" element={<Products />} />
          <Route path="/services" element={<Services />} />
          <Route path="/markets" element={<Markets />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/supplier" element={<Supplier />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/franchise" element={<Franchise />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
