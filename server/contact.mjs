import http from 'node:http';
import nodemailer from 'nodemailer';
import { pathToFileURL } from 'node:url';

export function createContactServer({ env = process.env, transport } = {}) {
  const configured = transport || (env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS && env.CONTACT_FROM);
  const mail = transport || (configured ? nodemailer.createTransport({
    host: env.SMTP_HOST, port: Number(env.SMTP_PORT || 587), secure: env.SMTP_SECURE === 'true',
    requireTLS: env.SMTP_SECURE !== 'true', auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
    connectionTimeout: 10000, greetingTimeout: 10000, socketTimeout: 15000,
    disableFileAccess: true, disableUrlAccess: true,
  }) : null);
  const attempts = new Map();
  const allowedOrigins = new Set((env.CONTACT_ORIGINS || 'https://fardasourcing.com').split(',').map(s => s.trim()));
  return http.createServer(async (req, res) => {
    const reply = (status, body) => { res.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(body)); };
    if (req.url !== '/api/contact') return reply(404, { error: 'Not found.' });
    if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return reply(405, { error: 'Method not allowed.' }); }
    if (req.headers.origin && !allowedOrigins.has(req.headers.origin)) return reply(403, { error: 'This request is not allowed.' });
    if (!req.headers['content-type']?.startsWith('application/json')) return reply(415, { error: 'Send JSON content.' });
    // Trust forwarding information only when the administrator explicitly enables it
    // and the reverse proxy overwrites the forwarded header.
    const ip = env.TRUST_PROXY === 'true' ? String(req.headers['x-forwarded-for'] || req.socket.remoteAddress).split(',')[0].trim() : req.socket.remoteAddress;
    const now = Date.now();
    for (const [key, value] of attempts) if (value.until <= now) attempts.delete(key);
    const entry = attempts.get(ip) || { count: 0, until: now + 600000 };
    if (entry.count >= 5 || attempts.size >= 10000) { res.setHeader('Retry-After', '600'); return reply(429, { error: 'Too many attempts. Please try again in ten minutes.' }); }
    entry.count++; attempts.set(ip, entry);
    let size = 0; const chunks = [];
    try {
      for await (const chunk of req) {
        size += chunk.length;
        if (size > 16384) return reply(413, { error: 'Your message is too long.' });
        chunks.push(chunk);
      }
      let input;
      try { input = JSON.parse(Buffer.concat(chunks).toString('utf8')); } catch { return reply(400, { error: 'Invalid request.' }); }
      if (!input || typeof input !== 'object' || Array.isArray(input)) return reply(400, { error: 'Invalid request.' });
      if (input.website) return reply(400, { error: 'Unable to submit this message.' });
      const limits = { name: 120, email: 254, company: 160, country: 100, message: 5000 };
      const values = {};
      for (const [field, limit] of Object.entries(limits)) {
        if (input[field] !== undefined && typeof input[field] !== 'string') return reply(400, { error: 'Invalid field value.' });
        values[field] = (input[field] || '').trim();
        if (values[field].length > limit || (field !== 'message' && /[\r\n]/.test(values[field]))) return reply(400, { error: 'A field is too long or invalid.' });
      }
      if (values.name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email) || values.message.length < 10) return reply(400, { error: 'Please enter a name, valid email and message of at least ten characters.' });
      if (!mail) return reply(503, { error: 'Online messaging is temporarily unavailable. Please email info@fardasourcing.com directly.' });
      const result = await mail.sendMail({
        from: env.CONTACT_FROM, to: env.CONTACT_TO || 'info@fardasourcing.com', replyTo: values.email,
        subject: 'New website contact message',
        text: Object.entries(values).map(([key, value]) => key + ': ' + value).join('\n\n'),
      });
      if (!result.accepted?.length) throw new Error('SMTP did not accept the recipient');
      return reply(200, { ok: true });
    } catch (error) {
      // Never log message contents or SMTP credentials.
      console.error('Contact delivery failed:', error.code || 'DELIVERY_ERROR');
      if (!res.headersSent) reply(502, { error: 'We could not send your message. Please try again or email info@fardasourcing.com directly.' });
    }
  });
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const host = process.env.CONTACT_HOST || '127.0.0.1';
  const port = Number(process.env.CONTACT_PORT || 3001);
  createContactServer().listen(port, host, () => console.log('Contact API listening on ' + host + ':' + port));
}
