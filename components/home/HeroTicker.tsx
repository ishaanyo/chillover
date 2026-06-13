'use client';
export default function HeroTicker() {
  const items = ['Free Shipping Above ₹999', 'Premium 240 GSM Cotton', 'Oversized Fit Guaranteed', 'Bold Prints, Bolder Vibes', 'Easy Returns · 7 Days', 'Razorpay Secure Checkout'];
  const doubled = [...items, ...items];
  return (
    <div style={{ background: '#ff3c1e', padding: '0.65rem 0', overflow: 'hidden', whiteSpace: 'nowrap' }}>
      <div style={{ display: 'inline-flex', gap: '3rem', animation: 'ticker 20s linear infinite' }}>
        {doubled.map((item, i) => (
          <span key={i} style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#fff' }}>
            {item} {i % items.length !== items.length - 1 && <span style={{ opacity: 0.5 }}>✦</span>}
          </span>
        ))}
      </div>
      <style>{`@keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
    </div>
  );
}
