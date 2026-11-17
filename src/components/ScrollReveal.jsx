import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Gives every inner page (About, Products, Services, ...) scroll-in animations without editing each page.
 * Home has its own animations, so it is skipped.
 */
export default function ScrollReveal() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    if (pathname === '/' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    let els;
    try {
      els = [...document.querySelectorAll('main .container > *:not(:has(.card)), main .card')];
    } catch {
      els = [...document.querySelectorAll('main .card, main .container > *')];
    }

    const counts = new Map();
    els.forEach((el) => {
      const n = counts.get(el.parentElement) || 0;
      counts.set(el.parentElement, n + 1);
      el.style.setProperty('--rv-d', `${Math.min(n, 6) * 70}ms`);
      el.classList.add('rv');
    });

    const timers = [];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target;
          el.classList.add('rv-in');
          io.unobserve(el);
          // hand control back to the element's own hover/transition styles
          timers.push(setTimeout(() => el.classList.remove('rv', 'rv-in'), 1200));
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
    );
    els.forEach((el) => io.observe(el));

    return () => {
      io.disconnect();
      timers.forEach(clearTimeout);
    };
  }, [pathname]);

  return null;
}
