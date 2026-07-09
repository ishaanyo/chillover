'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  orderId: string;
  waybill: string | null;
  trackingUrl: string | null;
  courierStatus: string | null;
  shippedAt: string | null;
}

export default function ShipmentControl({ orderId, waybill, trackingUrl, courierStatus, shippedAt }: Props) {
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const handleCreateShipment = async () => {
    setCreating(true);
    setError('');

    const res = await fetch(`/api/admin/orders/${orderId}/ship`, { method: 'POST' });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? 'Failed to create shipment.');
    } else {
      router.refresh();
    }
    setCreating(false);
  };

  const handleRefreshTracking = async () => {
    setRefreshing(true);
    setError('');

    const res = await fetch(`/api/admin/orders/${orderId}/track`);
    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? 'Failed to refresh tracking.');
    } else {
      router.refresh();
    }
    setRefreshing(false);
  };

  if (!waybill) {
    return (
      <div>
        <p style={{ fontSize: '0.82rem', color: '#888', marginBottom: '1rem' }}>
          No shipment created yet. Once this order is confirmed, create a shipment to generate a Delhivery waybill and tracking link.
        </p>
        {error && <p style={{ fontSize: '0.75rem', color: '#ff3c1e', marginBottom: '1rem' }}>{error}</p>}
        <button
          onClick={handleCreateShipment}
          disabled={creating}
          style={{ width: '100%', background: creating ? '#555' : '#ff3c1e', color: '#fff', fontFamily: 'Space Mono, monospace', fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase', border: 'none', padding: '0.85rem', cursor: creating ? 'not-allowed' : 'pointer' }}
        >
          {creating ? 'Creating Shipment…' : '📦 Create Shipment (Delhivery)'}
        </button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
        <span style={{ fontSize: '0.78rem', color: '#888' }}>Waybill</span>
        <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.8rem', color: '#f5f2ed' }}>{waybill}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
        <span style={{ fontSize: '0.78rem', color: '#888' }}>Courier Status</span>
        <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.72rem', color: '#4af', textTransform: 'uppercase' }}>{courierStatus ?? 'Manifested'}</span>
      </div>
      {shippedAt && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <span style={{ fontSize: '0.78rem', color: '#888' }}>Shipped On</span>
          <span style={{ fontSize: '0.78rem', color: '#e8e2d9' }}>{new Date(shippedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
        </div>
      )}

      {error && <p style={{ fontSize: '0.75rem', color: '#ff3c1e', marginBottom: '0.8rem' }}>{error}</p>}

      <div style={{ display: 'flex', gap: '0.6rem' }}>
        {trackingUrl && (
          <a
            href={trackingUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ flex: 1, textAlign: 'center', background: 'transparent', border: '1px solid rgba(245,242,237,0.15)', color: '#e8e2d9', fontFamily: 'Space Mono, monospace', fontSize: '0.62rem', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0.7rem', textDecoration: 'none' }}
          >
            Track on Delhivery ↗
          </a>
        )}
        <button
          onClick={handleRefreshTracking}
          disabled={refreshing}
          style={{ flex: 1, background: 'transparent', border: '1px solid rgba(245,242,237,0.15)', color: refreshing ? '#555' : '#e8e2d9', fontFamily: 'Space Mono, monospace', fontSize: '0.62rem', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0.7rem', cursor: refreshing ? 'not-allowed' : 'pointer' }}
        >
          {refreshing ? 'Refreshing…' : '↻ Refresh Status'}
        </button>
      </div>
    </div>
  );
}
