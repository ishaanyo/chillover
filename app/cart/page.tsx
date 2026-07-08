'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cartContext';
import Link from 'next/link';

declare global { interface Window { Razorpay: any; } }

const inputStyle = {
  width: '100%', background: '#111', border: '1px solid rgba(245,242,237,0.12)', color: '#f5f2ed',
  fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem', padding: '0.7rem 0.9rem', outline: 'none',
};
const labelStyle = {
  display: 'block', fontFamily: 'Space Mono, monospace', fontSize: '0.58rem',
  letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: '#888', marginBottom: '0.35rem',
};

export default function CartPage() {
  const { state, removeItem, updateQty, clearCart, subtotal, totalItems } = useCart();
  const { data: session, status } = useSession();
  const router = useRouter();

  const [address, setAddress] = useState({
    name: session?.user?.name ?? '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    pincode: '',
  });
  const [addressError, setAddressError] = useState('');
  const [processing, setProcessing] = useState(false);

  const freeShip = 999;
  const remaining = Math.max(0, freeShip - subtotal);
  const shipping = subtotal >= freeShip ? 0 : 99;
  const total = subtotal + shipping;

  const updateField = (field: keyof typeof address, value: string) => setAddress(prev => ({ ...prev, [field]: value }));

  const validateAddress = () => {
    if (!address.name.trim() || !address.phone.trim() || !address.line1.trim() || !address.city.trim() || !address.state.trim() || !address.pincode.trim()) {
      setAddressError('Please fill in all required shipping details.');
      return false;
    }
    if (!/^\d{10}$/.test(address.phone.trim())) {
      setAddressError('Enter a valid 10-digit phone number.');
      return false;
    }
    if (!/^\d{6}$/.test(address.pincode.trim())) {
      setAddressError('Enter a valid 6-digit pincode.');
      return false;
    }
    setAddressError('');
    return true;
  };

  const placeOrder = async (paymentId: string) => {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: state.items.map(item => ({
          productId: item.product.id,
          productName: item.product.name,
          productImage: item.product.images?.[0]?.url,
          productSlug: item.product.slug,
          size: item.size,
          quantity: item.quantity,
          price: item.product.price,
        })),
        subtotal,
        shippingFee: shipping,
        totalAmount: total,
        paymentId,
        shippingName: address.name,
        shippingPhone: address.phone,
        shippingLine1: address.line1,
        shippingLine2: address.line2 || undefined,
        shippingCity: address.city,
        shippingState: address.state,
        shippingPincode: address.pincode,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      alert(`Payment succeeded but saving your order failed: ${data.error ?? 'Unknown error'}. Please contact support with payment ID: ${paymentId}`);
      return;
    }

    clearCart();
    router.push(`/myaccount/orders/${data.order.id}`);
  };

  const initiateRazorpay = () => {
    if (status !== 'authenticated') {
      router.push('/login?callbackUrl=/cart');
      return;
    }
    if (!validateAddress()) return;

    setProcessing(true);
    const load = () => {
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_XXXXXXXXXXXX',
        amount: total * 100,
        currency: 'INR',
        name: 'ChillOver',
        description: `${totalItems} Oversized T-Shirt${totalItems > 1 ? 's' : ''}`,
        handler: async (response: any) => {
          await placeOrder(response.razorpay_payment_id);
        },
        modal: { ondismiss: () => setProcessing(false) },
        prefill: { name: address.name, email: session?.user?.email ?? '', contact: address.phone },
        notes: { address: `${address.line1}, ${address.city}, ${address.state} ${address.pincode}` },
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
            <Link href="/all" style={{ background: '#ff3c1e', color: '#fff', fontFamily: 'Space Mono, monospace', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '0.9rem 2.5rem', textDecoration: 'none', display: 'inline-block' }}>
              Start Shopping
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2.5rem', alignItems: 'flex-start' }}>

            {/* Cart items + address */}
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'rgba(245,242,237,0.06)', marginBottom: '1.5rem' }}>
                {state.items.map(item => (
                  <div key={`${item.product.id}-${item.size}`} style={{ background: '#0a0a0a', padding: '1.5rem', display: 'flex', gap: '1.2rem', alignItems: 'flex-start' }}>
                    {/* Image */}
                    <Link href={`/product/${item.product.slug}`} style={{ flexShrink: 0 }}>
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
                          <Link href={`/product/${item.product.slug}`} style={{ fontSize: '1rem', fontWeight: 500, color: '#f5f2ed', textDecoration: 'none', display: 'block', marginBottom: '0.3rem' }}>{item.product.name}</Link>
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
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <Link href="/all" style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.62rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888', textDecoration: 'none' }}>← Continue Shopping</Link>
                <button onClick={clearCart} style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.62rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Clear Cart</button>
              </div>

              {/* Shipping address */}
              <div style={{ background: '#1a1a1a', border: '1px solid rgba(245,242,237,0.07)', padding: '1.5rem' }}>
                <h2 style={{ fontFamily: 'Bebas Neue, serif', fontSize: '1.5rem', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '1.2rem' }}>Shipping Address</h2>

                {status !== 'authenticated' && (
                  <p style={{ fontSize: '0.8rem', color: '#ff8c00', marginBottom: '1rem' }}>
                    You'll need to <Link href="/login?callbackUrl=/cart" style={{ color: '#ff3c1e' }}>log in</Link> to place an order.
                  </p>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={labelStyle}>Full Name *</label>
                      <input value={address.name} onChange={e => updateField('name', e.target.value)} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Phone Number *</label>
                      <input value={address.phone} onChange={e => updateField('phone', e.target.value)} placeholder="10-digit mobile number" style={inputStyle} />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Address Line 1 *</label>
                    <input value={address.line1} onChange={e => updateField('line1', e.target.value)} placeholder="House no., street" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Address Line 2</label>
                    <input value={address.line2} onChange={e => updateField('line2', e.target.value)} placeholder="Landmark, area (optional)" style={inputStyle} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={labelStyle}>City *</label>
                      <input value={address.city} onChange={e => updateField('city', e.target.value)} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>State *</label>
                      <input value={address.state} onChange={e => updateField('state', e.target.value)} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Pincode *</label>
                      <input value={address.pincode} onChange={e => updateField('pincode', e.target.value)} placeholder="6-digit" style={inputStyle} />
                    </div>
                  </div>
                </div>

                {addressError && <p style={{ color: '#ff3c1e', fontSize: '0.75rem', marginTop: '1rem' }}>{addressError}</p>}
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
                <button onClick={initiateRazorpay} disabled={processing} style={{ width: '100%', background: processing ? '#333' : '#072654', color: '#fff', fontFamily: 'Space Mono, monospace', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', border: 'none', padding: '1rem', cursor: processing ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'background 0.2s', marginBottom: '0.6rem' }}
                  onMouseOver={e => !processing && (e.currentTarget.style.background = '#0a3a7a')}
                  onMouseOut={e => !processing && (e.currentTarget.style.background = '#072654')}>
                  {processing ? 'Processing…' : status === 'authenticated' ? (
                    <>Pay with <span style={{ color: '#3395ff', fontWeight: 700, fontFamily: 'DM Sans, sans-serif' }}>Razorpay</span></>
                  ) : 'Login to Checkout'}
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
            div[style*="grid-template-columns: 1fr 380px"] { grid-template-columns: 1fr !important; }
            div[style*="position: sticky"] { position: static !important; }
          }
        `}</style>
      </div>
    </div>
  );
}
