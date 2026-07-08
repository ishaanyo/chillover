'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
}

interface Order {
  id: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  items: OrderItem[];
  user: { name: string; email: string };
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: '#ff8c00', CONFIRMED: '#4af', SHIPPED: '#1aff9c', DELIVERED: '#1aff9c', CANCELLED: '#ff3c1e',
};

const STATUS_OPTIONS = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

export default function AdminOrderRow({ order }: { order: Order }) {
  const router = useRouter();
  const [status, setStatus] = useState(order.status);
  const [updating, setUpdating] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    setUpdating(true);
    const prev = status;
    setStatus(newStatus);

    const res = await fetch(`/api/orders/${order.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });

    if (!res.ok) {
      setStatus(prev);
      alert('Failed to update order status.');
    } else {
      router.refresh();
    }
    setUpdating(false);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', padding: '1.1rem 1.5rem', borderBottom: '1px solid rgba(245,242,237,0.06)', flexWrap: 'wrap' }}>
      <div style={{ minWidth: '160px' }}>
        <Link href={`/admin/orders/${order.id}`} style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.72rem', color: '#f5f2ed', textDecoration: 'none' }}>
          #{order.id.slice(-8).toUpperCase()}
        </Link>
        <p style={{ fontSize: '0.7rem', color: '#888', marginTop: '0.2rem' }}>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
      </div>

      <div style={{ flex: 1, minWidth: '160px' }}>
        <p style={{ fontSize: '0.85rem' }}>{order.user.name}</p>
        <p style={{ fontSize: '0.7rem', color: '#888' }}>{order.user.email}</p>
      </div>

      <p style={{ fontSize: '0.78rem', color: '#888', minWidth: '90px' }}>{order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>

      <p style={{ fontFamily: 'Bebas Neue, serif', fontSize: '1.2rem', minWidth: '80px' }}>₹{order.totalAmount}</p>

      <select
        value={status}
        onChange={e => handleStatusChange(e.target.value)}
        disabled={updating}
        style={{
          background: '#111', border: `1px solid ${STATUS_COLORS[status]}`, color: STATUS_COLORS[status],
          fontFamily: 'Space Mono, monospace', fontSize: '0.62rem', letterSpacing: '0.08em', textTransform: 'uppercase',
          padding: '0.45rem 0.7rem', cursor: updating ? 'not-allowed' : 'pointer', opacity: updating ? 0.6 : 1,
        }}
      >
        {STATUS_OPTIONS.map(s => <option key={s} value={s} style={{ background: '#111', color: '#f5f2ed' }}>{s}</option>)}
      </select>

      <Link href={`/admin/orders/${order.id}`} style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#888', textDecoration: 'none' }}>
        View →
      </Link>
    </div>
  );
}
