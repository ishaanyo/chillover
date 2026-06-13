'use client';
import { useRouter, usePathname } from 'next/navigation';

interface Props {
  currentFilter?: string;
  currentSort?: string;
  category: string;
}

export default function CategoryFilters({ currentFilter, currentSort, category }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  function applyParam(key: string, value: string) {
    const params = new URLSearchParams();
    if (key !== 'filter' && currentFilter) params.set('filter', currentFilter);
    if (key !== 'sort'   && currentSort)   params.set('sort', currentSort);
    if (value && value !== 'all' && value !== 'default') params.set(key, value);
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  const filters: [string, string][] = [['all','All'],['new','New In'],['bestseller','Bestseller'],['sale','Sale']];

  return (
    <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
        {filters.map(([val, label]) => {
          const active = val === 'all' ? !currentFilter : currentFilter === val;
          return (
            <button
              key={val}
              onClick={() => applyParam('filter', val)}
              style={{
                fontFamily: 'Space Mono, monospace', fontSize: '0.6rem',
                letterSpacing: '0.1em', textTransform: 'uppercase',
                padding: '0.35rem 0.9rem', cursor: 'pointer',
                background: active ? '#ff3c1e' : 'transparent',
                color: active ? '#fff' : '#888',
                border: `1px solid ${active ? '#ff3c1e' : 'rgba(245,242,237,0.15)'}`,
                transition: 'all 0.2s',
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Sort dropdown */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.58rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#666' }}>Sort:</span>
        <select
          value={currentSort || 'default'}
          onChange={e => applyParam('sort', e.target.value)}
          style={{ background: '#1a1a1a', border: '1px solid rgba(245,242,237,0.15)', color: '#e8e2d9', fontFamily: 'Space Mono, monospace', fontSize: '0.58rem', letterSpacing: '0.06em', padding: '0.35rem 0.7rem', cursor: 'pointer', outline: 'none' }}
        >
          <option value="default">Featured</option>
          <option value="newest">Newest</option>
          <option value="price-asc">Price: Low → High</option>
          <option value="price-desc">Price: High → Low</option>
        </select>
      </div>
    </div>
  );
}
