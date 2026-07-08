import { auth } from '@/auth';
import { getOrdersByUserId } from '@/lib/orders';
import Link from 'next/link';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'My Account | ChillOver' };

const STATUS_COLORS: Record<string, string> = {
  PENDING: '#ff8c00', CONFIRMED: '#4af', SHIPPED: '#1aff9c', DELIVERED: '#1aff9c', CANCELLED: '#ff3c1e',
};

export default async function MyAccountOverview() {
  const session = await auth();
  const orders = await getOrdersByUserId(session!.user.id);
  const recentOrders = orders.slice(0, 3);

  return (
    <div>
      <h1 style={{ fontFamily: 'Bebas Neue, serif', fontSize: 'clamp(2rem,4vw,3rem)', letterSpacing: '0.03em', textTransform: 'uppercase', lineHeight: 1, marginBottom: '0.3rem' }}>
        Welcome, {session!.user.name?.split(' ')[0]}
      </h1>
      <p style={{ color: '#888', fontSize: '0.875rem', marginBottom: '2rem' }}>Manage your orders and account details.</p>

      {/* Quick links */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'My Orders', desc: 'View, modify and track orders', icon: '📦', href: '/myaccount/orders' },
          { label: 'My Wishlist', desc: 'Products you have saved', icon: '♡', href: '/wishlist' },
          { label: 'My Addresses', desc: 'Edit, add or remove addresses', icon: '📍', href: '/myaccount/addresses' },
          { label: 'My Profile', desc: 'Edit personal info', icon: '👤', href: '/myaccount/profile' },
          { label: 'Help & Support', desc: 'Reach out to us', icon: 'ⓘ', href: '/myaccount/help' },
        ].map(card => (
          <Link key={card.href} href={card.href} style={{ background: '#1a1a1a', border: '1px solid rgba(245,242,237,0.07)', padding: '1.5rem 1.2rem', textAlign: 'center', textDecoration: 'none', color: 'inherit', transition: 'border-color 0.2s' }}>
            <div style={{ fontSize: '1.8rem', marginBottom: '0.6rem' }}>{card.icon}</div>
            <p style={{ fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.3rem' }}>{card.label}</p>
            <p style={{ fontSize: '0.68rem', color: '#888' }}>{card.desc}</p>
          </Link>
        ))}
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ background: '#1a1a1a', border: '1px solid rgba(245,242,237,0.07)', padding: '1.3rem' }}>
          <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.58rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888', marginBottom: '0.4rem' }}>Total Orders</p>
          <p style={{ fontFamily: 'Bebas Neue, serif', fontSize: '2rem', color: '#ff3c1e' }}>{orders.length}</p>
        </div>
        <div style={{ background: '#1a1a1a', border: '1px solid rgba(245,242,237,0.07)', padding: '1.3rem' }}>
          <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.58rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888', marginBottom: '0.4rem' }}>In Transit</p>
          <p style={{ fontFamily: 'Bebas Neue, serif', fontSize: '2rem', color: '#4af' }}>{orders.filter(o => o.status === 'SHIPPED' || o.status === 'CONFIRMED').length}</p>
        </div>
        <div style={{ background: '#1a1a1a', border: '1px solid rgba(245,242,237,0.07)', padding: '1.3rem' }}>
          <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.58rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888', marginBottom: '0.4rem' }}>Delivered</p>
          <p style={{ fontFamily: 'Bebas Neue, serif', fontSize: '2rem', color: '#1aff9c' }}>{orders.filter(o => o.status === 'DELIVERED').length}</p>
        </div>
      </div>

      {/* Recent orders */}
      <div style={{ background: '#1a1a1a', border: '1px solid rgba(245,242,237,0.07)' }}>
        <div style={{ padding: '1.2rem 1.5rem', borderBottom: '1px solid rgba(245,242,237,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontFamily: 'Bebas Neue, serif', fontSize: '1.4rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Recent Orders</h2>
          {orders.length > 0 && (
            <Link href="/myaccount/orders" style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#ff3c1e', textDecoration: 'none' }}>View All →</Link>
          )}
        </div>

        {recentOrders.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center' }}>
            <p style={{ color: '#888', marginBottom: '1.2rem' }}>You haven't placed any orders yet.</p>
            <Link href="/all" style={{ background: '#ff3c1e', color: '#fff', fontFamily: 'Space Mono, monospace', fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.8rem 1.8rem', textDecoration: 'none', display: 'inline-block' }}>
              Start Shopping
            </Link>
          </div>
        ) : (
          <div>
            {recentOrders.map(order => (
              <Link key={order.id} href={`/myaccount/orders/${order.id}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', borderBottom: '1px solid rgba(245,242,237,0.05)', textDecoration: 'none', color: 'inherit' }}>
                <div>
                  <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.7rem', color: '#f5f2ed' }}>#{order.id.slice(-8).toUpperCase()}</p>
                  <p style={{ fontSize: '0.72rem', color: '#888', marginTop: '0.2rem' }}>{order.items.length} item{order.items.length !== 1 ? 's' : ''} · {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: STATUS_COLORS[order.status] }}>{order.status}</span>
                  <span style={{ fontFamily: 'Bebas Neue, serif', fontSize: '1.2rem' }}>₹{order.totalAmount}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
