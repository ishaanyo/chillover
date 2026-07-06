import { notFound } from 'next/navigation';
import { getProductBySlug, getProductsByCategory } from '@/lib/products';
import ProductPageClient from '@/components/product/ProductPageClient';
import ProductCard from '@/components/product/ProductCard';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: 'Not Found' };
  return {
    title: `${product.name} — Oversized T-Shirt | ChillOver`,
    description: product.shortDesc,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const serialized = JSON.parse(JSON.stringify(product));

  const relatedProducts = await getProductsByCategory(product.category);
  const related = relatedProducts
    .filter(p => p.id !== product.id)
    .slice(0, 4)
    .map(p => JSON.parse(JSON.stringify(p)));

  return (
    <>
      <ProductPageClient product={serialized} />

      {related.length > 0 && (
        <div style={{ background: '#0a0a0a', paddingBottom: '5rem' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2.5rem 3rem', borderTop: '1px solid rgba(245,242,237,0.07)', paddingTop: '3rem' }}>
            <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#ff3c1e', marginBottom: '0.4rem' }}>
              You Might Also Like
            </p>
            <h2 style={{ fontFamily: 'Bebas Neue, serif', fontSize: 'clamp(2rem,4vw,3rem)', letterSpacing: '0.03em', textTransform: 'uppercase', marginBottom: '2rem', lineHeight: 1 }}>
              Related Products
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '1.5rem' }}>
              {related.map((p: any) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
