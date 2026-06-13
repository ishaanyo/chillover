'use client';
export default function NewsletterForm() {
  return (
    <form style={{ display: 'flex', maxWidth: '480px', margin: '0 auto' }} onSubmit={e => { e.preventDefault(); alert('Thanks for subscribing!'); }}>
      <input type="email" placeholder="your@email.com" style={{ flex: 1, background: 'rgba(0,0,0,0.15)', border: '1px solid rgba(255,255,255,0.2)', borderRight: 'none', color: '#fff', fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem', padding: '0.9rem 1.2rem', outline: 'none' }} />
      <button type="submit" style={{ background: '#0a0a0a', color: '#fff', fontFamily: 'Space Mono, monospace', fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase', border: 'none', padding: '0.9rem 1.5rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>Subscribe →</button>
    </form>
  );
}
