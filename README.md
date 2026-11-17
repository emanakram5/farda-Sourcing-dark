# Farda Sourcing – React Website

Multi-page marketing website for **Farda Sourcing**, built with **React 18**, **React Router 6** and **Vite**.
Plain CSS (no UI framework), fully responsive, no runtime dependencies beyond React and React Router.

## Pages

| Route           | Page         | Highlights                                                  |
| --------------- | ------------ | ----------------------------------------------------------- |
| `/`             | Home         | Hero, stats card, popular categories, "why choose" band     |
| `/about`        | About Us     | Story, mission, vision, values                              |
| `/products`     | Products     | Category filter tabs + product grid                         |
| `/services`     | Services     | 6 service cards + shipping image                            |
| `/markets`      | Markets      | Stats, world map, benefits band                             |
| `/how-it-works` | How It Works | 5-step process                                              |
| `/supplier`     | Supplier     | Benefits list, CTA that pre-selects the contact form option |
| `/contact`      | Contact      | Validated inquiry form with success state                   |
| `*`             | 404          | Not found page                                              |

Navbar (sticky, mobile menu) and Footer (newsletter form with validation) appear on every page.

## Getting started

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in /dist
npm run preview    # preview the production build
```

Requires Node.js 18+.

## Folder structure

```
farda-sourcing/
├── index.html
├── package.json
├── vite.config.js
├── public/
│   ├── favicon.svg
│   └── images/                 <- put your photos here (see below)
└── src/
    ├── main.jsx                <- entry, router setup
    ├── App.jsx                 <- layout + routes
    ├── styles/
    │   ├── variables.css       <- brand colors, spacing, fonts
    │   └── base.css            <- reset, buttons, helpers
    ├── data/
    │   └── siteData.js         <- ALL site text, links and image paths
    ├── components/
    │   ├── Navbar.jsx / .css
    │   ├── Footer.jsx / .css
    │   ├── Logo.jsx / .css
    │   ├── Button.jsx
    │   ├── Icon.jsx            <- inline SVG icon set
    │   ├── Img.jsx             <- <img> with placeholder fallback
    │   ├── SectionHeader.jsx / .css
    │   ├── ScrollToTop.jsx
    │   └── home/               <- Hero, PopularCategories, WhyChoose
    ├── pages/                  <- one file (+ css) per route
    ├── hooks/
    │   └── useFormValidation.js
    └── services/
        └── api.js              <- form submit stub (connect your backend)
```

## Images

All images are referenced from `public/images/`. If a file is missing the site shows a neutral grey placeholder,
so it works out of the box. Add these files (any size, JPG) to get the full look:

```
hero-robot.jpg              about-office.jpg           services-ship.jpg
cat-ai-robotics.jpg         cat-smart-home.jpg         cat-industrial.jpg
cat-consumer-electronics.jpg
prod-humanoid.jpg           prod-vacuum.jpg            prod-robotic-arm.jpg
prod-camera.jpg             prod-wearables.jpg         prod-drone.jpg
prod-scooter.jpg            prod-headphones.jpg
markets-map.jpg             supplier-handshake.jpg
```

To use different names or formats, edit the `IMAGES` object in `src/data/siteData.js`.

## Customising

- **Colors / fonts / spacing:** `src/styles/variables.css`
- **Text, products, services, links, contact details:** `src/data/siteData.js`
- **Contact form backend:** implement `submitInquiry()` in `src/services/api.js`
  (e.g. `fetch('/api/inquiries', …)`, EmailJS or Formspree).
- **Newsletter backend:** see the `TODO` in `src/components/Footer.jsx`.

## Deployment

`npm run build` outputs static files to `dist/`. Because the app uses client-side routing, configure your host to
serve `index.html` for unknown paths (Netlify: add `/* /index.html 200` in `public/_redirects`; Vercel and
Cloudflare Pages handle this automatically for Vite apps).
