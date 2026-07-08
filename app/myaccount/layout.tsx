import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { logoutAction } from '@/lib/actions/auth';

export default async function MyAccountLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect('/login?callbackUrl=/myaccount');

  const navItems = [
    { label: 'Overview', href: '/myaccount', icon: '⊞' },
    { label: 'My Orders', href: '/myaccount/orders', icon: '📦' },
  ];

  return (
    <div style={{ paddingTop: '5rem', minHeight: '100vh', background: '#0a0a0a' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2.5rem 2rem', display: 'grid', gridTemplateColumns: '250px 1fr', gap: '2rem', alignItems: 'flex-start' }}>

        {/* Sidebar */}
        <div style={{ background: '#1a1a1a', border: '1px solid rgba(245,242,237,0.07)', position: 'sticky', top: '5.5rem' }}>
          <div style={{ padding: '1.2rem 1.3rem', borderBottom: '1px solid rgba(245,242,237,0.07)' }}>
            <p style={{ fontSize: '0.9rem', fontWeight: 500 }}>{session.user.name}</p>
            <p style={{ fontSize: '0.72rem', color: '#888', marginTop: '0.2rem' }}>{session.user.email}</p>
          </div>
          <nav style={{ display: 'flex', flexDirection: 'column' }}>
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', padding: '0.9rem 1.3rem', fontFamily: 'Space Mono, monospace', fontSize: '0.68rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#e8e2d9', textDecoration: 'none', borderBottom: '1px solid rgba(245,242,237,0.05)' }}
              >
                <span>{item.icon}</span> {item.label}
              </Link>
            ))}
            <form action={logoutAction}>
              <button type="submit" style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.7rem', padding: '0.9rem 1.3rem', fontFamily: 'Space Mono, monospace', fontSize: '0.68rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#ff3c1e', background: 'none', border: 'none', cursor: 'pointer' }}>
                <span>⏻</span> Logout
              </button>
            </form>
          </nav>
        </div>

        {/* Content */}
        <div>{children}</div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 250px 1fr"] { grid-template-columns: 1fr !important; }
          div[style*="position: sticky"][style*="top: 5.5rem"] { position: static !important; }
        }
      `}</style>
    </div>
  );
}
