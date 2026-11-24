import { Link } from 'react-router-dom';

export default function ProductDetail({ product, details }) {
  return <article className="product-detail section-space">
    <nav className="product-breadcrumb" aria-label="Breadcrumb"><Link to="/home">Home</Link><span aria-hidden="true">/</span><Link to="/products">Products</Link><span aria-hidden="true">/</span><span aria-current="page">{product.name}</span></nav>
    <header className="product-detail__heading"><span className="kicker">PRODUCT OVERVIEW</span><h1>{product.name}</h1><p>{details.description}</p></header>
    <div className="product-detail__grid">
      <div className="product-detail__media"><img src={product.image} alt={product.imageAlt || product.name} width="800" height="700" fetchPriority="high" /></div>
      <div className="glass product-detail__body">
        <h2>About {product.name}</h2>
        {details.paragraphs.map(text => <p key={text}>{text}</p>)}
        {product.includes && <section><h2>Package includes</h2><ul>{product.includes.map(item => <li key={item}>{item}</li>)}</ul></section>}
        <section><h2>What to consider</h2><ul>{details.considerations.map(item => <li key={item}>{item}</li>)}</ul></section>
        <Link className="text-link" to="/products">Browse all products</Link>
      </div>
    </div>
  </article>;
}
