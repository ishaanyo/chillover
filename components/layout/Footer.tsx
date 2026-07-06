import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ background: '#0a0a0a', borderTop: '1px solid rgba(245,242,237,0.07)', padding: '4rem 2.5rem 2rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', marginBottom: '3rem', maxWidth: '1200px', margin: '0 auto 3rem' }}>
        <div>
          <div style={{ fontFamily: 'Bebas Neue, serif', fontSize: '2.5rem', letterSpacing: '0.05em', marginBottom: '0.8rem' }}>
            Chill<span style={{ color: '#ff3c1e' }}>Over</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#888', lineHeight: 1.7, fontWeight: 300, maxWidth: '260px', marginBottom: '1.5rem' }}>
            Premium oversized t-shirts from Jaipur. Made for those who dress with an opinion.
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {['Razorpay', 'UPI', 'Cards', 'Net Banking', 'EMI'].map(p => (
              <span key={p} style={{ background: 'rgba(245,242,237,0.05)', border: '1px solid rgba(245,242,237,0.1)', padding: '0.25rem 0.6rem', fontSize: '0.6rem', fontFamily: 'Space Mono, monospace', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888' }}>{p}</span>
            ))}
          </div>
        </div>
        <div>
          <h4 style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#ff3c1e', marginBottom: '1rem' }}>Shop</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {[['Men', '/men'], ['Women', '/women'], ['Shop All', '/all'], ['New Arrivals', '/all?filter=new'], ['Bestsellers', '/all?filter=bestseller']].map(([l, h]) => (
              <li key={h}><Link href={h} style={{ fontSize: '0.85rem', color: '#888', textDecoration: 'none', fontWeight: 300 }}>{l}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#ff3c1e', marginBottom: '1rem' }}>Help</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {['Size Guide', 'Shipping Info', 'Returns', 'Track Order', 'FAQs'].map(l => (
              <li key={l}><a href="#" style={{ fontSize: '0.85rem', color: '#888', textDecoration: 'none', fontWeight: 300 }}>{l}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#ff3c1e', marginBottom: '1rem' }}>Company</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {[['Our Story', '/#about'], ['Contact Us', '#'], ['Privacy Policy', '#'], ['Terms of Use', '#']].map(([l, h]) => (
              <li key={l}><Link href={h} style={{ fontSize: '0.85rem', color: '#888', textDecoration: 'none', fontWeight: 300 }}>{l}</Link></li>
            ))}
          </ul>
        </div>
      </div>
      <div style={{ maxWidth: '1200px', margin: '0 auto', borderTop: '1px solid rgba(245,242,237,0.07)', paddingTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <p style={{ fontSize: '0.72rem', color: '#666', fontFamily: 'Space Mono, monospace', letterSpacing: '0.06em' }}>© 2025 ChillOver. All rights reserved. Made in Jaipur 🌶</p>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          {['Instagram', 'YouTube', 'WhatsApp'].map(s => (
            <a key={s} href="#" style={{ fontSize: '0.72rem', color: '#666', fontFamily: 'Space Mono, monospace', letterSpacing: '0.08em', textDecoration: 'none' }}>{s}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}
