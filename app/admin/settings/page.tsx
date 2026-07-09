import { getStoreSettings } from '@/lib/settings';
import CodToggle from '@/components/admin/CodToggle';
import DelhiverySettings from '@/components/admin/DelhiverySettings';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Settings | ChillOver Admin' };

export default async function AdminSettingsPage() {
  const settings = await getStoreSettings();

  return (
    <div style={{ padding: '2rem', maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <a href="/admin" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888', textDecoration: 'none' }}>← Dashboard</a>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', letterSpacing: '0.05em', textTransform: 'uppercase', lineHeight: 1, marginTop: '0.4rem' }}>
          Store Settings
        </h1>
      </div>

      <div style={{ background: '#1a1a1a', border: '1px solid rgba(245,242,237,0.07)', padding: '1.8rem', marginBottom: '1.5rem' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
          Payment Options
        </h2>
        <p style={{ fontSize: '0.82rem', color: '#888', marginBottom: '1.5rem' }}>
          Control which payment methods customers can use at checkout.
        </p>

        <CodToggle initialEnabled={settings.codEnabled} />
      </div>

      <div style={{ background: '#1a1a1a', border: '1px solid rgba(245,242,237,0.07)', padding: '1.8rem' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
          Shipping — Delhivery
        </h2>
        <p style={{ fontSize: '0.82rem', color: '#888', marginBottom: '1.5rem' }}>
          Connect your Delhivery account to create shipments and track orders directly from the admin panel.
          Get your API token from{' '}
          <a href="https://ucp.delhivery.com" target="_blank" rel="noopener noreferrer" style={{ color: '#ff3c1e' }}>ucp.delhivery.com</a>.
        </p>

        <DelhiverySettings
          initialData={{
            delhiveryEnabled: settings.delhiveryEnabled,
            delhiveryApiKey: settings.delhiveryApiKey ?? '',
            delhiveryClientName: settings.delhiveryClientName ?? '',
            delhiveryPickupName: settings.delhiveryPickupName ?? '',
            delhiveryPickupAddress: settings.delhiveryPickupAddress ?? '',
            delhiveryPickupCity: settings.delhiveryPickupCity ?? '',
            delhiveryPickupPincode: settings.delhiveryPickupPincode ?? '',
            delhiveryPickupPhone: settings.delhiveryPickupPhone ?? '',
          }}
        />
      </div>
    </div>
  );
}
