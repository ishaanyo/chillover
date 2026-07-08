'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const STATUS_COLORS: Record<string, string> = {
  PENDING: '#ff8c00', CONFIRMED: '#4af', SHIPPED: '#1aff9c', DELIVERED: '#1aff9c', CANCELLED: '#ff3c1e',
};
const STATUS_OPTIONS = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

export default function AdminOrderStatusControl({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [updating, setUpdating] = useState(false);

  const handleChange = async (newStatus: string) => {
    setUpdating(true);
    const prev = status;
    setStatus(newStatus);

    const res = await fetch(`/api/orders/${orderId}`, {
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
    <div style={{ textAlign: 'right' }}>
      <label style={{ display: 'block', fontFamily: 'Space Mono, monospace', fontSize: '0.58rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888', marginBottom: '0.4rem' }}>
        Order Status
      </label>
      <select
        value={status}
        onChange={e => handleChange(e.target.value)}
        disabled={updating}
        style={{
          background: '#111', border: `1px solid ${STATUS_COLORS[status]}`, color: STATUS_COLORS[status],
          fontFamily: 'Space Mono, monospace', fontSize: '0.7rem', letterSpacing: '0.08em', textTransform: 'uppercase',
          padding: '0.6rem 1rem', cursor: updating ? 'not-allowed' : 'pointer', opacity: updating ? 0.6 : 1,
        }}
      >
        {STATUS_OPTIONS.map(s => <option key={s} value={s} style={{ background: '#111', color: '#f5f2ed' }}>{s}</option>)}
      </select>
    </div>
  );
}
