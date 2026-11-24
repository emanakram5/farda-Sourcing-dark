import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/Icon.jsx';
import Img from '../components/Img.jsx';
import { ABOUT } from '../data/siteData.js';
import './About.css';
import CompanyGroup from '../components/CompanyGroup.jsx';

/* ---------- Images: these exact files exist in /public/images ---------- */
const PICS = {
  hero: '/images/services-ship.svg',
  office: '/images/about-office.svg',
  mission: '/images/cat-industrial.svg',
  vision: '/images/franchise-banner.svg',
  values: '/images/supplier-handshake.svg',
};

const BADGES = [
  { icon: 'globe', t: 'Global network' },
  { icon: 'shield-check', t: 'Trusted partnerships' },
  { icon: 'check', t: 'Quality assured' },
  { icon: 'clock', t: 'Efficient solutions' },
];

/* ---------- Headline: words rise one by one (pure CSS, triggered by the observer) ---------- */
function Words({ text, as: Tag = 'h2', accentFrom = -1, delay = 0 }) {
  return (
    <Tag className="ab-rise" aria-label={text} style={{ '--d': delay }}>
      {text.split(' ').map((w, i) => (
        <span className="ab-w" aria-hidden="true" key={i}>
          <span className={accentFrom >= 0 && i >= accentFrom ? 'ab-acc' : undefined} style={{ '--w': i }}>
            {w}
          </span>
        </span>
      ))}
    </Tag>
  );
}

/* ---------- Picture: always eager so the browser loads it right away ---------- */
function Pic({ src, alt, tag, ratio = '4 / 3', i = 0 }) {
  return (
    <div className="ab-pic ab-reveal" style={{ aspectRatio: ratio, '--i': i }}>
      <Img src={src} alt={alt} className="ab-img" eager />
      <span className="ab-pic__shade" />
      {tag && <span className="ab-pic__tag">{tag}</span>}
    </div>
  );
}

/* ---------- Numbered section label ---------- */
function Label({ n, children }) {
  return (
    <div className="ab-label ab-reveal">
      <b>{n}</b>
      <span>{children}</span>
      <i />
    </div>
  );
}

export default function About() {
  const rootRef = useRef(null);

  // reveal elements as they scroll into view (same approach as the Markets page)
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const items = root.querySelectorAll('.ab-reveal, .ab-rise');

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

  return (
    <div className="ab" ref={rootRef}>
      {/* ---------- HERO ---------- */}
      <section className="ab-hero">
        <div className="ab-wrap ab-hero__grid">
          <div className="ab-hero__text">
            <span className="ab-eyebrow ab-reveal">About Farda Sourcing</span>
            <Words as="h1" text="Connecting innovation with global markets." accentFrom={3} delay={2} />
            {ABOUT.paragraphs.map((t, i) => (
              <p key={t} className="ab-reveal" style={{ '--i': 5 + i }}>{t}</p>
            ))}
            <ul className="ab-chips">
              {BADGES.map((b, i) => (
                <li key={b.t} className="ab-chip ab-reveal" style={{ '--i': 7 + i }}>
                  <Icon name={b.icon} size={16} color="#70D900" strokeWidth={2} />
                  {b.t}
                </li>
              ))}
            </ul>
          </div>
          <Pic src={PICS.hero} alt="Container ship at port" tag="Global logistics" i={3} />
        </div>
      </section>

      {/* ---------- 01 STORY ---------- */}
      <section className="ab-sec">
        <div className="ab-wrap">
          <Label n="01">Our story</Label>
          <div className="ab-split">
            <Pic src={PICS.office} alt="Farda Sourcing office meeting room" tag="Our office" />
            <div className="ab-text">
              <Words text={ABOUT.storyTitle} />
              {ABOUT.storyParagraphs.map((t, i) => (
                <p key={t} className="ab-reveal" style={{ '--i': 2 + i }}>{t}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CompanyGroup />

      {/* ---------- MISSION + VISION ---------- */}
      <section className="ab-sec ab-sec--alt">
        <div className="ab-wrap">
          <Label n="03">Purpose</Label>
          <div className="ab-duo">
            <article className="ab-card">
              <Pic src={PICS.mission} alt="Robotic arm on a production line" tag="Mission" ratio="16 / 10" />
              <div className="ab-card__body ab-reveal" style={{ '--i': 2 }}>
                <span className="ab-ico"><Icon name="target" size={22} color="#70D900" strokeWidth={2} /></span>
                <h3>Our Mission</h3>
                <p>{ABOUT.mission}</p>
              </div>
            </article>
            <article className="ab-card">
              <Pic src={PICS.vision} alt="Farda Sourcing store" tag="Vision" ratio="16 / 10" i={1} />
              <div className="ab-card__body ab-reveal" style={{ '--i': 3 }}>
                <span className="ab-ico"><Icon name="eye" size={22} color="#70D900" strokeWidth={2} /></span>
                <h3>Our Vision</h3>
                <p>{ABOUT.vision}</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ---------- 03 VALUES ---------- */}
      <section className="ab-sec">
        <div className="ab-wrap">
          <Label n="04">What we stand for</Label>
          <div className="ab-split ab-split--rev">
            <div className="ab-text">
              <Words text="Our Values" />
              <ul className="ab-vals">
                {ABOUT.values.map((v, i) => (
                  <li key={v} className="ab-reveal" style={{ '--i': 2 + i }}>
                    <div className="ab-val">
                      <i><Icon name="check" size={13} color="#06100a" strokeWidth={3} /></i>
                      <span>{v}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <Pic src={PICS.values} alt="Business handshake" tag="Trusted partnerships" />
          </div>
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="ab-cta">
        <div className="ab-wrap ab-cta__in">
          <Words text="Let’s build tomorrow, together." accentFrom={2} />
          <div className="ab-btns ab-reveal" style={{ '--i': 4 }}>
            <Link to="/contact" className="ab-btn">Work with us</Link>
            <Link to="/services" className="ab-btn ab-btn--line">Our services</Link>
          </div>
        </div>
      </section>
    </div>
  );
}