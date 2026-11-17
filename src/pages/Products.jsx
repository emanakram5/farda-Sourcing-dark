// import { useMemo, useState } from 'react';
// import Button from '../components/Button.jsx';
// import Img from '../components/Img.jsx';
// import SectionHeader from '../components/SectionHeader.jsx';
// import { PRODUCTS, PRODUCT_CATEGORIES } from '../data/siteData.js';
// import './Products.css';

// export default function Products() {
//   const [active, setActive] = useState(PRODUCT_CATEGORIES[0]);

//   const visible = useMemo(
//     () => (active === PRODUCT_CATEGORIES[0] ? PRODUCTS : PRODUCTS.filter((p) => p.category === active)),
//     [active]
//   );

//   return (
//     <section className="section products">
//       <div className="container">
//         <SectionHeader
//           as="h1"
//           eyebrow="Our Products"
//           title="High Quality. Innovative. Reliable."
//           text="Explore our wide range of innovative products across high-growth categories."
//         />

//         <div className="products__tabs" role="tablist" aria-label="Product categories">
//           {PRODUCT_CATEGORIES.map((cat) => (
//             <button
//               key={cat}
//               type="button"
//               role="tab"
//               aria-selected={active === cat}
//               className={`products__tab${active === cat ? ' is-active' : ''}`}
//               onClick={() => setActive(cat)}
//             >
//               {cat}
//             </button>
//           ))}
//         </div>

//         {visible.length > 0 ? (
//           <ul className="products__grid">
//             {visible.map((p) => (
//               <li key={p.name} className="card products__card">
//                 <Img src={p.image} alt={p.name} className="products__img" />
//                 <h3>{p.name}</h3>
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p className="products__empty">No products in this category yet.</p>
//         )}



//         <div className="products__cta">
//           <Button to="/contact" variant="outline" icon="arrow-right">
//             View All Products
//           </Button>
//         </div>
//         <div className="products__help">
//   <div className="products__help-text">
//     <span className="products__help-eyebrow">Custom Sourcing</span>
//     <h2>Can’t find the product you need?</h2>
//     <p>
//       Tell us what you’re looking for. We’ll find the right manufacturers, check them
//       and send you comparable quotations.
//     </p>
//   </div>
//   <Button to="/contact" icon="arrow-right">
//     Contact Us
//   </Button>
// </div>
//       </div>
//     </section>
//   );
// }



import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { animate, motion, useMotionValue, useMotionValueEvent, useScroll, useTransform } from 'framer-motion';
import Button from '../components/Button.jsx';
import Icon from '../components/Icon.jsx';
import Img from '../components/Img.jsx';
import { PRODUCTS, PRODUCT_CATEGORIES } from '../data/siteData.js';
import './Products.css';

const ease = [0.22, 1, 0.36, 1];
const pad = (n) => String(n).padStart(2, '0');

/* one product standing on the turntable. slot = rotates round the ring, card = pushed out along the radius */
function Slot({ item, k, n, step, R, p, onPick }) {
  const o = useTransform(p, (v) => Math.max(0.3, 1 - Math.abs(v * (n - 1) - k) * 0.4));
  const s = useTransform(p, (v) => 1 + Math.max(0, 1 - Math.abs(v * (n - 1) - k)) * 0.1);
  return (
    <li className="slot" style={{ transform: `rotateY(${k * step}deg)` }}>
      <motion.button type="button" className="scard" style={{ z: R, opacity: o, scale: s }} onClick={() => onPick(k)} aria-label={`Show ${item.name}`}>
        <Img src={item.image} alt={item.name} className="scard__img" />
        <span className="scard__name">{item.name}</span>
        <span className="scard__cat">{item.category}</span>
      </motion.button>
    </li>
  );
}

export default function Products() {
  const [active, setActive] = useState(PRODUCT_CATEGORIES[0]);
  const [idx, setIdx] = useState(0);
  const ref = useRef(null);
  const visible = useMemo(
    () => (active === PRODUCT_CATEGORIES[0] ? PRODUCTS : PRODUCTS.filter((p) => p.category === active)),
    [active]
  );
  const n = visible.length;
  const small = typeof window !== 'undefined' && window.innerWidth < 700;
  const step = n ? 360 / n : 0;
  const R = n < 3 ? (small ? 300 : 420) : Math.max(small ? 300 : 430, ((small ? 120 : 150) + 30) / Math.tan(Math.PI / n));

  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const spin = useMotionValue(0);
  const rot = useTransform([p, spin], ([v, s]) => -v * (n - 1) * step + s);
  useMotionValueEvent(p, 'change', (v) => setIdx(n > 1 ? Math.round(v * (n - 1)) : 0));

  useEffect(() => { // ring spins in whenever the category changes
    setIdx(0); spin.set(200);
    const c = animate(spin, 0, { duration: 1.7, ease });
    return () => c.stop();
  }, [active]); // eslint-disable-line

  const goTo = (k) => {
    if (!ref.current || n < 2) return;
    const top = ref.current.getBoundingClientRect().top + window.scrollY;
    const total = ref.current.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + (Math.max(0, Math.min(n - 1, k)) / (n - 1)) * total, behavior: 'smooth' });
  };
  const pickTab = (cat) => {
    setActive(cat);
    if (ref.current) { const top = ref.current.getBoundingClientRect().top + window.scrollY; if (window.scrollY > top) window.scrollTo({ top }); }
  };
  const cur = visible[Math.min(idx, n - 1)];

  return (
    <div className="studio">
      <section className="stage-wrap" ref={ref} style={{ height: `calc(100vh + ${Math.max(n, 1) * 65}vh)` }}>
        <div className="stage">
          <header className="stage__head">
            <h1>High Quality. Innovative. Reliable.</h1>
            <p>Explore our wide range of innovative products across high-growth categories.</p>
            <div className="tabs" role="tablist" aria-label="Product categories">
              {PRODUCT_CATEGORIES.map((cat) => (
                <button key={cat} type="button" role="tab" aria-selected={active === cat} className={`tab${active === cat ? ' is-on' : ''}`} onClick={() => pickTab(cat)}>
                  {active === cat && <motion.span layoutId="tabpill" className="tab__pill" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
                  <span>{cat}</span>
                </button>
              ))}
            </div>
          </header>

          {n > 0 ? (
            <>
              <motion.h2 key={cur.name} className="stage__ghost" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease }} aria-hidden="true">{cur.name}</motion.h2>
              <div className="platform" aria-hidden="true"><i /><i /></div>
              <div className="ring-wrap">
                <motion.ul className="ring" style={{ rotateY: rot }}>
                  {visible.map((it, k) => <Slot key={it.name} item={it} k={k} n={n} step={step} R={R} p={p} onPick={goTo} />)}
                </motion.ul>
              </div>

              <footer className="stage__foot">
                <div className="count"><strong>{pad(idx + 1)}</strong><span>/ {pad(n)}</span><em>{cur.category}</em></div>
                <div className="ctrl">
                  <button type="button" onClick={() => goTo(idx - 1)} aria-label="Previous product"><span style={{ display: 'inline-flex', transform: 'rotate(180deg)' }}><Icon name="arrow-right" size={18} color="currentColor" strokeWidth={2} /></span></button>
                  <button type="button" onClick={() => goTo(idx + 1)} aria-label="Next product"><Icon name="arrow-right" size={18} color="currentColor" strokeWidth={2} /></button>
                  <Link to="/contact" className="quote">Request a quote</Link>
                </div>
              </footer>
              <div className="stage__bar"><motion.i style={{ scaleX: p }} /></div>
            </>
          ) : (
            <p className="stage__empty">No products in this category yet.</p>
          )}
        </div>
      </section>

      <div className="studio__after container">
        <div className="products__cta">
          <Button to="/contact" variant="outline" icon="arrow-right">View All Products</Button>
        </div>
        <motion.div className="products__help" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.9, ease }}>
          <div className="products__help-text">
            <span className="products__help-eyebrow">Custom Sourcing</span>
            <h2>Can’t find the product you need?</h2>
            <p>Tell us what you’re looking for. We’ll find the right manufacturers, check them and send you comparable quotations.</p>
          </div>
          <Link to="/contact" className="products__help-btn">Contact Us</Link>
        </motion.div>
      </div>
    </div>
  );
}