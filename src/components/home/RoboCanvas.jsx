import { useEffect, useRef } from 'react';

/** Live "neural network" background: drifting nodes, links, data pulses, mouse repel. */
export default function RoboCanvas({ density = 0.00007, color = '59,169,53' }) {
  const ref = useRef(null);

  useEffect(() => {
    const cv = ref.current;
    const ctx = cv.getContext('2d');
    const host = cv.parentElement;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const LINK = 140;
    let w, h, nodes = [], pulses = [], raf = 0, running = false, visible = true;
    const mouse = { x: -999, y: -999 };

    const resize = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      w = cv.clientWidth; h = cv.clientHeight;
      cv.width = w * dpr; cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.min(95, Math.round(w * h * density));
      nodes = Array.from({ length: n }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
      }));
      pulses = [];
    };

    const frame = () => {
      ctx.clearRect(0, 0, w, h);
      for (const n of nodes) {
        if (!reduce) {
          n.x += n.vx; n.y += n.vy;
          if (n.x < 0 || n.x > w) n.vx *= -1;
          if (n.y < 0 || n.y > h) n.vy *= -1;
          const dx = n.x - mouse.x, dy = n.y - mouse.y, d = Math.hypot(dx, dy);
          if (d < 130 && d > 0) { n.x += (dx / d) * 1.4; n.y += (dy / d) * 1.4; }
        }
      }
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < LINK) {
            ctx.strokeStyle = `rgba(${color},${(1 - d / LINK) * 0.4})`;
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
            if (!reduce && pulses.length < 16 && Math.random() < 0.0006) pulses.push({ a, b, t: 0 });
          }
        }
      }
      for (const n of nodes) {
        ctx.fillStyle = `rgba(${color},.9)`;
        ctx.beginPath(); ctx.arc(n.x, n.y, 1.8, 0, 6.283); ctx.fill();
      }
      pulses = pulses.filter((p) => (p.t += 0.018) < 1);
      for (const p of pulses) {
        const x = p.a.x + (p.b.x - p.a.x) * p.t, y = p.a.y + (p.b.y - p.a.y) * p.t;
        const g = ctx.createRadialGradient(x, y, 0, x, y, 9);
        g.addColorStop(0, 'rgba(190,255,180,1)'); g.addColorStop(1, `rgba(${color},0)`);
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, 9, 0, 6.283); ctx.fill();
      }
      if (!reduce && visible) raf = requestAnimationFrame(frame); else running = false;
    };

    const start = () => { if (!running) { running = true; raf = requestAnimationFrame(frame); } };
    const move = (e) => { const r = cv.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; };
    const leave = () => { mouse.x = mouse.y = -999; };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) start(); });

    resize(); start(); io.observe(cv);
    host.addEventListener('mousemove', move); host.addEventListener('mouseleave', leave);
    addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(raf); io.disconnect(); removeEventListener('resize', resize);
      host.removeEventListener('mousemove', move); host.removeEventListener('mouseleave', leave);
    };
  }, [density, color]);

  return <canvas ref={ref} className="robo-canvas" aria-hidden="true" />;
}
