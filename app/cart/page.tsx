'use client';
import { useState, useEffect } from 'react';
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
  const [codEnabled, setCodEnabled] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'RAZORPAY' | 'COD'>('RAZORPAY');

  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [addingNewAddress, setAddingNewAddress] = useState(false);
  const [addressesLoaded, setAddressesLoaded] = useState(false);

  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponError, setCouponError] = useState('');
  const [couponChecking, setCouponChecking] = useState(false);

  useEffect(() => {
    fetch('/api/settings').then(res => res.json()).then(data => setCodEnabled(Boolean(data.codEnabled))).catch(() => setCodEnabled(false));
  }, []);

  // Load the customer's saved addresses once logged in, and pre-select their default
  useEffect(() => {
    if (status !== 'authenticated') return;
    fetch('/api/addresses')
      .then(res => res.json())
      .then(data => {
        const addrs = data.addresses ?? [];
        setSavedAddresses(addrs);
        const defaultAddr = addrs.find((a: any) => a.isDefault) ?? addrs[0];
        if (defaultAddr) {
          selectSavedAddress(defaultAddr);
        } else {
          setAddingNewAddress(true);
        }
      })
      .catch(() => setAddingNewAddress(true))
      .finally(() => setAddressesLoaded(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const selectSavedAddress = (addr: any) => {
    setSelectedAddressId(addr.id);
    setAddingNewAddress(false);
    setAddress({
      name: addr.name, phone: addr.phone, line1: addr.line1,
      line2: addr.line2 ?? '', city: addr.city, state: addr.state, pincode: addr.pincode,
    });
    setAddressError('');
  };

  const startNewAddress = () => {
    setSelectedAddressId(null);
    setAddingNewAddress(true);
    setAddress({ name: session?.user?.name ?? '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '' });
    setAddressError('');
  };

  const freeShip = 999;
  const remaining = Math.max(0, freeShip - subtotal);
  const shipping = subtotal >= freeShip ? 0 : 99;
  const discount = appliedCoupon?.discount ?? 0;
  const total = Math.max(0, subtotal + shipping - discount);

  const applyCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponChecking(true);
    setCouponError('');

    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponInput.trim(), subtotal }),
      });
      const data = await res.json();

      if (!data.valid) {
        setCouponError(data.message ?? 'Invalid coupon code.');
        setAppliedCoupon(null);
      } else {
        setAppliedCoupon({ code: data.coupon.code, discount: data.discount });
        setCouponError('');
      }
    } catch {
      setCouponError('Failed to apply coupon. Please try again.');
    } finally {
      setCouponChecking(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
    setCouponError('');
  };

  // Re-validate whenever the cart subtotal changes, since min-order-value or cap may no longer apply
  useEffect(() => {
    if (!appliedCoupon) return;
    fetch('/api/coupons/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: appliedCoupon.code, subtotal }),
    })
      .then(res => res.json())
      .then(data => {
        if (!data.valid) {
          setAppliedCoupon(null);
          setCouponError(data.message ?? 'Coupon no longer valid for this order.');
        } else if (data.discount !== appliedCoupon.discount) {
          setAppliedCoupon(prev => prev ? { ...prev, discount: data.discount } : null);
        }
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subtotal]);

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

  const placeOrder = async (method: 'RAZORPAY' | 'COD', paymentId?: string) => {
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
        couponCode: appliedCoupon?.code,
        discountAmount: discount,
        totalAmount: total,
        paymentMethod: method,
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
      const suffix = paymentId ? ` Please contact support with payment ID: ${paymentId}` : '';
      alert(`${method === 'RAZORPAY' ? 'Payment succeeded but saving your order failed' : 'Failed to place order'}: ${data.error ?? 'Unknown error'}.${suffix}`);
      setProcessing(false);
      return;
    }

    // If this was a freshly typed address (not one already in the address book), save it for next time
    if (!selectedAddressId) {
      fetch('/api/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          label: 'Home',
          name: address.name,
          phone: address.phone,
          line1: address.line1,
          line2: address.line2 || undefined,
          city: address.city,
          state: address.state,
          pincode: address.pincode,
          isDefault: savedAddresses.length === 0,
        }),
      }).catch(() => { /* non-critical — order already placed successfully */ });
    }

    clearCart();
    router.push(`/myaccount/orders/${data.order.id}`);
  };

  const initiateRazorpay = () => {
    setProcessing(true);
    const load = () => {
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_XXXXXXXXXXXX',
        amount: total * 100,
        currency: 'INR',
        name: 'ChillOver',
        description: `${totalItems} Oversized T-Shirt${totalItems > 1 ? 's' : ''}`,
        handler: async (response: any) => {
          await placeOrder('RAZORPAY', response.razorpay_payment_id);
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

  const handleCheckout = () => {
    if (status !== 'authenticated') {
      router.push('/login?callbackUrl=/cart');
      return;
    }
    if (!validateAddress()) return;

    if (paymentMethod === 'COD') {
      setProcessing(true);
      placeOrder('COD');
    } else {
      initiateRazorpay();
    }
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

                {/* Saved addresses */}
                {status === 'authenticated' && savedAddresses.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.2rem' }}>
                    {savedAddresses.map(addr => (
                      <label
                        key={addr.id}
                        onClick={() => selectSavedAddress(addr)}
                        style={{
                          display: 'flex', alignItems: 'flex-start', gap: '0.7rem', padding: '0.9rem 1rem', cursor: 'pointer',
                          border: `1px solid ${selectedAddressId === addr.id ? '#ff3c1e' : 'rgba(245,242,237,0.12)'}`,
                          background: selectedAddressId === addr.id ? 'rgba(255,60,30,0.06)' : 'transparent',
                        }}
                      >
                        <input type="radio" checked={selectedAddressId === addr.id} onChange={() => selectSavedAddress(addr)} style={{ marginTop: '0.2rem' }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                            <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{addr.name}</span>
                            <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.52rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#ff3c1e', border: '1px solid #ff3c1e', padding: '0.12rem 0.4rem' }}>{addr.label}</span>
                            {addr.isDefault && <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.52rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#1aff9c' }}>Default</span>}
                          </div>
                          <p style={{ fontSize: '0.78rem', color: '#888', lineHeight: 1.5 }}>
                            {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}, {addr.city}, {addr.state} {addr.pincode}
                          </p>
                          <p style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.2rem' }}>Mobile: {addr.phone}</p>
                        </div>
                      </label>
                    ))}

                    <button
                      type="button"
                      onClick={startNewAddress}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1rem', cursor: 'pointer',
                        border: `1px dashed ${addingNewAddress ? '#ff3c1e' : 'rgba(245,242,237,0.2)'}`,
                        background: 'transparent', color: addingNewAddress ? '#ff3c1e' : '#888',
                        fontFamily: 'Space Mono, monospace', fontSize: '0.68rem', letterSpacing: '0.08em', textTransform: 'uppercase',
                      }}
                    >
                      + Deliver to a new address
                    </button>
                  </div>
                )}

                {/* Manual entry form — shown for new address entry, or when no saved addresses exist yet */}
                {(addingNewAddress || savedAddresses.length === 0) && (
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
                  {savedAddresses.length > 0 && (
                    <p style={{ fontSize: '0.7rem', color: '#666' }}>This address will be saved to your account for next time.</p>
                  )}
                </div>
                )}

                {addressError && <p style={{ color: '#ff3c1e', fontSize: '0.75rem', marginTop: '1rem' }}>{addressError}</p>}
              </div>
            </div>

            {/* Order summary sidebar */}
            <div style={{ position: 'sticky', top: '5.5rem' }}>
              <div style={{ background: '#1a1a1a', border: '1px solid rgba(245,242,237,0.07)', padding: '1.5rem' }}>
                <h2 style={{ fontFamily: 'Bebas Neue, serif', fontSize: '1.8rem', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>Order Summary</h2>

                {/* Coupon */}
                <div style={{ marginBottom: '1.2rem' }}>
                  {appliedCoupon ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.7rem 0.9rem', background: 'rgba(26,255,156,0.06)', border: '1px solid rgba(26,255,156,0.3)' }}>
                      <div>
                        <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.72rem', color: '#1aff9c' }}>✓ {appliedCoupon.code} applied</p>
                        <p style={{ fontSize: '0.68rem', color: '#888', marginTop: '0.1rem' }}>You saved ₹{appliedCoupon.discount}</p>
                      </div>
                      <button onClick={removeCoupon} style={{ background: 'none', border: 'none', color: '#888', fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer' }}>Remove</button>
                    </div>
                  ) : (
                    <>
                      <div style={{ display: 'flex', gap: 0 }}>
                        <input
                          type="text"
                          value={couponInput}
                          onChange={e => { setCouponInput(e.target.value.toUpperCase()); setCouponError(''); }}
                          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); applyCoupon(); } }}
                          placeholder="Coupon code (CHILL20)"
                          style={{ flex: 1, background: '#111', border: '1px solid rgba(245,242,237,0.1)', borderRight: 'none', color: '#f5f2ed', fontFamily: 'DM Sans, sans-serif', fontSize: '0.8rem', padding: '0.6rem 0.8rem', outline: 'none' }}
                        />
                        <button onClick={applyCoupon} disabled={couponChecking || !couponInput.trim()} style={{ background: 'transparent', border: '1px solid rgba(245,242,237,0.1)', color: couponChecking ? '#555' : '#888', fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0.6rem 0.9rem', cursor: couponChecking ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap' }}>
                          {couponChecking ? '...' : 'Apply'}
                        </button>
                      </div>
                      {couponError && <p style={{ fontSize: '0.7rem', color: '#ff3c1e', marginTop: '0.5rem' }}>{couponError}</p>}
                    </>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1.2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                    <span style={{ color: '#888' }}>Subtotal ({totalItems} item{totalItems !== 1 ? 's' : ''})</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                    <span style={{ color: '#888' }}>Shipping</span>
                    <span style={{ color: shipping === 0 ? '#1aff9c' : '#f5f2ed' }}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                  </div>
                  {discount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                      <span style={{ color: '#1aff9c' }}>Coupon Discount</span>
                      <span style={{ color: '#1aff9c' }}>−₹{discount}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                    <span style={{ color: '#888' }}>Taxes</span>
                    <span style={{ color: '#888' }}>Included</span>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid rgba(245,242,237,0.1)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.5rem' }}>
                  <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888' }}>Total</span>
                  <span style={{ fontFamily: 'Bebas Neue, serif', fontSize: '2.2rem', letterSpacing: '0.03em' }}>₹{total}</span>
                </div>

                {/* Payment method selector */}
                {codEnabled && (
                  <div style={{ marginBottom: '1.2rem' }}>
                    <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.58rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888', marginBottom: '0.6rem' }}>Payment Method</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', padding: '0.8rem 1rem', border: `1px solid ${paymentMethod === 'RAZORPAY' ? '#ff3c1e' : 'rgba(245,242,237,0.12)'}`, cursor: 'pointer', background: paymentMethod === 'RAZORPAY' ? 'rgba(255,60,30,0.06)' : 'transparent' }}>
                        <input type="radio" name="paymentMethod" checked={paymentMethod === 'RAZORPAY'} onChange={() => setPaymentMethod('RAZORPAY')} />
                        <div>
                          <p style={{ fontSize: '0.82rem' }}>Pay Online</p>
                          <p style={{ fontSize: '0.68rem', color: '#888' }}>UPI, Cards, Net Banking via Razorpay</p>
                        </div>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', padding: '0.8rem 1rem', border: `1px solid ${paymentMethod === 'COD' ? '#ff3c1e' : 'rgba(245,242,237,0.12)'}`, cursor: 'pointer', background: paymentMethod === 'COD' ? 'rgba(255,60,30,0.06)' : 'transparent' }}>
                        <input type="radio" name="paymentMethod" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} />
                        <div>
                          <p style={{ fontSize: '0.82rem' }}>Cash on Delivery</p>
                          <p style={{ fontSize: '0.68rem', color: '#888' }}>Pay when your order arrives</p>
                        </div>
                      </label>
                    </div>
                  </div>
                )}

                {/* Checkout button */}
                <button onClick={handleCheckout} disabled={processing} style={{ width: '100%', background: processing ? '#333' : paymentMethod === 'COD' ? '#ff3c1e' : '#072654', color: '#fff', fontFamily: 'Space Mono, monospace', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', border: 'none', padding: '1rem', cursor: processing ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'background 0.2s', marginBottom: '0.6rem' }}>
                  {processing ? 'Processing…' : status !== 'authenticated' ? 'Login to Checkout' : paymentMethod === 'COD' ? 'Place Order (COD)' : (
                    <>Pay with <span style={{ color: '#3395ff', fontWeight: 700, fontFamily: 'DM Sans, sans-serif' }}>Razorpay</span></>
                  )}
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
