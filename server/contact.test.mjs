import test from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { createContactServer } from './contact.mjs';
const valid = { name: 'Test Customer', email: 'customer@example.com', company: '', country: '', message: 'Please share more information.' };
async function fixture(t, options = {}) {
  const server = createContactServer(options); server.listen(0, '127.0.0.1'); await once(server, 'listening');
  t.after(() => new Promise(resolve => { server.close(resolve); server.closeAllConnections(); }));
  return (body, headers = {}) => fetch('http://127.0.0.1:' + server.address().port + '/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(body) });
}
test('sends validated message only to configured inbox with customer reply-to', async t => {
  let sent;
  const post = await fixture(t, { env: { CONTACT_FROM: 'website@example.com', CONTACT_TO: 'inbox@example.com' }, transport: { sendMail: async message => { sent = message; return { accepted: ['inbox@example.com'] }; } } });
  const res = await post({ ...valid, to: 'attacker@example.com' });
  assert.equal(res.status, 200); assert.equal((await res.json()).ok, true);
  assert.equal(sent.to, 'inbox@example.com'); assert.equal(sent.replyTo, valid.email); assert.match(sent.text, /Please share/);
});
test('rejects invalid input and header injection', async t => {
  const post = await fixture(t);
  for (const data of [{ ...valid, name: 'A' }, { ...valid, email: 'x\r\nBcc: y@example.com' }, { ...valid, message: 'short' }, { ...valid, website: 'spam.example' }]) assert.equal((await post(data)).status, 400);
});
test('rejects oversized payloads', async t => { const post = await fixture(t); assert.equal((await post({ ...valid, message: 'a'.repeat(18000) })).status, 413); });
test('reports unconfigured SMTP without false success', async t => { const post = await fixture(t, { env: {} }); assert.equal((await post(valid)).status, 503); });
test('reports SMTP rejection without false success', async t => { const post = await fixture(t, { transport: { sendMail: async () => ({ accepted: [] }) } }); assert.equal((await post(valid)).status, 502); });
test('blocks foreign origins', async t => { const post = await fixture(t); assert.equal((await post(valid, { Origin: 'https://other.example' })).status, 403); });
test('limits repeated requests', async t => { const post = await fixture(t); for (let i=0;i<5;i++) await post({}); const res = await post({}); assert.equal(res.status, 429); assert.equal(res.headers.get('retry-after'), '600'); });
