export default function Loading() {
  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 2rem' }}>
        {/* Header skeleton */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ width: '120px', height: '14px', background: '#1a1a1a', marginBottom: '0.8rem', animation: 'shimmer 1.5s infinite' }} />
          <div style={{ width: '320px', height: '48px', background: '#1a1a1a', animation: 'shimmer 1.5s infinite' }} />
        </div>
        {/* Product grid skeleton */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} style={{ background: '#1a1a1a', animation: 'shimmer 1.5s infinite', animationDelay: `${i * 0.1}s` }}>
              <div style={{ aspectRatio: '3/4', background: '#222' }} />
              <div style={{ padding: '1rem' }}>
                <div style={{ height: '12px', background: '#222', marginBottom: '0.6rem', width: '60%' }} />
                <div style={{ height: '16px', background: '#222', marginBottom: '0.5rem', width: '80%' }} />
                <div style={{ height: '20px', background: '#222', width: '40%' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes shimmer {
          0% { opacity: 0.5; }
          50% { opacity: 1; }
          100% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
