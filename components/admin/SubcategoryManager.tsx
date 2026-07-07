'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Subcategory {
  id: string;
  name: string;
  slug: string;
  mainCategory: string;
  createdAt: string;
}

const inputStyle = {
  width: '100%', background: '#111', border: '1px solid rgba(245,242,237,0.12)', color: '#f5f2ed',
  fontFamily: 'DM Sans, sans-serif', fontSize: '0.875rem', padding: '0.7rem 1rem', outline: 'none',
};
const labelStyle = {
  display: 'block', fontFamily: 'Space Mono, monospace', fontSize: '0.6rem',
  letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: '#888', marginBottom: '0.4rem',
};
const sectionStyle = {
  background: '#1a1a1a', border: '1px solid rgba(245,242,237,0.07)', padding: '1.5rem', marginBottom: '1.5rem',
};

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

export default function SubcategoryManager({ initialSubcategories }: { initialSubcategories: Subcategory[] }) {
  const router = useRouter();
  const [subcategories, setSubcategories] = useState<Subcategory[]>(initialSubcategories);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [slugEdited, setSlugEdited] = useState(false);
  const [mainCategory, setMainCategory] = useState<'men' | 'women'>('men');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleNameChange = (val: string) => {
    setName(val);
    if (!slugEdited) setSlug(slugify(val));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError('Name is required.'); return; }
    setSaving(true); setError('');

    try {
      const res = await fetch('/api/subcategories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), slug: slug.trim() || slugify(name), mainCategory }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? 'Failed to create.'); return; }

      setSubcategories(prev => [data, ...prev]);
      setName(''); setSlug(''); setSlugEdited(false);
      router.refresh();
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this subcategory? Products in it will keep their main category but lose this subcategory link.')) return;

    const res = await fetch(`/api/subcategories/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setSubcategories(prev => prev.filter(s => s.id !== id));
      router.refresh();
    } else {
      alert('Failed to delete subcategory.');
    }
  };

  const menSubs = subcategories.filter(s => s.mainCategory === 'men');
  const womenSubs = subcategories.filter(s => s.mainCategory === 'women');

  return (
    <div>
      {/* Create form */}
      <div style={sectionStyle}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '1.2rem' }}>
          Add Subcategory
        </h3>
        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Subcategory Name *</label>
              <input value={name} onChange={e => handleNameChange(e.target.value)} placeholder="e.g. Oversized Tees" style={inputStyle} required />
            </div>
            <div>
              <label style={labelStyle}>Main Category *</label>
              <select value={mainCategory} onChange={e => setMainCategory(e.target.value as 'men' | 'women')} style={{ ...inputStyle, cursor: 'pointer' }}>
                <option value="men">Men</option>
                <option value="women">Women</option>
              </select>
            </div>
          </div>
          <div>
            <label style={labelStyle}>URL Slug</label>
            <input
              value={slug}
              onChange={e => { setSlug(e.target.value); setSlugEdited(true); }}
              placeholder="oversized-tees"
              style={inputStyle}
            />
            <p style={{ fontSize: '0.7rem', color: '#666', marginTop: '0.3rem' }}>
              URL: root-domain/{slug || 'your-slug'}
            </p>
          </div>

          {error && <div style={{ background: 'rgba(255,60,30,0.1)', border: '1px solid rgba(255,60,30,0.3)', padding: '0.7rem', fontSize: '0.8rem', color: '#ff3c1e' }}>{error}</div>}

          <button type="submit" disabled={saving} style={{ background: saving ? '#555' : '#ff3c1e', color: '#fff', fontFamily: 'Space Mono, monospace', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', border: 'none', padding: '0.9rem', cursor: saving ? 'not-allowed' : 'pointer' }}>
            {saving ? 'Adding…' : '+ Add Subcategory'}
          </button>
        </form>
      </div>

      {/* Lists */}
      {([['Men', menSubs], ['Women', womenSubs]] as const).map(([label, list]) => (
        <div key={label} style={sectionStyle}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '1rem' }}>
            {label} Subcategories ({list.length})
          </h3>
          {list.length === 0 ? (
            <p style={{ color: '#666', fontSize: '0.85rem' }}>No subcategories yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {list.map(s => (
                <div key={s.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.8rem 1rem', background: '#111', border: '1px solid rgba(245,242,237,0.07)' }}>
                  <div>
                    <div style={{ fontSize: '0.9rem', color: '#f5f2ed', fontWeight: 500 }}>{s.name}</div>
                    <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.68rem', color: '#888', marginTop: '0.2rem' }}>/{s.slug}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <a href={`/${s.slug}`} target="_blank" style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888', textDecoration: 'none' }}>View ↗</a>
                    <button onClick={() => handleDelete(s.id)} style={{ background: 'transparent', border: 'none', color: '#ff3c1e', fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer' }}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
