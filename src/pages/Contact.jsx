import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Button from '../components/Button.jsx';
import Icon from '../components/Icon.jsx';
import SectionHeader from '../components/SectionHeader.jsx';
import useFormValidation from '../hooks/useFormValidation.js';
import { submitInquiry } from '../services/api.js';
import { INQUIRY_TYPES, SITE } from '../data/siteData.js';
import './Contact.css';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const INITIAL = { name: '', email: '', company: '', country: '', inquiry: '', message: '' };

const RULES = {
  name: (v) => (v.trim().length < 2 ? 'Please enter your full name.' : ''),
  email: (v) => (!EMAIL_RE.test(v.trim()) ? 'Please enter a valid email address.' : ''),
  inquiry: (v) => (!v ? 'Please choose an inquiry type.' : ''),
  message: (v) => (v.trim().length < 10 ? 'Please tell us a little more (at least 10 characters).' : ''),
};

const INFO = [
  { icon: 'mail', label: 'Email', value: SITE.email },
  { icon: 'phone', label: 'Phone / WhatsApp', value: SITE.phone },
  { icon: 'map-pin', label: 'Office', value: SITE.address },
  { icon: 'clock', label: 'Business Hours', value: SITE.hours },
];

export default function Contact() {
  const [params] = useSearchParams();
  const { values, errors, handleChange, handleBlur, validateAll, setField, reset } = useFormValidation(
    INITIAL,
    RULES
  );
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Pre-select inquiry type from ?inquiry=... (used by the Supplier page button)
  useEffect(() => {
    const preset = params.get('inquiry');
    if (preset && INQUIRY_TYPES.includes(preset)) setField('inquiry', preset);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    if (!validateAll()) return;
    try {
      setSending(true);
      await submitInquiry(values);
      setSent(true);
      reset();
    } catch {
      setSubmitError('Something went wrong. Please try again or email us directly.');
    } finally {
      setSending(false);
    }
  };

  const field = (name) => ({
    id: name,
    name,
    value: values[name],
    onChange: handleChange,
    onBlur: handleBlur,
    'aria-invalid': errors[name] ? 'true' : 'false',
    'aria-describedby': errors[name] ? `${name}-error` : undefined,
  });

  const Err = ({ name }) =>
    errors[name] ? (
      <span id={`${name}-error`} className="contact__error" role="alert">
        {errors[name]}
      </span>
    ) : null;

  return (
    <section className="section contact">
      <div className="container contact__row">
        <div className="contact__info">
          <SectionHeader
            as="h1"
            eyebrow="Contact Us"
            title={"Let's Build Something\nGreat Together"}
            text="Have a question or looking to source a product? We are here to help. Get in touch with us today."
            maxWidth={440}
          />
          <ul className="contact__details">
            {INFO.map((item) => (
              <li key={item.label}>
                <span className="contact__icon">
                  <Icon name={item.icon} size={20} color="#70D900" strokeWidth={1.8} />
                </span>
                <div>
                  <strong>{item.label}</strong>
                  <span>{item.value}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="contact__form-card">
          {sent ? (
            <div className="contact__success" role="status">
              <span className="contact__success-icon">
                <Icon name="check" size={28} color="#fff" strokeWidth={3} />
              </span>
              <h2>Thank you!</h2>
              {/* <p>Your message has been received. Our team will get back to you within one business day.</p> */}
              <p>Our team reviews every application. If your products match our categories, we’ll contact you to request a catalogue, price list and samples.   </p>
              <Button variant="outline" onClick={() => setSent(false)}>
                Send another message
              </Button>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate>
              <div className="contact__grid">
                <div className="contact__field">
                  <label htmlFor="name" className="sr-only">
                    Full Name
                  </label>
                  <input type="text" placeholder="Full Name" autoComplete="name" {...field('name')} />
                  <Err name="name" />
                </div>
                <div className="contact__field">
                  <label htmlFor="email" className="sr-only">
                    Your Email
                  </label>
                  <input type="email" placeholder="Your Email" autoComplete="email" {...field('email')} />
                  <Err name="email" />
                </div>
                <div className="contact__field">
                  <label htmlFor="company" className="sr-only">
                    Company Name
                  </label>
                  <input type="text" placeholder="Company Name" autoComplete="organization" {...field('company')} />
                </div>
                <div className="contact__field">
                  <label htmlFor="country" className="sr-only">
                    Country
                  </label>
                  <input type="text" placeholder="Country" autoComplete="country-name" {...field('country')} />
                </div>
              </div>

              <div className="contact__field">
                <label htmlFor="inquiry" className="sr-only">
                  Inquiry Type
                </label>
                <div className="contact__select">
                  <select {...field('inquiry')} className={values.inquiry ? '' : 'is-placeholder'}>
                    <option value="">Inquiry Type</option>
                    {INQUIRY_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  <Icon name="chevron-down" size={16} color="#8a938e" strokeWidth={2} />
                </div>
                <Err name="inquiry" />
              </div>

              <div className="contact__field">
                <label htmlFor="message" className="sr-only">
                  Message
                </label>
                <textarea rows={5} placeholder="Message" {...field('message')} />
                <Err name="message" />
              </div>

              {submitError && (
                <p className="contact__error contact__error--block" role="alert">
                  {submitError}
                </p>
              )}

              <Button type="submit" full icon={sending ? undefined : 'arrow-right'} disabled={sending}>
                {sending ? 'Sending…' : 'Send Message'}
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
