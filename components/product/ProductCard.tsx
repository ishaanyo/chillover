'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Product } from '@/types';
import { useWishlist } from '@/lib/wishlistContext';
import { useCart } from '@/lib/cartContext';

export default function ProductCard({ product }: { product: Product }) {
  const { toggle, has } = useWishlist();
  const { addItem } = useCart();
  const [hovered, setHovered] = useState(false);
  const wishlisted = has(product.id);
  const discount = Math.round((1 - product.price / product.originalPrice) * 100);

  function handleQuickAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const sz = product.variants[1]?.size ?? product.variants[0]?.size;
    if (sz) addItem(product, sz);
  }

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#1a1a1a',
        border: `1px solid ${hovered ? 'rgba(255,60,30,0.35)' : 'rgba(245,242,237,0.06)'}`,
        position: 'relative',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        transition: 'border-color 0.25s, transform 0.25s',
      }}
    >
      {/* Image area */}
      <Link href={`/shop/${product.category}/${product.slug}`} style={{ display: 'block', overflow: 'hidden' }}>
        <div style={{ aspectRatio: '3/4', background: '#0f0f0f', position: 'relative', overflow: 'hidden' }}>
          {product.images?.[0] ? (
            <img
              src={product.images[0].url}
              alt={product.images[0].alt || product.name}
              style={{
                width: '100%', height: '100%', objectFit: 'cover', display: 'block',
                transform: hovered ? 'scale(1.05)' : 'scale(1)',
                transition: 'transform 0.45s ease',
              }}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '5rem', opacity: 0.3 }}>👕</div>
          )}

          {/* Badges */}
          <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            {product.badge && (
              <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.52rem', letterSpacing: '0.15em', textTransform: 'uppercase', background: '#ff3c1e', color: '#fff', padding: '0.18rem 0.5rem', display: 'inline-block' }}>
                {product.badge}
              </span>
            )}
            <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.52rem', letterSpacing: '0.12em', background: 'rgba(26,255,156,0.15)', color: '#1aff9c', border: '1px solid rgba(26,255,156,0.3)', padding: '0.18rem 0.5rem', display: 'inline-block' }}>
              -{discount}%
            </span>
          </div>

          {/* Quick add */}
          <div style={{
            position: 'absolute', bottom: '0.75rem', left: '0.75rem', right: '0.75rem',
            opacity: hovered ? 1 : 0,
            transform: hovered ? 'translateY(0)' : 'translateY(8px)',
            transition: 'opacity 0.2s, transform 0.2s',
          }}>
            <button
              onClick={handleQuickAdd}
              style={{
                width: '100%', background: '#0a0a0a', color: '#f5f2ed',
                fontFamily: 'Space Mono, monospace', fontSize: '0.6rem',
                letterSpacing: '0.1em', textTransform: 'uppercase',
                border: 'none', padding: '0.55rem', cursor: 'pointer',
              }}
            >
              Quick Add +
            </button>
          </div>
        </div>
      </Link>

      {/* Wishlist button */}
      <button
        onClick={() => toggle(product.id)}
        style={{
          position: 'absolute', top: '0.75rem', right: '0.75rem',
          background: 'rgba(10,10,10,0.65)', border: 'none',
          color: wishlisted ? '#ff3c1e' : '#f5f2ed',
          cursor: 'pointer', width: '30px', height: '30px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.85rem', transition: 'color 0.2s', zIndex: 2,
        }}
      >
        {wishlisted ? '♥' : '♡'}
      </button>

      {/* Info */}
      <div style={{ padding: '0.9rem 1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
          <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.55rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888' }}>
            {product.category.charAt(0).toUpperCase() + product.category.slice(1)} · Oversized
          </span>
          <div style={{ display: 'flex', gap: '0.2rem' }}>
            {product.variants.slice(0, 3).map(v => (
              <span key={v.size} style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.48rem', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(245,242,237,0.12)', color: '#888', opacity: v.stock === 0 ? 0.25 : 1 }}>
                {v.size}
              </span>
            ))}
          </div>
        </div>
        <Link href={`/shop/${product.category}/${product.slug}`} style={{ display: 'block', fontSize: '0.93rem', fontWeight: 500, color: '#f5f2ed', textDecoration: 'none', marginBottom: '0.4rem' }}>
          {product.name}
        </Link>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
          <span style={{ fontFamily: 'Bebas Neue, serif', fontSize: '1.3rem', letterSpacing: '0.03em' }}>₹{product.price}</span>
          <span style={{ fontSize: '0.72rem', textDecoration: 'line-through', color: '#888', fontWeight: 300 }}>₹{product.originalPrice}</span>
        </div>
      </div>
    </div>
  );
}
