'use client';
import { useState } from 'react';
import { ProductImage } from '@/types';

interface Props {
  images: ProductImage[];
  productName: string;
  productId: string;
}

export default function VerticalImageSlider({ images, productName, productId }: Props) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [zoomX, setZoomX] = useState(50);
  const [zoomY, setZoomY] = useState(50);

  const sorted = [...images].sort((a, b) => a.order - b.order);
  const active = sorted[activeIdx] ?? sorted[0];
  const total = sorted.length;

  function prev() { setActiveIdx(i => (i - 1 + total) % total); setZoomed(false); }
  function next() { setActiveIdx(i => (i + 1) % total); setZoomed(false); }

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    setZoomX(((e.clientX - r.left) / r.width) * 100);
    setZoomY(((e.clientY - r.top) / r.height) * 100);
  }

  return (
    <div style={{ display: 'flex', gap: '12px', height: '100%' }}>

      {/* ── Vertical thumbnail strip ── */}
      <div style={{
        display: 'flex', flexDirection: 'column', gap: '8px',
        width: '82px', flexShrink: 0,
        maxHeight: '560px', overflowY: 'auto',
        scrollbarWidth: 'none',
      }}>
        {sorted.map((img, i) => (
          <button
            key={img.id}
            onClick={() => { setActiveIdx(i); setZoomed(false); }}
            style={{
              width: '82px', height: '104px', flexShrink: 0,
              border: `2px solid ${i === activeIdx ? '#ff3c1e' : 'rgba(245,242,237,0.12)'}`,
              background: '#111', cursor: 'pointer', padding: 0,
              overflow: 'hidden', transition: 'border-color 0.2s',
              position: 'relative',
            }}
          >
            <img
              src={img.url}
              alt={img.alt || `${productName} view ${i + 1}`}
              style={{
                width: '100%', height: '100%', objectFit: 'cover',
                opacity: i === activeIdx ? 1 : 0.5,
                transition: 'opacity 0.2s',
              }}
            />
            {i === activeIdx && (
              <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px', background: '#ff3c1e' }} />
            )}
          </button>
        ))}
      </div>

      {/* ── Main image ── */}
      <div
        style={{
          flex: 1, position: 'relative', background: '#0f0f0f',
          overflow: 'hidden', minHeight: '560px',
          cursor: zoomed ? 'zoom-out' : 'zoom-in',
        }}
        onClick={() => setZoomed(z => !z)}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setZoomed(false)}
      >
        {active && (
          <img
            src={active.url}
            alt={active.alt || productName}
            style={{
              width: '100%', height: '100%', objectFit: 'cover',
              display: 'block', userSelect: 'none',
              transformOrigin: `${zoomX}% ${zoomY}%`,
              transform: zoomed ? 'scale(2.2)' : 'scale(1)',
              transition: zoomed ? 'transform 0.08s ease-out' : 'transform 0.35s ease',
            }}
          />
        )}

        {/* Arrows */}
        {total > 1 && !zoomed && (
          <>
            <button
              onClick={e => { e.stopPropagation(); prev(); }}
              style={{
                position: 'absolute', top: '50%', left: '10px',
                transform: 'translateY(-50%)',
                background: 'rgba(10,10,10,0.7)', border: 'none',
                color: '#f5f2ed', width: '40px', height: '40px',
                cursor: 'pointer', fontSize: '1.3rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 2,
              }}
            >‹</button>
            <button
              onClick={e => { e.stopPropagation(); next(); }}
              style={{
                position: 'absolute', top: '50%', right: '10px',
                transform: 'translateY(-50%)',
                background: 'rgba(10,10,10,0.7)', border: 'none',
                color: '#f5f2ed', width: '40px', height: '40px',
                cursor: 'pointer', fontSize: '1.3rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 2,
              }}
            >›</button>
          </>
        )}

        {/* Counter */}
        <div style={{
          position: 'absolute', bottom: '10px', left: '12px',
          fontFamily: 'Space Mono, monospace', fontSize: '0.58rem',
          letterSpacing: '0.1em', color: 'rgba(245,242,237,0.5)',
          background: 'rgba(10,10,10,0.65)', padding: '3px 8px',
          pointerEvents: 'none',
        }}>
          {activeIdx + 1} / {total}
        </div>

        {/* Zoom hint */}
        {!zoomed && (
          <div style={{
            position: 'absolute', bottom: '10px', right: '12px',
            fontFamily: 'Space Mono, monospace', fontSize: '0.5rem',
            letterSpacing: '0.1em', textTransform: 'uppercase',
            color: 'rgba(245,242,237,0.35)', background: 'rgba(10,10,10,0.55)',
            padding: '3px 8px', pointerEvents: 'none',
          }}>
            🔍 Zoom
          </div>
        )}
      </div>
    </div>
  );
}
