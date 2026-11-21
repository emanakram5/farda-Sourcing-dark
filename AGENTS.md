# Farda Sourcing - Agent Instructions

These instructions apply to this repository and its subdirectories. Follow the user's latest instructions and any applicable instructions in more specific AGENTS.md files.

## Repository and Git workflow

- Repository: https://github.com/emanakram5/farda-Sourcing-dark
- The default branch is `main`. Base descriptions of the current project on its actual source, not on unmerged work from other branches.
- Inspect the current branch, Git status, and relevant diffs before editing. Preserve unrelated changes.
- Do not switch the user's active checkout or discard work without authorization. Use a separate worktree when needed to isolate an authorized change.
- Commit or push only when explicitly instructed. Changes to `main` require explicit authorization; do not assume a request for local edits includes publication.
- Do not run destructive Git commands, rewrite shared history, or force-push.
- Stage only files within the requested scope. Check the staged diff before committing and verify the destination branch before pushing.
- Preserve existing project functionality and avoid unrelated dependency or formatting changes.

## Project and current architecture

Farda Sourcing is a multi-page marketing website built with React 18, React Router 6, and Vite 5. It uses plain CSS, Framer Motion, Three.js, and Lucide React. Read `package.json` and `package-lock.json` for dependency versions and scripts.

The reviewed main baseline is commit `174732773e54bda0981f419af7be502b03639a11`. At that baseline:

- `src/App.jsx` mounts `Scene3D`, `Preloader`, scroll helpers, shared navigation, page routes, and the footer. Inspect each component before assuming what it renders.
- Home uses cinematic content, scroll reveals, animated counters, and additional home sections.
- Products uses category filters and a scroll-driven rotating product showroom with previous/next controls and quote links.
- Services uses an animated shipment route with service stations.
- How It Works and supplier partnership criteria use scroll-driven vertical presentations.
- Navigation changes appearance and visibility while scrolling and includes a mobile menu.
- The responsive simplifications developed separately on `refin/suh` are not part of this baseline. There is no `src/styles/responsive.css` in this main baseline.

Reinspect these details when working on later commits; this baseline is context, not a restriction on user-authorized changes.

## Source map

- `src/main.jsx`: React bootstrap, router setup, and global stylesheet imports.
- `src/App.jsx`: shared application layout and route definitions.
- `src/data/siteData.js`: shared company, product, service, process, navigation, and footer data.
- `src/components/Navbar.jsx` and `Navbar.css`: desktop/mobile navigation.
- `src/components/Footer.jsx` and `Footer.css`: footer links and newsletter UI.
- `src/components/cine/`: cinematic home content, background scene, and preloader component.
- `src/components/home/`: home sections, motion helpers, and alternative story/canvas components. Check imports to determine which are active.
- `src/components/ScrollReveal.jsx` and `ScrollToTop.jsx`: shared route/scroll behavior.
- `src/pages/`: route components and page-specific styles.
- `src/styles/`: variables, base styles, motion styles, and cinematic theme. Their import order matters.
- `src/hooks/useFormValidation.js`: inquiry form validation.
- `src/services/api.js`: placeholder inquiry submission layer.
- `public/`: images, videos, favicon, and static hosting redirects.

## Routes and behavior to preserve

Preserve `/`, `/about`, `/products`, `/services`, `/markets`, `/how-it-works`, `/supplier`, `/contact`, `/franchise`, and the unmatched-route 404 page unless the user requests a change.

Keep product filtering, showroom controls, navigation, quote/contact links, inquiry query parameters, and form validation working. Check inquiry presets against `INQUIRY_TYPES` in `siteData.js`; do not assume every incoming value is accepted.

Maintain the dark background and lime brand accent. For layout or animation changes, check readability, contrast, alignment, keyboard focus, touch controls, and reduced-motion behavior. Ensure content remains accessible and guard against document-wide horizontal overflow and fixed-navigation overlap.

## Local commands

Run these commands from the selected checkout:

- Install locked dependencies when absent: `npm ci --no-audit --no-fund`
- Start development preview: `npm run dev -- --host 0.0.0.0`
- Build for production: `npm run build`
- Preview the production build: `npm run preview`

On Windows PowerShell, use `npm.cmd` if execution policy blocks `npm.ps1`. Share the actual URL printed by Vite; do not assume a previous server is still running. Do not run dependency installation concurrently with another installer or a build.

## Validation and reporting

- For meaningful source changes, run the production build and checks appropriate to the changed behavior. Documentation-only edits do not require an application rebuild.
- For responsive changes, inspect phone, tablet, laptop, desktop, and short landscape viewports. Useful widths include 320, 390, 768, 1024, 1366, and 1920px.
- Test product controls, navigation, inquiry links, validation, and reduced motion when affected.
- Distinguish viewport simulation from testing on physical devices or Safari.
- Review the staged diff and run `git diff --check` or `git diff --cached --check` before handoff.
- Do not add temporary browser/test dependencies to tracked manifests without a task-related reason.
- Report only checks performed on the relevant source state. Tests on another branch do not verify `main`.

## Integration limits

`src/services/api.js` currently logs inquiry data and resolves a delayed promise; it does not send a real backend request. The newsletter UI validates an email and shows a success message but has a TODO for connecting a provider. Local success messages do not prove external delivery.

README descriptions can be historical; prefer the active source when documenting behavior. See `report.txt` for the scope and verification of this documentation update.
