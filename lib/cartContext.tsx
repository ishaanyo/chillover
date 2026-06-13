'use client';
import React, { createContext, useContext, useEffect, useReducer, useState } from 'react';
import { CartItem, Product, Size } from '@/types';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

type CartAction =
  | { type: 'ADD'; product: Product; size: Size; qty: number }
  | { type: 'REMOVE'; productId: string; size: Size }
  | { type: 'UPDATE_QTY'; productId: string; size: Size; qty: number }
  | { type: 'CLEAR' }
  | { type: 'OPEN' }
  | { type: 'CLOSE' }
  | { type: 'TOGGLE' }
  | { type: 'HYDRATE'; items: CartItem[] };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'HYDRATE':
      return { ...state, items: action.items };
    case 'ADD': {
      const key = `${action.product.id}-${action.size}`;
      const exists = state.items.find(i => `${i.product.id}-${i.size}` === key);
      if (exists) {
        return {
          ...state, isOpen: true,
          items: state.items.map(i =>
            `${i.product.id}-${i.size}` === key
              ? { ...i, quantity: i.quantity + action.qty }
              : i
          ),
        };
      }
      return {
        ...state, isOpen: true,
        items: [...state.items, { product: action.product, size: action.size, quantity: action.qty }],
      };
    }
    case 'REMOVE':
      return { ...state, items: state.items.filter(i => !(i.product.id === action.productId && i.size === action.size)) };
    case 'UPDATE_QTY':
      return {
        ...state,
        items: state.items.map(i =>
          i.product.id === action.productId && i.size === action.size
            ? { ...i, quantity: Math.max(1, action.qty) }
            : i
        ),
      };
    case 'CLEAR':   return { ...state, items: [] };
    case 'OPEN':    return { ...state, isOpen: true };
    case 'CLOSE':   return { ...state, isOpen: false };
    case 'TOGGLE':  return { ...state, isOpen: !state.isOpen };
    default:        return state;
  }
}

interface CartContextType {
  state: CartState;
  addItem: (product: Product, size: Size, qty?: number) => void;
  removeItem: (productId: string, size: Size) => void;
  updateQty: (productId: string, size: Size, qty: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], isOpen: false });
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage after mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('chillover-cart');
      if (saved) {
        const items = JSON.parse(saved);
        if (Array.isArray(items)) dispatch({ type: 'HYDRATE', items });
      }
    } catch { /* ignore */ }
    setHydrated(true);
  }, []);

  // Persist to localStorage whenever items change (after hydration)
  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem('chillover-cart', JSON.stringify(state.items)); } catch { /* ignore */ }
  }, [state.items, hydrated]);

  const totalItems = state.items.reduce((s, i) => s + i.quantity, 0);
  const subtotal   = state.items.reduce((s, i) => s + i.product.price * i.quantity, 0);

  const value: CartContextType = {
    state,
    addItem:    (product, size, qty = 1) => dispatch({ type: 'ADD', product, size, qty }),
    removeItem: (productId, size)        => dispatch({ type: 'REMOVE', productId, size }),
    updateQty:  (productId, size, qty)   => dispatch({ type: 'UPDATE_QTY', productId, size, qty }),
    clearCart:  ()                       => dispatch({ type: 'CLEAR' }),
    toggleCart: ()                       => dispatch({ type: 'TOGGLE' }),
    openCart:   ()                       => dispatch({ type: 'OPEN' }),
    closeCart:  ()                       => dispatch({ type: 'CLOSE' }),
    totalItems,
    subtotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
