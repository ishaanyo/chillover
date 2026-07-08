'use client';
import { useState } from 'react';
import { updateProfileAction } from '@/lib/actions/account';

const inputStyle = {
  width: '100%', background: '#111', border: '1px solid rgba(245,242,237,0.12)', color: '#f5f2ed',
  fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem', padding: '0.7rem 0.9rem', outline: 'none',
};
const disabledInputStyle = { ...inputStyle, color: '#666', cursor: 'not-allowed' };
const labelStyle = {
  display: 'block', fontFamily: 'Space Mono, monospace', fontSize: '0.58rem',
  letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: '#888', marginBottom: '0.35rem',
};

interface ProfileData { name: string; email: string; phone: string; dob: string; gender: string; }

export default function ProfileForm({ initialData }: { initialData: ProfileData }) {
  const [form, setForm] = useState(initialData);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const updateField = (field: keyof ProfileData, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (formData: FormData) => {
    setSaving(true);
    setMessage(null);

    const res = await updateProfileAction(formData);
    if (res.error) {
      setMessage({ type: 'error', text: res.error });
    } else {
      setMessage({ type: 'success', text: 'Profile updated successfully.' });
    }
    setSaving(false);
  };

  return (
    <div style={{ background: '#1a1a1a', border: '1px solid rgba(245,242,237,0.07)', padding: '1.8rem', maxWidth: '600px' }}>
      <form action={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
        <div>
          <label style={labelStyle}>Full Name *</label>
          <input name="name" value={form.name} onChange={e => updateField('name', e.target.value)} style={inputStyle} required />
        </div>

        <div>
          <label style={labelStyle}>Email</label>
          <input value={form.email} disabled style={disabledInputStyle} />
          <p style={{ fontSize: '0.68rem', color: '#666', marginTop: '0.3rem' }}>Email cannot be changed. Contact support if needed.</p>
        </div>

        <div>
          <label style={labelStyle}>Mobile Number</label>
          <input name="phone" value={form.phone} onChange={e => updateField('phone', e.target.value)} placeholder="10-digit mobile number" style={inputStyle} />
        </div>

        <div>
          <label style={labelStyle}>Date of Birth</label>
          <input type="date" name="dob" value={form.dob} onChange={e => updateField('dob', e.target.value)} style={{ ...inputStyle, colorScheme: 'dark' }} />
          <p style={{ fontSize: '0.68rem', color: '#666', marginTop: '0.3rem' }}>Share your DOB to get special gifts on your birthday month.</p>
        </div>

        <div>
          <label style={labelStyle}>Gender</label>
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            {['Male', 'Female', 'Other'].map(g => (
              <button type="button" key={g} onClick={() => updateField('gender', g)}
                style={{ flex: 1, padding: '0.7rem', fontFamily: 'Space Mono, monospace', fontSize: '0.65rem', letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', background: form.gender === g ? '#ff3c1e' : 'transparent', color: form.gender === g ? '#fff' : '#888', border: `1px solid ${form.gender === g ? '#ff3c1e' : 'rgba(245,242,237,0.15)'}` }}>
                {g}
              </button>
            ))}
          </div>
          <input type="hidden" name="gender" value={form.gender} />
        </div>

        {message && (
          <div style={{ background: message.type === 'success' ? 'rgba(26,255,156,0.1)' : 'rgba(255,60,30,0.1)', border: `1px solid ${message.type === 'success' ? 'rgba(26,255,156,0.3)' : 'rgba(255,60,30,0.3)'}`, padding: '0.7rem', fontSize: '0.8rem', color: message.type === 'success' ? '#1aff9c' : '#ff3c1e' }}>
            {message.text}
          </div>
        )}

        <button type="submit" disabled={saving} style={{ background: saving ? '#555' : '#ff3c1e', color: '#fff', fontFamily: 'Space Mono, monospace', fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', border: 'none', padding: '0.9rem', cursor: saving ? 'not-allowed' : 'pointer' }}>
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
