
// import { useEffect, useRef, useState } from 'react';
// import { Link } from 'react-router-dom';
// import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionValueEvent } from 'framer-motion';
// import Icon from '../components/Icon.jsx';
// import Img from '../components/Img.jsx';
// import { ABOUT, IMAGES } from '../data/siteData.js';
// import './About.css';

// const ease = [0.22, 1, 0.36, 1];
// const GAP = 1250;                                   // 3D distance between chapters (px)
// const LABELS = ['Hello', 'Story', 'Office', 'Mission', 'Vision', 'Values'];
// const N = LABELS.length, D = (N - 1) * GAP;
// // subtle colour grade over the video, shifts per chapter (stays dark so text is always readable)
// const TINTS = ['rgba(3,8,5,.62)', 'rgba(2,10,22,.6)', 'rgba(6,6,10,.6)', 'rgba(3,10,6,.6)', 'rgba(16,9,4,.58)', 'rgba(3,8,5,.62)'];
// const BADGES = [
//   { icon: 'globe', t: 'Global network' },
//   { icon: 'shield-check', t: 'Trusted partnerships' },
//   { icon: 'check', t: 'Quality assured' },
//   { icon: 'clock', t: 'Efficient solutions' },
// ];
// const FLOATS = [ // photo cards that drift past between chapters
//   { at: 0.55, src: '/images/services-ship.png', x: -31, ry: 20 },
//   { at: 1.5, src: '/images/supplier-handshake.png', x: 31, ry: -20 },
//   { at: 2.5, src: '/images/cat-industrial.png', x: -31, ry: 20 },
//   { at: 3.5, src: '/images/franchise-banner.png', x: 31, ry: -20 },
//   { at: 4.5, src: '/images/cat-ai-robotics.png', x: -31, ry: 20 },
// ];

// /* 0..1 visibility of something sitting at chapter position `at` while the camera flies forward */
// const vis = (v, at) => {
//   const z = v * D - at * GAP;
//   if (z < -GAP * 1.2) return 0;
//   if (z <= 0) return 1 - Math.pow(-z / (GAP * 1.2), 1.5);
//   return Math.max(0, 1 - z / (GAP * 0.5));
// };

// function Box({ i, p, x = 0, ry = 0, children }) {
//   const o = useTransform(p, (v) => vis(v, i));
//   const bg = useTransform(o, (v) => `rgba(8,12,10,${(v * 0.58).toFixed(3)})`);
//   const bd = useTransform(o, (v) => `rgba(255,255,255,${(v * 0.22).toFixed(3)})`);
//   const blur = useTransform(o, (v) => `blur(${(v * 22).toFixed(1)}px) saturate(1.3)`);
//   const sh = useTransform(o, (v) => `0 40px 110px rgba(0,0,0,${(v * 0.55).toFixed(2)})`);
//   const ghost = useTransform(o, (v) => v * 0.9);
//   return (
//     <motion.div className="afly__pos" style={{ z: -i * GAP, x: `${x}vw`, rotateY: ry }}>
//       <motion.span className="ghost" style={{ opacity: ghost }} aria-hidden="true">{LABELS[i]}</motion.span>
//       <motion.article className="glass" style={{ backgroundColor: bg, borderColor: bd, backdropFilter: blur, WebkitBackdropFilter: blur, boxShadow: sh }}>
//         <motion.div className="glass__in" style={{ opacity: o }}>
//           <header className="glass__bar"><b>Farda</b><span>{LABELS[i]}</span><em>0{i + 1} / 0{N}</em></header>
//           <div className="glass__body">{children}</div>
//         </motion.div>
//       </motion.article>
//     </motion.div>
//   );
// }

// function Float({ at, src, x, ry, p }) {
//   const o = useTransform(p, (v) => vis(v, at));
//   return (
//     <motion.div className="afly__pos afly__pos--float" style={{ z: -at * GAP, x: `${x}vw`, rotateY: ry }}>
//       <motion.img className="float" src={src} alt="" style={{ opacity: o }} loading="lazy" />
//     </motion.div>
//   );
// }

// export default function About() {
//   const ref = useRef(null);
//   const video = useRef(null);
//   const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] });
//   const [active, setActive] = useState(0);
//   useMotionValueEvent(p, 'change', (v) => setActive(Math.round(v * (N - 1))));

//   useEffect(() => { // respect "reduce motion": poster frame only
//     if (matchMedia('(prefers-reduced-motion: reduce)').matches) video.current?.pause();
//   }, []);

//   const z = useTransform(p, [0, 1], [0, D]);
//   const tint = useTransform(p, TINTS.map((_, i) => i / (N - 1)), TINTS);
//   const floorY = useTransform(p, [0, 1], ['0px', `${D / 3}px`]);
//   const mx = useMotionValue(0), my = useMotionValue(0);
//   const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-4, 4]), { stiffness: 60, damping: 20 });
//   const rx = useSpring(useTransform(my, [-0.5, 0.5], [3, -3]), { stiffness: 60, damping: 20 });
//   const move = (e) => { mx.set(e.clientX / innerWidth - 0.5); my.set(e.clientY / innerHeight - 0.5); };
//   const [storyLeft, storyRight] = ABOUT.storyParagraphs;

//   return (
//     <div className="about">
//       <section className="afly" ref={ref} onMouseMove={move}>
//         <div className="afly__stage">
//           {/* cinematic backdrop: looping reel + colour grade + vignette + film grain + letterbox bars */}
//           <video ref={video} className="afly__video" src="/videos/about-reel.mp4" poster="/videos/about-reel.jpg" autoPlay muted loop playsInline preload="auto" />
//           <motion.div className="afly__tint" style={{ backgroundColor: tint }} />
//           <div className="afly__vig" /><div className="afly__grain" />
//           <motion.div className="afly__floor" style={{ backgroundPositionY: floorY }} />

//           <motion.div className="afly__world" style={{ z, rotateX: rx, rotateY: ry }}>
//             {FLOATS.map((f) => <Float key={f.src} {...f} p={p} />)}

//             <Box i={0} p={p} x={-3} ry={4}>
//               <h1 className="glass__h glass__h--xl">
//                 {['Connecting innovation', 'with global markets.'].map((t, k) => (
//                   <span className="mask" key={t}><motion.span initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: 1, ease, delay: 0.4 + k * 0.12 }}>{t}</motion.span></span>
//                 ))}
//               </h1>
//               {ABOUT.paragraphs.map((t) => <p key={t}>{t}</p>)}
//               <ul className="glass__chips">
//                 {BADGES.map((b) => <li key={b.t}><Icon name={b.icon} size={16} color="#70D900" strokeWidth={2} />{b.t}</li>)}
//               </ul>
//             </Box>

//             <Box i={1} p={p} x={4} ry={-4}>
//               <div className="split">
//                 <div><h2 className="glass__h">{ABOUT.storyTitle}</h2><p className="glass__lead">{storyLeft}</p></div>
//                 <Img src="/images/services-ship.png" alt="Container ship at port" className="pic" />
//               </div>
//             </Box>

//             <Box i={2} p={p} x={-4} ry={4}>
//               <div className="split split--rev">
//                 <Img src={IMAGES.aboutOffice} alt="Farda Sourcing office meeting room" className="pic pic--tall" />
//                 <div><h2 className="glass__h">Where it comes together.</h2><p>{storyRight}</p></div>
//               </div>
//             </Box>

//             <Box i={3} p={p} x={4} ry={-4}>
//               <div className="split">
//                 <div><span className="glass__ico"><Icon name="target" size={22} color="#70D900" strokeWidth={2} /></span><h2 className="glass__h">Our Mission</h2><p className="glass__lead">{ABOUT.mission}</p></div>
//                 <Img src="/images/cat-industrial.png" alt="Robotic arm on a production line" className="pic" />
//               </div>
//             </Box>

//             <Box i={4} p={p} x={-4} ry={4}>
//               <div className="split split--rev">
//                 <Img src="/images/franchise-banner.png" alt="Farda Sourcing store" className="pic" />
//                 <div><span className="glass__ico"><Icon name="eye" size={22} color="#70D900" strokeWidth={2} /></span><h2 className="glass__h">Our Vision</h2><p className="glass__lead">{ABOUT.vision}</p></div>
//               </div>
//             </Box>

//             <Box i={5} p={p} x={0} ry={0}>
//               <div className="split">
//                 <div>
//                   <h2 className="glass__h">Our Values</h2>
//                   <ul className="glass__vals">
//                     {ABOUT.values.map((v) => <li key={v}><i><Icon name="check" size={12} color="#06100a" strokeWidth={3} /></i>{v}</li>)}
//                   </ul>
//                 </div>
//                 <Img src="/images/supplier-handshake.png" alt="Business handshake" className="pic" />
//               </div>
//             </Box>
//           </motion.div>

//           <ol className="afly__rail" aria-hidden="true">
//             {LABELS.map((l, k) => <li key={l} className={k === active ? 'is-on' : ''}><i />{l}</li>)}
//           </ol>
//           <div className="afly__cue" style={{ opacity: active === 0 ? 1 : 0 }}>Scroll to fly through</div>
//           <i className="afly__bar afly__bar--t" /><i className="afly__bar afly__bar--b" />
//         </div>
//       </section>

//       <section className="aend">
//         <video className="aend__video" src="/videos/about-reel.mp4" poster="/videos/about-reel.jpg" autoPlay muted loop playsInline />
//         <div className="aend__in">
//           <motion.h2 initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.9, ease }}>
//             Let’s build tomorrow, together.
//           </motion.h2>
//           <div className="aend__btns">
//             <Link to="/contact" className="abtn">Work with us</Link>
//             <Link to="/services" className="abtn abtn--line">Our services</Link>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }

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
            <Pic src={IMAGES.aboutOffice} alt="Farda Sourcing office meeting room" tag="Our office" ratio="4 / 3" />
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
              <Pic src="/images/cat-industrial.png" alt="Robotic arm on a production line" tag="Mission" ratio="16 / 10" />
              <Reveal delay={0.1} className="ab-card__body">
                <span className="ab-ico"><Icon name="target" size={22} color="#70D900" strokeWidth={2} /></span>
                <h3>Our Mission</h3>
                <p>{ABOUT.mission}</p>
              </Reveal>
            </article>
            <article className="ab-card">
              <Pic src="/images/franchise-banner.png" alt="Farda Sourcing store" tag="Vision" ratio="16 / 10" delay={0.12} />
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