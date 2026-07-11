'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useWishlist } from '@/lib/wishlistContext';
import ProductCard from '@/components/product/ProductCard';
import type { Product } from '@/types';

export default function WishlistPage() {
  const { items, toggle } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;

    if (items.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch(`/api/products?ids=${items.join(',')}`)
      .then(res => res.json())
      .then(data => {
        const found: Product[] = data.products ?? [];
        setProducts(found);

        // Clean up stale ids (e.g. a deleted product) so the badge count stays accurate
        const foundIds = new Set(found.map(p => p.id));
        items.forEach(id => { if (!foundIds.has(id)) toggle(id); });
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, mounted]);

  const displayCount = mounted && !loading ? products.length : items.length;

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 2rem' }}>
        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.62rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#888', marginBottom: '0.4rem' }}>
            <Link href="/" style={{ color: '#888', textDecoration: 'none' }}>Home</Link> › Wishlist
          </p>
          <h1 style={{ fontFamily: 'Bebas Neue, serif', fontSize: 'clamp(2.5rem,6vw,4.5rem)', letterSpacing: '0.03em', textTransform: 'uppercase', lineHeight: 1 }}>
            My Wishlist {mounted && displayCount > 0 && <span style={{ color: '#ff3c1e' }}>({displayCount})</span>}
          </h1>
        </div>

        {!mounted || loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem' }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} style={{ aspectRatio: '3/4.6', background: '#1a1a1a', border: '1px solid rgba(245,242,237,0.06)', opacity: 0.5 }} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '6rem 0' }}>
            <div style={{ fontSize: '5rem', marginBottom: '1.5rem', opacity: 0.25 }}>♡</div>
            <h2 style={{ fontFamily: 'Bebas Neue, serif', fontSize: '2.5rem', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.8rem' }}>Your wishlist is empty</h2>
            <p style={{ color: '#888', marginBottom: '2rem', fontWeight: 300 }}>Tap the heart on any product to save it here.</p>
            <Link href="/all" style={{ background: '#ff3c1e', color: '#fff', fontFamily: 'Space Mono, monospace', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '0.9rem 2.5rem', textDecoration: 'none', display: 'inline-block' }}>
              Start Shopping
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem' }}>
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
