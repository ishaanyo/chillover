'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface WishlistContextType {
  items: string[];
  toggle: (id: string) => void;
  has: (id: string) => boolean;
  count: number;
}

const WishlistContext = createContext<WishlistContextType>({
  items: [], toggle: () => {}, has: () => false, count: 0,
});

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('chillover-wishlist');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch { /* ignore */ }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem('chillover-wishlist', JSON.stringify(items)); } catch { /* ignore */ }
  }, [items, hydrated]);

  const toggle = (id: string) =>
    setItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);

  return (
    <WishlistContext.Provider value={{ items, toggle, has: id => items.includes(id), count: items.length }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
