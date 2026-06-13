export default function ProductLoading() {
  return (
    <div style={{ paddingTop: '5rem', minHeight: '100vh', background: '#0a0a0a' }}>
      <div style={{ background: '#1a1a1a', height: '40px', marginBottom: '0' }} />
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2.5rem 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }}>
          {/* Slider skeleton */}
          <div style={{ display: 'flex', gap: '12px', minHeight: '580px' }}>
            <div style={{ width: '80px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[0,1,2,3].map(i => <div key={i} style={{ width: '80px', height: '100px', background: '#1a1a1a', animation: `shimmer 1.5s ${i*0.1}s infinite` }} />)}
            </div>
            <div style={{ flex: 1, background: '#1a1a1a', animation: 'shimmer 1.5s infinite' }} />
          </div>
          {/* Info skeleton */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', paddingTop: '0.5rem' }}>
            <div style={{ width: '80px', height: '22px', background: '#1a1a1a', animation: 'shimmer 1.5s infinite' }} />
            <div style={{ width: '75%', height: '56px', background: '#1a1a1a', animation: 'shimmer 1.5s 0.1s infinite' }} />
            <div style={{ width: '50%', height: '14px', background: '#1a1a1a', animation: 'shimmer 1.5s 0.15s infinite' }} />
            <div style={{ width: '160px', height: '44px', background: '#1a1a1a', animation: 'shimmer 1.5s 0.2s infinite' }} />
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {[0,1,2,3,4].map(i => <div key={i} style={{ width: '52px', height: '52px', background: '#1a1a1a', animation: `shimmer 1.5s ${i*0.08}s infinite` }} />)}
            </div>
            <div style={{ width: '100%', height: '52px', background: '#1a1a1a', animation: 'shimmer 1.5s 0.3s infinite' }} />
          </div>
        </div>
      </div>
      <style>{`
        @keyframes shimmer { 0% { opacity: 0.4; } 50% { opacity: 0.8; } 100% { opacity: 0.4; } }
        @media (max-width: 768px) { div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
