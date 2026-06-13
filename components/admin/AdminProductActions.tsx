'use client';
import { useRouter } from 'next/navigation';

export default function AdminProductActions({ productId, productName }: { productId: string; productName: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`Delete "${productName}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/products/${productId}`, { method: 'DELETE' });
    if (res.ok) { router.refresh(); }
    else { alert('Failed to delete product.'); }
  };

  return (
    <button onClick={handleDelete} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#888', background: 'none', border: 'none', cursor: 'pointer', padding: 0, transition: 'color 0.2s' }}
      onMouseOver={e => (e.currentTarget.style.color = '#ff3c1e')}
      onMouseOut={e => (e.currentTarget.style.color = '#888')}>
      Delete
    </button>
  );
}
