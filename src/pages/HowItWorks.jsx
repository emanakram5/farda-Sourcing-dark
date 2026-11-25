import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { PROCESS_STEPS } from '../data/siteData.js';
import Icon from '../components/Icon.jsx';
import './HowItWorks.css';

const context = [
  'Start with the product you have in mind, your expected quantity and where it needs to be delivered. Clear requirements help us understand your priorities.',
  'We review potential suppliers against your requirements and shortlist manufacturers for further discussion. This gives you a clearer basis for comparing options.',
  'Review the proposed products, specifications and sample arrangements before choosing a supplier. Confirm the details that matter to your order.',
  'Once the requirements are agreed, we coordinate supplier discussions, order details and the next steps in procurement.',
  'Before dispatch, we coordinate a quality audit and pre-shipment inspection against the agreed specifications. Product condition, order quantities and packaging are reviewed so any findings can be addressed before proceeding to shipment.',
  'We help coordinate shipping and delivery arrangements for the order. The destination and agreed terms guide the logistics planning.'
];
export default function HowItWorks({ embedded = false }) {
  const [active, setActive] = useState(0);
  const trackRef = useRef(null);
  const desktopRef = useRef(null);
  const [scrollEnabled, setScrollEnabled] = useState(false);
  useEffect(() => {
    const media = window.matchMedia('(min-width: 901px) and (min-height: 850px) and (prefers-reduced-motion: no-preference)');
    let frame = 0;
    let enabled = false;
    const read = () => {
      frame = 0;
      if (!enabled || !trackRef.current) return;
      const distance = Number(trackRef.current.dataset.scrollDistance);
      const progress = Math.max(0, Math.min(1, (120 - trackRef.current.getBoundingClientRect().top) / distance));
      setActive(Math.min(PROCESS_STEPS.length - 1, Math.floor(progress * PROCESS_STEPS.length)));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(read); };
    const measure = () => {
      const height = desktopRef.current.getBoundingClientRect().height;
      enabled = media.matches && height <= window.innerHeight - 150;
      const distance = (PROCESS_STEPS.length - 1) * Math.max(260, window.innerHeight * .42);
      trackRef.current.style.setProperty('--process-height', height + 'px');
      trackRef.current.style.setProperty('--process-distance', distance + 'px');
      trackRef.current.dataset.scrollDistance = distance;
      setScrollEnabled(enabled);
      schedule();
    };
    const observer = new ResizeObserver(measure);
    observer.observe(desktopRef.current);
    media.addEventListener('change', measure);
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', schedule, { passive: true });
    measure();
    return () => { observer.disconnect(); media.removeEventListener('change', measure); window.removeEventListener('resize', measure); window.removeEventListener('scroll', schedule); cancelAnimationFrame(frame); };
  }, []);
  const selectStep = index => {
    const next = Math.max(0, Math.min(PROCESS_STEPS.length - 1, index));
    if (scrollEnabled) {
      const distance = Number(trackRef.current.dataset.scrollDistance);
      const progress = next === PROCESS_STEPS.length - 1 ? 1 : (next + .25) / PROCESS_STEPS.length;
      window.scrollTo({ top: window.scrollY + trackRef.current.getBoundingClientRect().top - 120 + distance * progress, behavior: 'smooth' });
    } else setActive(next);
  };
  const Heading = embedded ? 'h2' : 'h1';
  const step = PROCESS_STEPS[active];
  return <section className="sourcing-process section-space" aria-labelledby="sourcing-process-title">
    <header className="sourcing-process__heading"><span className="kicker">HOW IT WORKS</span><Heading id="sourcing-process-title">A clear path from idea to delivery.</Heading><p>Six straightforward steps, with support along the way.</p></header>
    <div ref={trackRef} className={"sourcing-process__track" + (scrollEnabled ? " is-scroll-driven" : "")}><div ref={desktopRef} className="sourcing-process__desktop">
      <nav className="sourcing-process__steps" aria-label="Sourcing process steps">{PROCESS_STEPS.map((item, index) => <button key={item.number} type="button" aria-pressed={active === index} onClick={() => selectStep(index)}><span>{item.number}</span><strong>{item.title}</strong><Icon name="arrow-right" size={20} /></button>)}</nav>
      <div className="sourcing-process__panel">
        <div className="sourcing-process__copy" key={step.number} aria-live="polite"><span className="sourcing-process__number">STEP {step.number} OF {String(PROCESS_STEPS.length).padStart(2, '0')}</span><h3>{step.title}</h3><p className="sourcing-process__summary">{step.text}</p><p>{context[active]}</p></div>
        <div className="sourcing-process__controls"><button type="button" onClick={() => selectStep(active - 1)} disabled={active === 0}>Previous</button><span>{active + 1} / {PROCESS_STEPS.length}</span><button type="button" onClick={() => selectStep(active + 1)} disabled={active === PROCESS_STEPS.length - 1}>Next <Icon name="arrow-right" size={18} /></button></div>
      </div>
    </div>
    </div>
    <ol className="sourcing-process__mobile">{PROCESS_STEPS.map((item,index) => <li key={item.number}><span className="sourcing-process__number">STEP {item.number}</span><h3>{item.title}</h3><p>{item.text}</p><p>{context[index]}</p></li>)}</ol>
    <div className="sourcing-process__cta"><Link className="action" to="/get-a-quote">Discuss your project <Icon name="arrow-right" size={20} /></Link></div>
  </section>;
}
