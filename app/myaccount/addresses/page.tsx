import { auth } from '@/auth';
import { getAddressesByUserId } from '@/lib/addresses';
import AddressManager from '@/components/account/AddressManager';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'My Addresses | ChillOver' };

export default async function MyAddressesPage() {
  const session = await auth();
  const addresses = await getAddressesByUserId(session!.user.id);
  const serialized = JSON.parse(JSON.stringify(addresses));

  return (
    <div>
      <h1 style={{ fontFamily: 'Bebas Neue, serif', fontSize: 'clamp(2rem,4vw,3rem)', letterSpacing: '0.03em', textTransform: 'uppercase', lineHeight: 1, marginBottom: '0.3rem' }}>
        My Addresses
      </h1>
      <p style={{ color: '#888', fontSize: '0.875rem', marginBottom: '2rem' }}>Manage your saved delivery addresses.</p>

      <AddressManager initialAddresses={serialized} />
    </div>
  );
}
