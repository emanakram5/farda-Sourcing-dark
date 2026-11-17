import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import Img from '../Img.jsx';
import { IMAGES } from '../../data/siteData.js';
import RoboCanvas from './RoboCanvas.jsx';

const STORY = [
  { h: 'The future is here', p: 'Smart technology and robotics, sourced from verified factories around the world.' },
  { h: 'We source tech that helps people', p: 'From AI robots to industrial machines, we find the right manufacturer for your business.' },
  { h: 'Reliable sourcing, delivered', p: 'One partner from first quote to final shipment, so you reach more customers with less risk.', cta: true },
];

function Statement({ s, i, p }) {
  const n = STORY.length, a = i / n, b = (i + 1) / n;
  const first = i === 0, last = i === n - 1;
  const input = first ? [0, 0.01, b - 0.06, b + 0.03] : last ? [a - 0.05, a + 0.04, 0.99, 1] : [a - 0.05, a + 0.04, b - 0.06, b + 0.03];
  const opacity = useTransform(p, input, first ? [1, 1, 1, 0] : last ? [0, 1, 1, 1] : [0, 1, 1, 0]);
  const y = useTransform(p, input, first ? [0, 0, 0, -50] : last ? [50, 0, 0, 0] : [50, 0, 0, -50]);
  const events = useTransform(opacity, (o) => (o > 0.5 ? 'auto' : 'none'));
  return (
    <motion.div className="story__stmt" style={{ opacity, y, pointerEvents: events }}>
      <h2 className={first ? 'story__first' : ''}>{s.h}</h2>
      <p>{s.p}</p>
      {s.cta && (
        <div className="story__cta">
          <Link to="/products" className="pill pill--green">Explore products</Link>
          <Link to="/contact" className="pill pill--light">Let’s talk</Link>
        </div>
      )}
    </motion.div>
  );
}

export default function StoryHero() {
  const ref = useRef(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const scale = useTransform(p, [0, 1], [1, 0.95]);
  const radius = useTransform(p, [0, 0.15], [0, 36]);
  const zoom = useTransform(p, [0, 1], [1, 1.18]);

  return (
    <section className="story" ref={ref}>
      <div className="story__stage">
        <motion.div className="story__media" style={{ scale, borderRadius: radius }}>
          <motion.div className="story__bg" style={{ scale: zoom }}>
            <Img src={IMAGES.heroRobot} alt="Farda Sourcing humanoid robot" eager label="Hero robot image" />
            {/* Optional real footage: /public/videos/hero.mp4 */}
            <video autoPlay muted loop playsInline preload="metadata" poster={IMAGES.heroRobot}>
              <source src="/videos/hero.webm" type="video/webm" />
              <source src="/videos/hero.mp4" type="video/mp4" />
            </video>
          </motion.div>
          <RoboCanvas density={0.00004} />
          <div className="story__shade" />
          {STORY.map((s, i) => <Statement key={s.h} s={s} i={i} p={p} />)}
          <div className="story__cue"><span>Scroll</span><i /></div>
          <motion.i className="story__bar" style={{ scaleX: p }} />
        </motion.div>
      </div>
    </section>
  );
}
