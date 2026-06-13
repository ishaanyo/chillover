'use client';
import { useState } from 'react';
import { Product, Size } from '@/types';
import { useCart } from '@/lib/cartContext';
import { useWishlist } from '@/lib/wishlistContext';
import VerticalImageSlider from './VerticalImageSlider';

interface Props {
  product: Product;
}

export default function ProductPageClient({ product }: Props) {
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState('');
  const [added, setAdded] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const { addItem } = useCart();
  const { toggle, has } = useWishlist();
  const wishlisted = has(product.id);
  const discount = Math.round((1 - product.price / product.originalPrice) * 100);
  const totalStock = product.variants.reduce((s, v) => s + v.stock, 0);

  function handleAdd() {
    if (!selectedSize) { setError('Please select a size first'); return; }
    setError('');
    addItem(product, selectedSize, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  }

  function stockFor(sz: Size) {
    return product.variants.find(v => v.size === sz)?.stock ?? 0;
  }

  return (
    <div style={{ paddingTop: '5rem', minHeight: '100vh', background: '#0a0a0a' }}>

      {/* Breadcrumb */}
      <div style={{ background: '#1a1a1a', padding: '0.75rem 2.5rem', borderBottom: '1px solid rgba(245,242,237,0.06)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <nav style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.56rem', letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#888', display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' as const }}>
            <a href="/" style={{ color: '#888', textDecoration: 'none' }}>Home</a>
            <span>›</span>
            <a href={`/shop/${product.category}`} style={{ color: '#888', textDecoration: 'none' }}>
              {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
            </a>
            <span>›</span>
            <span style={{ color: '#ff3c1e' }}>{product.name}</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2.5rem 2.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'flex-start' }}>

          {/* Vertical image slider */}
          <div style={{ position: 'sticky', top: '5.5rem' }}>
            <VerticalImageSlider
              images={product.images}
              productName={product.name}
              productId={product.id}
            />
          </div>

          {/* Right panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>

            {/* Badges */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' as const }}>
              {product.badge && (
                <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.56rem', letterSpacing: '0.15em', textTransform: 'uppercase' as const, background: '#ff3c1e', color: '#fff', padding: '0.22rem 0.6rem' }}>
                  {product.badge}
                </span>
              )}
              {product.isNew && (
                <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.56rem', letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: '#1aff9c', border: '1px solid rgba(26,255,156,0.4)', padding: '0.22rem 0.6rem' }}>
                  New In
                </span>
              )}
              {totalStock > 0 && totalStock < 10 && (
                <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.56rem', letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: '#ff8c00', border: '1px solid rgba(255,140,0,0.4)', padding: '0.22rem 0.6rem' }}>
                  ⚡ Almost Gone
                </span>
              )}
            </div>

            <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: '#888' }}>
              {product.category.charAt(0).toUpperCase() + product.category.slice(1)} · Oversized T-Shirt
            </p>

            <h1 style={{ fontFamily: 'Bebas Neue, serif', fontSize: 'clamp(2.2rem,5vw,3.8rem)', letterSpacing: '0.03em', textTransform: 'uppercase' as const, lineHeight: 1 }}>
              {product.name}
            </h1>

            <p style={{ fontSize: '0.875rem', color: '#888', lineHeight: 1.7, fontWeight: 300 }}>
              {product.shortDesc}
            </p>

            {/* ── PRICE ── */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.8rem', flexWrap: 'wrap' as const }}>
              <span style={{ fontFamily: 'Bebas Neue, serif', fontSize: '2.8rem', letterSpacing: '0.03em', lineHeight: 1 }}>
                ₹{product.price}
              </span>
              <span style={{ fontSize: '0.9rem', textDecoration: 'line-through', color: '#888', fontWeight: 300 }}>
                ₹{product.originalPrice}
              </span>
              <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.1em', color: '#1aff9c', background: 'rgba(26,255,156,0.1)', border: '1px solid rgba(26,255,156,0.3)', padding: '0.18rem 0.5rem' }}>
                {discount}% OFF
              </span>
            </div>
            <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.56rem', letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#666', marginTop: '-0.8rem' }}>
              Inclusive of all taxes
            </p>

            {/* ── SIZE SELECTOR ── */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.7rem' }}>
                <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.62rem', letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: '#888' }}>
                  Select Size
                </span>
                <button
                  onClick={() => setShowSizeGuide(s => !s)}
                  style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: '#ff3c1e', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  📏 Size Guide
                </button>
              </div>

              {showSizeGuide && (
                <div style={{ background: '#111', border: '1px solid rgba(245,242,237,0.08)', padding: '1rem', marginBottom: '1rem', overflowX: 'auto' as const }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' as const, fontSize: '0.75rem' }}>
                    <thead>
                      <tr>
                        {['Size','Chest','Length','Shoulder'].map(h => (
                          <th key={h} style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.55rem', letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: '#ff3c1e', padding: '0.4rem 0.6rem', borderBottom: '1px solid rgba(245,242,237,0.07)', textAlign: 'left' as const }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[['S','40"','27"','18"'],['M','42"','28"','19"'],['L','44"','29"','20"'],['XL','46"','30"','21"'],['XXL','48"','31"','22"']].map(row => (
                        <tr key={row[0]}>
                          {row.map((c,i) => <td key={i} style={{ padding: '0.4rem 0.6rem', borderBottom: '1px solid rgba(245,242,237,0.04)', color: '#aaa' }}>{c}</td>)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p style={{ fontSize: '0.68rem', color: '#666', marginTop: '0.6rem' }}>All in inches. Size up for extreme drop-shoulder.</p>
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' as const }}>
                {product.variants.map(v => {
                  const oos = v.stock === 0;
                  const active = selectedSize === v.size;
                  const low = v.stock > 0 && v.stock <= 3;
                  return (
                    <button
                      key={v.size}
                      onClick={() => { if (!oos) { setSelectedSize(v.size); setError(''); } }}
                      style={{
                        width: '52px', height: '52px',
                        fontFamily: 'Space Mono, monospace', fontSize: '0.68rem',
                        border: `1.5px solid ${active ? '#ff3c1e' : oos ? 'rgba(245,242,237,0.08)' : 'rgba(245,242,237,0.22)'}`,
                        background: active ? '#ff3c1e' : 'transparent',
                        color: oos ? '#444' : active ? '#fff' : '#f5f2ed',
                        cursor: oos ? 'not-allowed' : 'pointer',
                        textDecoration: oos ? 'line-through' : 'none',
                        transition: 'all 0.15s',
                        position: 'relative' as const,
                      }}
                    >
                      {v.size}
                      {low && (
                        <span style={{ position: 'absolute', top: '-4px', right: '-4px', width: '8px', height: '8px', background: '#ff8c00', borderRadius: '50%', border: '1px solid #1a1a1a' }} />
                      )}
                    </button>
                  );
                })}
              </div>

              {error && (
                <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.62rem', color: '#ff3c1e', marginTop: '0.5rem' }}>{error}</p>
              )}
              {selectedSize && stockFor(selectedSize) > 0 && stockFor(selectedSize) <= 5 && (
                <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', color: '#ff8c00', marginTop: '0.4rem' }}>
                  ⚡ Only {stockFor(selectedSize)} left in {selectedSize}
                </p>
              )}
            </div>

            {/* ── QUANTITY ── */}
            <div>
              <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.62rem', letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: '#888', display: 'block', marginBottom: '0.6rem' }}>
                Quantity
              </span>
              <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                <button
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  style={{ width: '44px', height: '44px', background: 'transparent', border: '1px solid rgba(245,242,237,0.18)', color: '#f5f2ed', cursor: 'pointer', fontSize: '1.3rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >−</button>
                <span style={{ width: '56px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Space Mono, monospace', fontSize: '0.9rem', borderTop: '1px solid rgba(245,242,237,0.18)', borderBottom: '1px solid rgba(245,242,237,0.18)' }}>
                  {qty}
                </span>
                <button
                  onClick={() => setQty(q => Math.min(10, q + 1))}
                  style={{ width: '44px', height: '44px', background: 'transparent', border: '1px solid rgba(245,242,237,0.18)', color: '#f5f2ed', cursor: 'pointer', fontSize: '1.3rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >+</button>
              </div>
            </div>

            {/* ── ADD TO CART + WISHLIST ── */}
            <div style={{ display: 'flex', gap: '0.7rem' }}>
              <button
                onClick={handleAdd}
                style={{
                  flex: 1, padding: '1rem 1.5rem',
                  background: added ? '#1aff9c' : '#ff3c1e',
                  color: added ? '#0a0a0a' : '#fff',
                  border: 'none', fontFamily: 'Space Mono, monospace',
                  fontSize: '0.72rem', letterSpacing: '0.12em',
                  textTransform: 'uppercase' as const, cursor: 'pointer',
                  transition: 'background 0.3s, color 0.3s',
                  fontWeight: added ? 700 : 400,
                }}
              >
                {added ? '✓ Added to Cart' : 'Add to Cart'}
              </button>
              <button
                onClick={() => toggle(product.id)}
                style={{
                  width: '52px', height: '52px', flexShrink: 0,
                  background: 'transparent',
                  border: `1.5px solid ${wishlisted ? '#ff3c1e' : 'rgba(245,242,237,0.2)'}`,
                  color: wishlisted ? '#ff3c1e' : '#f5f2ed',
                  cursor: 'pointer', fontSize: '1.2rem',
                  transition: 'all 0.2s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                {wishlisted ? '♥' : '♡'}
              </button>
            </div>

            {/* Delivery info */}
            <div style={{ borderTop: '1px solid rgba(245,242,237,0.08)', paddingTop: '1rem' }}>
              {[['🚚','Free delivery on orders above ₹999'],['↩️','7-day easy returns & exchanges'],['🔒','Secure payment via Razorpay'],['📦','Ships within 24 hrs from Jaipur']].map(([icon, text]) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.45rem' }}>
                  <span style={{ fontSize: '0.9rem' }}>{icon}</span>
                  <span style={{ fontSize: '0.78rem', color: '#888', fontWeight: 300 }}>{text}</span>
                </div>
              ))}
            </div>

            {/* Product details */}
            <div style={{ borderTop: '1px solid rgba(245,242,237,0.07)', paddingTop: '1.2rem' }}>
              <h3 style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: '#888', marginBottom: '0.7rem' }}>Product Details</h3>
              <p style={{ fontSize: '0.862rem', color: '#aaa', lineHeight: 1.8, fontWeight: 300 }}>{product.description}</p>
            </div>

            {/* Features */}
            <div style={{ borderTop: '1px solid rgba(245,242,237,0.07)', paddingTop: '1.2rem' }}>
              <h3 style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: '#888', marginBottom: '0.7rem' }}>Features</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '0.5rem' }}>
                {product.features.map(f => (
                  <span key={f} style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.58rem', letterSpacing: '0.1em', textTransform: 'uppercase' as const, border: '1px solid rgba(245,242,237,0.12)', padding: '0.28rem 0.65rem', color: '#888' }}>{f}</span>
                ))}
              </div>
            </div>

            {/* Fabric + Fit */}
            <div style={{ borderTop: '1px solid rgba(245,242,237,0.07)', paddingTop: '1.2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
              {[['Fabric', product.fabric], ['Fit', product.fit]].map(([label, val]) => (
                <div key={label} style={{ background: '#1a1a1a', padding: '0.9rem 1rem', border: '1px solid rgba(245,242,237,0.06)' }}>
                  <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.56rem', letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#ff3c1e', marginBottom: '0.3rem' }}>{label}</div>
                  <div style={{ fontSize: '0.8rem', color: '#e8e2d9' }}>{val}</div>
                </div>
              ))}
            </div>

            {/* Wash care */}
            <div style={{ borderTop: '1px solid rgba(245,242,237,0.07)', paddingTop: '1rem' }}>
              <details>
                <summary style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: '#888', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', userSelect: 'none' as const }}>
                  Wash & Care <span>▸</span>
                </summary>
                <ul style={{ marginTop: '0.8rem', paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column' as const, gap: '0.35rem' }}>
                  {['Machine wash cold, inside-out','Do not tumble dry','Do not bleach','Iron low, avoid print area','Wash with similar colors'].map(c => (
                    <li key={c} style={{ fontSize: '0.78rem', color: '#888', fontWeight: 300 }}>{c}</li>
                  ))}
                </ul>
              </details>
            </div>

          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .product-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
          .product-sticky { position: static !important; }
          div[style*="padding: 2.5rem 2.5rem"] { padding: 1.5rem 1rem !important; }
        }
      `}</style>
    </div>
  );
}
