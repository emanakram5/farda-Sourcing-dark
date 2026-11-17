import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import Logo from './Logo.jsx';
import Button from './Button.jsx';
import Icon from './Icon.jsx';
import { NAV_LINKS } from '../data/siteData.js';
import './Navbar.css';

const ease = [0.22, 1, 0.36, 1];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { pathname } = useLocation();
  const { scrollY } = useScroll();
  const isHome = pathname === '/';

  // Close the mobile menu when the route changes
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    setScrolled(window.scrollY > 60);
  }, []);

  // Solid pill after scrolling; hide when scrolling down, show when scrolling up
  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 60);
    setHidden(y > prev && y > 260 && !open);
  });

  // Transparent glass only on the Home hero; every other page uses the solid pill
  const solid = scrolled || !isHome || open;
  const links = NAV_LINKS.filter((l) => l.to !== '/'); // logo already links home

  return (
    <motion.header
      className={`navbar${solid ? ' is-solid' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: hidden ? -120 : 0 }}
      transition={{ duration: 0.5, ease }}
    >
      <div className="navbar__bar">
        <Link to="/" className="navbar__brand" aria-label="Farda Sourcing home">
          <Logo variant="light" size={26} />
        </Link>

        <nav id="primary-menu" className={`navbar__menu${open ? ' is-open' : ''}`} aria-label="Primary">
          <ul className="navbar__links">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink to={link.to} className={({ isActive }) => `navbar__link${isActive ? ' active' : ''}`}>
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="navbar__cta">
            <Button to="/contact">Get a Quote</Button>
          </div>
        </nav>

        <button
          type="button"
          className="navbar__toggle"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="primary-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <Icon name={open ? 'close' : 'menu'} size={24} />
        </button>
      </div>
    </motion.header>
  );
}
