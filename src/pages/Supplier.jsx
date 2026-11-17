import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Button from '../components/Button.jsx';
import Img from '../components/Img.jsx';
import Icon from '../components/Icon.jsx';
import { IMAGES, SUPPLIER_BENEFITS } from '../data/siteData.js';
import './Supplier.css';

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

const CRITERIA = [
  {
    title: 'Entrepreneurial Mindset',
    text: 'Passionate about retail, innovation, and building a successful long-term business.',
    icon: (
      <svg {...svg}>
        <path d="M9 18h6" />
        <path d="M10 21h4" />
        <path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z" />
      </svg>
    ),
  },
  {
    title: 'Investment & Financial Capability',
    text: 'Has the financial resources to establish and operate a FARDA SOURCING franchise outlet.',
    icon: (
      <svg {...svg}>
        <rect x="2" y="6" width="20" height="14" rx="3" />
        <path d="M2 10h20" />
        <circle cx="17" cy="15" r="1.2" />
        <path d="M5 6l11-3 1 3" />
      </svg>
    ),
  },
  {
    title: 'Suitable Retail Location',
    text: 'Can secure a commercial location with strong customer accessibility and retail potential.',
    icon: (
      <svg {...svg}>
        <path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z" />
        <circle cx="12" cy="10" r="2.5" />
      </svg>
    ),
  },
  {
    title: 'Business Management Skills',
    text: 'Has the ability to manage daily operations, employees, customer service, and sales performance.',
    icon: (
      <svg {...svg}>
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
        <path d="M3 13h18" />
      </svg>
    ),
  },
  {
    title: 'Commitment to Brand Standards',
    text: "Willing to maintain FARDA SOURCING's standards for store presentation, product quality, and customer experience.",
    icon: (
      <svg {...svg}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
  {
    title: 'Long-Term Growth Vision',
    text: "Interested in developing a lasting partnership and expanding FARDA SOURCING's presence across Pakistan.",
    icon: (
      <svg {...svg}>
        <path d="M3 17l6-6 4 4 8-8" />
        <path d="M15 7h6v6" />
      </svg>
    ),
  },
];

const pad = (n) => String(n).padStart(2, '0');

export default function Supplier() {
  const n = CRITERIA.length;

  const rootRef = useRef(null);
  const trackRef = useRef(null);
  const stageRef = useRef(null);
  const cardRefs = useRef([]);
  const fillRef = useRef(null);
  const barRef = useRef(null);

  const [active, setActive] = useState(0);

  /* ---------- scroll reveal ---------- */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const items = root.querySelectorAll('.sp-reveal');

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

  /* ---------- vertical slider (scroll-driven) ---------- */
  useLayoutEffect(() => {
    const stage = stageRef.current;
    const fill = fillRef.current;
    const bar = barRef.current;
    if (!stage || !fill || !bar) return;

    const reduce = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    let target = 0;
    let cur = 0;
    let raf = 0;
    let lastActive = -1;

    const draw = (p) => {
      const pos = p * Math.max(0, n - 1);
      const gap = Math.min(260, window.innerHeight * 0.3);

      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        const d = i - pos;
        const ad = Math.abs(d);
        // cards that already passed fade faster than cards still to come
        const o = d < 0 ? 1 - ad * 0.85 : 1 - ad * 0.5;

        el.style.opacity = String(Math.max(0, o));
        el.style.transform = `translate3d(-50%, calc(-50% + ${
          d * gap
        }px), ${-ad * 140}px) rotateX(${d * -24}deg) scale(${
          1 - Math.min(ad, 2) * 0.06
        })`;
        el.style.filter = ad < 0.05 ? 'none' : `blur(${Math.min(5, ad * 3.5)}px)`;
        el.style.zIndex = String(100 - Math.round(ad * 10));
        el.style.pointerEvents = ad < 0.5 ? 'auto' : 'none';
      });

      fill.style.transform = `scaleY(${p})`;
      bar.style.transform = `scaleX(${p})`;

      const a = Math.round(pos);
      if (a !== lastActive) {
        lastActive = a;
        setActive(a);
      }
    };

    const tick = () => {
      raf = 0;
      cur = reduce ? target : cur + (target - cur) * 0.09;
      if (Math.abs(target - cur) < 0.0004) cur = target;
      draw(cur);
      if (cur !== target) raf = requestAnimationFrame(tick);
    };

    const read = () => {
      const el = trackRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const max = r.height - window.innerHeight;
      target = max > 0 ? Math.min(1, Math.max(0, -r.top / max)) : 0;
      if (!raf) raf = requestAnimationFrame(tick);
    };

    draw(0);
    read();
    window.addEventListener('scroll', read, { passive: true });
    window.addEventListener('resize', read);
    return () => {
      window.removeEventListener('scroll', read);
      window.removeEventListener('resize', read);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [n]);

  const goTo = (i) => {
    const el = trackRef.current;
    if (!el) return;
    const idx = Math.max(0, Math.min(n - 1, i));
    const top = el.getBoundingClientRect().top + window.scrollY;
    const max = el.offsetHeight - window.innerHeight;
    window.scrollTo({
      top: top + (n > 1 ? idx / (n - 1) : 0) * max,
      behavior: 'smooth',
    });
  };

  /* ---------- 3D tilt on the photo ---------- */
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
    e.currentTarget.style.setProperty('--ry', '0deg');
    e.currentTarget.style.setProperty('--rx', '0deg');
  };

  return (
    <section className="section supplier" ref={rootRef}>
      {/* ---------- Top row ---------- */}
      <div className="container">
        <div className="supplier__row">
          <div className="supplier__text">
            <div className="sp-reveal">
              <span className="supplier__eyebrow">Become a Supplier</span>
              <h1 className="supplier__title">Partner With Farda Sourcing</h1>
              <p className="supplier__intro">
                We are always looking for reliable manufacturers and suppliers to join our global network.
              </p>
            </div>

            <ul className="supplier__list">
              {SUPPLIER_BENEFITS.map((b, i) => (
                <li
                  key={b}
                  className="sp-reveal sp-reveal--left"
                  style={{ '--i': i + 1 }}
                >
                  <span className="supplier__check">
                    <Icon name="check" size={13} color="#fff" strokeWidth={3} />
                  </span>
                  {b}
                </li>
              ))}
            </ul>

            <div
              className="supplier__btn sp-reveal"
              style={{ '--i': SUPPLIER_BENEFITS.length + 1 }}
            >
              <span className="supplier__btn-ring">
                <Button to="/contact?inquiry=Become%20a%20Supplier" icon="arrow-right">
                  Become a Supplier
                </Button>
              </span>
            </div>
          </div>

          <div className="supplier__media sp-reveal sp-reveal--right">
            <div
              className="supplier__float"
              onMouseMove={onMove}
              onMouseLeave={onLeave}
            >
              <div className="supplier__tilt">
                <Img
                  src={IMAGES.supplierHandshake}
                  alt="Business partners shaking hands"
                  className="supplier__img"
                  eager
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- What we look for: dark vertical slider ---------- */}
      <div className="supplier__dark">
        <svg className="supplier__leaf" viewBox="0 0 80 80" aria-hidden="true">
          <path d="M4 76C4 36 30 8 76 4c0 40-26 68-72 72z" />
          <path d="M4 76C22 52 40 34 66 14" fill="none" stroke="#fff" strokeWidth="1.5" opacity=".5" />
        </svg>
        <span className="supplier__grid" aria-hidden="true" />

        <header className="supplier__head">
          <span className="supplier__pill sp-reveal">Franchise Partnership Opportunities</span>
          <h2 className="sp-reveal" style={{ '--i': 1 }}>
            What We Look for in a <span>Franchise Partner</span>
          </h2>
          <p className="supplier__lead sp-reveal" style={{ '--i': 2 }}>
            Partner with FARDA SOURCING to bring innovative products, smart-home technology, robotics, and modern
            lifestyle solutions to customers across Pakistan.
          </p>
          <p className="sp-reveal" style={{ '--i': 3 }}>
            We are looking for ambitious entrepreneurs, investors, and business owners who share our vision of
            expanding FARDA SOURCING through a nationwide network of branded retail outlets.
          </p>
        </header>

        <div
          className="supplier__track"
          ref={trackRef}
          style={{ height: `calc(${n} * 60vh + 100vh)` }}
        >
          <div className="supplier__stage" ref={stageRef}>
            <div className="supplier__streaks" aria-hidden="true">
              {Array.from({ length: 10 }).map((_, i) => (
                <span
                  key={i}
                  style={{
                    left: `${(i * 37 + 8) % 100}%`,
                    animationDelay: `${-(i * 1.3)}s`,
                    animationDuration: `${5 + (i % 4) * 2}s`,
                  }}
                />
              ))}
            </div>

            <div className="supplier__ghost" key={`g${active}`} aria-hidden="true">
              {pad(active + 1)}
            </div>

            <div className="supplier__label">
              <span />
              <h3>Our Ideal Franchise Partner</h3>
              <span />
            </div>

            {/* clickable vertical rail */}
            <nav className="supplier__rail" aria-label="Partner criteria">
              <span className="supplier__line">
                <i ref={fillRef} style={{ transform: 'scaleY(0)' }} />
              </span>
              <ul className="supplier__rdots">
                {CRITERIA.map((c, i) => (
                  <li key={c.title}>
                    <button
                      type="button"
                      className={`supplier__dot${i <= active ? ' is-reached' : ''}${
                        i === active ? ' is-active' : ''
                      }`}
                      onClick={() => goTo(i)}
                      aria-label={`Go to ${c.title}`}
                      aria-current={i === active ? 'step' : undefined}
                    >
                      <span className="supplier__dotnum">{pad(i + 1)}</span>
                      <span className="supplier__dotlabel">{c.title}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="supplier__focus" aria-hidden="true" />

            <ol className="supplier__drum">
              {CRITERIA.map((c, i) => (
                <li
                  key={c.title}
                  ref={(el) => {
                    cardRefs.current[i] = el;
                  }}
                  className={`supplier__slide${i === active ? ' is-active' : ''}`}
                >
                  <span className="supplier__slide-icon">{c.icon}</span>
                  <div className="supplier__slide-body">
                    <h3>{c.title}</h3>
                    <p>{c.text}</p>
                  </div>
                  <span className="supplier__tag">
                    {pad(i + 1)} / {pad(n)}
                  </span>
                </li>
              ))}
            </ol>

            <div className="supplier__foot">
              <div className="supplier__count">
                <strong>{pad(active + 1)}</strong>
                <span>/ {pad(n)}</span>
              </div>
              <div className="supplier__ctrl">
                <button
                  type="button"
                  onClick={() => goTo(active - 1)}
                  disabled={active === 0}
                  aria-label="Previous"
                >
                  <span className="supplier__chev supplier__chev--up">
                    <Icon name="arrow-right" size={18} color="#fff" strokeWidth={2} />
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => goTo(active + 1)}
                  disabled={active === n - 1}
                  aria-label="Next"
                >
                  <span className="supplier__chev supplier__chev--down">
                    <Icon name="arrow-right" size={18} color="#fff" strokeWidth={2} />
                  </span>
                </button>
              </div>
            </div>

            <div className="supplier__bar">
              <i ref={barRef} style={{ transform: 'scaleX(0)' }} />
            </div>
          </div>
        </div>
      </div>

      {/* ---------- CTA ---------- */}
      <div className="container">
        <div className="supplier__cta sp-reveal">
          <h3>Ready to Become a FARDA Franchise Partner?</h3>
          <p>
            Join our vision. Open your own FARDA SOURCING outlet. Be part of the future of retail in Pakistan.
          </p>
          <span className="supplier__btn-ring">
            <Button to="/contact?inquiry=Franchise%20Partnership" icon="arrow-right">
              Apply for a Franchise
            </Button>
          </span>
        </div>
      </div>
    </section>
  );
}