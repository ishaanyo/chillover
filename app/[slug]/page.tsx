import { notFound } from 'next/navigation';
import { getProductsByCategory } from '@/lib/products';
import { getSubcategoryWithProducts } from '@/lib/subcategories';
import ProductCard from '@/components/product/ProductCard';
import CategoryFilters from '@/components/product/CategoryFilters';
import type { Metadata } from 'next';

const MAIN_CATEGORIES = ['men', 'women', 'all'];

const CATEGORY_META: Record<string, { title: string; desc: string; heading: string; sub: string }> = {
  men:    { title: "Men's Oversized T-Shirts | ChillOver", desc: "Shop men's premium oversized t-shirts. Bold prints, 240 GSM cotton, boxy fits. Free shipping above ₹999.", heading: "Men's Collection", sub: "Boxy fits · Drop shoulder · S to 3XL" },
  women:  { title: "Women's Oversized T-Shirts | ChillOver", desc: "Shop women's premium oversized t-shirts. Drop-shoulder fits, bold graphics. Free shipping above ₹999.", heading: "Women's Collection", sub: "Drop shoulder · Relaxed fits · XS to 2XL" },
  all:    { title: "Shop All Oversized T-Shirts | ChillOver", desc: "Browse the full ChillOver collection of premium oversized printed t-shirts.", heading: "All Products", sub: "Every drop, every fit — in one place" },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const meta = CATEGORY_META[slug];
  if (meta) return { title: meta.title, description: meta.desc };

  const { subcategory } = await getSubcategoryWithProducts(slug);
  if (subcategory) {
    return { title: `${subcategory.name} | ChillOver` };
  }
  return { title: 'Not Found' };
}

export default async function SlugPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ filter?: string; sort?: string }>;
}) {
  const { slug } = await params;
  const { filter, sort } = await searchParams;

  const isMain = MAIN_CATEGORIES.includes(slug);

  let products;
  let heading: string;
  let sub: string;
  let mainCategoryForTabs: string | null = null;

  if (isMain) {
    products = await getProductsByCategory(slug === 'all' ? 'all' : slug);
    heading = CATEGORY_META[slug]?.heading ?? slug;
    sub = CATEGORY_META[slug]?.sub ?? '';
    mainCategoryForTabs = slug === 'all' ? null : slug;
  } else {
    // Try resolving as a subcategory
    const result = await getSubcategoryWithProducts(slug);
    if (!result.subcategory) notFound();

    products = result.products;
    heading = result.subcategory.name;
    sub = `${products.length} product${products.length !== 1 ? 's' : ''} · ${result.subcategory.mainCategory === 'men' ? "Men's" : "Women's"} Collection`;
    mainCategoryForTabs = result.subcategory.mainCategory;
  }

  // Apply filter
  if (filter === 'new')        products = products.filter(p => p.isNew);
  if (filter === 'bestseller') products = products.filter(p => p.isBestseller);
  if (filter === 'sale')       products = products.filter(p => p.price < (p.originalPrice ?? p.price));

  // Apply sort
  if (sort === 'price-asc')  products = [...products].sort((a, b) => a.price - b.price);
  if (sort === 'price-desc') products = [...products].sort((a, b) => b.price - a.price);
  if (sort === 'newest')     products = [...products].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const allCount   = (await getProductsByCategory('all')).length;
  const menCount   = (await getProductsByCategory('men')).length;
  const womenCount = (await getProductsByCategory('women')).length;

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a' }}>

      {/* Page header */}
      <div style={{ background: '#1a1a1a', padding: '2.5rem 2.5rem 2rem', borderBottom: '1px solid rgba(245,242,237,0.07)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

          {/* Breadcrumb */}
          <nav style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.58rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888', marginBottom: '0.9rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <a href="/" style={{ color: '#888', textDecoration: 'none' }}>Home</a>
            <span>›</span>
            {!isMain && mainCategoryForTabs && (
              <>
                <a href={`/${mainCategoryForTabs}`} style={{ color: '#888', textDecoration: 'none' }}>
                  {mainCategoryForTabs === 'men' ? 'Men' : 'Women'}
                </a>
                <span>›</span>
              </>
            )}
            <span style={{ color: '#ff3c1e' }}>{heading}</span>
          </nav>

          <h1 style={{ fontFamily: 'Bebas Neue, serif', fontSize: 'clamp(2.5rem,6vw,5rem)', letterSpacing: '0.03em', textTransform: 'uppercase', lineHeight: 1, marginBottom: '0.4rem' }}>
            {heading}
          </h1>
          <p style={{ color: '#888', fontSize: '0.875rem', fontWeight: 300 }}>{sub}</p>

          {/* Category tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
            {([['all', 'All', allCount], ['men', 'Men', menCount], ['women', 'Women', womenCount]] as const).map(([tabSlug, label, count]) => (
              <a
                key={tabSlug}
                href={`/${tabSlug}`}
                style={{
                  fontFamily: 'Space Mono, monospace', fontSize: '0.6rem',
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                  padding: '0.4rem 1rem', textDecoration: 'none',
                  background: slug === tabSlug ? '#ff3c1e' : 'transparent',
                  color: slug === tabSlug ? '#fff' : '#888',
                  border: `1px solid ${slug === tabSlug ? '#ff3c1e' : 'rgba(245,242,237,0.15)'}`,
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
          <CategoryFilters currentFilter={filter} currentSort={sort} category={slug} />
          <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.58rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888' }}>
            {products.length} Product{products.length !== 1 ? 's' : ''}
          </p>
        </div>

        {products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '6rem 0', color: '#888' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem', opacity: 0.2 }}>👕</div>
            <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>No products found</p>
            <a href={`/${slug}`} style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.62rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#ff3c1e', textDecoration: 'none' }}>
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
