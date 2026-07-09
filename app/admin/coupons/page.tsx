import { getCoupons } from '@/lib/coupons';
import CouponManager from '@/components/admin/CouponManager';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Coupons | ChillOver Admin' };

export default async function AdminCouponsPage() {
  const coupons = await getCoupons();
  const serialized = JSON.parse(JSON.stringify(coupons));

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <a href="/admin" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888', textDecoration: 'none' }}>← Dashboard</a>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', letterSpacing: '0.05em', textTransform: 'uppercase', lineHeight: 1, marginTop: '0.4rem' }}>
          Coupons
        </h1>
        <p style={{ color: '#888', fontSize: '0.875rem', marginTop: '0.3rem' }}>Create and manage discount codes for checkout.</p>
      </div>

      <CouponManager initialCoupons={serialized} />
    </div>
  );
}
