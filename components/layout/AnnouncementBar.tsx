'use client';
import { useState, useEffect } from 'react';

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true);
  const [time, setTime] = useState({ h: '05', m: '42', s: '17' });

  useEffect(() => {
    const end = Date.now() + (5 * 3600 + 42 * 60 + 17) * 1000;
    const tick = () => {
      const diff = Math.max(0, end - Date.now());
      const h = String(Math.floor(diff / 3600000)).padStart(2, '0');
      const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
      const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
      setTime({ h, m, s });
    };
    const id = setInterval(tick, 1000);
    tick();
    return () => clearInterval(id);
  }, []);

  if (!visible) return null;

  return (
    <div style={{ background: '#1a1a1a', borderBottom: '1px solid rgba(245,242,237,0.07)', position: 'relative', zIndex: 101 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', padding: '0.5rem 3rem', flexWrap: 'wrap' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#e8e2d9' }}>
          🔥 Use <strong style={{ color: '#ff3c1e' }}>CHILL20</strong> for 20% off first order
        </span>
        <span style={{ color: 'rgba(245,242,237,0.2)' }}>·</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#e8e2d9' }}>
          ⚡ Sale ends in:{' '}
          <span style={{ color: '#1aff9c', fontWeight: 700 }}>{time.h}:{time.m}:{time.s}</span>
        </span>
        <span style={{ color: 'rgba(245,242,237,0.2)' }}>·</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#e8e2d9' }}>
          🚚 FREE shipping above ₹999
        </span>
      </div>
      <button
        onClick={() => setVisible(false)}
        style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '0.9rem', lineHeight: 1 }}
      >✕</button>
    </div>
  );
}
