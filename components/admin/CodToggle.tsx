'use client';
import { useState } from 'react';

export default function CodToggle({ initialEnabled }: { initialEnabled: boolean }) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleToggle = async () => {
    const newValue = !enabled;
    setSaving(true);
    setMessage('');

    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ codEnabled: newValue }),
    });

    if (res.ok) {
      setEnabled(newValue);
      setMessage(newValue ? 'Cash on Delivery is now enabled.' : 'Cash on Delivery is now disabled.');
    } else {
      setMessage('Failed to update setting.');
    }
    setSaving(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.2rem', background: '#111', border: '1px solid rgba(245,242,237,0.07)' }}>
        <div>
          <p style={{ fontSize: '0.9rem', fontWeight: 500 }}>Cash on Delivery (COD)</p>
          <p style={{ fontSize: '0.75rem', color: '#888', marginTop: '0.2rem' }}>
            {enabled ? 'Customers can choose to pay on delivery.' : 'Customers must pay online via Razorpay.'}
          </p>
        </div>

        <button
          onClick={handleToggle}
          disabled={saving}
          style={{
            width: '52px', height: '28px', borderRadius: '14px', border: 'none', cursor: saving ? 'not-allowed' : 'pointer',
            background: enabled ? '#ff3c1e' : '#333', position: 'relative', transition: 'background 0.2s', flexShrink: 0, opacity: saving ? 0.6 : 1,
          }}
        >
          <span style={{
            position: 'absolute', top: '3px', left: enabled ? '27px' : '3px',
            width: '22px', height: '22px', borderRadius: '50%', background: '#fff', transition: 'left 0.2s',
          }} />
        </button>
      </div>

      {message && (
        <p style={{ fontSize: '0.78rem', color: enabled ? '#1aff9c' : '#888', marginTop: '0.8rem' }}>{message}</p>
      )}
    </div>
  );
}
