

import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import Icon from '../components/Icon.jsx';
import Img from '../components/Img.jsx';
import { ABOUT, IMAGES } from '../data/siteData.js';
import './About.css';

const ease = [0.22, 1, 0.36, 1];

const BADGES = [
  { icon: 'globe', t: 'Global network' },
  { icon: 'shield-check', t: 'Trusted partnerships' },
  { icon: 'check', t: 'Quality assured' },
  { icon: 'clock', t: 'Efficient solutions' },
];

/* fade + slide up when scrolled into view */
function Reveal({ children, delay = 0, className = '' }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease, delay }}
    >
      {children}
    </motion.div>
  );
}

/* headline that rises word by word out of a mask */
function Words({ text, as: Tag = 'h2', className = '', delay = 0, accentFrom = -1 }) {
  const reduce = useReducedMotion();
  if (reduce) return <Tag className={className}>{text}</Tag>;
  const words = text.split(' ');
  return (
    <Tag className={className} aria-label={text}>
      <motion.span
        className="ab-words"
        aria-hidden="true"
        initial="hide"
        whileInView="show"
        viewport={{ once: true, amount: 0.5 }}
        variants={{ hide: {}, show: { transition: { staggerChildren: 0.08, delayChildren: delay } } }}
      >
        {words.map((w, i) => (
          <span className="ab-w" key={i}>
            <motion.span
              className={accentFrom >= 0 && i >= accentFrom ? 'ab-acc' : undefined}
              variants={{ hide: { y: '115%' }, show: { y: 0, transition: { duration: 0.8, ease } } }}
            >
              {w}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}

/* picture that wipes open, then drifts gently while you scroll */
function Pic({ src, alt, tag, ratio = '4 / 3', delay = 0 }) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);
  return (
    <motion.div
      ref={ref}
      className="ab-pic"
      style={{ aspectRatio: ratio }}
      initial={reduce ? false : { clipPath: 'inset(0 0 100% 0)' }}
      whileInView={{ clipPath: 'inset(0 0 0% 0)' }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 1.1, ease, delay }}
    >
      <motion.div className="ab-pic__in" style={reduce ? undefined : { y }}>
        <Img src={src} alt={alt} className="ab-img" />
      </motion.div>
      <span className="ab-pic__shade" />
      {tag && <span className="ab-pic__tag">{tag}</span>}
    </motion.div>
  );
}

/* numbered section label so every part of the page is easy to find */
function Label({ n, children }) {
  return (
    <Reveal className="ab-label">
      <b>{n}</b><span>{children}</span><i />
    </Reveal>
  );
}

export default function About() {
  return (
    <div className="ab">
      {/* ---------- HERO ---------- */}
      <section className="ab-hero">
        <div className="ab-wrap ab-hero__grid">
          <div className="ab-hero__text">
            <Reveal><span className="ab-eyebrow">About Farda Sourcing</span></Reveal>
            <Words as="h1" text="Connecting innovation with global markets." accentFrom={3} delay={0.15} />
            {ABOUT.paragraphs.map((t, i) => (
              <Reveal key={t} delay={0.5 + i * 0.12}><p>{t}</p></Reveal>
            ))}
            <ul className="ab-chips">
              {BADGES.map((b, i) => (
                <li key={b.t}>
                  <Reveal delay={0.8 + i * 0.08} className="ab-chip">
                    <Icon name={b.icon} size={16} color="#70D900" strokeWidth={2} />{b.t}
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
          <Pic src="/images/services-ship.png" alt="Container ship at port" tag="Global logistics" ratio="4 / 3" delay={0.3} />
        </div>
      </section>

      {/* ---------- 01 STORY ---------- */}
      <section className="ab-sec">
        <div className="ab-wrap">
          <Label n="01">Our story</Label>
          <div className="ab-split">
            <Pic src="/images/about-office.svg" alt="Farda Sourcing office meeting room" tag="Our office" ratio="4 / 3" />
            <div className="ab-text">
              <Words text={ABOUT.storyTitle} />
              {ABOUT.storyParagraphs.map((t, i) => (
                <Reveal key={t} delay={0.15 + i * 0.12}><p>{t}</p></Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- 02 MISSION + VISION ---------- */}
      <section className="ab-sec ab-sec--alt">
        <div className="ab-wrap">
          <Label n="02">Purpose</Label>
          <div className="ab-duo">
            <article className="ab-card">
              <Pic src="/images/cat-industrial.svg" alt="Robotic arm on a production line" tag="Mission" ratio="16 / 10" />
              <Reveal delay={0.1} className="ab-card__body">
                <span className="ab-ico"><Icon name="target" size={22} color="#70D900" strokeWidth={2} /></span>
                <h3>Our Mission</h3>
                <p>{ABOUT.mission}</p>
              </Reveal>
            </article>
            <article className="ab-card">
              <Pic src="/images/franchise-banner.svg" alt="Farda Sourcing store" tag="Vision" ratio="16 / 10" delay={0.12} />
              <Reveal delay={0.2} className="ab-card__body">
                <span className="ab-ico"><Icon name="eye" size={22} color="#70D900" strokeWidth={2} /></span>
                <h3>Our Vision</h3>
                <p>{ABOUT.vision}</p>
              </Reveal>
            </article>
          </div>
        </div>
      </section>

      {/* ---------- 03 VALUES ---------- */}
      <section className="ab-sec">
        <div className="ab-wrap">
          <Label n="03">What we stand for</Label>
          <div className="ab-split ab-split--rev">
            <div className="ab-text">
              <Words text="Our Values" />
              <ul className="ab-vals">
                {ABOUT.values.map((v, i) => (
                  <li key={v}>
                    <Reveal delay={i * 0.08} className="ab-val">
                      <i><Icon name="check" size={13} color="#06100a" strokeWidth={3} /></i>
                      <span>{v}</span>
                    </Reveal>
                  </li>
                ))}
              </ul>
            </div>
            <Pic src="/images/supplier-handshake.png" alt="Business handshake" tag="Trusted partnerships" ratio="4 / 3" />
          </div>
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="ab-cta">
        <div className="ab-wrap ab-cta__in">
          <Words text="Let’s build tomorrow, together." accentFrom={2} />
          <Reveal delay={0.3} className="ab-btns">
            <Link to="/contact" className="ab-btn">Work with us</Link>
            <Link to="/services" className="ab-btn ab-btn--line">Our services</Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}