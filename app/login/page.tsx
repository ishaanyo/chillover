'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { loginAction } from '@/lib/actions/auth';
import Link from 'next/link';

export default function LoginPage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') ?? '';

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError('');

    // Call our server action
    const res = await loginAction(formData);
    if (res?.error) {
      setError(res.error);
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ background: '#1a1a1a', padding: '3rem', border: '1px solid rgba(245,242,237,0.07)', width: '100%', maxWidth: '440px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', letterSpacing: '0.05em', textTransform: 'uppercase', lineHeight: 1, marginBottom: '0.5rem', textAlign: 'center' }}>
          Welcome Back
        </h1>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#888', textAlign: 'center', marginBottom: '2.5rem' }}>
          Enter your details to access your account
        </p>

        <form action={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <input type="hidden" name="callbackUrl" value={callbackUrl} />

          <div>
            <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888', marginBottom: '0.4rem' }}>Email</label>
            <input name="email" type="email" required style={{ width: '100%', padding: '0.8rem', background: '#111', border: '1px solid rgba(245,242,237,0.1)', color: '#f5f2ed', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }} />
          </div>

          <div>
            <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888', marginBottom: '0.4rem' }}>Password</label>
            <input name="password" type="password" required style={{ width: '100%', padding: '0.8rem', background: '#111', border: '1px solid rgba(245,242,237,0.1)', color: '#f5f2ed', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }} />
          </div>

          {error && <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#ff3c1e', textAlign: 'center' }}>{error}</p>}

          <button type="submit" disabled={loading} style={{ marginTop: '1rem', background: '#ff3c1e', color: '#fff', border: 'none', padding: '1rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.05em', color: '#888' }}>
          Don't have an account? <Link href="/signup" style={{ color: '#ff3c1e', textDecoration: 'none' }}>Create one</Link>
        </div>
      </div>
    </div>
  );
}
