import { getAllOrders } from '@/lib/orders';
import AdminOrderRow from '@/components/admin/AdminOrderRow';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Orders | ChillOver Admin' };

const STATUS_FILTERS = ['ALL', 'PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const allOrders = await getAllOrders();
  const serialized = JSON.parse(JSON.stringify(allOrders));

  const filtered = status && status !== 'ALL'
    ? serialized.filter((o: any) => o.status === status)
    : serialized;

  const counts: Record<string, number> = { ALL: serialized.length };
  for (const s of STATUS_FILTERS.slice(1)) {
    counts[s] = serialized.filter((o: any) => o.status === s).length;
  }

  const totalRevenue = serialized
    .filter((o: any) => o.status !== 'CANCELLED')
    .reduce((sum: number, o: any) => sum + o.totalAmount, 0);

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <a href="/admin" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888', textDecoration: 'none' }}>← Dashboard</a>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', letterSpacing: '0.05em', textTransform: 'uppercase', lineHeight: 1, marginTop: '0.4rem' }}>
          Orders
        </h1>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ background: '#1a1a1a', border: '1px solid rgba(245,242,237,0.07)', padding: '1.3rem' }}>
          <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.58rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888', marginBottom: '0.4rem' }}>Total Orders</p>
          <p style={{ fontFamily: 'Bebas Neue, serif', fontSize: '2rem' }}>{counts.ALL}</p>
        </div>
        <div style={{ background: '#1a1a1a', border: '1px solid rgba(245,242,237,0.07)', padding: '1.3rem' }}>
          <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.58rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888', marginBottom: '0.4rem' }}>Pending</p>
          <p style={{ fontFamily: 'Bebas Neue, serif', fontSize: '2rem', color: '#ff8c00' }}>{counts.PENDING}</p>
        </div>
        <div style={{ background: '#1a1a1a', border: '1px solid rgba(245,242,237,0.07)', padding: '1.3rem' }}>
          <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.58rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888', marginBottom: '0.4rem' }}>Delivered</p>
          <p style={{ fontFamily: 'Bebas Neue, serif', fontSize: '2rem', color: '#1aff9c' }}>{counts.DELIVERED}</p>
        </div>
        <div style={{ background: '#1a1a1a', border: '1px solid rgba(245,242,237,0.07)', padding: '1.3rem' }}>
          <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.58rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888', marginBottom: '0.4rem' }}>Revenue</p>
          <p style={{ fontFamily: 'Bebas Neue, serif', fontSize: '2rem', color: '#ff3c1e' }}>₹{totalRevenue}</p>
        </div>
      </div>

      {/* Status filter tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {STATUS_FILTERS.map(s => (
          <a
            key={s}
            href={s === 'ALL' ? '/admin/orders' : `/admin/orders?status=${s}`}
            style={{
              fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase',
              padding: '0.4rem 1rem', textDecoration: 'none',
              background: (status ?? 'ALL') === s ? '#ff3c1e' : 'transparent',
              color: (status ?? 'ALL') === s ? '#fff' : '#888',
              border: `1px solid ${(status ?? 'ALL') === s ? '#ff3c1e' : 'rgba(245,242,237,0.15)'}`,
            }}
          >
            {s} ({counts[s]})
          </a>
        ))}
      </div>

      {/* Orders table */}
      {filtered.length === 0 ? (
        <div style={{ background: '#1a1a1a', border: '1px solid rgba(245,242,237,0.07)', padding: '4rem', textAlign: 'center', color: '#888' }}>
          No orders found.
        </div>
      ) : (
        <div style={{ background: '#1a1a1a', border: '1px solid rgba(245,242,237,0.07)' }}>
          {filtered.map((order: any) => (
            <AdminOrderRow key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
