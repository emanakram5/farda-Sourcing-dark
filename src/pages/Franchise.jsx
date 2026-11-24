import React, { useEffect, useLayoutEffect, useRef } from 'react'
import {
  ArrowRight,
  Bike,
  Bot,
  Building2,
  CalendarDays,
  Check,
  ChevronsRight,
  ClipboardCheck,
  Disc3,
  Download,
  Handshake,
  Headset,
  House,
  Landmark,
  Megaphone,
  MessageCircle,
  Phone,
  PlugZap,
  Rocket,
  ShieldCheck,
  Star,
  Store,
  User,
  Warehouse,
} from 'lucide-react'
import './Franchise.css'

// Put your hero image in the /public folder with this name
const HERO_IMAGE = '/images/franchise-banner.svg'

const centralTeam = [
  'Product research and selection',
  'Supplier negotiation and import coordination',
  'Quality control and warranty coordination',
  'Brand guidelines and national marketing',
]

const franchisePartner = [
  'Invest in agreed stock and showroom',
  'Operate the store to brand standards',
  'Manage staff, demonstrations and local sales',
  'Deliver customer experience and follow-up',
]

const products = [
  { icon: Disc3, label: 'Cleaning Robots' },
  { icon: Bot, label: 'AI & Robotics' },
  { icon: Bike, label: 'Electric Mobility' },
  { icon: ShieldCheck, label: 'Smart Security' },
  { icon: House, label: 'Home & Lifestyle' },
  { icon: PlugZap, label: 'Power & Electronics' },
]

const buyers = [
  { icon: User, label: 'Homeowners' },
  { icon: Building2, label: 'Offices and SMEs' },
  { icon: Warehouse, label: 'Retailers and resellers' },
  { icon: Landmark, label: 'Schools and institutions' },
]

const benefits = [
  { icon: Star, label: 'Priority territory review' },
  { icon: Megaphone, label: 'Launch campaign support' },
  { icon: Rocket, label: 'Early access to new product categories' },
  { icon: Headset, label: 'Advisory input on assortment, pricing and store standards' },
]

const steps = [
  { icon: MessageCircle, title: 'Express interest', text: 'online or on WhatsApp' },
  { icon: Phone, title: 'Discovery call:', text: 'city, budget and experience' },
  { icon: CalendarDays, title: 'Meeting at our office', text: 'or video call' },
  { icon: ShieldCheck, title: 'Due diligence', text: 'and offer' },
  { icon: Handshake, title: 'Franchise agreement', text: 'and onboarding' },
]

/* ---------- small 3D building blocks ---------- */

const Cube = ({ size, speed = '16s' }) => (
  <div className="fr-cube" style={{ '--s': `${size}px`, '--sp': speed }}>
    <i /><i /><i /><i /><i /><i />
  </div>
)

const Layer = ({ pos, depth, fd = '6s', className = '', children }) => (
  <div className={`fr-layer ${className}`} style={{ ...pos, '--d': depth }}>
    <div className="fr-float" style={{ '--fd': fd }}>
      {children}
    </div>
  </div>
)

const HeroScene = () => (
  <div className="fr-scene" aria-hidden="true">
    <Layer pos={{ top: '12%', right: '9%' }} depth={34} fd="7s">
      <Cube size={86} speed="18s" />
    </Layer>
    <Layer pos={{ top: '60%', right: '38%' }} depth={-26} fd="5.5s" className="fr-hide-sm">
      <Cube size={42} speed="11s" />
    </Layer>
    <Layer pos={{ top: '10%', left: '44%' }} depth={18} fd="6.5s" className="fr-hide-sm">
      <Cube size={26} speed="9s" />
    </Layer>
    <Layer pos={{ bottom: '12%', right: '5%' }} depth={46} fd="8s">
      <div className="fr-orb" style={{ '--s': '70px' }} />
    </Layer>
    <Layer pos={{ top: '34%', left: '41%' }} depth={-40} fd="6s" className="fr-hide-sm">
      <div className="fr-orb" style={{ '--s': '26px' }} />
    </Layer>
    <Layer pos={{ top: '44%', right: '14%' }} depth={22} fd="9s">
      <div className="fr-ring" style={{ '--s': '130px' }} />
    </Layer>
  </div>
)

const Franchise = ({ hideBrochure = false }) => {
  const rootRef = useRef(null)

  // Turn on the animation layer before first paint
  useLayoutEffect(() => {
    const root = rootRef.current
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (root && !reduce) root.classList.add('fr-anim')
    return () => root && root.classList.remove('fr-anim')
  }, [])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return undefined
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    /* ----- scroll progress + hero parallax offset ----- */
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight
        const p = max > 0 ? Math.min(1, window.scrollY / max) : 0
        root.style.setProperty('--p', p.toFixed(4))
        root.style.setProperty('--sy', String(Math.min(window.scrollY, 700)))
        ticking = false
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    if (reduce) {
      return () => window.removeEventListener('scroll', onScroll)
    }

    /* ----- reveal on scroll ----- */
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const el = entry.target
          el.classList.add('is-in')
          const i = Number(el.style.getPropertyValue('--i')) || 0
          setTimeout(() => el.classList.add('is-done'), 1100 + i * 90)
          io.unobserve(el)
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -6% 0px' }
    )
    root.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el))

    /* ----- 3D tilt on cards ----- */
    let active = null
    const resetTilt = (el) => {
      el.classList.remove('is-tilting')
      ;['--rx', '--ry', '--gx', '--gy'].forEach((v) => el.style.removeProperty(v))
    }
    const onMove = (e) => {
      if (e.pointerType === 'touch') return
      const el = e.target.closest('[data-tilt]')
      if (active && active !== el) resetTilt(active)
      active = el
      if (!el) return
      const r = el.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width
      const py = (e.clientY - r.top) / r.height
      const max = Number(el.dataset.tilt) || 10
      el.classList.add('is-tilting')
      el.style.setProperty('--rx', `${((0.5 - py) * max * 2).toFixed(2)}deg`)
      el.style.setProperty('--ry', `${((px - 0.5) * max * 2).toFixed(2)}deg`)
      el.style.setProperty('--gx', `${(px * 100).toFixed(1)}%`)
      el.style.setProperty('--gy', `${(py * 100).toFixed(1)}%`)
    }
    const onLeave = () => {
      if (active) resetTilt(active)
      active = null
    }
    root.addEventListener('pointermove', onMove)
    root.addEventListener('pointerleave', onLeave)

    /* ----- hero mouse parallax ----- */
    const hero = root.querySelector('.fr-hero')
    const onHeroMove = (e) => {
      const r = hero.getBoundingClientRect()
      hero.style.setProperty('--mx', (((e.clientX - r.left) / r.width - 0.5) * 2).toFixed(3))
      hero.style.setProperty('--my', (((e.clientY - r.top) / r.height - 0.5) * 2).toFixed(3))
    }
    const onHeroLeave = () => {
      hero.style.setProperty('--mx', '0')
      hero.style.setProperty('--my', '0')
    }
    hero.addEventListener('pointermove', onHeroMove)
    hero.addEventListener('pointerleave', onHeroLeave)

    return () => {
      window.removeEventListener('scroll', onScroll)
      io.disconnect()
      root.removeEventListener('pointermove', onMove)
      root.removeEventListener('pointerleave', onLeave)
      hero.removeEventListener('pointermove', onHeroMove)
      hero.removeEventListener('pointerleave', onHeroLeave)
    }
  }, [])

  return (
    <article className="fr-page" ref={rootRef}>
      <div className="fr-progress" aria-hidden="true" />

      {/* ===== HERO ===== */}
      <section className="fr-hero">
        <div className="fr-container fr-hero__inner">
          <div className="fr-hero__content">
            <p className="fr-eyebrow">
              Founding Partner Program <span className="fr-eyebrow__line" />
            </p>
            <h1 className="fr-hero__title">
              <span className="fr-line">
                <span className="fr-line__in" style={{ '--l': 0 }}>Bring the Future</span>
              </span>
              <span className="fr-line">
                <span className="fr-line__in" style={{ '--l': 1 }}>
                  to <span className="fr-green">Your City.</span>
                </span>
              </span>
            </h1>
            <p className="fr-hero__text">
              A new-generation franchise connecting Pakistan with China&rsquo;s world of
              innovative products. Not another electronics shop: a discovery destination
              where customers see, try and buy the products of tomorrow.
            </p>
            <div className="fr-hero__actions">
              <a href="/contact?inquiry=Franchise%20Partnership" className="fr-btn fr-btn--primary">
                <ClipboardCheck size={15} />
                Express Interest
                <ArrowRight size={15} />
              </a>
              {!hideBrochure && <a href="/contact?inquiry=Franchise%20Partnership" className="fr-btn fr-btn--outline">
                <MessageCircle size={15} />
                Request Franchise Brochure
              </a>}
            </div>
          </div>
          <div className="fr-hero__media">
            <img src={HERO_IMAGE} alt="Farda Sourcing franchise showroom" />
          </div>
        </div>
        <HeroScene />
      </section>

      {/* ===== OPPORTUNITY + MODEL ===== */}
      <section className="fr-section">
        <div className="fr-container fr-split fr-split--opportunity">
          <div className="fr-opportunity" data-reveal="left">
            <p className="fr-eyebrow">
              The Opportunity <span className="fr-eyebrow__line" />
            </p>
            <h2 className="fr-opportunity__title">
              China is creating the products of tomorrow. Pakistan needs trusted places
              where customers can discover, experience and buy them.
            </h2>
          </div>

          <div className="fr-model">
            <p className="fr-eyebrow fr-eyebrow--bold" data-reveal style={{ '--i': 1 }}>
              How the Model Works <span className="fr-eyebrow__line" />
            </p>
            <div className="fr-model__cards">
              <article
                className="fr-card fr-model__card fr-tilt"
                data-tilt="8"
                data-reveal="zoom"
                style={{ '--i': 2 }}
              >
                <header className="fr-model__head">
                  <Building2 size={38} strokeWidth={1.5} className="fr-green" />
                  <h3>Farda Central Team</h3>
                </header>
                <ul className="fr-checklist">
                  {centralTeam.map((item) => (
                    <li key={item}>
                      <span className="fr-check">
                        <Check size={11} strokeWidth={3} />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </article>

              <ChevronsRight className="fr-model__arrow" size={44} strokeWidth={1.5} />

              <article
                className="fr-card fr-model__card fr-tilt"
                data-tilt="8"
                data-reveal="zoom"
                style={{ '--i': 3 }}
              >
                <header className="fr-model__head">
                  <Store size={38} strokeWidth={1.5} className="fr-green" />
                  <h3>Franchise Partner</h3>
                </header>
                <ul className="fr-checklist">
                  {franchisePartner.map((item) => (
                    <li key={item}>
                      <span className="fr-check">
                        <Check size={11} strokeWidth={3} />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PRODUCTS + WHO BUYS ===== */}
      <section className="fr-section fr-section--ruled">
        <div className="fr-container fr-split fr-split--products">
          <div className="fr-products">
            <div className="fr-products__intro" data-reveal="left">
              <p className="fr-eyebrow">
                Product Universe <span className="fr-eyebrow__line" />
              </p>
              <h2 className="fr-h2">A World of Innovative Products</h2>
              <p className="fr-small">
                From smart homes to advanced robotics, our franchise brings the best of
                global innovation to your city.
              </p>
            </div>
            <div className="fr-products__grid">
              {products.map(({ icon: Icon, label }, i) => (
                <div
                  className="fr-tile fr-tilt"
                  key={label}
                  data-tilt="14"
                  data-reveal="zoom"
                  style={{ '--i': i }}
                >
                  <Icon size={32} strokeWidth={1.4} />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="fr-buyers">
            <div className="fr-buyers__intro" data-reveal="right">
              <p className="fr-eyebrow">
                Who Buys <span className="fr-eyebrow__line" />
              </p>
              <h2 className="fr-h2">A Growing Customer Base</h2>
              <p className="fr-small">
                From households to businesses, our store will be the go-to place for
                innovative solutions.
              </p>
            </div>
            <ul className="fr-buyers__list">
              {buyers.map(({ icon: Icon, label }, i) => (
                <li key={label} data-reveal="right" style={{ '--i': i + 1 }}>
                  <Icon size={26} strokeWidth={1.4} className="fr-green" />
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ===== FOUNDING PARTNER BENEFITS ===== */}
      <section className="fr-section fr-section--tight">
        <div className="fr-container">
          <div className="fr-benefits" data-reveal="zoom">
            <div className="fr-benefits__intro">
              <p className="fr-benefits__label">Founding Partner Benefits</p>
              <h2 className="fr-benefits__title">
                More Support.
                <br />
                Greater Opportunity.
              </h2>
              <p className="fr-small fr-small--dark">As a founding partner, you&rsquo;ll get:</p>
            </div>
            <div className="fr-benefits__items">
              {benefits.map(({ icon: Icon, label }, i) => (
                <div
                  className="fr-benefit fr-tilt"
                  key={label}
                  data-tilt="12"
                  data-reveal
                  style={{ '--i': i + 2 }}
                >
                  <Icon size={30} strokeWidth={1.4} className="fr-green" />
                  <span>{label}</span>
                </div>
              ))}
            </div>
            <p className="fr-benefits__note">
              All benefits are subject to a written franchise agreement.
            </p>
          </div>
        </div>
      </section>

      {/* ===== HOW TO APPLY ===== */}
      <section className="fr-section fr-section--tight" id="apply">
        <div className="fr-container fr-apply">
          <div className="fr-apply__intro" data-reveal="left">
            <p className="fr-eyebrow fr-eyebrow--bold">How to Apply</p>
            <h2 className="fr-h2">Take the Next Step</h2>
            <p className="fr-small">
              Start your journey to becoming a Farda franchise partner today.
            </p>
          </div>
          <ol className="fr-steps" data-reveal style={{ '--i': 1 }}>
            {steps.map(({ icon: Icon, title, text }, i) => (
              <li
                className="fr-step fr-tilt"
                key={title}
                data-tilt="12"
                style={{ '--i': i }}
              >
                <span className="fr-step__num">{i + 1}</span>
                <Icon size={24} strokeWidth={1.5} className="fr-green" />
                <p>
                  <strong>{title}</strong> {text}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className="fr-section fr-section--cta">
        <div className="fr-container">
          <div className="fr-cta fr-tilt" data-tilt="4" data-reveal="zoom">
            <h2 className="fr-cta__title">
              Let&rsquo;s Build a Smarter
              <br />
              Retail Future <span className="fr-green">Together.</span>
            </h2>
            <p className="fr-cta__text">
              Partner with Farda and bring innovation closer to your customers.
            </p>
            <a href="/contact?inquiry=Franchise%20Partnership" className="fr-btn fr-btn--primary fr-btn--lg">
              Express Interest
              <ArrowRight size={15} />
            </a>

            
          </div>
        </div>
      </section>
    </article>
  )
}

export default Franchise

