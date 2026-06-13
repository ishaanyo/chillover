'use client';
import { useState, useEffect } from 'react';

export default function FloatingButtons() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const handler = () => setShowTop(window.scrollY > 400);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', display: 'flex', flexDirection: 'column', gap: '0.7rem', zIndex: 90 }}>
      <a href="https://wa.me/919876543210?text=Hi%20ChillOver!%20I%27d%20like%20to%20know%20more%20about%20your%20oversized%20t-shirts."
        target="_blank" rel="noopener noreferrer"
        title="Chat on WhatsApp"
        style={{ width: '48px', height: '48px', background: '#25D366', border: 'none', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', cursor: 'pointer', textDecoration: 'none', transition: 'transform 0.2s, background 0.2s', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}
        onMouseOver={e => { (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1.1)'; }}
        onMouseOut={e => { (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1)'; }}>
        💬
      </a>

      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          title="Back to top"
          style={{ width: '48px', height: '48px', background: '#1a1a1a', border: '1px solid rgba(245,242,237,0.15)', color: '#f5f2ed', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', cursor: 'pointer', transition: 'transform 0.2s, border-color 0.2s', boxShadow: '0 4px 12px rgba(0,0,0,0.3)', animation: 'fadeIn 0.3s ease' }}
          onMouseOver={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#ff3c1e'; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'; }}
          onMouseOut={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(245,242,237,0.15)'; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'; }}>
          ↑
        </button>
      )}
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}
