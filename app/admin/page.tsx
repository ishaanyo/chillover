import Link from 'next/link';
import { getProducts } from '@/lib/products';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Admin Dashboard | ChillOver' };

// 1. Added 'async' here
export default async function AdminPage() {
  // 2. Added 'await' here
  const products = await getProducts();
  
  const totalValue = products.reduce((s, p) => s + p.price, 0);
  const menCount = products.filter(p => p.category === 'men').length;
  const womenCount = products.filter(p => p.category === 'women').length;
  const newCount = products.filter(p => p.isNew).length;
  const totalStock = products.reduce((s, p) => s + p.variants.reduce((vs, v) => vs + v.stock, 0), 0);

  return (
    <div style={{ padding: '2rem', maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>Dashboard</h1>
        <p style={{ color: '#888', fontSize: '0.875rem' }}>Manage your ChillOver store</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
        {[
          { label: 'Total Products', value: products.length, icon: '👕', color: '#ff3c1e' },
          { label: 'Men\'s Items', value: menCount, icon: '👔', color: '#4af' },
          { label: 'Women\'s Items', value: womenCount, icon: '🌸', color: '#f8a' },
          { label: 'New Arrivals', value: newCount, icon: '⚡', color: '#1aff9c' },
          { label: 'Total Stock', value: totalStock, icon: '📦', color: '#ff8c00' },
        ].map(stat => (
          <div key={stat.label} style={{ background: '#1a1a1a', border: '1px solid rgba(245,242,237,0.07)', padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#888', marginBottom: '0.5rem' }}>{stat.label}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', letterSpacing: '0.03em', color: stat.color }}>{stat.value}</div>
            <div style={{ position: 'absolute', top: '1rem', right: '1rem', fontSize: '1.8rem', opacity: 0.2 }}>{stat.icon}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
        <Link href="/admin/products/new" style={{ background: '#ff3c1e', color: '#fff', fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '0.8rem 1.8rem', textDecoration: 'none', border: 'none', display: 'inline-block' }}>
          + Add New Product
        </Link>
        <Link href="/admin/products" style={{ background: 'transparent', color: '#e8e2d9', fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '0.8rem 1.8rem', textDecoration: 'none', border: '1px solid rgba(245,242,237,0.2)', display: 'inline-block' }}>
          Manage Products
        </Link>
        <Link href="/admin/subcategories" style={{ background: 'transparent', color: '#e8e2d9', fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '0.8rem 1.8rem', textDecoration: 'none', border: '1px solid rgba(245,242,237,0.2)', display: 'inline-block' }}>
          Manage Subcategories
        </Link>
        <Link href="/" target="_blank" style={{ background: 'transparent', color: '#888', fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '0.8rem 1.8rem', textDecoration: 'none', border: '1px solid rgba(245,242,237,0.1)', display: 'inline-block' }}>
          View Store ↗
        </Link>
      </div>

      {/* Recent products */}
      <div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '1rem' }}>Recent Products</h2>
        <div style={{ background: '#1a1a1a', border: '1px solid rgba(245,242,237,0.07)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }} className="admin-table">
            <thead>
              <tr>
                {['Product', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map(h => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.slice(0, 6).map(p => {
                const stock = p.variants.reduce((s, v) => s + v.stock, 0);
                return (
                  <tr key={p.id}>
                    <td>
                      <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>{p.name}</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.08em', color: '#888', marginTop: '0.2rem' }}>{p.slug}</div>
                    </td>
                    <td><span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888' }}>{p.category}</span></td>
                    <td><span style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: '#f5f2ed' }}>₹{p.price}</span></td>
                    <td><span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: stock < 10 ? '#ff8c00' : '#1aff9c' }}>{stock} units</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                        {p.isNew && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.52rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#1aff9c', border: '1px solid rgba(26,255,156,0.3)', padding: '0.1rem 0.4rem' }}>New</span>}
                        {p.isBestseller && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.52rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#ff3c1e', border: '1px solid rgba(255,60,30,0.3)', padding: '0.1rem 0.4rem' }}>Best</span>}
                        {p.isFeatured && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.52rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#4af', border: '1px solid rgba(68,170,255,0.3)', padding: '0.1rem 0.4rem' }}>Featured</span>}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Link href={`/admin/products/${p.id}`} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#ff3c1e', textDecoration: 'none' }}>Edit</Link>
                        <Link href={`/product/${p.slug}`} target="_blank" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#888', textDecoration: 'none' }}>View ↗</Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: '1rem', textAlign: 'right' }}>
          <Link href="/admin/products" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#ff3c1e', textDecoration: 'none' }}>View All Products →</Link>
        </div>
      </div>
    </div>
  );
}