'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useCart } from '@/lib/cartContext';
import { useWishlist } from '@/lib/wishlistContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { totalItems, toggleCart } = useCart();
  const { count: wishCount } = useWishlist();
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  // Prevent hydration mismatch — only show counts after mount
  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Close mobile nav on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  if (isAdmin) {
    return (
      <nav style={{ background: '#111', borderBottom: '1px solid rgba(245,242,237,0.08)', padding: '0.8rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <Link href="/admin" style={{ fontFamily: 'Bebas Neue, serif', fontSize: '1.5rem', letterSpacing: '0.05em', color: '#f5f2ed', textDecoration: 'none' }}>
          Chill<span style={{ color: '#ff3c1e' }}>Over</span>
          <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.55rem', letterSpacing: '0.15em', color: '#888', textTransform: 'uppercase', verticalAlign: 'middle', marginLeft: '0.5rem' }}>Admin</span>
        </Link>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link href="/admin/products" style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.62rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888', textDecoration: 'none' }}>Products</Link>
          <Link href="/admin/products/new" style={{ background: '#ff3c1e', color: '#fff', fontFamily: 'Space Mono, monospace', fontSize: '0.62rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.4rem 1rem', textDecoration: 'none' }}>+ Add Product</Link>
          <Link href="/" style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.62rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888', textDecoration: 'none' }}>← Store</Link>
        </div>
      </nav>
    );
  }

  const navLinks = [
    { label: 'Men', href: '/men' },
    { label: 'Women', href: '/women' },
    { label: 'Shop All', href: '/all' },
    { label: 'About', href: '/#about' },
  ];

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 100,
        background: scrolled ? 'rgba(10,10,10,0.94)' : 'rgba(10,10,10,0.3)',
        backdropFilter: 'blur(14px)',
        borderBottom: scrolled ? '1px solid rgba(245,242,237,0.08)' : '1px solid transparent',
        transition: 'background 0.3s, border-color 0.3s, padding 0.3s',
        padding: scrolled ? '0.65rem 2.5rem' : '1rem 2.5rem',
        boxSizing: 'border-box',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>

          {/* Logo */}
          <Link href="/" style={{ fontFamily: 'Bebas Neue, serif', fontSize: '1.9rem', letterSpacing: '0.05em', color: '#f5f2ed', textDecoration: 'none', flexShrink: 0 }}>
            Chill<span style={{ color: '#ff3c1e' }}>Over</span>
          </Link>

          {/* Desktop nav links — centred */}
          <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center', position: 'absolute', left: '50%', transform: 'translateX(-50%)' }} className="desktop-nav">
            {navLinks.map(({ label, href }) => {
              const active = pathname === href || (href !== '/' && href !== '/#about' && pathname?.startsWith(href + '/'));
              return (
                <Link key={href} href={href} style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: active ? '#ff3c1e' : '#e8e2d9', textDecoration: 'none', whiteSpace: 'nowrap', transition: 'color 0.2s' }}>
                  {label}
                </Link>
              );
            })}
          </div>

          {/* Right actions */}
          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexShrink: 0 }}>
            {/* Wishlist icon */}
            <button style={{ background: 'none', border: 'none', color: '#e8e2d9', cursor: 'pointer', fontSize: '1rem', padding: '0.3rem 0.5rem', position: 'relative', display: 'flex', alignItems: 'center' }} className="desktop-nav">
              ♡
              {mounted && wishCount > 0 && (
                <span style={{ position: 'absolute', top: '0', right: '0', background: '#ff3c1e', color: '#fff', borderRadius: '50%', width: '14px', height: '14px', fontSize: '0.48rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Space Mono, monospace' }}>{wishCount}</span>
              )}
            </button>

            {/* Cart button */}
            <button
              onClick={toggleCart}
              style={{ background: '#ff3c1e', color: '#fff', fontFamily: 'Space Mono, monospace', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', border: 'none', padding: '0.5rem 1.1rem', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'background 0.2s' }}
              onMouseOver={e => (e.currentTarget.style.background = '#e02a10')}
              onMouseOut={e => (e.currentTarget.style.background = '#ff3c1e')}
            >
              Cart{mounted && totalItems > 0 ? ` (${totalItems})` : ''}
            </button>

            {/* Hamburger — mobile only */}
            <button onClick={() => setMobileOpen(true)} className="mobile-only" style={{ background: 'none', border: 'none', color: '#f5f2ed', cursor: 'pointer', fontSize: '1.4rem', padding: '0.2rem', lineHeight: 1 }}>
              ☰
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200 }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.75)' }} onClick={() => setMobileOpen(false)} />
          <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '290px', background: '#1a1a1a', borderRight: '1px solid rgba(245,242,237,0.08)', display: 'flex', flexDirection: 'column', animation: 'slideInLeft 0.3s ease' }}>
            <div style={{ padding: '1.2rem 1.5rem', borderBottom: '1px solid rgba(245,242,237,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'Bebas Neue, serif', fontSize: '1.8rem', color: '#f5f2ed' }}>Chill<span style={{ color: '#ff3c1e' }}>Over</span></span>
              <button onClick={() => setMobileOpen(false)} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '1.3rem', lineHeight: 1 }}>✕</button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {navLinks.map(({ label, href }) => (
                <Link key={href} href={href} onClick={() => setMobileOpen(false)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem', fontFamily: 'Bebas Neue, serif', fontSize: '1.9rem', letterSpacing: '0.05em', textTransform: 'uppercase', color: '#f5f2ed', borderBottom: '1px solid rgba(245,242,237,0.05)', textDecoration: 'none' }}>
                  {label} <span style={{ fontSize: '1.2rem', color: '#ff3c1e' }}>→</span>
                </Link>
              ))}
            </div>
            <div style={{ padding: '1.5rem', borderTop: '1px solid rgba(245,242,237,0.07)' }}>
              <button onClick={() => { toggleCart(); setMobileOpen(false); }} style={{ width: '100%', background: '#ff3c1e', color: '#fff', fontFamily: 'Space Mono, monospace', fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase', border: 'none', padding: '0.9rem', cursor: 'pointer' }}>
                Cart{mounted && totalItems > 0 ? ` (${totalItems})` : ''}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideInLeft { from { transform: translateX(-100%); } to { transform: translateX(0); } }
        @media (max-width: 768px) { .desktop-nav { display: none !important; } }
        @media (min-width: 769px) { .mobile-only { display: none !important; } }
      `}</style>
    </>
  );
}
