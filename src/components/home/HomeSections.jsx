import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Img from '../Img.jsx';
import Icon from '../Icon.jsx';
import { HERO_STATS, IMAGES, POPULAR_CATEGORIES } from '../../data/siteData.js';
import { CountUp, Reveal, stagger, rise } from './Motion.jsx';

/* ---------- 1. Scrolling industries strip (swap for real partner logos when you have them) ---------- */
const ROW_A = ['AI Robotics', 'Smart Home', 'Industrial Machinery', 'EV & Charging', 'Consumer Electronics', 'Packaging'];
const ROW_B = ['Renewable Energy', 'Medical Devices', 'LED & Lighting', 'Tools & Hardware', 'Drones', 'Wearables'];
export function Marquee() {
  const row = (items, rev) => (
    <div className={`mq__row ${rev ? 'mq__row--rev' : ''}`}>
      <div className="mq__track">{[...items, ...items, ...items, ...items].map((t, i) => <span key={i}>{t}</span>)}</div>
    </div>
  );
  return (
    <section className="mq">
      <Reveal as="p" className="mq__label">Sourcing across the industries that are shaping tomorrow.</Reveal>
      {row(ROW_A)}{row(ROW_B, true)}
    </section>
  );
}

/* ---------- 2. Values: hover-to-expand panels ---------- */
const VALUES = [
  { t: 'Verified', p: 'We vet manufacturers before we introduce them, so you work with real, capable factories.' },
  { t: 'Transparent', p: 'Clear quotes, honest timelines and no surprises along the way.' },
  { t: 'Fast', p: 'Quick answers, samples and quotes so your deals keep moving.' },
  { t: 'Global', p: 'Shipping, customs and compliance handled across markets.' },
];
export function Values() {
  const [open, setOpen] = useState(0);
  return (
    <section className="home-sec values">
      <div className="wrap">
        <Reveal as="h2" className="big">Built on four promises.</Reveal>
        <motion.div className="values__row" variants={stagger(0.1)} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}>
          {VALUES.map((v, i) => (
            <motion.button key={v.t} variants={rise} className={`values__panel ${open === i ? 'is-open' : ''}`}
              onMouseEnter={() => setOpen(i)} onFocus={() => setOpen(i)} onClick={() => setOpen(i)}>
              <Img src={POPULAR_CATEGORIES[i]?.image || IMAGES.heroRobot} alt="" className="values__img" />
              <span className="values__shade" />
              <span className="values__txt"><h3>{v.t}</h3><p>{v.p}</p></span>
            </motion.button>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- 3. Impact numbers ---------- */
export function Impact() {
  return (
    <section className="home-sec">
      <div className="wrap">
        <div className="impact">
          <div className="impact__glow" />
          <Reveal as="h2" className="big big--light">Sourcing that scales with you.</Reveal>
          <motion.ul className="impact__grid" variants={stagger(0.12)} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}>
            {HERO_STATS.map((s) => (
              <motion.li key={s.label} variants={rise}>
                <Icon name={s.icon} size={30} color="#70D900" strokeWidth={1.5} />
                <strong><CountUp value={s.value} /></strong>
                <span>{s.label}</span>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  );
}

/* ---------- 4. Category rail ---------- */
export function Rail() {
  const ref = useRef(null);
  const go = (d) => ref.current.scrollBy({ left: d * 380, behavior: 'smooth' });
  return (
    <section className="home-sec rail">
      <div className="wrap rail__head">
        <Reveal as="h2" className="big">Popular categories.</Reveal>
        <div className="rail__btns">
          <button onClick={() => go(-1)} aria-label="Previous"><span style={{ display: 'inline-flex', transform: 'rotate(180deg)' }}><Icon name="arrow-right" size={20} color="currentColor" strokeWidth={2} /></span></button>
          <button onClick={() => go(1)} aria-label="Next"><Icon name="arrow-right" size={20} color="currentColor" strokeWidth={2} /></button>
        </div>
      </div>
      <div className="rail__scroll" ref={ref}>
        {POPULAR_CATEGORIES.map((c, i) => (
          <Reveal key={c.title} delay={i * 0.06} x={60} y={0} className="rail__item">
            <Link to={c.to} className="rail__card">
              <Img src={c.image} alt={c.title} className="rail__img" />
              <span className="rail__shade" />
              <span className="rail__txt"><h3>{c.title}</h3><p>{c.text}</p></span>
              <span className="rail__go"><Icon name="arrow-right" size={20} color="currentColor" strokeWidth={2} /></span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------- 5. How it works: stacking cards ---------- */
const STEPS = [
  { t: 'Tell us what you need', p: 'Share the product, quantity and target price. We take it from there.' },
  { t: 'We find and verify', p: 'We shortlist suitable manufacturers and check them before any introduction.' },
  { t: 'Sample and negotiate', p: 'Compare samples and quotes while we negotiate terms on your behalf.' },
  { t: 'Ship and support', p: 'We coordinate production, quality checks and delivery to your door.' },
];
export function Steps() {
  return (
    <section className="home-sec steps">
      <div className="wrap">
        <Reveal as="h2" className="big">How it works.</Reveal>
        {STEPS.map((s, i) => (
          <motion.article key={s.t} className="steps__card" style={{ '--i': i }}
            initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.8 }}>
            <span className="steps__n">{i + 1}</span>
            <div><h3>{s.t}</h3><p>{s.p}</p></div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

/* ---------- 6. Call to action ---------- */
export function CTA() {
  return (
    <section className="home-sec cta">
      <div className="wrap">
        <Reveal className="cta__panel">
          <h2 className="big">Ready to source smarter?</h2>
          <p style={{color: 'white'}}>Tell us what you’re looking for and we’ll get back to you quickly.</p>
          <div className="cta__btns">
            <Link to="/contact" className="pill pill--dark">Let’s talk</Link>
            <Link to="/supplier" className="pill pill--ghost">Become a supplier</Link>
          </div>
        </Reveal>
      </div>
      <div className="cta__ticker" aria-hidden="true">
        <div>{Array.from({ length: 8 }).map((_, i) => <span key={i}>Dependably, we source.</span>)}</div>
      </div>
    </section>
  );
}
