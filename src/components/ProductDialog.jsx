import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from './Icon.jsx';

export default function ProductDialog({ product, details }) {
  const dialogRef = useRef(null);
  const navigate = useNavigate();
  const close = () => navigate('/products', { replace: true, state: { focusProduct: product.slug } });
  useEffect(() => {
    const dialog = dialogRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.showModal();
    return () => { dialog.close(); document.body.style.overflow = previousOverflow; };
  }, []);
  return <dialog ref={dialogRef} className="product-dialog" aria-labelledby="product-detail-title" onCancel={event => { event.preventDefault(); close(); }} onClick={event => { if (event.target === dialogRef.current) { const r = event.currentTarget.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) close(); } }}>
    <div className="product-dialog__content">
      <button autoFocus type="button" className="product-dialog__close" aria-label="Close product details" onClick={close}><Icon name="close" size={24} strokeWidth={2} /></button>
      <span className="kicker">PRODUCT DETAILS</span>
      <h2 id="product-detail-title">{product.name}</h2>
      {product.image && <img className="product-dialog__image" src={product.image} alt={product.imageAlt || product.name} />}
      {details.paragraphs.map(text => <p key={text}>{text}</p>)}
      {product.includes && <><h3>Package includes</h3><ul>{product.includes.map(item => <li key={item}>{item}</li>)}</ul></>}
      <h3>What to consider</h3>
      <ul>{details.considerations.map(item => <li key={item}>{item}</li>)}</ul>
      <button type="button" className="action" onClick={close}>Back to products</button>
    </div>
  </dialog>;
}
