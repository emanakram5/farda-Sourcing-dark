# Farda Sourcing

Responsive marketing website built with React 18, React Router 6, Vite 5, Lucide React and plain CSS. Redesign developed on `redesign/reference-website`; release branch: `main`.

## Run locally

```sh
npm ci --include=dev --no-audit --no-fund
npm run dev -- --host 0.0.0.0
npm run build
npm run preview
```

Use the URL printed by Vite. On Windows, use `npm.cmd` if PowerShell blocks `npm.ps1`. The build produces `dist/`, including route metadata, product detail HTML, `sitemap.xml` and `robots.txt`.

## Pages and content

- `/home`: animated cubes, counting statistics and sourcing process.
- `/who-we-are`: company story, YC Solutions collaboration, purpose and values.
- `/products`: six clickable products with dedicated detail pages at `/products/:slug`.
- `/services`: supplier partnership, six services and franchise opportunities.
- `/our-mission`: franchise content; `/franchise`, `/supplier` and `/markets` also remain available.
- `/get-a-quote`: dedicated quote request page with validated submission to a server-side SMTP endpoint. SMTP setup is required before messages can be delivered.
- `/`, `/about` and `/contact` are aliases; `/how-it-works` redirects to home. Unknown routes display a 404 view.

Edit shared content and images in `src/data/siteData.js`, product descriptions and the canonical domain in `src/data/productDetails.js`, and layout/routes in `src/App.jsx`. Global styles load from `src/styles/`; page-specific styles live beside their components.

## Deployment

Publish the complete `dist/` output to a static host. Canonical domain: `https://fardasourcing.com`. Keep generated route HTML ahead of the SPA fallback so direct product links receive their metadata. Vercel rules are in `vercel.json`; other hosts need equivalent routing. See [DEPLOYMENT_PREREQUISITES.txt](DEPLOYMENT_PREREQUISITES.txt).

For live contact delivery, configure `.env` from `.env.example` and run `npm run start:contact` behind your web server. See [server/README.md](server/README.md). Run `npm run test:contact` for backend checks. SMTP is not configured yet. There is no database or newsletter integration. Building locally does not deploy the website.
