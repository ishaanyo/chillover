'use client';
import { useState, useEffect, useRef } from 'react';

const ITEMS = (h: string, m: string, s: string) => [
  `🔥 Use CHILL20 for 20% off first order`,
  `⚡ Sale ends in: ${h}:${m}:${s}`,
  `🚚 FREE shipping above ₹999`,
];

export default function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(false);
  const [visible, setVisible] = useState(true);
  const [time, setTime] = useState({ h: '05', m: '42', s: '17' });
  const [isMobile, setIsMobile] = useState(false);
  const lastScrollY = useRef(0);

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

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Hide on scroll down, show on scroll up
  useEffect(() => {
    const onScroll = () => {
      const current = window.scrollY;
      if (current <= 10) {
        setVisible(true); // always show at the very top
      } else if (current > lastScrollY.current + 4) {
        setVisible(false); // scrolling down — hide
      } else if (current < lastScrollY.current - 4) {
        setVisible(true); // scrolling up — reveal
      }
      lastScrollY.current = current;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (dismissed) return null;

  const items = ITEMS(time.h, time.m, time.s);

  const renderItem = (item: string) => {
    if (item.includes('CHILL20')) {
      return (
        <>🔥 Use{' '}
          <strong style={{ color: '#ff3c1e' }}>CHILL20</strong>{' '}
          for 20% off first order
        </>
      );
    }
    if (item.includes('Sale ends')) {
      return (
        <>⚡ Sale ends in:{' '}
          <span style={{ color: '#1aff9c', fontWeight: 700 }}>{time.h}:{time.m}:{time.s}</span>
        </>
      );
    }
    return <>{item}</>;
  };

  const sep = <span style={{ color: 'rgba(245,242,237,0.25)', margin: '0 1.2rem' }}>·</span>;

  return (
    <>
      <style>{`
        .ann-bar {
          transition: max-height 0.3s ease, opacity 0.3s ease;
          overflow: hidden;
        }
        .ann-bar.hidden {
          max-height: 0 !important;
          opacity: 0;
          pointer-events: none;
        }
        .ann-bar.shown {
          max-height: 34px;
          opacity: 1;
        }
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ann-track {
          display: flex;
          white-space: nowrap;
          animation: marquee 18s linear infinite;
          will-change: transform;
        }
        .ann-track:hover { animation-play-state: paused; }
      `}</style>

      <div
        className={`ann-bar ${visible ? 'shown' : 'hidden'}`}
        style={{
          background: '#1a1a1a',
          borderBottom: '1px solid rgba(245,242,237,0.07)',
          position: 'sticky',
          top: 0,
          zIndex: 102,
          height: '34px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {isMobile ? (
          <div className="ann-track" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#e8e2d9' }}>
            {[0, 1].map(copy => (
              <span key={copy} style={{ display: 'flex', alignItems: 'center' }}>
                {items.map((item, i) => (
                  <span key={i} style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ padding: '0 1rem' }}>{renderItem(item)}</span>
                    {sep}
                  </span>
                ))}
              </span>
            ))}
          </div>
        ) : (
          <>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0,
              padding: '0 3rem', fontFamily: 'var(--font-mono)', fontSize: '0.62rem',
              letterSpacing: '0.12em', textTransform: 'uppercase', color: '#e8e2d9',
              width: '100%', whiteSpace: 'nowrap', overflow: 'hidden',
            }}>
              <span>{renderItem(items[0])}</span>
              {sep}
              <span>{renderItem(items[1])}</span>
              {sep}
              <span>{renderItem(items[2])}</span>
            </div>
            <button
              onClick={() => setDismissed(true)}
              style={{ position: 'absolute', right: '0.8rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '0.85rem', lineHeight: 1, flexShrink: 0 }}
            >✕</button>
          </>
        )}
      </div>
    </>
  );
}


const ITEMS = (h: string, m: string, s: string) => [
  `🔥 Use CHILL20 for 20% off first order`,
  `⚡ Sale ends in: ${h}:${m}:${s}`,
  `🚚 FREE shipping above ₹999`,
];

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true);
  const [time, setTime] = useState({ h: '05', m: '42', s: '17' });
  const [isMobile, setIsMobile] = useState(false);

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

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  if (!visible) return null;

  const items = ITEMS(time.h, time.m, time.s);
  // Colour CHILL20 red and the timer green even in the marquee text
  const renderItem = (item: string) => {
    if (item.includes('CHILL20')) {
      return (
        <>🔥 Use{' '}
          <strong style={{ color: '#ff3c1e' }}>CHILL20</strong>{' '}
          for 20% off first order
        </>
      );
    }
    if (item.includes('Sale ends')) {
      return (
        <>⚡ Sale ends in:{' '}
          <span style={{ color: '#1aff9c', fontWeight: 700 }}>{time.h}:{time.m}:{time.s}</span>
        </>
      );
    }
    return <>{item}</>;
  };

  const sep = <span style={{ color: 'rgba(245,242,237,0.25)', margin: '0 1.2rem' }}>·</span>;

  return (
    <div style={{
      background: '#1a1a1a',
      borderBottom: '1px solid rgba(245,242,237,0.07)',
      position: 'sticky',
      top: 0,
      zIndex: 102,
      overflow: 'hidden',
      height: '34px',
      display: 'flex',
      alignItems: 'center',
    }}>

      {isMobile ? (
        /* ── Mobile: infinite marquee ── */
        <>
          <style>{`
            @keyframes marquee {
              0%   { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .ann-track {
              display: flex;
              white-space: nowrap;
              animation: marquee 18s linear infinite;
              will-change: transform;
            }
            .ann-track:hover { animation-play-state: paused; }
          `}</style>
          <div className="ann-track" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#e8e2d9' }}>
            {/* Duplicate for seamless loop */}
            {[0, 1].map(copy => (
              <span key={copy} style={{ display: 'flex', alignItems: 'center' }}>
                {items.map((item, i) => (
                  <span key={i} style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ padding: '0 1rem' }}>{renderItem(item)}</span>
                    {sep}
                  </span>
                ))}
              </span>
            ))}
          </div>
        </>
      ) : (
        /* ── Desktop: single centred row, no wrap ── */
        <>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0,
            padding: '0 3rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.62rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#e8e2d9',
            width: '100%',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
          }}>
            <span>{renderItem(items[0])}</span>
            {sep}
            <span>{renderItem(items[1])}</span>
            {sep}
            <span>{renderItem(items[2])}</span>
          </div>

          <button
            onClick={() => setVisible(false)}
            style={{
              position: 'absolute',
              right: '0.8rem',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              color: '#888',
              cursor: 'pointer',
              fontSize: '0.85rem',
              lineHeight: 1,
              flexShrink: 0,
            }}
          >✕</button>
        </>
      )}
    </div>
  );
}
