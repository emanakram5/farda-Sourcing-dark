import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Logo from './Logo.jsx';
import Icon from './Icon.jsx';
import { FOOTER_COLUMNS, SOCIAL_LINKS } from '../data/siteData.js';
import './Footer.css';

const EASE = [0.22, 1, 0.36, 1];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });

  const onSubmit = (e) => {
    e.preventDefault();
    if (!EMAIL_RE.test(email.trim())) {
      setStatus({ type: 'error', message: 'Please enter a valid email address.' });
      return;
    }
    // TODO: connect to your newsletter provider (Mailchimp, Brevo, etc.)
    setStatus({ type: 'success', message: 'Thanks for subscribing!' });
    setEmail('');
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <div className="footer__brand">
            <Link to="/" aria-label="Farda Sourcing home">
              <Logo variant="light" />
            </Link>
            <p>
              Farda Sourcing is your trusted partner for global sourcing, quality products and reliable business
              solutions.
            </p>
            <ul className="footer__social">
              {SOCIAL_LINKS.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noreferrer" aria-label={s.label}>
                    <Icon name={s.icon} size={15} strokeWidth={2} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {FOOTER_COLUMNS.map((col) => (
            <div className="footer__col" key={col.title}>
              <h4>{col.title}</h4>
              <ul>
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="footer__col footer__newsletter">
            <h4>Newsletter</h4>
            <p>Stay updated with new products and industry insights.</p>
            <form onSubmit={onSubmit} noValidate>
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <div className="footer__form-row">
                <input
                  id="newsletter-email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status.message) setStatus({ type: '', message: '' });
                  }}
                />
                <button type="submit" aria-label="Subscribe">
                  <Icon name="arrow-right" size={16} strokeWidth={2.2} />
                </button>
              </div>
              {status.message && (
                <p className={`footer__status footer__status--${status.type}`} role="status">
                  {status.message}
                </p>
              )}
            </form>
          </div>
        </div>

        <div className="footer__bottom">
          <p>© {new Date().getFullYear()} Farda Sourcing. All rights reserved.</p>
        </div>
      </div>

    
    </footer>
  );
}
