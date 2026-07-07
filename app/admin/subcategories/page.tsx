import { getSubcategories } from '@/lib/subcategories';
import SubcategoryManager from '@/components/admin/SubcategoryManager';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Subcategories | ChillOver Admin' };

export default async function SubcategoriesPage() {
  const subcategories = await getSubcategories();
  const serialized = JSON.parse(JSON.stringify(subcategories));

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <a href="/admin" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888', textDecoration: 'none' }}>← Dashboard</a>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', letterSpacing: '0.05em', textTransform: 'uppercase', lineHeight: 1, marginTop: '0.4rem' }}>
          Subcategories
        </h1>
        <p style={{ color: '#888', fontSize: '0.875rem', marginTop: '0.3rem' }}>
          Create subcategories under Men or Women. Each gets its own URL: root-domain/&lt;subcategory-slug&gt;
        </p>
      </div>

      <SubcategoryManager initialSubcategories={serialized} />
    </div>
  );
}
