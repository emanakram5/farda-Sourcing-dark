// Placeholder API layer. Replace the body of submitInquiry() with a real request,
// e.g. fetch('/api/inquiries', { method: 'POST', body: JSON.stringify(data) })
// or an email service such as EmailJS / Formspree / your own backend.

export function submitInquiry(data) {
  return new Promise((resolve) => {
    // eslint-disable-next-line no-console
    console.info('[Farda Sourcing] Inquiry submitted:', data);
    setTimeout(() => resolve({ ok: true }), 900);
  });
}
