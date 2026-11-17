import { useEffect, useLayoutEffect, useRef } from 'react';
import Button from '../components/Button.jsx';
import Img from '../components/Img.jsx';
import Icon from '../components/Icon.jsx';
import SectionHeader from '../components/SectionHeader.jsx';
import { IMAGES, MARKET_BENEFITS, MARKET_STATS } from '../data/siteData.js';
import './Markets.css';

/* ---------- Content ----------
   Add these keys to IMAGES in siteData.js (same way as your other images):
   hubShenzhen, hubFoshan, hubZhongshan, hubYiwu, hubNingbo
   Until you add them, each card shows a soft green gradient instead. */
const SOURCING_HUBS = [
  { city: 'Shenzhen & Dongguan', image: IMAGES.hubShenzhen, items: ['Consumer electronics', 'Smart devices', 'Components'] },
  { city: 'Foshan', image: IMAGES.hubFoshan, items: ['Furniture', 'Home products', 'Building materials'] },
  { city: 'Zhongshan', image: IMAGES.hubZhongshan, items: ['Lighting', 'Electrical products'] },
  { city: 'Yiwu', image: IMAGES.hubYiwu, items: ['Household goods', 'Everyday consumer goods'] },
  { city: 'Ningbo & Taizhou', image: IMAGES.hubNingbo, items: ['Machinery', 'Tools', 'Appliances'] },
];

/* ---------- Trade routes drawn over the map ----------
   Coordinates are in a 200 x 100 box laid over the map image.
   x: 0 (left) -> 200 (right), y: 0 (top) -> 100 (bottom).
   Move the points until they sit on the right places of YOUR map image. */
const ORIGIN = { x: 154, y: 42 };
const DESTINATIONS = [
  { x: 46, y: 36 },
  { x: 64, y: 70 },
  { x: 98, y: 30 },
  { x: 120, y: 46 },
  { x: 106, y: 64 },
  { x: 170, y: 78 },
];

const arcPath = (a, b) => {
  const mx = (a.x + b.x) / 2;
  const dist = Math.hypot(b.x - a.x, b.y - a.y);
  const my = Math.max(-4, Math.min(a.y, b.y) - dist * 0.3);
  return `M ${a.x} ${a.y} Q ${mx} ${my} ${b.x} ${b.y}`;
};

/* ---------- Count-up number (works with "50+", "1,200", "$2.5M" ...) ---------- */
function CountUp({ value }) {
  const ref = useRef(null);
  const str = String(value);

  useLayoutEffect(() => {
    const el = ref.current;
    const m = str.match(/^(\D*)(\d[\d,]*\.?\d*)(.*)$/);
    if (!el || !m) return;

    const [, pre, numStr, suf] = m;
    const hasComma = numStr.includes(',');
    const decimals = (numStr.split('.')[1] || '').length;
    const end = parseFloat(numStr.replace(/,/g, ''));

    const fmt = (v) => {
      const body = hasComma
        ? v.toLocaleString('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          })
        : v.toFixed(decimals);
      return `${pre}${body}${suf}`;
    };

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) {
      el.textContent = str;
      return;
    }

    el.textContent = fmt(0);
    let raf = 0;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const dur = 1700;
        const step = (now) => {
          const t = Math.min(1, (now - start) / dur);
          const eased = 1 - Math.pow(1 - t, 3);
          el.textContent = fmt(end * eased);
          if (t < 1) raf = requestAnimationFrame(step);
          else el.textContent = str;
        };
        raf = requestAnimationFrame(step);
      },
      { threshold: 0.6 }
    );
    io.observe(el);

    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [str]);

  return <span ref={ref}>{str}</span>;
}

/* ---------- Inline icons (no dependency on Icon.jsx) ---------- */
const svg = {
  width: 26,
  height: 26,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

const PinIcon = () => (
  <svg {...svg} width="14" height="14" strokeWidth="2.2">
    <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const AUDIENCE = [
  {
    label: 'Importers and wholesalers',
    icon: (
      <svg {...svg}>
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <path d="M3.27 6.96 12 12.01l8.73-5.05" />
        <path d="M12 22.08V12" />
      </svg>
    ),
  },
  {
    label: 'Retailers and resellers',
    icon: (
      <svg {...svg}>
        <path d="M3 9l1.5-5h15L21 9" />
        <path d="M3 9h18" />
        <path d="M4 9v11h16V9" />
        <path d="M9 20v-6h6v6" />
      </svg>
    ),
  },
  {
    label: 'Offices and SMEs',
    icon: (
      <svg {...svg}>
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
  },
  {
    label: 'Schools and institutions',
    icon: (
      <svg {...svg}>
        <path d="M22 10 12 5 2 10l10 5 10-5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
    ),
  },
  {
    label: 'Startups launching new products',
    icon: (
      <svg {...svg}>
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
        <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
        <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
        <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
      </svg>
    ),
  },
];

export default function Markets() {
  const rootRef = useRef(null);

  // reveal elements as they scroll into view
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const items = root.querySelectorAll('.mk-reveal');

    if (!('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // 3D tilt + glare on the map
  const onMove = (e) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty('--ry', `${(px - 0.5) * 10}deg`);
    el.style.setProperty('--rx', `${(0.5 - py) * 8}deg`);
    el.style.setProperty('--gx', `${px * 100}%`);
    el.style.setProperty('--gy', `${py * 100}%`);
  };

  const onLeave = (e) => {
    const el = e.currentTarget;
    el.style.setProperty('--ry', '0deg');
    el.style.setProperty('--rx', '0deg');
  };

  return (
    <section className="section markets" ref={rootRef}>
      <div className="container">
        <div className="markets__row">
          <div className="markets__text">
            <div className="mk-reveal">
              <SectionHeader
                as="h1"
                eyebrow="Our Markets"
                title={'Delivering Global Opportunities\nAcross Borders'}
                text="We connect manufacturers with businesses in key markets worldwide."
                maxWidth={460}
              />
            </div>
            <ul className="markets__stats">
              {MARKET_STATS.map((s, i) => (
                <li key={s.label} className="mk-reveal" style={{ '--i': i + 1 }}>
                  <span className="markets__stat-icon">
                    <Icon name={s.icon} size={30} color="#70D900" strokeWidth={1.6} />
                  </span>
                  <div>
                    <strong>
                      <CountUp value={s.value} />
                    </strong>
                    <span>{s.label}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* map with live trade routes */}
          <div className="markets__stage mk-reveal mk-reveal--right">
            <div
              className="markets__float"
              onMouseMove={onMove}
              onMouseLeave={onLeave}
            >
              <div className="markets__tilt">
                <Img
                  src={IMAGES.marketsMap}
                  alt="World map of Farda Sourcing markets"
                  className="markets__map"
                  eager
                />

                <svg
                  className="markets__routes"
                  viewBox="0 0 200 100"
                  preserveAspectRatio="xMidYMid slice"
                  aria-hidden="true"
                >
                  {DESTINATIONS.map((d, i) => (
                    <path
                      key={`a${i}`}
                      className="markets__arc"
                      d={arcPath(ORIGIN, d)}
                      pathLength="100"
                      style={{ '--i': i }}
                    />
                  ))}

                  <g className="markets__packets">
                    {DESTINATIONS.map((d, i) => (
                      <path
                        key={`p${i}`}
                        className="markets__packet"
                        d={arcPath(ORIGIN, d)}
                        pathLength="100"
                        style={{ '--i': i }}
                      />
                    ))}
                  </g>

                  {DESTINATIONS.map((d, i) => (
                    <g key={`d${i}`} style={{ '--i': i }}>
                      <circle className="markets__ring" cx={d.x} cy={d.y} r="1.6" />
                      <circle className="markets__dot" cx={d.x} cy={d.y} r="1.5" />
                    </g>
                  ))}

                  <g>
                    <circle className="markets__ring markets__ring--origin" cx={ORIGIN.x} cy={ORIGIN.y} r="2.4" />
                    <circle className="markets__dot markets__dot--origin" cx={ORIGIN.x} cy={ORIGIN.y} r="2.4" />
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <ul className="markets__band mk-reveal">
          {MARKET_BENEFITS.map((b, i) => (
            <li key={b.title} className="markets__benefit" style={{ '--i': i }}>
              <span className="markets__benefit-icon">
                <Icon name={b.icon} size={30} color="#70D900" strokeWidth={1.6} />
              </span>
              <div>
                <h3>{b.title}</h3>
                <p>{b.text}</p>
              </div>
            </li>
          ))}
        </ul>

        {/* ---------- Who we serve ---------- */}
        <div className="markets__serve mk-reveal">
          {/* decorative leaf + skyline */}
          <svg className="markets__leaf" viewBox="0 0 80 80" aria-hidden="true">
            <path d="M4 76C4 36 30 8 76 4c0 40-26 68-72 72z" />
            <path d="M4 76C22 52 40 34 66 14" fill="none" stroke="#fff" strokeWidth="1.5" opacity=".7" />
          </svg>
          <svg className="markets__skyline" viewBox="0 0 400 120" aria-hidden="true">
            <path d="M0 120V84h18V64h14v20h12V44h16v40h10V70h16v50h8V34h6V14h4v20h8v86h12V60h20v60h10V76h16v44h14V50h18v70h12V86h20v34h16V58h14v62h12V92h22v28z" />
          </svg>

          <header className="markets__serve-head">
            <span className="markets__pill">Our Customers</span>
            <h2>
              Who we <span>serve</span>
            </h2>
            <p>We support businesses across various industries with reliable sourcing solutions.</p>
          </header>

          <ul className="markets__audience">
            {AUDIENCE.map((a, i) => (
              <li
                key={a.label}
                className="markets__audience-item mk-reveal"
                style={{ '--i': i + 1 }}
              >
                <span className="markets__audience-icon" style={{ '--b': i }}>
                  {a.icon}
                </span>
                <span>{a.label}</span>
              </li>
            ))}
          </ul>

          <div className="markets__cta mk-reveal" style={{ '--i': 6 }}>
            <span className="markets__cta-btn">
              <Button to="/contact" icon="arrow-right">
                Discuss Your Requirements
              </Button>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}