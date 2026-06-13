'use client';
import { useState, useRef, useCallback } from 'react';
import { ProductImage } from '@/types';

interface Props {
  images: ProductImage[];
  onChange: (images: ProductImage[]) => void;
}

export default function ImageUploader({ images, onChange }: Props) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const uploadFiles = async (files: FileList | File[]) => {
    setUploading(true);
    try {
      const formData = new FormData();
      Array.from(files).forEach(f => formData.append('files', f));
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.images) {
        const newImages = data.images.map((img: ProductImage, i: number) => ({
          ...img, order: images.length + i,
        }));
        onChange([...images, ...newImages]);
      }
    } catch (e) {
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files.length) uploadFiles(e.dataTransfer.files);
  }, [images]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) uploadFiles(e.target.files);
    e.target.value = '';
  };

  const removeImage = (id: string) => {
    onChange(images.filter(img => img.id !== id).map((img, i) => ({ ...img, order: i })));
  };

  const setMain = (id: string) => {
    const reordered = [
      ...images.filter(img => img.id === id).map(img => ({ ...img, order: 0 })),
      ...images.filter(img => img.id !== id).map((img, i) => ({ ...img, order: i + 1 })),
    ];
    onChange(reordered);
  };

  const moveImage = (from: number, to: number) => {
    const arr = [...images];
    const [item] = arr.splice(from, 1);
    arr.splice(to, 0, item);
    onChange(arr.map((img, i) => ({ ...img, order: i })));
  };

  const sorted = [...images].sort((a, b) => a.order - b.order);

  return (
    <div>
      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
        style={{
          border: `2px dashed ${dragging ? '#ff3c1e' : 'rgba(245,242,237,0.15)'}`,
          background: dragging ? 'rgba(255,60,30,0.04)' : 'transparent',
          borderRadius: 0, padding: '2.5rem', textAlign: 'center', cursor: 'pointer',
          transition: 'border-color 0.2s, background 0.2s',
          marginBottom: '1rem',
        }}>
        <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" multiple style={{ display: 'none' }} onChange={handleFileInput} />
        {uploading ? (
          <div>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem', animation: 'spin 1s linear infinite', display: 'inline-block' }}>⟳</div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888' }}>Uploading…</p>
          </div>
        ) : (
          <>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem', opacity: 0.4 }}>📁</div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888', marginBottom: '0.3rem' }}>
              Drop images here or click to upload
            </p>
            <p style={{ fontSize: '0.72rem', color: '#666' }}>JPG, PNG, WebP · Max 5MB each · Multiple allowed</p>
          </>
        )}
      </div>

      {/* Image gallery grid */}
      {sorted.length > 0 && (
        <div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888', marginBottom: '0.8rem' }}>
            {sorted.length} image{sorted.length !== 1 ? 's' : ''} · Drag to reorder · First image is main
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '0.6rem' }}>
            {sorted.map((img, idx) => (
              <div
                key={img.id}
                draggable
                onDragStart={e => e.dataTransfer.setData('idx', String(idx))}
                onDragOver={e => { e.preventDefault(); setDragOver(idx); }}
                onDragLeave={() => setDragOver(null)}
                onDrop={e => { e.preventDefault(); const from = Number(e.dataTransfer.getData('idx')); moveImage(from, idx); setDragOver(null); }}
                style={{
                  position: 'relative', aspectRatio: '3/4', background: '#111', cursor: 'grab',
                  border: `2px solid ${idx === 0 ? '#ff3c1e' : dragOver === idx ? 'rgba(255,60,30,0.4)' : 'rgba(245,242,237,0.1)'}`,
                  transition: 'border-color 0.2s', overflow: 'hidden',
                }}>
                <img src={img.url} alt={img.alt} style={{ width: '100%', height: '100%', objectFit: 'cover', userSelect: 'none', pointerEvents: 'none' }} />

                {/* Main badge */}
                {idx === 0 && (
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, background: '#ff3c1e', fontFamily: 'var(--font-mono)', fontSize: '0.5rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#fff', textAlign: 'center', padding: '0.15rem' }}>Main</div>
                )}

                {/* Actions overlay */}
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '0.3rem', padding: '0.4rem', opacity: 0, transition: 'opacity 0.2s' }}
                  onMouseOver={e => (e.currentTarget.style.opacity = '1')}
                  onMouseOut={e => (e.currentTarget.style.opacity = '0')}>
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)' }} />
                  {idx !== 0 && (
                    <button onClick={() => setMain(img.id)} title="Set as main" style={{ position: 'relative', zIndex: 1, background: '#1a1a1a', border: 'none', color: '#f5f2ed', cursor: 'pointer', padding: '0.25rem 0.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.5rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>★ Main</button>
                  )}
                  <button onClick={() => removeImage(img.id)} title="Remove" style={{ position: 'relative', zIndex: 1, background: '#ff3c1e', border: 'none', color: '#fff', cursor: 'pointer', padding: '0.25rem 0.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.5rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>✕</button>
                </div>

                {/* Order indicator */}
                <div style={{ position: 'absolute', bottom: '0.3rem', right: '0.3rem', background: 'rgba(0,0,0,0.6)', color: '#888', fontFamily: 'var(--font-mono)', fontSize: '0.5rem', padding: '0.1rem 0.3rem' }}>{idx + 1}</div>
              </div>
            ))}

            {/* Add more tile */}
            <div onClick={() => fileRef.current?.click()} style={{ aspectRatio: '3/4', background: 'transparent', border: '2px dashed rgba(245,242,237,0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'border-color 0.2s' }}
              onMouseOver={e => (e.currentTarget.style.borderColor = 'rgba(255,60,30,0.4)')}
              onMouseOut={e => (e.currentTarget.style.borderColor = 'rgba(245,242,237,0.1)')}>
              <span style={{ fontSize: '1.5rem', opacity: 0.3, marginBottom: '0.3rem' }}>+</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#666' }}>Add</span>
            </div>
          </div>
        </div>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
