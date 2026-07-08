import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import ProfileForm from '@/components/account/ProfileForm';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'My Profile | ChillOver' };

export default async function MyProfilePage() {
  const session = await auth();
  const user = await prisma.user.findUnique({ where: { id: session!.user.id } });

  return (
    <div>
      <h1 style={{ fontFamily: 'Bebas Neue, serif', fontSize: 'clamp(2rem,4vw,3rem)', letterSpacing: '0.03em', textTransform: 'uppercase', lineHeight: 1, marginBottom: '0.3rem' }}>
        My Profile
      </h1>
      <p style={{ color: '#888', fontSize: '0.875rem', marginBottom: '2rem' }}>Edit your personal information.</p>

      <ProfileForm
        initialData={{
          name: user!.name,
          email: user!.email,
          phone: user!.phone ?? '',
          dob: user!.dob ? user!.dob.toISOString().slice(0, 10) : '',
          gender: user!.gender ?? '',
        }}
      />
    </div>
  );
}
