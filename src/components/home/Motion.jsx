import { useEffect, useRef, useState } from 'react';
import { animate, motion, useInView, useReducedMotion } from 'framer-motion';

export const ease = [0.22, 1, 0.36, 1];

export const stagger = (gap = 0.1, delay = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren: gap, delayChildren: delay } },
});

export const rise = {
  hidden: { opacity: 0, y: 36 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
};

/** Scroll-reveal wrapper. <Reveal delay={0.1} x={-30}>...</Reveal> */
export function Reveal({ children, delay = 0, y = 28, x = 0, as = 'div', ...rest }) {
  const reduce = useReducedMotion();
  const Tag = motion[as];
  return (
    <Tag
      initial={reduce ? false : { opacity: 0, y, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8, delay, ease }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/** Counts up numbers inside strings like "500+", "$2.5M", "30,000". */
export function CountUp({ value, duration = 1.8 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const m = String(value).match(/^([^\d]*)([\d.,]+)(.*)$/);
  const target = m ? parseFloat(m[2].replace(/,/g, '')) : 0;
  const decimals = m && m[2].includes('.') ? m[2].split('.')[1].length : 0;
  const [n, setN] = useState(reduce ? target : 0);

  useEffect(() => {
    if (!m || !inView || reduce) return;
    const c = animate(0, target, { duration, ease, onUpdate: setN });
    return () => c.stop();
  }, [inView]); // eslint-disable-line

  if (!m) return <span ref={ref}>{value}</span>;
  return (
    <span ref={ref}>
      {m[1]}
      {n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {m[3]}
    </span>
  );
}
