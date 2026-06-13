'use client';

import { useState, useEffect } from 'react';

// The data structure now includes full backgrounds and text descriptions
const SLIDES = [
  { 
    id: 1, 
    title: 'Midnight Chill', 
    subtitle: 'DROP 01',
    desc: 'The original 240 GSM oversized fit. Engineered for the streets, perfected for the night. Premium combed cotton heavy enough to hold shape.',
    bgImage: 'https://images.unsplash.com/photo-1618367588411-d9a90fefa881?q=80&w=2000&auto=format&fit=crop', // Dark concrete/urban texture
    cardBg: 'linear-gradient(135deg, #1a1a1a, #0a0a0a)',
    tshirt: { text1: 'CHILL', text2: 'OVER', bg: '#111', stroke: 'rgba(245,242,237,0.05)', fill1: 'rgba(255,60,30,0.85)', fill2: 'rgba(245,242,237,0.6)' },
  },
  { 
    id: 2, 
    title: 'Urban Noise', 
    subtitle: 'SUMMER ESSENTIAL',
    desc: 'Dropped shoulders, boxy silhouette. A lighter visual palette with the same heavy drape. Don\'t blend in.',
    bgImage: 'https://images.unsplash.com/photo-1516058571813-f4c20e5c9ee2?q=80&w=2000&auto=format&fit=crop', // Concrete/architectural light
    cardBg: 'linear-gradient(135deg, #f5f2ed, #d1ccc2)',
    tshirt: { text1: 'URBAN', text2: 'NOISE', bg: 'rgba(245,242,237,0.95)', stroke: 'rgba(0,0,0,0.05)', fill1: '#ff3c1e', fill2: '#111' },
  },
  { 
    id: 3, 
    title: 'Neon Dream', 
    subtitle: 'LIMITED EDITION',
    desc: 'Electric hues meets pitch black. Screenprinted graphics that refuse to crack or fade. Stand out when the lights go down.',
    bgImage: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2000&auto=format&fit=crop', // Cyberpunk/Neon dark texture
    cardBg: 'linear-gradient(135deg, #0d2b1f, #071710)',
    tshirt: { text1: 'NEON', text2: 'DREAM', bg: '#1aff9c', stroke: 'rgba(26,255,156,0.2)', fill1: '#111', fill2: 'rgba(0,0,0,0.6)' },
  },
  { 
    id: 4, 
    title: 'Street Acid', 
    subtitle: 'WASHED SERIES',
    desc: 'Vintage feel right out of the box. Treated with an enzyme wash for ultimate softness without sacrificing the 240 GSM weight.',
    bgImage: 'https://images.unsplash.com/photo-1502239608882-93b729c6af43?q=80&w=2000&auto=format&fit=crop', // Dark moody texture
    cardBg: 'linear-gradient(135deg, #222, #111)',
    tshirt: { text1: 'ACID', text2: 'WASH', bg: '#222', stroke: 'rgba(255,255,255,0.05)', fill1: '#888', fill2: '#444' },
  },
];

export default function HeroDynamicSlider() {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextSlide = () => setActiveIndex((prev) => (prev + 1) % SLIDES.length);
  const prevSlide = () => setActiveIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);

  // Optional: Auto-play
  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
      
      {/* 1. DYNAMIC FULLSCREEN BACKGROUNDS */}
      {SLIDES.map((slide, index) => (
        <div 
          key={`bg-${slide.id}`}
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${slide.bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: activeIndex === index ? 1 : 0,
            transform: activeIndex === index ? 'scale(1)' : 'scale(1.05)',
            transition: 'opacity 1s ease-in-out, transform 2s ease-out',
            zIndex: 0
          }}
        />
      ))}
      
      {/* Heavy overlay to ensure text readability */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(10,10,10,0.9) 0%, rgba(10,10,10,0.4) 60%, rgba(10,10,10,0.1) 100%)', zIndex: 1 }} />

      {/* 2. MAIN CONTENT LAYOUT */}
      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '1400px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', padding: '2rem 3rem' }}>
        
        {/* LEFT: Text Content */}
        <div style={{ flex: '1 1 400px', paddingRight: '4rem', color: '#fff' }}>
          
          {/* Vertical Pagination Dots */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ width: '2px', height: '40px', background: 'rgba(255,255,255,0.2)', position: 'relative' }}>
              <div style={{ position: 'absolute', top: `${(activeIndex / (SLIDES.length - 1)) * 100}%`, left: '-1px', width: '4px', height: '15px', background: '#ff3c1e', transition: 'top 0.4s ease', transform: 'translateY(-50%)' }} />
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', letterSpacing: '0.2em' }}>
              0{activeIndex + 1} / 0{SLIDES.length}
            </span>
          </div>

          <div style={{ minHeight: '200px' }}>
             {/* Key ensures React completely re-mounts the text for the fade-up animation */}
            <div key={activeIndex} style={{ animation: 'fadeUp 0.6s ease forwards' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#ff3c1e', display: 'block', marginBottom: '1rem' }}>
                {SLIDES[activeIndex].subtitle}
              </span>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(4rem, 6vw, 6rem)', lineHeight: 0.9, letterSpacing: '0.02em', textTransform: 'uppercase', marginBottom: '1.5rem', textShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                {SLIDES[activeIndex].title}
              </h1>
              <p style={{ fontSize: '1.05rem', color: '#ccc', maxWidth: '480px', lineHeight: 1.6, fontWeight: 300, marginBottom: '2.5rem' }}>
                {SLIDES[activeIndex].desc}
              </p>
              <button style={{ background: '#ff3c1e', color: '#fff', border: 'none', padding: '1rem 2.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                Shop Drop <span style={{ fontSize: '1.2rem' }}>→</span>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: Dynamic Cards Slider */}
        <div style={{ flex: '1 1 500px', height: '500px', position: 'relative', perspective: '1000px' }}>
          {SLIDES.map((slide, index) => {
            // Calculate relative position: 0 is active, 1 is next, etc.
            let offset = index - activeIndex;
            
            // Layout logic based on offset
            let translateX = 0;
            let scale = 1;
            let opacity = 1;
            let zIndex = 10;

            if (offset < 0) {
              // Past cards (hidden to the left)
              translateX = -100;
              scale = 0.8;
              opacity = 0;
              zIndex = 0;
            } else if (offset === 0) {
              // Active card
              translateX = 0;
              scale = 1;
              opacity = 1;
              zIndex = 10;
            } else {
              // Upcoming cards (stacked to the right)
              // Each card peeks out 160px more than the last
              translateX = offset * 180; 
              scale = 1 - (offset * 0.1); // Slightly smaller as they go back
              opacity = 1 - (offset * 0.15);
              zIndex = 10 - offset;
            }

            return (
              <div 
                key={slide.id}
                onClick={() => setActiveIndex(index)}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '0',
                  width: '320px',
                  height: '420px',
                  marginTop: '-210px', // half of height to center vertically
                  background: slide.cardBg,
                  borderRadius: '16px',
                  boxShadow: offset === 0 ? '0 25px 50px -12px rgba(0,0,0,0.6)' : '0 10px 30px rgba(0,0,0,0.3)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  transform: `translateX(${translateX}px) scale(${scale})`,
                  opacity: opacity,
                  zIndex: zIndex,
                  transition: 'all 0.6s cubic-bezier(0.25, 1, 0.5, 1)',
                  cursor: offset > 0 ? 'pointer' : 'default',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '2rem'
                }}
              >
                {/* Embedded T-Shirt Graphic */}
                <svg viewBox="0 0 280 320" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', dropShadow: '0 10px 20px rgba(0,0,0,0.5)' }}>
                  <path d="M70 40 L40 90 L80 105 L80 280 L200 280 L200 105 L240 90 L210 40 L175 55 C175 55 160 70 140 70 C120 70 105 55 105 55 Z" fill={slide.tshirt.bg} stroke={slide.tshirt.stroke} strokeWidth="1.5" />
                  <text x="140" y="150" fontFamily="serif" fontSize="42" fill={slide.tshirt.fill1} textAnchor="middle" letterSpacing="3">{slide.tshirt.text1}</text>
                  <text x="140" y="195" fontFamily="serif" fontSize="42" fill={slide.tshirt.fill2} textAnchor="middle" letterSpacing="3">{slide.tshirt.text2}</text>
                  <line x1="100" y1="210" x2="180" y2="210" stroke="rgba(255,60,30,0.3)" strokeWidth="1" />
                </svg>
                
                {/* Name tag at bottom of card */}
                <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', right: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: slide.tshirt.fill2, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  <span>{slide.title}</span>
                  <span style={{ color: '#ff3c1e', fontWeight: 'bold' }}>Drop 0{slide.id}</span>
                </div>
              </div>
            );
          })}

          {/* Navigation Controls (Arrows) */}
          <div style={{ position: 'absolute', bottom: '-40px', left: '0', display: 'flex', gap: '1rem', zIndex: 20 }}>
            <button onClick={prevSlide} style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.3s' }} onMouseOver={(e)=>e.currentTarget.style.background='rgba(255,255,255,0.2)'} onMouseOut={(e)=>e.currentTarget.style.background='rgba(255,255,255,0.1)'}>
              ←
            </button>
            <button onClick={nextSlide} style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.3s' }} onMouseOver={(e)=>e.currentTarget.style.background='rgba(255,255,255,0.2)'} onMouseOut={(e)=>e.currentTarget.style.background='rgba(255,255,255,0.1)'}>
              →
            </button>
          </div>
        </div>

      </div>

      {/* Basic Keyframe injected for text animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  );
}