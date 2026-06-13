import ProductForm from '@/components/admin/ProductForm';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Add Product | ChillOver Admin' };

export default function NewProductPage() {
  return (
    <div style={{ padding: '2rem', maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.4rem' }}>
          <a href="/admin/products" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888', textDecoration: 'none' }}>← Products</a>
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', letterSpacing: '0.05em', textTransform: 'uppercase', lineHeight: 1 }}>Add New Product</h1>
        <p style={{ color: '#888', fontSize: '0.875rem', marginTop: '0.3rem' }}>Fill in the details below to create a new product listing.</p>
      </div>
      <ProductForm mode="create" />
    </div>
  );
}
