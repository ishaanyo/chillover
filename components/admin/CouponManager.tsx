'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Coupon {
  id: string;
  code: string;
  type: 'PERCENT' | 'FLAT';
  value: number;
  minOrderValue: number;
  maxDiscount: number | null;
  expiresAt: string | null;
  usageLimit: number | null;
  usedCount: number;
  isActive: boolean;
  createdAt: string;
}

const inputStyle = {
  width: '100%', background: '#111', border: '1px solid rgba(245,242,237,0.12)', color: '#f5f2ed',
  fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem', padding: '0.7rem 0.9rem', outline: 'none',
};
const labelStyle = {
  display: 'block', fontFamily: 'Space Mono, monospace', fontSize: '0.58rem',
  letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: '#888', marginBottom: '0.35rem',
};
const sectionStyle = {
  background: '#1a1a1a', border: '1px solid rgba(245,242,237,0.07)', padding: '1.5rem', marginBottom: '1.5rem',
};

const emptyForm = { code: '', type: 'PERCENT' as 'PERCENT' | 'FLAT', value: '', minOrderValue: '', maxDiscount: '', expiresAt: '', usageLimit: '' };

export default function CouponManager({ initialCoupons }: { initialCoupons: Coupon[] }) {
  const router = useRouter();
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const updateField = (field: keyof typeof form, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code.trim() || !form.value) { setError('Code and value are required.'); return; }

    setSaving(true);
    setError('');

    try {
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: form.code,
          type: form.type,
          value: Number(form.value),
          minOrderValue: form.minOrderValue ? Number(form.minOrderValue) : 0,
          maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : null,
          expiresAt: form.expiresAt || null,
          usageLimit: form.usageLimit ? Number(form.usageLimit) : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? 'Failed to create coupon.'); return; }

      setCoupons(prev => [data.coupon, ...prev]);
      setForm(emptyForm);
      router.refresh();
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (coupon: Coupon) => {
    const res = await fetch(`/api/coupons/${coupon.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !coupon.isActive }),
    });
    if (res.ok) {
      setCoupons(prev => prev.map(c => c.id === coupon.id ? { ...c, isActive: !c.isActive } : c));
      router.refresh();
    } else {
      alert('Failed to update coupon.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this coupon? This cannot be undone.')) return;
    const res = await fetch(`/api/coupons/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setCoupons(prev => prev.filter(c => c.id !== id));
      router.refresh();
    } else {
      alert('Failed to delete coupon.');
    }
  };

  return (
    <div>
      {/* Create form */}
      <div style={sectionStyle}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '1.2rem' }}>
          Create Coupon
        </h3>
        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Code *</label>
              <input value={form.code} onChange={e => updateField('code', e.target.value.toUpperCase())} placeholder="CHILL20" style={inputStyle} required />
            </div>
            <div>
              <label style={labelStyle}>Type *</label>
              <select value={form.type} onChange={e => updateField('type', e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                <option value="PERCENT">Percent Off (%)</option>
                <option value="FLAT">Flat Amount (₹)</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Value * {form.type === 'PERCENT' ? '(%)' : '(₹)'}</label>
              <input type="number" value={form.value} onChange={e => updateField('value', e.target.value)} placeholder={form.type === 'PERCENT' ? '20' : '100'} style={inputStyle} required />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Minimum Order Value (₹)</label>
              <input type="number" value={form.minOrderValue} onChange={e => updateField('minOrderValue', e.target.value)} placeholder="0 (no minimum)" style={inputStyle} />
            </div>
            {form.type === 'PERCENT' && (
              <div>
                <label style={labelStyle}>Max Discount Cap (₹)</label>
                <input type="number" value={form.maxDiscount} onChange={e => updateField('maxDiscount', e.target.value)} placeholder="Optional" style={inputStyle} />
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Expiry Date</label>
              <input type="date" value={form.expiresAt} onChange={e => updateField('expiresAt', e.target.value)} style={{ ...inputStyle, colorScheme: 'dark' }} />
            </div>
            <div>
              <label style={labelStyle}>Usage Limit</label>
              <input type="number" value={form.usageLimit} onChange={e => updateField('usageLimit', e.target.value)} placeholder="Unlimited" style={inputStyle} />
            </div>
          </div>

          {error && <div style={{ background: 'rgba(255,60,30,0.1)', border: '1px solid rgba(255,60,30,0.3)', padding: '0.7rem', fontSize: '0.8rem', color: '#ff3c1e' }}>{error}</div>}

          <button type="submit" disabled={saving} style={{ background: saving ? '#555' : '#ff3c1e', color: '#fff', fontFamily: 'Space Mono, monospace', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', border: 'none', padding: '0.9rem', cursor: saving ? 'not-allowed' : 'pointer' }}>
            {saving ? 'Creating…' : '+ Create Coupon'}
          </button>
        </form>
      </div>

      {/* List */}
      <div style={sectionStyle}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '1rem' }}>
          All Coupons ({coupons.length})
        </h3>
        {coupons.length === 0 ? (
          <p style={{ color: '#666', fontSize: '0.85rem' }}>No coupons created yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {coupons.map(c => {
              const expired = c.expiresAt && new Date(c.expiresAt) < new Date();
              const maxedOut = c.usageLimit !== null && c.usedCount >= c.usageLimit;
              return (
                <div key={c.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: '#111', border: '1px solid rgba(245,242,237,0.07)', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
                      <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.95rem', color: '#f5f2ed', fontWeight: 700 }}>{c.code}</span>
                      <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#ff3c1e' }}>
                        {c.type === 'PERCENT' ? `${c.value}% OFF` : `₹${c.value} OFF`}
                      </span>
                      {!c.isActive && <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.55rem', color: '#666', border: '1px solid #666', padding: '0.1rem 0.4rem' }}>DISABLED</span>}
                      {expired && <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.55rem', color: '#ff8c00', border: '1px solid #ff8c00', padding: '0.1rem 0.4rem' }}>EXPIRED</span>}
                      {maxedOut && <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.55rem', color: '#ff8c00', border: '1px solid #ff8c00', padding: '0.1rem 0.4rem' }}>LIMIT REACHED</span>}
                    </div>
                    <p style={{ fontSize: '0.72rem', color: '#888' }}>
                      {c.minOrderValue > 0 ? `Min ₹${c.minOrderValue} · ` : ''}
                      {c.maxDiscount ? `Max ₹${c.maxDiscount} off · ` : ''}
                      Used {c.usedCount}{c.usageLimit ? `/${c.usageLimit}` : ''} times
                      {c.expiresAt ? ` · Expires ${new Date(c.expiresAt).toLocaleDateString('en-IN')}` : ''}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                    <button onClick={() => toggleActive(c)} style={{ background: 'transparent', border: '1px solid rgba(245,242,237,0.15)', color: '#e8e2d9', fontFamily: 'Space Mono, monospace', fontSize: '0.58rem', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0.5rem 0.9rem', cursor: 'pointer' }}>
                      {c.isActive ? 'Disable' : 'Enable'}
                    </button>
                    <button onClick={() => handleDelete(c.id)} style={{ background: 'transparent', border: '1px solid rgba(255,60,30,0.3)', color: '#ff3c1e', fontFamily: 'Space Mono, monospace', fontSize: '0.58rem', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0.5rem 0.9rem', cursor: 'pointer' }}>
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
