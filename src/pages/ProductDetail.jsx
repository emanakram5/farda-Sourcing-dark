import { Link } from 'react-router-dom';
import { getRelatedProducts } from '../data/siteData.js';
import Icon from '../components/Icon.jsx';

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
      </div>
    </div>
    <section className="related-products" aria-labelledby="related-products-title">
      <header><span className="kicker">KEEP EXPLORING</span><h2 id="related-products-title">Related products</h2><p>Discover more technology for everyday life and business.</p></header>
      <ul className="related-products__bar">{getRelatedProducts(product.slug).map(item => <li key={item.slug}><Link className="related-product" to={'/products/' + item.slug}><img src={item.image} alt={item.imageAlt || item.name} loading="lazy" width="400" height="300" /><div><h3>{item.name}</h3><Icon name="arrow-right" size={22} /></div></Link></li>)}</ul>
      <div className="related-products__browse"><Link className="action" to="/products">Browse All Products <Icon name="arrow-right" size={20} /></Link></div>
    </section>
  </article>;
}
