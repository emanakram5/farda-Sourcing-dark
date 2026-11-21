import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HERO_STATS } from '../../data/siteData.js';
import { CountUp } from '../home/Motion.jsx';

const ease = [0.22, 1, 0.36, 1];
const line = (i) => ({ initial: { y: '110%' }, animate: { y: 0 }, transition: { duration: 1.1, ease, delay: 2.2 + i * 0.12 } });

export default function CinematicHome() {
  return (
    <div className="cine">
      <section className="cine__sec cine__hero">
        <div className="cine__copy">
          <h2 className="cine__h" >
            <span className="mask"><motion.span {...line(0)}>Bringing Tomorrow's</motion.span></span>
            <span className="mask"><motion.span {...line(1)}>Innovation, Today</motion.span></span>
          </h2>
          <motion.p className="cine__p" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.7, duration: 0.9, ease }}>
            Futuristic products from verified factories, delivered by one partner from first quote to final shipment.
          </motion.p>
          <motion.div className="cine__cta" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3, duration: 0.9 }}>
            <Link to="/products" className="pill pill--green">Explore products</Link>
            <Link to="/contact" className="pill pill--glass">Let’s talk</Link>
          </motion.div>
        </div>
        <div className="cine__cue"><span>Scroll</span><i /></div>
      </section>

      <section className="cine__sec cine__chap">
        <motion.div className="cine__card" initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ amount: 0.5 }} transition={{ duration: 0.9, ease }}>
          <h2>Every factory, checked before we introduce it.</h2>
          <p>We audit capacity, certifications and track record, so the cubes you see stacking up are real, capable suppliers.</p>
          <ul className="cine__stats">
            {HERO_STATS.map((s) => (
              <li key={s.label}><strong><CountUp value={s.value} /></strong><span>{s.label}</span></li>
            ))}
          </ul>
        </motion.div>
      </section>

      <section className="cine__sec cine__chap cine__chap--end">
        <motion.div className="cine__card cine__card--wide" initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ amount: 0.5 }} transition={{ duration: 0.9, ease }}>
          <h2>One network. Every market.</h2>
          <p>From the factory hubs of Shenzhen, Yiwu and Ningbo to Pakistan and 15+ countries, we handle shipping, customs and compliance.</p>
          <div className="cine__cta"><Link to="/markets" className="pill pill--green">See our markets</Link></div>
        </motion.div>
      </section>
    </div>
  );
}
