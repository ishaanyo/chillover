import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ paddingTop: '6rem', minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div style={{ fontFamily: 'Bebas Neue, serif', fontSize: 'clamp(8rem,20vw,16rem)', letterSpacing: '0.02em', color: 'rgba(255,60,30,0.15)', lineHeight: 0.9, marginBottom: '1rem' }}>404</div>
        <h1 style={{ fontFamily: 'Bebas Neue, serif', fontSize: 'clamp(2rem,5vw,3.5rem)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.8rem' }}>Page Not Found</h1>
        <p style={{ color: '#888', fontSize: '0.95rem', fontWeight: 300, marginBottom: '2.5rem', maxWidth: '400px', margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
          This page took a chill day off. Head back to find something cooler.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" style={{ background: '#ff3c1e', color: '#fff', fontFamily: 'Space Mono, monospace', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '0.9rem 2rem', textDecoration: 'none' }}>Go Home</Link>
          <Link href="/shop/all" style={{ background: 'transparent', color: '#f5f2ed', fontFamily: 'Space Mono, monospace', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '0.9rem 2rem', border: '1px solid rgba(245,242,237,0.2)', textDecoration: 'none' }}>Shop All</Link>
        </div>
      </div>
    </div>
  );
}
