'use client';
import { useState } from 'react';
import { Product, Size } from '@/types';
import { useCart } from '@/lib/cartContext';
import { useWishlist } from '@/lib/wishlistContext';

export default function AddToCart({ product }: { product: Product }) {
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState('');
  const [added, setAdded] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const { addItem } = useCart();
  const { toggle, has } = useWishlist();
  const wishlisted = has(product.id);
  const discount = Math.round((1 - product.price / product.originalPrice) * 100);

  function selectSize(size: Size) {
    setSelectedSize(size);
    setError('');
  }

  function handleAdd() {
    if (!selectedSize) { setError('Please select a size first'); return; }
    setError('');
    addItem(product, selectedSize, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  function stockFor(sz: Size) {
    return product.variants.find(v => v.size === sz)?.stock ?? 0;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>

      {/* Price row */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.8rem', flexWrap: 'wrap' }}>
        <span style={{ fontFamily: 'Bebas Neue, serif', fontSize: '2.8rem', letterSpacing: '0.03em', lineHeight: 1 }}>
          ₹{product.price}
        </span>
        <span style={{ fontSize: '0.9rem', textDecoration: 'line-through', color: '#888', fontWeight: 300 }}>
          ₹{product.originalPrice}
        </span>
        <span style={{
          fontFamily: 'Space Mono, monospace', fontSize: '0.62rem',
          letterSpacing: '0.1em', color: '#1aff9c',
          background: 'rgba(26,255,156,0.1)', border: '1px solid rgba(26,255,156,0.3)',
          padding: '0.2rem 0.55rem',
        }}>
          {discount}% OFF
        </span>
      </div>
      <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.58rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#666', marginTop: '-1rem' }}>
        Inclusive of all taxes
      </p>

      {/* Size selector */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.7rem' }}>
          <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.62rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#888' }}>
            Select Size
          </span>
          <button
            onClick={() => setShowSizeGuide(s => !s)}
            style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#ff3c1e', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            📏 Size Guide
          </button>
        </div>

        {/* Size guide table */}
        {showSizeGuide && (
          <div style={{ background: '#111', border: '1px solid rgba(245,242,237,0.08)', padding: '1rem', marginBottom: '1rem', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
              <thead>
                <tr>
                  {['Size','Chest','Length','Shoulder'].map(h => (
                    <th key={h} style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.55rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#ff3c1e', padding: '0.4rem 0.6rem', borderBottom: '1px solid rgba(245,242,237,0.07)', textAlign: 'left' }}>{h}</th>
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
            <p style={{ fontSize: '0.68rem', color: '#666', marginTop: '0.6rem' }}>All measurements in inches. Size up for extreme drop-shoulder.</p>
          </div>
        )}

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {product.variants.map(v => {
            const oos = v.stock === 0;
            const active = selectedSize === v.size;
            const lowStock = v.stock > 0 && v.stock <= 3;
            return (
              <button
                key={v.size}
                onClick={() => !oos && selectSize(v.size)}
                disabled={oos}
                style={{
                  width: '52px', height: '52px',
                  fontFamily: 'Space Mono, monospace', fontSize: '0.68rem', letterSpacing: '0.06em',
                  border: `1.5px solid ${active ? '#ff3c1e' : oos ? 'rgba(245,242,237,0.08)' : 'rgba(245,242,237,0.22)'}`,
                  background: active ? '#ff3c1e' : 'transparent',
                  color: oos ? '#444' : active ? '#fff' : '#f5f2ed',
                  cursor: oos ? 'not-allowed' : 'pointer',
                  textDecoration: oos ? 'line-through' : 'none',
                  transition: 'all 0.15s',
                  position: 'relative',
                }}
                title={oos ? 'Out of stock' : `${v.stock} left`}
              >
                {v.size}
                {lowStock && !oos && (
                  <span style={{ position: 'absolute', top: '-4px', right: '-4px', width: '8px', height: '8px', background: '#ff8c00', borderRadius: '50%', border: '1px solid #1a1a1a' }} />
                )}
              </button>
            );
          })}
        </div>

        {error && <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.62rem', letterSpacing: '0.08em', color: '#ff3c1e', marginTop: '0.5rem' }}>{error}</p>}
        {selectedSize && stockFor(selectedSize) > 0 && stockFor(selectedSize) <= 5 && (
          <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.08em', color: '#ff8c00', marginTop: '0.4rem' }}>
            ⚡ Only {stockFor(selectedSize)} left in size {selectedSize}
          </p>
        )}
      </div>

      {/* Quantity */}
      <div>
        <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.62rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#888', display: 'block', marginBottom: '0.6rem' }}>
          Quantity
        </span>
        <div style={{ display: 'inline-flex', alignItems: 'center' }}>
          <button
            onClick={() => setQty(q => Math.max(1, q - 1))}
            style={{ width: '44px', height: '44px', background: 'transparent', border: '1px solid rgba(245,242,237,0.18)', color: '#f5f2ed', cursor: 'pointer', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >−</button>
          <span style={{ width: '56px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Space Mono, monospace', fontSize: '0.9rem', borderTop: '1px solid rgba(245,242,237,0.18)', borderBottom: '1px solid rgba(245,242,237,0.18)' }}>
            {qty}
          </span>
          <button
            onClick={() => setQty(q => Math.min(10, q + 1))}
            style={{ width: '44px', height: '44px', background: 'transparent', border: '1px solid rgba(245,242,237,0.18)', color: '#f5f2ed', cursor: 'pointer', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >+</button>
        </div>
      </div>

      {/* CTA row */}
      <div style={{ display: 'flex', gap: '0.7rem' }}>
        <button
          onClick={handleAdd}
          style={{
            flex: 1, padding: '1rem 1.5rem',
            background: added ? '#1aff9c' : '#ff3c1e',
            color: added ? '#0a0a0a' : '#fff',
            border: 'none',
            fontFamily: 'Space Mono, monospace', fontSize: '0.72rem',
            letterSpacing: '0.12em', textTransform: 'uppercase',
            cursor: 'pointer', transition: 'background 0.3s, color 0.3s',
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
            transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          {wishlisted ? '♥' : '♡'}
        </button>
      </div>

      {/* Delivery info */}
      <div style={{ borderTop: '1px solid rgba(245,242,237,0.08)', paddingTop: '1rem' }}>
        {[
          ['🚚', 'Free delivery on orders above ₹999'],
          ['↩️', '7-day easy returns & exchanges'],
          ['🔒', 'Secure payment via Razorpay'],
          ['📦', 'Ships within 24 hrs from Jaipur'],
        ].map(([icon, text]) => (
          <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.45rem' }}>
            <span style={{ fontSize: '0.9rem', lineHeight: 1 }}>{icon}</span>
            <span style={{ fontSize: '0.78rem', color: '#888', fontWeight: 300 }}>{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
