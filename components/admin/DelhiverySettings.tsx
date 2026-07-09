'use client';
import { useState } from 'react';

interface DelhiveryConfig {
  delhiveryEnabled: boolean;
  delhiveryApiKey: string;
  delhiveryClientName: string;
  delhiveryPickupName: string;
  delhiveryPickupAddress: string;
  delhiveryPickupCity: string;
  delhiveryPickupPincode: string;
  delhiveryPickupPhone: string;
}

const inputStyle = {
  width: '100%', background: '#111', border: '1px solid rgba(245,242,237,0.12)', color: '#f5f2ed',
  fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem', padding: '0.7rem 0.9rem', outline: 'none',
};
const labelStyle = {
  display: 'block', fontFamily: 'Space Mono, monospace', fontSize: '0.58rem',
  letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: '#888', marginBottom: '0.35rem',
};

export default function DelhiverySettings({ initialData }: { initialData: DelhiveryConfig }) {
  const [form, setForm] = useState(initialData);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const updateField = (field: keyof DelhiveryConfig, value: string | boolean) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    const res = await fetch('/api/admin/delhivery', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setMessage({ type: 'success', text: 'Settings saved.' });
    } else {
      const data = await res.json();
      setMessage({ type: 'error', text: data.error ?? 'Failed to save settings.' });
    }
    setSaving(false);
  };

  const handleTest = async () => {
    setTesting(true);
    setMessage(null);
    const res = await fetch('/api/admin/delhivery/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        apiKey: form.delhiveryApiKey,
        clientName: form.delhiveryClientName,
      }),
    });
    const data = await res.json();
    if (data.success) {
      setMessage({ type: 'success', text: '✓ Connection successful! Your API key and client name are valid.' });
    } else {
      setMessage({ type: 'error', text: data.error ?? 'Connection test failed.' });
    }
    setTesting(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
      <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.2rem', background: '#111', border: '1px solid rgba(245,242,237,0.07)', cursor: 'pointer' }}>
        <div>
          <p style={{ fontSize: '0.9rem', fontWeight: 500 }}>Enable Delhivery Shipping</p>
          <p style={{ fontSize: '0.75rem', color: '#888', marginTop: '0.2rem' }}>Allows creating shipments and tracking from order details.</p>
        </div>
        <button
          type="button"
          onClick={() => updateField('delhiveryEnabled', !form.delhiveryEnabled)}
          style={{ width: '52px', height: '28px', borderRadius: '14px', border: 'none', cursor: 'pointer', background: form.delhiveryEnabled ? '#ff3c1e' : '#333', position: 'relative', flexShrink: 0 }}
        >
          <span style={{ position: 'absolute', top: '3px', left: form.delhiveryEnabled ? '27px' : '3px', width: '22px', height: '22px', borderRadius: '50%', background: '#fff', transition: 'left 0.2s' }} />
        </button>
      </label>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label style={labelStyle}>API Token *</label>
          <input type="password" value={form.delhiveryApiKey} onChange={e => updateField('delhiveryApiKey', e.target.value)} placeholder="Your Delhivery API key" style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Client Name *</label>
          <input value={form.delhiveryClientName} onChange={e => updateField('delhiveryClientName', e.target.value)} placeholder="Registered client name" style={inputStyle} />
        </div>
      </div>

      <div>
        <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888', marginBottom: '0.8rem', marginTop: '0.5rem' }}>Pickup Warehouse (registered on Delhivery)</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Warehouse Name *</label>
              <input value={form.delhiveryPickupName} onChange={e => updateField('delhiveryPickupName', e.target.value)} placeholder="Must match Delhivery client warehouse" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Phone *</label>
              <input value={form.delhiveryPickupPhone} onChange={e => updateField('delhiveryPickupPhone', e.target.value)} style={inputStyle} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Address *</label>
            <input value={form.delhiveryPickupAddress} onChange={e => updateField('delhiveryPickupAddress', e.target.value)} style={inputStyle} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>City *</label>
              <input value={form.delhiveryPickupCity} onChange={e => updateField('delhiveryPickupCity', e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Pincode *</label>
              <input value={form.delhiveryPickupPincode} onChange={e => updateField('delhiveryPickupPincode', e.target.value)} style={inputStyle} />
            </div>
          </div>
        </div>
      </div>

      {message && (
        <div style={{ background: message.type === 'success' ? 'rgba(26,255,156,0.1)' : 'rgba(255,60,30,0.1)', border: `1px solid ${message.type === 'success' ? 'rgba(26,255,156,0.3)' : 'rgba(255,60,30,0.3)'}`, padding: '0.7rem', fontSize: '0.8rem', color: message.type === 'success' ? '#1aff9c' : '#ff3c1e' }}>
          {message.text}
        </div>
      )}

      <div style={{ display: 'flex', gap: '0.8rem' }}>
        <button onClick={handleSave} disabled={saving} style={{ flex: 1, background: saving ? '#555' : '#ff3c1e', color: '#fff', fontFamily: 'Space Mono, monospace', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', border: 'none', padding: '0.9rem', cursor: saving ? 'not-allowed' : 'pointer' }}>
          {saving ? 'Saving…' : 'Save Settings'}
        </button>
        <button onClick={handleTest} disabled={testing || !form.delhiveryApiKey || !form.delhiveryClientName} style={{ background: 'transparent', border: '1px solid rgba(245,242,237,0.15)', color: '#e8e2d9', fontFamily: 'Space Mono, monospace', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '0.9rem 1.5rem', cursor: testing ? 'not-allowed' : 'pointer' }}>
          {testing ? 'Testing…' : 'Test Connection'}
        </button>
      </div>
    </div>
  );
}
