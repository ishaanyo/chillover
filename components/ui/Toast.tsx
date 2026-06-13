'use client';
import { createContext, useContext, useState, useCallback, useEffect } from 'react';

interface Toast { id: string; message: string; type: 'success' | 'error' | 'info'; }
interface ToastContextType { showToast: (message: string, type?: Toast['type']) => void; }

const ToastContext = createContext<ToastContextType>({ showToast: () => {} });

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: Toast['type'] = 'success') => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div style={{ position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center', pointerEvents: 'none' }}>
        {toasts.map(toast => (
          <div key={toast.id} style={{
            background: toast.type === 'error' ? '#2a0a0a' : '#1a1a1a',
            border: `1px solid ${toast.type === 'error' ? 'rgba(255,60,30,0.4)' : toast.type === 'success' ? 'rgba(26,255,156,0.3)' : 'rgba(245,242,237,0.15)'}`,
            color: toast.type === 'error' ? '#ff3c1e' : toast.type === 'success' ? '#1aff9c' : '#f5f2ed',
            fontFamily: 'Space Mono, monospace', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase',
            padding: '0.7rem 1.5rem', whiteSpace: 'nowrap',
            animation: 'toastIn 0.3s ease both',
          }}>{toast.message}</div>
        ))}
      </div>
      <style>{`
        @keyframes toastIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
