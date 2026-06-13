import { notFound } from 'next/navigation';
import { getProductsByCategory } from '@/lib/products';
import ProductCard from '@/components/product/ProductCard';
import CategoryFilters from '@/components/product/CategoryFilters';
import type { Metadata } from 'next';

const CATEGORY_META: Record<string, { title: string; desc: string; heading: string; sub: string }> = {
  men:    { title: "Men's Oversized T-Shirts | ChillOver", desc: "Shop men's premium oversized t-shirts. Bold prints, 240 GSM cotton, boxy fits. Free shipping above ₹999.", heading: "Men's Collection", sub: "Boxy fits · Drop shoulder · S to 3XL" },
  women:  { title: "Women's Oversized T-Shirts | ChillOver", desc: "Shop women's premium oversized t-shirts. Drop-shoulder fits, bold graphics. Free shipping above ₹999.", heading: "Women's Collection", sub: "Drop shoulder · Relaxed fits · XS to 2XL" },
  all:    { title: "Shop All Oversized T-Shirts | ChillOver", desc: "Browse the full ChillOver collection of premium oversized printed t-shirts.", heading: "All Products", sub: "Every drop, every fit — in one place" },
};

const VALID = ['men', 'women', 'all'];

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const meta = CATEGORY_META[category];
  if (!meta) return { title: 'Not Found' };
  return { title: meta.title, description: meta.desc };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ filter?: string; sort?: string }>;
}) {
  const { category } = await params;
  const { filter, sort } = await searchParams;

  if (!VALID.includes(category)) notFound();

  const meta = CATEGORY_META[category];

  // 1. Added 'await' to the main product fetch
  let products = await getProductsByCategory(category === 'all' ? 'all' : category);

  // Apply filter
  if (filter === 'new')        products = products.filter(p => p.isNew);
  if (filter === 'bestseller') products = products.filter(p => p.isBestseller);
  if (filter === 'sale')       products = products.filter(p => p.price < p.originalPrice);

  // Apply sort
  if (sort === 'price-asc')  products = [...products].sort((a, b) => a.price - b.price);
  if (sort === 'price-desc') products = [...products].sort((a, b) => b.price - a.price);
  if (sort === 'newest')     products = [...products].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // 2. Added 'await' to all three tab counters
  const allCount   = (await getProductsByCategory('all')).length;
  const menCount   = (await getProductsByCategory('men')).length;
  const womenCount = (await getProductsByCategory('women')).length;

  return (
    <div style={{ paddingTop: '5rem', minHeight: '100vh', background: '#0a0a0a' }}>

      {/* Page header */}
      <div style={{ background: '#1a1a1a', padding: '2.5rem 2.5rem 2rem', borderBottom: '1px solid rgba(245,242,237,0.07)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

          {/* Breadcrumb */}
          <nav style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.58rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888', marginBottom: '0.9rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <a href="/" style={{ color: '#888', textDecoration: 'none' }}>Home</a>
            <span>›</span>
            <span style={{ color: '#ff3c1e' }}>{meta.heading}</span>
          </nav>

          <h1 style={{ fontFamily: 'Bebas Neue, serif', fontSize: 'clamp(2.5rem,6vw,5rem)', letterSpacing: '0.03em', textTransform: 'uppercase', lineHeight: 1, marginBottom: '0.4rem' }}>
            {meta.heading}
          </h1>
          <p style={{ color: '#888', fontSize: '0.875rem', fontWeight: 300 }}>{meta.sub}</p>

          {/* Category tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
            {([['all', 'All', allCount], ['men', 'Men', menCount], ['women', 'Women', womenCount]] as const).map(([slug, label, count]) => (
              <a
                key={slug}
                href={`/shop/${slug}`}
                style={{
                  fontFamily: 'Space Mono, monospace', fontSize: '0.6rem',
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                  padding: '0.4rem 1rem', textDecoration: 'none',
                  background: category === slug ? '#ff3c1e' : 'transparent',
                  color: category === slug ? '#fff' : '#888',
                  border: `1px solid ${category === slug ? '#ff3c1e' : 'rgba(245,242,237,0.15)'}`,
                  transition: 'all 0.2s',
                }}
              >
                {label} ({count})
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Filters + Grid */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
          <CategoryFilters currentFilter={filter} currentSort={sort} category={category} />
          <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.58rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888' }}>
            {products.length} Product{products.length !== 1 ? 's' : ''}
          </p>
        </div>

        {products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '6rem 0', color: '#888' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem', opacity: 0.2 }}>👕</div>
            <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>No products found</p>
            <a href={`/shop/${category}`} style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.62rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#ff3c1e', textDecoration: 'none' }}>
              Clear Filters →
            </a>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
            {products.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 600px) {
          div[style*="padding: 2rem 2.5rem"] { padding: 1.5rem 1rem !important; }
          div[style*="padding: 2.5rem 2.5rem"] { padding: 1.5rem 1rem 1rem !important; }
        }
      `}</style>
    </div>
  );
}