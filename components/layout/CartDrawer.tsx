'use client';
import { useEffect, useState } from 'react';
import { useCart } from '@/lib/cartContext';

declare global { interface Window { Razorpay: any; } }

export default function CartDrawer() {
  const { state, removeItem, updateQty, closeCart, clearCart, subtotal, totalItems } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Lock body scroll when open
  useEffect(() => {
    if (!mounted) return;
    document.body.style.overflow = state.isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [state.isOpen, mounted]);

  const freeShipAt = 999;
  const remaining  = Math.max(0, freeShipAt - subtotal);
  const shipping   = subtotal >= freeShipAt ? 0 : 99;

  function initiateRazorpay() {
    const load = () => {
      const total = subtotal + shipping;
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_XXXXXXXXXXXX',
        amount: total * 100,
        currency: 'INR',
        name: 'ChillOver',
        description: `${totalItems} oversized tee${totalItems !== 1 ? 's' : ''}`,
        handler: (res: any) => {
          alert(`✅ Payment successful!\nID: ${res.razorpay_payment_id}\n\nThank you for shopping with ChillOver! 🎉`);
          clearCart();
          closeCart();
        },
        prefill: { name: '', email: '', contact: '' },
        notes: { address: 'ChillOver, Jaipur, Rajasthan 302001' },
        theme: { color: '#ff3c1e' },
        modal: { ondismiss: () => {} },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    };

    if (typeof window.Razorpay !== 'undefined') {
      load();
    } else {
      const s = document.createElement('script');
      s.src = 'https://checkout.razorpay.com/v1/checkout.js';
      s.onload = load;
      s.onerror = () => alert('Could not load Razorpay. Check your internet connection.');
      document.head.appendChild(s);
    }
  }

  // Don't render at all until client hydrated
  if (!mounted) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={closeCart}
        style={{
          position: 'fixed', inset: 0, zIndex: 300,
          background: 'rgba(0,0,0,0.72)',
          opacity: state.isOpen ? 1 : 0,
          pointerEvents: state.isOpen ? 'all' : 'none',
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* Drawer panel */}
      <aside
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 301,
          width: '420px', maxWidth: '100vw',
          background: '#1a1a1a',
          borderLeft: '1px solid rgba(245,242,237,0.08)',
          display: 'flex', flexDirection: 'column',
          transform: state.isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        {/* Header */}
        <div style={{ padding: '1.2rem 1.5rem', borderBottom: '1px solid rgba(245,242,237,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <span style={{ fontFamily: 'Bebas Neue, serif', fontSize: '2rem', letterSpacing: '0.05em' }}>
            Cart {totalItems > 0 && <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.75rem', color: '#ff3c1e' }}>({totalItems})</span>}
          </span>
          <button onClick={closeCart} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '1.3rem', lineHeight: 1, transition: 'color 0.2s', padding: '0.2rem' }}
            onMouseOver={e => (e.currentTarget.style.color = '#f5f2ed')}
            onMouseOut={e => (e.currentTarget.style.color = '#888')}>✕</button>
        </div>

        {/* Free shipping progress */}
        {subtotal > 0 && (
          <div style={{ padding: '0.75rem 1.5rem', background: 'rgba(26,255,156,0.06)', borderBottom: '1px solid rgba(26,255,156,0.1)', flexShrink: 0 }}>
            <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#1aff9c', marginBottom: '0.4rem' }}>
              {remaining === 0 ? '🎉 You\'ve unlocked FREE shipping!' : `Add ₹${remaining} more for FREE shipping 🚚`}
            </p>
            <div style={{ height: '3px', background: 'rgba(26,255,156,0.15)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ height: '100%', background: '#1aff9c', width: `${Math.min(100, (subtotal / freeShipAt) * 100)}%`, transition: 'width 0.5s ease', borderRadius: '2px' }} />
            </div>
          </div>
        )}

        {/* Items list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem 1.5rem' }}>
          {state.items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: '#888' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }}>🛒</div>
              <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Your cart is empty</p>
              <p style={{ fontSize: '0.82rem', color: '#666', fontWeight: 300 }}>Go fill it with vibes.</p>
              <button onClick={closeCart} style={{ marginTop: '1.5rem', background: 'none', border: '1px solid rgba(245,242,237,0.2)', color: '#e8e2d9', fontFamily: 'Space Mono, monospace', fontSize: '0.62rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.6rem 1.4rem', cursor: 'pointer' }}>
                Continue Shopping
              </button>
            </div>
          ) : (
            state.items.map(item => (
              <div key={`${item.product.id}-${item.size}`} style={{ display: 'flex', gap: '1rem', padding: '1rem 0', borderBottom: '1px solid rgba(245,242,237,0.06)', alignItems: 'flex-start' }}>
                {/* Product image */}
                <a href={`/product/${item.product.slug}`} style={{ flexShrink: 0, textDecoration: 'none' }}>
                  <div style={{ width: '72px', height: '90px', background: '#111', overflow: 'hidden' }}>
                    {item.product.images?.[0] ? (
                      <img src={item.product.images[0].url} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', opacity: 0.4 }}>👕</div>
                    )}
                  </div>
                </a>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 500, fontSize: '0.875rem', marginBottom: '0.15rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.product.name}</div>
                  <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.58rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#888', marginBottom: '0.6rem' }}>
                    Size: {item.size}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    {/* Qty controls */}
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <button onClick={() => item.quantity > 1 ? updateQty(item.product.id, item.size, item.quantity - 1) : removeItem(item.product.id, item.size)}
                        style={{ width: '28px', height: '28px', background: 'transparent', border: '1px solid rgba(245,242,237,0.15)', color: '#f5f2ed', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}>−</button>
                      <span style={{ width: '36px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Space Mono, monospace', fontSize: '0.78rem', borderTop: '1px solid rgba(245,242,237,0.15)', borderBottom: '1px solid rgba(245,242,237,0.15)' }}>
                        {item.quantity}
                      </span>
                      <button onClick={() => updateQty(item.product.id, item.size, item.quantity + 1)}
                        style={{ width: '28px', height: '28px', background: 'transparent', border: '1px solid rgba(245,242,237,0.15)', color: '#f5f2ed', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}>+</button>
                    </div>
                    {/* Price */}
                    <span style={{ fontFamily: 'Bebas Neue, serif', fontSize: '1.3rem', color: '#ff3c1e', letterSpacing: '0.03em' }}>
                      ₹{item.product.price * item.quantity}
                    </span>
                  </div>

                  <button onClick={() => removeItem(item.product.id, item.size)}
                    style={{ marginTop: '0.3rem', background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontFamily: 'Space Mono, monospace', fontSize: '0.56rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: 0, transition: 'color 0.2s' }}
                    onMouseOver={e => (e.currentTarget.style.color = '#ff3c1e')}
                    onMouseOut={e => (e.currentTarget.style.color = '#666')}>
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {state.items.length > 0 && (
          <div style={{ padding: '1.2rem 1.5rem', borderTop: '1px solid rgba(245,242,237,0.08)', flexShrink: 0 }}>
            {/* Subtotal */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
              <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.62rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888' }}>Subtotal</span>
              <span style={{ fontFamily: 'Bebas Neue, serif', fontSize: '1.8rem', letterSpacing: '0.03em' }}>₹{subtotal}</span>
            </div>
            {shipping > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#888' }}>Shipping</span>
                <span style={{ fontSize: '0.75rem', color: '#f5f2ed' }}>₹{shipping}</span>
              </div>
            )}

            {/* Razorpay checkout */}
            <button onClick={initiateRazorpay}
              style={{ width: '100%', background: '#072654', color: '#fff', fontFamily: 'Space Mono, monospace', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', border: 'none', padding: '0.95rem 1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem', transition: 'background 0.2s' }}
              onMouseOver={e => (e.currentTarget.style.background = '#0a3a7a')}
              onMouseOut={e => (e.currentTarget.style.background = '#072654')}>
              Checkout with <span style={{ color: '#3395ff', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '0.85rem' }}>Razorpay</span>
            </button>

            <p style={{ textAlign: 'center', fontSize: '0.56rem', color: '#666', fontFamily: 'Space Mono, monospace', letterSpacing: '0.05em', marginBottom: '0.8rem' }}>
              🔒 SSL Secured · UPI · Cards · Net Banking · EMI
            </p>

            {/* Cart link */}
            <a href="/cart" onClick={closeCart} style={{ display: 'block', textAlign: 'center', fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888', textDecoration: 'none', padding: '0.3rem 0', transition: 'color 0.2s' }}
              onMouseOver={e => (e.currentTarget.style.color = '#f5f2ed')}
              onMouseOut={e => (e.currentTarget.style.color = '#888')}>
              View Full Cart →
            </a>
          </div>
        )}
      </aside>
    </>
  );
}
