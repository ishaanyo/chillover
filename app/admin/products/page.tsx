import Link from 'next/link';
import { getProducts } from '@/lib/products';
import AdminProductActions from '@/components/admin/AdminProductActions';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Products | ChillOver Admin' };

export default function AdminProductsPage() {
  const products = getProducts();

  return (
    <div style={{ padding: '2rem', maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', letterSpacing: '0.05em', textTransform: 'uppercase', lineHeight: 1 }}>Products</h1>
          <p style={{ color: '#888', fontSize: '0.875rem', marginTop: '0.3rem' }}>{products.length} total products</p>
        </div>
        <Link href="/admin/products/new" style={{ background: '#ff3c1e', color: '#fff', fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '0.8rem 1.8rem', textDecoration: 'none' }}>
          + Add Product
        </Link>
      </div>

      <div style={{ background: '#1a1a1a', border: '1px solid rgba(245,242,237,0.07)', overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }} className="admin-table">
          <thead>
            <tr>
              {['Image', 'Product', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map(h => <th key={h}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {products.map(p => {
              const stock = p.variants.reduce((s, v) => s + v.stock, 0);
              const hasImage = p.images?.[0] && !p.images[0].url.includes('placeholder');
              const emojis: Record<string,string> = {'1':'🎵','2':'❄️','3':'🌙','4':'🌅','5':'🎨','6':'⚡','7':'🌸','8':'🦉'};
              return (
                <tr key={p.id}>
                  <td>
                    <div style={{ width: '52px', height: '64px', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', flexShrink: 0, overflow: 'hidden' }}>
                      {hasImage ? <img src={p.images[0].url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (emojis[p.id] ?? '👕')}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 500, marginBottom: '0.2rem' }}>{p.name}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.08em', color: '#666' }}>{p.slug}</div>
                  </td>
                  <td><span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888' }}>{p.category}</span></td>
                  <td>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: '#f5f2ed' }}>₹{p.price}</div>
                    <div style={{ fontSize: '0.7rem', color: '#666', textDecoration: 'line-through' }}>₹{p.originalPrice}</div>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: stock === 0 ? '#ff3c1e' : stock < 10 ? '#ff8c00' : '#1aff9c' }}>
                      {stock === 0 ? 'Out of Stock' : `${stock} units`}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                      {p.isNew && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#1aff9c', border: '1px solid rgba(26,255,156,0.3)', padding: '0.15rem 0.4rem' }}>New</span>}
                      {p.isBestseller && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#ff3c1e', border: '1px solid rgba(255,60,30,0.3)', padding: '0.15rem 0.4rem' }}>Best</span>}
                      {p.isFeatured && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#4af', border: '1px solid rgba(68,170,255,0.3)', padding: '0.15rem 0.4rem' }}>Featured</span>}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                      <Link href={`/admin/products/${p.id}`} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#ff3c1e', textDecoration: 'none' }}>Edit</Link>
                      <Link href={`/shop/${p.category}/${p.slug}`} target="_blank" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#888', textDecoration: 'none' }}>View ↗</Link>
                      <AdminProductActions productId={p.id} productName={p.name} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
