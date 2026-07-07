'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Product, ProductImage, ProductVariant, Size } from '@/types';
import ImageUploader from './ImageUploader';

const ALL_SIZES: Size[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];

interface Props {
  initialData?: Partial<Product>;
  productId?: string;
  mode: 'create' | 'edit';
}

const inputStyle = {
  width: '100%', background: '#111', border: '1px solid rgba(245,242,237,0.12)', color: '#f5f2ed',
  fontFamily: 'DM Sans, sans-serif', fontSize: '0.875rem', padding: '0.7rem 1rem', outline: 'none',
  transition: 'border-color 0.2s',
};
const labelStyle = {
  display: 'block', fontFamily: 'Space Mono, monospace', fontSize: '0.6rem',
  letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: '#888', marginBottom: '0.4rem',
};
const sectionStyle = {
  background: '#1a1a1a', border: '1px solid rgba(245,242,237,0.07)', padding: '1.5rem', marginBottom: '1.2rem',
};

export default function ProductForm({ initialData, productId, mode }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [name, setName] = useState(initialData?.name ?? '');
  const [slug, setSlug] = useState(initialData?.slug ?? '');
  const [category, setCategory] = useState(initialData?.category ?? 'men');
  const [subcategoryId, setSubcategoryId] = useState((initialData as any)?.subcategoryId ?? '');
  const [subcategories, setSubcategories] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [price, setPrice] = useState(String(initialData?.price ?? ''));
  const [originalPrice, setOriginalPrice] = useState(String(initialData?.originalPrice ?? ''));
  const [description, setDescription] = useState(initialData?.description ?? '');
  const [shortDesc, setShortDesc] = useState(initialData?.shortDesc ?? '');
  const [fabric, setFabric] = useState(initialData?.fabric ?? '100% Combed Cotton, 240 GSM');
  const [fit, setFit] = useState(initialData?.fit ?? 'Oversized');
  const [badge, setBadge] = useState(initialData?.badge ?? '');
  const [isNew, setIsNew] = useState(initialData?.isNew ?? false);
  const [isFeatured, setIsFeatured] = useState(initialData?.isFeatured ?? false);
  const [isBestseller, setIsBestseller] = useState(initialData?.isBestseller ?? false);
  const [featuresInput, setFeaturesInput] = useState((initialData?.features ?? []).join(', '));
  const [tagsInput, setTagsInput] = useState((initialData?.tags ?? []).join(', '));
  const [images, setImages] = useState<ProductImage[]>(initialData?.images ?? []);
  const [variants, setVariants] = useState<ProductVariant[]>(
    initialData?.variants ?? ALL_SIZES.slice(1, 5).map(size => ({ size, stock: 10 }))
  );

  const updateVariant = (size: Size, stock: number) => {
    setVariants(prev => {
      const existing = prev.find(v => v.size === size);
      if (existing) return prev.map(v => v.size === size ? { ...v, stock } : v);
      return [...prev, { size, stock }];
    });
  };
  const toggleVariant = (size: Size) => {
    setVariants(prev =>
      prev.find(v => v.size === size) ? prev.filter(v => v.size !== size) : [...prev, { size, stock: 10 }]
    );
  };

  // Fetch subcategories whenever the main category changes
  useEffect(() => {
    let cancelled = false;
    fetch(`/api/subcategories?category=${category}`)
      .then(res => res.json())
      .then((data) => {
        if (cancelled) return;
        setSubcategories(data);
        // If the currently selected subcategory doesn't belong to this category anymore, clear it
        if (subcategoryId && !data.find((s: any) => s.id === subcategoryId)) {
          setSubcategoryId('');
        }
      })
      .catch(() => { if (!cancelled) setSubcategories([]); });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price) { setError('Name and price are required.'); return; }
    setSaving(true); setError('');

    const payload = {
      name: name.trim(), slug: slug.trim() || undefined, category, subcategoryId: subcategoryId || null,
      price: Number(price), originalPrice: Number(originalPrice || price),
      description, shortDesc, fabric, fit,
      badge: badge.trim() || undefined,
      isNew, isFeatured, isBestseller,
      features: featuresInput.split(',').map(f => f.trim()).filter(Boolean),
      tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
      images, variants,
    };

    try {
      const res = await fetch(
        mode === 'create' ? '/api/products' : `/api/products/${productId}`,
        { method: mode === 'create' ? 'POST' : 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }
      );
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? 'Failed to save.'); return; }
      router.push('/admin/products');
      router.refresh();
    } catch { setError('Network error. Please try again.'); }
    finally { setSaving(false); }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '1.5rem', alignItems: 'flex-start' }}>

        {/* LEFT COLUMN */}
        <div>
          {/* Basic info */}
          <div style={sectionStyle}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '1.2rem' }}>Basic Information</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Product Name *</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Chaos Theory" style={inputStyle} required />
              </div>
              <div>
                <label style={labelStyle}>URL Slug</label>
                <input value={slug} onChange={e => setSlug(e.target.value)} placeholder="auto-generated from name if left blank" style={inputStyle} />
                <p style={{ fontSize: '0.7rem', color: '#666', marginTop: '0.3rem' }}>
                  URL: root-domain/product/{slug || 'auto-generated-slug'}
                </p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Selling Price (₹) *</label>
                  <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="799" style={inputStyle} required min="0" />
                </div>
                <div>
                  <label style={labelStyle}>Original / MRP (₹)</label>
                  <input type="number" value={originalPrice} onChange={e => setOriginalPrice(e.target.value)} placeholder="1199" style={inputStyle} min="0" />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Short Description</label>
                <input value={shortDesc} onChange={e => setShortDesc(e.target.value)} placeholder="One-line description shown on cards" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Full Description</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Detailed product description…" rows={5} style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }} />
              </div>
            </div>
          </div>

          {/* Images */}
          <div style={sectionStyle}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '1.2rem' }}>Product Images</h3>
            <ImageUploader images={images} onChange={setImages} />
          </div>

          {/* Variants */}
          <div style={sectionStyle}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>Sizes & Stock</h3>
            <p style={{ fontSize: '0.75rem', color: '#888', marginBottom: '1.2rem' }}>Toggle sizes on/off and set stock quantity for each.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {ALL_SIZES.map(size => {
                const v = variants.find(v => v.size === size);
                const active = Boolean(v);
                return (
                  <div key={size} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.6rem 0.8rem', background: active ? 'rgba(255,60,30,0.05)' : '#111', border: `1px solid ${active ? 'rgba(255,60,30,0.25)' : 'rgba(245,242,237,0.07)'}`, transition: 'all 0.2s' }}>
                    <input type="checkbox" checked={active} onChange={() => toggleVariant(size)} id={`sz-${size}`} style={{ accentColor: '#ff3c1e', width: '16px', height: '16px', cursor: 'pointer' }} />
                    <label htmlFor={`sz-${size}`} style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.75rem', letterSpacing: '0.1em', color: active ? '#f5f2ed' : '#888', cursor: 'pointer', width: '36px', fontWeight: active ? 700 : 400 }}>{size}</label>
                    {active && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: 'auto' }}>
                        <label style={{ ...labelStyle, margin: 0 }}>Stock:</label>
                        <input type="number" value={v?.stock ?? 0} onChange={e => updateVariant(size, Number(e.target.value))} min="0" style={{ ...inputStyle, width: '80px', padding: '0.4rem 0.6rem', fontSize: '0.8rem' }} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Features & Tags */}
          <div style={sectionStyle}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '1.2rem' }}>Features & Tags</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Features (comma-separated)</label>
                <input value={featuresInput} onChange={e => setFeaturesInput(e.target.value)} placeholder="240 GSM Cotton, Screenprint, Drop Shoulder" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Tags (comma-separated)</label>
                <input value={tagsInput} onChange={e => setTagsInput(e.target.value)} placeholder="graphic, oversized, street" style={inputStyle} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Fabric</label>
                  <input value={fabric} onChange={e => setFabric(e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Fit Type</label>
                  <input value={fit} onChange={e => setFit(e.target.value)} placeholder="Oversized / Boxy" style={inputStyle} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN — sticky sidebar */}
        <div style={{ position: 'sticky', top: '5.5rem' }}>
          {/* Category & Status */}
          <div style={sectionStyle}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '1.2rem' }}>Organisation</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Category *</label>
                <select value={category} onChange={e => setCategory(e.target.value as any)} style={{ ...inputStyle, cursor: 'pointer' }}>
                  <option value="men">Men</option>
                  <option value="women">Women</option>
                  <option value="unisex">Unisex</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Subcategory</label>
                <select value={subcategoryId} onChange={e => setSubcategoryId(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                  <option value="">— None —</option>
                  {subcategories.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
                {subcategories.length === 0 && (
                  <p style={{ fontSize: '0.7rem', color: '#666', marginTop: '0.3rem' }}>
                    No subcategories for {category} yet.{' '}
                    <a href="/admin/subcategories" style={{ color: '#ff3c1e' }}>Create one →</a>
                  </p>
                )}
              </div>
              <div>
                <label style={labelStyle}>Badge Label</label>
                <input value={badge} onChange={e => setBadge(e.target.value)} placeholder="e.g. Bestseller, Limited, Hot" style={inputStyle} />
                <p style={{ fontSize: '0.65rem', color: '#666', marginTop: '0.3rem' }}>Leave blank for no badge.</p>
              </div>
            </div>
          </div>

          {/* Flags */}
          <div style={sectionStyle}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '1rem' }}>Flags</h3>
            {[['isNew', 'New Arrival', isNew, setIsNew], ['isFeatured', 'Featured (shows on homepage)', isFeatured, setIsFeatured], ['isBestseller', 'Bestseller', isBestseller, setIsBestseller]].map(([key, label, val, setter]: any) => (
              <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.6rem 0', cursor: 'pointer', borderBottom: '1px solid rgba(245,242,237,0.05)' }}>
                <input type="checkbox" checked={val} onChange={e => setter(e.target.checked)} style={{ accentColor: '#ff3c1e', width: '16px', height: '16px' }} />
                <span style={{ fontSize: '0.85rem', color: val ? '#f5f2ed' : '#888' }}>{label}</span>
              </label>
            ))}
          </div>

          {/* Summary */}
          {price && (
            <div style={sectionStyle}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '1rem' }}>Preview</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem', color: '#888' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Selling Price</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: '#f5f2ed' }}>₹{price}</span>
                </div>
                {originalPrice && Number(originalPrice) > Number(price) && (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>MRP</span>
                      <span style={{ textDecoration: 'line-through' }}>₹{originalPrice}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Discount</span>
                      <span style={{ color: '#1aff9c' }}>{Math.round((1 - Number(price) / Number(originalPrice)) * 100)}% OFF</span>
                    </div>
                  </>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Images</span>
                  <span style={{ color: images.length > 0 ? '#1aff9c' : '#ff8c00' }}>{images.length} uploaded</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Sizes</span>
                  <span>{variants.length} active</span>
                </div>
              </div>
            </div>
          )}

          {/* Error */}
          {error && <div style={{ background: 'rgba(255,60,30,0.1)', border: '1px solid rgba(255,60,30,0.3)', padding: '0.8rem', marginBottom: '1rem', fontSize: '0.8rem', color: '#ff3c1e' }}>{error}</div>}

          {/* Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <button type="submit" disabled={saving} style={{ width: '100%', background: saving ? '#555' : '#ff3c1e', color: '#fff', fontFamily: 'Space Mono, monospace', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', border: 'none', padding: '1rem', cursor: saving ? 'not-allowed' : 'pointer', transition: 'background 0.2s' }}>
              {saving ? 'Saving…' : mode === 'create' ? 'Create Product' : 'Save Changes'}
            </button>
            <button type="button" onClick={() => router.push('/admin/products')} style={{ width: '100%', background: 'transparent', color: '#888', fontFamily: 'Space Mono, monospace', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', border: '1px solid rgba(245,242,237,0.12)', padding: '0.8rem', cursor: 'pointer' }}>
              Cancel
            </button>
          </div>
        </div>
      </div>

      <style>{`
        input:focus, textarea:focus, select:focus { border-color: rgba(255,60,30,0.5) !important; }
        @media (max-width: 900px) {
          div[style*="grid-template-columns: 1fr 380px"] { grid-template-columns: 1fr !important; }
          div[style*="position: sticky"] { position: static !important; }
        }
      `}</style>
    </form>
  );
}
