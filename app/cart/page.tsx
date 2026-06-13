'use client';
import { useCart } from '@/lib/cartContext';
import { useWishlist } from '@/lib/wishlistContext';
import Link from 'next/link';

declare global { interface Window { Razorpay: any; } }

export default function CartPage() {
  const { state, removeItem, updateQty, clearCart, subtotal, totalItems } = useCart();
  const { items: wishlistIds } = useWishlist();
  const freeShip = 999;
  const remaining = Math.max(0, freeShip - subtotal);
  const shipping = subtotal >= freeShip ? 0 : 99;
  const total = subtotal + shipping;

  const initiateRazorpay = () => {
    const load = () => {
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_XXXXXXXXXXXX',
        amount: total * 100,
        currency: 'INR',
        name: 'ChillOver',
        description: `${totalItems} Oversized T-Shirt${totalItems > 1 ? 's' : ''}`,
        handler: (response: any) => {
          alert(`✅ Payment successful!\nOrder ID: ${response.razorpay_payment_id}\n\nThank you for shopping with ChillOver!`);
          clearCart();
        },
        prefill: { name: '', email: '', contact: '' },
        notes: { address: 'ChillOver, Jaipur, Rajasthan 302001' },
        theme: { color: '#ff3c1e' },
      };
      new window.Razorpay(options).open();
    };
    if (window.Razorpay) { load(); return; }
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload = load;
    document.head.appendChild(s);
  };

  return (
    <div style={{ paddingTop: '5rem', minHeight: '100vh', background: '#0a0a0a' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 2rem' }}>
        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.62rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#888', marginBottom: '0.4rem' }}>
            <Link href="/" style={{ color: '#888', textDecoration: 'none' }}>Home</Link> › Cart
          </p>
          <h1 style={{ fontFamily: 'Bebas Neue, serif', fontSize: 'clamp(2.5rem,6vw,4.5rem)', letterSpacing: '0.03em', textTransform: 'uppercase', lineHeight: 1 }}>
            Your Cart {totalItems > 0 && <span style={{ color: '#ff3c1e' }}>({totalItems})</span>}
          </h1>
        </div>

        {state.items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '6rem 0' }}>
            <div style={{ fontSize: '5rem', marginBottom: '1.5rem', opacity: 0.25 }}>🛒</div>
            <h2 style={{ fontFamily: 'Bebas Neue, serif', fontSize: '2.5rem', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.8rem' }}>Your cart is empty</h2>
            <p style={{ color: '#888', marginBottom: '2rem', fontWeight: 300 }}>Looks like you haven&apos;t added anything yet.</p>
            <Link href="/shop/all" style={{ background: '#ff3c1e', color: '#fff', fontFamily: 'Space Mono, monospace', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '0.9rem 2.5rem', textDecoration: 'none', display: 'inline-block' }}>
              Start Shopping
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2.5rem', alignItems: 'flex-start' }}>

            {/* Cart items */}
            <div>
              {/* Free shipping bar */}
              <div style={{ background: '#1a1a1a', border: '1px solid rgba(245,242,237,0.07)', padding: '1rem 1.5rem', marginBottom: '1.5rem' }}>
                {remaining === 0 ? (
                  <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.62rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#1aff9c' }}>🎉 You&apos;ve unlocked FREE shipping!</p>
                ) : (
                  <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.62rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#e8e2d9' }}>
                    Add <span style={{ color: '#1aff9c' }}>₹{remaining}</span> more for FREE shipping 🚚
                  </p>
                )}
                <div style={{ marginTop: '0.6rem', height: '3px', background: 'rgba(26,255,156,0.1)', borderRadius: '2px' }}>
                  <div style={{ height: '100%', background: '#1aff9c', width: `${Math.min(100, (subtotal / freeShip) * 100)}%`, transition: 'width 0.5s ease', borderRadius: '2px' }} />
                </div>
              </div>

              {/* Items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'rgba(245,242,237,0.06)' }}>
                {state.items.map(item => (
                  <div key={`${item.product.id}-${item.size}`} style={{ background: '#0a0a0a', padding: '1.5rem', display: 'flex', gap: '1.2rem', alignItems: 'flex-start' }}>
                    {/* Image */}
                    <Link href={`/shop/${item.product.category}/${item.product.slug}`} style={{ flexShrink: 0 }}>
                      <div style={{ width: '90px', height: '115px', background: '#111', overflow: 'hidden' }}>
                        {item.product.images?.[0] ? (
                          <img src={item.product.images[0].url} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>👕</div>
                        )}
                      </div>
                    </Link>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                        <div>
                          <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.58rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888', marginBottom: '0.25rem' }}>
                            {item.product.category} · Oversized
                          </p>
                          <Link href={`/shop/${item.product.category}/${item.product.slug}`} style={{ fontSize: '1rem', fontWeight: 500, color: '#f5f2ed', textDecoration: 'none', display: 'block', marginBottom: '0.3rem' }}>{item.product.name}</Link>
                          <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888' }}>Size: {item.size}</p>
                        </div>
                        <span style={{ fontFamily: 'Bebas Neue, serif', fontSize: '1.5rem', letterSpacing: '0.03em', color: '#ff3c1e', flexShrink: 0 }}>
                          ₹{item.product.price * item.quantity}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem' }}>
                        {/* Qty control */}
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <button onClick={() => item.quantity > 1 ? updateQty(item.product.id, item.size, item.quantity - 1) : removeItem(item.product.id, item.size)}
                            style={{ width: '32px', height: '32px', background: 'transparent', border: '1px solid rgba(245,242,237,0.15)', color: '#f5f2ed', cursor: 'pointer', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'border-color 0.15s' }}>−</button>
                          <span style={{ width: '44px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Space Mono, monospace', fontSize: '0.82rem', borderTop: '1px solid rgba(245,242,237,0.15)', borderBottom: '1px solid rgba(245,242,237,0.15)' }}>{item.quantity}</span>
                          <button onClick={() => updateQty(item.product.id, item.size, item.quantity + 1)}
                            style={{ width: '32px', height: '32px', background: 'transparent', border: '1px solid rgba(245,242,237,0.15)', color: '#f5f2ed', cursor: 'pointer', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'border-color 0.15s' }}>+</button>
                        </div>
                        {/* Per-unit price */}
                        <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.08em', color: '#888' }}>₹{item.product.price} each</p>
                        {/* Remove */}
                        <button onClick={() => removeItem(item.product.id, item.size)}
                          style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontFamily: 'Space Mono, monospace', fontSize: '0.58rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: 0, transition: 'color 0.2s' }}
                          onMouseOver={e => (e.currentTarget.style.color = '#ff3c1e')}
                          onMouseOut={e => (e.currentTarget.style.color = '#888')}>Remove</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Continue shopping */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <Link href="/shop/all" style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.62rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888', textDecoration: 'none' }}>← Continue Shopping</Link>
                <button onClick={clearCart} style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.62rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Clear Cart</button>
              </div>
            </div>

            {/* Order summary sidebar */}
            <div style={{ position: 'sticky', top: '5.5rem' }}>
              <div style={{ background: '#1a1a1a', border: '1px solid rgba(245,242,237,0.07)', padding: '1.5rem' }}>
                <h2 style={{ fontFamily: 'Bebas Neue, serif', fontSize: '1.8rem', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>Order Summary</h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1.2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                    <span style={{ color: '#888' }}>Subtotal ({totalItems} item{totalItems !== 1 ? 's' : ''})</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                    <span style={{ color: '#888' }}>Shipping</span>
                    <span style={{ color: shipping === 0 ? '#1aff9c' : '#f5f2ed' }}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                    <span style={{ color: '#888' }}>Taxes</span>
                    <span style={{ color: '#888' }}>Included</span>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid rgba(245,242,237,0.1)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.5rem' }}>
                  <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888' }}>Total</span>
                  <span style={{ fontFamily: 'Bebas Neue, serif', fontSize: '2.2rem', letterSpacing: '0.03em' }}>₹{total}</span>
                </div>

                {/* Coupon */}
                <div style={{ marginBottom: '1.2rem' }}>
                  <div style={{ display: 'flex', gap: 0 }}>
                    <input type="text" placeholder="Coupon code (CHILL20)" style={{ flex: 1, background: '#111', border: '1px solid rgba(245,242,237,0.1)', borderRight: 'none', color: '#f5f2ed', fontFamily: 'DM Sans, sans-serif', fontSize: '0.8rem', padding: '0.6rem 0.8rem', outline: 'none' }} />
                    <button style={{ background: 'transparent', border: '1px solid rgba(245,242,237,0.1)', color: '#888', fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0.6rem 0.9rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>Apply</button>
                  </div>
                </div>

                {/* Checkout button */}
                <button onClick={initiateRazorpay} style={{ width: '100%', background: '#072654', color: '#fff', fontFamily: 'Space Mono, monospace', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', border: 'none', padding: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'background 0.2s', marginBottom: '0.6rem' }}
                  onMouseOver={e => (e.currentTarget.style.background = '#0a3a7a')}
                  onMouseOut={e => (e.currentTarget.style.background = '#072654')}>
                  Pay with <span style={{ color: '#3395ff', fontWeight: 700, fontFamily: 'DM Sans, sans-serif' }}>Razorpay</span>
                </button>

                <p style={{ textAlign: 'center', fontSize: '0.6rem', color: '#666', fontFamily: 'Space Mono, monospace', letterSpacing: '0.05em', marginBottom: '1.2rem' }}>
                  🔒 256-bit SSL · UPI · Cards · Net Banking · EMI
                </p>

                {/* Trust badges */}
                <div style={{ borderTop: '1px solid rgba(245,242,237,0.06)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {[['🚚', 'Free shipping above ₹999'], ['↩️', '7-day easy returns'], ['📦', 'Ships in 24hrs from Jaipur']].map(([icon, text]) => (
                    <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.75rem', color: '#888' }}>
                      <span>{icon}</span><span>{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <style>{`
          @media (max-width: 768px) {
            div[style*="grid-template-columns: 1fr 360px"] { grid-template-columns: 1fr !important; }
            div[style*="position: sticky"] { position: static !important; }
          }
        `}</style>
      </div>
    </div>
  );
}
