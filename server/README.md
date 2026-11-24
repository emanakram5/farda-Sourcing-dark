# Contact API setup (self-hosted)

The website posts JSON to `/api/contact`. Run `server/contact.mjs` as a persistent Node.js service behind the same HTTPS domain as the website. SMTP is not configured yet; until configured, valid requests receive HTTP 503 and the form keeps the visitor's message.

1. Install Node.js with `--env-file` support and run `npm ci --include=dev --no-audit --no-fund` and `npm run build`.
2. Copy `.env.example` to `.env` outside the public document root. Set SMTP host, port, username, password, `CONTACT_FROM` (a sender permitted by your provider), and `CONTACT_TO` (defaults to `info@fardasourcing.com`). Never use a `VITE_` variable for a password.
3. For port 587 use `SMTP_SECURE=false` (STARTTLS is required). For port 465 use `SMTP_SECURE=true`. Configure the sender/domain and SPF/DKIM with the mail administrator.
4. Set `CONTACT_ORIGINS=https://fardasourcing.com` in production. Add another origin only if it actually serves the form.
5. Start with `npm run start:contact`; configure your service manager to restart it and protect the environment file. The API defaults to loopback port 3001. Serve `dist/` with Nginx or your existing static web server.
6. Add this location before the SPA fallback inside your HTTPS server block:

```nginx
location = /api/contact {
    client_max_body_size 16k;
    proxy_pass http://127.0.0.1:3001;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $remote_addr;
    proxy_read_timeout 30s;
}
```

Set `TRUST_PROXY=true` only with a trusted proxy that overwrites X-Forwarded-For, as above, and keep the Node port private. Otherwise leave it false. Throttling allows five attempts per IP per ten minutes in one process; multi-instance deployments need shared proxy-level limits. The API validates input and includes a honeypot, fixed recipient, bounded payload, and origin checks. It sends plain text with the customer's address as Reply-To.

For local development run the API and Vite in separate terminals. Vite proxies `/api/contact` to loopback port 3001; keep the local Vite origin in CONTACT_ORIGINS. `npm run preview` serves static output only and does not run or proxy the contact API.

Run `npm run test:contact` for simulated SMTP acceptance/rejection and HTTP validation tests. They send no real email. After configuring production SMTP, submit an approved test message and confirm receipt in the actual inbox. Success means the SMTP server accepted the recipient; it does not guarantee final inbox placement. Test rejection and retry behavior too.

Static-only hosting cannot run this API. Vercel's existing site rewrites are not a deployment of this self-hosted Node service.

SMTP reference: https://nodemailer.com/smtp
