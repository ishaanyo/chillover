import { auth } from '@/auth';
import { getOrderById } from '@/lib/orders';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Order Details | ChillOver' };

const STATUS_COLORS: Record<string, string> = {
  PENDING: '#ff8c00', CONFIRMED: '#4af', SHIPPED: '#1aff9c', DELIVERED: '#1aff9c', CANCELLED: '#ff3c1e',
};

const STATUS_STEPS = ['CONFIRMED', 'SHIPPED', 'DELIVERED'];

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  const order = await getOrderById(id);

  if (!order) notFound();
  if (order.userId !== session!.user.id) redirect('/myaccount/orders');

  const stepIndex = STATUS_STEPS.indexOf(order.status);

  return (
    <div>
      <Link href="/myaccount/orders" style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888', textDecoration: 'none' }}>← My Orders</Link>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', margin: '0.8rem 0 1.5rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Bebas Neue, serif', fontSize: 'clamp(1.8rem,4vw,2.6rem)', letterSpacing: '0.03em', textTransform: 'uppercase', lineHeight: 1 }}>
            Order #{order.id.slice(-8).toUpperCase()}
          </h1>
          <p style={{ color: '#888', fontSize: '0.8rem', marginTop: '0.3rem' }}>Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
        <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.65rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: STATUS_COLORS[order.status], border: `1px solid ${STATUS_COLORS[order.status]}`, padding: '0.4rem 0.9rem' }}>
          {order.status}
        </span>
      </div>

      {/* Progress tracker (hidden for cancelled orders) */}
      {order.status !== 'CANCELLED' && (
        <div style={{ background: '#1a1a1a', border: '1px solid rgba(245,242,237,0.07)', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {STATUS_STEPS.map((step, i) => (
              <div key={step} style={{ display: 'flex', alignItems: 'center', flex: i < STATUS_STEPS.length - 1 ? 1 : 'unset' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: i <= stepIndex ? '#ff3c1e' : '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', flexShrink: 0 }}>
                    {i <= stepIndex ? '✓' : ''}
                  </div>
                  <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.55rem', letterSpacing: '0.06em', textTransform: 'uppercase', color: i <= stepIndex ? '#f5f2ed' : '#666', whiteSpace: 'nowrap' }}>{step}</span>
                </div>
                {i < STATUS_STEPS.length - 1 && (
                  <div style={{ flex: 1, height: '2px', background: i < stepIndex ? '#ff3c1e' : '#333', margin: '0 0.5rem', marginBottom: '1.2rem' }} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.5rem', alignItems: 'flex-start' }}>
        {/* Items */}
        <div style={{ background: '#1a1a1a', border: '1px solid rgba(245,242,237,0.07)' }}>
          <div style={{ padding: '1.2rem 1.5rem', borderBottom: '1px solid rgba(245,242,237,0.07)' }}>
            <h2 style={{ fontFamily: 'Bebas Neue, serif', fontSize: '1.3rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Items ({order.items.length})</h2>
          </div>
          {order.items.map(item => (
            <div key={item.id} style={{ display: 'flex', gap: '1rem', padding: '1.2rem 1.5rem', borderBottom: '1px solid rgba(245,242,237,0.05)' }}>
              <div style={{ width: '64px', height: '82px', background: '#111', overflow: 'hidden', flexShrink: 0 }}>
                {item.productImage ? (
                  <img src={item.productImage} alt={item.productName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem' }}>👕</div>
                )}
              </div>
              <div style={{ flex: 1 }}>
                {item.productSlug ? (
                  <Link href={`/product/${item.productSlug}`} style={{ fontSize: '0.9rem', color: '#f5f2ed', textDecoration: 'none' }}>{item.productName}</Link>
                ) : (
                  <p style={{ fontSize: '0.9rem' }}>{item.productName}</p>
                )}
                <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.65rem', color: '#888', marginTop: '0.4rem' }}>Size: {item.size} · Qty: {item.quantity}</p>
              </div>
              <p style={{ fontFamily: 'Bebas Neue, serif', fontSize: '1.2rem', color: '#ff3c1e', flexShrink: 0 }}>₹{item.price * item.quantity}</p>
            </div>
          ))}
        </div>

        {/* Summary + Shipping */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ background: '#1a1a1a', border: '1px solid rgba(245,242,237,0.07)', padding: '1.5rem' }}>
            <h2 style={{ fontFamily: 'Bebas Neue, serif', fontSize: '1.3rem', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '1rem' }}>Summary</h2>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#888', marginBottom: '0.5rem' }}>
              <span>Subtotal</span><span>₹{order.subtotal}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#888', marginBottom: '0.8rem' }}>
              <span>Shipping</span><span>{order.shippingFee === 0 ? 'FREE' : `₹${order.shippingFee}`}</span>
            </div>
            <div style={{ borderTop: '1px solid rgba(245,242,237,0.1)', paddingTop: '0.8rem', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888' }}>Total</span>
              <span style={{ fontFamily: 'Bebas Neue, serif', fontSize: '1.5rem' }}>₹{order.totalAmount}</span>
            </div>
            <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.62rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#888', marginTop: '0.8rem' }}>
              {order.paymentMethod === 'COD' ? '💵 Cash on Delivery' : '💳 Paid Online'}
            </p>
          </div>

          <div style={{ background: '#1a1a1a', border: '1px solid rgba(245,242,237,0.07)', padding: '1.5rem' }}>
            <h2 style={{ fontFamily: 'Bebas Neue, serif', fontSize: '1.3rem', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '1rem' }}>Shipping Address</h2>
            <p style={{ fontSize: '0.85rem', lineHeight: 1.7, color: '#e8e2d9' }}>
              {order.shippingName}<br />
              {order.shippingLine1}{order.shippingLine2 ? `, ${order.shippingLine2}` : ''}<br />
              {order.shippingCity}, {order.shippingState} {order.shippingPincode}<br />
              📞 {order.shippingPhone}
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 700px) {
          div[style*="grid-template-columns: 1fr 320px"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
