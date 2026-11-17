import { useEffect, useMemo, useRef, useState } from 'react';
import Button from '../components/Button.jsx';
import Img from '../components/Img.jsx';
import Icon from '../components/Icon.jsx';
import { IMAGES, SERVICES } from '../data/siteData.js';
import './Services.css';

/*
  SOURCING ROUTE
  Scroll = a shipment travelling along a glowing route on a 3D floor.
  Each service is a station on the route. The container "arrives" at a
  station as you scroll, the station lights up, and its details appear.
*/

const VB_W = 1000;
const VB_H = 500;
const PATH_D =
  'M 40 400 C 200 400 220 100 380 130 C 540 160 520 420 680 400 C 840 380 800 100 960 90';

const pad = (n) => String(n).padStart(2, '0');

export default function Services() {
  const n = SERVICES.length;

  const wrapRef = useRef(null);
  const stageRef = useRef(null);
  const pathRef = useRef(null);
  const progRef = useRef(null);
  const truckRef = useRef(null);
  const barRef = useRef(null);

  const [pts, setPts] = useState([]);
  const [active, setActive] = useState(0);

  // where each station sits along the route (0..1)
  const ts = useMemo(
    () =>
      SERVICES.map((_, i) => (n === 1 ? 0.5 : 0.05 + 0.9 * (i / (n - 1)))),
    [n]
  );

  // station positions (in % of the floor)
  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const len = path.getTotalLength();
    setPts(
      ts.map((t) => {
        const p = path.getPointAtLength(t * len);
        return { x: (p.x / VB_W) * 100, y: (p.y / VB_H) * 100 };
      })
    );
  }, [ts]);

  // scroll-driven journey (smoothed with a tiny lerp loop)
  useEffect(() => {
    const path = pathRef.current;
    const prog = progRef.current;
    const truck = truckRef.current;
    const bar = barRef.current;
    const stage = stageRef.current;
    if (!path || !prog || !truck || !bar || !stage) return;

    const len = path.getTotalLength();
    const reduce = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    prog.style.strokeDasharray = len;

    let target = 0;
    let cur = 0;
    let raf = 0;
    let lastActive = -1;

    const draw = (p) => {
      const pt = path.getPointAtLength(p * len);
      truck.style.left = `${(pt.x / VB_W) * 100}%`;
      truck.style.top = `${(pt.y / VB_H) * 100}%`;
      prog.style.strokeDashoffset = len * (1 - p);
      bar.style.transform = `scaleX(${p})`;
      stage.classList.toggle('is-started', p > 0.01);

      let a = 0;
      ts.forEach((t, i) => {
        if (p >= t - 0.02) a = i;
      });
      if (a !== lastActive) {
        lastActive = a;
        setActive(a);
      }
    };

    const tick = () => {
      raf = 0;
      cur = reduce ? target : cur + (target - cur) * 0.08;
      if (Math.abs(target - cur) < 0.0004) cur = target;
      draw(cur);
      if (cur !== target) raf = requestAnimationFrame(tick);
    };

    const read = () => {
      const el = wrapRef.current;
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
  }, [ts]);

  const current = SERVICES[active] || SERVICES[0];

  return (
    <section className="journey">
      <div
        className="journey__wrap"
        ref={wrapRef}
        style={{ height: `calc(${n} * 62vh + 100vh)` }}
      >
        <div className="stage" ref={stageRef}>
          {/* backdrop */}
          <Img
            src={IMAGES.servicesShip}
            alt=""
            className="journey__bg"
            eager
          />
          <div className="journey__dust" aria-hidden="true">
            {Array.from({ length: 14 }).map((_, i) => (
              <span
                key={i}
                style={{
                  left: `${(i * 53) % 100}%`,
                  animationDelay: `${-(i * 1.7)}s`,
                  animationDuration: `${9 + (i % 5) * 2}s`,
                }}
              />
            ))}
          </div>

          {/* giant ghost title of the active service */}
          <div className="stage__ghost" key={`g${active}`} aria-hidden="true">
            {current.title}
          </div>

          {/* header */}
          <div className="stage__head">
            <span className="stage__eyebrow">Our Services</span>
            <h1>
              End-to-End Sourcing Solutions
              <br />
              For Your Business
            </h1>
            <p>
              We provide complete sourcing and supply chain solutions so you
              can focus on growing your business.
            </p>
          </div>

          {/* detail panel */}
          <div className="panel" key={`p${active}`}>
            <span className="panel__no">{pad(active + 1)}</span>
            <span className="panel__icon">
              <Icon name={current.icon} size={26} color="#70D900" />
            </span>
            <h2>{current.title}</h2>
            <p>{current.text}</p>
          </div>

          {/* 3D floor with the route */}
          <div className="world">
            <div className="world__floor" />

            <svg
              className="route"
              viewBox={`0 0 ${VB_W} ${VB_H}`}
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path ref={pathRef} className="route__base" d={PATH_D} />
              <path ref={progRef} className="route__prog" d={PATH_D} />
            </svg>

            {/* stations */}
            <ul className="stations">
              {SERVICES.map((s, i) => {
                const pt = pts[i];
                if (!pt) return null;
                return (
                  <li
                    key={s.title}
                    className={`pin node${i <= active ? ' is-reached' : ''}${
                      i === active ? ' is-active' : ''
                    }`}
                    style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
                  >
                    <span className="pin__ground">
                      <i />
                    </span>
                    <span className="pin__body">
                      <span className="node__label">{s.title}</span>
                      <span className="node__icon">
                        <Icon
                          name={s.icon}
                          size={22}
                          color={i <= active ? '#061006' : '#70D900'}
                        />
                      </span>
                      <span className="node__stem" />
                    </span>
                  </li>
                );
              })}
            </ul>

            {/* the shipment */}
            <div className="pin truck" ref={truckRef}>
              <span className="pin__ground truck__glow">
                <i />
              </span>
              <span className="pin__body">
                <span className="truck__box" />
              </span>
            </div>
          </div>

          <div className="stage__hint" aria-hidden="true">
            <span className="stage__mouse" />
            Scroll to ship
          </div>

          {/* footer */}
          <div className="stage__foot">
            <div className="count">
              <strong>{pad(active + 1)}</strong>
              <span>/ {pad(n)}</span>
              <em>{current.title}</em>
            </div>
            <div className="journey__cta">
              <Button to="/contact" icon="arrow-right">
                Discuss Your Requirements
              </Button>
            </div>
          </div>

          <div className="stage__bar">
            <i ref={barRef} style={{ transform: 'scaleX(0)' }} />
          </div>
        </div>
      </div>
    </section>
  );
}