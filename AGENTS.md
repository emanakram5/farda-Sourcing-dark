# Farda Sourcing - Agent Instructions

These instructions cover this repository and its subdirectories. Follow the user's latest instructions and any more specific AGENTS.md.

## Git and scope

- Repository: https://github.com/emanakram5/farda-Sourcing-dark
- Current redesign branch: `redesign/reference-website`; default branch: `main`.
- Inspect branch, status and relevant diffs before editing. Preserve unrelated work.
- Do not switch the user's checkout or discard changes without authorization. Use an isolated worktree when appropriate.
- Commit and push only when explicitly requested. Changes or publication to main require explicit authorization.
- Never force-push, rewrite shared history or run destructive Git commands.
- Stage only requested files; review the staged diff and destination branch before publication.

## Current architecture

- React 18, React Router 6, Vite 5, Lucide React and plain CSS. Inspect package.json and package-lock.json for versions.
- src/main.jsx starts BrowserRouter and imports variables.css and base.css.
- src/App.jsx owns shared navigation/footer, route selection, metadata, home, products and services.
- App imports redesign.css followed by brand-light.css. Preserve this override order.
- src/data/siteData.js contains products, image paths, services and supplier benefits.
- src/data/productDetails.js contains six product slugs' overview text and SITE_URL, currently https://fardasourcing.com.
- src/components/ProductDialog.jsx uses a native modal dialog with focus containment, Escape/backdrop/cross dismissal and body scroll locking. Product cards are full clickable links with keyboard focus and a receding hover effect.
- src/components/Logo.jsx shares the exact logo geometry with the cube mark.
- src/pages/About.jsx serves Who We Are, including the YC Solutions logo and collaboration text.
- src/pages/Franchise.jsx serves Our Mission with hideBrochure and also /franchise.
- src/pages/HowItWorks.jsx is embedded on home; it is not a standalone route. Phones, short screens and reduced-motion settings receive static process cards.
- src/pages/Supplier.jsx remains the legacy supplier route. Services incorporates supplier content without the animated partner criteria.
- src/pages/Contact.jsx and src/hooks/useFormValidation.js handle validation and POST submissions to /api/contact.
- scripts/route-metadata.mjs generates route HTML, product metadata/structured data, canonical URLs, sitemap.xml and robots.txt during the build. Keep its output consistent with client metadata.
- public/images holds product assets and other images; preserve originals unless explicitly within cleanup scope.

## Behavior to preserve

- /home, /who-we-are, /products, /products/:slug, /services, /our-mission, /contact, /supplier, /franchise and /markets.
- Aliases /, /about and /get-a-quote; /how-it-works redirects to /home; unmatched routes show 404.
- Six products without categories or filter controls. Product cards open detailed overviews; there are no per-card quote links.
- Popup close returns focus to the matching product card. Preserve direct detail URLs and metadata.
- Service page order: supplier content, services, franchise overview. No per-service inquiry links.
- Home counters finish exactly at 500+, 15+, 20+ and 100%; reduced motion displays final values immediately.
- Maintain charcoal, muted gradients, readable light text and green accents. Avoid bright white form/panel backgrounds.
- Keep full product images visible with contain sizing, keyboard focus, touch targets, mobile navigation and reduced-motion behavior.
- The contact form has no Inquiry Type field. Name, email and message are required; company and country are optional. Product query parameters prefill the message.

## Commands and verification

- Install: npm ci --include=dev --no-audit --no-fund
- Develop: npm run dev -- --host 0.0.0.0
- Build: npm run build
- Local production preview: npm run preview
- Use npm.cmd on Windows if npm.ps1 is blocked. Share the actual Vite URL.
- Do not install dependencies concurrently with another installer or build.
- For source changes run a production build and targeted checks. Run git diff --check before handoff.
- Check widths 320, 390, 768, 1024, 1366 and 1920px plus short landscape when layout changes.
- Test modal mouse/keyboard/touch interactions, navigation, inquiry presets, validation and reduced motion when affected.
- Distinguish simulated Chromium viewports from physical-device or Safari testing. Report only checks actually performed on the current source.
- Do not add temporary test dependencies, screenshots or browser output to tracked files.

## Delivery limits

The contact form posts to server/contact.mjs, a self-hosted Node SMTP API. Credentials remain in server environment variables; never put them in VITE_ variables or client code. See server/README.md and .env.example. SMTP is not configured yet; missing configuration returns 503. Preserve input on failures; success requires SMTP acceptance. Run npm run test:contact for backend changes. Tests simulate mail transport and do not prove inbox delivery. There is no database or newsletter integration. Deployment and publication require a separate user instruction.
