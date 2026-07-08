import { auth } from '@/auth';
import { getOrdersByUserId } from '@/lib/orders';
import Link from 'next/link';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'My Orders | ChillOver' };

const STATUS_COLORS: Record<string, string> = {
  PENDING: '#ff8c00', CONFIRMED: '#4af', SHIPPED: '#1aff9c', DELIVERED: '#1aff9c', CANCELLED: '#ff3c1e',
};

export default async function MyOrdersPage() {
  const session = await auth();
  const orders = await getOrdersByUserId(session!.user.id);

  return (
    <div>
      <h1 style={{ fontFamily: 'Bebas Neue, serif', fontSize: 'clamp(2rem,4vw,3rem)', letterSpacing: '0.03em', textTransform: 'uppercase', lineHeight: 1, marginBottom: '0.3rem' }}>
        My Orders
      </h1>
      <p style={{ color: '#888', fontSize: '0.875rem', marginBottom: '2rem' }}>{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>

      {orders.length === 0 ? (
        <div style={{ background: '#1a1a1a', border: '1px solid rgba(245,242,237,0.07)', padding: '4rem 2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem', opacity: 0.2 }}>📦</div>
          <p style={{ color: '#888', marginBottom: '1.5rem' }}>You haven't placed any orders yet.</p>
          <Link href="/all" style={{ background: '#ff3c1e', color: '#fff', fontFamily: 'Space Mono, monospace', fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.9rem 2rem', textDecoration: 'none', display: 'inline-block' }}>
            Start Shopping
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {orders.map(order => (
            <Link key={order.id} href={`/myaccount/orders/${order.id}`} style={{ display: 'block', background: '#1a1a1a', border: '1px solid rgba(245,242,237,0.07)', padding: '1.3rem 1.5rem', textDecoration: 'none', color: 'inherit' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.8rem', marginBottom: '1rem' }}>
                <div>
                  <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.75rem', color: '#f5f2ed', marginBottom: '0.3rem' }}>Order #{order.id.slice(-8).toUpperCase()}</p>
                  <p style={{ fontSize: '0.72rem', color: '#888' }}>Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ display: 'inline-block', fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: STATUS_COLORS[order.status], border: `1px solid ${STATUS_COLORS[order.status]}`, padding: '0.3rem 0.7rem', marginBottom: '0.4rem' }}>
                    {order.status}
                  </span>
                  <p style={{ fontFamily: 'Bebas Neue, serif', fontSize: '1.4rem' }}>₹{order.totalAmount}</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                {order.items.slice(0, 4).map(item => (
                  <div key={item.id} style={{ width: '50px', height: '64px', background: '#111', overflow: 'hidden', flexShrink: 0 }}>
                    {item.productImage ? (
                      <img src={item.productImage} alt={item.productName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>👕</div>
                    )}
                  </div>
                ))}
                {order.items.length > 4 && (
                  <div style={{ width: '50px', height: '64px', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Space Mono, monospace', fontSize: '0.7rem', color: '#888' }}>
                    +{order.items.length - 4}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
