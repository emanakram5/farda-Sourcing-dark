import { useEffect, useRef, useState } from "react";
import { Link, NavLink, Navigate, useLocation } from "react-router-dom";
import {
  PRODUCTS,
  SERVICES,
  SUPPLIER_BENEFITS,
  IMAGES,
  HERO_STATS,
  SOCIAL_LINKS,
} from "./data/siteData.js";
import { PRODUCT_DETAILS, SITE_URL } from "./data/productDetails.js";
import ProductDetail from "./pages/ProductDetail.jsx";
import Logo, { LogoMark } from "./components/Logo.jsx";
import Icon from "./components/Icon.jsx";
import HowItWorks from "./pages/HowItWorks.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Franchise from "./pages/Franchise.jsx";
import Supplier from "./pages/Supplier.jsx";
import "./styles/redesign.css";
import "./styles/brand-light.css";

export const pageInfo = {
  "/home": [
    "Global Sourcing & Innovative Products",
    "Discover AI robotics, smart home technology and industrial products from verified factories. Farda Sourcing manages sourcing, quality checks and shipping.",
  ],
  "/who-we-are": [
    "Who We Are",
    "Meet Farda Sourcing and YC Group of Companies: NSOL BPO, Your Cloud Campus, Galaxy View Real Estate and Cloud Rexpo. Explore our group and sourcing mission.",
  ],
  "/products": [
    "Products & Technology",
    "Explore robot vacuums, smart home security, walking assistants, vehicle monitoring, AI massage chairs and commercial AI smart mirrors with Farda Sourcing.",
  ],
  "/services": [
    "Sourcing & Supply Chain Services",
    "Explore sourcing, procurement, quality inspection and shipping services, plus supplier benefits and franchise partnership opportunities with Farda Sourcing.",
  ],
  "/our-mission": [
    "Our Mission",
    "Discover Farda Sourcing’s franchise model, product range, partner responsibilities and launch support. Build a local business bringing global innovation to your market.",
  ],
  "/contact": [
    "Contact Us",
    "Tell Farda Sourcing about your product requirements, quantities and target market. Start a conversation about your next sourcing project.",
  ],
  "/supplier": [
    "Become a Supplier",
    "Join the Farda Sourcing supplier network and explore long-term manufacturing and business partnerships.",
  ],
  "/franchise": [
    "Franchise Opportunities",
    "Explore Farda Sourcing franchise opportunities and bring innovative technology and products to your local market.",
  ],
  "/markets": [
    "Our Global Markets",
    "Connect with verified factories in China and explore sourcing and delivery support for Pakistan and international markets.",
  ],
};
for (const [slug, product] of Object.entries(PRODUCT_DETAILS)) {
  pageInfo['/products/' + slug] = [product.name, product.description];
}
const aliases = {
  "/": "/home",
  "/about": "/who-we-are",
  "/get-a-quote": "/contact",
};
const links = [
  ["/home", "Home"],
  ["/who-we-are", "Who We Are"],
  ["/products", "Products"],
  ["/services", "Services"],
  ["/our-mission", "Our Mission"],
];
function Meta({ path }) {
  useEffect(() => {
    const info = pageInfo[path];
    const title = (info?.[0] || "Page Not Found") + " | Farda Sourcing";
    const desc =
      info?.[1] ||
      "The requested page could not be found. Explore Farda Sourcing products and services.";
    document.title = title;
    document.querySelectorAll('script[data-product-schema], script[type="application/ld+json"]').forEach(el => el.remove());
    const productDetails = PRODUCT_DETAILS[path.slice(10)];
    if (path.startsWith('/products/') && productDetails) {
      const script = document.createElement('script');
      script.type = 'application/ld+json'; script.dataset.productSchema = '';
      script.textContent = JSON.stringify({ '@context': 'https://schema.org', '@type': 'WebPage', name: productDetails.name, description: productDetails.description, url: SITE_URL + path, about: { '@type': 'Product', name: productDetails.name, description: productDetails.description } });
      document.head.appendChild(script);
    }
    for (const [key, value] of Object.entries({
      description: desc,
      robots: info ? "index,follow" : "noindex,follow",
      "og:title": title,
      "og:description": desc,
      "og:type": "website",
      "og:site_name": "Farda Sourcing",
      "twitter:card": "summary",
      "twitter:title": title,
      "twitter:description": desc,
    })) {
      const attr = key.startsWith("og:") ? "property" : "name";
      let el = document.head.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.content = value;
    }
    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical); }
    canonical.href = SITE_URL + (info ? path : '/products');
    let ogUrl = document.head.querySelector('meta[property="og:url"]');
    if (!ogUrl) { ogUrl = document.createElement('meta'); ogUrl.setAttribute('property', 'og:url'); document.head.appendChild(ogUrl); }
    ogUrl.content = canonical.href;
    window.scrollTo(0, 0);
  }, [path]);
  return null;
}
function Button({ to = "/get-a-quote", children, secondary = false }) {
  return (
    <Link className={`action ${secondary ? "action-secondary" : ""}`} to={to}>
      {children}
    </Link>
  );
}
function Cubes() {
  return (
    <div className="cube-scene">
      <svg
        className="cube-art"
        viewBox="0 0 600 540"
        role="img"
        aria-label="Animated white and lime cubes with the Farda F monogram"
      >
        <defs>
          <linearGradient id="whiteTop" x2="1" y2="1">
            <stop stopColor="#fff" />
            <stop offset="1" stopColor="#cfd6cb" />
          </linearGradient>
          <linearGradient id="lime" x2="1" y2="1">
            <stop stopColor="#93df52" />
            <stop offset="1" stopColor="#70d900" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="22" />
          </filter>
        </defs>
        <ellipse
          cx="320"
          cy="450"
          rx="170"
          ry="35"
          fill="#70d900"
          opacity=".22"
          filter="url(#glow)"
        />
        {[
          [300, 235, 100, false],
          [420, 285, 100, false],
          [180, 300, 105, false],
          [300, 110, 105, false],
          [180, 210, 85, true],
          [395, 230, 110, true],
          [300, 365, 80, true],
        ].map(([x, y, s, green], i) => (
          <g
            key={i}
            className="floating-cube"
            style={{ animationDelay: `${i * -0.7}s` }}
            stroke={green ? "#7bcf27" : "#d6ded1"}
            strokeWidth="1.5"
            strokeLinejoin="round"
          >
            <path
              d={`M${x} ${y - s * 0.5} l${s} ${s * 0.5} l-${s} ${s * 0.5} l-${s} -${s * 0.5} Z`}
              fill={green ? "url(#lime)" : "url(#whiteTop)"}
            />
            <path
              d={`M${x - s} ${y} l${s} ${s * 0.5} v${s} l-${s} -${s * 0.5} Z`}
              fill={green ? "#61bd00" : "#c9d0c3"}
            />
            <path
              d={`M${x} ${y + s * 0.5} l${s} -${s * 0.5} v${s} l-${s} ${s * 0.5} Z`}
              fill={green ? "#70d900" : "#aebfa2"}
            />
            {i === 3 && <g transform="matrix(.5 .25 -.5 .25 300 74)" aria-hidden="true"><g className="cube-monogram"><LogoMark /></g></g>}
          </g>
        ))}
      </svg>
    </div>
  );
}
function Stats() {
  const rootRef = useRef(null);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let frame = 0;
    let started = false;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const start = () => {
      if (started) return;
      started = true;
      if (media.matches) { setProgress(1); return; }
      const begin = performance.now();
      const tick = (now) => {
        const fraction = Math.min(1, (now - begin) / 1800);
        setProgress(1 - Math.pow(1 - fraction, 3));
        if (fraction < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };
    const reduce = () => { if (media.matches) { cancelAnimationFrame(frame); setProgress(1); started = true; } };
    media.addEventListener('change', reduce);
    let observer;
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(entries => {
        if (entries.some(entry => entry.isIntersecting)) { start(); observer.disconnect(); }
      }, { threshold: 0.25 });
      observer.observe(rootRef.current);
    } else start();
    return () => { observer?.disconnect(); cancelAnimationFrame(frame); media.removeEventListener('change', reduce); };
  }, []);
  return (
    <section className="glass stats" ref={rootRef}>
      <h2>Every factory, checked before we introduce it.</h2>
      <ul>
        {HERO_STATS.map((s) => (
          <li key={s.label}>
            <strong aria-label={s.value}><span aria-hidden="true">{Math.round(parseInt(s.value, 10) * progress)}{s.value.replace(/[0-9]/g, "")}</span></strong>
            <span>{s.label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
function Intro({ eyebrow, title, text }) {
  return (
    <header className="page-intro">
      <span className="kicker">{eyebrow}</span>
      <h1>{title}</h1>
      <p>{text}</p>
    </header>
  );
}
function CTA() {
  return (
    <section className="glass closing">
      <div>
        <span className="kicker">YOUR NEXT CHAPTER STARTS HERE</span>
        <h2>
          Great products.
          <br />
          One dependable partner.
        </h2>
      </div>
      <Button>Get a Quote</Button>
    </section>
  );
}
function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <span className="kicker">CONNECTED TO WHAT'S NEXT</span>
          <h1>
            Bringing Tomorrow’s
            <br />
            Innovation, <span className="hero-today">Today</span>
          </h1>
          <p>
            AI robotics, smart technology and industrial products from verified factories, delivered by one
            partner from first quote to final shipment.
          </p>
          <div className="actions">
            <Button to="/products">Explore products</Button>
            <Button secondary>Let’s talk</Button>
          </div>
        </div>
        <Cubes />
      </section>
      <Stats />
      <HowItWorks embedded />
      <section className="section-space">
        <div className="section-heading">
          <div>
            <span className="kicker">BUILT FOR WHAT COMES NEXT</span>
            <h2>Innovation with purpose.</h2>
          </div>
          <Link to="/products" className="text-link">
            Explore all products
          </Link>
        </div>
        <div className="product-grid">
          {PRODUCTS.slice(0, 3).map((p) => (
            <Product key={p.name} product={p} />
          ))}
        </div>
      </section>
      <CTA />
    </>
  );
}
function Product({ product: p }) {
  return (
    <Link className="glass product-card" id={"details-" + p.slug} to={"/products/" + p.slug} aria-label={"Explore " + p.name}>
      {p.image ? <img src={p.image} alt={p.imageAlt || p.name} loading="lazy" width="400" height="300" /> : <div className="product-image-placeholder"><Icon name="package" size={48} /><span>Image coming soon</span></div>}
      <div>
        <h2>{p.name}</h2>
        {p.description && <p className="product-description">{p.description}</p>}
        {p.includes && <><p className="product-includes-label">Package includes</p><ul className="product-includes">{p.includes.map(item => <li key={item}>{item}</li>)}</ul></>}
      </div>
    </Link>
  );
}
function Products() {
  return (
    <>
      <Intro
        eyebrow="OUR PRODUCTS"
        title="Tomorrow’s possibilities. Ready to source."
        text="Explore technology that moves businesses forward. We connect you with the factories behind it."
      />
      <p className="result-count">{PRODUCTS.length} products</p>
      <div className="product-grid">
        {PRODUCTS.map((p) => (
          <Product key={p.name} product={p} />
        ))}
      </div>
      <CTA />
    </>
  );
}
function Services() {
  return (
    <>
      <section className="section-space supplier-services supplier-services-first" aria-labelledby="supplier-services-title">
        <div className="split">
          <div>
            <span className="kicker">BECOME A SUPPLIER</span>
            <h1 id="supplier-services-title">Partner With Farda Sourcing</h1>
            <p>We are always looking for reliable manufacturers and suppliers to join our global network.</p>
            <p>Alongside our sourcing and logistics services, we connect suppliers with businesses looking for innovative products and lasting partnerships.</p>
            <Button to="/get-a-quote?inquiry=Become%20a%20Supplier">Become a Supplier</Button>
          </div>
          <img src={IMAGES.supplierHandshake} alt="Business partners shaking hands" fetchPriority="high" />
        </div>
        <h3 className="supplier-benefits-title">Why partner with us</h3>
        <ul className="supplier-benefits-grid">
          {SUPPLIER_BENEFITS.map(benefit => <li className="glass" key={benefit}><Icon name="check" size={24} /><span>{benefit}</span></li>)}
        </ul>
      </section>
      <section className="section-space services-offering">
      <header className="page-intro services-section-heading">
        <span className="kicker">OUR SERVICES</span>
        <h2>From first conversation to final shipment.</h2>
        <p>A connected sourcing process, with a dedicated partner at every stage.</p>
      </header>
      <div className="service-grid">
        {SERVICES.map((s) => (
          <article className="glass service-card" key={s.title}>
            <Icon name={s.icon} size={30} />
            <h3>{s.title}</h3>
            <p>{s.text}</p>
          </article>
        ))}
      </div>
      </section>
      <section className="glass service-partnership" aria-labelledby="service-partnership-title">
        <div>
          <span className="kicker">FRANCHISE PARTNERSHIP OPPORTUNITIES</span>
          <h2 id="service-partnership-title">Bring innovation to your local market.</h2>
          <p>Partner with FARDA SOURCING to bring innovative products, smart-home technology, robotics, and modern lifestyle solutions to customers across Pakistan.</p>
          <p>We are looking for ambitious entrepreneurs, investors, and business owners who share our vision of expanding FARDA SOURCING through a nationwide network of branded retail outlets.</p>
          <div className="actions">
            <Button to="/our-mission">Explore franchise opportunities</Button>
            <Button to="/contact?inquiry=Franchise%20Partnership" secondary>Discuss a partnership</Button>
          </div>
        </div>
      </section>
    </>
  );
}
export default function App() {
  const { pathname } = useLocation();
  const path = aliases[pathname] || pathname;
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  useEffect(() => {
    const close = (e) => {
      if (!e.target.closest(".site-header")) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, []);
  useEffect(() => {
    setOpen(false);
  }, [pathname]);
  useEffect(() => {
    const key = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        document.querySelector(".menu-toggle")?.focus();
      }
    };
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, []);
  let page;
  if (path === "/home") page = <Home />;
  else if (path === "/products") page = <Products />;
  else if (path.startsWith('/products/') && PRODUCT_DETAILS[path.slice(10)]) page = <ProductDetail product={PRODUCTS.find(product => product.slug === path.slice(10))} details={PRODUCT_DETAILS[path.slice(10)]} />;
  else if (path === "/who-we-are") page = <About />;
  else if (path === "/services") page = <Services />;
  else if (path === "/our-mission") page = <Franchise hideBrochure />;
  else if (path === "/contact") page = <Contact />;
  else if (path === "/supplier") page = <Supplier />;
  else if (path === "/franchise") page = <Franchise />;
  else if (path === "/how-it-works") page = <Navigate to="/home" replace />;
  else if (path === "/markets")
    page = (
      <>
        <Intro
          eyebrow="OUR MARKETS"
          title="One network. Every opportunity."
          text="Connecting manufacturing hubs in China with businesses in Pakistan and international markets."
        />
        <Stats />
        <CTA />
      </>
    );
  else
    page = (
      <>
        <Intro
          eyebrow="404"
          title="This page is off the map."
          text="Let’s get you back to the products and people you’re looking for."
        />
        <Button to="/home">Back to home</Button>
      </>
    );
  return (
    <div className="redesign">
      <Meta path={path} />
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <header className={`site-header shell ${scrolled ? "is-scrolled" : ""}`}>
        <Link to="/home" aria-label="Farda Sourcing home">
          <Logo variant="light" size={42} />
        </Link>
        <button
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="site-menu"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          <Icon name={open ? "close" : "menu"} size={26} />
        </button>
        <nav
          id="site-menu"
          className={open ? "open" : ""}
          aria-label="Main navigation"
        >
          {links.map(([to, label]) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              aria-current={path === to ? "page" : undefined}
              className={path === to ? "selected" : ""}
            >
              {label}
            </NavLink>
          ))}
          <Button to="/contact">Contact Us</Button>
        </nav>
      </header>
      <main id="main-content" className="shell" key={path}>
        {page}
      </main>
      <div className="cta__ticker" aria-hidden="true">
        <div>{Array.from({ length: 8 }).map((_, i) => <span key={i}>Dependably, we source.</span>)}</div>
      </div>
      <footer className="site-footer shell">
        <div>
          <Link to="/home">
            <Logo variant="light" size={36} />
          </Link>
          <p>
            Bringing tomorrow’s innovation to your business.
            <br />
            Dependably, we source.
          </p>
          <ul className="social-links">
            {SOCIAL_LINKS.filter((s) => s.href !== "https://x.com").map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  aria-label={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon name={s.icon} size={21} />
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2>Explore</h2>
          {links.map(([to, label]) => (
            <Link key={to} to={to}>
              {label}
            </Link>
          ))}
        </div>
        <div>
          <h2>Products</h2>
          {PRODUCTS.map(product => <Link key={product.name} to={"/products/" + product.slug}>{product.name}</Link>)}
        </div>
        <div>
          <h2>Contact</h2>
          <a href="mailto:info@fardasourcing.com">info@fardasourcing.com</a>
          <p>
            Bahria Town Phase 7<br />
            Rawalpindi, Pakistan
          </p>
        </div>
        <small>
          © {new Date().getFullYear()} Farda Sourcing. All rights reserved.
        </small>
      </footer>
    </div>
  );
}
