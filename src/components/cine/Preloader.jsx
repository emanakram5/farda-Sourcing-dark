import { useEffect, useState } from 'react';
import Logo from '../Logo.jsx';

export default function Preloader() {
  const seen = (() => { try { return sessionStorage.getItem('farda-pre'); } catch { return null; } })();
  const [n, setN] = useState(seen ? 100 : 0);
  const [gone, setGone] = useState(!!seen);

  useEffect(() => {
    if (seen) return;
    const t0 = performance.now(); let raf;
    const tick = (now) => {
      const k = Math.min(1, (now - t0) / 1900);
      setN(Math.round(100 * (1 - Math.pow(1 - k, 3))));
      if (k < 1) raf = requestAnimationFrame(tick);
      else setTimeout(() => { setGone(true); try { sessionStorage.setItem('farda-pre', '1'); } catch {} }, 350);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []); // eslint-disable-line

  if (gone && seen) return null;
  return (
    <div className={`pre ${gone ? 'is-gone' : ''}`} role="status" aria-label="Loading">
      <Logo variant="light" size={44} />
      <p className="pre__txt">Sourcing in</p>
      <strong className="pre__n">{n}%</strong>
      <i className="pre__bar" style={{ transform: `scaleX(${n / 100})` }} />
    </div>
  );
}
