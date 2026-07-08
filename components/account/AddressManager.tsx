'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Address {
  id: string;
  label: string;
  name: string;
  phone: string;
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

const emptyForm = { label: 'Home', name: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '', isDefault: false };

const inputStyle = {
  width: '100%', background: '#111', border: '1px solid rgba(245,242,237,0.12)', color: '#f5f2ed',
  fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem', padding: '0.7rem 0.9rem', outline: 'none',
};
const labelStyle = {
  display: 'block', fontFamily: 'Space Mono, monospace', fontSize: '0.58rem',
  letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: '#888', marginBottom: '0.35rem',
};

export default function AddressManager({ initialAddresses }: { initialAddresses: Address[] }) {
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const openNewForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setFormOpen(true);
    setError('');
  };

  const openEditForm = (addr: Address) => {
    setForm({
      label: addr.label, name: addr.name, phone: addr.phone, line1: addr.line1,
      line2: addr.line2 ?? '', city: addr.city, state: addr.state, pincode: addr.pincode, isDefault: addr.isDefault,
    });
    setEditingId(addr.id);
    setFormOpen(true);
    setError('');
  };

  const updateField = (field: keyof typeof form, value: string | boolean) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.line1.trim() || !form.city.trim() || !form.state.trim() || !form.pincode.trim()) {
      setError('Please fill in all required fields.');
      return;
    }
    if (!/^\d{10}$/.test(form.phone.trim())) { setError('Enter a valid 10-digit phone number.'); return; }
    if (!/^\d{6}$/.test(form.pincode.trim())) { setError('Enter a valid 6-digit pincode.'); return; }

    setSaving(true);
    setError('');

    try {
      const res = editingId
        ? await fetch(`/api/addresses/${editingId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
        : await fetch('/api/addresses', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });

      const data = await res.json();
      if (!res.ok) { setError(data.error ?? 'Failed to save address.'); return; }

      if (editingId) {
        setAddresses(prev => prev.map(a => a.id === editingId ? data.address : a).map(a => form.isDefault && a.id !== editingId ? { ...a, isDefault: false } : a));
      } else {
        setAddresses(prev => [data.address, ...(form.isDefault ? prev.map(a => ({ ...a, isDefault: false })) : prev)]);
      }

      setFormOpen(false);
      router.refresh();
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this address?')) return;
    const res = await fetch(`/api/addresses/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setAddresses(prev => prev.filter(a => a.id !== id));
      router.refresh();
    } else {
      alert('Failed to remove address.');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
        {addresses.length === 0 && !formOpen && (
          <div style={{ background: '#1a1a1a', border: '1px solid rgba(245,242,237,0.07)', padding: '3rem', textAlign: 'center', color: '#888' }}>
            No saved addresses yet.
          </div>
        )}

        {addresses.map(addr => (
          <div key={addr.id} style={{ background: '#1a1a1a', border: '1px solid rgba(245,242,237,0.07)', padding: '1.3rem 1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{addr.name}</span>
                <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.55rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#ff3c1e', border: '1px solid #ff3c1e', padding: '0.15rem 0.5rem' }}>{addr.label}</span>
                {addr.isDefault && <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.55rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#1aff9c' }}>Default</span>}
              </div>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#e8e2d9', lineHeight: 1.6 }}>
              {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}<br />
              {addr.city}, {addr.state} {addr.pincode}
            </p>
            <p style={{ fontSize: '0.78rem', color: '#888', marginTop: '0.3rem' }}>Mobile: {addr.phone}</p>

            <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1rem' }}>
              <button onClick={() => openEditForm(addr)} style={{ background: 'transparent', border: '1px solid rgba(245,242,237,0.15)', color: '#e8e2d9', fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0.5rem 1rem', cursor: 'pointer' }}>Edit</button>
              <button onClick={() => handleDelete(addr.id)} style={{ background: 'transparent', border: '1px solid rgba(255,60,30,0.3)', color: '#ff3c1e', fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0.5rem 1rem', cursor: 'pointer' }}>Remove</button>
            </div>
          </div>
        ))}
      </div>

      {formOpen ? (
        <div style={{ background: '#1a1a1a', border: '1px solid rgba(245,242,237,0.07)', padding: '1.5rem' }}>
          <h3 style={{ fontFamily: 'Bebas Neue, serif', fontSize: '1.4rem', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '1.2rem' }}>
            {editingId ? 'Edit Address' : 'Add New Address'}
          </h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Address Type</label>
              <div style={{ display: 'flex', gap: '0.6rem' }}>
                {['Home', 'Work', 'Other'].map(l => (
                  <button type="button" key={l} onClick={() => updateField('label', l)}
                    style={{ padding: '0.5rem 1.1rem', fontFamily: 'Space Mono, monospace', fontSize: '0.62rem', letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', background: form.label === l ? '#ff3c1e' : 'transparent', color: form.label === l ? '#fff' : '#888', border: `1px solid ${form.label === l ? '#ff3c1e' : 'rgba(245,242,237,0.15)'}` }}>
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Full Name *</label>
                <input value={form.name} onChange={e => updateField('name', e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Phone Number *</label>
                <input value={form.phone} onChange={e => updateField('phone', e.target.value)} placeholder="10-digit mobile number" style={inputStyle} />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Address Line 1 *</label>
              <input value={form.line1} onChange={e => updateField('line1', e.target.value)} placeholder="House no., street" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Address Line 2</label>
              <input value={form.line2} onChange={e => updateField('line2', e.target.value)} placeholder="Landmark, area (optional)" style={inputStyle} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>City *</label>
                <input value={form.city} onChange={e => updateField('city', e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>State *</label>
                <input value={form.state} onChange={e => updateField('state', e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Pincode *</label>
                <input value={form.pincode} onChange={e => updateField('pincode', e.target.value)} placeholder="6-digit" style={inputStyle} />
              </div>
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.8rem', color: '#e8e2d9', cursor: 'pointer' }}>
              <input type="checkbox" checked={form.isDefault} onChange={e => updateField('isDefault', e.target.checked)} />
              Set as default address
            </label>

            {error && <div style={{ background: 'rgba(255,60,30,0.1)', border: '1px solid rgba(255,60,30,0.3)', padding: '0.7rem', fontSize: '0.8rem', color: '#ff3c1e' }}>{error}</div>}

            <div style={{ display: 'flex', gap: '0.8rem', marginTop: '0.4rem' }}>
              <button type="submit" disabled={saving} style={{ flex: 1, background: saving ? '#555' : '#ff3c1e', color: '#fff', fontFamily: 'Space Mono, monospace', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', border: 'none', padding: '0.9rem', cursor: saving ? 'not-allowed' : 'pointer' }}>
                {saving ? 'Saving…' : editingId ? 'Save Changes' : 'Add Address'}
              </button>
              <button type="button" onClick={() => setFormOpen(false)} style={{ background: 'transparent', border: '1px solid rgba(245,242,237,0.15)', color: '#888', fontFamily: 'Space Mono, monospace', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '0.9rem 1.5rem', cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button onClick={openNewForm} style={{ width: '100%', background: '#ff3c1e', color: '#fff', fontFamily: 'Space Mono, monospace', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', border: 'none', padding: '1rem', cursor: 'pointer' }}>
          + Add New Address
        </button>
      )}
    </div>
  );
}
