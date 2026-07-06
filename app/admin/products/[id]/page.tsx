import { notFound } from 'next/navigation';
import { getProductById } from '@/lib/products';
import ProductForm from '@/components/admin/ProductForm';
import type { Metadata } from 'next';

// 1. Disable caching so you always see the latest edits
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  // 2. Added 'await' here
  const product = await getProductById(id);
  return { title: product ? `Edit ${product.name} | ChillOver Admin` : 'Product Not Found' };
}

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // 3. Added 'await' here
  const product = await getProductById(id);
  
  if (!product) notFound();

  return (
    <div style={{ padding: '2rem', maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.4rem' }}>
          <a href="/admin/products" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888', textDecoration: 'none' }}>← Products</a>
          <span style={{ color: '#444' }}>·</span>
          <a href={`/product/${product.slug}`} target="_blank" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888', textDecoration: 'none' }}>View on Store ↗</a>
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', letterSpacing: '0.05em', textTransform: 'uppercase', lineHeight: 1 }}>Edit Product</h1>
        <p style={{ color: '#888', fontSize: '0.875rem', marginTop: '0.3rem' }}>{product.name} · {product.slug}</p>
      </div>
      <ProductForm mode="edit" productId={product.id} initialData={product} />
    </div>
  );
}