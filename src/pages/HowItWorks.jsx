import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Button from "../components/Button.jsx";
import Icon from "../components/Icon.jsx";
import { PROCESS_STEPS } from "../data/siteData.js";
import "./HowItWorks.css";

/*
  VERTICAL SLIDER (scroll-driven)
  The page pins to the screen and scrolling spins the steps like a vertical
  drum: the active step sits in the focus frame, previous ones tilt away
  upward, next ones wait below. The rail on the left is clickable.
*/

const pad = (n) => String(n).padStart(2, "0");

export default function HowItWorks({ embedded = false }) {
  const [simple, setSimple] = useState(
    () =>
      window.matchMedia(
        "(max-width: 1000px), (max-height: 700px), (prefers-reduced-motion: reduce)",
      ).matches,
  );
  useEffect(() => {
    const mq = window.matchMedia(
      "(max-width: 1000px), (max-height: 700px), (prefers-reduced-motion: reduce)",
    );
    const update = () => setSimple(mq.matches);
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  const Heading = embedded ? "h2" : "h1";
  const steps = PROCESS_STEPS;
  const n = steps.length;

  const wrapRef = useRef(null);
  const stageRef = useRef(null);
  const cardRefs = useRef([]);
  const fillRef = useRef(null);
  const barRef = useRef(null);

  const [active, setActive] = useState(0);

  useLayoutEffect(() => {
    if (simple) return;
    const stage = stageRef.current;
    const fill = fillRef.current;
    const bar = barRef.current;
    if (!stage || !fill || !bar) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let target = 0;
    let cur = 0;
    let raf = 0;
    let lastActive = -1;

    const draw = (p) => {
      const pos = p * Math.max(0, n - 1);
      const gap = Math.min(250, window.innerHeight * 0.29);

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
        el.style.filter =
          ad < 0.05 ? "none" : `blur(${Math.min(5, ad * 3.5)}px)`;
        el.style.zIndex = String(100 - Math.round(ad * 10));
        el.style.pointerEvents = ad < 0.5 ? "auto" : "none";
      });

      fill.style.transform = `scaleY(${p})`;
      bar.style.transform = `scaleX(${p})`;
      stage.classList.toggle("is-started", p > 0.01);

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
      const el = wrapRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const max = r.height - window.innerHeight;
      target = max > 0 ? Math.min(1, Math.max(0, -r.top / max)) : 0;
      if (!raf) raf = requestAnimationFrame(tick);
    };

    draw(0);
    read();
    window.addEventListener("scroll", read, { passive: true });
    window.addEventListener("resize", read);
    return () => {
      window.removeEventListener("scroll", read);
      window.removeEventListener("resize", read);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [n, simple]);

  // jump to a step by scrolling to its position
  const goTo = (i) => {
    const el = wrapRef.current;
    if (!el) return;
    const idx = Math.max(0, Math.min(n - 1, i));
    const top = el.getBoundingClientRect().top + window.scrollY;
    const max = el.offsetHeight - window.innerHeight;
    window.scrollTo({
      top: top + (n > 1 ? idx / (n - 1) : 0) * max,
      behavior: "smooth",
    });
  };

  const current = steps[active] || steps[0];
  if (simple)
    return (
      <section className="simple-process section-space">
        <span className="kicker">HOW IT WORKS</span>
        <Heading>Our sourcing process, simplified.</Heading>
        <p>
          A transparent and efficient process to deliver the best products for
          your business.
        </p>
        <ol className="process-grid">
          {steps.map((s) => (
            <li className="glass process-card" key={s.number}>
              <span className="step-number">{s.number}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
        <Button to="/get-a-quote">Get Started Today</Button>
      </section>
    );

  return (
    <section className="hiw">
      <div
        className="hiw__wrap"
        ref={wrapRef}
        style={{ height: `calc(${n} * 60vh + 100vh)` }}
      >
        <div className="hiw__stage" ref={stageRef}>
          {/* falling light streaks */}
          <div className="hiw__streaks" aria-hidden="true">
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

          {/* giant ghost number of the active step */}
          <div className="hiw__ghost" key={`g${active}`} aria-hidden="true">
            {current.number}
          </div>

          {/* header */}
          <div className="hiw__head">
            <span className="hiw__eyebrow">How It Works</span>
            <Heading>
              Our Sourcing Process
              <br />
              Simplified
            </Heading>
            <p>
              A transparent and efficient process to deliver the best products
              for your business.
            </p>
          </div>

          {/* clickable vertical rail */}
          <nav className="hiw__rail" aria-label="Process steps">
            <span className="hiw__line">
              <i ref={fillRef} style={{ transform: "scaleY(0)" }} />
            </span>
            <ul className="hiw__dots">
              {steps.map((s, i) => (
                <li key={s.number}>
                  <button
                    type="button"
                    className={`hiw__dot${i <= active ? " is-reached" : ""}${
                      i === active ? " is-active" : ""
                    }`}
                    onClick={() => goTo(i)}
                    aria-label={`Go to step ${i + 1}: ${s.title}`}
                    aria-current={i === active ? "step" : undefined}
                  >
                    <span className="hiw__dotnum">{pad(i + 1)}</span>
                    <span className="hiw__dotlabel">{s.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* focus frame */}
          <div className="hiw__focus" aria-hidden="true" />

          {/* the vertical drum */}
          <ol className="hiw__drum">
            {steps.map((s, i) => (
              <li
                key={s.number}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                className={`hiw__card${i === active ? " is-active" : ""}`}
              >
                <span className="hiw__num">{s.number}</span>
                <div className="hiw__body">
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </div>
                <span className="hiw__tag">
                  Step {pad(i + 1)} / {pad(n)}
                </span>
              </li>
            ))}
          </ol>

          <div className="hiw__hint" aria-hidden="true">
            <span className="hiw__mouse" />
            Scroll to explore
          </div>

          {/* footer */}
          <div className="hiw__foot">
            <div className="hiw__count">
              <strong>{pad(active + 1)}</strong>
              <span>/ {pad(n)}</span>
              <em>{current.title}</em>
            </div>

            <div className="hiw__actions">
              <div className="hiw__ctrl">
                <button
                  type="button"
                  onClick={() => goTo(active - 1)}
                  disabled={active === 0}
                  aria-label="Previous step"
                >
                  <span className="hiw__chev hiw__chev--up">
                    <Icon
                      name="arrow-right"
                      size={18}
                      color="#fff"
                      strokeWidth={2}
                    />
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => goTo(active + 1)}
                  disabled={active === n - 1}
                  aria-label="Next step"
                >
                  <span className="hiw__chev hiw__chev--down">
                    <Icon
                      name="arrow-right"
                      size={18}
                      color="#fff"
                      strokeWidth={2}
                    />
                  </span>
                </button>
              </div>

              <div className="hiw__cta">
                <Button to="/get-a-quote" icon="arrow-right">
                  Get Started Today
                </Button>
              </div>
            </div>
          </div>

          <div className="hiw__bar">
            <i ref={barRef} style={{ transform: "scaleX(0)" }} />
          </div>
        </div>
      </div>
    </section>
  );
}
