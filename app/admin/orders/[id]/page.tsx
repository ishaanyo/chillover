import { getOrderById } from '@/lib/orders';
import { notFound } from 'next/navigation';
import AdminOrderStatusControl from '@/components/admin/AdminOrderStatusControl';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Order Details | ChillOver Admin' };

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrderById(id);
  if (!order) notFound();

  const serialized = JSON.parse(JSON.stringify(order));

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <a href="/admin/orders" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888', textDecoration: 'none' }}>← Orders</a>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', margin: '0.6rem 0 2rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', letterSpacing: '0.05em', textTransform: 'uppercase', lineHeight: 1 }}>
            Order #{serialized.id.slice(-8).toUpperCase()}
          </h1>
          <p style={{ color: '#888', fontSize: '0.8rem', marginTop: '0.3rem' }}>
            Placed on {new Date(serialized.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </p>
          {serialized.paymentId && (
            <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.68rem', color: '#666', marginTop: '0.3rem' }}>Payment ID: {serialized.paymentId}</p>
          )}
        </div>
        <AdminOrderStatusControl orderId={serialized.id} currentStatus={serialized.status} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.5rem', alignItems: 'flex-start' }}>
        {/* Items */}
        <div style={{ background: '#1a1a1a', border: '1px solid rgba(245,242,237,0.07)' }}>
          <div style={{ padding: '1.2rem 1.5rem', borderBottom: '1px solid rgba(245,242,237,0.07)' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Items ({serialized.items.length})</h2>
          </div>
          {serialized.items.map((item: any) => (
            <div key={item.id} style={{ display: 'flex', gap: '1rem', padding: '1.2rem 1.5rem', borderBottom: '1px solid rgba(245,242,237,0.05)' }}>
              <div style={{ width: '64px', height: '82px', background: '#111', overflow: 'hidden', flexShrink: 0 }}>
                {item.productImage ? (
                  <img src={item.productImage} alt={item.productName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem' }}>👕</div>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '0.9rem' }}>{item.productName}</p>
                <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.65rem', color: '#888', marginTop: '0.4rem' }}>Size: {item.size} · Qty: {item.quantity}</p>
              </div>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: '#ff3c1e', flexShrink: 0 }}>₹{item.price * item.quantity}</p>
            </div>
          ))}
        </div>

        {/* Customer + shipping + summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ background: '#1a1a1a', border: '1px solid rgba(245,242,237,0.07)', padding: '1.5rem' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '1rem' }}>Customer</h2>
            <p style={{ fontSize: '0.85rem' }}>{serialized.user.name}</p>
            <p style={{ fontSize: '0.78rem', color: '#888', marginTop: '0.2rem' }}>{serialized.user.email}</p>
          </div>

          <div style={{ background: '#1a1a1a', border: '1px solid rgba(245,242,237,0.07)', padding: '1.5rem' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '1rem' }}>Shipping Address</h2>
            <p style={{ fontSize: '0.85rem', lineHeight: 1.7, color: '#e8e2d9' }}>
              {serialized.shippingName}<br />
              {serialized.shippingLine1}{serialized.shippingLine2 ? `, ${serialized.shippingLine2}` : ''}<br />
              {serialized.shippingCity}, {serialized.shippingState} {serialized.shippingPincode}<br />
              📞 {serialized.shippingPhone}
            </p>
          </div>

          <div style={{ background: '#1a1a1a', border: '1px solid rgba(245,242,237,0.07)', padding: '1.5rem' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '1rem' }}>Summary</h2>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#888', marginBottom: '0.5rem' }}>
              <span>Subtotal</span><span>₹{serialized.subtotal}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#888', marginBottom: '0.8rem' }}>
              <span>Shipping</span><span>{serialized.shippingFee === 0 ? 'FREE' : `₹${serialized.shippingFee}`}</span>
            </div>
            <div style={{ borderTop: '1px solid rgba(245,242,237,0.1)', paddingTop: '0.8rem', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888' }}>Total</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem' }}>₹{serialized.totalAmount}</span>
            </div>
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
