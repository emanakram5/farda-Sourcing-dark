import Button from '../components/Button.jsx';

export default function NotFound() {
  return (
    <section className="section" style={{ textAlign: 'center', padding: '120px 0' }}>
      <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <span className="eyebrow">404</span>
        <h1 className="section-title">Page not found</h1>
        <p>The page you are looking for does not exist or has been moved.</p>
        <Button to="/" icon="arrow-right">
          Back to Home
        </Button>
      </div>
    </section>
  );
}
