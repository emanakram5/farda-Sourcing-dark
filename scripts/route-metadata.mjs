import { COMPANY_PROFILES, GROUP_OVERVIEW } from '../src/data/companyGroup.js';
import { PRODUCTS } from '../src/data/siteData.js';
﻿import fs from "node:fs";
const source = fs.readFileSync("src/App.jsx", "utf8");
const block = source.match(/export const pageInfo = (\{[\s\S]*?\n\});/)[1];
// This object is maintained in our own source, not external input.
const pages = Function("return (" + block + ")")();
const template = fs.readFileSync("dist/index.html", "utf8");
const escape = (text) =>
  text
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;");
const routes = {
  ...pages,
  "/": pages["/home"],
  "/about": pages["/who-we-are"],
  "/get-a-quote": pages["/contact"],
};
for (const [route, [name, description]] of Object.entries(routes)) {
  const title = escape(name + " | Farda Sourcing");
  const desc = escape(description);
  let html = template
    .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
    .replace(
      /<meta\s+name="description"\s+content="[\s\S]*?"\s*\/>/,
      `<meta name="description" content="${desc}" />`,
    )
    .replace(
      "</head>",
      `<meta name="robots" content="index,follow" />\n<meta property="og:title" content="${title}" />\n<meta property="og:description" content="${desc}" />\n<meta property="og:type" content="website" />\n<meta property="og:site_name" content="Farda Sourcing" />\n<meta name="twitter:card" content="summary" />\n<meta name="twitter:title" content="${title}" />\n<meta name="twitter:description" content="${desc}" />\n</head>`,
    );
  if (route === '/who-we-are' || route === '/about') {
    const groupHtml = '<div class="redesign"><main class="shell section-space"><h1>Who We Are</h1><section class="company-group"><h2>YC Group of Companies</h2><p>' + escape(GROUP_OVERVIEW) + '</p><h2>The businesses behind our network</h2><div class="company-backgrounds__grid">' + COMPANY_PROFILES.map(company => '<article class="company-backgrounds__card"><h3>' + escape(company.name) + '</h3>' + company.paragraphs.map(text => '<p>' + escape(text) + '</p>').join('') + '</article>').join('') + '</div></section></main></div>';
    html = html.replace('<div id="root"></div>', '<div id="root">' + groupHtml + '</div>');
  }
  const dir = route === "/" ? "dist" : "dist" + route;
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(dir + "/index.html", html);
}
console.log(`Generated metadata for ${Object.keys(routes).length} routes.`);
import { PRODUCT_DETAILS, SITE_URL } from '../src/data/productDetails.js';
const canonicalRoutes = Object.keys(pages);
for (const [slug, product] of Object.entries(PRODUCT_DETAILS)) {
  const route = '/products/' + slug;
  const url = SITE_URL + route;
  const item = PRODUCTS.find(item => item.slug === slug);
  const name = escape(product.name);
  const desc = escape(product.description);
  const structured = JSON.stringify({ '@context': 'https://schema.org', '@type': 'WebPage', name: product.name, description: product.description, url, about: { '@type': 'Product', name: product.name, description: product.description } }).replaceAll('<', '\\u003c');
  const body = '<div class="redesign"><main class="shell product-detail section-space"><nav class="product-breadcrumb" aria-label="Breadcrumb"><a href="/home">Home</a><span>/</span><a href="/products">Products</a></nav><header class="product-detail__heading"><h1>' + name + '</h1><p>' + desc + '</p></header><div class="product-detail__grid"><div class="product-detail__media"><img src="' + escape(item.image) + '" alt="' + escape(item.imageAlt || product.name) + '" width="800" height="700" /></div><div class="glass product-detail__body"><h2>About ' + name + '</h2>' + product.paragraphs.map(p => '<p>' + escape(p) + '</p>').join('') + (item.includes ? '<h2>Package includes</h2><ul>' + item.includes.map(p => '<li>' + escape(p) + '</li>').join('') + '</ul>' : '') + '<h2>What to consider</h2><ul>' + product.considerations.map(p => '<li>' + escape(p) + '</li>').join('') + '</ul><a href="/products">All products</a></div></div></main></div>';
  const html = template.replace(/<title>.*?<\/title>/, `<title>${name} | Farda Sourcing</title>`)
    .replace(/<meta\s+name="description"\s+content="[\s\S]*?"\s*\/>/, `<meta name="description" content="${desc}" />`)
    .replace('</head>', `<link rel="canonical" href="${url}" /><meta name="robots" content="index,follow" /><meta property="og:title" content="${name} | Farda Sourcing" /><meta property="og:description" content="${desc}" /><meta property="og:type" content="website" /><meta property="og:url" content="${url}" /><meta name="twitter:card" content="summary" /><meta name="twitter:title" content="${name} | Farda Sourcing" /><meta name="twitter:description" content="${desc}" /><script type="application/ld+json">${structured}</script></head>`)
    .replace('<div id="root"></div>', '<div id="root">' + body + '</div>');
  fs.mkdirSync('dist' + route, { recursive: true });
  fs.writeFileSync('dist' + route + '/index.html', html);
  canonicalRoutes.push(route);
}
// Aliases point at one canonical URL so they do not compete in search.
for (const route of Object.keys(routes)) {
  const canonical = ({ '/': '/home', '/about': '/who-we-are', '/get-a-quote': '/contact' })[route] || route;
  const path = (route === '/' ? 'dist' : 'dist' + route) + '/index.html';
  fs.writeFileSync(path, fs.readFileSync(path, 'utf8').replace('</head>', `<link rel="canonical" href="${SITE_URL + canonical}" /><meta property="og:url" content="${SITE_URL + canonical}" /></head>`));
}
fs.writeFileSync('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${canonicalRoutes.map(route => `<url><loc>${SITE_URL + route}</loc></url>`).join('')}</urlset>\n`);
fs.writeFileSync('dist/robots.txt', `User-agent: *\nAllow: /\nSitemap: ${SITE_URL}/sitemap.xml\n`);
console.log('Generated product detail pages, canonical URLs, sitemap and robots.txt.');
